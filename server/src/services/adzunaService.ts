// this is where we make use of adzuna job search api
import type { AdzunaJob } from "../types/index.js";

export async function searchJobs(
  title: string,
  location: string,
): Promise<AdzunaJob[]> {
  const appId = process.env.APP_ID || "----------noAppId------";
  const appKey = process.env.APP_KEY || "----------noAppKey--------";
  const url = new URL(`${process.env.ADZUNA_BASE_URL}`);
  url.searchParams.set("app_id", appId);
  url.searchParams.set("app_key", appKey);
  url.searchParams.set("what", title);
  url.searchParams.set("where", location);

  //   console.log(url.toString());
  // this is what the url will look like
  //   https://api.adzuna.com/v1/api/jobs/za/search/1?app_id=*******&app_key=********&what=Art+Teacher&where=Brackenfell%2C+Protea+Hights

  const res = await fetch(url.toString());

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Adzuna request fail: ${res.status} — ${body}`);
  }
  const data = await res.json();
  return data.results as AdzunaJob[];
}
