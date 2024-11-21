import { logout } from "../auth/logout";
/**
 * Functions you attach to logout events that calls ui/auth/logout function
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
