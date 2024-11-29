import { updateProfile } from "../../api/profile/update.js";
import { fetchAndDisplayProfile } from "../../router/views/profileUser.js";

/**
 * Handles the update profile form submission.
 */
const updateProfileForm = document.querySelector(
  "form[name='updateProfileForm']"
);

if (updateProfileForm) {
  updateProfileForm.addEventListener("submit", onUpdateProfile);
} else {
  console.error("Update profile form not found in DOM.");
}

export async function onUpdateProfile(event) {
  event.preventDefault(); // Prevent default form submission behavior

  const form = event.target;
  const avatar = form.avatar.value.trim();
  const bio = form.bio.value.trim();

  const user = JSON.parse(localStorage.getItem("user")); // Get logged-in user's data
  const username = user?.name;

  if (!username) {
    alert("User not logged in. Cannot update profile.");
    return;
  }

  try {
    const updateData = {
      avatar: avatar ? { url: avatar } : null, // Wrap avatar in an object
      bio: bio || null, // String
    };

    // Call the API to update the profile
    const updatedProfile = await updateProfile(username, updateData);
    console.log("Updated profile from API:", updatedProfile);

    // Update the user's local storage data
    const updatedUserData = {
      ...user,
      name: updatedProfile.data.name,
      avatar: updatedProfile.data.avatar,
      bio: updatedProfile.data.bio,
    };
    localStorage.setItem("user", JSON.stringify(updatedUserData));

    // Dynamically update the DOM with the updated profile data
    const userAvatar = document.getElementById("user-avatar");
    const userNameElement = document.getElementById("user-name");
    const userBioElement = document.getElementById("user-bio");

    // Ensure avatar and bio fields are updated
    userAvatar.src =
      updatedProfile.data.avatar?.url || "/images/placeholder.jpg";
    userNameElement.textContent = updatedProfile.data.name || "Unknown User";
    userBioElement.textContent = updatedProfile.data.bio || "No bio available.";

    // Update form fields as well
    form.avatar.value = updatedProfile.data.avatar?.url || "";
    form.bio.value = updatedProfile.data.bio || "";

    alert("Profile updated successfully!");
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("Failed to update profile. Please try again.");
  }
}

// Ensure the profile is fetched and displayed when the page loads
fetchAndDisplayProfile();
