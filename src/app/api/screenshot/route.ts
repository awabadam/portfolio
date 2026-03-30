import { NextRequest, NextResponse } from "next/server";

// Cache screenshots in memory for the lifetime of the serverless function
const cache = new Map<string, { data: ArrayBuffer; contentType: string; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  // Validate URL
  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  // Check memory cache
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return new NextResponse(cached.data, {
      headers: {
        "Content-Type": cached.contentType,
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        "X-Cache": "HIT",
      },
    });
  }

  try {
    const screenshotUrl = `https://image.thum.io/get/width/1200/crop/900/${url}`;
    const response = await fetch(screenshotUrl);

    if (!response.ok) {
      return NextResponse.json({ error: "Screenshot service unavailable" }, { status: 502 });
    }

    const data = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/png";

    // Store in memory cache
    cache.set(url, { data, contentType, timestamp: Date.now() });

    return new NextResponse(data, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        "X-Cache": "MISS",
      },
    });
  } catch (error) {
    console.error("Screenshot fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch screenshot" }, { status: 502 });
  }
}
