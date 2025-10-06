// src/js/router/views/profile.mjs
import { authGuard } from '../../utilities/authGuard.mjs';
import { loadHTMLHeader } from '../../ui/global/sharedHeader.mjs';
import { API_SOCIAL_PROFILES } from '../../api/constants.mjs';
import { doFetch } from '../../utilities/doFetch.mjs';
import { showAlert } from '../../utilities/alert.mjs';
import {
  profilePostCardSkeletonHTML,
  renderGridSkeleton,
} from '../../utilities/skeletons.mjs';

// ---- boot ----
loadHTMLHeader();
authGuard();

/** Pagination state */
let currentPage = 1;
/** Page size */
const pageSize = 12;

// ---- DOM refs ----
const userInfoBlock = document.getElementById('user-info');
const profileSkeleton = document.getElementById('profile-skeleton');
const profileReal = document.getElementById('profile-real');
const avatarEl = document.getElementById('user-avatar');
const nameEl = document.getElementById('user-name');
const bioEl = document.getElementById('user-bio');
const updateBtn = document.getElementById('toggle-profile-update-button');

const postsContainer = document.getElementById('user-posts-container');

const paginationEl = document.getElementById('pagination');
const prevBtn = document.getElementById('prev-page');
const nextBtn = document.getElementById('next-page');
const pageIndicator = document.getElementById('current-page');

// ---- which profile are we viewing? ----
const qs = new URLSearchParams(window.location.search);
const viewedName = qs.get('name');
const me = JSON.parse(localStorage.getItem('user'));
const myName = me?.name || null;
/** Target username (fallback to self) */
const targetName = viewedName || myName;
/** Is this my own profile? */
const isSelf =
  !!myName && !!targetName && targetName.toLowerCase() === myName.toLowerCase();

if (!targetName) {
  showAlert('error', 'No profile name provided.');
  // Optionally redirect
  // window.location.href = '/';
}

// ---------------- Skeleton helpers ----------------
function showHeaderSkeleton() {
  profileSkeleton.classList.remove('hidden');
  profileReal.classList.add('hidden');
}
function showHeaderReal() {
  profileSkeleton.classList.add('hidden');
  profileReal.classList.remove('hidden');
}

// ---------------- Profile header ----------------
/**
 * Fetch and render the selected user's profile (avatar, name, bio).
 * Shows the built-in skeleton while loading.
 */
async function fetchAndRenderProfileHeader() {
  showHeaderSkeleton();

  try {
    const profile = await doFetch(`${API_SOCIAL_PROFILES}/${targetName}`, {
      method: 'GET',
    });

    const data = profile?.data;
    const avatarUrl = data?.avatar?.url || '/images/placeholder.jpg';
    const avatarAlt = data?.avatar?.alt || data?.name || 'User avatar';
    const displayName = data?.name || targetName || 'User';
    const bioText = data?.bio ?? '';

    // Populate existing DOM
    avatarEl.src = avatarUrl;
    avatarEl.alt = avatarAlt;
    nameEl.textContent = displayName;
    bioEl.textContent = bioText;

    // Show/hide update button depending on self
    if (isSelf) {
      updateBtn?.classList.remove('hidden');
      // Wire toggle for the update form if present
      const form = document.getElementById('update-profile');
      updateBtn?.addEventListener('click', () => {
        if (!form) return;
        const show = form.style.display !== 'block';
        form.style.display = show ? 'block' : 'none';
        updateBtn.textContent = show ? 'Cancel Update' : 'Update Profile';
      });
    } else {
      updateBtn?.classList.add('hidden');
    }

    showHeaderReal();
  } catch (err) {
    console.error('Failed to load profile header:', err);
    showAlert('error', 'Could not load profile.');
    // Keep skeleton hidden to avoid duplicate visuals
    showHeaderReal();
  }
}

// ---------------- Posts + pagination ----------------
/** Render post cards grid */
function renderPosts(posts) {
  postsContainer.innerHTML = posts
    .map((post, idx) => {
      const mediaUrl = post?.media?.url || '/images/placeholder.jpg';
      const mediaAlt = post?.media?.alt || 'Post image';
      const title = post?.title || 'Untitled Post';
      const body = post?.body || '';

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
 * Fetch and display the target user's posts with pagination.
 * Hides pagination if only one page.
 */
async function fetchAndDisplayUserPosts(page = 1) {
  // Reserve space so pagination doesn’t jump
  postsContainer.classList.add('min-h-[900px]');
  // Hide pagination until we know we need it
  paginationEl.classList.add('invisible');

  // Skeleton while fetching
  renderGridSkeleton(postsContainer, 6, profilePostCardSkeletonHTML);

  try {
    const res = await doFetch(
      `${API_SOCIAL_PROFILES}/${targetName}/posts?limit=${pageSize}&page=${page}`,
      { method: 'GET' }
    );

    const posts = Array.isArray(res?.data) ? res.data : [];

    // No posts
    if (posts.length === 0) {
      postsContainer.innerHTML = `<p class="text-gray-600">No posts yet.</p>`;
      paginationEl.classList.add('invisible');
      return;
    }

    renderPosts(posts);

    // Determine if there is more than one page
    // If API meta is unavailable, fallback to simple length check.
    const hasNextPage = posts.length === pageSize; // if page is "full", assume next exists
    const hasPrevPage = page > 1;

    pageIndicator.textContent = `Page ${page}`;
    prevBtn.disabled = !hasPrevPage;
    nextBtn.disabled = !hasNextPage;

    // Only show pagination if there is more than one page
    const shouldShowPagination = hasPrevPage || hasNextPage;
    if (shouldShowPagination) {
      paginationEl.classList.remove('invisible');
    } else {
      paginationEl.classList.add('invisible');
    }
  } catch (err) {
    console.error('Error fetching user posts:', err);
    postsContainer.innerHTML =
      '<p class="text-red-600">Error loading posts. Please try again.</p>';
    paginationEl.classList.add('invisible');
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
