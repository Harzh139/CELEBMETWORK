'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FanDashboardCard from './FanDashboardCard';
import Link from 'next/link';

type Celebrity = {
  id: number;
  name: string;
  genre: string;
  fanbase?: string;
  country: string;
  thumbnail?: string;
  instagram?: string;
  youtube?: string;
};

export default function FanDashboard() {
  const [following, setFollowing] = useState<Celebrity[]>([]);
  const [loading, setLoading] = useState(true);
  const [tokenChecked, setTokenChecked] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const t = localStorage.getItem('token');
    const r = localStorage.getItem('role');
    setToken(t);
    setRole(r);
    setTokenChecked(true);

    // Only redirect after checking
    if (!t) router.replace('/auth/login');
    else if (r !== 'fan') router.replace(r === 'celebrity' ? '/celeb-dashboard' : '/auth/login');
  }, [router]);

  useEffect(() => {
    if (!token) return;
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
    setFollowing(following.filter(f => f.id !== id));
  };

  if (!tokenChecked) {
    return <div className="p-8 text-white">Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <nav className="mb-6 flex gap-6 justify-end">
        {!token && (
          <>
            <Link href="/auth/login" className="underline text-blue-400">Login</Link>
            <Link href="/auth/signup" className="underline text-blue-400">Sign Up</Link>
          </>
        )}
        {token && (
          <>
            <Link href="/fan-dashboard" className="text-yellow-400">Dashboard</Link>
            <Link href="/celebrity/celebrity-signup" className="text-yellow-400">+ Add Celebrity</Link>
          </>
        )}
      </nav>

      {following.length > 0 && (
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">My Followed Celebrities</h1>
          <Link
            href="/celebrity/celebrity-signup"
            className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold hover:bg-yellow-300"
          >
            + Add a Celebrity
          </Link>
        </div>
      )}

      {loading ? (
        <div className="text-center text-lg">Loading...</div>
      ) : following.length === 0 ? (
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-4">My Followed Celebrities</h1>
          <div className="mb-4">You are not following any celebrities yet.</div>
          <Link
            href="/celebrity/celebrity-signup"
            className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold hover:bg-yellow-300"
          >
            Add a Celebrity
          </Link>
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
