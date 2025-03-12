import { useEffect, useRef } from 'react';
import { select } from 'd3-selection';
import { useOrbitalAnimation } from '@/hooks/useOrbitalAnimation';
import { useAudioContext } from '@/hooks/useAudioContext';

interface OrbitProps {
  type: string;
  numOrbits?: number;
  scale?: number;
  periods?: number[];
}

export default function Orbits({ type, numOrbits = 2, scale = 1, periods = [3, 5] }: OrbitProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { playSound } = useAudioContext();

  const { startAnimation, stopAnimation } = useOrbitalAnimation({
    svgRef,
    type,
    numOrbits,
    scale,
    periods,
    onTopReached: (orbitIndex) => playSound(orbitIndex)
  });

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = select(svgRef.current);
    svg.selectAll('*').remove();

    // Add definitions for gradients and filters
    const defs = svg.append('defs');

    // Create glow filter
    const filter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');

    filter.append('feGaussianBlur')
      .attr('stdDeviation', '2')
      .attr('result', 'coloredBlur');

    // Setup SVG
    const width = 400;
    const height = 400;
    const centerX = width / 2;
    const centerY = height / 2;
    const baseRadius = (width * 0.35) * scale;

    // Draw orbital paths based on number of orbits
    const orbits = type === 'single' || type === 'single-timer' ? 1 : numOrbits;

    for (let i = 0; i < orbits; i++) {
      const radius = baseRadius * ((i + 1) / orbits);
      const isEven = i % 2 === 0;
      const color = isEven ? 'blue' : 'purple';

      // Create gradient for orbit path
      const gradientId = `orbitGradient${i}`;
      const gradient = defs.append('linearGradient')
        .attr('id', gradientId)
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '0%');

      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', `${color}-500`)
        .attr('stop-opacity', 0.2);

      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', `${color}-300`)
        .attr('stop-opacity', 0.4);

      // Draw orbit path with dash pattern
      svg.append('circle')
        .attr('cx', centerX)
        .attr('cy', centerY)
        .attr('r', radius)
        .attr('stroke', `url(#${gradientId})`)
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '4,4')
        .attr('fill', 'none')
        .attr('class', `orbit-path-${i}`);
    }

    startAnimation();
    return () => stopAnimation();
  }, [type, numOrbits, scale, periods]);

  return (
    <svg
      ref={svgRef}
      className="w-full h-full"
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid meet"
    />
  );
}