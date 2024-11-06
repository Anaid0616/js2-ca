import { describe, it, expect, vi } from "vitest";
import { login } from "../login";

global.fetch = vi.fn();

describe("login", () => {
  it("should return a user object when email and password are provided", async () => {
    const mockResponse = {
      token: "123abc",
      user: { email: "test@example.com" },
    };
    fetch.mockResolvedValueOnce({
      json: async () => mockResponse,
      ok: true,
    });

    const result = await login({
      email: "test@example.com",
      password: "password",
    });
    expect(result).toEqual(mockResponse);
  });

  it("should throw an error for an invalid login", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: "Invalid credentials" }),
    });

    await expect(
      login({ email: "wrong@example.com", password: "wrongpassword" })
    ).rejects.toThrow();
  });
});
