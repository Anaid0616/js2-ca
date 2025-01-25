import { authGuard } from '../../utilities/authGuard.mjs';
import { showModal } from '../../utilities/modal.mjs';
import { readPost } from '../../api/post/read';
import { deletePost } from '../../api/post/delete';
import { showAlert } from '../../utilities/alert.mjs';

// Ensure the user is authenticated
authGuard();

// Get the post container and query string parameters
/**
 * The container element where the post will be rendered.
 * @type {HTMLElement}
 */
const postContainer = document.querySelector('.post');

/**
 * Parse the query string parameters from the URL.
 * @type {URLSearchParams}
 */
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

/**
 * Extract the post ID from the URL query parameters.
 * @type {string | null}
 */
const postId = urlParams.get('id'); // Get the post ID from the URL

// Redirect if no post ID is provided
if (!postId) {
  showAlert('error', 'No post ID provided. Redirecting to home page.');
  setTimeout(() => {
    window.location.href = '/'; // Redirect to the home page
  }, 1500);
}

/**
 * Fetches the post by ID and renders it in the DOM.
 *
 * @async
 * @returns {Promise<void>} - A promise that resolves when the post is fetched and rendered.
 * @throws Will display an alert if the post cannot be loaded.
 */
// Fetch and display the post
async function fetchAndRenderPost() {
  try {
    // Fetch the post using its ID
    const response = await readPost(postId);

    // Extract post data
    const { data: post } = response; // Destructure the 'data' field from the response

    // Destructure post properties for rendering
    const { media, title, body, author } = post;

    // Validate media and provide fallback if media is missing
    const mediaUrl = media?.url || '/images/placeholder.jpg'; // Placeholder for invalid image
    const mediaAlt = media?.alt || 'Post Image';
    const authorName = author?.name || 'Anonymous';

    // Update the DOM with the post data
    postContainer.innerHTML = `
        <img src="${mediaUrl}" alt="${mediaAlt}" />
       
          <p style="font-weight: bold; font-size: 0.9rem; color: #333; margin: 0;">
      ${authorName}
    </p>
    <h2 style="font-weight: bold; font-size: 1rem; color: black; margin: 0;">
      ${title || 'No Title'}
    </h2>
     
  
  <p style="font-size: 1rem; color: #333; margin-top: -18px; line-height: 1.5;">
    ${body || 'No Description Available'}
  </p>
`;
    // Attach event listeners for edit and delete buttons after rendering
    attachEventListeners();
  } catch (error) {
    console.error('Error fetching post:', error);
    showAlert('error', 'Failed to load the post. Please try again.');
    setTimeout(() => {
      window.location.href = '/'; // Redirect to the home page
    }, 1500);
  }
}

// Create buttons dynamically and add event listeners
/**
 * The container element for the post action buttons (Edit and Delete).
 * @type {HTMLElement}
 */
const postButtons = document.querySelector('.post-buttons');
postButtons.innerHTML = `
<button id="edit-post-button" class="text-sm px-3 py-1 bg-[#59D1AD] text-black rounded hover:bg-[#47c39a] font-semibold mt-6 sm:mt-0">
  Edit Post
</button>
<button id="delete-post-button" class="text-sm px-3 py-1.5 bg-gray-300 text-gray-800 rounded hover:bg-gray-400  font-semibold mt-6 sm:mt-0">
  Delete Post
</button>
`;

/**
 * Attach event listeners to the dynamically created buttons.
 *
 * - Edit Button: Redirects to the post edit page.
 * - Delete Button: Deletes the post after user confirmation.
 */
function attachEventListeners() {
  // Edit Post Button
  const editButton = document.getElementById('edit-post-button');
  if (editButton) {
    editButton.addEventListener('click', () => {
      window.location.href = `/post/edit/?id=${postId}`;
    });
  }
}

// Delete Post Button
const deleteButton = document.getElementById('delete-post-button');
if (deleteButton) {
  deleteButton.addEventListener('click', async () => {
    const confirmed = await showModal(
      'Are you sure you want to delete this post?',
      'Delete',
      'Cancel'
    );

    if (confirmed) {
      try {
        const isDeleted = await deletePost(postId);
        if (isDeleted) {
          showAlert('success', 'Post deleted successfully!');
          setTimeout(() => {
            window.location.href = '/profile/';
          }, 1500);
        } else {
          throw new Error('API did not confirm post deletion.');
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        showAlert('error', 'Failed to delete post. Please try again.');
      }
    }
  });
}

// Execute the function to fetch and render the post
fetchAndRenderPost();
