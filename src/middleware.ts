import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isAuthenticated = request.cookies.has('admin_session');

  // ── Protect /admin page routes ───────────────────────────────────────────
  // Redirect unauthenticated browser navigation to the admin login page,
  // but let them access the root `/admin` so they can actually log in.
  if (path.startsWith('/admin') && path !== '/admin') {
    if (!isAuthenticated) {
      const loginUrl = new URL('/admin', request.url);
      loginUrl.searchParams.set('auth', 'required');
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── Protect /api/admin/* (except login + check) ──────────────────────────
  if (
    path.startsWith('/api/admin') &&
    !path.startsWith('/api/admin/login') &&
    !path.startsWith('/api/admin/check')
  ) {
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  // ── Protect non-GET mutations on all /api/* routes ───────────────────────
  // Admin mutations (POST/PATCH/DELETE) already require auth via cookie.
  // Allow public GET + public POST to /api/reviews (customer submissions).
  if (path.startsWith('/api/') && !path.startsWith('/api/admin')) {
    const isPublicPost =
      path === '/api/reviews' && request.method === 'POST';

    if (request.method !== 'GET' && !isPublicPost && !isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};
