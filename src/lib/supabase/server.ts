import { createServerClient } from '@supabase/ssr';
import { type CookieOptions } from '@supabase/ssr';
import { type NextRequest, type NextResponse } from 'next/server';

// For use in middleware or API routes in pages directory
export function createServerSupabaseClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return null;
        },
        set(name: string, value: string, options: CookieOptions) {
          // This is a placeholder that will be overridden
        },
        remove(name: string, options: CookieOptions) {
          // This is a placeholder that will be overridden
        },
      },
    }
  );
}

// For use in middleware
export function createMiddlewareSupabaseClient(
  request: NextRequest,
  response: NextResponse
) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );
}
