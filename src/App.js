import './App.css';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ParallaxProvider } from 'react-scroll-parallax';
import { useEffect, useState, useRef } from 'react';
// Hero removed — landing goes straight to collections
import CollectionDetail from './components/CollectionDetail';
import ThemeSwitcher from './components/ThemeSwitcher';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';


const musicCollections = [
  {
    id: 1,
    title: "Lofi Hip Hop",
    artist: "Various Artists",
    description: "Relaxing beats perfect for studying and focus.",
    genre: "Lo-Fi",
    tracks: 45,
    file: "/music/music.mp3",
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
    title: "Midnight Jazz",
    artist: "Jazz Masters",
    description: "Smooth jazz collection for evening ambiance.",
    genre: "Jazz",
    tracks: 52,
    file: "/music/music.mp3",
    trackList: [
      { id: 1, name: "Smooth Saxophone", artist: "Miles Davis" },
      { id: 2, name: "Evening Groove", artist: "John Coltrane" },
      { id: 3, name: "Blue Mood", artist: "Bill Evans" },
      { id: 4, name: "Jazz Classic", artist: "Duke Ellington" },
      { id: 5, name: "Night Melody", artist: "Thelonious Monk" },
    ]
  },
  {
    id: 3,
    title: "Ambient Dreams",
    artist: "Electronic Composers",
    description: "Ambient soundscapes for meditation and relaxation.",
    genre: "Ambient",
    tracks: 38,
    file: "/music/music.mp3",
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
  const [activeSection, setActiveSection] = useState('collection');

  // Function to handle smooth scroll
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  // Update active section based on scroll position
    useEffect(() => {
    const handleScroll = () => {
    const sections = ['home', 'collection'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
                  onClick={() => setSelectedCollection(collection)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="project-image-container">
                    <div className="music-cover" style={{
                      background: `linear-gradient(135deg, hsl(${collection.id * 45}deg, 70%, 50%), hsl(${collection.id * 45 + 60}deg, 70%, 60%))`,
                      width: '100%',
                      height: '250px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '4rem',
                      borderRadius: '8px 8px 0 0',
                      cursor: 'pointer'
                    }}>
                      🎵
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
