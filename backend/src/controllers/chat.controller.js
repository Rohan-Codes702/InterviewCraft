import { generateStreamToken } from '../config/stream.js';
import { getAuth } from '@clerk/express';

export const getStreamToken = async (req, res) => {
  try {
    console.log("[getStreamToken] Starting token generation...");
    
    // Get auth from Clerk middleware
    const auth = getAuth(req);
    console.log("[getStreamToken] Auth from getAuth():", { userId: auth?.userId, hasAuth: !!auth });
    
    // Fallback to req.auth set by middleware
    const user = auth?.userId || req.auth?.userId;
    console.log("[getStreamToken] User ID:", user);
    
    if (!user) {
      console.log("[getStreamToken] No user found - returning 401");
      return res.status(401).json({ message: "Unauthorized", debug: { auth: !!auth, reqAuth: !!req.auth } });
    }

    const token = generateStreamToken(user);
    console.log("[getStreamToken] Stream token generated:", !!token);
    
    if (!token) {
      return res.status(500).json({ message: "Failed to generate token" });
    }
    return res.status(200).json({ token });
  } catch (error) {
    console.error("[getStreamToken] Error:", error.message);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
