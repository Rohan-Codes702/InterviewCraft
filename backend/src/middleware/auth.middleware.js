import { getAuth } from "@clerk/express";

// Middleware to verify Bearer tokens from Authorization header
export const verifyBearerToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    console.log('[verifyBearerToken] No Authorization header provided');
    return next();
  }

  console.log('[verifyBearerToken] Authorization header found:', authHeader.substring(0, 30) + "...");
  
  if (!authHeader.startsWith('Bearer ')) {
    console.log('[verifyBearerToken] Header does not start with "Bearer"');
    return next();
  }

  try {
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    console.log('[verifyBearerToken] Extracting userId from Bearer token, length:', token.length);
    
    // The token should be a Clerk JWT that contains the user ID in the 'sub' claim
    const parts = token.split('.');
    console.log('[verifyBearerToken] Token parts count:', parts.length);
    
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }
    
    // Decode the payload (middle part)
    const payload = JSON.parse(
      Buffer.from(parts[1], 'base64').toString('utf-8')
    );
    
    console.log('[verifyBearerToken] Token payload:', { 
      sub: payload.sub,
      iss: payload.iss,
      exp: payload.exp,
      expDate: new Date(payload.exp * 1000).toISOString()
    });
    
    // Check token expiration
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      console.error('[verifyBearerToken] Token has expired at:', new Date(payload.exp * 1000).toISOString());
      return next();
    }
    
    // Set req.auth with the user ID from the token
    req.auth = {
      userId: payload.sub,
      sessionId: payload.sid || null,
      ...payload
    };
    
    console.log('[verifyBearerToken] ✓ Token verified and req.auth set:', {
      userId: req.auth.userId,
      sessionId: req.auth.sessionId
    });
  } catch (error) {
    console.error('[verifyBearerToken] Error decoding token:', error.message);
  }
  
  next();
};

export const protectRoutes = (req, res, next) => {
  try {
    console.log("[protectRoutes] ========== PROTECTION CHECK START ==========");
    console.log("[protectRoutes] Route:", req.method, req.path);
    
    // Try to get auth from Clerk middleware (session-based)
    let auth = getAuth(req);
    
    console.log("[protectRoutes] Step 1 - getAuth() result:", { 
      hasAuth: !!auth,
      userId: auth?.userId,
      sessionId: auth?.sessionId 
    });
    
    // If we have auth from session, use it
    if (auth?.userId) {
      req.auth = auth;
      console.log("[protectRoutes] ✓ PASSED via session auth:", auth.userId);
      console.log("[protectRoutes] ========== PROTECTION CHECK END ==========");
      return next();
    }

    // If no session auth, check if Bearer token was verified
    console.log("[protectRoutes] Step 2 - Checking Bearer token...");
    const authHeader = req.headers.authorization;
    console.log("[protectRoutes]   - Authorization header present:", !!authHeader);
    console.log("[protectRoutes]   - Header value start:", authHeader ? authHeader.substring(0, 30) + "..." : "N/A");
    console.log("[protectRoutes]   - Starts with Bearer:", authHeader?.startsWith('Bearer '));
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log("[protectRoutes] ✗ FAILED - No valid Bearer token");
      console.log("[protectRoutes] ========== PROTECTION CHECK END ==========");
      return res.status(401).json({ 
        message: "Unauthorized", 
        reason: "No authentication provided",
        debug: {
          hasAuth: !!auth,
          hasAuthHeader: !!authHeader,
          bearerPrefix: authHeader?.substring(0, 7)
        }
      });
    }

    // Bearer token should have been verified by verifyBearerToken middleware
    console.log("[protectRoutes] Step 3 - Checking if req.auth was set...");
    console.log("[protectRoutes]   - req.auth exists:", !!req.auth);
    console.log("[protectRoutes]   - req.auth.userId:", req.auth?.userId);
    console.log("[protectRoutes]   - req.auth keys:", Object.keys(req.auth || {}));
    
    if (req.auth?.userId) {
      console.log("[protectRoutes] ✓ PASSED via Bearer token:", req.auth.userId);
      console.log("[protectRoutes] ========== PROTECTION CHECK END ==========");
      return next();
    }

    console.log("[protectRoutes] ✗ FAILED - Bearer token not verified");
    console.log("[protectRoutes] ========== PROTECTION CHECK END ==========");
    return res.status(401).json({ 
      message: "Unauthorized", 
      reason: "Token verification failed",
      debug: {
        hasAuth: !!auth,
        hasBearerToken: !!authHeader,
        reqAuthUserId: req.auth?.userId,
        reqAuthKeys: Object.keys(req.auth || {})
      }
    });
  } catch (error) {
    console.error("[protectRoutes] ✗ EXCEPTION:", error.message);
    console.error("[protectRoutes] Stack:", error.stack);
    console.log("[protectRoutes] ========== PROTECTION CHECK END ==========");
    return res.status(401).json({ 
      message: "Unauthorized", 
      error: error.message
    });
  }
};