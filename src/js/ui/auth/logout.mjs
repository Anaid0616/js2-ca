import { showAlert } from '../../utilities/alert.mjs';
/**
 * Logs the user out by removing authentication-related data from localStorage
 * and redirecting to the login page.
 *
 * - Removes the `token` and `user` data from `localStorage`.
 * - Alerts the user that they have been logged out.
 * - Redirects the browser to the `/auth/login/` page.
 *
 * @function logout
 * @returns {void}
 */
export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  // Show a success alert
  console.log('Logging out...');
  showAlert('success', 'You have been logged out!');
  console.log('Alert should be displayed now.');
  console.log(document.getElementById('alert-container'));

  // Redirect to the login page after a short delay
  setTimeout(() => {
    window.location.href = '/auth/login/';
  }, 3000);
}
