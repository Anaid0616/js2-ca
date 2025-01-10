import { updateProfile } from '../../api/profile/update.mjs';

export async function onUpdateProfile(event) {
  event.preventDefault(); // Prevent default form submission behavior

  // Retrieve form values
  const form = event.target;
  const avatar = form.avatar.value.trim();
  const bio = form.bio.value.trim();

  // Fetch current user data from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !user.name) {
    alert('User not logged in. Cannot update profile.');
    return;
  }

  const username = user.name;

  try {
    // Prepare data for API update
    const updateData = {};
    if (avatar) updateData.avatar = { url: avatar };
    if (bio) updateData.bio = bio;

    console.log('Payload being sent:', updateData); // Debugging log

    // Call the API to update the profile
    const updatedProfile = await updateProfile(username, updateData);

    // Update `localStorage` with new data
    const updatedUserData = {
      ...user, // Preserve existing user data
      name: updatedProfile.name || user.name,
      avatar: updatedProfile.avatar || user.avatar,
      bio: updatedProfile.bio || user.bio,
    };
    localStorage.setItem('user', JSON.stringify(updatedUserData));
    console.log('Updated localStorage:', localStorage.getItem('user')); // Debugging log

    // Dynamically update the UI
    const userAvatar = document.getElementById('user-avatar');
    const userNameElement = document.getElementById('user-name');
    const userBioElement = document.getElementById('user-bio');

    userAvatar.src = updatedUserData.avatar?.url || '/images/placeholder.jpg';
    userNameElement.textContent = updatedUserData.name || 'Unknown User';
    userBioElement.textContent = updatedUserData.bio || 'No bio available.';

    // Pre-fill form with updated data
    form.avatar.value = updatedUserData.avatar?.url || '';
    form.bio.value = updatedUserData.bio || '';

    alert('Profile updated successfully!');
  } catch (error) {
    console.error('Error updating profile:', error);
    alert('Failed to update profile. Please try again.');
  }
}

// Add event listener to the profile update form
const updateProfileForm = document.querySelector(
  "form[name='updateProfileForm']"
);
if (updateProfileForm) {
  updateProfileForm.addEventListener('submit', onUpdateProfile);

  // Populate the form with existing data on page load
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    updateProfileForm.avatar.value = user.avatar?.url || '';
    updateProfileForm.bio.value = user.bio || '';
  }
} else {
  console.error('Update profile form not found in DOM.');
}
