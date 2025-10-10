import { readPost, readPosts, readPostsByUser } from "../read";
import { afterEach, describe, expect, test, vi } from "vitest";

describe("API Functions", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("readPost fetches a single post by ID", async () => {
    const mockData = { id: 1, title: "Test Post" };
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      }),
    );

    const data = await readPost(1);
    expect(data).toEqual(mockData);
  });

  test("readPost throws error if fetch fails", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
      }),
    );

    await expect(readPost(1)).rejects.toThrow();
  });

  test("readPosts fetches posts with pagination", async () => {
    const mockData = { data: [{ id: 1, title: "Test Post" }], meta: {} };
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      }),
    );

    const data = await readPosts(12, 1);
    expect(data).toEqual(mockData);
  });

  test("readPosts throws error if fetch fails", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
      }),
    );

    await expect(readPosts(12, 1)).rejects.toThrow();
  });

  test("readPostsByUser fetches posts by username", async () => {
    const mockData = { data: [{ id: 1, title: "Test Post" }], meta: {} };
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      }),
    );

    const data = await readPostsByUser("testuser", 12, 1);
    expect(data).toEqual(mockData);
  });

  test("readPostsByUser throws error if fetch fails", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
      }),
    );

    await expect(readPostsByUser("testuser", 12, 1)).rejects.toThrow();
  });
});
