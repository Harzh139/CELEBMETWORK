import { useEffect, useState } from "react";
import Link from "next/link";

type Celebrity = {
  id: number;
  name: string;
  genre: string;
  fanbase?: string; // <-- string, not number
  country: string;
  thumbnail?: string;
};

export default function Home() {
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/celebrities`)
      .then(res => res.json())
      .then(setCelebrities);
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Celebrities</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {celebrities.map((celeb) => (
          <div key={celeb.id} className="border rounded p-4 bg-white shadow">
            <img src={celeb.thumbnail || "/default.jpg"} alt={celeb.name} className="w-full h-40 object-cover rounded mb-2" />
            <h2 className="text-xl font-semibold">{celeb.name}</h2>
            <p>Category: {celeb.genre}</p>
            <p>Fanbase: {celeb.fanbase}</p>
            <p>Location: {celeb.country}</p>
            <Link href={`/celebrity/${celeb.id}`} className="text-blue-600 underline mt-2 block">View Profile</Link>
          </div>
        ))}
      </div>
    </main>
  );
}