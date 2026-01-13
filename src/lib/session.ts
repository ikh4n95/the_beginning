import crypto from 'crypto';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

const SESSION_COOKIE_NAME = 'sid';
const SESSION_DURATION_DAYS = 7;
const SESSION_TOKEN_BYTES = 32;

function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function getSessionCookieOptions(expires?: Date) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    expires,
  };
}

export async function createSession(userId: number) {
  const token = crypto.randomBytes(SESSION_TOKEN_BYTES).toString('hex');
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: {
      sessionTokenHash: tokenHash,
      userId,
      expiresAt,
    },
  });

  return { token, expiresAt };
}

export async function setSessionCookie(response: { cookies: { set: Function } }, userId: number) {
  const { token, expiresAt } = await createSession(userId);
  response.cookies.set(SESSION_COOKIE_NAME, token, getSessionCookieOptions(expiresAt));
}

export function clearSessionCookie(response: { cookies: { set: Function } }) {
  response.cookies.set(SESSION_COOKIE_NAME, '', {
    ...getSessionCookieOptions(new Date(0)),
    maxAge: 0,
  });
}

export function getSessionTokenFromRequest() {
  return cookies().get(SESSION_COOKIE_NAME)?.value ?? null;
}

export async function deleteSession(token?: string | null) {
  if (!token) return;
  await prisma.session.deleteMany({
    where: { sessionTokenHash: hashToken(token) },
  });
}

export async function getUserFromSession() {
  const token = getSessionTokenFromRequest();
  if (!token) return null;

  const session = await prisma.session.findFirst({
    where: {
      sessionTokenHash: hashToken(token),
      expiresAt: { gt: new Date() },
    },
    include: { user: true },
  });

  return session?.user ?? null;
}
