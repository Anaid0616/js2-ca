import { updateProfile } from "../../api/profile/update.js";
import { fetchAndDisplayProfile } from "../../router/views/profileUser.js";

/**
 * Handles the update profile form submission.
 * This function updates the user's profile by submitting avatar and bio data to the API,
 * updates local storage with the new data, and dynamically updates the DOM.
 *
 * - Fetches updated user data from the API.
 * - Updates `localStorage` with new avatar, bio, and name.
 * - Dynamically updates DOM elements for the user's avatar, bio, and name.
 *
 * @param {Event} event - The form submission event.
 */
export async function onUpdateProfile(event) {
  event.preventDefault(); // Prevent default form submission behavior

  // Retrieve form values
  const form = event.target;
  const avatar = form.avatar.value.trim();
  const bio = form.bio.value.trim();

  // Fetch current user data from localStorage
  const user = JSON.parse(localStorage.getItem("user")); // Get logged-in user's data
  const username = user.name;
  console.log("Fetching profile for username:", username);

  if (!username) {
    alert("User not logged in. Cannot update profile.");
    return;
  }

  try {
    // Prepare data for API update
    const updateData = {
      avatar: avatar ? { url: avatar } : null, // Wrap avatar in an object
      bio: bio || null, // String (or null if empty)
    };

    // Call the API to update the profile
    const updatedProfile = await updateProfile(username, updateData);
    console.log("Updated profile from API:", updatedProfile);

    // Update the user's local storage data with new avatar, bio, and name
    const updatedUserData = {
      ...user,
      name: updatedProfile.data.name, // Update name from response
      avatar: updatedProfile.data.avatar, // Update avatar
      bio: updatedProfile.data.bio, // Update bio
    };
    localStorage.setItem("user", JSON.stringify(updatedUserData));

    // Dynamically update the DOM with the updated profile data
    const userAvatar = document.getElementById("user-avatar");
    const userNameElement = document.getElementById("user-name");
    const userBioElement = document.getElementById("user-bio");

    // Ensure DOM elements are updated with API response
    userAvatar.src =
      updatedProfile.data.avatar?.url || "/images/placeholder.jpg";
    userNameElement.textContent = updatedProfile.data.name || "Unknown User";
    userBioElement.textContent = updatedProfile.data.bio || "No bio available.";

    console.log("Updated DOM Elements:", {
      name: userNameElement.textContent,
      avatar: userAvatar.src,
      bio: userBioElement.textContent,
    });

    // Update form fields to reflect the latest data
    form.avatar.value = updatedProfile.data.avatar?.url || "";
    form.bio.value = updatedProfile.data.bio || "";

    alert("Profile updated successfully!");
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("Failed to update profile. Please try again.");
  }
}

/**
 * Adds the event listener to the profile update form, if it exists.
 */
const updateProfileForm = document.querySelector(
  "form[name='updateProfileForm']"
);

if (updateProfileForm) {
  updateProfileForm.addEventListener("submit", onUpdateProfile);
} else {
  console.error("Update profile form not found in DOM.");
}

/**
 * Ensures the profile is fetched and displayed when the page loads.
 * This function retrieves the user profile data and renders it dynamically on the page.
 */
fetchAndDisplayProfile();
