import { login } from "../../api/auth/login";
/**
 * This function should pass data to the login function in api/auth and handle the response
 */

export async function onLogin(event) {
  event.preventDefault(); // Prevent default form submission behavior

  // Collect form data
  const formData = new FormData(event.target);
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  try {
    const response = await login(data);

    // API response with the user's name
    const userName = response.user?.name;
    console.log("Login successful:", response);

    // Show an alert message welcoming the user by name
    alert(`Login successful! Welcome ${userName}!`);

    // Redirect to home
    window.location.href = "/";
  } catch (error) {
    console.error("Login failed:", error);

    // Display an error message to the user
    alert("Login failed. Please check your email and password and try again.");
  }
}

// Attach the function to the form submission event
const form = document.forms.login;
form.addEventListener("submit", onLogin);
