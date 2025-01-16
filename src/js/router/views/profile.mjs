import { authGuard } from '../../utilities/authGuard.mjs';
import { loadHTMLHeader } from '../../ui/global/sharedHeader.mjs';
import { API_SOCIAL_PROFILES } from '../../api/constants.mjs';
import { doFetch } from '../../utilities/doFetch.mjs'; // Import doFetch
import { fetchAndDisplayProfile } from './profileUser.mjs';
import '../../ui/profile/update.mjs';

loadHTMLHeader();
authGuard();

const userPostsContainer = document.getElementById('user-posts-container');

/**
 * Fetch and display posts for the logged-in user.
 * - Retrieves posts from the API and renders them in the `userPostsContainer`.
 * - If no posts are found, displays a "No posts available" message.
 *
 * @async
 * @function fetchAndDisplayUserPosts
 * @throws {Error} If the API request fails or the user is not logged in.
 */
async function fetchAndDisplayUserPosts() {
  try {
    const user = JSON.parse(localStorage.getItem('user')); // Get logged-in user
    if (!user) {
      alert('You must be logged in to view your posts.');
      window.location.href = '/auth/login/';
      return;
    }

    const username = user.name; // Get username

    // Use doFetch to fetch profile data with posts
    const profileData = await doFetch(
      `${API_SOCIAL_PROFILES}/${username}/posts`,
      { method: 'GET' }
    );

    const posts = profileData.data;

    if (!posts || posts.length === 0) {
      userPostsContainer.innerHTML = `<p>No posts available.</p>`;
      return;
    }

    // Render posts
    userPostsContainer.innerHTML = posts
      .map((post) => {
        const mediaUrl = post.media?.url || '/images/placeholder.jpg';
        const mediaAlt = post.media?.alt || 'Post Image';
        const postTitle = post.title || 'Untitled Post';
        const postBody = post.body || '';

        return `
      <div class="post bg-white shadow rounded-lg overflow-hidden">
        <a href="/post/?id=${post.id}" class="block hover:opacity-90">
          <img
            src="${mediaUrl}"
            alt="${mediaAlt}"
            class="w-full h-[300px] object-cover"
          />
          <div class="p-4">
            <h3 class="text-lg font-bold mb-2">${postTitle}</h3>
            <p class="text-gray-600">${postBody}</p>
          </div>
        </a>
      </div>
    `;
      })
      .join('');
  } catch (error) {
    console.error('Error fetching user posts:', error);
  }
}

// Add functionality for the "Update Post" button
const updatePostButton = document.getElementById(
  'toggle-profile-update-button'
);
updatePostButton.addEventListener('click', () => {
  const updateProfileForm = document.getElementById('update-profile');
  if (updateProfileForm.style.display === 'none') {
    updateProfileForm.style.display = 'block';
    updatePostButton.textContent = 'Cancel Update';
  } else {
    updateProfileForm.style.display = 'none';
    updatePostButton.textContent = 'Update Post';
  }
});

// Call the function when the page loads
fetchAndDisplayProfile(); // Load user profile info
fetchAndDisplayUserPosts(); // Fetch and display user's posts
