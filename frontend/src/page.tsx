import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white px-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-10 flex flex-col items-center max-w-lg w-full">
        <h1 className="text-4xl font-extrabold mb-4 text-yellow-400 drop-shadow-lg text-center">
          Welcome to <span className="text-purple-400">CelebNetwork</span>
        </h1>
        <p className="mb-8 text-lg text-gray-200 text-center">
          Discover, follow, and connect with your favorite celebrities.<br />
          Try our AI-powered celebrity recommender!
        </p>
        <Link
          href="/celebrity"
          className="bg-gradient-to-r from-yellow-400 to-purple-500 text-black font-semibold px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-transform"
        >
          🚀 Go to Celebrity Recommender
        </Link>
      </div>
    </main>
  );
}

fetch(`${process.env.NEXT_PUBLIC_API_URL}/celebrities`);
