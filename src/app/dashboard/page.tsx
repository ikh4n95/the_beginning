import { redirect } from 'next/navigation';
import { getUserFromSession } from '@/lib/session';

export default async function DashboardPage() {
  const user = await getUserFromSession();

  if (!user) {
    redirect('/login?next=/dashboard');
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-100">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-16">
        <div className="w-full max-w-2xl rounded-3xl border border-emerald-200 bg-white/80 p-10 shadow-xl backdrop-blur">
          <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">Welcome back. You are signed in as:</p>
          <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 px-6 py-4 text-sm font-medium text-emerald-900">
            {user.email}
          </div>

          <div className="mt-8 flex items-center gap-4">
            <a
              href="/logout"
              className="inline-flex items-center rounded-xl border border-emerald-200 bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700"
            >
              Log out
            </a>
            <a
              href="/"
              className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Back home
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
