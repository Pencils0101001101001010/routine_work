// this is where we make use of adzuna job search api
import type { AdzunaJob } from "../types/index.js";

export async function searchJobs(
  title: string,
  location: string,
): Promise<AdzunaJob[]> {
  const url = new URL(`${process.env.ADZUNA_BASE_URL}`);
  url.searchParams.set("app_id", process.env.APP_ID!);
  url.searchParams.set("app_key", process.env.APP_KEY!);
  url.searchParams.set("what", title);
  url.searchParams.set("where", location);

  console.log(`_____________Adzuna url ${url}________________\n`);

  const res = await fetch(url.toString());

  if (!res.ok) throw new Error(`Adzuna request fail: ${res.status}`);

  const data = await res.json();
  return data.results as AdzunaJob[];
}
