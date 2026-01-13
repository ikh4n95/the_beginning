import { NextResponse } from 'next/server';
import { clearSessionCookie, deleteSession, getSessionTokenFromRequest } from '@/lib/session';

export async function GET(request: Request) {
  const token = getSessionTokenFromRequest();
  await deleteSession(token);

  const response = NextResponse.redirect(new URL('/login', request.url));
  clearSessionCookie(response);
  return response;
}
