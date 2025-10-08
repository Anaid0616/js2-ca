import { authGuard } from '../../utilities/authGuard.mjs';
import { readPost } from '../../api/post/read.mjs';
import { updatePost } from '../../api/post/update.mjs';
import { showAlert } from '../../utilities/alert.mjs';

import { loadHTMLHeader } from '../../ui/global/sharedHeader.mjs';
import { setLogoutListener } from '../../ui/global/logout.mjs';

loadHTMLHeader();
authGuard();
setLogoutListener();

/**
 * Extract the post ID from the URL query parameters.
 * @type {string | null}
 */
const postId = new URLSearchParams(window.location.search).get('id');
if (!postId) {
  showAlert('error', 'No post ID found. Redirecting to home page.');
  setTimeout(() => {
    window.location.href = '/';
  }, 1500);
}

// Get form elements
/**
 * HTML form element for editing a post.
 * @type {HTMLFormElement}
 */
const form = document.getElementById('edit-post-form');

/**
 * HTML input elements for editing the post fields.
 * @type {HTMLInputElement}
 */
const titleInput = document.getElementById('edit-title');
const bodyInput = document.getElementById('edit-body');
const tagsInput = document.getElementById('edit-tags');
const mediaUrlInput = document.getElementById('edit-media-url');
const mediaAltInput = document.getElementById('edit-media-alt');

/**
 * Loads the post data and populates the form fields.
 *
 * @async
 * @returns {Promise<void>} - Resolves when the post data is loaded.
 * @throws {Error} - Redirects to the home page if post data fails to load.
 */
async function loadPostData() {
  try {
    const response = await readPost(postId);

    // Check if data exists
    if (!response || !response.data) {
      throw new Error('Post data not found.');
    }

    const { data: post } = response;

    // Populate the form fields with fetched post data
    titleInput.value = post.title || '';
    bodyInput.value = post.body || '';
    tagsInput.value = post.tags?.join(', ') || ''; // Join array of tags into a comma-separated string
    mediaUrlInput.value = post.media?.url || '';
    mediaAltInput.value = post.media?.alt || '';
  } catch (error) {
    console.error('Error loading post data:', error);
    showAlert('error', 'Failed to load post data. Redirecting to home page.');
    setTimeout(() => {
      window.location.href = '/';
    }, 1500);
  }
}

// Save the updated post data
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const updatedPost = {
    title: titleInput.value,
    body: bodyInput.value,
    tags: tagsInput.value.split(',').map((tag) => tag.trim()), // Convert string back to array
    media: {
      url: mediaUrlInput.value,
      alt: mediaAltInput.value,
    },
  };

  try {
    const updated = await updatePost(postId, updatedPost);

    showAlert('success', 'Post updated successfully!');
    setTimeout(() => {
      window.location.href = `/post/?id=${postId}`;
    }, 1500); // Redirect after 1.5 seconds to give time for the alert to be seen
  } catch (error) {
    console.error('Error updating post:', error);
    showAlert('error', 'Failed to update post. Please try again.');
  }
});

// Call loadPostData when the page loads
loadPostData();
