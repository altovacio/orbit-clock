import React, { useRef, useCallback, createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// Base note frequencies (C4 to B4)
const BASE_NOTES = {
  C: 261.63,
  D: 293.66,
  E: 329.63,
  F: 349.23,
  G: 392.0,
  A: 440.0,
  B: 493.88,
};

// Scale patterns (semitone intervals from root)
const SCALE_PATTERNS = {
  majorPentatonic: [0, 2, 4, 7, 9],
  major: [0, 2, 4, 5, 7, 9, 11],
  naturalMinor: [0, 2, 3, 5, 7, 8, 10],
  chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
};

function generateScaleFrequencies(
  rootNote: keyof typeof BASE_NOTES,
  scaleType: keyof typeof SCALE_PATTERNS
): number[] {
  const pattern = SCALE_PATTERNS[scaleType];
  const rootFreq = BASE_NOTES[rootNote as keyof typeof BASE_NOTES];
  return pattern.map(interval => rootFreq * Math.pow(2, interval / 12));
}

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
  const [isMuted, setIsMuted] = useState(true);
  const [currentScale, setCurrentScale] = useState({
    rootNote: 'C' as keyof typeof BASE_NOTES,
    scaleType: 'majorPentatonic' as keyof typeof SCALE_PATTERNS
  });

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

      const frequencies = generateScaleFrequencies(currentScale.rootNote, currentScale.scaleType);
      const freq = frequencies[orbitIndex % frequencies.length];

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