import './App.css';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ParallaxProvider } from 'react-scroll-parallax';
import { useEffect, useState, useRef } from 'react';
// Hero removed — landing goes straight to collections
import CollectionDetail from './components/CollectionDetail';
import ThemeSwitcher from './components/ThemeSwitcher';
import { ThemeProvider } from './contexts/ThemeContext';

function formatNameFromFile(filename) {
  const name = filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
  return name.split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
}

const popFiles = ['betterwhenimdancing.mp3', 'cincin.mp3', 'letdown.mp3', 'ea.mp3', 'everythinguare.mp3', 'garammadu.mp3', 'kota.mp3', 'nggadulu.mp3', 'ophelia.mp3', 'soasu.mp3', 'tarot.mp3'];

const musicCollections = [
  {
    id: 1,
    title: "Lofi Hip Hop",
    artist: "Various Artists",
    description: "Relaxing beats perfect for studying and focus.",
    genre: "Lo-Fi",
    tracks: 45,
    file: "/music/music.mp3",
    image: "https://i.ytimg.com/vi/CFGLoQIhmow/maxresdefault.jpg",
    trackList: [
      { id: 1, name: "Midnight Study", artist: "Chill Vibes" },
      { id: 2, name: "Focus Mode", artist: "Lo-Fi Master",},
      { id: 3, name: "Coffee Shop", artist: "Beats Daily",},
      { id: 4, name: "Rainy Day", artist: "Ambient Beats", },
      { id: 5, name: "Sunset Walk", artist: "Chill Vibes",},
    ]
  },
  {
    id: 2,
    title: "Pop Playlist",
    artist: "Your Music",
    description: "Pop songs from your local /public/music folder.",
    genre: "Pop",
    tracks: popFiles.length,
    file: "/music/music.mp3",
    image: "https://cdn-images.dzcdn.net/images/cover/9eb5f9334e7bfed5aae9701e76265298/0x1900-000000-80-0-0.jpg",
    trackList: popFiles.map((f, i) => ({ id: i + 1, name: formatNameFromFile(f), artist: 'Pop', file: `/music/${encodeURIComponent(f)}` }))
  },
  {
    id: 3,
    title: "Ambient Dreams",
    artist: "Electronic Composers",
    description: "Ambient soundscapes for meditation and relaxation.",
    genre: "Ambient",
    tracks: 38,
    file: "/music/music.mp3",
    image: "https://blog.landr.com/wp-content/uploads/2025/08/How-to-Make-Ambient-Music.png",
    trackList: [
      { id: 1, name: "Peaceful Waves", artist: "Ambient One" },
      { id: 2, name: "Ethereal Skies", artist: "Relaxation Pro" },
      { id: 3, name: "Cosmic Journey", artist: "Space Sounds" },
      { id: 4, name: "Forest Rain", artist: "Nature Beats" },
      { id: 5, name: "Meditation Zen", artist: "Calm Music" },
    ]
  },
  {
    id: 4,
    title: "Classical Masterpieces",
    artist: "Orchestra",
    description: "Timeless classical compositions from legendary composers.",
    genre: "Classical",
    tracks: 48,
    file: "/music/music.mp3",
    image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500&h=500&fit=crop",
    trackList: [
      { id: 1, name: "Moonlight Sonata", artist: "Ludwig van Beethoven" },
      { id: 2, name: "The Four Seasons", artist: "Antonio Vivaldi" },
      { id: 3, name: "Eine kleine Nachtmusik", artist: "Wolfgang Amadeus Mozart" },
      { id: 4, name: "Swan Lake", artist: "Pyotr Ilyich Tchaikovsky" },
      { id: 5, name: "Clair de Lune", artist: "Claude Debussy" },
    ]
  }
];

function AppContent() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress);
  const [showMusicModal, setShowMusicModal] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const audioRef = useRef(null);
  // default to collections since Hero removed



  useEffect(() => {
    audioRef.current = new Audio('/music/music.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleMusicChoice = (choice) => {
    setShowMusicModal(false);
    if (choice && audioRef.current) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(error => {
          console.error('Error playing audio:', error);
        });
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play()
        .catch(error => {
          console.error('Error playing audio:', error);
        });
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <ParallaxProvider>
      {selectedCollection ? (
        <CollectionDetail 
          collection={selectedCollection} 
          onBack={() => setSelectedCollection(null)}
        />
      ) : (
        <>
          <div className="gradient-overlay"></div>
          <div className="App">
            {/* Navbar */}
            <nav className="navbar">
              <div className="navbar-container">
                <a href="#collection" className="nav-logo">
                  <div className="nav-logo-photo">
                    🎵 Music Collection
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
                <p>Would you like to play background music?</p>
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

        {/* Hero Section */}
        <section id="home">
          <div className="particles">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="particle" />
            ))}
          </div>
        </section>

        {/* About Section */}
        {/* Removed - will be replaced with music collection section */}

        {/* Music Collections Section */}
        <section id="collection" className="projects-section">
          <div className="projects-container">
            <motion.div 
              className="projects-header"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2>🎵 Music Collections</h2>
              <p>Explore our curated selection of music collections</p>
            </motion.div>

            <div className="projects-grid">
              {musicCollections.map((collection, index) => (
                <motion.div 
                  key={index}
                  className="project-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: index * 0.3,
                    duration: 0.5,
                    ease: "easeOut"
                  }}
                  whileHover={{ 
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                  onClick={() => {
                    if (audioRef.current) {
                      audioRef.current.pause();
                    }
                    setSelectedCollection(collection);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="project-image-container">
                    <div className="music-cover" style={{
                      backgroundImage: `url('${collection.image}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      width: '100%',
                      height: '250px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '4rem',
                      borderRadius: '8px 8px 0 0',
                      cursor: 'pointer',
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        borderRadius: '8px 8px 0 0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }} />
                    </div>
                  </div>

                  <div className="project-content">
                    <h3 className="project-title">{collection.title}</h3>
                    <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)', margin: '0.5rem 0' }}>{collection.artist}</p>
                    <p className="project-description">{collection.description}</p>

                    <div className="project-tags">
                      <span className="project-tag">{collection.genre}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <footer className="footer">
          <p>&copy; 2025 Music Collection. All rights reserved. | Enjoy your music journey!</p>
        </footer>

        <audio ref={audioRef} src="/music/music.mp3" loop />
        <div className="music-player">
          <button 
            onClick={togglePlay}
            className="music-toggle"
            aria-label={isPlaying ? 'Pause Music' : 'Play Music'}
          >
            <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-music'}`}></i>
            <span className="music-label">{isPlaying ? 'Now Playing' : 'Play Music'}</span>
          </button>
        </div>
      </div>
        </>
      )}
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
