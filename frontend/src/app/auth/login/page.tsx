'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLoggedIn(!!localStorage.getItem('token'));
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      localStorage.setItem('token', data.access_token);
      router.push('/fan-dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <form onSubmit={handleLogin} className="bg-gray-900 p-8 rounded shadow space-y-4 w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4">Log In</h1>

        <input
          className="w-full p-2 rounded bg-gray-800 text-white"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          required
        />

        <input
          className="w-full p-2 rounded bg-gray-800 text-white"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          required
        />

        <button type="submit" className="bg-yellow-400 text-black px-4 py-2 rounded w-full">
          Log In
        </button>

        {error && <div className="text-red-400">{error}</div>}

        <div className="text-center mt-4">
          <Link href="/auth/signup" className="underline text-blue-400">
            Don't have an account? Sign Up
          </Link>
        </div>
      </form>
    </main>
  );
}
