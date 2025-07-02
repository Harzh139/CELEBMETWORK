'use client';

import { useState } from 'react';

export default function FanDashboardCard({
  celeb,
  onUnfollow,
}: {
  celeb: any;
  onUnfollow: (id: number) => void;
}) {
  const [imgSrc, setImgSrc] = useState(
    celeb.thumbnail || celeb.image || '/default-avatar.png'
  );

  // Helper to create safe social links
  const formatLink = (platform: 'instagram' | 'youtube' | 'imdb', value: string) => {
    if (value.startsWith('http')) return value;

    const handle = value.replace(/^@/, '').trim(); // Remove @ if present
    if (platform === 'instagram') return `https://www.instagram.com/${handle}`;
    if (platform === 'youtube') return `https://www.youtube.com/${handle}`;
    if (platform === 'imdb') return `https://www.imdb.com/${handle}`;
    return '#';
  };

  return (
    <div className="bg-white text-black rounded-lg shadow p-6 flex flex-col items-center space-y-3">
      <img
        src={imgSrc}
        alt={celeb.name}
        className="w-32 h-32 object-cover rounded-full border"
        onError={() => setImgSrc('/default-avatar.png')}
      />

      <h2 className="text-xl font-bold text-center">{celeb.name}</h2>

      <p>
        <span className="font-semibold">Category:</span> {celeb.genre}
      </p>
      <p>
        <span className="font-semibold">Fanbase:</span> {celeb.fanbase}
      </p>
      <p>
        <span className="font-semibold">Location:</span> {celeb.country}
      </p>

      <div className="flex flex-col gap-2 mt-2 text-center">
        {celeb.instagram && (
          <a
            href={formatLink('instagram', celeb.instagram)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            View Instagram Profile
          </a>
        )}
        {celeb.youtube && (
          <a
            href={formatLink('youtube', celeb.youtube)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-600 underline hover:text-red-800"
          >
            Visit YouTube Channel
          </a>
        )}
        {celeb.imdb && (
          <a
            href={formatLink('imdb', celeb.imdb)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-yellow-600 underline hover:text-yellow-800"
          >
            View IMDb Profile
          </a>
        )}
      </div>

      <button
        onClick={() => onUnfollow(celeb.id)}
        className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
      >
        Unfollow
      </button>
    </div>
  );
}
