import { NextResponse } from 'next/server';
import { getUserFromSession } from '@/lib/session';

export async function GET() {
  const user = await getUserFromSession();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ user: { id: user.id, email: user.email } });
}
