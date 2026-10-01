import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';
import { getSessionCookie } from 'better-auth/cookies';

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
  // Optimistic gate for the admin area: only checks that a session cookie
  // exists. The real session check runs server-side (requireAdmin) on every
  // admin action and API route.
  if (pathname.startsWith('/admin') && !getSessionCookie(request)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const response = shouldSkipIntl
    ? NextResponse.next()
    : intlMiddleware(request);

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
