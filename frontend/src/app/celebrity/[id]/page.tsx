'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

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

export default function CelebrityProfilePage() {
  const params = useParams();
  const id = params?.id as string;
  const [celeb, setCeleb] = useState<Celebrity | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setRole(localStorage.getItem('role'));
    setToken(localStorage.getItem('token'));
    // Check if this celeb is followed by the user
    if (localStorage.getItem('role') === 'fan' && localStorage.getItem('token')) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/me/following`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setIsFollowing(data.some((c: any) => String(c.id) === String(id)));
          }
        });
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/celebrities/${id}`)
      .then(res => res.json())
      .then(setCeleb)
      .finally(() => setLoading(false));
  }, [id]);

  const handleFollow = async () => {
    if (!token) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/follow`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ celebrityId: id }),
    });
    setIsFollowing(true);
  };

  const handleUnfollow = async () => {
    if (!token) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/unfollow`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ celebrityId: id }),
    });
    setIsFollowing(false);
  };

  const handleDownloadPDF = () => {
    window.open(`${process.env.NEXT_PUBLIC_API_URL}/celebrities/${id}/pdf`, '_blank');
  };

  if (loading) return <div className="p-8 text-white">Loading...</div>;
  if (!celeb) return <div className="p-8 text-red-400">Celebrity not found.</div>;

  return (
    <main className="min-h-screen bg-black text-white p-8 flex flex-col items-center">
      <img
        src={celeb.thumbnail || '/default.jpg'}
        alt={celeb.name}
        className="w-32 h-32 object-cover rounded-full mb-4 border"
      />
      <h1 className="text-3xl font-bold mb-2">{celeb.name}</h1>
      <p className="mb-1"><span className="font-semibold">Category:</span> {celeb.genre}</p>
      <p className="mb-1"><span className="font-semibold">Fanbase:</span> {celeb.fanbase}</p>
      <p className="mb-1"><span className="font-semibold">Location:</span> {celeb.country}</p>
      {celeb.description && <p className="mb-1"><span className="font-semibold">Description:</span> {celeb.description}</p>}
      {celeb.instagram && (
        <p className="mb-1">
          <span className="font-semibold">Instagram:</span>{' '}
          <a
            href={celeb.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline break-all"
          >
            {celeb.instagram}
          </a>
        </p>
      )}
      {celeb.youtube && (
        <p className="mb-1">
          <span className="font-semibold">YouTube:</span>{' '}
          <a
            href={celeb.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline break-all"
          >
            {celeb.youtube}
          </a>
        </p>
      )}
      {celeb.imdb && (
        <p className="mb-1">
          <span className="font-semibold">IMDB:</span>{' '}
          <a
            href={celeb.imdb}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline break-all"
          >
            {celeb.imdb}
          </a>
        </p>
      )}
      {role === 'fan' && token && (
        isFollowing ? (
          <button
            onClick={handleUnfollow}
            className="mt-6 bg-black text-white rounded px-4 py-2 hover:bg-gray-800"
          >
            Unfollow
          </button>
        ) : (
          <button
            onClick={handleFollow}
            className="mt-6 bg-black text-white rounded px-4 py-2 hover:bg-gray-800"
          >
            Follow
          </button>
        )
      )}
      <button
        onClick={handleDownloadPDF}
        className="mt-6 bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-500"
      >
        Download PDF
      </button>
    </main>
  );
}