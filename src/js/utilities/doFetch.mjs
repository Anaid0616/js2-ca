// src/js/utilities/doFetch.mjs
import { headers } from "../api/headers.mjs";

/**
 * Reusable fetch with optional auth headers.
 * - Throws on non-2xx (using server `message` if available).
 * - Safely handles 204 No Content.
 */
export async function doFetch(url, options = {}, useAuth = true) {
  const customHeaders = useAuth
    ? headers()
    : new Headers({ "Content-Type": "application/json" });

  const fetchOptions = { headers: customHeaders, ...options };

  const response = await fetch(url, fetchOptions);

  // 204: nothing to parse
  if (response.status === 204) {
    return null;
  }

  // Try to parse JSON even on error responses
  let data = null;
  try {
    data = await response.json();
  } catch {
    // ignore parse errors
  }

  if (!response.ok) {
    const msg =
      (data && data.message) || `Request failed (HTTP ${response.status})`;
    throw new Error(msg);
  }

  return data;
}
