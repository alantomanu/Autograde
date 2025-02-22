import { NextResponse } from 'next/server';

export function middleware() {
  // Configure CORS
  const response = NextResponse.next();
  
  response.headers.set('Access-Control-Allow-Credentials', "true");
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
  response.headers.set(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  return response;
}

export const config = {
  matcher: '/api/:path*',
};