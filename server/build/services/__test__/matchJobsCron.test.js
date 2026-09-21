import { afterEach, describe, expect, it, jest } from "@jest/globals";
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
const { getActivePreferences, markChecked } = await import("../../models/preferenceModal.js");
const { searchJobs } = await import("../../services/adzunaService.js");
const { findNewMatches } = await import("../../services/matchingService.js");
const { sendMatchNotification } = await import("../../services/emailServices.js");
const { logNotification } = await import("../../models/notificationModel.js");
const { runMatchJob } = await import("../../jobs/matchJobsCron.js");
const mockGetActivePreferences = getActivePreferences;
const mockMarkChecked = markChecked;
const mockSearchJobs = searchJobs;
const mockFindNewMatches = findNewMatches;
const mockSendMatchNotification = sendMatchNotification;
const mockLogNotification = logNotification;
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
//# sourceMappingURL=matchJobsCron.test.js.map