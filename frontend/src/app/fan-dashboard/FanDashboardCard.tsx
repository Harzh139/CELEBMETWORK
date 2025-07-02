'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function FanDashboardCard({ celeb, onUnfollow }: { celeb: any, onUnfollow: (id: number) => void }) {
  const [imgSrc, setImgSrc] = useState(celeb.thumbnail || celeb.image || '/default-avatar.png');

  console.log('Celebrity image URL:', celeb.image);

  return (
    <div className="bg-white text-black rounded-lg shadow p-4 flex flex-col items-center">
      <div className="w-32 h-32 mb-4 relative">
        <img
          src={celeb.thumbnail || '/default-avatar.png'}
          alt={celeb.name}
          className="w-32 h-32 object-cover rounded-full mb-4 border"
          onError={e => { e.currentTarget.src = '/default-avatar.png'; }}
        />
      </div>
      <h2 className="text-xl font-semibold mb-2">{celeb.name}</h2>
      <p className="mb-1"><span className="font-semibold">Category:</span> {celeb.genre}</p>
      <p className="mb-1"><span className="font-semibold">Fanbase:</span> {celeb.fanbase}</p>
      <p className="mb-2"><span className="font-semibold">Location:</span> {celeb.country}</p>
      <button
        onClick={() => onUnfollow(celeb.id)}
        className="mt-auto bg-black text-white rounded px-4 py-2 hover:bg-gray-800"
      >
        Unfollow
      </button>
    </div>
  );
}