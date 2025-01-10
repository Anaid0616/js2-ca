import { API_SOCIAL_POSTS } from '../constants.mjs';
import { doFetch } from '../../utilities/doFetch.mjs';

/**
 * Creates a new post by sending the data to the API.
 *
 * @param {Object} data - The post parameters.
 * @param {string} data.title - The title of the post (required).
 * @param {string} [data.body] - The body of the post (optional).
 * @param {string[]} [data.tags] - Array of tags associated with the post (optional).
 * @param {Object} [data.media] - Media object containing URL and alt text (optional).
 * @param {string} [data.media.url] - The URL of the media (optional).
 * @param {string} [data.media.alt] - Alt text for the media (optional).
 * @returns {Promise<Object>} The created post data from the API.
 * @throws {Error} If the API request fails.
 *
 * @example
 * // Example usage:
 * const postData = {
 *   title: "My New Post",
 *   body: "This is the body of my post.",
 *   tags: ["tag1", "tag2"],
 *   media: { url: "https://example.com/image.jpg", alt: "Example Image" },
 * };
 *
 * try {
 *   const newPost = await createPost(postData);
 *   console.log("Post created:", newPost);
 * } catch (error) {
 *   console.error("Failed to create post:", error);
 * }
 */
export async function createPost({ title, body = '', tags = [], media = {} }) {
  try {
    const options = {
      method: 'POST',
      body: JSON.stringify({ title, body, tags, media }),
    };

    // Using doFetch with authentication headers (default is `true`)
    const response = await doFetch(API_SOCIAL_POSTS, options);

    // Return the response if successful
    return response;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error; // Re-throw error for further handling
  }
}
