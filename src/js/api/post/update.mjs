import { API_SOCIAL_POSTS } from '../constants.mjs';
import { doFetch } from '../../utilities/doFetch.mjs';
// Import the form handler
import { initializeFormHandler } from '../../utilities/formHandler.mjs';

// Call the function to attach the form submission logic
initializeFormHandler();

/**
 * Updates an existing post by sending updated data to the API.
 *
 * @param {string|number} id - The ID of the post to update.
 * @param {Object} params - The updated post parameters.
 * @param {string} [params.title] - The updated title of the post. (optional)
 * @param {string} [params.body] - The updated body of the post. (optional)
 * @param {string[]} [params.tags] - Array of updated tags associated with the post. (optional)
 * @param {Object} [params.media] - Updated media object containing URL and alt text. (optional)
 * @param {string} [params.media.url] - The updated URL of the media.
 * @param {string} [params.media.alt] - Updated alt text for the media.
 * @returns {Promise<Object>} The updated post data from the API.
 * @throws {Error} If the API request fails.
 */

export async function updatePost(id, { title, body, tags, media }) {
  const payload = { title, body, tags, media }; // Data to be sent to the API

  try {
    const options = {
      method: 'PUT',
      body: JSON.stringify(payload), // Attach payload
    };

    // Use `doFetch` to update the post
    return await doFetch(`${API_SOCIAL_POSTS}/${id}`, options);
  } catch (error) {
    console.error('Error updating post:', error);
    throw error; // Re-throw error for further handling
  }
}
