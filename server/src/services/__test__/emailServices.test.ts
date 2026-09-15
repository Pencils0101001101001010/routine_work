import { afterEach, describe, expect, it, jest } from "@jest/globals";

type SendMailResult = {
  messageId?: string;
  accepted?: string[];
  rejected?: string[];
  rejectedErrors?: string[];
};

type MockSendMail = jest.Mock<(...args: any[]) => Promise<SendMailResult>>;

jest.unstable_mockModule("../../config/transporter.js", () => ({
  transporter: {
    sendMail: jest.fn<(...args: any[]) => Promise<SendMailResult>>(),
  },
}));

const { transporter } = await import("../../config/transporter.js");
const mockSendMail = transporter.sendMail as unknown as MockSendMail;
const { sendMatchNotification } =
  await import("../../services/emailServices.js");

const mockMatch = {
  id: "1",
  preferenceId: "p1",
  externalJobId: "ext1",
  title: "React Developer",
  company: "Acme",
  sourceUrl: "https://example.com/job/1",
};

describe("sendMatchNotification", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns success when email is accepted", async () => {
    mockSendMail.mockResolvedValue({
      messageId: "abc123",
      accepted: ["user@test.com"],
      rejected: [],
    });

    const result = await sendMatchNotification("user@test.com", mockMatch);

    expect(result.success).toBe(true);
    expect(result.providerId).toBe("abc123");
  });

  it("returns failure when email is rejected", async () => {
    mockSendMail.mockResolvedValue({
      accepted: [],
      rejected: ["user@test.com"],
      rejectedErrors: ["bad address"],
    });

    const result = await sendMatchNotification("user@test.com", mockMatch);

    expect(result.success).toBe(false);
    expect(result.reason).toBe("rejected");
  });

  it("returns failure when sendMail throws", async () => {
    mockSendMail.mockRejectedValue(new Error("SMTP down"));

    const result = await sendMatchNotification("user@test.com", mockMatch);

    expect(result.success).toBe(false);
    expect(result.reason).toBe("exception");
  });

  it("falls back to placeholder text when title is missing", async () => {
    mockSendMail.mockResolvedValue({
      accepted: ["user@test.com"],
      rejected: [],
    });

    await sendMatchNotification("user@test.com", { ...mockMatch, title: "" });

    const callArgs = mockSendMail.mock.calls[0]?.[0];
    expect(callArgs).toBeDefined();
    expect(callArgs.html).toContain("an available vacancy");
  });
});
