import { describe, it, expect, beforeEach } from "vitest";
import {
  setSession,
  updateAccessToken,
  clearSession,
  getAccessToken,
  getCustomerId,
  isAuthenticated,
  hasAuthHint,
} from "./authStorage";

describe("authStorage", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it("persists a session in localStorage (survives tab close)", () => {
    setSession({ access_token: "tok", id: 42, name: "Jane" });
    expect(getAccessToken()).toBe("tok");
    expect(getCustomerId()).toBe("42");
    expect(hasAuthHint()).toBe(true);
    expect(localStorage.getItem("access_token")).toBe("tok");
    expect(sessionStorage.getItem("access_token")).toBeNull();
  });

  it("migrates a legacy sessionStorage token", () => {
    sessionStorage.setItem("access_token", "legacy");
    expect(getAccessToken()).toBe("legacy");
    expect(isAuthenticated()).toBe(true);
  });

  it("updateAccessToken swaps only the token, keeps identity", () => {
    setSession({ access_token: "old", id: 7, name: "X" });
    updateAccessToken("new");
    expect(getAccessToken()).toBe("new");
    expect(getCustomerId()).toBe("7");
  });

  it("clearSession wipes everything", () => {
    setSession({ access_token: "tok", id: 1, name: "x" });
    clearSession();
    expect(getAccessToken()).toBeNull();
    expect(isAuthenticated()).toBe(false);
    expect(hasAuthHint()).toBe(false);
  });

  it("ignores setSession without a token", () => {
    setSession({ access_token: null, id: 1, name: "x" });
    expect(isAuthenticated()).toBe(false);
  });
});
