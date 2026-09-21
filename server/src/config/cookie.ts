import type { CookieOptions } from "express";

export const COOKIE_NAME = "token";

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // HTTPS only in prod
  sameSite: "lax",
  path: "/",
  maxAge: 24 * 60 * 60 * 1000, // 1 day in ms, matches your JWT's expiresIn
};
