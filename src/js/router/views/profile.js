import { authGuard } from "../../utilities/authGuard";
import { loadHTMLHeader } from "../../ui/global/sharedHeader.js";
import { API_SOCIAL_PROFILES } from "../../api/constants.js";
import { headers } from "../../api/headers.js";
import { fetchAndDisplayProfile } from "./profileUser.js";
import "../../ui/profile/update.js";

loadHTMLHeader();
authGuard();

const userPostsContainer = document.getElementById("user-posts-container");

/**
 * Fetch and display posts for the logged-in user.
 * - Retrieves posts from the API and renders them in the `userPostsContainer`.
 * - If no posts are found, displays a "No posts available" message.
 *
 * @async
 * @function fetchAndDisplayUserPosts
 * @throws {Error} If the API request fails or the user is not logged in.
 */
// Function to fetch and display posts
async function fetchAndDisplayUserPosts() {
  try {
    const user = JSON.parse(localStorage.getItem("user")); // Get logged-in user
    if (!user) {
      alert("You must be logged in to view your posts.");
      window.location.href = "/auth/login/";
      return;
    }

    const username = user.name; // Get username

    // Fetch profile data with posts
    const response = await fetch(`${API_SOCIAL_PROFILES}/${username}/posts`, {
      method: "GET",
      headers: headers(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user profile and posts.");
    }

    const profileData = await response.json();

    const posts = profileData.data;

    if (!posts || posts.length === 0) {
      userPostsContainer.innerHTML = `<p>No posts available.</p>`;
      return;
    }

    // Render posts
    userPostsContainer.innerHTML = posts
      .map((post) => {
        const mediaUrl = post.media?.url || "/images/placeholder.jpg";
        const mediaAlt = post.media?.alt || "Post Image";
        const postTitle = post.title || "Untitled Post";
        const postBody = post.body || "";

        return `
          <div class="post">
            <a href="/post/?id=${post.id}">
              <img src="${mediaUrl}" alt="${mediaAlt}" />
              <h3>${postTitle}</h3>
              <p>${postBody}</p>
            </a>
          </div>
        `;
      })
      .join("");
  } catch (error) {
    console.error("Error fetching user posts:", error);
  }
}

// Add functionality for the "Update Post" button
const updatePostButton = document.getElementById(
  "toggle-profile-update-button"
);
updatePostButton.addEventListener("click", () => {
  const updateProfileForm = document.getElementById("update-profile");
  if (updateProfileForm.style.display === "none") {
    updateProfileForm.style.display = "block";
    updatePostButton.textContent = "Cancel Update";
  } else {
    updateProfileForm.style.display = "none";
    updatePostButton.textContent = "Update Post";
  }
});

// Call the function when the page loads
fetchAndDisplayProfile(); // Load user profile info
fetchAndDisplayUserPosts();
