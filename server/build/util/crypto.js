import { createHash, randomBytes } from "node:crypto";
export const digest = (text) => createHash("sha256").update(text).digest("hex");
export const randomToken = () => randomBytes(32).toString("base64url");
//# sourceMappingURL=crypto.js.map