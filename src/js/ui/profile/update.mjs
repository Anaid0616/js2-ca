import { updateProfile } from '../../api/profile/update.mjs';
import { fetchAndDisplayProfile } from '../../router/views/profileUser.mjs';

export async function onUpdateProfile(event) {
  event.preventDefault(); // Prevent default form submission

  // Retrieve form values
  const form = event.target;
  const avatar = form.avatar.value.trim();
  const bio = form.bio.value.trim();

  // Get the current user's data from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !user.name) {
    alert('User not logged in. Cannot update profile.');
    return;
  }

  const username = user.name;

  try {
    // Prepare the data to send
    const updateData = {};
    if (avatar) updateData.avatar = { url: avatar };
    if (bio) updateData.bio = bio;

    console.log('Updating profile with data:', updateData);
    console.log('Sending update to API with data:', updateData);
    // Call the API to update the profile
    const updatedProfile = await updateProfile(username, updateData);
    console.log('Updated profile response from API:', updatedProfile);

    // Update localStorage with the new profile data
    const updatedUserData = {
      ...user,
      name: updatedProfile.name || user.name,
      avatar: updatedProfile.data.avatar || user.avatar,
      bio: updatedProfile.data.bio || user.bio,
    };
    localStorage.setItem('user', JSON.stringify(updatedUserData));
    console.log(
      'Updated localStorage:',
      JSON.parse(localStorage.getItem('user'))
    );
    console.log('Old bio:', user.bio);
    console.log('New bio from API:', updatedProfile.bio);
    console.log('Full API response:', updatedProfile);

    // Dynamically update the DOM using fetchAndDisplayProfile
    await fetchAndDisplayProfile();

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
} else {
  console.error('Update profile form not found in DOM.');
}
