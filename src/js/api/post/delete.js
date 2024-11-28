import { API_KEY, API_SOCIAL_POSTS } from "../constants.js";
import { headers } from "../headers.js";

/**
 * Deletes a post by its ID.
 *
 * @param {string|number} id - The ID of the post to delete.
 * @returns {Promise<void>} Resolves if the deletion was successful.
 * @throws {Error} If the API request fails.
 */
export async function deletePost(id) {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API_SOCIAL_POSTS}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete post");
    }

    return true; // Return true for successful deletion
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
}
