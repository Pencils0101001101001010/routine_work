export async function searchJobs(title, location) {
    const appId = process.env.APP_ID || "----------noAppId------";
    const appKey = process.env.APP_KEY || "----------noAppKey--------";
    const url = new URL(`${process.env.ADZUNA_BASE_URL}`);
    url.searchParams.set("app_id", appId);
    url.searchParams.set("app_key", appKey);
    url.searchParams.set("what", title);
    url.searchParams.set("where", location);
    const res = await fetch(url.toString());
    if (!res.ok) {
        throw new Error(`Adzuna request fail: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return data.results;
}
// Retry error 503
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export async function searchJobsWithRetry(title, location, retries = 2) {
    try {
        return await searchJobs(title, location);
    }
    catch (err) {
        if (retries > 0) {
            await sleep(1000);
            return searchJobsWithRetry(title, location, retries - 1);
        }
        throw err;
    }
}
//# sourceMappingURL=adzunaService.js.map