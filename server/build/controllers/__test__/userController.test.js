import { describe, expect, it, jest } from "@jest/globals";
// Mock modules BEFORE importing the controller that uses them
jest.unstable_mockModule("../../db/db.js", () => ({
    default: { query: jest.fn(), connect: jest.fn() },
}));
jest.unstable_mockModule("bcrypt", () => ({
    default: { hash: jest.fn() },
}));
jest.unstable_mockModule("jsonwebtoken", () => ({
    default: { sign: jest.fn() },
}));
const { register } = await import("../userController.js");
const pool = (await import("../../db/db.js")).default;
const bcrypt = (await import("bcrypt")).default;
const jwt = (await import("jsonwebtoken")).default;
function mockRes() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}
describe("register", () => {
    it("returns 400 if fields are missing", async () => {
        const req = { body: { whatsapp_number: "123" } }; // missing name/password
        const res = mockRes();
        const next = jest.fn();
        await register(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "All fields are required" });
    });
    const mockedQuery = jest.mocked(pool.query);
    it("returns 409 if the number already exists", async () => {
        mockedQuery.mockResolvedValueOnce({ rows: [{ id: 1 }] });
        const req = {
            body: { whatsapp_number: "123", name: "Sam", password: "pw" },
        };
        const res = mockRes();
        const next = jest.fn();
        await register(req, res, next);
        expect(res.status).toHaveBeenCalledWith(409);
    });
});
//# sourceMappingURL=userController.test.js.map