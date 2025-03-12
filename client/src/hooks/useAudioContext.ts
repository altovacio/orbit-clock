import { useRef, useCallback } from 'react';

export function useAudioContext() {
  const audioContextRef = useRef<AudioContext>();
  
  const playAlignmentSound = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const context = audioContextRef.current;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, context.currentTime);
    gainNode.gain.setValueAtTime(0.5, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + 0.5);
  }, []);

  return { playAlignmentSound };
}
