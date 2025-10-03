import { authGuard } from '../../utilities/authGuard.mjs';
import { showModal } from '../../utilities/modal.mjs';
import { readPost } from '../../api/post/read';
import { deletePost } from '../../api/post/delete';
import { showAlert } from '../../utilities/alert.mjs';

// Require auth
authGuard();

/** @type {HTMLElement|null} */
const postWrap = document.getElementById('post-wrap');
/** @type {HTMLElement|null} */
const postContainer = document.querySelector('.post');
/** @type {HTMLElement|null} */
const buttonsContainer = document.querySelector('.post-buttons');

const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

if (!postId) {
  showAlert('error', 'No post ID provided. Redirecting to home page.');
  setTimeout(() => (window.location.href = '/'), 1500);
}

/**
 * Return a skeleton markup that matches the final layout
 * (avatar + name, square image, title, body).
 * Keeping paddings here so the skeleton lines up perfectly.
 * @returns {string}
 */
function postSkeleton() {
  return `
    <div class="animate-pulse">
      <!-- Avatar + name -->
      <div class="px-5 sm:px-6 pt-4 mb-3">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-full bg-gray-300"></div>
          <div class="h-4 w-32 bg-gray-300 rounded"></div>
        </div>
      </div>

      <!-- Square image -->
      <div class="w-full max-w-[600px] mx-auto aspect-[1/1] bg-gray-300 rounded-sm"></div>

      <!-- Title + body -->
      <div class="px-5 sm:px-6 pt-4 pb-2">
        <div class="h-6 w-48 bg-gray-300 rounded mb-3"></div>
        <div class="space-y-3">
          <div class="h-4 w-full bg-gray-300 rounded"></div>
          <div class="h-4 w-5/6 bg-gray-300 rounded"></div>
          <div class="h-4 w-4/6 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Build the final post markup (avatar + name above a 1:1 image),
 * with stable dimensions to avoid layout shifts.
 * @param {{media?:{url?:string,alt?:string}, title?:string, body?:string, author?:{name?:string, avatar?:{url?:string}}}} post
 * @returns {string}
 */
function postHtml(post) {
  const mediaUrl = post?.media?.url || '/images/placeholder.jpg';
  const mediaAlt = post?.media?.alt || 'Post image';
  const authorName = post?.author?.name || 'Anonymous';
  const avatarUrl = post?.author?.avatar?.url || '/images/placeholder.jpg';
  const title = post?.title || 'No Title';
  const body = post?.body || 'No Description Available';

  return `
    <!-- Avatar + name ABOVE the image -->
    <div class="px-5 sm:px-6 pt-4 mb-2">
      <div class="flex items-center gap-3">
        <img
          src="${avatarUrl}"
          alt="${authorName}'s avatar"
          width="36" height="36"
          class="w-9 h-9 rounded-full object-cover"
          loading="lazy" decoding="async"
        />
        <p class="text-sm font-semibold text-gray-700">${authorName}</p>
      </div>
    </div>

    <!-- Square image -->
    <img
      id="post-image"
      src="${mediaUrl}"
      alt="${mediaAlt}"
      width="600" height="600"
      class="mx-auto w-full max-w-[600px] aspect-[1/1] object-cover rounded-sm"
      loading="eager" fetchpriority="high" decoding="async"
      style="visibility:hidden"
    />

    <!-- Title + body -->
    <div class="px-5 sm:px-6 py-4">
      <h2 class="text-xl font-bold text-gray-900 mb-2">${title}</h2>
      <p class="text-gray-700 leading-relaxed">${body}</p>
    </div>
  `;
}

/**
 * Insert Edit/Delete buttons (container already has side+bottom padding via HTML)
 */
function renderButtons() {
  if (!buttonsContainer) return;
  buttonsContainer.innerHTML = `
    <button id="edit-post-button"
      class="px-3 py-1 bg-[#59D1AD] text-black rounded hover:bg-[#47c39a] font-semibold text-sm">
      Edit Post
    </button>
    <button id="delete-post-button"
      class="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 text-sm font-semibold">
      Delete Post
    </button>
  `;
}

/** Wire up the buttons after they exist */
function attachButtonHandlers() {
  const editBtn = document.getElementById('edit-post-button');
  const delBtn = document.getElementById('delete-post-button');

  editBtn?.addEventListener('click', () => {
    window.location.href = `/post/edit/?id=${postId}`;
  });

  delBtn?.addEventListener('click', async () => {
    const confirmed = await showModal(
      'Are you sure you want to delete this post?',
      'Delete',
      'Cancel'
    );
    if (!confirmed) return;

    try {
      const ok = await deletePost(postId);
      if (ok) {
        showAlert('success', 'Post deleted successfully!');
        setTimeout(() => (window.location.href = '/profile/'), 1200);
      } else {
        throw new Error('API did not confirm post deletion.');
      }
    } catch (err) {
      console.error('Delete failed:', err);
      showAlert('error', 'Failed to delete post. Please try again.');
    }
  });
}

/**
 * Fetch the post and render it with a skeleton-first strategy.
 * Ensures skeleton is visible immediately, then swaps to the real content,
 * and only shows the image once it has loaded to avoid flashes.
 * @returns {Promise<void>}
 */
async function fetchAndRenderPost() {
  if (!postWrap || !postContainer) return;

  postWrap.classList.add('min-h-[880px]');

  // 1) Inject skeleton and reveal wrapper so nothing looks empty
  postContainer.innerHTML = postSkeleton();
  postWrap.classList.remove('invisible'); // show immediately
  if (buttonsContainer) buttonsContainer.innerHTML = '';

  try {
    const { data: post } = await readPost(postId);

    // 2) Render real content
    postContainer.innerHTML = postHtml(post);
    renderButtons();

    // 3) Avoid flash by revealing the image only when it’s loaded
    const img = /** @type {HTMLImageElement|null} */ (
      document.getElementById('post-image')
    );
    if (img) {
      if (img.complete) {
        img.style.visibility = 'visible';
      } else {
        img.addEventListener('load', () => (img.style.visibility = 'visible'), {
          once: true,
        });
        img.addEventListener(
          'error',
          () => (img.style.visibility = 'visible'),
          { once: true }
        );
      }
    }

    // 4) Wire up buttons
    attachButtonHandlers();
  } catch (error) {
    console.error('Error fetching post:', error);
    showAlert('error', 'Failed to load the post. Please try again.');
    setTimeout(() => (window.location.href = '/'), 1500);
  } finally {
    postWrap.classList.remove('min-h-[880px]');
  }
}
fetchAndRenderPost();
