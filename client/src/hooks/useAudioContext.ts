import { useRef, useCallback } from 'react';

// Musical notes in the pentatonic scale (more harmonious)
const NOTES = [
  523.25, // C5
  587.33, // D5
  659.25, // E5
  783.99, // G5
  880.00  // A5
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
    gainNode.gain.setValueAtTime(0.2, context.currentTime); // Reduced volume
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + 0.3);
  }, []);

  return { playSound };
}