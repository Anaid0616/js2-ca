import { authGuard } from "../../utilities/authGuard";
import { setLogoutListener } from "../../ui/global/logout";
import { readPosts } from "../../api/post/read.js";
import { loadHTMLHeader } from "../../ui/global/sharedHeader.js";

loadHTMLHeader();

authGuard();

// Attach the logout listener when the home page loads
setLogoutListener();

// Render posts in DOM and Pagination
let currentPage = 1;
const postsContainer = document.getElementById("posts-container");
const prevButton = document.getElementById("prev-page");
const nextButton = document.getElementById("next-page");
const currentPageDisplay = document.getElementById("current-page");

// Helper function to validate image URLs
function isValidImageUrl(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true); // If the image loads, the URL is valid
    img.onerror = () => resolve(false); // If an error occurs, the URL is invalid
    img.src = url; // Start loading the image
  });
}

async function fetchAndDisplayPosts(page = 1) {
  try {
    // Fetch more posts than needed to account for filtering
    const response = await readPosts(24, page);
    const posts = response.data;

    // Filter out posts with missing or invalid image URLs
    const validPosts = [];
    for (const post of posts) {
      if (post.media && post.media.url) {
        const isValid = await isValidImageUrl(post.media.url);
        if (isValid) validPosts.push(post);
      }
      if (validPosts.length >= 12) break; // Stop after collecting 12 valid posts
    }

    // Handle cases where no valid posts are found
    if (validPosts.length === 0) {
      postsContainer.innerHTML = `<p>No posts available.</p>`;
      return;
    }

    // Render exactly 12 valid posts
    postsContainer.innerHTML = validPosts
      .slice(0, 12)
      .map((post) => {
        const mediaUrl = post.media.url;
        const mediaAlt = post.media.alt || "Post Image";
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

    // Update pagination display
    currentPageDisplay.textContent = `Page ${page}`;
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}

// Pagination controls
prevButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    fetchAndDisplayPosts(currentPage);
  }
});

nextButton.addEventListener("click", () => {
  currentPage++;
  fetchAndDisplayPosts(currentPage);
});

// Initial fetch
fetchAndDisplayPosts(currentPage);
