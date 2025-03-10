import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware function to handle headers for all requests
 * @param request - The incoming request
 * @returns Modified response with updated headers
 */
export function middleware(request: NextRequest) {
  // Clone the request headers
  const requestHeaders = new Headers(request.headers);
  
  // Get response for the request
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  
  // Set CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  
  // Remove X-Frame-Options header completely
  response.headers.delete('X-Frame-Options');
  
  // Set Content-Security-Policy to allow embedding from anywhere
  response.headers.set('Content-Security-Policy', "default-src * 'unsafe-inline' 'unsafe-eval'; frame-ancestors *;");
  
  return response;
}

/**
 * Configure which paths should be processed by this middleware
 */
export const config = {
  matcher: '/(.*)',
}; 