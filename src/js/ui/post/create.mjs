import { createPost } from "../../api/post/create";
import { showAlert } from "../../utilities/alert.mjs";
// Import the form handler
import { initializeFormHandler } from "../../utilities/formHandler.mjs";

// Call the function to attach the form submission logic
initializeFormHandler();

/**
 * Handles the creation of a new post by collecting data from the form,
 * sending it to the API, and managing the response.
 *
 * @async
 * @function onCreatePost
 * @param {Event} event - The form submission event.
 * @returns {Promise<void>} - Resolves when the post is successfully created or an error is handled.
 * @throws {Error} - Displays an error alert if post creation fails.
 *
 * @example
 * // Usage:
 * document.getElementById("create-post-form").addEventListener("submit", onCreatePost);
 */
export async function onCreatePost(event) {
  event.preventDefault(); // Prevent the form from reloading the page

  const form = event.target;
  const title = form.title.value;
  const body = form.body.value;
  const tags = form.tags.value.split(",").map((tag) => tag.trim()); // Split tags into an array
  const mediaUrl = form.mediaUrl.value;
  const mediaAlt = form.mediaAlt.value;

  try {
    const postData = {
      title,
      body,
      tags,
      media: { url: mediaUrl, alt: mediaAlt },
    };

    const newPost = await createPost(postData); // Call the createPost function

    // Ensure ID exists in the response
    if (newPost && newPost.data && newPost.data.id) {
      showAlert("success", "Post created successfully!");

      setTimeout(() => {
        window.location.href = `/post/?id=${newPost.data.id}`; // Redirect to the new post page
      }, 1500);
    } else {
      throw new Error("API Response does not contain post ID.");
    }
  } catch (error) {
    console.error("Error creating post:", error);
    showAlert("error", "Error creating post. Please try again.");
  }
}
