import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createPasswordHash, getPasswordErrors } from '@/lib/auth';

function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const token = typeof body?.token === 'string' ? body.token : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  if (!token || !password) {
    return NextResponse.json({ error: 'Token and password are required.' }, { status: 400 });
  }

  const passwordErrors = getPasswordErrors(password);
  if (passwordErrors.length > 0) {
    return NextResponse.json({ error: passwordErrors.join(' ') }, { status: 400 });
  }

  const tokenHash = hashToken(token);
  const existing = await prisma.passwordResetToken.findFirst({
    where: {
      tokenHash,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
  });

  if (!existing) {
    return NextResponse.json({ error: 'Reset link is invalid or expired.' }, { status: 400 });
  }

  const { hash, salt } = createPasswordHash(password);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: existing.userId },
      data: { passwordHash: hash, passwordSalt: salt },
    }),
    prisma.passwordResetToken.update({
      where: { id: existing.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
