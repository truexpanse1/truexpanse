// middleware.ts (must be in the root of the project)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Let everything pass through untouched (including all /api routes)
  return NextResponse.next();
}

// THIS IS THE ONLY LINE THAT MATTERS — it excludes /api routes from middleware
export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
