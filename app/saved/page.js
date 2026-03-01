'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const SAVED_URL = 'https://raw.githubusercontent.com/savsr/G-weekender/main/data/saved.json';
const FEEDBACK_URL = 'https://script.google.com/macros/s/YOUR_DEPLOY_ID/exec';

const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);

const ExternalLinkIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
  </svg>
);

const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

export default function SavedPage() {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const fetchSaved = async () => {
    try {
      setLoading(true);
      const response = await fetch(SAVED_URL, { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        data.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
        setSaved(data);
      }
    } catch (err) {
      console.log('No saved activities');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => { fetchSaved(); }, []);
  
  const handleRemove = (title) => {
    const params = new URLSearchParams({ action: 'unsave', activity: title });
    window.open(`${FEEDBACK_URL}?${params.toString()}`, '_blank');
    setTimeout(() => setSaved(prev => prev.filter(s => s.title !== title)), 500);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">⭐</div>
          <p className="text-white text-xl">Loading saved activities...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-stone-950 text-white">
      <header className="bg-gradient-to-b from-amber-500 via-orange-500 to-stone-950 pt-8 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="absolute top-0 left-0 right-0 h-3 bg-[repeating-linear-gradient(45deg,#000,#000_10px,#fbbf24_10px,#fbbf24_20px)]" />
          
          <Link href="/" className="inline-flex items-center gap-2 text-stone-900 hover:text-stone-700 font-semibold mb-6 transition-colors">
            <ArrowLeftIcon /> Back to this week
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="text-5xl">⭐</div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-stone-900 tracking-tighter">SAVED</h1>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter -mt-2">ACTIVITIES</h1>
            </div>
          </div>
          
          <p className="mt-4 text-stone-900/80 text-lg">{saved.length} {saved.length === 1 ? 'activity' : 'activities'} saved for later</p>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-4 py-8 -mt-8">
        {saved.length === 0 ? (
          <div className="bg-stone-900 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">🦖</div>
            <h2 className="text-2xl font-bold text-white mb-2">No saved activities yet!</h2>
            <p className="text-stone-400 mb-6">Click the ⭐ button on any activity to save it for later.</p>
            <Link href="/" className="inline-block bg-amber-400 text-stone-900 font-bold px-6 py-3 rounded-xl hover:bg-amber-300 transition-colors">
              Browse this week&apos;s activities
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {saved.map((activity, index) => (
              <div key={index} className="bg-stone-900 rounded-2xl p-6 border border-stone-800 hover:border-stone-700 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{activity.title}</h3>
                    {activity.venue && (
                      <p className="text-amber-400 font-semibold text-sm mb-2 flex items-center gap-1">
                        <MapPinIcon className="w-4 h-4" />{activity.venue}
                        {activity.address && <span className="text-stone-500 font-normal">• {activity.address}</span>}
                      </p>
                    )}
                    {activity.description && <p className="text-stone-400 text-sm mb-3">{activity.description}</p>}
                    <p className="text-stone-600 text-xs">
                      Saved: {new Date(activity.savedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {activity.url && (
                      <a href={activity.url} target="_blank" rel="noopener noreferrer" className="p-2 text-amber-400 hover:text-amber-300 hover:bg-stone-800 rounded-lg transition-colors" title="View details">
                        <ExternalLinkIcon />
                      </a>
                    )}
                    <button onClick={() => handleRemove(activity.title)} className="p-2 text-stone-500 hover:text-red-400 hover:bg-stone-800 rounded-lg transition-colors" title="Remove from saved">
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      <footer className="bg-stone-900 border-t border-stone-800 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Link href="/" className="text-amber-400 hover:text-amber-300 font-semibold">← Back to this week&apos;s activities</Link>
          <p className="text-stone-600 text-sm mt-4">Made with ❤️ for weekend adventures</p>
        </div>
      </footer>
    </div>
  );
}
