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
    console.log("Fetching profile for username:", username);

    // Fetch the profile information
    const response = await fetch(`${API_SOCIAL_PROFILES}/${username}`, {
      method: "GET",
      headers: headers(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch profile information.");
    }

    const profileData = await response.json();
    console.log("Profile Data:", profileData);

    // Update the HTML with profile info
    const userAvatar = document.getElementById("user-avatar");

    const userNameElement = document.getElementById("user-name");
    const userBioElement = document.getElementById("user-bio");

    // Use fallback values only if data is truly missing
    userNameElement.textContent =
      profileData.name || user.name || "Unknown User";
    userBioElement.textContent = profileData.bio || "No bio available.";
    // Handle avatar fallback
    const avatarUrl =
      profileData.avatar?.url ||
      "https://i.postimg.cc/hhFynQtz/yoonjae-baik-6qe-V7-CVWIXs-unsplash-kopiera.jpg"; // Fallback image
    userAvatar.src = avatarUrl;
    userAvatar.alt = profileData.name || "User Avatar";
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }
}

// Call the function to fetch and display profile
fetchAndDisplayProfile();
