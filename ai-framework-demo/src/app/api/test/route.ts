import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * GET handler for the test API route
 * @param request - The incoming request
 * @returns JSON response with status 200
 */
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { 
      status: 'success',
      message: 'API is working correctly',
      timestamp: new Date().toISOString()
    },
    { status: 200 }
  );
}

/**
 * OPTIONS handler to properly handle preflight requests
 * @param request - The incoming request
 * @returns Empty response with CORS headers
 */
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
} 