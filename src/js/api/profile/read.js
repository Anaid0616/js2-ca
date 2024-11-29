import { API_SOCIAL_PROFILES } from "../constants.js";
import { headers } from "../headers.js";

/**
 * Fetch the profile data for a specific user.
 *
 * @async
 * @function readProfile
 * @param {string} username - The username of the profile to fetch.
 * @returns {Promise<Object>} - A promise that resolves to the profile data.
 * @throws {Error} - Throws an error if the API request fails.
 *
 * @example
 * // Example usage:
 * try {
 *   const profile = await readProfile("Anaid_06");
 *   console.log("Fetched profile data:", profile);
 * } catch (error) {
 *   console.error("Failed to fetch profile:", error);
 * }
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
