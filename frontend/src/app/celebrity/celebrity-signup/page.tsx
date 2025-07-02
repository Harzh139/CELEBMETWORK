'use client';

import { useState } from 'react';

type CelebrityForm = {
  name: string;
  genre: string;
  country: string;
  description: string; // <-- add this
  fanbase: string;
  instagram?: string;
  youtube?: string;
  imdb?: string;
  thumbnail?: string;
};

type Celebrity = {
  id: number;
  name: string;
  genre: string;
  country: string;
  description?: string;
  fanbase?: string; // <-- string, not number
  instagram?: string;
  youtube?: string;
  imdb?: string;
  thumbnail?: string;
};

export default function CelebritySignup() {
  const [intro, setIntro] = useState('');
  const [suggestions, setSuggestions] = useState<{ name: string; imageUrl?: string }[]>([]);
  const [form, setForm] = useState<CelebrityForm>({
    name: '',
    genre: '',
    country: '',
    description: '', // <-- add this
    fanbase: '',
    instagram: '',
    youtube: '',
    imdb: '',
    thumbnail: '', // add this
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // 1. Get AI suggestions
  const getSuggestions = async () => {
    setLoading(true);
    setSuggestions([]);
    try {
      const prompt = `Suggest 5 celebrities based on this intro: "${intro}". For each, return a JSON object with "name", "genre", "country", "fanbase" (describe the typical fans, e.g. "Punjabi music lovers"), "imageUrl", "instagram", "youtube", and "imdb". Example: [{"name": "...", "genre": "...", "country": "...", "fanbase": "...", "imageUrl": "...", "instagram": "...", "youtube": "...", "imdb": "..."}]`;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/celebrities/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setSuggestions(Array.isArray(data) ? data : []);
    } catch (err) {
      alert('Failed to get suggestions');
    } finally {
      setLoading(false);
    }
  };

  // 2. Autofill form fields when a suggestion is chosen
  const autofill = (suggestion: any) => {
    setForm({
      ...form,
      name: suggestion.name || '',
      genre: suggestion.genre || '',
      country: suggestion.country || '',
      description: suggestion.description || '',
      fanbase: suggestion.fanbase || 'Fans of ' + (suggestion.name || 'this artist'), // fallback!
      instagram: suggestion.instagram || '',
      youtube: suggestion.youtube || '',
      imdb: suggestion.imdb || '',
      thumbnail: suggestion.imageUrl || '',
    });
  };

  // 3. Submit form to backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      // 1. Create the celebrity
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/celebrities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to create celebrity');
      const created = await res.json();

      // 2. Auto-follow if user is a fan and logged in
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      if (token && role === 'fan' && created.id) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/follow`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ celebrityId: created.id }),
        });
      }

      setSubmitted(true);
    } catch (err) {
      alert('Failed to submit celebrity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <nav className="mb-8 flex gap-4">
        <a href="/" className="underline text-blue-400">Home</a>
        <a href="/celebrity" className="underline text-blue-400">Celebrity Grid</a>
        <a href="/fan-dashboard" className="underline text-blue-400">Fan Dashboard</a>
        <a href="/celeb-dashboard" className="underline text-blue-400">Celebrity Dashboard</a>
        <a href="/auth/login" className="underline text-blue-400">Login</a>
        <a href="/auth/signup" className="underline text-blue-400">Sign Up</a>
      </nav>

      <h1 className="text-2xl font-bold mb-4">Celebrity Signup</h1>
      <textarea
        className="w-full p-4 text-white bg-gray-900 rounded-lg"
        rows={3}
        placeholder='Describe yourself (e.g., "Singer who performed at Coachella")'
        value={intro}
        onChange={e => setIntro(e.target.value)}
      />
      <button
        onClick={getSuggestions}
        disabled={loading || !intro}
        className="mt-4 bg-yellow-400 text-black px-6 py-2 rounded hover:bg-yellow-300 disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'Get Suggestions'}
      </button>

      {suggestions.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">AI Suggestions</h2>
          <ul>
            {suggestions.map((s, i) => (
              <li key={i}>
                <button
                  className="underline text-blue-400"
                  onClick={() => autofill(s)}
                  type="button"
                >
                  {s.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-3 max-w-md">
        <input
          className="w-full p-2 rounded bg-gray-900 text-white"
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="w-full p-2 rounded bg-gray-900 text-white"
          placeholder="Genre"
          value={form.genre}
          onChange={e => setForm({ ...form, genre: e.target.value })}
        />
        <input
          className="w-full p-2 rounded bg-gray-900 text-white"
          placeholder="Country"
          value={form.country}
          onChange={e => setForm({ ...form, country: e.target.value })}
        />
        <input
          className="w-full p-2 rounded bg-gray-900 text-white"
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />
        <input
          className="w-full p-2 rounded bg-gray-900 text-white"
          placeholder="Fanbase"
          value={form.fanbase}
          required
          onChange={e => setForm({ ...form, fanbase: e.target.value })}
        />
        <input
          className="w-full p-2 rounded bg-gray-900 text-white"
          placeholder="Instagram"
          value={form.instagram}
          onChange={e => setForm({ ...form, instagram: e.target.value })}
        />
        <input
          className="w-full p-2 rounded bg-gray-900 text-white"
          placeholder="YouTube"
          value={form.youtube}
          onChange={e => setForm({ ...form, youtube: e.target.value })}
        />
        <input
          className="w-full p-2 rounded bg-gray-900 text-white"
          placeholder="IMDB"
          value={form.imdb}
          onChange={e => setForm({ ...form, imdb: e.target.value })}
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      {submitted && (
        <div className="mt-4 text-green-400 font-semibold">
          Celebrity profile created!
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Preview</h2>
        <div className="flex items-center">
          <img
            src={form.thumbnail || '/default-avatar.png'}
            alt={form.name}
            className="w-32 h-32 object-cover rounded-full mb-4 border"
            onError={e => { e.currentTarget.src = '/default-avatar.png'; }}
          />
          <div className="ml-4">
            <p className="text-xl font-bold">{form.name}</p>
            <p className="text-gray-400">{form.genre} · {form.country}</p>
            <p className="mt-2">{form.description}</p>
            <p className="mt-2 text-sm text-gray-500">{form.fanbase}</p>
            <div className="flex gap-2 mt-2">
              {form.instagram && (
                <a href={form.instagram} target="_blank" rel="noopener noreferrer">
                  <img src="/instagram-icon.png" alt="Instagram" className="w-6 h-6" />
                </a>
              )}
              {form.youtube && (
                <a href={form.youtube} target="_blank" rel="noopener noreferrer">
                  <img src="/youtube-icon.png" alt="YouTube" className="w-6 h-6" />
                </a>
              )}
              {form.imdb && (
                <a href={form.imdb} target="_blank" rel="noopener noreferrer">
                  <img src="/imdb-icon.png" alt="IMDB" className="w-6 h-6" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}