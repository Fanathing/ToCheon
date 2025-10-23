import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwt.js";

export function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "인증 토큰이 없습니다." });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "유효하지 않은 토큰입니다." });
  }
}
