// logout.test.js
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock the alert so we don't show real toasts
vi.mock('../../utilities/alert.mjs', () => ({
  showAlert: vi.fn(),
}));

import { logout as onLogout } from '../logout.mjs';

describe('onLogout', () => {
  let originalLocation;

  beforeEach(() => {
    // You already run jsdom; it provides localStorage.
    // Seed storage
    localStorage.setItem('token', 'mockedToken');
    localStorage.setItem('user', JSON.stringify({ id: 1 }));

    // Make location writable: delete and reassign
    originalLocation = window.location;
    delete window.location;
    window.location = { ...originalLocation, href: '' };

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
    // Restore the real location
    delete window.location;
    window.location = originalLocation;
    vi.clearAllMocks();
  });

  test('removes token and user from localStorage', () => {
    onLogout();
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  test('redirects to /auth/login/ after 3s', () => {
    onLogout();
    vi.advanceTimersByTime(3000);
    expect(window.location.href).toBe('/auth/login/');
  });
});
