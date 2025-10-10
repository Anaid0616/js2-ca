import { API_SOCIAL_POSTS } from "../constants.mjs";
import { doFetch } from "../../utilities/doFetch.mjs";

/**
 * Read a single post by id
 *
 * @param {string|number} id
 * @param {{author?: boolean, comments?: boolean, reactions?: boolean}} [opts]
 *  - author: include _author object (default: true for backward-compat)
 *  - comments: include comments array
 *  - reactions: include reactions array
 * @returns {Promise<{data:any, meta?:any}>}
 */
export async function readPost(id, opts = {}) {
  const { author = true, comments = false, reactions = false } = opts;

  const params = new URLSearchParams();
  if (author) params.set("_author", "true");
  if (comments) params.set("_comments", "true");
  if (reactions) params.set("_reactions", "true");

  const qs = params.toString();
  const url = `${API_SOCIAL_POSTS}/${id}${qs ? `?${qs}` : ""}`;

  try {
    return await doFetch(url, { method: "GET" }, true);
  } catch (error) {
    console.error("Error in readPost:", error);
    throw error;
  }
}

/**
 * Reads multiple posts with optional pagination.
 *
 * @param {number} [limit=12] - The maximum number of posts to return.
 * @param {number} [page=1] - The page number for pagination.
 * @returns {Promise<Object>} An object containing an array of posts in the `data` field, and information in a `meta` field.
 * @throws {Error} If the API request fails.
 */
export async function readPosts(limit = 12, page = 1) {
  const url = `${API_SOCIAL_POSTS}?limit=${limit}&page=${page}&_author=true`;
  try {
    // Use doFetch with `GET` method and auth headers
    return await doFetch(url, { method: "GET" }, true);
  } catch (error) {
    console.error("Error reading posts:", error);
    throw error;
  }
}

/**
 * Reads multiple posts by a specific user with optional pagination.
 *
 * @param {string} username - The username of the user whose posts to read.
 * @param {number} [limit=12] - The maximum number of posts to return.
 * @param {number} [page=1] - The page number for pagination.
 * @returns {Promise<object>} Object with data and meta fields.
 * @throws {Error} If the API request fails.
 */
export async function readPostsByUser(username, limit = 12, page = 1) {
  const url = `${API_SOCIAL_POSTS}?_author=true&author=${username}&limit=${limit}&page=${page}`;
  try {
    // Use doFetch with `GET` method and auth headers
    return await doFetch(url, { method: "GET" }, true);
  } catch (error) {
    console.error("Error reading user posts:", error);
    throw error;
  }
}
