import React, { useRef, useCallback, createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { BASE_NOTES, SCALE_PATTERNS } from "@/config/orbitConfig";

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
  currentScale: {
    rootNote: string;
    scaleType: keyof typeof SCALE_PATTERNS;
  };
}

const AudioContext = createContext<AudioContextType | null>(null);

interface AudioProviderProps {
  children: ReactNode;
}

export function AudioProvider({ children }: AudioProviderProps) {
  const [isContextReady, setIsContextReady] = useState(false);
  const audioContextRef = useRef<AudioContext>();
  const [isMuted, setIsMuted] = useState(true);
  const [currentScale, setCurrentScale] = useState({
    rootNote: 'C4',
    scaleType: 'majorPentatonic' as keyof typeof SCALE_PATTERNS,
  });

  // Move initializeAudioContext to the top of the component
  const initializeAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      setIsContextReady(true);
      
      // Create and connect a silent oscillator
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      gainNode.gain.value = 0;
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      oscillator.start();
      setTimeout(() => oscillator.stop(), 100);
    }
  }, []);

  // Then define toggleMute that uses it
  const toggleMute = useCallback(() => {
    if (!audioContextRef.current) {
      initializeAudioContext();
      setIsMuted(false); // Initialize as unmuted when creating context
      return;
    }
    
    // Suspend/resume audio context instead of just toggling state
    if (isMuted) {
      audioContextRef.current.resume();
    } else {
      audioContextRef.current.suspend();
    }
    setIsMuted(!isMuted);
  }, [initializeAudioContext, isMuted]);

  // Then define the useEffect that uses initializeAudioContext
  useEffect(() => {
    const handleFirstInteraction = () => {
      initializeAudioContext();
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('click', handleFirstInteraction);
    };

    window.addEventListener('touchstart', handleFirstInteraction, { once: true });
    window.addEventListener('click', handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('click', handleFirstInteraction);
    };
  }, [initializeAudioContext]);

  const playSound = useCallback(async (orbitIndex: number) => {
    if (!audioContextRef.current || isMuted) return;
    
    try {
      // Always check context state
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

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

      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, audioContextRef.current.currentTime);

      // Quick attack, slow release for a star-like shimmer
      gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.15, audioContextRef.current.currentTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.5);

      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      oscillator.start();
      oscillator.stop(audioContextRef.current.currentTime + 0.5);

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
    currentScale,
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