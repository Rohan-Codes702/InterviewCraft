export const getStreamToken = async (req, res) => {
  try {
    const user = req.auth.userId;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = generateStreamToken(user);
    return res.status(200).json({ token });
  } catch (error) {
    console.error("Error in getStreamToken:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
