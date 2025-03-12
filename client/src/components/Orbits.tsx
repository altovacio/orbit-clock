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

    // Create enhanced glow filter
    const filter = defs.append('filter')
      .attr('id', 'neon-glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');

    // Create a more intense glow effect
    filter.append('feGaussianBlur')
      .attr('in', 'SourceGraphic')
      .attr('stdDeviation', '3')
      .attr('result', 'blur1');

    filter.append('feGaussianBlur')
      .attr('in', 'SourceGraphic')
      .attr('stdDeviation', '6')
      .attr('result', 'blur2');

    filter.append('feMerge')
      .selectAll('feMergeNode')
      .data(['blur1', 'blur2', 'SourceGraphic'])
      .enter()
      .append('feMergeNode')
      .attr('in', d => d);

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
      const baseColor = isEven ? 'rgb(59, 130, 246)' : 'rgb(168, 85, 247)';

      // Create gradient for orbit path
      const gradientId = `orbitGradient${i}`;
      const gradient = defs.append('linearGradient')
        .attr('id', gradientId)
        .attr('gradientUnits', 'userSpaceOnUse');

      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', 'rgba(255, 255, 255, 0.6)');

      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', 'rgba(255, 255, 255, 0.2)');

      // Create radial gradient for the neon ball effect
      const ballGradientId = `ballGradient${i}`;
      const ballGradient = defs.append('radialGradient')
        .attr('id', ballGradientId)
        .attr('gradientUnits', 'objectBoundingBox')
        .attr('cx', '0.5')
        .attr('cy', '0.5')
        .attr('r', '0.5');

      ballGradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', 'white');

      ballGradient.append('stop')
        .attr('offset', '50%')
        .attr('stop-color', baseColor);

      ballGradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', baseColor)
        .attr('stop-opacity', '0.3');

      // Draw orbit path with dash pattern
      svg.append('circle')
        .attr('cx', centerX)
        .attr('cy', centerY)
        .attr('r', radius)
        .attr('stroke', `url(#${gradientId})`)
        .attr('stroke-width', 1.5)
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