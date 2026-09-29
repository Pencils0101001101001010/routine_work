// this is where we make use of adzuna job search api
import type { AdzunaJob } from "../types/index.js";

export async function searchJobs(
  title: string,
  location: string,
  distance: number,
): Promise<AdzunaJob[]> {
  const appId = process.env.APP_ID || "----------noAppId------";
  const appKey = process.env.APP_KEY || "----------noAppKey--------";
  const url = new URL(`${process.env.ADZUNA_BASE_URL}`);
  url.searchParams.set("app_id", appId);
  url.searchParams.set("app_key", appKey);
  url.searchParams.set("what", title);
  url.searchParams.set("where", location);
  url.searchParams.set("distance", String(distance));

  console.log(url.toString());
  // this is what the url will look like
  //   https://api.adzuna.com/v1/api/jobs/za/search/1?app_id=*******&app_key=********&what=Art+Teacher&where=Brackenfell%2C+Protea+Hights

  //^This is what I am aiming for to alow users to search more than on title and set distance where the center is the postal code they set
  //https://api.adzuna.com/v1/api/jobs/za/search/1?app_id=d6df9319&app_key=0da848e3c80b69471cda603776a1b32a&what=full%20stack%20developer&what_and=nodejs%20developer&where=8001&distance=100

  const res = await fetch(url.toString());

  if (!res.ok) {
    throw new Error(`Adzuna request fail: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  return data.results as AdzunaJob[];
}

// Retry error 503
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function searchJobsWithRetry(
  title: string,
  location: string,
  distance: number,
  retries = 2,
): Promise<AdzunaJob[]> {
  try {
    return await searchJobs(title, location, distance);
  } catch (err) {
    if (retries > 0) {
      await sleep(1000);
      return searchJobsWithRetry(title, location, distance, retries - 1);
    }
    throw err;
  }
}
