import { authGuard } from "../../utilities/authGuard";
import { setLogoutListener } from "../../ui/global/logout";

authGuard();

// Attach the logout listener when the home page loads
setLogoutListener();

// Links visibility login and logout
const token = localStorage.getItem("token");
const loginLink = document.querySelector("a[href='./auth/login/']");
const registerLink = document.querySelector("a[href='./auth/register/']");
const logoutButton = document.querySelector("#logout-button");

if (token) {
  // User is logged in
  loginLink.style.display = "none";
  registerLink.style.display = "none";
  logoutButton.style.display = "block";
} else {
  // User is not logged in
  loginLink.style.display = "block";
  registerLink.style.display = "block";
  logoutButton.style.display = "none";
}
