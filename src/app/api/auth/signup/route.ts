import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createPasswordHash, getPasswordErrors, normalizeEmail } from '@/lib/auth';
import { setSessionCookie } from '@/lib/session';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === 'string' ? normalizeEmail(body.email) : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }

  const passwordErrors = getPasswordErrors(password);
  if (passwordErrors.length > 0) {
    return NextResponse.json({ error: passwordErrors.join(' ') }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: 'An account already exists for that email.' }, { status: 409 });
  }

  const { hash, salt } = createPasswordHash(password);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: hash,
      passwordSalt: salt,
    },
  });

  const response = NextResponse.json({ ok: true }, { status: 201 });
  await setSessionCookie(response, user.id);
  return response;
}
