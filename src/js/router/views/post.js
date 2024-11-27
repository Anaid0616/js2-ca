import { authGuard } from "../../utilities/authGuard";
import { readPost } from "../../api/post/read";
import { deletePost } from "../../api/post/delete";
import { updatePost } from "../../api/post/update";

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
export async function fetchAndRenderPost() {
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
        <p><em>By: ${author?.name || "Anonymous"}</em></p>
      `;
  } catch (error) {
    console.error("Error fetching post:", error);
    alert("Failed to load the post. Please try again.");
  }
}

// Execute the function to fetch and render the post
fetchAndRenderPost();

// Get the delete button
const deleteButton = document.getElementById("delete-post-button");

// Handle delete post
deleteButton.addEventListener("click", async () => {
  const confirmDelete = confirm("Are you sure you want to delete this post?");
  if (!confirmDelete) return;

  try {
    // Call the deletePost API function
    await deletePost(postId);
    alert("Post deleted successfully!");
    window.location.href = "/"; // Redirect to homepage after deletion
  } catch (error) {
    console.error("Error deleting post:", error);
    alert("Failed to delete post. Please try again.");
  }
});

// Edit Post Button
const editButton = document.getElementById("edit-post-button");

// Redirect to edit.html with the post ID
editButton.addEventListener("click", () => {
  const postId = new URLSearchParams(window.location.search).get("id");
  if (!postId) {
    alert("No post ID found. Cannot edit post.");
    return;
  }
  // Redirect to edit.html with the post ID in the URL
  window.location.href = `/post/edit/?id=${postId}`;
});

// Delete Post Button
document
  .getElementById("delete-post-button")
  .addEventListener("click", async () => {
    const confirmDelete = confirm("Are you sure you want to delete this post?");
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
