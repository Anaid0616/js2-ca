import { onLogout } from "../logout";
import { describe, test, expect, beforeEach, vi } from "vitest";

describe("onLogout", () => {
  beforeEach(() => {
    const localStorageMock = (() => {
      let store = {};
      return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => (store[key] = value),
        removeItem: (key) => delete store[key],
        clear: () => (store = {}),
      };
    })();

    Object.defineProperty(global, "localStorage", {
      value: localStorageMock,
    });
    localStorage.setItem("token", "mockedToken");
  });

  test("removes token from localStorage", () => {
    expect(localStorage.getItem("token")).toBe("mockedToken");
    onLogout();
    expect(localStorage.getItem("token")).toBeFalsy();
  });
});
