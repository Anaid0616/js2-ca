import { authGuard } from '../../utilities/authGuard.mjs';
import { readPost } from '../../api/post/read.mjs';
import { updatePost } from '../../api/post/update.mjs';

// Ensure the user is authenticated
authGuard();

/**
 * Extract the post ID from the URL query parameters.
 * @type {string | null}
 */
const postId = new URLSearchParams(window.location.search).get('id');
if (!postId) {
  alert('No post ID found. Redirecting to home page.');
  window.location.href = '/';
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

    console.log('Form populated with post data'); // Debugging
  } catch (error) {
    console.error('Error loading post data:', error);
    alert('Failed to load post data. Redirecting to home page.');
    window.location.href = '/';
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

    alert('Post updated successfully!');
    window.location.href = `/post/?id=${postId}`;
  } catch (error) {
    console.error('Error updating post:', error);
    alert('Failed to update post. Please try again.');
  }
});

// Call loadPostData when the page loads
loadPostData();
