import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';
import { createMiddlewareSupabaseClient } from '@/lib/supabase/middleware';

// Map countries to preferred locale
const countryLocaleMap: Record<string, string> = {
  TR: 'tr',
  SA: 'ar', SD: 'ar', EG: 'ar', AE: 'ar', IQ: 'ar',
  JO: 'ar', KW: 'ar', QA: 'ar', BH: 'ar', OM: 'ar',
  LB: 'ar', LY: 'ar', YE: 'ar', SY: 'ar', PS: 'ar',
  FR: 'fr', BE: 'fr', CH: 'fr', MC: 'fr',
  MA: 'fr', TN: 'fr', DZ: 'fr',
  SN: 'fr', CI: 'fr', CM: 'fr', CD: 'fr', MG: 'fr',
};

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip i18n for admin, api, login, and static assets
  const shouldSkipIntl =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.');

  if (!shouldSkipIntl) {
    // Geo-based locale detection for first visits (no locale prefix in URL)
    const hasLocalePrefix = /^\/(en|ar|tr|fr)(\/|$)/.test(pathname);
    const isRoot = pathname === '/';

    if ((isRoot || !hasLocalePrefix) && !request.cookies.get('NEXT_LOCALE')) {
      const country = request.headers.get('x-vercel-ip-country') || '';
      const geoLocale = countryLocaleMap[country];

      if (geoLocale && geoLocale !== 'en') {
        const url = request.nextUrl.clone();
        url.pathname = `/${geoLocale}${pathname}`;
        const response = NextResponse.redirect(url);
        response.cookies.set('NEXT_LOCALE', geoLocale, { maxAge: 60 * 60 * 24 * 365 });
        return response;
      }
    }
  }

  const response = shouldSkipIntl
    ? NextResponse.next()
    : intlMiddleware(request);

  // Supabase session refresh
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createMiddlewareSupabaseClient(request, response);
      await supabase.auth.getSession();
    } catch (error) {
      console.warn('Middleware Supabase error:', error);
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
