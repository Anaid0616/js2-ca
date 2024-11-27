import { API_SOCIAL_PROFILES } from "../constants.js";
import { headers } from "../headers.js";

/**
 * Update the profile information for a given user.
 * @param {string} username - The username of the profile being updated.
 * @param {object} data - Profile update data (e.g., avatar, banner, bio, etc.).
 * @returns {Promise<object>} - The updated profile response.
 */
export async function updateProfile(username, data) {
  try {
    const response = await fetch(`${API_SOCIAL_PROFILES}/${username}`, {
      method: "PUT", // Use PUT for updating
      headers: headers(),
      body: JSON.stringify(data), // Send updated profile data
    });

    if (!response.ok) {
      throw new Error("Failed to update profile");
    }

    return await response.json(); // Return updated profile data
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error; // Propagate the error to the UI layer
  }
}
