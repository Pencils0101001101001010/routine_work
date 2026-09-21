export function requireEnv(key) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}
export const JWT_SECRET = requireEnv("JWT_SECRET");
//# sourceMappingURL=env.js.map