import { API_SOCIAL_PROFILES } from '../constants.mjs';
import { doFetch } from '../../utilities/doFetch.mjs';

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
    const options = {
      method: 'GET', // Set HTTP method
    };

    // Use `doFetch` to send the request
    return await doFetch(`${API_SOCIAL_PROFILES}/${username}`, options);
  } catch (error) {
    console.error('Error reading profile:', error);
    throw error; // Re-throw error for further handling
  }
}
