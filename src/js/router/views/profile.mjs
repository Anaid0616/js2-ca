// src/js/router/views/profile.mjs
import { authGuard } from '../../utilities/authGuard.mjs';
import { loadHTMLHeader } from '../../ui/global/sharedHeader.mjs';
import { setLogoutListener } from '../../ui/global/logout.mjs';
import { API_SOCIAL_PROFILES } from '../../api/constants.mjs';
import { doFetch } from '../../utilities/doFetch.mjs';
import { showAlert } from '../../utilities/alert.mjs';
import {
  profileHeaderSkeletonHTML,
  profilePostCardSkeletonHTML,
  renderGridSkeleton,
} from '../../utilities/skeletons.mjs';
import { followButtonHtml, mountFollow } from '@/js/ui/profile/follow.mjs';
import {
  countsRowHtml,
  mountCountsDropdowns,
} from '@/js/ui/profile/counts.mjs';

// ---- boot ----
loadHTMLHeader();
authGuard();
setLogoutListener();

/** Pagination state */
let currentPage = 1;
/** Page size */
const pageSize = 12;

// ---- DOM refs ----
const userInfoBlock = document.getElementById('user-info');
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

/**
 * Render the profile header skeleton into #user-info.
 * Keeps layout stable to avoid CLS.
 */
function renderHeaderSkeleton() {
  userInfoBlock.innerHTML = profileHeaderSkeletonHTML();
}

/**
 * Build the final header HTML (avatar + name + bio + action slot).
 * @param {{avatar?:{url?:string,alt?:string}, name?:string, bio?:string}} data
 * @returns {string}
 */
function headerHtml(data, followers, following) {
  const avatarUrl = data?.avatar?.url || '/images/placeholder.jpg';
  const avatarAlt = data?.avatar?.alt || data?.name || 'User avatar';
  const displayName = data?.name || targetName || 'User';
  const bioText = data?.bio ?? '';

  return `
    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
      <div class="flex items-center gap-4">
       <img
  id="user-avatar"
  src="${avatarUrl}"
  alt="${avatarAlt}"
  width="160" height="160"
  class="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full object-cover my-2"
  loading="eager"
  decoding="async"
  fetchpriority="low"
/>
        <div>
          <h1 id="user-name" class="text-lg font-bold sm:text-xl md:text-2xl">${displayName}</h1>
           ${countsRowHtml(followers, following)}
            <p id="user-bio" class="text-gray-600 text-base md:text-lg">${bioText}</p>
        </div>
      </div>

      <!-- Action slot: Update (self) or Follow button (others) -->
      <div id="profile-action-slot" class="w-full sm:w-auto order-2 sm:order-none sm:ml-auto"></div>
    </div>
  `;
}

// ---------------- Profile header ----------------

/**
 * Fetch and render the selected user's profile (avatar, name, bio).
 * Shows a skeleton while loading and then replaces it with the final header.
 */
async function fetchAndRenderProfileHeader() {
  renderHeaderSkeleton();

  try {
    const profile = await doFetch(
      `${API_SOCIAL_PROFILES}/${encodeURIComponent(
        targetName
      )}?_following=true&_followers=true`,
      { method: 'GET' }
    );

    const data = profile?.data || {};
    const isFollowing = !!data._following;
    const followers = Array.isArray(data.followers) ? data.followers : [];
    const following = Array.isArray(data.following) ? data.following : [];

    document.getElementById('profile-spacer')?.remove();
    // Render final header
    userInfoBlock.innerHTML = headerHtml(data, followers, following);
    mountCountsDropdowns(userInfoBlock);

    // Mount action (self: Update; others: Follow)
    const actionSlot = document.getElementById('profile-action-slot');
    if (!actionSlot) return;

    if (isSelf) {
      actionSlot.innerHTML = `
        <button
          id="toggle-profile-update-button"
          class="text-sm px-3 py-1.5 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 font-semibold"
          type="button">
          Update Profile
        </button>`;
      const updateBtn = document.getElementById('toggle-profile-update-button');
      const form = document.getElementById('update-profile');
      updateBtn?.addEventListener('click', () => {
        if (!form) return;
        const show = form.style.display !== 'block';
        form.style.display = show ? 'block' : 'none';
        updateBtn.textContent = show ? 'Cancel Update' : 'Update Profile';
      });
    } else {
      actionSlot.innerHTML = followButtonHtml(isFollowing);
      mountFollow(targetName, isFollowing);
    }
  } catch (err) {
    console.error('Failed to load profile header:', err);
    showAlert('error', 'Could not load profile.');
    // Keep skeleton or show a minimal fallback if you prefer
  }
}

// ---------------- Posts + pagination ----------------
/**
 * Render the posts grid (no username row).
 * @param {Array<Object>} posts
 */
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
  srcset="
    ${mediaUrl}?w=320 320w,
    ${mediaUrl}?w=480 480w,
    ${mediaUrl}?w=600 600w
  "
  sizes="(max-width: 640px) 50vw, 33vw"
  alt="${mediaAlt}"
  width="600" height="600"
  class="w-full aspect-square object-cover"
  loading="${loading}" ${fetchAttr}
  decoding="async"
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
 * @param {number} [page=1]
 */
async function fetchAndDisplayUserPosts(page = 1) {
  postsContainer.classList.add('min-h-[900px]');
  paginationEl.classList.add('invisible');

  // Skeleton while fetching
  renderGridSkeleton(postsContainer, 6, profilePostCardSkeletonHTML);

  try {
    const res = await doFetch(
      `${API_SOCIAL_PROFILES}/${encodeURIComponent(
        targetName
      )}/posts?limit=${pageSize}&page=${page}`,
      { method: 'GET' }
    );

    const posts = Array.isArray(res?.data) ? res.data : [];

    if (posts.length === 0) {
      postsContainer.innerHTML = `<p class="text-gray-600">No posts yet.</p>`;
      paginationEl.classList.add('invisible');
      return;
    }

    renderPosts(posts);

    // Simple pagination logic without relying on meta
    const hasNextPage = posts.length === pageSize;
    const hasPrevPage = page > 1;

    pageIndicator.textContent = `Page ${page}`;
    prevBtn.disabled = !hasPrevPage;
    nextBtn.disabled = !hasNextPage;

    const shouldShow = hasPrevPage || hasNextPage;
    paginationEl.classList.toggle('invisible', !shouldShow);
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
