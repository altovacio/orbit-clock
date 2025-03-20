// Greatest Common Divisor
function gcd(a: number, b: number): number {
  return b ? gcd(b, a % b) : a;
}

// Least Common Multiple for two numbers
function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}

// LCM for array of periods (in milliseconds)
export function calculateLCM(periods: number[]): number {
  if (periods.length === 0) return 0;
  return periods.reduce((a, b) => lcm(a, b));
}

// Calculate time until next alignment
export function calculateNextReset(currentTime: number, periods: number[]): number {
  if (periods.length === 0) return 0;
  
  const lcmValue = calculateLCM(periods);
  if (lcmValue === 0) return 0;
  
  const currentPosition = currentTime % lcmValue;
  return lcmValue - currentPosition;
} 