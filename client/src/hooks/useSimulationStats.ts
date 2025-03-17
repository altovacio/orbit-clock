import { useState, useEffect, useRef } from 'react';

interface SimulationStats {
  elapsedTime: number;
  orderParameter: number;
  nextAlignment: number | null;
}

export function useSimulationStats(
  numOrbits: number,
  periods: number[],
  running: boolean = true
): SimulationStats {
  const [stats, setStats] = useState<SimulationStats>({
    elapsedTime: 0,
    orderParameter: 0,
    nextAlignment: null
  });

  const startTimeRef = useRef<number>(Date.now());
  const frameRef = useRef<number>();

  // Compute order parameter (synchronization measure)
  const computeOrderParameter = (currentTime: number) => {
    const phases = periods.map(period => {
      const phase = 2 * Math.PI * (currentTime / period);
      return {
        real: Math.cos(phase),
        imag: Math.sin(phase)
      };
    });

    const sum = phases.reduce((acc, val) => ({
      real: acc.real + val.real,
      imag: acc.imag + val.imag
    }), { real: 0, imag: 0 });

    const meanReal = sum.real / periods.length;
    const meanImag = sum.imag / periods.length;

    return Math.sqrt(meanReal * meanReal + meanImag * meanImag);
  };

  // Predict next system restart (alignment)
  const predictNextAlignment = () => {
    if (numOrbits < 2) return null;

    const Tmin = Math.min(...periods) * 1000; // Convert to ms
    const Tmax = Math.max(...periods) * 1000;
    const k = numOrbits - 1;
    const deltaT = (Tmax - Tmin) / k;

    // Generate the series: Bk, Bk + deltaT, Bk + 2deltaT, ..., Bk + kdeltaT
    const Bk = k * Tmin;

    // Helper function to compute LCM
    const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
    const lcm = (a: number, b: number): number => Math.abs(a * b) / gcd(a, b);

    // Compute LCM of the series
    let result = Bk;
    for (let i = 1; i < k + 1; i++) {
      result = lcm(result, Bk + i * deltaT);
    }

    return result / k;
  };

  useEffect(() => {
    if (!running) {
      startTimeRef.current = Date.now();
      return;
    }

    const updateStats = () => {
      const elapsedTime = Date.now() - startTimeRef.current;
      setStats({
        elapsedTime,
        orderParameter: computeOrderParameter(elapsedTime / 1000), // Convert to seconds for phase calculation
        nextAlignment: predictNextAlignment()
      });
      frameRef.current = requestAnimationFrame(updateStats);
    };

    frameRef.current = requestAnimationFrame(updateStats);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [running, numOrbits, periods]);

  return stats;
}