'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Stats = {
  fans: number;
  views: number;
  pdfDownloads: number;
};

export default function CelebDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
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
    else if (r !== 'celebrity') router.replace(r === 'fan' ? '/fan-dashboard' : '/auth/login');
  }, [router]);

  useEffect(() => {
    if (!token) return;
    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/celebrities`)
      .then(res => res.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, [token]);

  if (!token) {
    return <div className="p-8 text-red-400">Please log in as a celebrity to view your dashboard.</div>;
  }

  return (
    <main className="min-h-screen bg-black text-white p-8 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">My Stats</h1>
      {loading ? (
        <div>Loading...</div>
      ) : stats ? (
        <div className="bg-white text-black rounded-lg shadow p-8 w-full max-w-md space-y-4">
          <div className="flex justify-between">
            <span className="font-semibold">Fans:</span>
            <span>{stats.fans}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Profile Views:</span>
            <span>{stats.views}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">PDF Downloads:</span>
            <span>{stats.pdfDownloads}</span>
          </div>
        </div>
      ) : (
        <div>No stats found.</div>
      )}
    </main>
  );
}