import { API_KEY, API_SOCIAL_POSTS } from "../constants.js";
import { headers } from "../headers.js";

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
  const token = localStorage.getItem("token");

  console.log(localStorage.getItem("token"));

  if (!token) {
    throw new Error("User is not authenticated. No token found.");
  }

  try {
    const response = await fetch(`${API_SOCIAL_POSTS}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({ title, body, tags, media }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update post");
    }

    return await response.json(); // Return the updated post data
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
}
