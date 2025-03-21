import React, { createContext, useContext, useState, useMemo } from 'react';

type SettingsContextType = {
  starSize: number;
  setStarSize: (size: number) => void;
  colorScheme: 'highQuality' | 'lowQuality';
  colorMode: 'monochrome' | 'multicolor';
  toggleColorScheme: () => void;
  toggleColorMode: () => void;
};

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [starSize, setStarSize] = useState(1);
  const [colorScheme, setColorScheme] = useState<'highQuality' | 'lowQuality'>('highQuality');
  const [colorMode, setColorMode] = useState<'monochrome' | 'multicolor'>('monochrome');

  const toggleColorScheme = () => {
    setColorScheme(prev => prev === 'highQuality' ? 'lowQuality' : 'highQuality');
  };

  const toggleColorMode = () => {
    setColorMode(prev => prev === 'monochrome' ? 'multicolor' : 'monochrome');
  };

  return (
    <SettingsContext.Provider 
      value={useMemo(() => ({
        starSize, 
        setStarSize,
        colorScheme,
        colorMode,
        toggleColorScheme,
        toggleColorMode
      }), [starSize, colorScheme, colorMode])}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
} 