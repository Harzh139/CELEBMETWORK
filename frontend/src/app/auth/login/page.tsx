'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) router.push('/fan-dashboard');
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

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
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4">
      <form
        onSubmit={handleLogin}
        className="bg-[#0f172a] text-white p-8 rounded-lg shadow-md w-full max-w-md space-y-5"
      >
        <h1 className="text-2xl font-bold text-white">Log In</h1>

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="w-full p-3 rounded bg-[#1e293b] text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          className="w-full p-3 rounded bg-[#1e293b] text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`w-full text-black font-semibold py-2 rounded bg-yellow-400 hover:bg-yellow-300 transition ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>

        <div className="text-center mt-4 text-sm text-blue-400">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="underline hover:text-blue-300">
            Sign Up
          </Link>
        </div>
      </form>
    </main>
  );
}
