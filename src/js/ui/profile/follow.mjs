// src/js/ui/profile/follow.mjs
import { doFetch } from "@/js/utilities/doFetch.mjs";
import { API_SOCIAL_PROFILES } from "@/js/api/constants.mjs";
import { showAlert } from "@/js/utilities/alert.mjs";

/**
 * Build a Follow/Unfollow button.
 * @param {boolean} isFollowing - Whether the current user already follows the target.
 * @returns {string} - HTML for the button.
 */
export function followButtonHtml(isFollowing) {
  const label = isFollowing ? "Unfollow" : "Follow";
  return `
    <button id="follow-toggle"
      class="text-sm px-3 py-1.5 rounded font-semibold
             ${
               isFollowing
                 ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                 : "bg-[#59D1AD] text-black hover:bg-[#47c39a]"
             }"
      type="button"
      aria-pressed="${isFollowing ? "true" : "false"}">
      ${label}
    </button>
  `;
}

/**
 * Mounts the click handler to toggle follow state.
 * Disables the button while the request is in-flight and updates UI on success.
 *
 * @param {string} targetName - The profile name to follow/unfollow.
 * @param {boolean} initialFollowing - Initial following state from the API.
 * @param {(nextFollowing:boolean)=>void} [onChanged] - Optional callback after success.
 */
export function mountFollow(targetName, initialFollowing, onChanged) {
  const btn = document.getElementById("follow-toggle");
  if (!btn) return;

  let following = !!initialFollowing;
  let busy = false;

  const render = () => {
    btn.textContent = following ? "Unfollow" : "Follow";
    btn.setAttribute("aria-pressed", following ? "true" : "false");
    btn.className =
      "text-sm px-3 py-1.5 rounded font-semibold " +
      (following
        ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
        : "bg-[#59D1AD] text-black hover:bg-[#47c39a]");
  };

  render();

  btn.addEventListener("click", async () => {
    if (busy) return;
    busy = true;
    btn.disabled = true;

    try {
      const path = `${API_SOCIAL_PROFILES}/${encodeURIComponent(targetName)}/${
        following ? "unfollow" : "follow"
      }`;
      await doFetch(path, { method: "PUT" });

      following = !following;
      render();
      onChanged?.(following);
    } catch (err) {
      console.error("Follow toggle failed:", err);
      showAlert("error", "Could not update follow state.");
    } finally {
      btn.disabled = false;
      busy = false;
    }
  });
}
