import "express";
import { AuthTokenPayload } from "./auth.js";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}
