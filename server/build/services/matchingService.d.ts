import type { AdzunaJob, JobMatch, PreferenceNotMatched } from "../types/index.js";
export declare function findNewMatches(preferenceId: string, userId: string, jobs: AdzunaJob[]): Promise<JobMatch[]>;
export declare function noMatchesFound(preferenceId: string, jobs: AdzunaJob[], newMatches: JobMatch[]): Promise<PreferenceNotMatched[]>;
//# sourceMappingURL=matchingService.d.ts.map