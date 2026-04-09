import { NextRequest, NextResponse } from "next/server";
import { pickTopic } from "@/lib/blog/topics";
import { generateAndSaveAllLocales } from "@/lib/blog/generator";
import nodemailer from "nodemailer";

export async function GET(request: NextRequest) {
  // Verify cron secret (Vercel sends this automatically)
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Pick an unused topic
    const topic = await pickTopic();
    if (!topic) {
      return NextResponse.json({ message: "No unused topics available" }, { status: 200 });
    }

    // 2. Generate English + translate to all locales, save as drafts
    const saved = await generateAndSaveAllLocales(topic);

    // 3. Send email notification
    await sendNotification(topic.title, topic.slug);

    return NextResponse.json({
      message: "Drafts created in all locales",
      posts: saved,
    });
  } catch (error) {
    console.error("Blog draft cron error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

async function sendNotification(title: string, slug: string) {
  const host = process.env.EMAIL_HOST;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const recipient = process.env.RECIPIENT_EMAIL;

  if (!host || !user || !pass || !recipient) {
    console.warn("Email not configured, skipping notification");
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `"Awab Design Blog" <${user}>`,
    to: recipient,
    subject: `New Blog Draft: ${title}`,
    html: `
      <h2>New Blog Draft Ready for Review</h2>
      <p><strong>${title}</strong></p>
      <p>A new AI-generated blog draft has been saved to your admin panel.</p>
      <p><a href="https://www.awab.design/admin/blog">Review and publish →</a></p>
      <hr>
      <p style="color: #666; font-size: 12px;">This draft was auto-generated. Review, edit, and publish when ready.</p>
    `,
  });
}
