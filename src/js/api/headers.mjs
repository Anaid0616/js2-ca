import { API_KEY } from './constants.mjs';

export function headers() {
  const headers = new Headers();

  if (API_KEY) {
    headers.append('X-Noroff-API-Key', API_KEY);
  }

  const token = localStorage.getItem('token'); // Retrieve the token from local storage
  if (token) {
    headers.append('Authorization', `Bearer ${token}`); // Add the token to headers
  }

  headers.append('Content-Type', 'application/json'); // Set content type
  return headers;
}
