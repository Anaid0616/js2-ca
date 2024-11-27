import { API_SOCIAL_PROFILES } from "../constants.js";
import { headers } from "../headers.js";

/**
 * Fetch the profile for a specific user.
 * @param {string} username - The username of the profile to fetch.
 * @returns {Promise<object>} - The profile data.
 */
export async function readProfile(username) {
  try {
    const response = await fetch(`${API_SOCIAL_PROFILES}/${username}`, {
      method: "GET",
      headers: headers(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }

    return await response.json(); // Return profile data
  } catch (error) {
    console.error("Error reading profile:", error);
    throw error;
  }
}
