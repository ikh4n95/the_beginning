'use client';

import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetToken, setResetToken] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setResetToken('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data?.error ?? 'Unable to request reset.');
        return;
      }

      if (data?.resetToken) {
        setResetToken(String(data.resetToken));
      }

      setMessage('If an account exists for that email, a reset link has been sent.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-16">
        <div className="w-full max-w-md rounded-3xl border border-amber-200 bg-white/80 p-10 shadow-xl backdrop-blur">
          <h1 className="text-3xl font-semibold text-gray-900">Reset your password</h1>
          <p className="mt-2 text-sm text-gray-600">We will email you a reset link.</p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-gray-700">
              Email
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                required
              />
            </label>

            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
            {resetToken ? (
              <p className="break-all rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                Dev reset token: {resetToken}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-amber-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-amber-400"
            >
              {isSubmitting ? 'Sending...' : 'Send reset link'}
            </button>
          </form>

          <p className="mt-6 text-sm text-gray-600">
            Back to{' '}
            <a className="font-semibold text-amber-700 hover:text-amber-800" href="/login">
              sign in
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
