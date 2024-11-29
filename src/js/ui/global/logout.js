import { logout } from "../auth/logout";
/**
 * Attaches a click event listener to the logout button.
 *
 * - When the button with the ID `#logout-button` is clicked, the `logout` function is triggered.
 * - Logs an error to the console if the logout button is not found in the DOM.
 *
 * @function setLogoutListener
 * @returns {void} - Does not return a value.
 *
 * @example
 * // Usage:
 * setLogoutListener();
 * // Automatically attaches the listener to the logout button when the DOM is loaded.
 */
export function setLogoutListener() {
  const logoutButton = document.querySelector("#logout-button");

  if (logoutButton) {
    logoutButton.addEventListener("click", logout);
  } else {
    console.error("Logout button not found in the DOM");
  }
}

// Call setLogoutListener when the DOM is loaded
document.addEventListener("DOMContentLoaded", setLogoutListener);
