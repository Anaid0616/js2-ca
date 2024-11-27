import { createPost } from "../../api/post/create";

/**
 * Passes data to the createPost function in api/post and handles the response.
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
    console.log("New Post Response:", newPost);

    // Ensure ID exists in the response
    if (newPost && newPost.data && newPost.data.id) {
      alert("Post created successfully!");
      window.location.href = `/post/?id=${newPost.data.id}`; // Redirect to the new post page
    } else {
      throw new Error("API Response does not contain post ID.");
    }
  } catch (error) {
    console.error("Error creating post:", error);
    alert("Error creating post. Please try again.");
  }
}
