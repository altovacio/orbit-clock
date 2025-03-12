import { useRef, useCallback } from 'react';

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

export function useAudioContext() {
  const audioContextRef = useRef<AudioContext>();

  const playSound = useCallback((orbitIndex: number) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const context = audioContextRef.current;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    // Use pentatonic scale notes based on orbit index
    const frequency = NOTES[orbitIndex % NOTES.length];

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);

    // Quick attack, slow release for a star-like shimmer
    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.15, context.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + 0.5);
  }, []);

  return { playSound };
}