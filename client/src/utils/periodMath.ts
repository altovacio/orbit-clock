// Greatest Common Divisor
function gcd(a: number, b: number): number {
  return b ? gcd(b, a % b) : a;
}

// Least Common Multiple for two numbers
function lcm(a: number, b: number): number {
  return (a / gcd(a, b)) * b;
}

// Add new utility functions
function computeSeriesLCM(start: number, steps: number, increment = 1): number {
  if (steps < 1) return start;
  
  let result = start;
  for (let i = 1; i < steps; i++) {
    const nextNum = start + (i * increment);
    result = lcm(result, nextNum);
  }
  return result;
}

// Update the predictSystemRestart function with proper naming
export function predictSystemRestart(numOrbits: number, minPeriod: number, maxPeriod: number): number | null {
  if (numOrbits < 2) return null;
  
  const k = numOrbits - 1;
  const Tmin = minPeriod;
  const Tmax = maxPeriod;
  const deltaT = Tmax - Tmin;
  const Bk = k * Tmin;

  const lcmResult = computeSeriesLCM(Bk, k + 1, deltaT);
  return lcmResult / k;
}

// Revised calculateNextReset that uses only periods array
export function calculateNextReset(periods: number[]): number {
  if (periods.length === 0) return 0;
  
  // Derive parameters from periods array
  const numOrbits = periods.length;
  const minPeriod = Math.min(...periods);
  const maxPeriod = Math.max(...periods);
  const uniformLCM = predictSystemRestart(numOrbits, minPeriod, maxPeriod);
  if (uniformLCM === null) {
    throw new Error("Unable to predict system restart: invalid parameters.");
  }
  return uniformLCM;
} 