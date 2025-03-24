import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useTime } from '@/contexts/TimeContext';
import { useSettings } from "@/contexts/SettingsContext";

interface OrbitalGraphProps {
  period: number;
  numPeriods: number;
  isRunning?: boolean;
  color?: string;
}

export default function OrbitalGraph({
  period,
  numPeriods,
  isRunning = true,
  color = '#E0F7FA',
}: OrbitalGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const frameRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const { elapsedTime, isRunning: globalIsRunning } = useTime();
  const { colorMode } = useSettings();

  useEffect(() => {
    if (!svgRef.current || !isRunning) return;

    const width = 300; // Increased overall width to accommodate larger margin
    const height = 60;
    const margin = { top: 10, right: 10, bottom: 10, left: 120 }; // Increased left margin for orbit
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3
      .scaleLinear()
      .domain([0, numPeriods * 2 * Math.PI])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear().domain([-1, 1]).range([innerHeight, 0]);

    // Create gradients and filters
    const defs = svg.append("defs");

    // Add arrow markers for the double-headed arrow
    defs
      .append("marker")
      .attr("id", `arrow-left-${period}`)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 0)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M 10,-5 L 0,0 L 10,5")
      .attr("fill", "rgba(255, 255, 255, 0.5)");

    defs
      .append("marker")
      .attr("id", `arrow-right-${period}`)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 10)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M 0,-5 L 10,0 L 0,5")
      .attr("fill", "rgba(255, 255, 255, 0.5)");

    // SECTION 1: Ball gradient
    // Ball gradient
    const ballGradient = defs
      .append("radialGradient")
      .attr("id", `ballGradient-${period}`)
      .attr("gradientUnits", "objectBoundingBox")
      .attr("cx", "0.5")
      .attr("cy", "0.5")
      .attr("r", "0.6");

    ballGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", color)
      .attr("stop-opacity", "1");

    ballGradient
      .append("stop")
      .attr("offset", "60%")
      .attr("stop-color", color)
      .attr("stop-opacity", "0.9");

    ballGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", color)
      .attr("stop-opacity", "0.3");

    // END SECTION 1

    // Create a small orbit visualization on the left
    const orbitRadius = 12;
    const orbitCenterX = -80; // Moved further left
    const orbitCenterY = innerHeight / 2;

    // Draw orbit path
    svg
      .append("circle")
      .attr("cx", orbitCenterX)
      .attr("cy", orbitCenterY)
      .attr("r", orbitRadius)
      .attr("stroke", "rgba(255, 255, 255, 0.3)")
      .attr("stroke-width", 0.6)
      .attr("stroke-dasharray", "2,2")
      .attr("fill", "none");

    svg
      .append("line")
      .attr("x1", orbitCenterX)
      .attr("y1", orbitCenterY - orbitRadius - 5)
      .attr("x2", orbitCenterX)
      .attr("y2", orbitCenterY - orbitRadius + 5) // Length of the vertical line
      .attr("stroke", "#ff8c00") // Color of the line
      .attr("stroke-width", 0.6); // Width of the line

    // Draw double-headed arrow
    svg
      .append("line")
      .attr("x1", orbitCenterX + orbitRadius + 5)
      .attr("y1", orbitCenterY)
      .attr("x2", -10) // Stop before the graph starts
      .attr("y2", orbitCenterY)
      .attr("stroke", "rgba(255, 255, 255, 0.5)")
      .attr("stroke-width", 1)
      .attr("marker-start", `url(#arrow-left-${period})`)
      .attr("marker-end", `url(#arrow-right-${period})`);

    // Create orbit ball group
    const orbitBall = svg.append("g").attr("class", "orbit-ball");

    // Add the core glow
    orbitBall
      .append("circle")
      .attr("r", 4)
      .attr("fill", `url(#ballGradient-${period})`)

    // Generate sine wave data
    const wavePoints: [number, number][] = Array.from({ length: 100 }, (_, i) => {
      const x = (i / 99) * numPeriods * 2 * Math.PI;
      return [x, Math.cos(x)];
    });

    // Create line generator
    const line = d3
      .line<[number, number]>()
      .x((d) => xScale(d[0]))
      .y((d) => yScale(d[1]));

    // Draw the sine wave path with a gradient
    const waveGradient = defs
      .append("linearGradient")
      .attr("id", `cosineGradient-${period}`)
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");

    waveGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", color)
      .attr("stop-opacity", 0.4);

    waveGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", color)
      .attr("stop-opacity", 0.1);

    // Draw the sine wave
    svg
      .append("path")
      .datum(wavePoints)
      .attr("fill", "none")
      .attr("stroke", `url(#cosineGradient-${period})`)
      .attr("stroke-width", 1)
      .attr("d", line);

    // Draw vertical lines for each period
    for (let i = 0; i <= numPeriods; i++) {
      const x = xScale(i * 2 * Math.PI);
      svg
        .append("line")
        .attr("x1", x)
        .attr("y1", -innerHeight / 4)
        .attr("x2", x)
        .attr("y2", innerHeight / 4)
        .attr("stroke", "rgba(255, 255, 255, 0.2)")
        .attr("stroke-width", 1);
      
      // Add a line to indicate the period
      if (i === 1) {
        svg
          .append("line")
          .attr("x1", 0)
          .attr("y1", -innerHeight / 4)
          .attr("x2", x)
          .attr("y2", -innerHeight / 4)
          .attr("stroke", "rgba(255, 255, 255, 0.2)")
          .attr("stroke-width", 1);

        // Add a label for the period T
        svg
          .append("text")
          .attr("x", x/2)
          .attr("y", 2.0 ) // Adjust position above the line
          .attr("fill", "rgba(255, 255, 255, 0.8)")
          .attr("font-size", "12px")
          .attr("text-anchor", "middle")
          .text("T");
      }
    }

    // Create the moving dot on the wave (matching orbit ball style)
    const waveBall = svg.append("g").attr("class", "wave-ball");

    // Add core glow (same as orbit ball)
    waveBall
      .append("circle")
      .attr("r", 4)
      .attr("fill", `url(#ballGradient-${period})`)

    // Animation function
    const x = (elapsedTime * (2 * Math.PI) / period) % (numPeriods * 2 * Math.PI);
    const y = Math.cos(x);
    
    // Update positions directly
    waveBall.attr("transform", `translate(${xScale(x)},${yScale(y)})`);
    const angle = -Math.PI / 2 + (elapsedTime * (2 * Math.PI) / period);
    const orbitX = orbitCenterX + Math.cos(angle) * orbitRadius;
    const orbitY = orbitCenterY + Math.sin(angle) * orbitRadius;
    orbitBall.attr("transform", `translate(${orbitX},${orbitY})`);
  }, [elapsedTime, isRunning]);

  return <svg ref={svgRef} className="w-full" style={{ maxHeight: "60px" }} />;
}
