import { afterEach, describe, expect, it, jest } from "@jest/globals";

type MockQuery = jest.Mock<(...args: any[]) => Promise<{ rows: any[] }>>;

jest.unstable_mockModule("../../db/db.js", () => ({
  default: {
    query: jest.fn<(...args: any[]) => Promise<{ rows: any[] }>>(),
  },
}));

const pool = (await import("../../db/db.js")).default;
const mockQuery = pool.query as unknown as MockQuery;
const { findNewMatches } = await import("../../services/matchingService.js");

describe("findNewMatches", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("skips a job that already exists in job_matches", async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [{ id: "existing" }],
    });

    const jobs = [
      {
        id: "ext1",
        title: "Dev",
        company: { display_name: "Acme" },
        redirect_url: "url",
      },
    ];
    const result = await findNewMatches("pref1", jobs as any);

    expect(result).toHaveLength(0);
    expect(mockQuery).toHaveBeenCalledTimes(1);
  });

  it("inserts and returns a genuinely new job", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] }).mockResolvedValueOnce({
      rows: [{ id: "new1", title: "Dev", sourceUrl: "url" }],
    });

    const jobs = [
      {
        id: "ext1",
        title: "Dev",
        company: { display_name: "Acme" },
        redirect_url: "url",
      },
    ];
    const result = await findNewMatches("pref1", jobs as any);

    expect(result).toHaveLength(1);
    expect(mockQuery).toHaveBeenCalledTimes(2);
  });
});
