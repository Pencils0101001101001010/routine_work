import type { JobMatch } from "../types/index.js";
export declare function sendMatchNotification(email: string, match: JobMatch): Promise<{
    success: boolean;
    reason?: string;
    error?: unknown;
    details?: unknown;
    providerId?: string;
}>;
//# sourceMappingURL=emailServices.d.ts.map