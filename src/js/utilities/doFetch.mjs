import { headers } from '../api/headers.mjs';

/**
 * A reusable fetch function.
 *
 * @param {string} url - The API endpoint URL.
 * @param {Object} options - Fetch options such as method, body, etc.
 * @param {boolean} [useAuth=true] - Whether to include authentication-related headers.
 * @returns {Promise<any>} A promise that resolves to the response data.
 * @throws {Error} An error if the request fails.
 */
export async function doFetch(url, options = {}, useAuth = true) {
  try {
    // Set up headers, optionally including auth headers
    const customHeaders = useAuth
      ? headers()
      : new Headers({ 'Content-Type': 'application/json' });

    const fetchOptions = {
      ...options,
      headers: customHeaders,
    };

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Something went wrong');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in doFetch:', error);
    throw error;
  }
}
