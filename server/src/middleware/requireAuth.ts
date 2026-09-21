import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import { COOKIE_NAME } from "../config/cookie.js";
import { isAuthTokenPayload } from "../types/auth.js";

export default function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies?.[COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    if (!isAuthTokenPayload(payload)) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    req.userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
