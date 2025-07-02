'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.access_token);
      router.push('/fan-dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white px-4">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full max-w-md bg-gray-800 p-6 rounded-xl shadow-xl">
        {error && <p className="text-red-400 text-sm">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="p-3 rounded-md bg-gray-700 text-white focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="p-3 rounded-md bg-gray-700 text-white focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-gradient-to-r from-yellow-400 to-purple-500 text-black font-bold px-4 py-2 rounded-full hover:scale-105 transition-transform"
        >
          Login
        </button>
      </form>
    </main>
  );
}
