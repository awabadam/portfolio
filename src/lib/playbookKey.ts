import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Stateless access key for /audit/playbook, issued by POST /api/audit after a
 * lead is saved. Format: <base64url(email)>.<first 32 hex chars of
 * HMAC-SHA256(email, secret)>. Verifying needs no database: the email travels
 * inside the key and the signature proves this server issued it.
 *
 * Server only (node:crypto). Never import from a client component.
 */

const SIGNATURE_HEX_LENGTH = 32;

function signingSecret(): string {
  const s = process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET;
  if (s) return s;
  // TODO: set BETTER_AUTH_SECRET in production; this fallback only keeps local dev working.
  return "playbook-dev-secret-change-me";
}

function sign(email: string): string {
  return createHmac("sha256", signingSecret()).update(email).digest("hex").slice(0, SIGNATURE_HEX_LENGTH);
}

export function createPlaybookKey(email: string): string {
  const normalized = email.trim().toLowerCase();
  return `${Buffer.from(normalized, "utf8").toString("base64url")}.${sign(normalized)}`;
}

/** Returns the email the key was issued for, or null when the key is missing, malformed or forged. */
export function verifyPlaybookKey(key: string | null | undefined): string | null {
  if (!key || key.length > 400) return null;
  const dot = key.lastIndexOf(".");
  if (dot <= 0) return null;
  const encoded = key.slice(0, dot);
  const sig = key.slice(dot + 1);
  if (sig.length !== SIGNATURE_HEX_LENGTH || !/^[0-9a-f]+$/.test(sig)) return null;
  let email: string;
  try {
    email = Buffer.from(encoded, "base64url").toString("utf8");
  } catch {
    return null;
  }
  if (!email || !email.includes("@") || email.length > 200) return null;
  const expected = sign(email);
  const a = Buffer.from(sig, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return email;
}
