import { NextResponse } from "next/server";
import { generateBlogPost, saveBlogPost } from "@/lib/blog/generator";
import { pickTopic } from "@/lib/blog/topics";
import { getSession } from "@/lib/auth/server";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { customTopic } = body as { customTopic?: string };

    let topic;

    if (customTopic) {
      // User provided a custom topic
      const slug = customTopic
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      topic = {
        title: customTopic,
        slug,
        keywords: customTopic.split(" ").slice(0, 5),
        category: "Web Design",
      };
    } else {
      // Pick from predefined topics
      topic = await pickTopic();
      if (!topic) {
        return NextResponse.json(
          { error: "No unused topics available. Try entering a custom topic." },
          { status: 404 }
        );
      }
    }

    // Generate English version
    const post = await generateBlogPost(topic);

    // Save as draft
    await saveBlogPost(post, "en");

    return NextResponse.json({ post, message: "Draft created successfully" });
  } catch (error) {
    console.error("Blog generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate article" },
      { status: 500 }
    );
  }
}
