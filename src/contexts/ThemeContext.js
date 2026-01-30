import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const themes = [
  {
    id: 'default',
    name: 'Default',
    colors: {
      primary: '#0066ff',
      secondary: '#00d4ff',
      accent: '#4da6ff',
      background: '#0a0a0a',
      text: '#f8fafc',
      primaryRgb: '0, 102, 255',
      secondaryRgb: '0, 212, 255',
      accentRgb: '77, 166, 255'
    }
  },
  {
    id: 'purple',
    name: 'Purple',
    colors: {
      primary: '#8b5cf6',
      secondary: '#a78bfa',
      accent: '#c4b5fd',
      background: '#0f0b1a',
      text: '#f8fafc',
      primaryRgb: '139, 92, 246',
      secondaryRgb: '167, 139, 250',
      accentRgb: '196, 181, 253'
    }
  },
  {
    id: 'green',
    name: 'Green',
    colors: {
      primary: '#10b981',
      secondary: '#34d399',
      accent: '#6ee7b7',
      background: '#0a1a0f',
      text: '#f8fafc',
      primaryRgb: '16, 185, 129',
      secondaryRgb: '52, 211, 153',
      accentRgb: '110, 231, 183'
    }
  },
  {
    id: 'red',
    name: 'Red',
    colors: {
      primary: '#ef4444',
      secondary: '#f87171',
      accent: '#fca5a5',
      background: '#1a0a0a',
      text: '#f8fafc',
      primaryRgb: '239, 68, 68',
      secondaryRgb: '248, 113, 113',
      accentRgb: '252, 165, 165'
    }
  },
  {
    id: 'orange',
    name: 'Orange',
    colors: {
      primary: '#f97316',
      secondary: '#fb923c',
      accent: '#fdba74',
      background: '#1a0f0a',
      text: '#f8fafc',
      primaryRgb: '249, 115, 22',
      secondaryRgb: '251, 146, 60',
      accentRgb: '253, 186, 116'
    }
  },
  {
    id: 'pink',
    name: 'Pink',
    colors: {
      primary: '#ec4899',
      secondary: '#f472b6',
      accent: '#f9a8d4',
      background: '#1a0a14',
      text: '#f8fafc',
      primaryRgb: '236, 72, 153',
      secondaryRgb: '244, 114, 182',
      accentRgb: '249, 168, 212'
    }
  },
  {
    id: 'cyan',
    name: 'Cyan',
    colors: {
      primary: '#06b6d4',
      secondary: '#22d3ee',
      accent: '#67e8f9',
      background: '#0a141a',
      text: '#f8fafc',
      primaryRgb: '6, 182, 212',
      secondaryRgb: '34, 211, 238',
      accentRgb: '103, 232, 249'
    }
  },
  {
    id: 'dark',
    name: 'Dark',
    colors: {
      primary: '#ffffff',
      secondary: '#e5e7eb',
      accent: '#9ca3af',
      background: '#000000',
      text: '#ffffff',
      primaryRgb: '255, 255, 255',
      secondaryRgb: '229, 231, 235',
      accentRgb: '156, 163, 175'
    }
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    colors: {
      primary: '#ff0080',
      secondary: '#00ffff',
      accent: '#ffff00',
      background: '#0a0a0a',
      text: '#ffffff',
      primaryRgb: '255, 0, 128',
      secondaryRgb: '0, 255, 255',
      accentRgb: '255, 255, 0'
    }
  },
  {
    id: 'neon',
    name: 'Neon',
    colors: {
      primary: '#39ff14',
      secondary: '#ff073a',
      accent: '#00d4ff',
      background: '#0a0a0a',
      text: '#ffffff',
      primaryRgb: '57, 255, 20',
      secondaryRgb: '255, 7, 58',
      accentRgb: '0, 212, 255'
    }
  },
  {
    id: 'sunset',
    name: 'Sunset',
    colors: {
      primary: '#ff6b35',
      secondary: '#f7931e',
      accent: '#ffd23f',
      background: '#1a0f0a',
      text: '#ffffff',
      primaryRgb: '255, 107, 53',
      secondaryRgb: '247, 147, 30',
      accentRgb: '255, 210, 63'
    }
  },
  {
    id: 'ocean',
    name: 'Ocean',
    colors: {
      primary: '#00b4d8',
      secondary: '#0077b6',
      accent: '#90e0ef',
      background: '#0a141a',
      text: '#ffffff',
      primaryRgb: '0, 180, 216',
      secondaryRgb: '0, 119, 182',
      accentRgb: '144, 224, 239'
    }
  },
  {
    id: 'forest',
    name: 'Forest',
    colors: {
      primary: '#2d5016',
      secondary: '#4a7c59',
      accent: '#7cb518',
      background: '#0a0f0a',
      text: '#ffffff',
      primaryRgb: '45, 80, 22',
      secondaryRgb: '74, 124, 89',
      accentRgb: '124, 181, 24'
    }
  },
  {
    id: 'lavender',
    name: 'Lavender',
    colors: {
      primary: '#8b5cf6',
      secondary: '#a78bfa',
      accent: '#ddd6fe',
      background: '#1a0f1a',
      text: '#ffffff',
      primaryRgb: '139, 92, 246',
      secondaryRgb: '167, 139, 250',
      accentRgb: '221, 214, 254'
    }
  },
  {
    id: 'fire',
    name: 'Fire',
    colors: {
      primary: '#dc2626',
      secondary: '#f97316',
      accent: '#fbbf24',
      background: '#1a0a0a',
      text: '#ffffff',
      primaryRgb: '220, 38, 38',
      secondaryRgb: '249, 115, 22',
      accentRgb: '251, 191, 36'
    }
  },
  {
    id: 'galaxy',
    name: 'Galaxy',
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#ec4899',
      background: '#0a0a1a',
      text: '#ffffff',
      primaryRgb: '99, 102, 241',
      secondaryRgb: '139, 92, 246',
      accentRgb: '236, 72, 153'
    }
  },
  {
    id: 'matrix',
    name: 'Matrix',
    colors: {
      primary: '#00ff00',
      secondary: '#00cc00',
      accent: '#66ff66',
      background: '#000000',
      text: '#00ff00',
      primaryRgb: '0, 255, 0',
      secondaryRgb: '0, 204, 0',
      accentRgb: '102, 255, 102'
    }
  },
  {
    id: 'aurora',
    name: 'Aurora',
    colors: {
      primary: '#00ff88',
      secondary: '#00d4ff',
      accent: '#ff0080',
      background: '#0a0a0a',
      text: '#ffffff',
      primaryRgb: '0, 255, 136',
      secondaryRgb: '0, 212, 255',
      accentRgb: '255, 0, 128'
    }
  },
  {
    id: 'cosmic',
    name: 'Cosmic',
    colors: {
      primary: '#ff6b9d',
      secondary: '#c44569',
      accent: '#f8b500',
      background: '#0a0a1a',
      text: '#ffffff',
      primaryRgb: '255, 107, 157',
      secondaryRgb: '196, 69, 105',
      accentRgb: '248, 181, 0'
    }
  }
  
];

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('default');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme && themes.find(theme => theme.id === savedTheme)) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // Save theme to localStorage and update CSS variables
  useEffect(() => {
    localStorage.setItem('portfolio-theme', currentTheme);
    const theme = themes.find(t => t.id === currentTheme) || themes[0];
    
    // Update CSS custom properties
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.colors.primary);
    root.style.setProperty('--secondary-color', theme.colors.secondary);
    root.style.setProperty('--accent-color', theme.colors.accent);
    root.style.setProperty('--background-color', theme.colors.background);
    root.style.setProperty('--text-color', theme.colors.text);
    root.style.setProperty('--primary-rgb', theme.colors.primaryRgb);
    root.style.setProperty('--secondary-rgb', theme.colors.secondaryRgb);
    root.style.setProperty('--accent-rgb', theme.colors.accentRgb);
    
    // Update gradient variables
    root.style.setProperty('--gradient-1', `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`);
    root.style.setProperty('--gradient-2', `linear-gradient(135deg, rgba(${theme.colors.primaryRgb}, 0.1) 0%, rgba(${theme.colors.secondaryRgb}, 0.1) 100%)`);
    root.style.setProperty('--gradient-accent', `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`);
    
    // Force re-render of gradient overlay by triggering a repaint
    const gradientOverlay = document.querySelector('.gradient-overlay');
    if (gradientOverlay) {
      gradientOverlay.style.display = 'none';
      // eslint-disable-next-line no-unused-expressions
      gradientOverlay.offsetHeight; // Trigger reflow
      gradientOverlay.style.display = '';
    }
  }, [currentTheme]);

  const changeTheme = (themeId) => {
    if (themes.find(theme => theme.id === themeId)) {
      setCurrentTheme(themeId);
    }
  };

  const getCurrentThemeData = () => {
    return themes.find(theme => theme.id === currentTheme) || themes[0];
  };

  const value = {
    currentTheme,
    changeTheme,
    getCurrentThemeData,
    themes
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
