/**
 * This function should pass data to the register function in api/auth and handle the response
 */
import { register } from "../../api/auth/register";

export async function onRegister(event) {
  event.preventDefault(); // Stop the default form submission

  // Collect form data
  const formData = new FormData(event.target);
  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  try {
    const response = await register(data);

    // If registration is successful
    if (response) {
      console.log("Registration successful:", response); // Logs the server response
      alert(`Registration successful!`); // Shows alert
      window.location.href = "/auth/login/"; // Redirects to the login page
    }
  } catch (error) {
    console.error("Registration failed:", error); // Logs the error
    alert(`Registration failed: ${error.message}`); // Shows error in alert
  }
}
