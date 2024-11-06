import { describe, it, expect, vi, beforeEach } from "vitest";
import { createPost } from "../create";

global.fetch = vi.fn();

describe("createPost", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("should create a post with required title and default optional fields", async () => {
    const mockResponse = { id: 1, title: "Test Post" };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const postData = {
      title: "Test Post",
    };

    const result = await createPost(postData);

    expect(result).toEqual(mockResponse);
  });

  it("should create a post with all provided fields", async () => {
    const mockResponse = {
      id: 2,
      title: "Post with media",
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const postData = {
      title: "Post with media",
      body: "This is a body",
      tags: ["tag1", "tag2"],
      media: {
        url: "https://url.com/image.jpg",
        alt: "An image",
      },
    };

    const result = await createPost(postData);

    expect(result).toEqual(mockResponse);
  });

  it("should throw an error if API request fails", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
    });

    const postData = {
      title: "Failing Post",
    };

    await expect(createPost(postData)).rejects.toThrow();
  });
});
