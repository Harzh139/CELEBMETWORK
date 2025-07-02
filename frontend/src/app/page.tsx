'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import CelebrityOnboardForm from './CelebrityOnboardForm';

type Celebrity = {
  id: number;
  name: string;
  genre: string;
  fanbase: number;
  country: string;
  thumbnail?: string;
};

export default function Home() {
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [loading, setLoading] = useState(true);
  const [prompt, setPrompt] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showOnboard, setShowOnboard] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<any>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    setLoggedIn(!!localStorage.getItem('token'));
  }, []);

  // Fetch all celebrities
  const fetchCelebs = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/celebrities`)
      .then(res => res.json())
      .then(data => setCelebrities(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCelebs();
  }, []);

  const handleSuggest = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/celebrities/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    setSuggestions(Array.isArray(data) ? data : []);
  };

  const handleOnboardClose = (refresh = false) => {
    setShowOnboard(false);
    setSelectedSuggestion(null);
    if (refresh) fetchCelebs();
  };

  const handleAddCelebrity = () => {
    if (!localStorage.getItem('token')) {
      window.location.href = '/auth/login';
      return;
    }
    // else show modal or navigate
  };

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
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-10 flex flex-col items-center max-w-lg w-full mt-4">
        <h1 className="text-4xl font-extrabold mb-4 text-yellow-400 drop-shadow-lg text-center">
          Welcome to <span className="text-purple-400">CelebNetwork</span>
        </h1>
        <p className="mb-8 text-lg text-gray-200 text-center">
          Discover, follow, and connect with your favorite celebrities.<br />
          Try our AI-powered celebrity recommender!
        </p>
        <input
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Describe an artist..."
          className="mb-4 p-2 rounded-md bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full"
        />
        <button
          onClick={handleSuggest}
          className="bg-black text-white rounded px-4 py-2 hover:bg-gray-800 mb-4"
        >
          Suggest Celebrities
        </button>
        {/* Suggestions */}
        <div className="w-full max-h-60 overflow-y-auto mb-4">
          {suggestions.map(s => (
            <div key={s.name} className="flex items-center bg-white/10 p-4 rounded-lg shadow-md mb-2">
              <img src={s.imageUrl} alt={s.name} className="w-16 h-16 rounded-full mr-4" />
              <div className="flex-1">
                <div className="text-lg font-semibold">{s.name}</div>
                <div className="text-sm text-gray-300">{s.genre} - {s.country}</div>
              </div>
              <button
                onClick={() => { setSelectedSuggestion(s); setShowOnboard(true); }}
                className="bg-black text-white rounded px-4 py-2 hover:bg-gray-800"
              >
                Select
              </button>
            </div>
          ))}
        </div>
        {/* Onboarding Modal/Form */}
        {showOnboard && (
          <CelebrityOnboardForm
            initialData={selectedSuggestion}
            onClose={(refresh?: boolean) => handleOnboardClose(refresh)}
          />
        )}
      </div>
      {/* Celebrity Grid */}
      <div className="w-full max-w-5xl mt-10">
        <h2 className="text-2xl font-bold mb-4">Explore Celebrities</h2>
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
      </div>
      <Link
        href={loggedIn ? "/celebrity/celebrity-signup" : "/auth/login"}
        className="mt-4 bg-green-600 text-white rounded px-4 py-2 hover:bg-green-500"
      >
        + Add a Celebrity
      </Link>
    </main>
  );
}
