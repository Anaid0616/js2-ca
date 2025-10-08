// src/js/ui/skeletons.mjs

/**
 * Profile header (avatar + name + bio) skeleton
 * – matches your final spacing so CLS stays low.
 */
// src/js/ui/skeletons.mjs
// src/js/ui/skeletons.mjs
export function profileHeaderSkeletonHTML() {
  return `
    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
      <!-- LEFT: avatar + (name → counts → bio) column -->
      <div class="flex items-start gap-4 flex-1 min-w-0">
        <!-- Avatar -->
        <div class="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-gray-200 animate-pulse"></div>

        <!-- Right-of-avatar column -->
        <div class="flex-1 min-w-0">
          <!-- Name (title) -->
          <div class="h-6 sm:h-7 w-40 sm:w-48 bg-gray-200 rounded animate-pulse mb-2"></div>

          <!-- Counts row: Followers / Following (under the name) -->
          <div class="flex flex-wrap items-center gap-2 mb-2">
            <div class="h-8 sm:h-9 w-28 rounded border border-gray-200 bg-gray-200 animate-pulse"></div>
            <div class="h-8 sm:h-9 w-28 rounded border border-gray-200 bg-gray-200 animate-pulse"></div>
          </div>

          <!-- Bio (below counts) -->
          <div class="h-4 sm:h-5 w-56 sm:w-72 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      <!-- RIGHT: action button (Update / Follow) -->
      <div class="w-full sm:w-auto sm:ml-auto">
        <div class="h-9 sm:h-10 w-32 rounded bg-gray-200 animate-pulse"></div>
      </div>
    </div>
  `;
}

/**
 * Post card skeleton for PROFILE grid (no username row).
 */
export function profilePostCardSkeletonHTML() {
  return `
    <div class="post bg-white shadow rounded-sm overflow-hidden">
      <div class="animate-pulse">
        <div class="w-full aspect-square bg-gray-200"></div>
        <div class="p-4">
          <div class="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Post card skeleton for HOME feed (with username line).
 */
export function feedPostCardSkeletonHTML() {
  return `
    <div class="post bg-white shadow rounded-sm overflow-hidden">
      <div class="px-4 pt-4 mb-4">
        <div class="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div class="mx-auto w-full max-w-[600px] aspect-[1/1] bg-gray-200 animate-pulse"></div>
      <div class="py-4">
        <div class="h-5 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
      </div>
    </div>
  `;
}

/**
 * Render N skeleton cards into a container using a given template fn.
 * @param {HTMLElement} container
 * @param {number} n
 * @param {() => string} template
 */
export function renderGridSkeleton(container, n, template) {
  container.innerHTML = Array.from({ length: n }, () => template()).join('');
}

/**
 * Post DETAIL skeleton (avatar + name, square image, title/body).
 */
export function postDetailSkeletonHTML() {
  return `
    <div class="animate-pulse">
      <div class="px-5 sm:px-6 pt-4 mb-3">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-full bg-gray-300"></div>
          <div class="h-4 w-32 bg-gray-300 rounded"></div>
        </div>
      </div>
      <div class="w-full max-w-[600px] mx-auto aspect-[1/1] bg-gray-300 rounded-sm"></div>
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
