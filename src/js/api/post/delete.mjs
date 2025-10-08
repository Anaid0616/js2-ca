// src/js/api/post/delete.mjs
import { API_SOCIAL_POSTS } from '../constants.mjs';
import { doFetch } from '../../utilities/doFetch.mjs';

/**
 * Deletes a post by its ID.
 *
 * - If the API succeeds (204 No Content or any OK response), the promise resolves (no return value).
 * - If the API fails, `doFetch` throws (with the server message when available).
 *
 * @param {string|number} id
 * @returns {Promise<void>}
 */
export async function deletePost(id) {
  // Just call doFetch with DELETE. No try/catch or response.json() needed here.
  await doFetch(`${API_SOCIAL_POSTS}/${id}`, { method: 'DELETE' });
  return true;
}
