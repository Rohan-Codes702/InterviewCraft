export const protectRoutes = (req, res, next) => {
  try {
    if (!req.auth?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
