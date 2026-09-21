import {} from "jsonwebtoken";
export function isAuthTokenPayload(payload) {
    return (typeof payload === "object" &&
        payload !== null &&
        "userId" in payload &&
        typeof payload.userId === "string");
}
//# sourceMappingURL=auth.js.map