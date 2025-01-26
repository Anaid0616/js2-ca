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

    const response = await doFetch(`${API_SOCIAL_POSTS}/${id}`, options);

    // Check if the response status is 204 (No Content) or a successful status
    if (response && response.status === 204) {
      console.log('Post deleted successfully');
      return true; // Indicate success
    }

    // Handle unexpected responses
    const result = await response.json(); // Attempt to parse any other response
    console.log('Delete response:', result);
    return result; // Return the result if it exists
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error; // Re-throw the error for higher-level handling
  }
}
