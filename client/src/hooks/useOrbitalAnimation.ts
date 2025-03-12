import { useRef, useCallback } from 'react';
import { select } from 'd3-selection';

interface UseOrbitalAnimationProps {
  svgRef: React.RefObject<SVGSVGElement>;
  type: string;
  numOrbits?: number;
  scale?: number;
  periods?: number[];
  onTopReached?: (orbitIndex: number) => void;
}

export function useOrbitalAnimation({ 
  svgRef, 
  type, 
  numOrbits = 2,
  scale = 1,
  periods = [3, 5],
  onTopReached 
}: UseOrbitalAnimationProps) {
  const frameRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const lastTopRef = useRef<boolean[]>([]);

  const animate = useCallback((timestamp: number) => {
    if (!svgRef.current) return;

    const svg = select(svgRef.current);
    const width = 400;
    const centerX = width / 2;
    const centerY = width / 2;
    const baseRadius = (width * 0.35) * scale;

    // Initialize time reference
    if (startTimeRef.current === 0) {
      startTimeRef.current = timestamp;
    }
    const elapsedTime = (timestamp - startTimeRef.current) / 1000; // Convert to seconds

    // Initialize lastTopRef if needed
    if (lastTopRef.current.length !== numOrbits) {
      lastTopRef.current = new Array(numOrbits).fill(false);
    }

    const orbits = type === 'single' || type === 'single-timer' ? 1 : numOrbits;

    for (let i = 0; i < orbits; i++) {
      const period = periods[i] || 3 + i; // Default period if not specified
      const radius = baseRadius * ((i + 1) / orbits);

      // Calculate angle based on period (angular velocity = 2π/period)
      const angle = (elapsedTime * (2 * Math.PI) / period) % (2 * Math.PI);

      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      // Check if ball is at the top (within a small threshold)
      const isAtTop = Math.abs(Math.sin(angle) + 1) < 0.1;
      if (isAtTop && !lastTopRef.current[i] && onTopReached) {
        onTopReached(i);
      }
      lastTopRef.current[i] = isAtTop;

      // Create or update the ball with modern styling
      svg.selectAll(`.orbit${i + 1}`)
        .data([null])
        .join('g')
        .attr('class', `orbit${i + 1}`)
        .attr('transform', `translate(${x},${y})`)
        .call(g => {
          // Main ball
          g.selectAll('circle.ball-core')
            .data([null])
            .join('circle')
            .attr('class', 'ball-core')
            .attr('r', 6)
            .attr('fill', i % 2 ? 'rgb(168, 85, 247)' : 'rgb(59, 130, 246)')
            .attr('filter', 'url(#glow)');

          // Highlight
          g.selectAll('circle.ball-highlight')
            .data([null])
            .join('circle')
            .attr('class', 'ball-highlight')
            .attr('r', 2)
            .attr('cx', -2)
            .attr('cy', -2)
            .attr('fill', 'rgba(255, 255, 255, 0.8)');
        });
    }

    frameRef.current = requestAnimationFrame(animate);
  }, [type, numOrbits, scale, periods, onTopReached]);

  const startAnimation = useCallback(() => {
    startTimeRef.current = 0;
    frameRef.current = requestAnimationFrame(animate);
  }, [animate]);

  const stopAnimation = useCallback(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }
  }, []);

  return { startAnimation, stopAnimation };
}