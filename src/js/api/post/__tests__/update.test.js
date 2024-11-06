import { describe, it, expect, vi, beforeEach } from "vitest";
import { updatePost } from "../update";

global.fetch = vi.fn();

describe("updatePost", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("should update a post with required fields and default optional fields", async () => {
    const mockResponse = { id: 1, title: "Updated Post" };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const postData = {
      title: "Updated Post",
    };

    const result = await updatePost(1, postData);

    expect(result).toEqual(mockResponse);
  });

  it("should update a post with all provided fields", async () => {
    const mockResponse = { id: 2, title: "Updated Post with media" };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const postData = {
      title: "Updated Post with media",
      body: "This is an updated body",
      tags: ["tag1", "tag2"],
      media: {
        url: "https://url.com/image.jpg",
        alt: "Updated image",
      },
    };

    const result = await updatePost(2, postData);

    expect(result).toEqual(mockResponse);
  });

  it("should throw an error if the API request fails", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
    });

    const postData = {
      title: "Failing Post",
    };

    await expect(updatePost(3, postData)).rejects.toThrow();
  });
});
