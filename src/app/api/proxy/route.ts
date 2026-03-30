import { NextRequest, NextResponse } from "next/server";

const ALLOWED_ORIGINS = [
  "https://saphiredent.com",
  "https://www.saphiredent.com",
];

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  // Only allow proxying whitelisted origins
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  const origin = `${parsed.protocol}//${parsed.host}`;
  if (!ALLOWED_ORIGINS.includes(origin)) {
    return NextResponse.json({ error: "Origin not allowed" }, { status: 403 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    const contentType = response.headers.get("content-type") || "text/html";
    const body = await response.text();

    // Inject a <base> tag so relative URLs (CSS, images, JS) resolve against the original site
    const baseTag = `<base href="${origin}/">`;
    const modifiedBody = body.replace(
      /(<head[^>]*>)/i,
      `$1${baseTag}`
    );

    return new NextResponse(modifiedBody, {
      status: response.status,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        // Intentionally omit X-Frame-Options and frame-ancestors
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 502 });
  }
}
