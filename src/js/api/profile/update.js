import { API_SOCIAL_PROFILES } from "../constants.js";
import { headers } from "../headers.js";
import { onUpdateProfile } from "../../ui/profile/update.js";

/**
 * Updates the profile information for a given user.
 * Sends avatar and bio updates to the API and handles the response.
 *
 * @param {string} username - The username of the profile being updated.
 * @param {object} data - Profile update data.
 * @param {object} [data.avatar] - The avatar object containing the URL.
 * @param {string} [data.avatar.url] - The URL of the user's avatar.
 * @param {string} [data.bio] - The user's bio (optional).
 * @returns {Promise<object>} - The updated profile response from the API.
 *
 * @example
 * const data = {
 *   avatar: { url: "https://example.com/avatar.jpg" },
 *   bio: "Hello, this is my new bio!",
 * };
 * updateProfile("username", data)
 *   .then((response) => console.log(response))
 *   .catch((error) => console.error(error));
 */
export async function updateProfile(username, data) {
  try {
    const response = await fetch(`${API_SOCIAL_PROFILES}/${username}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(data),
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

const updateProfileForm = document.querySelector(
  "form[name='updateProfileForm']"
);

if (updateProfileForm) {
  updateProfileForm.addEventListener("submit", onUpdateProfile);
} else {
  console.error("Update profile form not found in DOM.");
}
