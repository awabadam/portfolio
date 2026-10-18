import nodemailer, { type Transporter } from "nodemailer";

/**
 * Shared SMTP transport for the API routes (contact form, clinic audit).
 * Env: EMAIL_HOST, EMAIL_PORT (default 587), EMAIL_USER, EMAIL_PASS,
 * RECIPIENT_EMAIL (where notifications go).
 */

export function isEmailConfigured(): boolean {
  return Boolean(
    process.env.EMAIL_HOST &&
      process.env.EMAIL_USER &&
      process.env.EMAIL_PASS &&
      process.env.RECIPIENT_EMAIL,
  );
}

export function createEmailTransport(): Transporter {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 587),
    secure: false, // STARTTLS on 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
  /** Small text attachments (e.g. the lead tracker CSV sent with the audit email). */
  attachments?: { filename: string; content: string; contentType?: string }[];
}

/**
 * Sends one email. Never throws: returns { sent: false, error } when the
 * transport is not configured or SMTP fails, so callers can save the lead
 * and still answer 200.
 */
export async function sendEmail(
  options: SendEmailOptions,
  transporter: Transporter = createEmailTransport(),
): Promise<{ sent: boolean; error?: string }> {
  if (!isEmailConfigured()) {
    console.warn("[email] not configured; skipping:", options.subject);
    return { sent: false, error: "email_not_configured" };
  }
  try {
    await transporter.sendMail({
      from: { name: "Awab Elkhalil", address: process.env.EMAIL_USER ?? "" },
      to: options.to,
      replyTo: options.replyTo,
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: options.attachments,
    });
    return { sent: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[email] send failed:", options.subject, message);
    return { sent: false, error: message };
  }
}

export const NOTIFICATION_RECIPIENT = () => process.env.RECIPIENT_EMAIL || "";
