import type { PreferenceNotMatched } from "../types/index.js";
export declare function sendNoMatchNotification(email: string, noMatch: PreferenceNotMatched): Promise<{
    success: boolean;
    reason?: string;
    error?: unknown;
    providerId?: string;
}>;
//# sourceMappingURL=no-match.service.d.ts.map