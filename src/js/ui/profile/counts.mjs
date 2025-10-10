// src/js/ui/profile/counts.mjs

/**
 * Build the “Followers / Following” counters with dropdown lists.
 * Use together with mountCountsDropdowns() to wire up the toggles.
 *
 * @param {Array<{name:string}>} followers
 * @param {Array<{name:string}>} following
 * @returns {string} HTML string for the counts row
 */
export function countsRowHtml(followers = [], following = []) {
  return `
    <div class="mt-3 flex flex-wrap items-center">
      ${peopleDropdownHtml("followers", "Followers", followers)}
      ${peopleDropdownHtml("following", "Following", following)}
    </div>
  `;
}

/**
 * Attach toggle behavior to the two dropdowns.
 * Call this right after you insert countsRowHtml() into the DOM.
 *
 * @param {HTMLElement|Document} root Where to search for the buttons/menus
 * @returns {void}
 */
export function mountCountsDropdowns(root = document) {
  const pairs = [
    {
      btn: root.querySelector("#followers-btn"),
      menu: root.querySelector("#followers-menu"),
    },
    {
      btn: root.querySelector("#following-btn"),
      menu: root.querySelector("#following-menu"),
    },
  ].filter((p) => p.btn && p.menu);

  const closeAll = () => {
    pairs.forEach(({ menu }) => menu.classList.add("hidden"));
  };

  // Toggle each menu and close the other
  pairs.forEach(({ btn, menu }) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      pairs.forEach(({ menu: m }) => m !== menu && m.classList.add("hidden"));
      menu.classList.toggle("hidden");
    });
  });

  // Click-away to close
  document.addEventListener("click", closeAll, { once: true, capture: true });
}

/* ---------------- internal helpers ---------------- */

function peopleDropdownHtml(idBase, label, people) {
  const count = people.length;
  const items =
    count === 0
      ? `<li class="px-3 py-2 text-sm text-gray-500">No ${label.toLowerCase()} yet</li>`
      : people
          .map(
            (p) => `
              <li>
                <a
                  href="/profile/?name=${encodeURIComponent(p.name)}"
                  class="block px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded"
                >
                  ${p.name}
                </a>
              </li>
            `,
          )
          .join("");

  return `
    <div class="relative inline-block">
      <button
        id="${idBase}-btn"
        type="button"
        class="mr-3 mb-2 inline-flex items-baseline gap-1 px-2 sm:px-3 py-1.5 sm:py-0.5 rounded border border-gray-300 bg-white hover:bg-gray-50 focus:outline-none"
        aria-haspopup="true"
        aria-expanded="false"
        aria-controls="${idBase}-menu"
      >
        <span class="tabular-nums font-bold text-base sm:text-lg leading-none">${count}</span>
        <span class="font-normal text-gray-600 text-xs sm:text-sm leading-none">${label}</span>
      </button>

      <div
        id="${idBase}-menu"
        class="absolute left-0 z-10 mt-0.5 w-54 bg-white border border-gray-200 rounded-lg shadow-lg hidden"
      >
        <ul class="py-1 max-h-64 overflow-auto">${items}</ul>
      </div>
    </div>
  `;
}
