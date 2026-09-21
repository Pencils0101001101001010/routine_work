import { type JwtPayload } from "jsonwebtoken";
export interface AuthTokenPayload extends JwtPayload {
    userId: string;
}
export declare function isAuthTokenPayload(payload: string | JwtPayload): payload is AuthTokenPayload;
//# sourceMappingURL=auth.d.ts.map