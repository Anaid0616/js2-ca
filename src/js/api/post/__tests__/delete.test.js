import { describe, it, expect, vi, beforeEach } from "vitest";
import { deletePost } from "../delete";

global.fetch = vi.fn();

describe("deletePost", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("should not throw an error when API returns ok", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
    });
    await expect(deletePost(1)).resolves.not.toThrow();
  });

  it("should throw an error when the API response is not ok", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
    });

    await expect(deletePost(1)).rejects.toThrow();
  });
});
