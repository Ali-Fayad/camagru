import { SESSION_KEYS } from "./constants.js";

export const AuthStorage = {
  getUser() {
    const raw = sessionStorage.getItem(SESSION_KEYS.user);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw);
    } catch (error) {
      console.warn("Unable to parse user session", error);
      sessionStorage.removeItem(SESSION_KEYS.user);
      return null;
    }
  },
  getToken() {
    return sessionStorage.getItem(SESSION_KEYS.token);
  },
  setSession(user, token) {
    sessionStorage.setItem(SESSION_KEYS.user, JSON.stringify(user));
    if (token) {
      sessionStorage.setItem(SESSION_KEYS.token, token);
    }
  },
  clear() {
    sessionStorage.removeItem(SESSION_KEYS.user);
    sessionStorage.removeItem(SESSION_KEYS.token);
  },
  isAuthenticated() {
    return Boolean(this.getUser());
  },
};
