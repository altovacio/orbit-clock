import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

type TimeContextType = {
  elapsedTime: number;
  isRunning: boolean;
  startTime: () => void;
  stopTime: () => void;
  resetTime: () => void;
  toggleRunning: () => void;
};

const TimeContext = createContext<TimeContextType | null>(null);

export function TimeProvider({ children }: { children: React.ReactNode }) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(performance.now());
  const accumulatedTimeRef = useRef<number>(0);

  const animate = (time: number) => {
    if (isRunning) {
      const delta = time - lastTimeRef.current;
      accumulatedTimeRef.current += delta;
      setElapsedTime(prev => prev + delta / 1000);
    }
    lastTimeRef.current = time;
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning]);

  const startTime = () => {
    setIsRunning(true);
    lastTimeRef.current = performance.now();
  };

  const stopTime = () => setIsRunning(false);
  
  const resetTime = () => {
    accumulatedTimeRef.current = 0;
    setElapsedTime(0);
  };

  const toggleRunning = () => setIsRunning(prev => !prev);

  return (
    <TimeContext.Provider value={{
      elapsedTime,
      isRunning,
      startTime,
      stopTime,
      resetTime,
      toggleRunning
    }}>
      {children}
    </TimeContext.Provider>
  );
}

export function useTime() {
  const context = useContext(TimeContext);
  if (!context) {
    throw new Error('useTime must be used within a TimeProvider');
  }
  return context;
} 