/**
 * Handles user registration by collecting form data, calling the API to register the user,
 * and storing the authentication details in `localStorage` upon success.

 *
 * @async
 * @function onRegister
 * @param {Event} event - The form submission event.
 * @returns {Promise<void>} - Resolves when the registration process is complete.
 * @throws {Error} If registration fails, displays an error alert and logs the error in the console.
 */
import { register } from '../../api/auth/register';

export async function onRegister(event) {
  event.preventDefault(); // Stop the default form submission

  // Collect form data
  const formData = new FormData(event.target);
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  };

  try {
    const response = await register(data);

    // Save the token and user data to localStorage
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));

    // If registration is successful
    if (response) {
      alert(`Registration successful!`); // Shows alert
      window.location.href = '/auth/login/'; // Redirects to the login page
    }
  } catch (error) {
    console.error('Registration failed:', error); // Logs the error
    alert(`Registration failed: ${error.message}`); // Shows error in alert
  }
}
