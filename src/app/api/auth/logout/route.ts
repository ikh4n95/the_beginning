import { NextResponse } from 'next/server';
import { clearSessionCookie, deleteSession, getSessionTokenFromRequest } from '@/lib/session';

export async function POST() {
  const token = getSessionTokenFromRequest();
  await deleteSession(token);
  const response = NextResponse.json({ ok: true });
  clearSessionCookie(response);
  return response;
}
