import { logout } from "../auth/logout.mjs";

export function setLogoutListener(
  root = document,
  selector = "#logout-button",
) {
  const bind = () => {
    const btn = root.querySelector(selector);
    if (!btn || btn.dataset.logoutBound === "1") return false;
    btn.dataset.logoutBound = "1";
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      logout();
    });
    return true;
  };

  if (bind()) return;

  const observer = new MutationObserver(() => {
    if (bind()) observer.disconnect();
  });
  observer.observe(root, { childList: true, subtree: true });

  setTimeout(() => {
    if (!root.querySelector(selector)) {
      console.error("Logout button not found in the DOM");
      observer.disconnect();
    }
  }, 2000);
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => setLogoutListener());
  } else {
    setLogoutListener();
  }
}
