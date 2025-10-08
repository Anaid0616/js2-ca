// src/js/router/views/home.mjs

import { readPosts } from '../../api/post/read.mjs';
import { feedPostCardSkeletonHTML } from '../../utilities/skeletons.mjs';
import { authGuard } from '../../utilities/authGuard.mjs';
import { loadHTMLHeader } from '../../ui/global/sharedHeader.mjs';
import { h } from '../../utilities/dom.mjs';

authGuard();
loadHTMLHeader();

/** Current page for pagination. */
let currentPage = 1;

/** Case-insensitive terms to hide if they appear in title/body/tags */
const BLOCKLIST = ['test', 'zzz'];

/**
 * Returns true if a post should be hidden.
 * Checks title/body and tags for any blocklisted term.
 * @param {any} post
 */
function isBlocked(post) {
  const t = (post?.title || '').toLowerCase();
  const b = (post?.body || '').toLowerCase();
  const tags = Array.isArray(post?.tags)
    ? post.tags.join(' ').toLowerCase()
    : '';
  return BLOCKLIST.some(
    (w) => t.includes(w) || b.includes(w) || tags.includes(w)
  );
}

/** DOM refs */
const block = document.getElementById('posts-block');
const postsContainer = document.getElementById('posts-container');
const prevButton = document.getElementById('prev-page');
const nextButton = document.getElementById('next-page');
const currentPageDisplay = document.getElementById('current-page');

/** Local, static fallback image (used if an image fails to load). */
const FALLBACK_IMG = '/images/placeholder.jpg';

/**
 * Best-effort preconnect to an image origin to help LCP.
 * Silent no-op on bad URLs.
 * @param {string} url
 */
function preconnectToOrigin(url) {
  try {
    const o = new URL(url).origin;
    if (!document.querySelector(`link[rel="preconnect"][href="${o}"]`)) {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = o;
      link.crossOrigin = '';
      document.head.appendChild(link);
    }
  } catch {}
}

/**
 * Build one feed card (safe DOM; no innerHTML).
 *
 * @param {object} post
 * @param {boolean} isLcp
 * @returns {HTMLElement}
 */
function buildPostCard(post, isLcp) {
  const authorName = post?.author?.name || 'Anonymous';
  const authorHref = `/profile/?name=${encodeURIComponent(authorName)}`;

  const avatarUrl = post?.author?.avatar?.url || FALLBACK_IMG;
  const avatarAlt = `${authorName}'s avatar`;

  const mediaUrl = post?.media?.url || FALLBACK_IMG;
  const mediaAlt = post?.media?.alt || 'Post image';

  const postTitle = post?.title || 'Untitled Post';
  const postBody = post?.body || '';

  const loading = isLcp ? 'eager' : 'lazy';
  const fetchpriority = isLcp ? 'high' : undefined;

  // Image element with safe error fallback (no inline handlers)
  const mediaImg = h('img', {
    src: mediaUrl,
    alt: mediaAlt,
    srcset: `${mediaUrl}?w=320 320w, ${mediaUrl}?w=480 480w, ${mediaUrl}?w=600 600w`,
    sizes: '(max-width: 640px) 100vw, 600px',
    width: 600,
    height: 600,
    class: 'mx-auto w-full max-w-[600px] aspect-[1/1] object-cover',
    loading,
    decoding: 'async',
    ...(fetchpriority ? { fetchpriority } : {}),
  });
  mediaImg.addEventListener('error', () => {
    if (mediaImg.src !== location.origin + FALLBACK_IMG) {
      mediaImg.removeAttribute('srcset');
      mediaImg.src = FALLBACK_IMG;
      mediaImg.alt = 'Fallback image';
    }
  });

  return h(
    'div',
    { class: 'post bg-white shadow rounded-sm overflow-hidden' },

    // Avatar + username row
    h(
      'div',
      {
        class:
          'px-4 pt-4 mb-4 flex items-center gap-3 text-sm font-semibold text-gray-700',
      },
      h(
        'a',
        { href: authorHref, class: 'inline-flex items-center gap-3 group' },
        h('img', {
          src: avatarUrl,
          alt: avatarAlt,
          width: 36,
          height: 36,
          class: 'w-9 h-9 rounded-full object-cover',
          loading: 'lazy',
          decoding: 'async',
        }),
        h('span', { class: 'group-hover:underline' }, authorName)
      )
    ),

    // Image + text
    h(
      'a',
      { href: `/post/?id=${post.id}`, class: 'block hover:opacity-90' },
      mediaImg,
      h(
        'div',
        { class: 'p-4' },
        h('h2', { class: 'text-lg font-bold mb-2' }, postTitle),
        h('p', { class: 'text-gray-600' }, postBody)
      )
    )
  );
}

/**
 * Fetch posts and render the feed.
 *
 * - Shows skeletons while loading
 * - Renders exactly 12 cards per page
 * - Keeps pagination UI behavior
 * - No network validation of images (faster); uses error fallback instead
 *
 * @async
 * @param {number} [page=1] Page number to fetch
 * @returns {Promise<void>}
 */
async function fetchAndDisplayPosts(page = 1) {
  const pagination = document.getElementById('pagination');

  try {
    // Keep layout stable
    postsContainer.classList.add('min-h-[900px]');
    postsContainer.setAttribute('aria-busy', 'true');

    // Skeletons
    postsContainer.innerHTML = feedPostCardSkeletonHTML(12);
    block.style.visibility = 'visible';

    // Fetch posts (24 to have headroom)
    const response = await readPosts(24, page);
    const posts = Array.isArray(response?.data) ? response.data : [];

    // 1) Filter out boring/test content
    let cleaned = posts.filter((p) => !isBlocked(p));

    // if everything got filtered out, fall back to the original list
    if (cleaned.length === 0) cleaned = posts;

    // We still render exactly 12
    const slice = cleaned.slice(0, 12);

    if (posts.length === 0) {
      postsContainer.replaceChildren(h('p', null, 'No posts available.'));
      // Hide pagination if nothing to show
      pagination?.classList.add('invisible');
      return;
    }

    // Preconnect to the first media origin to improve LCP
    const firstMediaUrl = posts[0]?.media?.url;
    if (firstMediaUrl) preconnectToOrigin(firstMediaUrl);

    // Render exactly 12 cards
    const frag = document.createDocumentFragment();

    slice.forEach((post, i) => {
      const isLcp = page === 1 && i === 0;
      const card = buildPostCard(post, isLcp);
      frag.appendChild(card);
    });

    postsContainer.replaceChildren(frag);

    // Pagination UI (same logic you had)
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
