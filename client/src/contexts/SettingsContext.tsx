import React, { createContext, useContext, useState, useMemo } from 'react';

type SettingsContextType = {
  starSize: number;
  setStarSize: (size: number) => void;
  colorScheme: 'single' | 'variable';
  toggleColorScheme: () => void;
};

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [starSize, setStarSize] = useState(1);
  const [colorScheme, setColorScheme] = useState<'single' | 'variable'>('variable');

  const toggleColorScheme = () => {
    setColorScheme(prev => {
      const newScheme = prev === 'single' ? 'variable' : 'single';
      return newScheme;
    });
  };

  return (
    <SettingsContext.Provider 
      value={useMemo(() => ({
        starSize, 
        setStarSize,
        colorScheme,
        toggleColorScheme
      }), [starSize, colorScheme])}
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