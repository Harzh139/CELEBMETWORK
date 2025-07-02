'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Celebrity = {
  id: number;
  name: string;
  genre: string;
  fanbase?: string; // <-- string, not number
  country: string;
  thumbnail?: string;
};

export default function CelebrityGrid() {
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false); // Track login state

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/celebrities`)
      .then((res) => res.json())
      .then((data) => setCelebrities(data))
      .finally(() => setLoading(false));

    // Check login status
    const token = localStorage.getItem('token');
    setLoggedIn(!!token);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Celebrities</h1>
        <Link
          href={loggedIn ? '/celebrity/celebrity-signup' : '/auth/login'}
          className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold hover:bg-yellow-300"
        >
          + Add a Celebrity
        </Link>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : celebrities.length === 0 ? (
        <div className="text-gray-400 text-center mt-8">
          No celebrities found. Be the first to add one!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {celebrities.map((celeb) => (
            <div
              key={celeb.id}
              className="bg-white text-black rounded-lg shadow p-4 flex flex-col items-center"
            >
              <img
                src={celeb.thumbnail || '/default.jpg'}
                alt={celeb.name}
                className="w-32 h-32 object-cover rounded-full mb-4 border"
              />
              <h2 className="text-xl font-semibold mb-2">{celeb.name}</h2>
              <p className="mb-1">
                <span className="font-semibold">Category:</span> {celeb.genre}
              </p>
              <p className="mb-1">
                <span className="font-semibold">Fanbase:</span> {celeb.fanbase}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Location:</span> {celeb.country}
              </p>
              <Link
                href={`/celebrity/${celeb.id}`}
                className="mt-auto text-blue-600 underline"
              >
                View Profile
              </Link>
            </div>
          ))}
        </div>
      )}
      <div className="mt-8 text-center">
        <button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-xl shadow-lg hover:scale-105 transition">
          Add
        </button>
      </div>
    </main>
  );
}
