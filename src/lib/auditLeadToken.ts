import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Token for a partial /audit lead, issued by POST /api/audit/start and sent
 * back by /api/audit/progress and the final POST /api/audit so they can
 * update that row. Format: <lead uuid>.<first 32 hex chars of
 * HMAC-SHA256("audit-lead:" + id, secret)>. Stateless: the id travels inside
 * the token and the signature proves this server issued it. The "audit-lead:"
 * prefix keeps these signatures apart from the playbook keys (same secret).
 *
 * Server only (node:crypto). Never import from a client component.
 */

const SIGNATURE_HEX_LENGTH = 32;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

function signingSecret(): string {
  const s = process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET;
  if (s) return s;
  // Same dev-only fallback as src/lib/playbookKey.ts; production sets BETTER_AUTH_SECRET.
  return "playbook-dev-secret-change-me";
}

function sign(id: string): string {
  return createHmac("sha256", signingSecret())
    .update(`audit-lead:${id}`)
    .digest("hex")
    .slice(0, SIGNATURE_HEX_LENGTH);
}

export function createAuditLeadToken(id: string): string {
  return `${id.toLowerCase()}.${sign(id.toLowerCase())}`;
}

/** Returns the lead id the token was issued for, or null when it is missing, malformed or forged. */
export function verifyAuditLeadToken(token: string | null | undefined): string | null {
  if (!token || token.length > 120) return null;
  const dot = token.indexOf(".");
  if (dot <= 0) return null;
  const id = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!UUID_RE.test(id)) return null;
  if (sig.length !== SIGNATURE_HEX_LENGTH || !/^[0-9a-f]+$/.test(sig)) return null;
  const a = Buffer.from(sig, "utf8");
  const b = Buffer.from(sign(id), "utf8");
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return id;
}
