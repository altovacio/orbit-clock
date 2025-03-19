import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface OrbitalGraphProps {
  period: number;
  numPeriods: number;
  isRunning?: boolean;
}

export default function OrbitalGraph({
  period,
  numPeriods,
  isRunning = true,
}: OrbitalGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const frameRef = useRef<number>();
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 200;
    const height = 60;
    const margin = { top: 10, right: 50, bottom: 10, left: 10 }; // Increased right margin for orbit
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
      .attr("stop-color", "#ffffff");

    ballGradient
      .append("stop")
      .attr("offset", "40%")
      .attr("stop-color", "#ffffff");

    ballGradient
      .append("stop")
      .attr("offset", "60%")
      .attr("stop-color", "#ffd700");

    ballGradient
      .append("stop")
      .attr("offset", "85%")
      .attr("stop-color", "#ff8c00")
      .attr("stop-opacity", "0.6");

    ballGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#ff8c00")
      .attr("stop-opacity", "0.1");

    // Glow filter
    const glowFilter = defs
      .append("filter")
      .attr("id", `glow-${period}`)
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");

    glowFilter
      .append("feGaussianBlur")
      .attr("stdDeviation", "2")
      .attr("result", "coloredBlur");

    const feMerge = glowFilter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Generate sine wave data
    const wavePoints = Array.from({ length: 100 }, (_, i) => {
      const x = (i / 99) * numPeriods * 2 * Math.PI;
      return [x, Math.cos(x)];
    });

    // Create line generator
    const line = d3
      .line<[number, number]>()
      .x(d => xScale(d[0]))
      .y(d => yScale(d[1]));

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
      .attr("stop-color", "rgba(255, 255, 255, 0.4)");

    waveGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "rgba(255, 255, 255, 0.1)");

    // Draw the sine wave
    svg
      .append("path")
      .datum(wavePoints)
      .attr("fill", "none")
      .attr("stroke", `url(#cosineGradient-${period})`)
      .attr("stroke-width", 1)
      .attr("d", line);

    // Create a small orbit visualization on the right
    const orbitRadius = 12;
    const orbitCenterX = innerWidth + margin.right/2;
    const orbitCenterY = innerHeight/2;

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

    // Create orbit ball group
    const orbitBall = svg
      .append("g")
      .attr("class", "orbit-ball");

    // Add the core glow
    orbitBall
      .append("circle")
      .attr("r", 4)
      .attr("fill", `url(#ballGradient-${period})`)
      .attr("filter", `url(#glow-${period})`);

    // Add the highlight
    orbitBall
      .append("circle")
      .attr("r", 2)
      .attr("cx", -0.5)
      .attr("cy", -0.5)
      .attr("fill", "rgba(255, 255, 255, 0.9)");

    // Create the moving dot on the wave
    const dot = svg
      .append("circle")
      .attr("r", 3)
      .attr("fill", "#FFD700")
      .attr("filter", `url(#glow-${period})`);

    // Animation function
    function animate(timestamp: number) {
      if (!isRunning) return;

      if (startTimeRef.current === 0) {
        startTimeRef.current = timestamp;
      }

      const elapsed = (timestamp - startTimeRef.current) / 1000;
      const x = ((elapsed / period) * 2 * Math.PI) % (numPeriods * 2 * Math.PI);
      const y = Math.cos(x);

      // Update wave dot
      dot.attr("cx", xScale(x)).attr("cy", yScale(y));

      // Update orbit ball position
      const angle = -Math.PI/2 + (elapsed * 2 * Math.PI / period);
      const orbitX = orbitCenterX + Math.cos(angle) * orbitRadius;
      const orbitY = orbitCenterY + Math.sin(angle) * orbitRadius;
      orbitBall.attr("transform", `translate(${orbitX},${orbitY})`);

      frameRef.current = requestAnimationFrame(animate);
    }

    if (isRunning) {
      startTimeRef.current = 0;
      frameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [period, numPeriods, isRunning]);

  return <svg ref={svgRef} className="w-full" style={{ maxHeight: "60px" }} />;
}