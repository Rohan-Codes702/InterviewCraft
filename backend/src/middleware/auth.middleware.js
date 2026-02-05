import { getAuth } from "@clerk/express";

export const protectRoute = (req, res, next) => {
  try {
    console.log("Auth header received:", req.headers.authorization ? "present" : "missing");
    const { userId } = getAuth(req);
    console.log("Extracted userId:", userId);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized - you must be logged in" });
    }

    req.userId = userId;
    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(500).json({ message: "Authentication failed" });
  }
};
