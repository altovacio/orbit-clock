import React, { useRef, useCallback, createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// Musical notes in the pentatonic scale (harmonious star-like sounds)
const NOTES = [
  523.25, // C5
  587.33, // D5
  659.25, // E5
  783.99, // G5
  880.00, // A5
  1046.50, // C6
  1174.66, // D6
  1318.51, // E6
  1567.98, // G6
  1760.00  // A6
];

interface AudioContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playSound: (orbitIndex: number) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

interface AudioProviderProps {
  children: ReactNode;
}

export function AudioProvider({ children }: AudioProviderProps) {
  const audioContextRef = useRef<AudioContext>();
  const [isMuted, setIsMuted] = useState(true); // Start muted by default

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const playSound = useCallback((orbitIndex: number) => {
    if (isMuted) return;

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new window.AudioContext();
      }

      const context = audioContextRef.current;
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      // Use pentatonic scale notes
      const freq = NOTES[orbitIndex % NOTES.length];

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, context.currentTime);

      // Quick attack, slow release for a star-like shimmer
      gainNode.gain.setValueAtTime(0, context.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.15, context.currentTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      oscillator.start();
      oscillator.stop(context.currentTime + 0.5);

      // Cleanup connections
      setTimeout(() => {
        oscillator.disconnect();
        gainNode.disconnect();
      }, 1000);
    } catch (error) {
      console.error('Audio playback error:', error);
    }
  }, [isMuted]);

  const value = {
    isMuted,
    toggleMute,
    playSound
  };

  return React.createElement(AudioContext.Provider, { value }, children);
}

export function useAudioContext() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudioContext must be used within an AudioProvider');
  }
  return context;
}