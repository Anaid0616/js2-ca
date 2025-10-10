import { doFetch } from "@/js/utilities/doFetch.mjs";
import { API_SOCIAL_POSTS } from "@/js/api/constants.mjs";
import { showAlert } from "@/js/utilities/alert.mjs";

/** Emojis to display */
const REACTION_SET = ["👍", "❤️", "🔥"];

/**
 * Build the reactions bar (emoji + count + popover with reactors)
 * @param {Array<{symbol:string,count:number,reactors?:string[]}>} [reactions=[]]
 * @returns {string}
 */
export function reactionsHtml(reactions = []) {
  const counts = Object.fromEntries(REACTION_SET.map((s) => [s, 0]));
  const reactorsMap = Object.fromEntries(REACTION_SET.map((s) => [s, []]));

  reactions.forEach((r) => {
    if (!r?.symbol) return;
    if (typeof r.count === "number") counts[r.symbol] = r.count;
    if (Array.isArray(r.reactors)) reactorsMap[r.symbol] = r.reactors;
  });

  return `
    <div id="reactions" class="flex items-center gap-3 px-5 sm:px-6 pb-4">
      ${REACTION_SET.map((sym, i) => {
        const listHtml = reactorsMap[sym]?.length
          ? reactorsMap[sym]
              .map((name) => {
                const href = `/profile/?name=${encodeURIComponent(name)}`;
                return `<li>   <a href="${href}"
               class="font-semibold text-gray-700 rounded px-1 transition-colors
                      hover:bg-[#59D1AD]/20 focus:bg-[#59D1AD]/20 focus:outline-none">
              ${name}
            </a></li>`;
              })
              .join("")
          : '<li class="text-gray-500">No reactions yet</li>';

        const popId = `reactors-pop-${i}`;
        return `
          <div class="relative inline-flex items-center gap-1">
            <button type="button"
                    class="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 text-sm"
                    data-react="${sym}" aria-label="React with ${sym}">
              ${sym}
            </button>

            <button type="button"
                    class="text-xs px-1 py-0.5 rounded hover:underline"
                    data-popover="${popId}" aria-expanded="false" aria-controls="${popId}">
              ${counts[sym] || 0}
            </button>

            <div id="${popId}"
                 class="hidden absolute left-0 top-full mt-1 p-2 bg-white border border-gray-200 rounded shadow text-sm z-10">
              <ul class="list-none pl-0">${listHtml}</ul>
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}
/**
 * Wire handlers:
 * - Click emoji => PUT /react/<emoji> (toggle)
 * - Click count => toggle popover with reactors
 *
 * @param {string|number} postId
 * @param {() => Promise<void>} [onUpdated]  // e.g. re-fetch the post and re-render reactions
 */
export function mountReactions(postId, onUpdated) {
  const root = document.getElementById("reactions");
  if (!root) return;

  // close popovers when clicking outside
  function closeAll() {
    root
      .querySelectorAll('[id^="reactors-pop-"]')
      .forEach((el) => el.classList.add("hidden"));
    root
      .querySelectorAll("[data-popover]")
      .forEach((btn) => btn.setAttribute("aria-expanded", "false"));
  }

  document.addEventListener("click", (ev) => {
    if (!root.contains(ev.target)) closeAll();
  });

  root.addEventListener("click", async (e) => {
    const el = e.target;

    // toggle reaction
    const reactBtn = el.closest("[data-react]");
    if (reactBtn) {
      const sym = reactBtn.getAttribute("data-react");
      if (!sym) return;
      try {
        await doFetch(
          `${API_SOCIAL_POSTS}/${postId}/react/${encodeURIComponent(sym)}`,
          {
            method: "PUT",
          },
        );
        if (onUpdated) await onUpdated();
      } catch (err) {
        console.error("Reaction failed:", err);
        showAlert("error", "Could not update reaction.");
      }
      return;
    }

    // toggle popover
    const popBtn = el.closest("[data-popover]");
    if (popBtn) {
      const popId = popBtn.getAttribute("data-popover");
      const pop = popId && root.querySelector(`#${popId}`);
      if (!pop) return;

      const willOpen = pop.classList.contains("hidden");
      closeAll();
      pop.classList.toggle("hidden", !willOpen);
      popBtn.setAttribute("aria-expanded", willOpen ? "true" : "false");
    }
  });
}
