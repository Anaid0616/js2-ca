import { authGuard } from '../../utilities/authGuard.mjs';
import { setLogoutListener } from '../../ui/global/logout.mjs';
import { readPosts } from '../../api/post/read.mjs';
import { loadHTMLHeader } from '../../ui/global/sharedHeader.mjs';

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

    // Render skeleton loaders before fetching the posts
    postsContainer.innerHTML = `
${Array.from({ length: 12 })
  .map(
    () => `
  <div class="post bg-white shadow rounded-sm overflow-hidden">

    <div class="px-4 pt-4 mb-4">
      <div class="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
    </div>
    <div class="mx-auto w-full max-w-[600px] aspect-[1/1] bg-gray-200 animate-pulse"></div>

    <div class="p-4">
      <div class="h-5 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
      <div class="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
    </div>
  </div>
`
  )
  .join('')}
`;

    block.style.visibility = 'visible';

    // Fetch posts from the API
    const response = await readPosts(24, page);
    const posts = response.data;

    // Fallback image URL
    const fallbackImageUrl = '/images/placeholder.jpg';

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
      .map((post, i) => {
        const isLcp = page === 1 && i === 0;
        const loading = isLcp ? 'eager' : 'lazy';
        const fetchAttr = isLcp ? 'fetchpriority="high"' : '';

        const authorName = post.author?.name || 'Anonymous';
        const mediaUrl = post.media?.url || fallbackImageUrl;
        const mediaAlt = post.media?.alt || 'Post Image';
        const postTitle = post.title || 'Untitled Post';
        const postBody = post.body || '';

        return `
        
        <div class="post bg-white shadow rounded-sm overflow-hidden">
           <!-- Username -->
          <div class="px-4 pt-4 text-sm font-semibold text-gray-700 mb-4">
            ${authorName}
          </div>
          
 <a href="/post/?id=${post.id}" class="block hover:opacity-90">
      <img
  src="${mediaUrl}"                    
  srcset="
    ${mediaUrl}?w=320 320w,
    ${mediaUrl}?w=480 480w,
    ${mediaUrl}?w=600 600w
  "
  sizes="(max-width: 640px) 100vw, 600px"
  width="600" height="600"
  class="mx-auto w-full max-w-[600px] aspect-[1/1] object-cover"
  loading="eager" fetchpriority="high" decoding="async"
/>
            <div class="p-4">
              <h3 class="text-lg font-bold mb-2">${postTitle}</h3>
              <p class="text-gray-600">${postBody}</p>
            </div>
          </a>
        </div>
      `;
      })
      .join('');

    // Update pagination display
    currentPageDisplay.textContent = `Page ${page}`;
    // make the pagination visible
    pagination?.classList.remove('invisible');

    // disable Prev button on first page
    prevButton.disabled = page <= 1;
    // disable Next button if fewer than 24 posts were fetched
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
