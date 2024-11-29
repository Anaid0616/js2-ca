import { API_SOCIAL_PROFILES } from "../../api/constants.js";
import { headers } from "../../api/headers.js";

/**
 * Fetch and display user profile information (name and bio).
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

    // Use localStorage data first
    if (user.avatar || user.bio) {
      console.log("Using localStorage for profile data:", user);

      // Populate UI from localStorage
      const userAvatar = document.getElementById("user-avatar");
      const userBioElement = document.getElementById("user-bio");

      userAvatar.src = user.avatar?.url || "/images/placeholder.jpg";
      userBioElement.textContent = user.bio || "No bio available.";

      return; // Stop here if localStorage has data
    }

    // Fetch the profile information
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

    // Use fallback values only if data is truly missing
    userNameElement.textContent =
      profileData.name || user.name || "Unknown User";
    userBioElement.textContent = profileData.bio || "No bio available.";
    // Handle avatar fallback
    const avatarUrl = profileData.avatar?.url || "/images/placeholder.jpg"; // Fallback image
    userAvatar.src = avatarUrl;
    userAvatar.alt = profileData.name || "User Avatar";
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }
}

// Call the function to fetch and display profile
fetchAndDisplayProfile();
