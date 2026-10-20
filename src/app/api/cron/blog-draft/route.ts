// Cron disabled 2026-10-17 (removed from vercel.json): generic auto-generated
// posts dilute the clinic positioning. Route kept so it can be re-enabled.
import { NextRequest, NextResponse } from "next/server";
import { pickTopic } from "@/lib/blog/topics";
import { generateAndSaveAllLocales } from "@/lib/blog/generator";
import { isEmailConfigured, sendEmail, NOTIFICATION_RECIPIENT } from "@/lib/email";

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
  if (!isEmailConfigured()) {
    console.warn("Email not configured, skipping notification");
    return;
  }

  await sendEmail({
    to: NOTIFICATION_RECIPIENT(),
    fromName: "Awab Design Blog",
    subject: `New Blog Draft: ${title}`,
    text: `New blog draft ready for review: ${title}\n\nReview and publish: https://www.awab.design/admin/blog`,
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
