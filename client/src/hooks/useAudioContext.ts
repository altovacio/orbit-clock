import React, { useRef, useCallback, createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// Base note frequencies (C4 to B4)
const BASE_NOTES = {
  C: 261.63,
  CSharp: 277.18,
  D: 293.66,
  DSharp: 311.13,
  E: 329.63,
  F: 349.23,
  FSharp: 369.99,
  G: 392.0,
  GSharp: 415.30,
  A: 440.0,
  ASharp: 466.16,
  B: 493.88,
};

// Scale patterns (semitone intervals from root)
const SCALE_PATTERNS = {
  majorPentatonic: [0, 2, 4, 7, 9],
  minorPentatonic: [0, 3, 5, 7, 10],
  major: [0, 2, 4, 5, 7, 9, 11],
  naturalMinor: [0, 2, 3, 5, 7, 8, 10],
  harmonicMinor: [0, 2, 3, 5, 7, 8, 11],
  blues: [0, 3, 5, 6, 7, 10],
  chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
};

function generateScaleFrequencies(
  rootNote: string,
  scaleType: keyof typeof SCALE_PATTERNS,
  octaves: number = 3
): number[] {
  // Split note into name and octave (e.g. "C#4" -> ["C#", "4"])
  const [notePart, octaveStr] = rootNote.split(/(\d+)/);
  const octave = parseInt(octaveStr) || 4;
  
  // Convert note name to match BASE_NOTES keys (C# -> CSharp)
  const noteName = notePart.replace(/#/g, 'Sharp') as keyof typeof BASE_NOTES;
  const baseFreq = BASE_NOTES[noteName] * Math.pow(2, octave - 4);
  
  const pattern = SCALE_PATTERNS[scaleType];
  const frequencies: number[] = [];

  for (let octave = 0; octave < octaves; octave++) {
    pattern.forEach(interval => {
      // Add 12 semitones for each octave
      const totalInterval = interval + (12 * octave);
      frequencies.push(baseFreq * Math.pow(2, totalInterval / 12));
    });
  }

  return frequencies;
}

interface AudioContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playSound: (orbitIndex: number) => void;
  setScale: (rootNote: string, scaleType: keyof typeof SCALE_PATTERNS) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

interface AudioProviderProps {
  children: ReactNode;
}

export function AudioProvider({ children }: AudioProviderProps) {
  const audioContextRef = useRef<AudioContext>();
  const [isMuted, setIsMuted] = useState(true);
  const [currentScale, setCurrentScale] = useState({
    rootNote: 'C4',
    scaleType: 'majorPentatonic' as keyof typeof SCALE_PATTERNS,
  });

  // Initialize audio context on mount
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const playSound = useCallback(async (orbitIndex: number) => {
    if (isMuted || !audioContextRef.current) return;

    try {
      const context = audioContextRef.current;
      const frequencies = generateScaleFrequencies(currentScale.rootNote, currentScale.scaleType, 3);
      
      // Add safety checks
      if (!frequencies.length) {
        console.error('No frequencies generated for current scale');
        return;
      }

      const freq = frequencies[orbitIndex % frequencies.length];
      
      if (typeof freq !== 'number' || !isFinite(freq)) {
        console.error('Invalid frequency value:', freq);
        return;
      }

      // Resume context if suspended (required by some browsers)
      if (context.state === 'suspended') {
        await context.resume();
      }

      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

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
  }, [isMuted, currentScale]);

  const setScale = useCallback((rootNote: string, scaleType: keyof typeof SCALE_PATTERNS) => {
    setCurrentScale({ rootNote, scaleType });
  }, []);

  const value = {
    isMuted,
    toggleMute,
    playSound,
    setScale,
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