import './App.css';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ParallaxProvider } from 'react-scroll-parallax';
import { useEffect, useState, useRef } from 'react';
import ThemeSwitcher from './components/ThemeSwitcher';
import { ThemeProvider } from './contexts/ThemeContext';

function formatNameFromFile(filename) {
  const name = filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
  return name.split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
}

const popFiles = ['music.mp3', 'cincin.mp3', 'letdown.mp3', 'ea.mp3', 'everythinguare.mp3', 'garammadu.mp3', 'kota.mp3', 'nggadulu.mp3', 'ophelia.mp3', 'soasu.mp3', 'tarot.mp3', 'tabolabale.mp3', 'betterwhenimdancing.mp3'];

const popCollection = {
  id: 2,
  title: "Pop Playlist",
  artist: "Your Music",
  description: "Pop songs from your local /public/music folder.",
  genre: "Pop",
  tracks: popFiles.length,
  file: "/music/music.mp3",
  image: "https://cdn-images.dzcdn.net/images/cover/9eb5f9334e7bfed5aae9701e76265298/0x1900-000000-80-0-0.jpg",
  trackList: popFiles.map((f, i) => ({ id: i + 1, name: formatNameFromFile(f), artist: 'Pop', file: `/music/${encodeURIComponent(f)}` }))
};

function AppContent() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress);
  const [showMusicModal, setShowMusicModal] = useState(true);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const isLooping = true;
  const audioRef = useRef(null);

  const currentTrack = popCollection.trackList[currentTrackIndex] || popCollection.trackList[0] || { name: '', artist: '' };



  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = 0.8;

    const handleEnded = () => {
      setCurrentTrackIndex(prev => {
        if (prev < popCollection.trackList.length - 1) {
          setIsPlaying(true);
          return prev + 1;
        } else {
          setIsPlaying(true);
          return 0;
        }
      });
    };

    audioRef.current.addEventListener('ended', handleEnded);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleEnded);
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, [popCollection.trackList.length, isLooping]);

  useEffect(() => {
    if (!audioRef.current) return;
    const track = popCollection.trackList[currentTrackIndex];
    if (!track) {
      audioRef.current.pause();
      return;
    }
    if (isPlaying) {
      audioRef.current.src = track.file || '/music/music.mp3';
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [currentTrackIndex, isPlaying, popCollection.trackList]);

  const handleMusicChoice = (choice) => {
    setShowMusicModal(false);
    if (choice) {
      setIsPlaying(true);
    }
  };

  const handlePlayTrack = (index) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  const handleNextTrack = () => {
    if (currentTrackIndex < popCollection.trackList.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    }
  };

  const handlePrevTrack = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
    }
  };

  return (
    <ParallaxProvider>
      <div className="gradient-overlay"></div>
      <div className="App">
        {/* Navbar */}
        <nav className="navbar">
          <div className="navbar-container">
            <a href="#" className="nav-logo">
              <div className="nav-logo-photo">
                🎵 Pop Playlist
              </div>
            </a>
            <div className="nav-right" style={{ marginLeft: 'auto' }}>
              <div className="nav-theme-item">
                <ThemeSwitcher />
              </div>
            </div>
          </div>
        </nav>

        {/* Music Modal */}
        {showMusicModal && (
          <div className="music-modal-overlay">
            <div className="music-modal">
              <div className="music-modal-content">
                <h3>🎵 Play Music?</h3>
                <p>Would you like to play music?</p>
                <div className="music-modal-buttons">
                  <button 
                    className="music-btn music-btn-yes"
                    onClick={() => handleMusicChoice(true)}
                  >
                    Yes
                  </button>
                  <button 
                    className="music-btn music-btn-no"
                    onClick={() => handleMusicChoice(false)}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <motion.div 
          className="progress-bar"
          style={{
            scaleX,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'var(--primary-color)',
            transformOrigin: '0%',
            zIndex: 1001
          }}
        />

        {/* Music Player Section */}
        <section id="player" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          {/* Now Playing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              maxWidth: '800px',
              width: '100%',
              padding: '2rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '2px solid rgba(0, 234, 255, 0.3)',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
              textAlign: 'center'
            }}
          >
            <h3 style={{
              fontSize: '1.2rem',
              marginBottom: '1rem',
              color: 'rgba(255, 255, 255, 0.8)'
            }}>
              Now Playing
            </h3>
            <div style={{
              fontSize: '2.5rem',
              marginBottom: '1.5rem'
            }}>
              ▶️
            </div>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 900,
              margin: '0 0 0.5rem 0'
            }}>
              {currentTrack.name}
            </h2>
            <p style={{
              fontSize: '1.1rem',
              color: 'rgba(255, 255, 255, 0.7)',
              margin: '0 0 1.5rem 0'
            }}>
              {currentTrack.artist}
            </p>

            {/* Player Controls */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <button
                onClick={handlePrevTrack}
                disabled={currentTrackIndex === 0}
                style={{
                  padding: '0.8rem 1.2rem',
                  background: 'rgba(0, 234, 255, 0.2)',
                  border: '2px solid #00eaff',
                  borderRadius: '8px',
                  color: '#00eaff',
                  fontWeight: 600,
                  cursor: currentTrackIndex === 0 ? 'not-allowed' : 'pointer',
                  opacity: currentTrackIndex === 0 ? 0.5 : 1,
                  fontSize: '1rem',
                  transition: 'all 0.3s ease'
                }}
              >
                ⏮️ Previous
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                style={{
                  padding: '1rem 2rem',
                  background: 'linear-gradient(135deg, #00eaff, #00b4ff)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#000',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  transition: 'all 0.3s ease',
                  minWidth: '140px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {isPlaying ? '⏸️ Pause' : '▶️ Play'}
              </button>

              <button
                onClick={handleNextTrack}
                disabled={currentTrackIndex === popCollection.trackList.length - 1}
                style={{
                  padding: '0.8rem 1.2rem',
                  background: 'rgba(0, 234, 255, 0.2)',
                  border: '2px solid #00eaff',
                  borderRadius: '8px',
                  color: '#00eaff',
                  fontWeight: 600,
                  cursor: currentTrackIndex === popCollection.trackList.length - 1 ? 'not-allowed' : 'pointer',
                  opacity: currentTrackIndex === popCollection.trackList.length - 1 ? 0.5 : 1,
                  fontSize: '1rem',
                  transition: 'all 0.3s ease'
                }}
              >
                Next ⏭️
              </button>
            </div>
          </motion.div>

          {/* Track List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{
              maxWidth: '900px',
              width: '100%',
              margin: '3rem auto 0',
              padding: '0 2rem'
            }}
          >
            <h3 style={{
              fontSize: '1.8rem',
              marginBottom: '2rem',
              fontWeight: 900
            }}>
              All Tracks
            </h3>

            <div style={{
              display: 'grid',
              gap: '1rem'
            }}>
              {popCollection.trackList.map((track, index) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handlePlayTrack(index)}
                  style={{
                    padding: '1.2rem',
                    background: currentTrackIndex === index
                      ? 'linear-gradient(135deg, rgba(0, 234, 255, 0.3), rgba(0, 180, 255, 0.3))'
                      : 'rgba(255, 255, 255, 0.05)',
                    border: currentTrackIndex === index
                      ? '2px solid #00eaff'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = currentTrackIndex === index
                      ? 'linear-gradient(135deg, rgba(0, 234, 255, 0.4), rgba(0, 180, 255, 0.4))'
                      : 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.transform = 'translateX(8px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = currentTrackIndex === index
                      ? 'linear-gradient(135deg, rgba(0, 234, 255, 0.3), rgba(0, 180, 255, 0.3))'
                      : 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    flex: 1
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: currentTrackIndex === index ? '#00eaff' : 'rgba(0, 234, 255, 0.2)',
                      borderRadius: '8px',
                      fontWeight: 700,
                      color: currentTrackIndex === index ? '#000' : '#00eaff'
                    }}>
                      {index + 1}
                    </div>
                    <div style={{
                      textAlign: 'left'
                    }}>
                      <p style={{
                        margin: '0',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        color: currentTrackIndex === index ? '#00eaff' : '#fff'
                      }}>
                        {track.name}
                      </p>
                      <p style={{
                        margin: '0.3rem 0 0 0',
                        fontSize: '0.95rem',
                        color: 'rgba(255, 255, 255, 0.6)'
                      }}>
                        {track.artist}
                      </p>
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}>
                    {currentTrackIndex === index && isPlaying && (
                      <span style={{
                        fontSize: '1.2rem',
                        animation: 'pulse 1s infinite'
                      }}>
                        🎵
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        <footer className="footer">
          <p>&copy; 2025 Music Collection. All rights reserved. | Enjoy your music journey!</p>
        </footer>
      </div>
    </ParallaxProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
