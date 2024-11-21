/**
 * This function should log the user out by removing aproppriate user data from the browser.
 */

export function logout() {
  console.log("Logout function triggered");

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  alert("You have been logged out");
  window.location.href = "/auth/login/";
}
