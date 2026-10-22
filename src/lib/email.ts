/**
 * Shared email sender for the API routes (contact form, clinic audit,
 * playbook, newsletter, crons), via the Resend HTTP API.
 * Env: RESEND_API_KEY (a send-only key is enough), RECIPIENT_EMAIL (where
 * notifications go).
 *
 * Two senders on awab.design, both Google Workspace aliases of admin@ (so
 * replies land in one inbox): hello@ for conversations (contact form,
 * newsletter, admin alerts) and audit@ for the clinic audit, playbook and
 * template-pack emails.
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";
export const SENDERS = {
  hello: "hello@awab.design",
  audit: "audit@awab.design",
} as const;
const DEFAULT_FROM_NAME = "Awab Design";

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.RECIPIENT_EMAIL);
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
  /** Which awab.design address sends it (defaults to hello@). */
  from?: keyof typeof SENDERS;
  /** Display name on the From line (defaults to "Awab Design"). */
  fromName?: string;
  /** Small text attachments. */
  attachments?: { filename: string; content: string; contentType?: string }[];
}

/**
 * Sends one email. Never throws: returns { sent: false, error } when Resend
 * is not configured or the send fails, so callers can save the lead and
 * still answer 200.
 */
export async function sendEmail(options: SendEmailOptions): Promise<{ sent: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] not configured; skipping:", options.subject);
    return { sent: false, error: "email_not_configured" };
  }
  const address = SENDERS[options.from ?? "hello"];
  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: `${options.fromName ?? DEFAULT_FROM_NAME} <${address}>`,
        to: [options.to],
        reply_to: options.replyTo,
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachments: options.attachments?.map((a) => ({
          filename: a.filename,
          content: Buffer.from(a.content, "utf8").toString("base64"),
          content_type: a.contentType,
        })),
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Resend ${res.status}: ${body.slice(0, 300)}`);
    }
    return { sent: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[email] send failed:", options.subject, message);
    return { sent: false, error: message };
  }
}

export const NOTIFICATION_RECIPIENT = () => process.env.RECIPIENT_EMAIL || "";
