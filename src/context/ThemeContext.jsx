import React, { createContext, useContext, useState, useEffect } from 'react';

const ColorModeContext = createContext(null);

const STORAGE_KEY = 'smart-home-color-mode';

export const ColorModeProvider = ({ children }) => {
  const [colorMode, setColorModeState] = useState(
    () => localStorage.getItem(STORAGE_KEY) || 'system'
  );

  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => setSystemDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const setColorMode = (mode) => {
    setColorModeState(mode);
    localStorage.setItem(STORAGE_KEY, mode);
  };

  const effectiveMode = colorMode === 'system' ? (systemDark ? 'dark' : 'light') : colorMode;

  return (
    <ColorModeContext.Provider value={{ colorMode, setColorMode, effectiveMode }}>
      {children}
    </ColorModeContext.Provider>
  );
};

export const useColorMode = () => useContext(ColorModeContext);
