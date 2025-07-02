'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [form, setForm] = useState({ email: '', password: '', name: '', role: 'fan' });
  const [error, setError] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem('token'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Signup failed');
      router.push('/auth/login');
    } catch (err) {
      setError('Signup failed');
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded shadow space-y-4 w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
        <input
          className="w-full p-2 rounded bg-gray-800 text-white"
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
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
        {/*<select
          className="w-full p-2 rounded bg-gray-800 text-white"
          value={form.role}
          onChange={e => setForm({ ...form, role: e.target.value })}
        >
          <option value="fan">Fan</option>
          <option value="celebrity">Celebrity</option>
        </select>*/}
        <button type="submit" className="bg-yellow-400 text-black px-4 py-2 rounded w-full">Sign Up</button>
        {error && <div className="text-red-400">{error}</div>}
        <div className="text-center mt-4">
          <Link href="/auth/login" className="underline text-blue-400">Already have an account? Log In</Link>
        </div>
      </form>
      <nav>
        {!loggedIn && (
          <>
            <Link href="/auth/login" className="underline text-blue-400">Login</Link>
            <Link href="/auth/signup" className="underline text-blue-400">Sign Up</Link>
          </>
        )}
        {/* Other nav items */}
      </nav>
    </main>
  );
}