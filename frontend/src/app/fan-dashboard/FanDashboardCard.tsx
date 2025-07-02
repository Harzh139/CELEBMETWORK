'use client';

import { useState } from 'react';
import { FaInstagram, FaYoutube } from 'react-icons/fa';

export default function FanDashboardCard({ celeb, onUnfollow }: { celeb: any, onUnfollow: (id: number) => void }) {
  const [imgSrc, setImgSrc] = useState(celeb.thumbnail || celeb.image || '/default-avatar.png');

  return (
    <div className="bg-white text-black rounded-lg shadow p-6 flex flex-col items-center space-y-3">
      <img
        src={imgSrc}
        alt={celeb.name}
        className="w-32 h-32 object-cover rounded-full border"
        onError={() => setImgSrc('/default-avatar.png')}
      />

      <h2 className="text-xl font-bold text-center">{celeb.name}</h2>

      <p><span className="font-semibold">Category:</span> {celeb.genre}</p>
      <p><span className="font-semibold">Fanbase:</span> {celeb.fanbase}</p>
      <p><span className="font-semibold">Location:</span> {celeb.country}</p>

      <div className="flex gap-4 mt-2">
        {celeb.instagram && (
          <a href={celeb.instagram} target="_blank" rel="noopener noreferrer">
            <FaInstagram className="text-pink-500 text-2xl hover:scale-110 transition-transform" />
          </a>
        )}
        {celeb.youtube && (
          <a href={celeb.youtube} target="_blank" rel="noopener noreferrer">
            <FaYoutube className="text-red-600 text-2xl hover:scale-110 transition-transform" />
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
