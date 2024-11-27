import { authGuard } from "../../utilities/authGuard";
import { readPostsByUser } from "../../api/post/read.js";
import { loadHTMLHeader } from "../../ui/global/sharedHeader.js";
import { onUpdateProfile } from "../../ui/profile/update.js";
import { readProfile } from "../../api/profile/read.js";

async function populateProfileForm() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const username = user?.name;

    if (!username) {
      console.error("No logged-in user found.");
      return;
    }

    const profile = await readProfile(username);
    console.log("Profile data:", profile);

    const form = document.forms.updateProfileForm;
    form.avatar.value = profile.avatar?.url || "";
    form.banner.value = profile.banner?.url || "";
    form.bio.value = profile.bio || "";
  } catch (error) {
    console.error("Error populating profile form:", error);
  }
}

// Call this function when the profile page loads
populateProfileForm();

// Attach the event listener to the Update Profile form
const updateProfileForm = document.forms.updateProfileForm;
updateProfileForm.addEventListener("submit", onUpdateProfile);

loadHTMLHeader();

authGuard();

const userPostsContainer = document.getElementById("user-posts-container");
const prevButton = document.getElementById("prev-page");
const nextButton = document.getElementById("next-page");
const currentPageDisplay = document.getElementById("current-page");

function isValidImageUrl(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true); // If the image loads, the URL is valid
    img.onerror = () => resolve(false); // If an error occurs, the URL is invalid
    img.src = url; // Start loading the image
  });
}

let currentPage = 1; // Start with page 1

async function fetchAndDisplayUserPosts(page = 1) {
  try {
    const user = JSON.parse(localStorage.getItem("user")); // Get logged-in user
    if (!user) {
      alert("You must be logged in to view your posts.");
      window.location.href = "/auth/login/";
      return;
    }

    const username = user.name; // Get username
    console.log("Fetching posts for username:", username); // Debugging
    console.log("Fetching page:", page); // Debugging

    // Fetch posts by the logged-in user
    const response = await readPostsByUser(username, 24, page); // Fetch posts with pagination
    console.log("API Response:", response); // Debugging

    const posts = response.data;

    // **Frontend Filter**: Filter posts by the logged-in user (if backend doesn't do it)
    const filteredPosts = posts.filter(
      (post) => post.author?.name === username
    );

    // Filter out posts with invalid or missing image URLs
    const validPosts = [];
    for (const post of posts) {
      if (post.media && post.media.url) {
        const isValid = await isValidImageUrl(post.media.url);
        if (isValid) validPosts.push(post);
      }
      if (validPosts.length >= 12) break; // Limit to 12 posts per page
    }

    // Handle cases where no valid posts are found
    if (validPosts.length === 0) {
      userPostsContainer.innerHTML = `<p>No posts available.</p>`;
      return;
    }

    // Render exactly 12 valid posts
    userPostsContainer.innerHTML = validPosts
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
    console.error("Error fetching user posts:", error);
    userPostsContainer.innerHTML = `<p>Error loading posts. Please try again later.</p>`;
  }
}

// Pagination controls
prevButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    fetchAndDisplayUserPosts(currentPage);
  }
});

nextButton.addEventListener("click", () => {
  currentPage++;
  fetchAndDisplayUserPosts(currentPage);
});

// Initial fetch
fetchAndDisplayUserPosts(currentPage);
