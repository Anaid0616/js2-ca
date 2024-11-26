import { createPost } from "../../api/post/create";
/**
 * Passes data to the createPost function in api/post and handles the response
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

    alert("Post created successfully!");
    window.location.href = `/post/?id=${newPost.id}`; // Redirect to the new post page
  } catch (error) {
    alert("Error creating post. Please try again.");
  }
}
