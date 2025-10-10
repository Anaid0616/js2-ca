import { API_SOCIAL_PROFILES } from "../constants.mjs";
import { doFetch } from "../../utilities/doFetch.mjs";
// Import the form handler
import { initializeFormHandler } from "../../utilities/formHandler.mjs";

// Call the function to attach the form submission logic
initializeFormHandler();

/**
 * Updates the profile information for a given user.
 *
 * @param {string} username - The username of the profile being updated.
 * @param {object} data - Profile update data.
 * @param {object} [data.avatar] - The avatar object containing the URL.
 * @param {string} [data.avatar.url] - The URL of the user's avatar.
 * @param {string} [data.bio] - The user's bio (optional).
 * @returns {Promise<object>} - The updated profile response from the API.
 *
 * @example
 * // Example usage:
 * try {
 *   const updatedProfile = await updateProfile("Anaid_06", { bio: "New bio" });
 *   console.log("Profile updated:", updatedProfile);
 * } catch (error) {
 *   console.error("Failed to update profile:", error);
 * }
 */
export async function updateProfile(username, data) {
  try {
    const options = {
      method: "PUT", // Set HTTP method
      body: JSON.stringify(data), // Pass the updated data
    };

    // Use `doFetch` to send the request
    const response = await doFetch(
      `${API_SOCIAL_PROFILES}/${username}`,
      options,
    );

    console.log("API Response Status:", response.status);
    console.log("API Response JSON:", response);

    return response; // Return the response to the caller
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error; // Propagate the error to the UI layer
  }
}
