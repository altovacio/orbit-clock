import { useEffect, useRef } from 'react';
import { select } from 'd3-selection';
import { useOrbitalAnimation } from '@/hooks/useOrbitalAnimation';
import { useAudioContext } from '@/hooks/useAudioContext';

interface OrbitProps {
  type: string;
}

export default function Orbits({ type }: OrbitProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { playAlignmentSound } = useAudioContext();
  
  const { startAnimation, stopAnimation } = useOrbitalAnimation({
    svgRef,
    type,
    onAlignment: playAlignmentSound
  });

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = select(svgRef.current);
    svg.selectAll('*').remove();

    // Setup SVG
    const width = svg.node()?.getBoundingClientRect().width || 400;
    const height = width;
    const centerX = width / 2;
    const centerY = height / 2;

    // Draw orbital paths
    if (type === 'single' || type === 'single-timer') {
      svg.append('circle')
        .attr('cx', centerX)
        .attr('cy', centerY)
        .attr('r', width * 0.3)
        .attr('class', 'stroke-blue-500/30 fill-none');
    } else if (type === 'double' || type === 'crossing' || type === 'alignment') {
      svg.append('circle')
        .attr('cx', centerX)
        .attr('cy', centerY)
        .attr('r', width * 0.2)
        .attr('class', 'stroke-blue-500/30 fill-none');

      svg.append('circle')
        .attr('cx', centerX)
        .attr('cy', centerY)
        .attr('r', width * 0.4)
        .attr('class', 'stroke-purple-500/30 fill-none');
    }

    startAnimation();
    return () => stopAnimation();
  }, [type]);

  return (
    <svg
      ref={svgRef}
      className="w-full h-full"
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid meet"
    />
  );
}
