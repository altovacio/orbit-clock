import { useState, useRef, useEffect } from 'react';

export function useTimer() {
  const [elapsedTime, setElapsedTime] = useState(0);
  const startTimeRef = useRef<number>(0);
  const frameRef = useRef<number>();

  const startTimer = () => {
    startTimeRef.current = 0;
    const updateTimer = (timestamp: number) => {
      if (startTimeRef.current === 0) {
        startTimeRef.current = timestamp;
      }
      const elapsed = (timestamp - startTimeRef.current) / 1000;
      setElapsedTime(elapsed);
      frameRef.current = requestAnimationFrame(updateTimer);
    };
    frameRef.current = requestAnimationFrame(updateTimer);
  };

  const stopTimer = () => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }
  };

  const resetTimer = () => {
    startTimeRef.current = 0;
    setElapsedTime(0);
  };

  useEffect(() => {
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return { elapsedTime, startTimer, stopTimer, resetTimer };
}
