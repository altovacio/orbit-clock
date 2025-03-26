import { useTime } from '@/contexts/TimeContext';
import { calculateNextReset } from '@/utils/periodMath';

export function useResetTimer(periods: number[], nextReset: number) {
  const { elapsedTime } = useTime();

  // Adjust elapsedTime if it exceeds nextReset
  let adjustedElapsedTime = elapsedTime;
  while (adjustedElapsedTime > nextReset) {
    adjustedElapsedTime -= nextReset;
  }

  const timeToNextReset = nextReset - adjustedElapsedTime;

  return {
    timeToNextReset,
    formattedReset: formatResetTime(timeToNextReset)
  };
}

// Add export keyword to the function
export function formatResetTime(durationMs: number) {
  const MINUTE = 60 * 1000;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;
  const YEAR = 365 * DAY;

  // Sanity check for durations that stretch the imagination

  if (durationMs > 1e10 * YEAR) {
    return '🌌 Cosmic Scale Time';
  }

  if (durationMs > 1000 * YEAR) {
    return '🚀 Millenniums!';
  }
  if (durationMs > YEAR) {
    return '⏳ Over a year! ';
  }

  if (durationMs > DAY) {
    const days = Math.floor(durationMs / DAY);
    const hours = Math.floor((durationMs % DAY) / HOUR);
    return `${days}d ${hours}h ⏳`;
  }

  if (durationMs > HOUR) {
    const hours = Math.floor(durationMs / HOUR);
    const minutes = Math.floor((durationMs % HOUR) / MINUTE);
    return `${hours}h ${minutes}m ⏳`;
  }

  if (durationMs > MINUTE) {
    const minutes = Math.floor(durationMs / MINUTE);
    const seconds = Math.floor((durationMs % MINUTE) / 1000);
    return `${minutes}m ${seconds}s`;
  }

  const seconds = Math.floor(durationMs / 1000);
  const milliseconds = Math.floor(durationMs % 1000);
  return `${seconds}.${Math.floor(milliseconds/10).toString().padStart(2, '0')}s`;
} 