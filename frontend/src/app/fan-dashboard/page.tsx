'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FanDashboardCard from './FanDashboardCard';

type Celebrity = {
  id: number;
  name: string;
  genre: string;
  fanbase?: string; // <-- string, not number
  country: string;
  thumbnail?: string;
};

export default function FanDashboard() {
  const [following, setFollowing] = useState<Celebrity[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const t = localStorage.getItem('token');
    const r = localStorage.getItem('role');
    setToken(t);
    setRole(r);
    if (!t) router.replace('/auth/login');
    else if (r !== 'fan') router.replace(r === 'celebrity' ? '/celeb-dashboard' : '/auth/login');
  }, [router]);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/me/following`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setFollowing(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [token]);

  const unfollow = async (id: number) => {
    if (!token) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/unfollow`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ celebrityId: id }),
    });
    // Remove from local state immediately
    setFollowing(following.filter(f => f.id !== id));
  };

  if (token === null) {
    return <div className="p-8 text-white">Loading...</div>;
  }
  if (!token) {
    return <div className="p-8 text-red-400">Please log in as a fan to view your dashboard.</div>;
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      {following.length > 0 && (
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">My Followed Celebrities</h1>
          <a
            href="/celebrity/celebrity-signup"
            className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold hover:bg-yellow-300"
          >
            + Add a Celebrity
          </a>
        </div>
      )}
      {loading ? (
        <div>Loading...</div>
      ) : following.length === 0 ? (
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-4">My Followed Celebrities</h1>
          <div className="mb-4">You are not following any celebrities yet.</div>
          <a
            href="/celebrity/celebrity-signup"
            className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold hover:bg-yellow-300"
          >
            Add a Celebrity
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {following.map(celeb => (
            <FanDashboardCard key={celeb.id} celeb={celeb} onUnfollow={unfollow} />
          ))}
        </div>
      )}
    </main>
  );
}