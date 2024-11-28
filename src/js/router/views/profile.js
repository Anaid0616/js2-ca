import { authGuard } from "../../utilities/authGuard";
import { readPostsByUser } from "../../api/post/read.js";
import { loadHTMLHeader } from "../../ui/global/sharedHeader.js";
import { onUpdateProfile } from "../../ui/profile/update.js";
import { readProfile } from "../../api/profile/read.js";

loadHTMLHeader();
authGuard();

const userPostsContainer = document.getElementById("user-posts-container");
const prevButton = document.getElementById("prev-page");
const nextButton = document.getElementById("next-page");
const currentPageDisplay = document.getElementById("current-page");
const updateProfileForm = document.getElementById("update-profile");
const toggleFormButton = document.createElement("button");

// Create and configure the toggle button
toggleFormButton.id = "toggle-form-button";
toggleFormButton.textContent = "Edit Profile";
document
  .querySelector("main")
  .insertBefore(toggleFormButton, updateProfileForm);

// Hide the form initially
updateProfileForm.style.display = "none";

// Toggle the visibility of the form
toggleFormButton.addEventListener("click", () => {
  if (updateProfileForm.style.display === "none") {
    updateProfileForm.style.display = "block";
    toggleFormButton.textContent = "Cancel Editing";
  } else {
    updateProfileForm.style.display = "none";
    toggleFormButton.textContent = "Edit Profile";
  }
});

// Populate the profile form with existing user data
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

// Attach the event listener to the Update Profile form
const updateProfileFormElement = document.forms.updateProfileForm;
updateProfileFormElement.addEventListener("submit", onUpdateProfile);

// Call this function when the profile page loads
populateProfileForm();

// Pagination functionality remains the same
function isValidImageUrl(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

let currentPage = 1;

async function fetchAndDisplayUserPosts(page = 1) {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("You must be logged in to view your posts.");
      window.location.href = "/auth/login/";
      return;
    }

    const username = user.name;
    console.log("Fetching posts for username:", username);
    console.log("Fetching page:", page);

    const response = await readPostsByUser(username, 24, page);
    console.log("API Response:", response);

    const posts = response.data;
    const filteredPosts = posts.filter(
      (post) => post.author?.name === username
    );

    const validPosts = [];
    for (const post of posts) {
      if (post.media && post.media.url) {
        const isValid = await isValidImageUrl(post.media.url);
        if (isValid) validPosts.push(post);
      }
      if (validPosts.length >= 12) break;
    }

    if (validPosts.length === 0) {
      userPostsContainer.innerHTML = `<p>No posts available.</p>`;
      return;
    }

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

    currentPageDisplay.textContent = `Page ${page}`;
  } catch (error) {
    console.error("Error fetching user posts:", error);
    userPostsContainer.innerHTML = `<p>Error loading posts. Please try again later.</p>`;
  }
}

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

fetchAndDisplayUserPosts(currentPage);
