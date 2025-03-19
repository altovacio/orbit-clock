import { useEffect } from 'react';
import { select } from 'd3-selection';

interface StarProps {
  svgRef: React.RefObject<SVGSVGElement>;
  groupRef: React.RefObject<SVGGElement>;
  starId: string;
  radius?: number;
  highlightRadius?: number;
}

export function Star({ svgRef, groupRef, starId, radius = 4, highlightRadius = 2 }: StarProps) {
  useEffect(() => {
    if (!svgRef.current || !groupRef.current) return;

    const svg = select(svgRef.current);
    const group = select(groupRef.current);
    const defs = svg.select('defs');

    // Star gradient
    const starGradient = defs
      .append('radialGradient')
      .attr('id', `starGradient-${starId}`)
      .attr('gradientUnits', 'objectBoundingBox')
      .attr('cx', '0.5')
      .attr('cy', '0.5')
      .attr('r', '0.6');

    // White hot core
    starGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#ffffff');

    // Expanded white area
    starGradient
      .append('stop')
      .attr('offset', '40%')
      .attr('stop-color', '#ffffff');

    // Yellow-orange transition
    starGradient
      .append('stop')
      .attr('offset', '60%')
      .attr('stop-color', '#ffd700');

    // Orange glow
    starGradient
      .append('stop')
      .attr('offset', '85%')
      .attr('stop-color', '#ff8c00')
      .attr('stop-opacity', '0.6');

    // Soft outer glow
    starGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#ff8c00')
      .attr('stop-opacity', '0.1');

    // Glow filter
    const glowFilter = defs
      .append('filter')
      .attr('id', `glow-${starId}`)
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');

    glowFilter
      .append('feGaussianBlur')
      .attr('stdDeviation', '2')
      .attr('result', 'coloredBlur');

    const feMerge = glowFilter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Add the core glow
    group
      .append('circle')
      .attr('r', radius)
      .attr('fill', `url(#starGradient-${starId})`)
      .attr('filter', `url(#glow-${starId})`);

    // Add the highlight
    group
      .append('circle')
      .attr('r', highlightRadius)
      .attr('cx', -0.5)
      .attr('cy', -0.5)
      .attr('fill', 'rgba(255, 255, 255, 0.9)');

    return () => {
      // Cleanup
      svg.select(`#starGradient-${starId}`).remove();
      svg.select(`#glow-${starId}`).remove();
      group.selectAll('*').remove();
    };
  }, [svgRef, groupRef, starId, radius, highlightRadius]);

  return null;
}