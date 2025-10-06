import { authGuard } from '../../utilities/authGuard.mjs';
import { setLogoutListener } from '../../ui/global/logout.mjs';
import { readPosts } from '../../api/post/read.mjs';
import { loadHTMLHeader } from '../../ui/global/sharedHeader.mjs';
import {
  feedPostCardSkeletonHTML,
  renderGridSkeleton,
} from '../../utilities/skeletons.mjs';

loadHTMLHeader();

authGuard();

// Attach the logout listener when the home page loads
setLogoutListener();

// Render posts in DOM and Pagination
let currentPage = 1;
const block = document.getElementById('posts-block');
const postsContainer = document.getElementById('posts-container');
const prevButton = document.getElementById('prev-page');
const nextButton = document.getElementById('next-page');
const currentPageDisplay = document.getElementById('current-page');

// Helper function to validate image URLs
function isValidImageUrl(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true); // If the image loads, the URL is valid
    img.onerror = () => resolve(false); // If an error occurs, the URL is invalid
    img.src = url; // Start loading the image
  });
}

/**
 * Fetches posts from the API and displays them in the DOM.
 *
 * @async
 * @param {number} [page=1] - The page number to fetch.
 * @returns {Promise<void>} - A promise that resolves when posts are fetched and rendered.
 *
 * @example
 * fetchAndDisplayPosts(1);
 */
async function fetchAndDisplayPosts(page = 1) {
  const pagination = document.getElementById('pagination');

  try {
    // Reserve space so pagination doesn't jump up
    postsContainer.classList.add('min-h-[900px]');
    postsContainer.setAttribute('aria-busy', 'true');

    // Skeleton
    postsContainer.innerHTML = feedPostCardSkeletonHTML(12);
    block.style.visibility = 'visible';

    // Fetch posts
    const response = await readPosts(24, page);
    const posts = response.data;

    const fallbackImageUrl = '/images/placeholder.jpg';

    // Filter out posts with missing/invalid image URLs
    const validPosts = [];
    for (const post of posts) {
      if (post.media && post.media.url) {
        const isValid = await isValidImageUrl(post.media.url);
        if (isValid) validPosts.push(post);
      }
      if (validPosts.length >= 12) break;
    }

    if (validPosts.length === 0) {
      postsContainer.innerHTML = `<p>No posts available.</p>`;
      return;
    }

    // Render exactly 12 valid posts (with avatar + alts)
    postsContainer.innerHTML = validPosts
      .slice(0, 12)
      .map((post, i) => {
        const isLcp = page === 1 && i === 0;
        const loading = isLcp ? 'eager' : 'lazy';
        const fetchAttr = isLcp ? 'fetchpriority="high"' : '';

        const authorName = post.author?.name || 'Anonymous';
        const authorHref = `/profile/?name=${encodeURIComponent(authorName)}`;

        const avatarUrl = post.author?.avatar?.url || '/images/placeholder.jpg';
        const avatarAlt = `${authorName}'s avatar`;

        const mediaUrl = post.media?.url || fallbackImageUrl;
        const mediaAlt = post.media?.alt || 'Post image';

        const postTitle = post.title || 'Untitled Post';
        const postBody = post.body || '';

        return `
          <div class="post bg-white shadow rounded-sm overflow-hidden">
            <!-- Avatar + username row -->
            <div class="px-4 pt-4 mb-4 flex items-center gap-3 text-sm font-semibold text-gray-700">
              <a href="${authorHref}" class="inline-flex items-center gap-3 group">
                <img
                  src="${avatarUrl}"
                  alt="${avatarAlt}"
                  width="36" height="36"
                  class="w-9 h-9 rounded-full object-cover"
                  loading="lazy" decoding="async"
                />
                <span class="group-hover:underline">${authorName}</span>
              </a>
            </div>

            <!-- Image + text -->
            <a href="/post/?id=${post.id}" class="block hover:opacity-90">
              <img
                src="${mediaUrl}"
                alt="${mediaAlt}"
                srcset="
                  ${mediaUrl}?w=320 320w,
                  ${mediaUrl}?w=480 480w,
                  ${mediaUrl}?w=600 600w
                "
                sizes="(max-width: 640px) 100vw, 600px"
                width="600" height="600"
                class="mx-auto w-full max-w-[600px] aspect-[1/1] object-cover"
                loading="${loading}" ${fetchAttr} decoding="async"
              />
              <div class="p-4">
                <h2 class="text-lg font-bold mb-2">${postTitle}</h2>
                <p class="text-gray-600">${postBody}</p>
              </div>
            </a>
          </div>
        `;
      })
      .join('');

    // Pagination UI
    currentPageDisplay.textContent = `Page ${page}`;
    pagination?.classList.remove('invisible');
    prevButton.disabled = page <= 1;
    nextButton.disabled = posts.length < 24;
  } catch (error) {
    console.error('Error fetching posts:', error);
    postsContainer.innerHTML = '<p>Error loading posts. Please try again.</p>';
  } finally {
    postsContainer.classList.remove('min-h-[900px]');
    postsContainer.removeAttribute('aria-busy');
  }
}

// Pagination controls
prevButton.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    fetchAndDisplayPosts(currentPage);
  }
});

nextButton.addEventListener('click', () => {
  currentPage++;
  fetchAndDisplayPosts(currentPage);
});

// Initial fetch
fetchAndDisplayPosts(currentPage);
