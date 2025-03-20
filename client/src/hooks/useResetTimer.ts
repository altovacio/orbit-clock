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

// Update the formatResetTime function to handle large values
const formatResetTime = (ms: number) => {
  if (ms > 1e12) { // More than ~31,000 years
    return "∞";
  }
  
  const totalSeconds = ms / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const remainingMs = Math.floor(ms % 1000 / 10);

  return `${minutes}:${seconds.toString().padStart(2, '0')}.${remainingMs.toString().padStart(2, '0')}`;
}; 