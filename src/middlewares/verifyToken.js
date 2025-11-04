import jwt from "jsonwebtoken";

export const JWT_SECRET = process.env.JWT_SECRET || "secret";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.aurhorization;
  if (!authHeader) return res.status(401).json({ error: "Token required" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Bisa digunakan nanti (misalnya user id)
    next();
  } catch (error) {
    res.status(401).json({ message: "Token tidak valid" });
  }
};
