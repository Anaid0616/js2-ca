import { updateProfile } from "../../api/profile/update.js";

/**
 * Handles the update profile form submission.
 */
const updateProfileForm = document.querySelector(
  "form[name='updateProfileForm']"
);

if (updateProfileForm) {
  console.log("Form found and event listener attached.");
  updateProfileForm.addEventListener("submit", onUpdateProfile);
} else {
  console.error("Update profile form not found in DOM.");
}

export async function onUpdateProfile(event) {
  event.preventDefault(); // Prevent default form submission behavior
  console.log("onUpdateProfile function triggered");

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
      avatar: avatar || null, // Use null if the field is empty
      banner: banner || null,
      bio: bio || null,
    };

    console.log("Updating profile with data:", updateData);

    // Call the API to update the profile
    const updatedProfile = await updateProfile(user.name, updateData);
    console.log("Updated profile from API:", updatedProfile);

    // Dynamically update the UI with the new profile data
    document.getElementById("user-avatar").src =
      updatedProfile.avatar ||
      "https://i.postimg.cc/hhFynQtz/yoonjae-baik-6qe-V7-CVWIXs-unsplash-kopiera.jpg";
    document.getElementById("user-bio").textContent =
      updatedProfile.bio || "No bio available.";
    document.getElementById("user-name").textContent = username;

    alert("Profile updated successfully!");
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("Failed to update profile. Please try again.");
  }
}
