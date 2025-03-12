import { useRef, useCallback } from 'react';
import { select } from 'd3-selection';

interface UseOrbitalAnimationProps {
  svgRef: React.RefObject<SVGSVGElement>;
  type: string;
  onAlignment?: () => void;
}

export function useOrbitalAnimation({ svgRef, type, onAlignment }: UseOrbitalAnimationProps) {
  const frameRef = useRef<number>();
  const timeRef = useRef<number>(0);

  const animate = useCallback((timestamp: number) => {
    if (!svgRef.current) return;
    
    const svg = select(svgRef.current);
    const width = svg.node()?.getBoundingClientRect().width || 400;
    const centerX = width / 2;
    const centerY = width / 2;

    // Update time
    const deltaTime = timestamp - (timeRef.current || timestamp);
    timeRef.current = timestamp;

    // Calculate positions
    const period1 = 3000; // 3 seconds
    const period2 = 5000; // 5 seconds
    
    const angle1 = (timestamp % period1) / period1 * 2 * Math.PI;
    const angle2 = (timestamp % period2) / period2 * 2 * Math.PI;

    const radius1 = width * 0.2;
    const radius2 = width * 0.4;

    // Update or create orbiting objects
    if (type === 'single' || type === 'single-timer') {
      const x = centerX + Math.cos(angle1) * radius1;
      const y = centerY + Math.sin(angle1) * radius1;

      svg.selectAll('.orbit1')
        .data([null])
        .join('circle')
        .attr('class', 'orbit1 fill-blue-400')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 8);
    } 
    else if (['double', 'crossing', 'alignment'].includes(type)) {
      // First orbit
      const x1 = centerX + Math.cos(angle1) * radius1;
      const y1 = centerY + Math.sin(angle1) * radius1;

      svg.selectAll('.orbit1')
        .data([null])
        .join('circle')
        .attr('class', 'orbit1 fill-blue-400')
        .attr('cx', x1)
        .attr('cy', y1)
        .attr('r', 8);

      // Second orbit
      const x2 = centerX + Math.cos(angle2) * radius2;
      const y2 = centerY + Math.sin(angle2) * radius2;

      svg.selectAll('.orbit2')
        .data([null])
        .join('circle')
        .attr('class', 'orbit2 fill-purple-400')
        .attr('cx', x2)
        .attr('cy', y2)
        .attr('r', 8);

      // Check alignment
      const distance = Math.sqrt(
        Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)
      );

      if (distance < 20 && onAlignment) {
        onAlignment();
      }
    }

    frameRef.current = requestAnimationFrame(animate);
  }, [type, onAlignment]);

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
