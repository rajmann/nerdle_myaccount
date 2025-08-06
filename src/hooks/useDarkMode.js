import { useState, useEffect } from 'react';

const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Force start in light mode for debugging
    const stored = localStorage.getItem('darkModeNew');
    
    // Always start with light mode and remove any existing dark class
    const root = document.documentElement;
    root.classList.remove('dark');
    
    // If no stored preference, default to light mode (false)
    const shouldBeDark = stored === 'true';
    
    console.log('Initial dark mode setup - stored:', stored, 'shouldBeDark:', shouldBeDark, 'forcing light mode for debug');
    return shouldBeDark;
  });

  useEffect(() => {
    const root = document.documentElement;
    
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('darkModeNew', 'true');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('darkModeNew', 'false');
    }
    
    // Debug logging
    console.log('useEffect - Dark mode state:', isDarkMode);
    console.log('useEffect - HTML classList:', root.classList.toString());
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return { isDarkMode, toggleDarkMode };
};

export default useDarkMode;