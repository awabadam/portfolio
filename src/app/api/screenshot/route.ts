import { NextRequest, NextResponse } from "next/server";

// In-memory cache for warm serverless instances. Fluid Compute reuses
// instances across invocations so this survives multiple requests.
const cache = new Map<string, { data: ArrayBuffer; contentType: string; timestamp: number }>();
const MEMORY_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// HTTP cache headers. Screenshots rarely change, so we cache aggressively.
// - max-age=86400     → browser holds for 1 day
// - s-maxage=2592000  → Vercel edge CDN holds for 30 days
// - stale-while-revalidate=604800 → serve stale up to 7 days while refetching
// Adds ~1.5 MB savings per visit after first load (previously: no browser cache)
const CACHE_CONTROL = "public, max-age=86400, s-maxage=2592000, stale-while-revalidate=604800";

// Allow-list of trusted hostnames we'll screenshot. Prevents arbitrary
// third parties from abusing this endpoint as an open image proxy.
const ALLOWED_HOSTS = new Set([
  "awab.design",
  "www.awab.design",
  "jouvencetr.com",
  "www.jouvencetr.com",
  "esteexpert.clinic",
  "www.esteexpert.clinic",
  "omar.marketing",
  "www.omar.marketing",
  "saphiredent.com",
  "www.saphiredent.com",
]);

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  // Validate URL + host allow-list
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  if (!ALLOWED_HOSTS.has(parsedUrl.hostname)) {
    return NextResponse.json({ error: "Host not allowed" }, { status: 403 });
  }

  // Check memory cache
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < MEMORY_CACHE_TTL) {
    return new NextResponse(cached.data, {
      headers: {
        "Content-Type": cached.contentType,
        "Cache-Control": CACHE_CONTROL,
        "X-Cache": "HIT",
      },
    });
  }

  try {
    // Smaller dimensions = smaller payload. 800x600 is plenty for the
    // 662x496 displayed size even on retina screens.
    const screenshotUrl = `https://image.thum.io/get/width/800/crop/600/${url}`;
    const response = await fetch(screenshotUrl, {
      // Let the fetch itself be cached by Vercel's Data Cache for a day
      next: { revalidate: 86400 },
    });

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
        "Cache-Control": CACHE_CONTROL,
        "X-Cache": "MISS",
      },
    });
  } catch (error) {
    console.error("Screenshot fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch screenshot" }, { status: 502 });
  }
}
