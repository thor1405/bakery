import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token');
  const isAuthPage = request.nextUrl.pathname.startsWith('/login');
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin');

  // If trying to access admin without a token, redirect to login
  if (isAdminPage && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If trying to access login while already authenticated, redirect to admin dashboard
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
