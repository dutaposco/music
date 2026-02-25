import './App.css';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { ParallaxProvider } from 'react-scroll-parallax';
import { useEffect, useState, useRef } from 'react';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaRetweet, FaMusic, FaSearch, FaChevronRight } from 'react-icons/fa';

function formatNameFromFile(filename) {
  const name = filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
  return name.split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
}

// Default local collection
const initialPopFiles = ['music.mp3', 'cincin.mp3', 'letdown.mp3', 'ea.mp3', 'everythinguare.mp3', 'garammadu.mp3', 'kota.mp3', 'nggadulu.mp3', 'ophelia.mp3', 'soasu.mp3', 'tarot.mp3', 'tabolabale.mp3', 'betterwhenimdancing.mp3', 'k.mp3', 'apocalypse.mp3', 'johnwayne.mp3', 'heavenly.mp3', 'cry .mp3', 'lovemenot.mp3', 'titik.mp3', 'spontan.mp3'];
const localTracks = initialPopFiles.map((f, i) => ({
  id: `local-${i}`,
  name: formatNameFromFile(f),
  artist: 'Local Track',
  file: `/music/${encodeURIComponent(f)}`,
  image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=60'
}));

function AppContent() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });


  const [tracks, setTracks] = useState(localTracks);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [activeLibrary, setActiveLibrary] = useState('local'); // 'local' or 'global'
  const [globalDefaults, setGlobalDefaults] = useState([]);

  const audioRef = useRef(null);

  const currentTrack = tracks[currentTrackIndex] || tracks[0];

  // Search Function
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(searchQuery)}&entity=song&limit=30`);
      const data = await response.json();

      const searchResults = data.results.map(item => ({
        id: item.trackId,
        name: item.trackName,
        artist: item.artistName,
        file: item.previewUrl,
        image: item.artworkUrl100.replace('100x100', '400x400'),
        album: item.collectionName
      }));

      if (searchResults.length > 0) {
        setTracks(searchResults);
        setCurrentTrackIndex(0);
        setIsPlaying(false);
        setActiveLibrary('global');
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const resetToLocal = () => {
    setTracks(localTracks);
    setCurrentTrackIndex(0);
    setSearchQuery('');
    setActiveLibrary('local');
    setIsPlaying(false);
  };

  const switchToGlobal = () => {
    if (searchQuery.trim() === '' && globalDefaults.length > 0) {
      setTracks(globalDefaults);
      setCurrentTrackIndex(0);
    }
    setActiveLibrary('global');
    setIsPlaying(false);
  };

  // Fetch initial global hits
  useEffect(() => {
    const fetchDefaults = async () => {
      try {
        const response = await fetch(`https://itunes.apple.com/search?term=trending+hits&entity=song&limit=15`);
        const data = await response.json();
        const results = data.results.map(item => ({
          id: item.trackId,
          name: item.trackName,
          artist: item.artistName,
          file: item.previewUrl,
          image: item.artworkUrl100.replace('100x100', '400x400'),
          album: item.collectionName
        }));
        setGlobalDefaults(results);
      } catch (e) {
        console.error("Failed to fetch defaults", e);
      }
    };
    fetchDefaults();
  }, []);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = 0.8;
    }

    const audio = audioRef.current;

    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      if (isLooping) {
        audio.currentTime = 0;
        audio.play().catch(() => { });
      } else {
        handleNextTrack();
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLooping]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const track = tracks[currentTrackIndex];
    if (track) {
      const wasPlaying = isPlaying;
      audio.src = track.file;
      if (wasPlaying) {
        audio.play().catch(() => setIsPlaying(false));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackIndex, tracks]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  const handleNextTrack = () => {
    setCurrentTrackIndex(prev => (prev < tracks.length - 1 ? prev + 1 : 0));
    setIsPlaying(true);
  };

  const handlePrevTrack = () => {
    setCurrentTrackIndex(prev => (prev > 0 ? prev - 1 : tracks.length - 1));
    setIsPlaying(true);
  };

  const handleSeek = (e) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-500/30">
      {/* Background Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 z-50 origin-left"
        style={{ scaleX }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8 lg:py-16">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 cursor-pointer"
            onClick={resetToLocal}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <FaMusic className="text-slate-950 text-xl" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              DUTAMUSIC
            </h1>
          </motion.div>

          <div className="flex flex-col md:flex-row items-center gap-6 w-full max-w-4xl">
            {/* Library Toggles */}
            <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-slate-800 backdrop-blur-md">
              <button
                onClick={resetToLocal}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeLibrary === 'local' ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white'}`}
              >
                Local
              </button>
              <button
                onClick={switchToGlobal}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeLibrary === 'global' ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white'}`}
              >
                Global
              </button>
            </div>

            {/* Search Bar */}
            <motion.form
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSearch}
              className="relative flex-1 group"
            >
              <input
                type="text"
                placeholder="Search music..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setActiveLibrary('global')}
                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all backdrop-blur-md group-hover:bg-slate-800/80"
              />
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
              {isSearching && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </motion.form>
          </div>
        </header>

        <main className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Main Visual/Player Section */}
          <div className="lg:sticky lg:top-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              {/* Artwork Container */}
              <div className="relative aspect-square max-w-[320px] md:max-w-md mx-auto group">
                <motion.div
                  animate={{ rotate: isPlaying ? 360 : 0 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-full h-full rounded-full bg-slate-900 border-[12px] border-slate-800 shadow-2xl relative overflow-hidden flex items-center justify-center group-hover:border-slate-700 transition-colors"
                >
                  {/* Vinyl Texture */}
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,transparent_40%,#000_100%)]" />
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="absolute inset-0 rounded-full border border-slate-700/30 m-[5%]" style={{ margin: `${(i + 1) * 5}%` }} />
                  ))}

                  {/* Actual Track Image */}
                  <motion.div
                    key={currentTrack.image}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 p-[20%]"
                  >
                    <img
                      src={currentTrack.image}
                      alt={currentTrack.name}
                      className="w-full h-full object-cover rounded-full shadow-inner"
                    />
                  </motion.div>

                  {/* Center Label */}
                  <div className="w-1/4 h-1/4 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 z-10 flex items-center justify-center">
                    <div className="w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
                  </div>
                </motion.div>

                {/* Floating Note Animations */}
                <AnimatePresence>
                  {isPlaying && [...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 0, x: 0 }}
                      animate={{ opacity: [0, 1, 0], y: -150, x: (i - 1) * 80 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.7 }}
                      className="absolute top-1/2 left-1/2 text-cyan-400 text-3xl pointer-events-none"
                    >
                      <FaMusic />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Info and Controls */}
              <div className="mt-12 text-center">
                <motion.div
                  key={currentTrack.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="text-3xl md:text-4xl font-black mb-2 tracking-tight overflow-hidden text-ellipsis px-4 text-white">
                    {currentTrack.name}
                  </h2>
                  <p className="text-cyan-400 font-bold mb-8 tracking-widest uppercase text-xs flex items-center justify-center gap-2">
                    {currentTrack.artist}
                    {currentTrack.id.toString().startsWith('local') ? ' (Local)' : ' (Global Preview)'}
                  </p>
                </motion.div>

                {/* Progress Slider */}
                <div className="mb-10 px-4 max-w-md mx-auto">
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-3 tracking-widest">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <div className="relative group h-6 flex items-center mb-2">
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-1 bg-slate-800 rounded-full appearance-none cursor-pointer accent-cyan-400"
                    />
                    <div
                      className="absolute left-0 top-[11px] h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full pointer-events-none transition-all duration-100 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                      style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                    />
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-6 md:gap-10">
                  <button
                    onClick={() => setIsLooping(!isLooping)}
                    className={`transition-all hover:scale-125 ${isLooping ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 'text-slate-600'}`}
                  >
                    <FaRetweet className="text-xl" />
                  </button>

                  <button
                    onClick={handlePrevTrack}
                    className="text-slate-400 hover:text-white transition-all hover:scale-125 active:scale-90"
                  >
                    <FaStepBackward className="text-2xl" />
                  </button>

                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-slate-950 flex items-center justify-center text-3xl shadow-2xl shadow-cyan-500/40 transition-all hover:scale-110 hover:shadow-cyan-500/60 active:scale-95"
                  >
                    {isPlaying ? <FaPause /> : <FaPlay className="ml-1" />}
                  </button>

                  <button
                    onClick={handleNextTrack}
                    className="text-slate-400 hover:text-white transition-all hover:scale-125 active:scale-90"
                  >
                    <FaStepForward className="text-2xl" />
                  </button>

                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(currentTrack.name + ' ' + currentTrack.artist)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-600 hover:text-red-500 transition-all hover:scale-125"
                    title="Watch full on YouTube"
                  >
                    <FaChevronRight className="text-xl" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Playlist Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900/40 border border-slate-800/50 rounded-[40px] p-8 backdrop-blur-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl"
          >
            <div className="flex justify-between items-center mb-8 px-2">
              <h3 className="text-xl font-black text-white">
                {searchQuery ? 'Top Results' : 'Default Playlist'}
              </h3>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] bg-slate-800/50 px-3 py-1 rounded-full">{tracks.length} Tracks</span>
            </div>

            <div className="overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {tracks.map((track, index) => (
                <button
                  key={track.id}
                  onClick={() => {
                    setCurrentTrackIndex(index);
                    setIsPlaying(true);
                  }}
                  className={`w-full flex items-center gap-5 p-4 rounded-3xl transition-all group relative overflow-hidden ${currentTrackIndex === index
                    ? 'bg-cyan-500/10 border border-cyan-500/20'
                    : 'hover:bg-slate-800/40 border border-transparent'
                    }`}
                >
                  <div className="relative w-14 h-14 flex-shrink-0">
                    <img
                      src={track.image}
                      alt=""
                      className={`w-full h-full object-cover rounded-2xl shadow-lg transition-transform duration-500 ${currentTrackIndex === index ? 'scale-110' : 'group-hover:scale-105'}`}
                    />
                    {currentTrackIndex === index && isPlaying && (
                      <div className="absolute inset-0 bg-cyan-500/40 rounded-2xl flex items-center justify-center">
                        <div className="flex gap-1 items-end h-4">
                          <motion.div animate={{ height: [4, 12, 6, 12, 4] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1 bg-white rounded-full" />
                          <motion.div animate={{ height: [8, 4, 12, 4, 8] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-white rounded-full" />
                          <motion.div animate={{ height: [6, 12, 4, 10, 6] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-white rounded-full" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 text-left min-w-0">
                    <h4 className={`font-bold text-sm truncate mb-1 transition-colors ${currentTrackIndex === index ? 'text-white' : 'text-slate-300 group-hover:text-white'
                      }`}>
                      {track.name}
                    </h4>
                    <p className={`text-xs truncate transition-colors ${currentTrackIndex === index ? 'text-cyan-400' : 'text-slate-500'
                      }`}>
                      {track.artist}
                    </p>
                  </div>

                  {currentTrackIndex === index && (
                    <motion.div
                      layoutId="active-indicator"
                      className="absolute right-4 text-cyan-400"
                    >
                      <FaMusic />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>

            {searchQuery && (
              <button
                onClick={resetToLocal}
                className="mt-6 py-4 text-xs font-bold text-slate-500 hover:text-cyan-400 transition-colors uppercase tracking-[0.2em] border-t border-slate-800 pt-6"
              >
                ← Back to Local Library
              </button>
            )}
          </motion.div>
        </main>
      </div>

      {/* Start Modal Removed */}

      <footer className="relative z-10 border-t border-slate-900 py-16 text-center">
        <p className="text-slate-600 text-[10px] font-black tracking-[0.4em] uppercase mb-4">
          DUTAMUSIC PLAYER • GLOBAL MUSIC ENGINE
        </p>
        <div className="flex justify-center gap-4 text-slate-700">
          <span>Search</span>
          <span>•</span>
          <span>Play</span>
          <span>•</span>
          <span>Discover</span>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ParallaxProvider>
      <AppContent />
    </ParallaxProvider>
  );
}

export default App;
