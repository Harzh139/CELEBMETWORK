'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Login failed');
      const data = await res.json();
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('id', data.user.id);
      localStorage.setItem('role', data.user.role);
      router.push(data.user.role === 'fan' ? '/fan-dashboard' : '/celeb-dashboard');
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded shadow space-y-4 w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4">Log In</h1>
        <input
          className="w-full p-2 rounded bg-gray-800 text-white"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="w-full p-2 rounded bg-gray-800 text-white"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit" className="bg-yellow-400 text-black px-4 py-2 rounded w-full">Log In</button>
        {error && <div className="text-red-400">{error}</div>}
        <div className="text-center mt-4">
          <Link href="/auth/signup" className="underline text-blue-400">Don't have an account? Sign Up</Link>
        </div>
      </form>
    </main>
  );
}