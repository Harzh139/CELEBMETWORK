'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type CelebrityForm = {
  name: string;
  genre: string;
  country: string;
  description?: string;
  fanbase?: string;
  instagram?: string;
  youtube?: string;
  imdb?: string;
  thumbnail?: string;
};

export default function CelebrityOnboardForm({
  initialData,
  onClose,
}: {
  initialData: Partial<CelebrityForm>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<CelebrityForm>({
    name: initialData.name || '',
    genre: initialData.genre || '',
    country: initialData.country || '',
    description: initialData.description || '',
    fanbase: initialData.fanbase || '',
    instagram: initialData.instagram || '',
    youtube: initialData.youtube || '',
    imdb: initialData.imdb || '',
    thumbnail: initialData.thumbnail || '', // <-- Only use thumbnail here
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Create the celebrity
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/celebrities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
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
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ celebrityId: created.id }),
        });
      }

      setSubmitted(true);
      // Redirect to fan dashboard after a short delay
      setTimeout(() => {
        router.push('/fan-dashboard');
      }, 1000);
    } catch {
      alert('Failed to submit celebrity');
    } finally {
      setLoading(false);
    }
  };

  // When autofilling from a suggestion:
  const autofill = (suggestion: any) => {
    setForm({
      ...form,
      name: suggestion.name || '',
      genre: suggestion.genre || '',
      country: suggestion.country || '',
      description: suggestion.description || '',
      fanbase: suggestion.fanbase || 'Fans of ' + (suggestion.name || 'this artist'),
      instagram: suggestion.instagram || '',
      youtube: suggestion.youtube || '',
      imdb: suggestion.imdb || '',
      thumbnail: suggestion.thumbnail || '', // <-- Only use thumbnail here
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white text-black rounded-lg p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Onboard Celebrity</h2>
        {submitted ? (
          <div className="text-green-600 font-semibold">Celebrity profile created!</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              className="w-full p-2 rounded bg-gray-100"
              placeholder="Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="w-full p-2 rounded bg-gray-100"
              placeholder="Genre"
              value={form.genre}
              onChange={e => setForm({ ...form, genre: e.target.value })}
            />
            <input
              className="w-full p-2 rounded bg-gray-100"
              placeholder="Country"
              value={form.country}
              onChange={e => setForm({ ...form, country: e.target.value })}
            />
            <input
              className="w-full p-2 rounded bg-gray-100"
              placeholder="Description"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
            <input
              className="w-full p-2 rounded bg-gray-100"
              placeholder="Fanbase"
              value={form.fanbase}
              onChange={e => setForm({ ...form, fanbase: e.target.value })}
            />
            <input
              className="w-full p-2 rounded bg-gray-100"
              placeholder="Instagram"
              value={form.instagram}
              onChange={e => setForm({ ...form, instagram: e.target.value })}
            />
            <input
              className="w-full p-2 rounded bg-gray-100"
              placeholder="YouTube"
              value={form.youtube}
              onChange={e => setForm({ ...form, youtube: e.target.value })}
            />
            <input
              className="w-full p-2 rounded bg-gray-100"
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
        )}
      </div>
    </div>
  );
}