import { randomUUID } from "crypto";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "kocusa2026";
export const ADMIN_COOKIE = "vk_admin_session";

const sessions = new Set<string>();

export function checkPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export function createSession(): string {
  const id = randomUUID();
  sessions.add(id);
  return id;
}

export function isValidSession(id: string | undefined): boolean {
  return !!id && sessions.has(id);
}

export function destroySession(id: string | undefined) {
  if (id) sessions.delete(id);
}
