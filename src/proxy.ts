import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';
import { createMiddlewareSupabaseClient } from '@/lib/supabase/middleware';

const intlMiddleware = createIntlMiddleware(routing);

// Block indexing on preview/development deploys so Vercel preview URLs
// (and any non-production hostnames) never leak into Google's index.
// VERCEL_ENV is one of: "production" | "preview" | "development".
const isProduction = process.env.VERCEL_ENV === "production";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip i18n for admin, api, login, and static assets
  const shouldSkipIntl =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.');

  // next-intl's createIntlMiddleware automatically detects the user's
  // preferred language from the Accept-Language header (device language)
  // and redirects to the matching locale on first visit.
  const response = shouldSkipIntl
    ? NextResponse.next()
    : intlMiddleware(request);

  // Supabase session refresh — skipped for crawlers and API routes.
  // Crawlers don't need sessions, and running this on every Googlebot
  // request was slowing down mobile indexing (tight crawler timeouts).
  // API routes handle their own auth.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const userAgent = request.headers.get('user-agent') || '';
  const isBot = /bot|crawl|spider|slurp|bingpreview|googlebot|bingbot|yandex|baidu|duckduckbot|facebookexternalhit|applebot/i.test(userAgent);
  const isApiRoute = pathname.startsWith('/api');

  if (supabaseUrl && supabaseKey && !isBot && !isApiRoute) {
    try {
      const supabase = createMiddlewareSupabaseClient(request, response);
      await supabase.auth.getSession();
    } catch (error) {
      console.warn('Middleware Supabase error:', error);
    }
  }

  // Block search engines on any non-production deploy (preview/development).
  // This is the strongest layer — Google respects X-Robots-Tag immediately.
  if (!isProduction) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
