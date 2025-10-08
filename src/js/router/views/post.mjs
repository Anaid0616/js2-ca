import { authGuard } from '../../utilities/authGuard.mjs';
import { showModal } from '../../utilities/modal.mjs';
import { readPost } from '../../api/post/read';
import { deletePost } from '../../api/post/delete';
import { showAlert } from '../../utilities/alert.mjs';
import { postDetailSkeletonHTML } from '../../utilities/skeletons.mjs';
import { reactionsHtml, mountReactions } from '@/js/ui/post/reactions.mjs';
import {
  commentsHtml,
  renderInitialComments,
  mountComments,
} from '@/js/ui/post/comments.mjs';
import { setLogoutListener } from '../../ui/global/logout.mjs';
import { loadHTMLHeader } from '../../ui/global/sharedHeader.mjs';

loadHTMLHeader();
setLogoutListener();
// Require auth
authGuard();

const me = JSON.parse(localStorage.getItem('user'));

const postWrap = document.getElementById('post-wrap');
const postContainer = document.querySelector('.post');
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
  return postDetailSkeletonHTML();
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
  const authorHref = `/profile/?name=${encodeURIComponent(authorName)}`;
  const title = post?.title || 'No Title';
  const body = post?.body || 'No Description Available';

  return `
    <div class="px-4 sm:px-5">
   <div class="my-4">
    <a href="${authorHref}" class="flex items-center gap-3 hover:opacity-90">
      <img src="${avatarUrl}" alt="${authorName}'s avatar"
           width="36" height="36" class="w-9 h-9 rounded-full object-cover" />
      <p class="text-sm font-semibold text-gray-700">${authorName}</p>
    </a>
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
  if (!editBtn || !delBtn) return;

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
    const { data: post } = await readPost(postId, {
      author: true,
      comments: true,
      reactions: true,
    });

    // 2) Render real content
    postContainer.innerHTML = postHtml(post);

    // --- Only Edit/Delete on own posts ---
    const mine =
      !!me?.name &&
      !!post?.author?.name &&
      me.name.trim().toLowerCase() === post.author.name.trim().toLowerCase();

    if (mine) {
      renderButtons();
      attachButtonHandlers();
    } else if (buttonsContainer) {
      buttonsContainer.innerHTML = '';
      buttonsContainer.classList.add('hidden');
    }

    // 2b) Comments and reactions
    postContainer.insertAdjacentHTML(
      'beforeend',
      reactionsHtml(post?.reactions)
    );
    postContainer.insertAdjacentHTML('beforeend', commentsHtml());
    renderInitialComments(post?.comments);

    // 2c) handlers
    const refresh = async () => {
      // re-fetch just reactions (light) to update counts + reactors
      const { data: refreshed } = await readPost(postId, { reactions: true });
      const old = document.getElementById('reactions');
      if (old) {
        old.outerHTML = reactionsHtml(refreshed?.reactions);
        mountReactions(postId, refresh);
      }
    };

    mountReactions(postId, refresh);
    mountComments(postId);

    // 3) Show img
    const img = document.getElementById('post-image');
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
  } catch (error) {
    console.error('Error fetching post:', error);
    showAlert('error', 'Failed to load the post. Please try again.');
    setTimeout(() => (window.location.href = '/'), 1500);
  } finally {
    postWrap.classList.remove('min-h-[880px]');
  }
}
fetchAndRenderPost();
