import { getAuth } from "@clerk/express";

export const protectRoutes = (req, res, next) => {
  try {
    const auth = getAuth(req);
    
    // Log all available auth data
    console.log("[protectRoutes] Full auth object keys:", Object.keys(auth || {}));
    console.log("[protectRoutes] Auth userId:", auth?.userId);
    console.log("[protectRoutes] Auth sessionId:", auth?.sessionId);
    
    // Check if Clerk verified it automatically
    if (auth?.userId) {
      req.auth = auth;
      console.log("[protectRoutes] ✓ User authenticated:", auth.userId);
      return next();
    }

    // If no userId, check what info we do have
    const authHeader = req.headers.authorization;
    console.log("[protectRoutes] ✗ No userId found");
    console.log("[protectRoutes] Authorization header present:", !!authHeader);
    console.log("[protectRoutes] Auth object exists:", !!auth);
    
    return res.status(401).json({ 
      message: "Unauthorized", 
      reason: "No active session",
      debug: {
        hasAuth: !!auth,
        hasAuthHeader: !!authHeader,
        authKeys: Object.keys(auth || {})
      }
    });
  } catch (error) {
    console.error("[protectRoutes] Error in middleware:", error.message);
    return res.status(401).json({ 
      message: "Unauthorized", 
      error: error.message
    });
  }
};