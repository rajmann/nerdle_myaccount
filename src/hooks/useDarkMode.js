import { useState, useEffect } from 'react';

const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem('darkModeNew');
    const shouldBeDark = stored === 'true';
    
    // Immediately apply the correct class
    const root = document.documentElement;
    if (shouldBeDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    console.log('Initial dark mode setup - stored:', stored, 'shouldBeDark:', shouldBeDark);
    return shouldBeDark;
  });

  useEffect(() => {
    const root = document.documentElement;
    
    // Clear any existing dark mode classes first
    root.classList.remove('dark');
    
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('darkModeNew', 'true');
    } else {
      localStorage.setItem('darkModeNew', 'false');
    }
    
    console.log('Dark mode state changed:', isDarkMode);
    console.log('HTML classList:', root.classList.toString());
    
    // Force a repaint to ensure styles are applied
    document.body.style.visibility = 'hidden';
    // eslint-disable-next-line no-unused-expressions
    document.body.offsetHeight; // trigger reflow
    document.body.style.visibility = 'visible';
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return { isDarkMode, toggleDarkMode };
};

export default useDarkMode;