import { useTime } from '@/contexts/TimeContext';
import { calculateNextReset } from '@/utils/periodMath';

export function useResetTimer(periods: number[]) {
  const { elapsedTime } = useTime();
  
  // Convert milliseconds to seconds with 3 decimal places
  const currentTimeSeconds = elapsedTime;
  const nextReset = calculateNextReset(currentTimeSeconds, periods);
  
  return {
    nextReset,
    formattedReset: formatResetTime(nextReset)
  };
}

// Update the formatResetTime function
const formatResetTime = (ms: number) => {
  const totalSeconds = ms / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const remainingMs = Math.floor(ms % 1000 / 10); // Get centiseconds

  return `${minutes}:${seconds.toString().padStart(2, '0')}.${remainingMs.toString().padStart(2, '0')}`;
}; 