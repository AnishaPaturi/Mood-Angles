// backend/middleware/auth.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export default function auth(req, res, next) {
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // If you want to allow anonymous saves, call next() instead of returning 401
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Attach user payload to req.user (adjust fields to match your token)
    req.user = { id: decoded.id, email: decoded.email };
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token", details: String(err) });
  }
}
