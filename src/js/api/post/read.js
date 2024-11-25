import { API_SOCIAL_POSTS } from "../constants.js";
import { headers } from "../headers.js";
/**
 * Reads a single post by its ID.
 *
 * @param {string|number} id - The ID of the post to read.
 * @returns {Promise<object>} The response data.
 * @throws {Error} If the API request fails.
 */
export async function readPost(id) {
  try {
    const response = await fetch(`${API_SOCIAL_POSTS}/${id}`, {
      method: "GET",
      headers: headers(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch post");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in readPost:", error);
    throw error;
  }
}

/**
 * Reads multiple posts with optional pagination and tagging.
 *
 * @param {number} [limit=12] - The maximum number of posts to return.
 * @param {number} [page=1] - The page number for pagination.
 * @param {string} [tag] - An optional tag to filter posts.
 * @returns {Promise<Object>} An object containing an array of posts in the `data` field, and information in a `meta` field.
 * @throws {Error} If the API request fails.
 */
export async function readPosts(limit = 12, page = 1) {
  try {
    const response = await fetch(
      `${API_SOCIAL_POSTS}?limit=${limit}&page=${page}`,
      {
        method: "GET",
        headers: headers(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }

    return await response.json();
  } catch (error) {
    console.error("Error reading posts:", error);
    throw error;
  }
}
/**
 * Reads multiple posts by a specific user with optional pagination and tagging.
 *
 * @param {string} username - The username of the user whose posts to read.
 * @param {number} [limit=12] - The maximum number of posts to return.
 * @param {number} [page=1] - The page number for pagination.
 * @param {string} [tag] - An optional tag to filter posts.
 * @returns {Promise<object>} Object with data and meta fields.
 * @throws {Error} If the API request fails.
 */
export async function readPostsByUser(username, limit = 12, page = 1) {
  try {
    const response = await fetch(
      `${API_SOCIAL_POSTS}?username=${username}&limit=${limit}&page=${page}`,
      { headers: headers() }
    );
    if (!response.ok) throw new Error("Failed to fetch user posts");
    return await response.json();
  } catch (error) {
    console.error("Error reading user posts:", error);
    throw error;
  }
}
