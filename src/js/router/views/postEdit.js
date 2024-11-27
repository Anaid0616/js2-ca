import { authGuard } from "../../utilities/authGuard";
import { readPost } from "../../api/post/read.js";
import { updatePost } from "../../api/post/update.js";

// Get the post ID from the URL
const postId = new URLSearchParams(window.location.search).get("id");
if (!postId) {
  alert("No post ID found. Redirecting to home page.");
  window.location.href = "/";
}

// Get form elements
const form = document.getElementById("edit-post-form");
const titleInput = document.getElementById("edit-title");
const bodyInput = document.getElementById("edit-body");
const tagsInput = document.getElementById("edit-tags");
const mediaUrlInput = document.getElementById("edit-media-url");
const mediaAltInput = document.getElementById("edit-media-alt");

// Load the post data into the form
async function loadPostData() {
  try {
    console.log("Attempting to fetch post with ID:", postId); // Debugging
    const response = await readPost(postId);
    console.log("Post data fetched successfully:", response); // Debugging
    console.log("Post ID from URL:", postId);
    console.log("Fetched Post Data:", response);

    const { data: post } = response;

    form.title.value = post.title || "";
    form.body.value = post.body || "";
    form.mediaUrl.value = post.media?.url || "";
    form.mediaAlt.value = post.media?.alt || "";

    console.log("Form populated with post data"); // Debugging
  } catch (error) {
    console.error("Error loading post data:", error);
    alert("Failed to load post data. Redirecting to home page.");
    window.location.href = "/";
  }
}

// Save the updated post data
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const updatedPost = {
    title: titleInput.value,
    body: bodyInput.value,
    tags: tagsInput.value.split(",").map((tag) => tag.trim()), // Convert string back to array
    media: {
      url: mediaUrlInput.value,
      alt: mediaAltInput.value,
    },
  };

  try {
    await updatePost(postId, updatedPost);
    alert("Post updated successfully!");
    window.location.href = `/post/?id=${postId}`;
  } catch (error) {
    console.error("Error updating post:", error);
    alert("Failed to update post. Please try again.");
  }
});

// Load post data on page load
loadPostData();
