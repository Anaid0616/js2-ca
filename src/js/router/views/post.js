import { authGuard } from "../../utilities/authGuard";
import { readPost } from "../../api/post/read";
import { deletePost } from "../../api/post/delete";

// Ensure the user is authenticated
authGuard();

// Get the post container and query string parameters
const postContainer = document.querySelector(".post");
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const postId = urlParams.get("id"); // Get the post ID from the URL

// Redirect if no post ID is provided
if (!postId) {
  alert("No post ID provided. Redirecting to home page.");
  window.location.href = "/";
}

// Fetch and display the post
async function fetchAndRenderPost() {
  try {
    console.log("Fetching post with ID:", postId); // Debugging

    // Fetch the post using its ID
    const response = await readPost(postId);
    console.log("Post data:", response); // Debugging

    // Extract post data
    const { data: post } = response; // Destructure the 'data' field from the response

    // Destructure post properties for rendering
    const { media, title, body, author } = post;

    // Validate media and provide fallback if media is missing
    const mediaUrl =
      media?.url || "https://i.postimg.cc/j2K0443Z/placeholder.jpg"; // Placeholder for invalid image
    const mediaAlt = media?.alt || "Post Image";
    const authorName = author?.name || "Anonymous"; // Use author.name if it exists

    // Update the DOM with the post data
    postContainer.innerHTML = `
        <img src="${mediaUrl}" alt="${mediaAlt}" />
        <h2>${title || "No Title"}</h2>
        <p>${body || "No Description Available"}</p>
        <p><em>By: ${authorName}</em></p>
      `;

    // Attach event listeners for edit and delete buttons after rendering
    attachEventListeners();
  } catch (error) {
    console.error("Error fetching post:", error);
    alert("Failed to load the post. Please try again.");
  }
}

// Create buttons dynamically and add event listeners
const postButtons = document.querySelector(".post-buttons");
postButtons.innerHTML = `
     <button id="edit-post-button">Edit Post</button>
     <button id="delete-post-button">Delete Post</button>
   `;

// Function to attach event listeners
function attachEventListeners() {
  // Edit Post Button
  const editButton = document.getElementById("edit-post-button");
  if (editButton) {
    editButton.addEventListener("click", () => {
      window.location.href = `/post/edit/?id=${postId}`;
    });
  }

  // Delete Post Button
  const deleteButton = document.getElementById("delete-post-button");
  if (deleteButton) {
    deleteButton.addEventListener("click", async () => {
      const confirmDelete = confirm(
        "Are you sure you want to delete this post?"
      );
      if (!confirmDelete) return;

      try {
        await deletePost(postId); // Call your API
        alert("Post deleted successfully!");
        window.location.href = "/profile/"; // Redirect to profile or another page after deletion
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("Failed to delete post. Please try again.");
      }
    });
  }
}

// Execute the function to fetch and render the post
fetchAndRenderPost();
