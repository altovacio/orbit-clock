import { useRef, useCallback } from 'react';
import { select } from 'd3-selection';
import { BALL_GRADIENTS, BALL_FILTERS, BALL_SIZES } from "@/config/orbitConfig";
import { useSettings } from "@/contexts/SettingsContext";
import { useTime } from '@/contexts/TimeContext';

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
  periods = [3000, 5000],
  onTopReached
}: UseOrbitalAnimationProps) {
  const frameRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const lastTopRef = useRef<boolean[]>([]);
  const { starSize, colorScheme } = useSettings();
  const { elapsedTime } = useTime();

  const animate = useCallback(() => {
    if (!svgRef.current) return;

    const svg = select(svgRef.current);
    const width = 400;
    const centerX = width / 2;
    const centerY = width / 2;
    const baseRadius = (width * 0.35) * scale;
    const baseSize = BALL_SIZES.base * starSize;
    const highlightSize = BALL_SIZES.highlight * starSize;

    // Initialize time reference
    if (startTimeRef.current === 0) {
      startTimeRef.current = elapsedTime;
    }

    // Initialize lastTopRef if needed
    if (lastTopRef.current.length !== numOrbits) {
      lastTopRef.current = new Array(numOrbits).fill(false);
    }

    const orbits = type === 'single' || type === 'single-timer' ? 1 : numOrbits;

    for (let i = 0; i < orbits; i++) {
      const period = periods[i] || 3000 + i*1000;
      const angle = -Math.PI / 2 + (elapsedTime * (2 * Math.PI) / period) % (2 * Math.PI);
      const radius = baseRadius * ((i + 1) / orbits);

      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      // Create or update the ball with neon fire effect
      svg.selectAll(`.orbit${i + 1}`)
        .data([null])
        .join('g')
        .attr('class', `orbit${i + 1}`)
        .attr('transform', `translate(${x},${y})`)
        .call(g => {
          // White highlight at the back
          g.selectAll('circle.ball-highlight')
            .data([null])
            .join('circle')
            .attr('class', 'ball-highlight')
            .attr('r', highlightSize)
            .attr('cx', -1)
            .attr('cy', -1)
            .attr('fill', colorScheme === 'single' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.9)');

          // Glowing core in front
          g.selectAll('circle.ball-core')
            .data([null])
            .join('circle')
            .attr('class', 'ball-core')
            .attr('r', baseSize)
            .attr('fill', `url(#ballGradient-${i}-${colorScheme})`)
            .attr('filter', `url(#simple-glow-${i}-${colorScheme})`);
        });

      // Check if ball is at the north position (top)
      // Using sine wave: at north position sin(angle) ≈ -1
      const isAtTop = Math.abs(Math.sin(angle) + 1) < 0.01;
      if (isAtTop && !lastTopRef.current[i] && onTopReached) {
        onTopReached(i);
      }
      lastTopRef.current[i] = isAtTop;
    }
  }, [type, numOrbits, scale, periods, starSize, colorScheme, onTopReached]);

  const startAnimation = useCallback(() => {
    const loop = () => {
      animate();
      frameRef.current = requestAnimationFrame(loop);
    };
    frameRef.current = requestAnimationFrame(loop);
  }, [animate]);

  const stopAnimation = useCallback(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }
  }, []);

  return { startAnimation, stopAnimation };
}