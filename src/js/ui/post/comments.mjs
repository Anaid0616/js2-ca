// Comments UI + logic (create + list + delete)
import { doFetch } from '@/js/utilities/doFetch.mjs';
import { API_SOCIAL_POSTS } from '@/js/api/constants.mjs';
import { showAlert } from '@/js/utilities/alert.mjs';

/**
 * Render the comment form and list container
 * @returns {string}
 */
export function commentsHtml() {
  return `
    <div class="px-5 sm:px-6 pb-5">
      <form id="comment-form"
            class="flex gap-2 max-[373px]:flex-col">
        <input id="comment-input" type="text" required
               placeholder="Write a comment…"
               class="flex-1 p-2 border rounded max-[373px]:w-full" />
        <button type="submit"
                class="px-3 py-2 bg-[#59D1AD] text-black rounded hover:bg-[#47c39a] font-semibold text-sm
                       max-[373px]:w-full">
          Comment
        </button>
      </form>
      <div id="comments" class="mt-4 space-y-3"></div>
    </div>
  `;
}

/**
 * Render initial comments (if present from the post read)
 * @param {Array<{id:number, body:string, owner:string, created:string}>} [comments=[]]
 */
export function renderInitialComments(comments = []) {
  const wrap = document.getElementById('comments');
  if (!wrap) return;
  wrap.innerHTML = comments.map((c) => commentItemHtml(c)).join('');
}

/** Build one comment item */
function commentItemHtml(c) {
  const me = JSON.parse(localStorage.getItem('user'));
  const mine =
    !!me?.name &&
    !!c?.owner &&
    me.name.trim().toLowerCase() === c.owner.trim().toLowerCase();

  return `
    <div class="border border-gray-200 rounded p-3 flex justify-between items-start gap-3" data-comment-id="${
      c.id
    }">
      <div>
        <p class="text-sm text-gray-800">${escapeHtml(c.body)}</p>
        <p class="text-xs text-gray-500 mt-1">
          by ${c.owner} • ${new Date(c.created).toLocaleString()}
        </p>
      </div>
      ${
        mine
          ? `<button class="text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-50"
                     data-delete-comment="${c.id}">Delete</button>`
          : ''
      }
    </div>
  `;
}

/**
 * Mount the form submit + delete handlers
 * @param {string|number} postId
 */
export function mountComments(postId) {
  const form = document.getElementById('comment-form');
  const input = document.getElementById('comment-input');
  const list = document.getElementById('comments');

  // Create
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = input?.value?.trim();
    if (!text) return;

    try {
      const res = await doFetch(`${API_SOCIAL_POSTS}/${postId}/comment`, {
        method: 'POST',
        body: JSON.stringify({ body: text }),
      });
      const c = res?.data;
      if (!c || !list) return;

      list.insertAdjacentHTML('afterbegin', commentItemHtml(c));
      input.value = '';
    } catch (err) {
      console.error('Comment failed:', err);
      showAlert('error', 'Could not post comment.');
    }
  });

  // Delete (event delegation)
  list?.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-delete-comment]');
    if (!btn) return;
    const cid = btn.getAttribute('data-delete-comment');
    if (!cid) return;

    try {
      await doFetch(`${API_SOCIAL_POSTS}/${postId}/comment/${cid}`, {
        method: 'DELETE',
      });
      // remove from DOM
      const host = btn.closest('[data-comment-id]');
      host?.remove();
    } catch (err) {
      console.error('Delete comment failed:', err);
      showAlert('error', 'Could not delete comment.');
    }
  });
}

/** Simple HTML escape for comment body */
function escapeHtml(s = '') {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}
