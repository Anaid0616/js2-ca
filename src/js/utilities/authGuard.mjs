/**
 * Redirects users to the login page if they are not authenticated.
 *
 * - Checks for the presence of a `token` in `localStorage` to determine authentication.
 * - If the `token` is missing, shows an alert and redirects the user to the login page.
 *
 * @function authGuard
 * @returns {void} - Does not return a value.
 *
 * @example
 * // Usage:
 * authGuard();
 * // Redirects to login page if user is not logged in.
 */
export function authGuard() {
  if (!localStorage.token) {
    alert("You must be logged in to view this page");
    window.location.href = "/auth/login/";
  }
}
