import { randomUUID } from "crypto";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "kocusa2026";
export const ADMIN_COOKIE = "vk_admin_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8; // 8h, must match the cookie's maxAge

// session id -> expiry timestamp (ms). A Set never expired entries on its
// own, so a leaked/old session id would stay valid forever until a server
// restart; tracking expiry here makes the server the source of truth
// instead of trusting the cookie's maxAge alone.
const sessions = new Map<string, number>();

export function checkPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export function createSession(): string {
  const id = randomUUID();
  sessions.set(id, Date.now() + SESSION_MAX_AGE_SECONDS * 1000);
  return id;
}

export function isValidSession(id: string | undefined): boolean {
  if (!id) return false;
  const expiresAt = sessions.get(id);
  if (!expiresAt) return false;
  if (Date.now() > expiresAt) {
    sessions.delete(id);
    return false;
  }
  return true;
}

export function destroySession(id: string | undefined) {
  if (id) sessions.delete(id);
}

// --- Login rate limiting (per client key, e.g. IP) ---
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 8;
const loginAttempts = new Map<string, number[]>();

export function isLoginRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (loginAttempts.get(key) ?? []).filter(
    (t) => now - t < LOGIN_WINDOW_MS
  );
  loginAttempts.set(key, recent);
  return recent.length >= LOGIN_MAX_ATTEMPTS;
}

export function recordFailedLogin(key: string) {
  const recent = loginAttempts.get(key) ?? [];
  recent.push(Date.now());
  loginAttempts.set(key, recent);
}
