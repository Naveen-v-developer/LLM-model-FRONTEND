import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const themes = ['light', 'dark', 'blue', 'purple', 'green'];

  useEffect(() => {
    localStorage.setItem('theme', theme);
    const html = document.documentElement;
    
    // Remove all theme classes
    html.classList.remove('light', 'dark', 'blue', 'purple', 'green');
    
    // Add current theme
    html.classList.add(theme);
    
    // Update document class for Tailwind dark mode
    if (theme === 'dark' || theme === 'blue' || theme === 'purple' || theme === 'green') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};
