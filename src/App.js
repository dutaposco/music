import './App.css';
import { motion, AnimatePresence } from 'framer-motion';
import { ParallaxProvider } from 'react-scroll-parallax';
import { useEffect, useState, useRef } from 'react';
import {
  FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaMusic, FaBroadcastTower, FaImage, FaClock
} from 'react-icons/fa';

// Curated 6 tracks: exactly 1 song for each lofi station
const stationsData = [
  { id: 'Chilling', file: '/music/cincin.mp3', image: '/lofi_art_2.png' },
  { id: 'Working', file: '/music/nggadulu.mp3', image: '/lofi_art_1.png' },
  { id: 'Gaming', file: '/music/johnwayne.mp3', image: '/lofi_art_4.png' },
  { id: 'Studying', file: '/music/music.mp3', image: '/lofi_art_1.png' },
  { id: 'Japanese Lofi', file: '/music/letdown.mp3', image: '/lofi_art_4.png' },
  { id: 'Sleeping', file: '/music/everythinguare.mp3', image: '/lofi_art_3.png' },
];

const backgroundList = [
  'https://media1.tenor.com/m/z-rwcUNIERYAAAAC/lofi.gif',
  'https://media1.tenor.com/m/R5VPC1R7FrEAAAAC/g5-games-sherlock-hidden-cases.gif',
  'https://media1.tenor.com/m/YOXRFzwPMhgAAAAd/lofi-lo-fi.gif',
  'https://media.tenor.com/uvC1Vj7ooUUAAAAM/cat-not-mine.gif',
  'https://media1.tenor.com/m/1VEnfKkMGikAAAAd/lofi-girl-music.gif'
];

function AppContent() {
  const [currentStationIdx, setCurrentStationIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [isStationOpen, setIsStationOpen] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  const audioRef = useRef(null);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsPlaying(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft > 0]); // Only re-run when toggled on/off

  const handleTimerClick = () => {
    if (timeLeft === 0) setTimeLeft(15 * 60); // 15 mins
    else if (timeLeft <= 15 * 60) setTimeLeft(30 * 60); // 30 mins
    else if (timeLeft <= 30 * 60) setTimeLeft(60 * 60); // 60 mins
    else setTimeLeft(0); // Off
  };

  const formatTime = (seconds) => {
    if (seconds === 0) return "Timer";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Mouse idle detection
  useEffect(() => {
    let timeout;
    const handleActivity = () => {
      setIsIdle(false);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsIdle(true);
      }, 4000); // 4 seconds idle
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);

    // Initialize the timeout
    timeout = setTimeout(() => setIsIdle(true), 4000);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      clearTimeout(timeout);
    };
  }, []);

  const currentTrack = stationsData[currentStationIdx];

  // Loop back to same song (since 1 track per station)
  const handleEnded = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => { });
    }
  };

  // Playback sync
  useEffect(() => {
    const audio = audioRef.current; if (!audio) return;
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current; if (!audio) return;
    audio.load();
    if (isPlaying) audio.play().catch(() => setIsPlaying(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack?.file]);

  useEffect(() => {
    const audio = audioRef.current; if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
    audio.muted = isMuted;
  }, [volume, isMuted]);

  // Spacebar to pause/play
  useEffect(() => {
    const fn = (e) => {
      if (e.code === 'Space' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault(); setIsPlaying(p => !p);
      }
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  return (
    <div
      className="h-screen w-screen text-white font-sans overflow-hidden relative select-none"
      style={{
        backgroundImage: `url('${backgroundList[bgIndex]}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark overlay for atmosphere */}
      <div className="absolute inset-0 bg-black/10 z-0 pointer-events-none" />

      {/* Hidden audio element */}
      {currentTrack && (
        <audio
          ref={audioRef}
          src={currentTrack.file}
          onEnded={handleEnded}
          preload="auto"
          style={{ display: 'none' }}
        />
      )}

      {/* ── TOP LOGO ── */}
      <motion.header
        className="absolute top-8 left-10 z-25 pointer-events-auto"
        initial={false}
        animate={{ opacity: isIdle ? 0 : 1, y: isIdle ? -20 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-2xl font-black tracking-[6px] text-white opacity-85 select-none drop-shadow-lg">LOFI</span>
      </motion.header>

      {/* ── BOTTOM PLAYER WRAPPER (AUTO-HIDE) ── */}
      <motion.div
        className="absolute bottom-10 left-0 right-0 z-30 pointer-events-auto flex flex-col items-center justify-end"
        initial={false}
        animate={{ opacity: isIdle ? 0 : 1, y: isIdle ? 50 : 0 }}
        transition={{ duration: 0.5 }}
      >

        {/* ── PREMIUM STATIONS POPOVER ── */}
        <AnimatePresence>
          {isStationOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="mb-6 w-full max-w-[850px] bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 rounded-[28px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
                <div>
                  <h2 className="font-black text-2xl tracking-tight text-white/90">Select Vibe</h2>
                  <p className="text-xs text-white/40 mt-1 font-medium tracking-wide uppercase">Choose your atmosphere</p>
                </div>
                <button
                  onClick={() => setIsStationOpen(false)}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/15 rounded-full text-xs font-bold text-white/70 hover:text-white transition-all"
                >
                  Close
                </button>
              </div>

              {/* Premium Grid of 6 Stations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {stationsData.map((station, i) => {
                  const isActive = currentStationIdx === i;
                  return (
                    <div
                      key={station.id}
                      onClick={() => {
                        setCurrentStationIdx(i);
                        setIsPlaying(true);
                        setIsStationOpen(false);
                      }}
                      className={`relative flex items-center p-4 rounded-xl cursor-pointer transition-all duration-200 ${isActive
                        ? 'bg-[#1ed760]/10 border border-[#1ed760]/50 shadow-[0_0_15px_rgba(30,215,96,0.15)]'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                        }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mr-4 ${isActive ? 'bg-[#1ed760]/20 text-[#1ed760]' : 'bg-black/20 text-white/50'}`}>
                        <FaBroadcastTower size={16} className={isActive ? 'animate-pulse' : ''} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-black tracking-wide text-sm truncate ${isActive ? 'text-[#1ed760]' : 'text-white'}`}>
                          {station.id}
                        </h3>
                        <p className="text-[10px] text-white/50 font-semibold mt-0.5 truncate">
                          {station.artist}{station.name}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>


        {/* ── EXPANDED PILL PLAYER ── */}
        <div className="bg-[#121212]/90 backdrop-blur-2xl border border-white/10 rounded-full px-8 py-4 flex items-center justify-between gap-8 shadow-2xl w-[90%] md:w-[850px] lg:w-[950px] max-w-5xl transition-all">

          {/* LEFT: Thumbnail & Info */}
          <div className="flex items-center gap-5 flex-1 min-w-0">
            <div className="relative shrink-0">
              <img
                src={currentTrack.image}
                alt=""
                className={`w-16 h-16 object-cover rounded-full border-2 border-white/10 shadow-lg ${isPlaying ? 'animate-[spin_20s_linear_infinite]' : ''}`}
              />
              <div className="absolute inset-0 rounded-full border border-black/20 inset-shadow pointer-events-none" />
            </div>

            <div className="flex flex-col justify-center min-w-0">
              <div className="flex items-center gap-2 text-[#1ed760] mb-1">
                <FaBroadcastTower size={12} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-none">{currentTrack.id}</span>
              </div>
              <h4 className="font-bold text-sm text-white truncate">{currentTrack.name}</h4>
              <p className="text-[11px] text-white/50 font-medium truncate mt-0.5">{currentTrack.artist}</p>
            </div>
          </div>

          {/* CENTER: Play & Volume Controls */}
          <div className="flex items-center gap-6 justify-center flex-1 border-x border-white/10 px-8">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12 shrink-0 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-[0_4px_15px_rgba(255,255,255,0.2)]"
            >
              {isPlaying ? <FaPause size={16} /> : <FaPlay size={16} className="ml-1" />}
            </button>

            <div className="flex items-center gap-3 flex-1 max-w-[150px]">
              <button onClick={() => setIsMuted(!isMuted)} className="text-white/40 hover:text-white transition-colors shrink-0">
                {isMuted || volume === 0 ? <FaVolumeMute size={16} /> : <FaVolumeUp size={16} />}
              </button>
              <div className="relative w-full h-1.5 flex items-center group cursor-pointer">
                <div className="absolute inset-x-0 h-full rounded-full bg-white/10 group-hover:bg-white/20 transition-colors" />
                <div className="absolute left-0 h-full rounded-full bg-[#1ed760] pointer-events-none group-hover:shadow-[0_0_10px_rgba(30,215,96,0.5)] transition-shadow" style={{ width: `${(isMuted ? 0 : volume) * 100}%` }} />
                <input
                  type="range" min="0" max="1" step="0.02" value={isMuted ? 0 : volume}
                  onChange={(e) => { setVolume(Number(e.target.value)); setIsMuted(false); }}
                  className="absolute inset-x-0 w-full opacity-0 cursor-pointer h-full"
                />
              </div>
            </div>
          </div>

          {/* RIGHT: Music & Background Toggle Buttons */}
          <div className="flex items-center justify-end flex-1 gap-2">
            <button
              onClick={handleTimerClick}
              className={`flex flex-col items-center justify-center gap-2 rounded-2xl px-6 py-2.5 transition-all duration-300 ${timeLeft > 0
                ? 'bg-white/15 text-[#1ed760] shadow-inner'
                : 'text-white/50 hover:bg-white/10 hover:text-white'
                }`}
            >
              <FaClock size={20} className={timeLeft > 0 ? 'animate-pulse' : ''} />
              <span className="text-[10px] font-extrabold uppercase tracking-widest">{formatTime(timeLeft)}</span>
            </button>
            <button
              onClick={() => setBgIndex((prev) => (prev + 1) % backgroundList.length)}
              className="flex flex-col items-center justify-center gap-2 rounded-2xl px-6 py-2.5 transition-all duration-300 text-white/50 hover:bg-white/10 hover:text-white"
            >
              <FaImage size={20} />
              <span className="text-[10px] font-extrabold uppercase tracking-widest">Visuals</span>
            </button>
            <button
              onClick={() => setIsStationOpen(!isStationOpen)}
              className={`flex flex-col items-center justify-center gap-2 rounded-2xl px-6 py-2.5 transition-all duration-300 ${isStationOpen
                ? 'bg-white/15 text-white shadow-inner'
                : 'text-white/50 hover:bg-white/10 hover:text-white'
                }`}
            >
              <FaMusic size={20} className={isStationOpen ? 'animate-bounce' : ''} />
              <span className="text-[10px] font-extrabold uppercase tracking-widest">Music</span>
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
}

export default function App() {
  return (
    <ParallaxProvider>
      <AppContent />
    </ParallaxProvider>
  );
}
