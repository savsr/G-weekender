'use client';

import { useState, useEffect } from 'react';

// Your Github JSON URL
const DATA_URL = 'https://raw.githubusercontent.com/savsr/G-weekender/refs/heads/main/data/activities.json';

// Fallback sample data (shown if fetch fails or before first newsletter runs)
const fallbackData = {
  metadata: {
    generatedAt: new Date().toISOString(),
    weekendDates: "Coming Soon",
    weather: null,
    greeting: "Hey George! We're getting your weekend adventures ready. Check back soon for dinosaurs, trains, and tractors! 🦖🚂🏗️"
  },
  sections: {
    local: {
      title: "On Your Doorstep",
      subtitle: "Hackney, Stratford & East London",
      activities: []
    },
    bigDaysOut: {
      title: "Big Days Out",
      subtitle: "Worth the journey across London",
      activities: []
    },
    bookAhead: {
      title: "Book Ahead",
      subtitle: "Coming up in the next 2-8 weeks",
      activities: []
    }
  }
};

// Icons
const SunIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <circle cx="12" cy="12" r="5"/>
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
  </svg>
);

const RainIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242M8 19v1M8 14v1M12 21v1M12 16v1M16 19v1M16 14v1"/>
  </svg>
);

const CloudIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M17.5 19a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zM9.5 19A5.5 5.5 0 1 0 9.5 8a5.5 5.5 0 0 0 0 11z"/>
  </svg>
);

const TrainIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 11V6a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v5M4 11h16M4 11v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M9 7h.01M15 7h.01M9 22l-2-3M15 22l2-3"/>
  </svg>
);

const BusIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M8 6v6M16 6v6M2 12h20M5 18v2M19 18v2"/>
    <rect x="4" y="4" width="16" height="14" rx="2"/>
    <circle cx="7.5" cy="15.5" r="1.5"/>
    <circle cx="16.5" cy="15.5" r="1.5"/>
  </svg>
);

const CarIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0zM15 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0zM5 17H3v-6l2-5h10l4 5v6h-2M5 11h14"/>
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <path d="M16 2v4M8 2v4M3 10h18"/>
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 6v6l4 2"/>
  </svg>
);

const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const TicketIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 9a3 3 0 0 1 3 3v.101a3 3 0 0 1-3 3V17a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-1.899a3 3 0 0 1 0-6.102V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2Z"/>
    <path d="M13 5v2M13 17v2M13 11v2"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 9l6 6 6-6"/>
  </svg>
);

const ExternalLinkIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
  </svg>
);

const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
    <path d="M21 3v5h-5"/>
  </svg>
);

// Weather badge component
const WeatherBadge = ({ weather }) => {
  if (!weather) return null;
  
  const getWeatherIcon = (icon) => {
    if (icon === 'Rain' || icon === 'Drizzle') return <RainIcon />;
    if (icon === 'Clear') return <SunIcon />;
    return <CloudIcon />;
  };
  
  return (
    <div className="bg-stone-800/80 backdrop-blur rounded-xl p-4 mb-6 border border-stone-700">
      <h3 className="text-amber-400 font-bold mb-3 flex items-center gap-2">
        <span className="text-lg">🌤️</span> Weekend Weather
      </h3>
      <div className="grid grid-cols-2 gap-4 mb-3">
        {weather.saturday && (
          <div className="flex items-center gap-3">
            <div className="text-blue-400">
              {getWeatherIcon(weather.saturday.icon)}
            </div>
            <div>
              <p className="text-stone-400 text-xs">Saturday</p>
              <p className="text-white font-semibold">{weather.saturday.temp}°C</p>
              <p className="text-stone-500 text-xs capitalize">{weather.saturday.description}</p>
            </div>
          </div>
        )}
        {weather.sunday && (
          <div className="flex items-center gap-3">
            <div className="text-yellow-400">
              {getWeatherIcon(weather.sunday.icon)}
            </div>
            <div>
              <p className="text-stone-400 text-xs">Sunday</p>
              <p className="text-white font-semibold">{weather.sunday.temp}°C</p>
              <p className="text-stone-500 text-xs capitalize">{weather.sunday.description}</p>
            </div>
          </div>
        )}
      </div>
      <p className="text-stone-400 text-sm">
        {weather.recommendation === 'indoor' && "☔ Rainy weekend - indoor activities recommended!"}
        {weather.recommendation === 'outdoor' && "☀️ Great weather - perfect for outdoor adventures!"}
        {weather.recommendation === 'saturday_outdoor' && "📅 Saturday's best for outdoors, Sunday for indoor fun"}
        {weather.recommendation === 'sunday_outdoor' && "📅 Save outdoor plans for Sunday!"}
        {weather.recommendation === 'mixed' && "🌤️ Mixed conditions - we've got options for both!"}
      </p>
    </div>
  );
};

// Transport info component
const TransportInfo = ({ transport, isExpanded }) => {
  if (!transport || !isExpanded) return null;
  
  return (
    <div className="mt-4 bg-stone-900/80 rounded-lg p-4 border border-stone-700">
      <h4 className="text-amber-400 font-bold text-sm mb-3 flex items-center gap-2">
        <TrainIcon /> Getting there from Hackney
      </h4>
      <div className="space-y-2 text-sm">
        {transport.fromHackney && (
          <p className="text-stone-300">{transport.fromHackney}</p>
        )}
        <div className="flex flex-wrap gap-4 text-stone-400">
          {transport.tube && (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              {transport.tube}
            </span>
          )}
          {transport.bus && (
            <span className="flex items-center gap-1">
              <BusIcon className="w-4 h-4" />
              {transport.bus}
            </span>
          )}
        </div>
        {transport.parking && (
          <p className="text-stone-500 flex items-center gap-1">
            <CarIcon className="w-4 h-4" />
            {transport.parking}
          </p>
        )}
        {transport.tip && (
          <p className="text-green-400 text-sm mt-2">
            💡 {transport.tip}
          </p>
        )}
      </div>
    </div>
  );
};

// Filter pills
const FilterPill = ({ label, active, onClick, emoji, count }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full font-semibold text-sm transition-all transform hover:scale-105 flex items-center gap-1 ${
      active 
        ? 'bg-amber-400 text-stone-900 shadow-lg shadow-amber-400/30' 
        : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
    }`}
  >
    {emoji && <span>{emoji}</span>}
    {label}
    {count !== undefined && <span className="ml-1 opacity-70">({count})</span>}
  </button>
);

// Activity card
const ActivityCard = ({ activity, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const tagColors = {
    'dinosaurs': 'bg-green-500/20 text-green-400',
    'dinosaur': 'bg-green-500/20 text-green-400',
    'vehicles': 'bg-blue-500/20 text-blue-400',
    'trains': 'bg-blue-500/20 text-blue-400',
    'buses': 'bg-red-500/20 text-red-400',
    'construction': 'bg-yellow-500/20 text-yellow-400',
    'theatre': 'bg-purple-500/20 text-purple-400',
    'outdoor': 'bg-emerald-500/20 text-emerald-400',
    'free': 'bg-green-500/20 text-green-400',
    'must-book': 'bg-red-500/20 text-red-400',
    'hands-on': 'bg-orange-500/20 text-orange-400',
    'animals': 'bg-pink-500/20 text-pink-400',
    'interactive': 'bg-cyan-500/20 text-cyan-400',
  };
  
  return (
    <div 
      className={`relative bg-gradient-to-br from-stone-800 to-stone-900 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
        activity.isHighlight 
          ? 'border-amber-400 shadow-lg shadow-amber-400/20' 
          : 'border-stone-700 hover:border-stone-600'
      }`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Badges row */}
      <div className="flex flex-wrap gap-2 px-4 pt-4">
        {activity.isHighlight && (
          <span className="bg-amber-400 text-stone-900 text-xs font-black px-2 py-1 rounded-full">
            ⭐ TOP PICK
          </span>
        )}
        {activity.isFree && (
          <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            FREE
          </span>
        )}
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
          activity.isIndoor 
            ? 'bg-blue-500/20 text-blue-400' 
            : 'bg-emerald-500/20 text-emerald-400'
        }`}>
          {activity.isIndoor ? '🏠 Indoor' : '🌳 Outdoor'}
        </span>
        {activity.ageRange && (
          <span className="bg-stone-700 text-stone-300 text-xs px-2 py-1 rounded-full">
            👶 {activity.ageRange}
          </span>
        )}
      </div>
      
      {/* Main content */}
      <div className="p-4">
        <h3 className="font-black text-lg text-white mb-2 leading-tight">
          {activity.title}
        </h3>
        
        <p className="text-amber-400 font-semibold text-sm mb-3 flex items-center gap-1">
          <MapPinIcon className="w-4 h-4" />
          {activity.venue}
          {activity.address && <span className="text-stone-500 font-normal">• {activity.address}</span>}
        </p>
        
        {/* Quick info row */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="bg-stone-700/50 px-2 py-1 rounded text-xs text-stone-300 flex items-center gap-1">
            <CalendarIcon className="w-3 h-3" /> {activity.dates}
          </span>
          <span className="bg-stone-700/50 px-2 py-1 rounded text-xs text-stone-300 flex items-center gap-1">
            <ClockIcon className="w-3 h-3" /> {activity.times}
          </span>
          {activity.price && !activity.isFree && (
            <span className="bg-amber-500/20 px-2 py-1 rounded text-xs text-amber-400 font-semibold flex items-center gap-1">
              <TicketIcon className="w-3 h-3" /> {activity.price}
            </span>
          )}
          {activity.duration && (
            <span className="bg-stone-700/50 px-2 py-1 rounded text-xs text-stone-400">
              ⏱️ {activity.duration}
            </span>
          )}
        </div>
        
        {/* Description */}
        <p className={`text-stone-400 text-sm leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
          {activity.description}
        </p>
        
        {/* Why George will love it */}
        {activity.whyGeorgeWillLove && (
          <p className="text-green-400 text-sm font-semibold mt-3 bg-green-500/10 rounded-lg p-2">
            🦖 {activity.whyGeorgeWillLove}
          </p>
        )}
        
        {/* Highlight tags */}
        {activity.highlights && activity.highlights.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {activity.highlights.slice(0, 4).map((tag, i) => (
              <span 
                key={i} 
                className={`text-xs px-2 py-0.5 rounded-full ${tagColors[tag] || 'bg-stone-700 text-stone-400'}`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Transport info (expandable) */}
        <TransportInfo transport={activity.transport} isExpanded={isExpanded} />
        
        {/* Footer with expand button and booking link */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-700">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-stone-400 hover:text-white text-sm flex items-center gap-1 transition-colors"
          >
            <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
              <ChevronDownIcon />
            </span>
            {isExpanded ? 'Show less' : 'Transport & more'}
          </button>
          
          {activity.bookingUrl && (
            <a 
              href={activity.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 text-sm font-semibold flex items-center gap-1 transition-colors"
            >
              Book / Info <ExternalLinkIcon />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

// Section component
const Section = ({ section, sectionKey, icon, color }) => {
  const colorClasses = {
    green: 'border-green-500',
    blue: 'border-blue-500',
    purple: 'border-purple-500',
  };
  
  if (!section?.activities || section.activities.length === 0) {
    return null;
  }
  
  return (
    <section className="mb-12">
      <div className={`flex items-center gap-3 mb-2 pb-3 border-b-4 ${colorClasses[color]}`}>
        <div className={`p-3 rounded-xl bg-stone-800`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-black text-white tracking-tight">{section.title}</h2>
          <p className="text-stone-500 text-sm">{section.subtitle}</p>
        </div>
        <span className="text-stone-600 text-sm font-semibold">
          {section.activities.length} activities
        </span>
      </div>
      
      {section.weatherNote && (
        <p className="text-blue-400 text-sm mb-4 flex items-center gap-2">
          <CloudIcon /> {section.weatherNote}
        </p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {section.activities.map((activity, index) => (
          <ActivityCard key={activity.id} activity={activity} index={index} />
        ))}
      </div>
    </section>
  );
};

// Main component
export default function GeorgesWeekend() {
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [showIndoorOnly, setShowIndoorOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from Google Drive
      // Note: Google Drive direct downloads can be tricky with CORS
      // We'll use a proxy or fallback approach
      const response = await fetch(DATA_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const json = await response.json();
      setData(json);
    } catch (err) {
      console.error('Fetch error:', err);
      // Use fallback data if fetch fails
      setData(fallbackData);
      setError('Using sample data - live data will appear after the first newsletter is generated');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const filterActivities = (activities) => {
    if (!activities) return [];
    let filtered = [...activities];
    
    if (showFreeOnly) {
      filtered = filtered.filter(a => a.isFree);
    }
    if (showIndoorOnly) {
      filtered = filtered.filter(a => a.isIndoor);
    }
    if (filter !== 'all') {
      filtered = filtered.filter(a => 
        a.highlights?.some(h => h.toLowerCase().includes(filter.toLowerCase()))
      );
    }
    return filtered;
  };
  
  const getFilteredSections = () => {
    if (!data?.sections) return { local: { activities: [] }, bigDaysOut: { activities: [] }, bookAhead: { activities: [] } };
    return {
      local: {
        ...data.sections.local,
        activities: filterActivities(data.sections.local?.activities)
      },
      bigDaysOut: {
        ...data.sections.bigDaysOut,
        activities: filterActivities(data.sections.bigDaysOut?.activities)
      },
      bookAhead: {
        ...data.sections.bookAhead,
        activities: filterActivities(data.sections.bookAhead?.activities)
      }
    };
  };
  
  const filteredSections = getFilteredSections();
  const totalActivities = 
    (filteredSections.local?.activities?.length || 0) +
    (filteredSections.bigDaysOut?.activities?.length || 0) +
    (filteredSections.bookAhead?.activities?.length || 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🦖</div>
          <p className="text-white text-xl">Loading adventures...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-white">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-yellow-500/5 rounded-full blur-3xl" />
      </div>
      
      {/* Header */}
      <header className="relative bg-gradient-to-b from-amber-500 via-orange-500 to-stone-950 pt-8 pb-20">
        <div className="max-w-6xl mx-auto px-4">
          {/* Construction stripes */}
          <div className="absolute top-0 left-0 right-0 h-3 bg-[repeating-linear-gradient(45deg,#000,#000_10px,#fbbf24_10px,#fbbf24_20px)]" />
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="text-5xl">🦖</div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-stone-900 tracking-tighter">
                  GEORGE&apos;S
                </h1>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter -mt-2">
                  WEEKEND
                </h1>
              </div>
            </div>
            <div className="hidden md:flex gap-2 text-4xl">
              <span className="animate-bounce" style={{ animationDelay: '0ms' }}>🚂</span>
              <span className="animate-bounce" style={{ animationDelay: '200ms' }}>🚁</span>
              <span className="animate-bounce" style={{ animationDelay: '400ms' }}>🦕</span>
              <span className="animate-bounce" style={{ animationDelay: '600ms' }}>🏗️</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-stone-900/80 backdrop-blur rounded-2xl p-4 inline-block">
              <p className="text-amber-400 font-bold flex items-center gap-2">
                <CalendarIcon />
                {data?.metadata?.weekendDates || 'This Weekend'}
              </p>
            </div>
            <button 
              onClick={fetchData}
              className="bg-stone-900/80 backdrop-blur rounded-2xl p-4 text-stone-400 hover:text-white transition-colors"
              title="Refresh data"
            >
              <RefreshIcon />
            </button>
          </div>
          
          {/* Greeting */}
          <div className="bg-stone-900/90 backdrop-blur rounded-2xl p-6 max-w-3xl">
            <p className="text-2xl font-black text-white mb-2">
              Hey George! 👋
            </p>
            <p className="text-stone-300 text-lg leading-relaxed">
              {data?.metadata?.greeting || "Ready for an EPIC weekend? We've found dinosaurs, trains, tractors and MORE waiting for you across London! Let's GO! 🚀"}
            </p>
          </div>
        </div>
      </header>
      
      {/* Weather + Filters sticky bar */}
      <div className="sticky top-0 z-50 bg-stone-950/95 backdrop-blur border-b border-stone-800">
        <div className="max-w-6xl mx-auto px-4 py-4">
          {/* Weather badge (compact on scroll) */}
          {data?.metadata?.weather && (
            <div className="flex items-center gap-4 mb-3 pb-3 border-b border-stone-800">
              <span className="text-amber-400 font-bold text-sm">🌤️ Weather:</span>
              <div className="flex items-center gap-3 text-sm">
                {data.metadata.weather.saturday && (
                  <span className="text-stone-400">
                    Sat: {data.metadata.weather.saturday.temp}°C 
                    {data.metadata.weather.saturday.rain > 0 && ' 🌧️'}
                  </span>
                )}
                {data.metadata.weather.sunday && (
                  <span className="text-stone-400">
                    Sun: {data.metadata.weather.sunday.temp}°C
                    {data.metadata.weather.sunday.rain > 0 && ' 🌧️'}
                  </span>
                )}
              </div>
            </div>
          )}
          
          {/* Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-stone-500 text-sm font-semibold">FILTER:</span>
            <FilterPill 
              label="All" 
              active={filter === 'all' && !showFreeOnly && !showIndoorOnly} 
              onClick={() => { setFilter('all'); setShowFreeOnly(false); setShowIndoorOnly(false); }}
              count={totalActivities}
            />
            <FilterPill 
              label="Dinosaurs" 
              emoji="🦖"
              active={filter === 'dinosaur'} 
              onClick={() => setFilter(filter === 'dinosaur' ? 'all' : 'dinosaur')}
            />
            <FilterPill 
              label="Vehicles" 
              emoji="🚂"
              active={filter === 'vehicle' || filter === 'train' || filter === 'bus'} 
              onClick={() => setFilter(filter === 'vehicle' ? 'all' : 'vehicle')}
            />
            <FilterPill 
              label="Theatre" 
              emoji="🎭"
              active={filter === 'theatre'} 
              onClick={() => setFilter(filter === 'theatre' ? 'all' : 'theatre')}
            />
            <FilterPill 
              label="Animals" 
              emoji="🐷"
              active={filter === 'animal'} 
              onClick={() => setFilter(filter === 'animal' ? 'all' : 'animal')}
            />
            <div className="h-6 w-px bg-stone-700 mx-1" />
            <FilterPill 
              label="Free Only" 
              emoji="✨"
              active={showFreeOnly} 
              onClick={() => setShowFreeOnly(!showFreeOnly)}
            />
            <FilterPill 
              label="Indoor Only" 
              emoji="🏠"
              active={showIndoorOnly} 
              onClick={() => setShowIndoorOnly(!showIndoorOnly)}
            />
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="relative max-w-6xl mx-auto px-4 py-8">
        {/* Full weather widget */}
        {data?.metadata?.weather && (
          <WeatherBadge weather={data.metadata.weather} />
        )}
        
        {error && (
          <div className="bg-amber-500/20 border border-amber-500 rounded-xl p-4 mb-6 text-amber-400">
            ℹ️ {error}
          </div>
        )}
        
        <Section 
          section={filteredSections.local}
          sectionKey="local"
          icon="🏠"
          color="green"
        />
        
        <Section 
          section={filteredSections.bigDaysOut}
          sectionKey="bigDaysOut"
          icon="🚂"
          color="blue"
        />
        
        <Section 
          section={filteredSections.bookAhead}
          sectionKey="bookAhead"
          icon="🎭"
          color="purple"
        />
        
        {totalActivities === 0 && !error && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🦖</div>
            <p className="text-stone-400 text-lg">No activities match your filters</p>
            <button 
              onClick={() => { setFilter('all'); setShowFreeOnly(false); setShowIndoorOnly(false); }}
              className="mt-4 text-amber-400 hover:text-amber-300"
            >
              Clear filters
            </button>
          </div>
        )}
        
        {totalActivities === 0 && error && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🦖</div>
            <p className="text-white text-xl font-bold mb-2">Coming Soon!</p>
            <p className="text-stone-400 text-lg max-w-md mx-auto">
              Run the newsletter script for the first time to populate this page with amazing activities for George!
            </p>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-stone-900 border-t border-stone-800 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="text-4xl mb-4">🦖🚂🏗️🎭</div>
          <p className="text-stone-500 text-sm">
            Made with ❤️ for George&apos;s adventures
          </p>
          <p className="text-stone-600 text-xs mt-2">
            Last updated: {data?.metadata?.generatedAt ? new Date(data.metadata.generatedAt).toLocaleDateString('en-GB', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long',
              hour: '2-digit',
              minute: '2-digit'
            }) : 'Awaiting first newsletter'}
          </p>
        </div>
      </footer>
    </div>
  );
}
