// ui/global/logout.mjs
export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/auth/login/';
}

/**
 * Optional helper if a page already has button in DOM
 */
export function setLogoutListener(root = document) {
  const btn = root.querySelector('#logout-button');
  if (!btn) return;
  btn.addEventListener('click', logout);
}
