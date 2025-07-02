'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Check for token in localStorage
    setLoggedIn(!!localStorage.getItem('token'));
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white px-4">
      <nav className="w-full flex justify-end gap-4 py-4">
        {!loggedIn && (
          <>
            <Link href="/auth/login" className="bg-black text-white rounded px-4 py-2 hover:bg-gray-800">Login</Link>
            <Link href="/auth/signup" className="bg-black text-white rounded px-4 py-2 hover:bg-gray-800">Sign Up</Link>
          </>
        )}
        <Link href="/fan-dashboard" className="bg-black text-white rounded px-4 py-2 hover:bg-gray-800">Fan Dashboard</Link>
        <Link href="/celeb-dashboard" className="bg-black text-white rounded px-4 py-2 hover:bg-gray-800">Celebrity Dashboard</Link>
      </nav>
      <Link
        href="/somewhere"
        className="bg-gradient-to-r from-yellow-400 to-purple-500 text-black font-semibold px-6 py-2 rounded-full shadow-lg hover:scale-105 hover:from-yellow-300 hover:to-purple-400 transition-transform"
      >
        Go Somewhere
      </Link>
      <button
        className="bg-gradient-to-r from-yellow-400 to-purple-500 text-black font-semibold px-6 py-2 rounded-full shadow-lg hover:scale-105 hover:from-yellow-300 hover:to-purple-400 transition-transform"
      >
        Button Text
      </button>
      {/* ...rest of your page... */}
    </main>
  );
}