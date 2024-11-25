import { authGuard } from "../../utilities/authGuard";
import { setLogoutListener } from "../../ui/global/logout";
import { readPosts } from "../../api/post/read.js";

authGuard();

// Attach the logout listener when the home page loads
setLogoutListener();

// Render posts in DOM and Pagination
let currentPage = 1;
const postsContainer = document.getElementById("posts-container");
const prevButton = document.getElementById("prev-page");
const nextButton = document.getElementById("next-page");
const currentPageDisplay = document.getElementById("current-page");

async function fetchAndDisplayPosts(page = 1) {
  try {
    // Fetch posts for the current page
    const response = await readPosts(12, page);
    const posts = response.data;

    // Clear the container and render posts
    postsContainer.innerHTML = posts
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

// Links visibility login and logout
const token = localStorage.getItem("token");
const loginLink = document.querySelector("a[href='./auth/login/']");
const registerLink = document.querySelector("a[href='./auth/register/']");
const logoutButton = document.querySelector("#logout-button");

if (token) {
  // User is logged in
  loginLink.style.display = "none";
  registerLink.style.display = "none";
  logoutButton.style.display = "block";
} else {
  // User is not logged in
  loginLink.style.display = "block";
  registerLink.style.display = "block";
  logoutButton.style.display = "none";
}
