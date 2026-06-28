import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isAuthenticated = request.cookies.has('admin_session');

  // Protect /api/admin (except login)
  if (path.startsWith('/api/admin') && !path.startsWith('/api/admin/login')) {
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }
  
  // Protect /api/ modifications (POST, PUT, PATCH, DELETE)
  // Assuming frontend API calls that modify data are for admin only
  if (path.startsWith('/api/') && !path.startsWith('/api/admin')) {
    if (request.method !== 'GET' && !isAuthenticated) {
       // Allow GET for public endpoints, protect others
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
