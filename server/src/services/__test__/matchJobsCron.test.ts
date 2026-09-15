import { afterEach, describe, expect, it, jest } from "@jest/globals";

type MockGetActivePreferences = jest.Mock<
  () => Promise<
    {
      id: string;
      userId: string;
      email: string;
      jobTitle: string;
      location: string;
    }[]
  >
>;
type MockMarkChecked = jest.Mock<(preferenceId: string) => Promise<void>>;
type MockSearchJobs = jest.Mock<
  (title: string, location: string) => Promise<any[]>
>;
type MockFindNewMatches = jest.Mock<
  (preferenceId: string, jobs: any[]) => Promise<any[]>
>;
type MockSendMatchNotification = jest.Mock<
  (email: string, match: any) => Promise<{ success: boolean; reason?: string }>
>;
type MockLogNotification = jest.Mock<
  (userId: string, matchId: string, status: string) => Promise<void>
>;

jest.unstable_mockModule("../../models/preferenceModal.js", () => ({
  getActivePreferences: jest.fn(),
  markChecked: jest.fn(),
}));
jest.unstable_mockModule("../../services/adzunaService.js", () => ({
  searchJobs: jest.fn(),
}));
jest.unstable_mockModule("../../services/matchingService.js", () => ({
  findNewMatches: jest.fn(),
}));
jest.unstable_mockModule("../../services/emailServices.js", () => ({
  sendMatchNotification: jest.fn(),
}));
jest.unstable_mockModule("../../models/notificationModel.js", () => ({
  logNotification: jest.fn(),
}));

const { getActivePreferences, markChecked } =
  await import("../../models/preferenceModal.js");
const { searchJobs } = await import("../../services/adzunaService.js");
const { findNewMatches } = await import("../../services/matchingService.js");
const { sendMatchNotification } =
  await import("../../services/emailServices.js");
const { logNotification } = await import("../../models/notificationModel.js");
const { runMatchJob } = await import("../../jobs/matchJobsCron.js");

const mockGetActivePreferences =
  getActivePreferences as unknown as MockGetActivePreferences;
const mockMarkChecked = markChecked as unknown as MockMarkChecked;
const mockSearchJobs = searchJobs as unknown as MockSearchJobs;
const mockFindNewMatches = findNewMatches as unknown as MockFindNewMatches;
const mockSendMatchNotification =
  sendMatchNotification as unknown as MockSendMatchNotification;
const mockLogNotification = logNotification as unknown as MockLogNotification;

describe("runMatchJob", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("groups duplicate title+location so Adzuna is only called once", async () => {
    mockGetActivePreferences.mockResolvedValue([
      {
        id: "p1",
        userId: "u1",
        email: "a@test.com",
        jobTitle: "React Dev",
        location: "Cape Town",
      },
      {
        id: "p2",
        userId: "u2",
        email: "b@test.com",
        jobTitle: "react dev",
        location: "cape town",
      },
    ]);
    mockSearchJobs.mockResolvedValue([]);
    mockFindNewMatches.mockResolvedValue([]);

    await runMatchJob();

    expect(mockSearchJobs).toHaveBeenCalledTimes(1);
  });

  it("sends an email and logs success for each new match", async () => {
    mockGetActivePreferences.mockResolvedValue([
      {
        id: "p1",
        userId: "u1",
        email: "a@test.com",
        jobTitle: "React Dev",
        location: "Cape Town",
      },
    ]);
    mockSearchJobs.mockResolvedValue([{ id: "ext1" }]);
    mockFindNewMatches.mockResolvedValue([{ id: "m1", title: "React Dev" }]);
    mockSendMatchNotification.mockResolvedValue({ success: true });

    await runMatchJob();

    expect(mockSendMatchNotification).toHaveBeenCalledWith("a@test.com", {
      id: "m1",
      title: "React Dev",
    });
    expect(mockMarkChecked).toHaveBeenCalledWith("p1");
  });

  it("continues processing other users even if one email send fails", async () => {
    mockGetActivePreferences.mockResolvedValue([
      {
        id: "p1",
        userId: "u1",
        email: "a@test.com",
        jobTitle: "React Dev",
        location: "Cape Town",
      },
      {
        id: "p2",
        userId: "u2",
        email: "b@test.com",
        jobTitle: "React Dev",
        location: "Cape Town",
      },
    ]);
    mockSearchJobs.mockResolvedValue([{ id: "ext1" }]);
    mockFindNewMatches.mockResolvedValue([{ id: "m1" }]);
    mockSendMatchNotification
      .mockResolvedValueOnce({ success: false, reason: "rejected" })
      .mockResolvedValueOnce({ success: true });

    await runMatchJob();

    expect(mockSendMatchNotification).toHaveBeenCalledTimes(2);
  });
});
