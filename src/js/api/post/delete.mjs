import { API_SOCIAL_POSTS } from '../constants.mjs';
import { doFetch } from '../../utilities/doFetch.mjs';

/**
 * Deletes a post by its ID.
 *
 * @param {string|number} id - The ID of the post to delete.
 * @returns {Promise<void>} Resolves if the deletion was successful.
 * @throws {Error} If the API request fails.
 */
export async function deletePost(id) {
  try {
    const options = {
      method: 'DELETE',
    };

    // Use doFetch with the provided ID URL
    const response = await doFetch(`${API_SOCIAL_POSTS}/${id}`, options);

    // Check if the API confirms deletion
    if (response.ok) {
      return true;
    } else {
      throw new Error('Failed to delete post. API response not OK.');
    }
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error; // Re-throw error for further handling
  }
}
