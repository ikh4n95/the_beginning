'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data?.error ?? 'Unable to sign up.');
        return;
      }

      router.push('/login');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-red-100">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-16">
        <div className="w-full max-w-md rounded-3xl border border-rose-200 bg-white/80 p-10 shadow-xl backdrop-blur">
          <h1 className="text-3xl font-semibold text-gray-900">Create your account</h1>
          <p className="mt-2 text-sm text-gray-600">Get started with email and password.</p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-gray-700">
              Email
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-200"
                required
              />
            </label>

            <label className="block text-sm font-medium text-gray-700">
              Password
              <input
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-200"
                required
              />
            </label>
            <ul className="text-xs text-gray-500">
              <li>Password must be at least 8 characters.</li>
            </ul>

            <label className="block text-sm font-medium text-gray-700">
              Confirm password
              <input
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-200"
                required
              />
            </label>

            {error ? <p className="text-sm text-rose-600">{error}</p> : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-rose-400"
            >
              {isSubmitting ? 'Creating account...' : 'Sign up'}
            </button>
          </form>

          <p className="mt-6 text-sm text-gray-600">
            Already have an account?{' '}
            <a className="font-semibold text-rose-700 hover:text-rose-800" href="/login">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
