import { useEffect, useRef } from 'react';
import { select } from 'd3-selection';
import { useOrbitalAnimation } from '@/hooks/useOrbitalAnimation';
import { useAudioContext } from '@/hooks/useAudioContext';

interface OrbitProps {
  type: string;
  numOrbits?: number;
  scale?: number;
}

export default function Orbits({ type, numOrbits = 2, scale = 1 }: OrbitProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { playSound } = useAudioContext();

  const { startAnimation, stopAnimation } = useOrbitalAnimation({
    svgRef,
    type,
    numOrbits,
    scale,
    onTopReached: playSound
  });

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = select(svgRef.current);
    svg.selectAll('*').remove();

    // Setup SVG
    const width = 400;
    const height = 400;
    const centerX = width / 2;
    const centerY = height / 2;
    const baseRadius = (width * 0.35) * scale; // Adjusted base radius

    // Draw orbital paths based on number of orbits
    const orbits = type === 'single' || type === 'single-timer' ? 1 : numOrbits;

    for (let i = 0; i < orbits; i++) {
      const radius = baseRadius * ((i + 1) / orbits);
      svg.append('circle')
        .attr('cx', centerX)
        .attr('cy', centerY)
        .attr('r', radius)
        .attr('class', `stroke-[${i % 2 ? 'purple' : 'blue'}]-500/30 fill-none`);
    }

    startAnimation();
    return () => stopAnimation();
  }, [type, numOrbits, scale]);

  return (
    <svg
      ref={svgRef}
      className="w-full h-full"
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid meet"
    />
  );
}