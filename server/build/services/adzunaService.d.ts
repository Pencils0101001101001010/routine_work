import type { AdzunaJob } from "../types/index.js";
export declare function searchJobs(title: string, location: string): Promise<AdzunaJob[]>;
export declare function searchJobsWithRetry(title: string, location: string, retries?: number): Promise<AdzunaJob[]>;
//# sourceMappingURL=adzunaService.d.ts.map