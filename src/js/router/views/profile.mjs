// src/js/router/views/profile.mjs
import { authGuard } from '../../utilities/authGuard.mjs';
import { loadHTMLHeader } from '../../ui/global/sharedHeader.mjs';
import { API_SOCIAL_PROFILES } from '../../api/constants.mjs';
import { doFetch } from '../../utilities/doFetch.mjs';
import { showAlert } from '../../utilities/alert.mjs';

// ---- boot ----
loadHTMLHeader();
authGuard();

/**
 * Global state for pagination.
 */
let currentPage = 1;
const pageSize = 12;

// ---- DOM refs ----
const userInfoBlock = document.getElementById('user-info');
const userAvatarEl = document.getElementById('user-avatar');
const userNameEl = document.getElementById('user-name');
const userBioEl = document.getElementById('user-bio');

const postsBlock = document.getElementById('user-posts');
const postsContainer = document.getElementById('user-posts-container');

const paginationEl = document.getElementById('pagination');
const prevBtn = document.getElementById('prev-page');
const nextBtn = document.getElementById('next-page');
const pageIndicator = document.getElementById('current-page');

// ---------------- Skeletons ----------------

/**
 * Render a skeleton for the profile header (avatar + name + bio).
 * Keeps the container height stable to avoid CLS.
 */
function renderProfileHeaderSkeleton() {
  userInfoBlock.textContent = '';
  userInfoBlock.innerHTML = `
     <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
      <div class="flex items-center gap-4 animate-pulse">
        <div class="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-gray-200"></div>
        <div>
          <div class="h-6 sm:h-7 w-40 sm:w-48 bg-gray-200 rounded mb-2"></div>
          <div class="h-4 sm:h-5 w-56 sm:w-72 bg-gray-200 rounded"></div>
        </div>
      </div>
         <div class="w-full sm:w-auto order-2 sm:order-none">
      <div class="h-10 w-32 bg-gray-200 rounded animate-pulse hidden sm:block"></div>
    </div>
  `;
}

/**
 * Render N post card skeletons (square image + two lines of text).
 * @param {number} n - number of skeleton cards
 */
function renderPostSkeletons(n = 6) {
  postsContainer.innerHTML = Array.from({ length: n })
    .map(
      () => `
      <div class="post bg-white shadow rounded-sm overflow-hidden">
        <div class="animate-pulse">
          <div class="w-full aspect-square bg-gray-200"></div>
          <div class="p-4">
            <div class="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>`
    )
    .join('');
}

// ---------------- Profile header ----------------

/**
 * Fetch and render the current user's profile (avatar, name, bio).
 * Shows a skeleton while loading.
 *
 * @returns {Promise<void>}
 */
async function fetchAndRenderProfileHeader() {
  // skeleton
  renderProfileHeaderSkeleton();

  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.name) {
      throw new Error('Not logged in');
    }

    const profile = await doFetch(`${API_SOCIAL_PROFILES}/${user.name}`, {
      method: 'GET',
    });

    const data = profile?.data;
    const avatarUrl = data?.avatar?.url || '/images/placeholder.jpg';
    const avatarAlt = data?.avatar?.alt || data?.name || 'User avatar';
    const displayName = data?.name || 'User';
    const bioText = data?.bio ?? '';

    // restore the header markup and populate known fields
    userInfoBlock.innerHTML = `
       <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        <div class="flex items-center gap-4">
          <img id="user-avatar" class="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full object-cover" />
          <div>
            <h1 id="user-name" class="text-lg font-bold sm:text-xl md:text-2xl"></h1>
            <p id="user-bio" class="text-gray-600 text-base md:text-lg"></p>
          </div>
        </div>
             <div class="w-full sm:w-auto order-2 sm:order-none sm:ml-auto">
        <button
          id="toggle-profile-update-button"
          class="text-sm px-3 py-1.5 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 font-semibold mt-6 sm:mt-0"
        >
          Update Profile
        </button>
      </div>
    `;

    // re-bind refs after rewriting innerHTML
    const avatar = document.getElementById('user-avatar');
    const nameEl = document.getElementById('user-name');
    const bioEl = document.getElementById('user-bio');

    avatar.src = avatarUrl;
    avatar.alt = avatarAlt;
    nameEl.textContent = displayName;
    bioEl.textContent = bioText || '';

    // Optional: wire up the toggle button again if you use it elsewhere
    const updateBtn = document.getElementById('toggle-profile-update-button');
    const form = document.getElementById('update-profile');
    updateBtn?.addEventListener('click', () => {
      if (!form) return;
      const show = form.style.display !== 'block';
      form.style.display = show ? 'block' : 'none';
      updateBtn.textContent = show ? 'Cancel Update' : 'Update Profile';
    });
  } catch (err) {
    console.error('Failed to load profile header:', err);
    showAlert('error', 'Could not load profile.');
  }
}

// ---------------- Posts + pagination ----------------

/**
 * Render a grid of post cards (without username line).
 * @param {Array<Object>} posts
 */
function renderPosts(posts) {
  postsContainer.innerHTML = posts
    .map((post, idx) => {
      const mediaUrl = post?.media?.url || '/images/placeholder.jpg';
      const mediaAlt = post?.media?.alt || 'Post image';
      const title = post?.title || 'Untitled Post';
      const body = post?.body || '';

      // First image of first page can be the LCP candidate
      const isLcp = currentPage === 1 && idx === 0;
      const loading = isLcp ? 'eager' : 'lazy';
      const fetchAttr = isLcp ? 'fetchpriority="high"' : '';

      return `
        <div class="post bg-white shadow rounded-sm overflow-hidden">
          <a href="/post/?id=${post.id}" class="block hover:opacity-90">
            <img
              src="${mediaUrl}"
              alt="${mediaAlt}"
              width="600" height="600"
              class="w-full aspect-square object-cover"
              loading="${loading}" ${fetchAttr}
            />
            <div class="p-4">
              <h3 class="text-lg font-bold mb-2">${title}</h3>
              <p class="text-gray-700">${body}</p>
            </div>
          </a>
        </div>
      `;
    })
    .join('');
}

/**
 * Fetch and display the logged-in user's posts with pagination.
 * Keeps layout stable: reserves height, hides pagination until content is ready.
 *
 * @param {number} page
 * @returns {Promise<void>}
 */
async function fetchAndDisplayUserPosts(page = 1) {
  // reserve space so pagination doesn’t jump
  postsContainer.classList.add('min-h-[900px]');
  // hide pagination until we have content
  paginationEl.classList.add('invisible');

  // skeleton while fetching
  renderPostSkeletons(6);

  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.name) throw new Error('Not logged in');

    const res = await doFetch(
      `${API_SOCIAL_PROFILES}/${user.name}/posts?limit=${pageSize}&page=${page}`,
      { method: 'GET' }
    );

    const posts = Array.isArray(res?.data) ? res.data : [];

    if (posts.length === 0) {
      postsContainer.innerHTML = `<p class="text-gray-600">No posts yet.</p>`;
      // keep pagination hidden if nothing to show
      return;
    }

    renderPosts(posts);

    // update & reveal pagination
    pageIndicator.textContent = `Page ${page}`;
    prevBtn.disabled = page <= 1;
    paginationEl.classList.remove('invisible');
  } catch (err) {
    console.error('Error fetching user posts:', err);
    postsContainer.innerHTML =
      '<p class="text-red-600">Error loading posts. Please try again.</p>';
  } finally {
    postsContainer.classList.remove('min-h-[900px]');
  }
}

// ---------------- Pagination bindings ----------------
prevBtn?.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage -= 1;
    fetchAndDisplayUserPosts(currentPage);
  }
});

nextBtn?.addEventListener('click', () => {
  currentPage += 1;
  fetchAndDisplayUserPosts(currentPage);
});

// ---------------- Init ----------------
fetchAndRenderProfileHeader();
fetchAndDisplayUserPosts(currentPage);
