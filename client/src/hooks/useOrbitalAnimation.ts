import { useRef, useCallback } from 'react';
import { select } from 'd3-selection';

interface UseOrbitalAnimationProps {
  svgRef: React.RefObject<SVGSVGElement>;
  type: string;
  numOrbits?: number;
  scale?: number;
  onTopReached?: () => void;
}

export function useOrbitalAnimation({ 
  svgRef, 
  type, 
  numOrbits = 2,
  scale = 1,
  onTopReached 
}: UseOrbitalAnimationProps) {
  const frameRef = useRef<number>();
  const timeRef = useRef<number>(0);
  const lastTopRef = useRef<boolean[]>([]);

  const animate = useCallback((timestamp: number) => {
    if (!svgRef.current) return;

    const svg = select(svgRef.current);
    const width = 400;
    const centerX = width / 2;
    const centerY = width / 2;
    const baseRadius = (width * 0.35) * scale;

    // Update time
    timeRef.current = timestamp;

    // Initialize lastTopRef if needed
    if (lastTopRef.current.length !== numOrbits) {
      lastTopRef.current = new Array(numOrbits).fill(false);
    }

    const orbits = type === 'single' || type === 'single-timer' ? 1 : numOrbits;

    for (let i = 0; i < orbits; i++) {
      const period = 3000 + (i * 1000); // Different period for each orbit
      const radius = baseRadius * ((i + 1) / orbits);
      const angle = (timestamp % period) / period * 2 * Math.PI;

      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      // Check if ball is at the top (within a small threshold)
      const isAtTop = Math.abs(Math.sin(angle) + 1) < 0.1;
      if (isAtTop && !lastTopRef.current[i] && onTopReached) {
        onTopReached();
      }
      lastTopRef.current[i] = isAtTop;

      svg.selectAll(`.orbit${i + 1}`)
        .data([null])
        .join('circle')
        .attr('class', `orbit${i + 1} ${i % 2 ? 'fill-purple-400' : 'fill-blue-400'}`)
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 6);
    }

    frameRef.current = requestAnimationFrame(animate);
  }, [type, numOrbits, scale, onTopReached]);

  const startAnimation = useCallback(() => {
    frameRef.current = requestAnimationFrame(animate);
  }, [animate]);

  const stopAnimation = useCallback(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }
  }, []);

  return { startAnimation, stopAnimation };
}