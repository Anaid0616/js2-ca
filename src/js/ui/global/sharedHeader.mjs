import { logout } from '../auth/logout.mjs';

/**
 * Dynamically loads the HTML content for the `<header>` element and manages link visibility
 * based on the user's authentication state.
 *
 * - Fetches the header HTML from `/header/index.html` and inserts it into the `<header>` element.
 * - Hides or shows navigation links (e.g., Login, Register, Logout) based on whether the user is logged in.
 * - Attaches a click event listener to the Logout button if the user is authenticated.
 *
 * @async
 * @function loadHTMLHeader
 * @returns {Promise<void>} - Resolves when the header is loaded and DOM elements are updated.
 * @throws {Error} - Logs an error if the header fails to load or the fetch request is unsuccessful.
 *
 * @example
 * // Usage:
 * await loadHTMLHeader();
 * // Dynamically loads and manages the header content on the page.
 */
export async function loadHTMLHeader() {
  const headerElement = document.querySelector('header');
  try {
    // Update the path to fetch header/index.html
    const response = await fetch('/images/sharedheader.html');
    if (!response.ok) {
      throw new Error('Failed to load header');
    }
    const headerHTML = await response.text();
    headerElement.innerHTML = headerHTML;

    // Manage link visibility
    const token = localStorage.getItem('token');
    const loginLink = document.querySelector("a[href='/auth/login/']"); // Use absolute path
    const registerLink = document.querySelector("a[href='/auth/register/']"); // Use absolute path
    const logoutButton = document.querySelector('#logout-button');

    if (token) {
      // If the user is logged in
      if (loginLink) loginLink.style.display = 'none';
      if (registerLink) registerLink.style.display = 'none';
      if (logoutButton) {
        logoutButton.style.display = 'block';
        logoutButton.addEventListener('click', logout);
      }
    } else {
      // If the user is not logged in
      if (loginLink) loginLink.style.display = 'block';
      if (registerLink) registerLink.style.display = 'block';
      if (logoutButton) logoutButton.style.display = 'none';
    }
  } catch (error) {
    console.error('Error loading header:', error);
  }
}
