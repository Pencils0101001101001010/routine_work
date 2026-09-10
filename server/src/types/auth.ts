import { type JwtPayload } from "jsonwebtoken";

export interface AuthTokenPayload extends JwtPayload {
  userId: string;
}

export function isAuthTokenPayload(
  payload: string | JwtPayload,
): payload is AuthTokenPayload {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "userId" in payload &&
    typeof (payload as any).userId === "string"
  );
}
