import { authGuard } from "../../utilities/authGuard";
import { readPostsByUser } from "../../api/post/read.js";

authGuard();

const userPostsContainer = document.getElementById("user-posts-container");

async function fetchAndDisplayUserPosts() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("You must be logged in to view your posts.");
      window.location.href = "/auth/login/";
      return;
    }

    const username = user.name;
    const response = await readPostsByUser(username, 12, 1);
    const posts = response.data;

    // Render user posts
    userPostsContainer.innerHTML = posts
      .map((post) => {
        console.log(post.media); // Log to verify the structure of media
        const mediaUrl = post.media?.url || "placeholder.jpg"; // Use media.url or fallback to placeholder
        const mediaAlt = post.media?.alt || "Post Image"; // Use media.alt or fallback text
        return `
        <div class="post">
          <img src="${mediaUrl}" alt="${mediaAlt}" />
          <h3>${post.title}</h3>
          <p>${post.body}</p>
        </div>
      `;
      })
      .join("");
  } catch (error) {
    console.error("Error fetching user posts:", error);
  }
}

// Fetch user posts on page load
fetchAndDisplayUserPosts();
