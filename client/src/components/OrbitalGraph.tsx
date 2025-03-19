import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface OrbitalGraphProps {
  period: number;
  numPeriods: number;
  isRunning?: boolean;
}

export default function OrbitalGraph({ period, numPeriods, isRunning = true }: OrbitalGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const frameRef = useRef<number>();
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 200;
    const height = 60;
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3.scaleLinear()
      .domain([0, numPeriods * 2 * Math.PI])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([-1, 1])
      .range([innerHeight, 0]);

    // Generate sine wave data
    const line = d3.line<[number, number]>()
      .x(d => xScale(d[0]))
      .y(d => yScale(d[1]));

    const points = d3.range(0, numPeriods * 2 * Math.PI + 0.1, 0.1).map(x => [x, Math.sin(x)]);

    // Draw the sine wave
    svg.append("path")
      .datum(points)
      .attr("fill", "none")
      .attr("stroke", "rgba(255, 255, 255, 0.2)")
      .attr("stroke-width", 1)
      .attr("d", line);

    // Create the moving dot
    const dot = svg.append("circle")
      .attr("r", 3)
      .attr("fill", "#FFD700");

    // Animation function
    function animate(timestamp: number) {
      if (!isRunning) return;
      
      if (startTimeRef.current === 0) {
        startTimeRef.current = timestamp;
      }

      const elapsed = (timestamp - startTimeRef.current) / 1000;
      const x = (elapsed / period) * 2 * Math.PI % (numPeriods * 2 * Math.PI);
      const y = Math.sin(x);

      dot
        .attr("cx", xScale(x))
        .attr("cy", yScale(y));

      frameRef.current = requestAnimationFrame(animate);
    }

    if (isRunning) {
      frameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [period, numPeriods, isRunning]);

  return (
    <svg
      ref={svgRef}
      className="w-full"
      style={{ maxHeight: '60px' }}
    />
  );
}
