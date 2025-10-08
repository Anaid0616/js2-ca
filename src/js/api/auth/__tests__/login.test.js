// src/js/api/auth/__tests__/login.test.js
import { describe, it, expect, vi } from 'vitest';

// Add this FIRST so the module is mocked before ../login is loaded
vi.mock('../../utilities/formHandler.mjs', () => ({
  initializeFormHandler: vi.fn(), // no-op to avoid touching document
}));

import { login } from '../login';

global.fetch = vi.fn();

describe('login', () => {
  it('should return a user object when email and password are provided', async () => {
    const mockResponse = {
      token: '123abc',
      user: { email: 'test@example.com' },
    };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await login({
      email: 'test@example.com',
      password: 'password',
    });
    expect(result).toEqual(mockResponse);
  });

  it('should throw an error for an invalid login', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: 'Invalid credentials' }),
    });

    await expect(
      login({ email: 'wrong@example.com', password: 'wrongpassword' })
    ).rejects.toThrow();
  });
});
