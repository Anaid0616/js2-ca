import { API_SOCIAL_PROFILES } from "../../api/constants.js";
import { headers } from "../../api/headers.js";

/**
 * Fetch and display user profile information (name, avatar, and bio).
 * - If user data exists in localStorage, it populates the profile directly.
 * - Otherwise, it fetches data from the API and updates both the DOM and localStorage.
 *
 * @async
 * @function fetchAndDisplayProfile
 * @throws {Error} If the API request fails or user is not logged in.
 */
export async function fetchAndDisplayProfile() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("You must be logged in to view this page.");
      window.location.href = "/auth/login/";
      return;
    }

    const username = user.name;

    // Use localStorage data first if available
    if (user.avatar || user.bio) {
      // Populate UI from localStorage
      const userAvatar = document.getElementById("user-avatar");
      const userNameElement = document.getElementById("user-name");
      const userBioElement = document.getElementById("user-bio");

      userAvatar.src = user.avatar?.url || "/images/placeholder.jpg";
      userAvatar.alt = user.name || "User Avatar"; // Set alt text
      userNameElement.textContent = user.name || "Unknown User"; // Set username
      userBioElement.textContent = user.bio || "No bio available.";

      return; // Stop here if localStorage has data
    }

    // Fetch the profile information from the API
    const response = await fetch(`${API_SOCIAL_PROFILES}/${username}`, {
      method: "GET",
      headers: headers(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch profile information.");
    }

    const profileData = await response.json();

    // Update the HTML with profile info
    const userAvatar = document.getElementById("user-avatar");
    const userNameElement = document.getElementById("user-name");
    const userBioElement = document.getElementById("user-bio");

    // Populate UI with fetched data
    userAvatar.src = profileData.avatar?.url || "/images/placeholder.jpg";
    userAvatar.alt = profileData.name || "User Avatar"; // Set alt text
    userNameElement.textContent = profileData.name || "Unknown User"; // Set username
    userBioElement.textContent = profileData.bio || "No bio available.";

    // Update localStorage with fetched data
    const updatedUserData = {
      ...user, // Preserve existing data
      avatar: profileData.avatar,
      bio: profileData.bio,
      name: profileData.name, // Ensure name is updated
    };
    localStorage.setItem("user", JSON.stringify(updatedUserData));
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }
}

// Call the function to fetch and display profile data
fetchAndDisplayProfile();
