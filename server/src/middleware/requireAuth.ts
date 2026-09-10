import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import { isAuthTokenPayload } from "../types/auth.js";

export default function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization;
  // console.log("Raw auth header:", JSON.stringify(header));

  if (!header || !header.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Missing or malformed authorization header" });
  }

  const token = header.split(" ")[1];

  // console.log(`Token: logged after split ${token}`);
  // console.log("Token segments:", token?.split(".").length);
  // console.log("Token length:", token?.length);
  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    if (!isAuthTokenPayload(payload)) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    req.userId = payload.userId;
    next();
  } catch (error) {
    // console.error("JWT verify failed:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
