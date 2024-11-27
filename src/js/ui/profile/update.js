import { updateProfile } from "../../api/profile/update.js";

/**
 * Handles the update profile form submission.
 */
export async function onUpdateProfile(event) {
  event.preventDefault(); // Prevent default form submission behavior

  const form = event.target;
  const avatar = form.avatar.value.trim();
  const banner = form.banner.value.trim();
  const bio = form.bio.value.trim();

  const user = JSON.parse(localStorage.getItem("user")); // Get logged-in user's data
  const username = user?.name;

  if (!username) {
    alert("User not logged in. Cannot update profile.");
    return;
  }

  try {
    const updateData = {
      avatar: avatar || null, // Set to null if empty
      banner: banner || null,
      bio: bio || null,
    };

    const updatedProfile = await updateProfile(username, updateData); // Call API
    console.log("Updated profile:", updatedProfile);

    alert("Profile updated successfully!");
    // Optionally update UI or reload the page to reflect changes
    location.reload();
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("Failed to update profile. Please try again.");
  }
}
