import { API_SOCIAL_PROFILES } from "../../api/constants.mjs";
import { doFetch } from "../../utilities/doFetch.mjs";

/**
 * Safe getter for DOM nodes.
 * @param {string} sel - CSS selector
 * @returns {HTMLElement|null}
 */
function $(sel) {
  return document.querySelector(sel);
}

/**
 * Apply profile data to the DOM (does not toggle skeleton/real visibility).
 * The avatar is kept hidden until image load completes to avoid fallback flash.
 *
 * @param {{name?: string, bio?: string, avatar?: { url?: string }}} data
 */
function paintProfile(data = {}) {
  const nameEl = $("#user-name");
  const bioEl = $("#user-bio");
  const avatarEl = $("#user-avatar");

  if (nameEl) nameEl.textContent = data.name || "Unknown user";
  if (bioEl) bioEl.textContent = data.bio || "";

  if (avatarEl) {
    // Hide avatar until the image has either loaded or errored
    avatarEl.style.visibility = "hidden";
    avatarEl.src = data?.avatar?.url || "/images/placeholder.jpg";
    avatarEl.alt = data?.name ? `${data.name}'s avatar` : "User avatar";
  }
}

/**
 * Reveal the real profile block and hide the skeleton.
 * Also make sure the avatar is visible once the image is ready.
 */
function revealProfile() {
  const skeleton = $("#profile-skeleton");
  const real = $("#profile-real");
  const avatarEl = $("#user-avatar");

  if (skeleton) skeleton.classList.add("hidden");
  if (real) real.classList.remove("hidden");

  if (avatarEl) {
    avatarEl.style.visibility = "visible";
  }
}

/**
 * Attach a one-time "load or error" listener to the avatar to control reveal timing.
 */
function revealWhenAvatarReady() {
  const avatarEl = $("#user-avatar");
  if (!avatarEl) {
    // No avatar element; just reveal.
    revealProfile();
    return;
  }

  if (avatarEl.complete) {
    // Already loaded from cache
    revealProfile();
    return;
  }

  const once = { once: true };
  avatarEl.addEventListener("load", revealProfile, once);
  avatarEl.addEventListener("error", revealProfile, once);
}

/**
 * Fetch and display the current user's profile.
 *
 * Behavior:
 * - Shows skeleton (#profile-skeleton) by default (in HTML).
 * - Uses cached localStorage user to paint text instantly (no reveal yet).
 * - Fetches fresh data from API -> repaints -> reveals when avatar is ready.
 * - Merges fresh data back into localStorage.
 *
 * Error handling:
 * - On failure, keeps the skeleton (prevents big layout jumps) and logs to console.
 *
 * Side effects:
 * - Mutates DOM under #profile-real and #profile-skeleton.
 * - Reads/writes localStorage.user.
 *
 * @async
 * @function fetchAndDisplayProfile
 * @throws {Error} If the user is not logged in.
 */
export async function fetchAndDisplayProfile() {
  // 1) Require login
  const cachedUser = JSON.parse(localStorage.getItem("user"));
  if (!cachedUser?.name) {
    alert("You must be logged in to view this page.");
    window.location.href = "/auth/login/";
    return;
  }

  const username = cachedUser.name;

  // 2) Optimistic paint from cache (fast text; avatar still hidden)
  if (cachedUser?.avatar || cachedUser?.bio) {
    paintProfile({
      name: cachedUser.name,
      bio: cachedUser.bio,
      avatar: cachedUser.avatar,
    });
  }

  // Important: wait to reveal until avatar is loaded for the currently painted data
  revealWhenAvatarReady();

  try {
    // 3) Fetch fresh data from API
    const res = await doFetch(
      `${API_SOCIAL_PROFILES}/${encodeURIComponent(username)}`,
      {
        method: "GET",
      },
    );

    // The API generally returns { data: {...} }
    const profile = res?.data;
    if (!profile) throw new Error("Missing profile data");

    // 4) Repaint with fresh API data, keep avatar hidden until image event
    paintProfile(profile);
    revealWhenAvatarReady();

    // 5) Merge back into localStorage
    const merged = {
      ...cachedUser,
      name: profile.name ?? cachedUser.name,
      avatar: profile.avatar ?? cachedUser.avatar,
      bio: profile.bio ?? cachedUser.bio,
    };
    localStorage.setItem("user", JSON.stringify(merged));
  } catch (err) {
    console.error("Error fetching user profile:", err);
    // Keep skeleton visible; you can optionally show a toast here
  }
}

fetchAndDisplayProfile();
