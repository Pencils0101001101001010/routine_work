import type { AdzunaJob } from "../types/index.js";
export declare function searchJobs(title: string, location: string, distance: number): Promise<AdzunaJob[]>;
export declare function searchJobsWithRetry(title: string, location: string, distance: number, retries?: number): Promise<AdzunaJob[]>;
//# sourceMappingURL=adzunaService.d.ts.map