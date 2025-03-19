import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Star } from "./Star";

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

    const width = 300; 
    const height = 60;
    const margin = { top: 10, right: 10, bottom: 10, left: 120 }; 
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    
    const defs = svg.append("defs");

    
    defs.append("marker")
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

    defs.append("marker")
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

    
    const xScale = d3
      .scaleLinear()
      .domain([0, numPeriods * 2 * Math.PI])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear().domain([-1, 1]).range([innerHeight, 0]);

    
    const orbitRadius = 12;
    const orbitCenterX = -80;
    const orbitCenterY = innerHeight/2;

    
    svg
      .append("circle")
      .attr("cx", orbitCenterX)
      .attr("cy", orbitCenterY)
      .attr("r", orbitRadius)
      .attr("stroke", "rgba(255, 255, 255, 0.3)")
      .attr("stroke-width", 0.6)
      .attr("stroke-dasharray", "2,2")
      .attr("fill", "none");

    
    svg.append("line")
      .attr("x1", orbitCenterX + orbitRadius + 5)
      .attr("y1", orbitCenterY)
      .attr("x2", -10) 
      .attr("y2", orbitCenterY)
      .attr("stroke", "rgba(255, 255, 255, 0.5)")
      .attr("stroke-width", 1)
      .attr("marker-start", `url(#arrow-left-${period})`)
      .attr("marker-end", `url(#arrow-right-${period})`);

    
    const orbitStar = svg
      .append("g")
      .attr("class", "orbit-star");

    
    const orbitStarId = `orbit-${period}`;
    const waveStarId = `wave-${period}`;

    
    const wavePoints = Array.from({ length: 100 }, (_, i) => {
      const x = (i / 99) * numPeriods * 2 * Math.PI;
      return [x, Math.cos(x)];
    });

    
    const line = d3
      .line<[number, number]>()
      .x(d => xScale(d[0]))
      .y(d => yScale(d[1]));

    
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

    
    svg
      .append("path")
      .datum(wavePoints)
      .attr("fill", "none")
      .attr("stroke", `url(#cosineGradient-${period})`)
      .attr("stroke-width", 1)
      .attr("d", line);

    
    const waveStar = svg
      .append("g")
      .attr("class", "wave-star");

    
    function animate(timestamp: number) {
      if (!isRunning) return;

      if (startTimeRef.current === 0) {
        startTimeRef.current = timestamp;
      }

      const elapsed = (timestamp - startTimeRef.current) / 1000;
      const x = ((elapsed / period) * 2 * Math.PI) % (numPeriods * 2 * Math.PI);
      const y = Math.cos(x);

      
      waveStar.attr("transform", `translate(${xScale(x)},${yScale(y)})`);

      
      const angle = -Math.PI/2 + (elapsed * 2 * Math.PI / period);
      const orbitX = orbitCenterX + Math.cos(angle) * orbitRadius;
      const orbitY = orbitCenterY + Math.sin(angle) * orbitRadius;
      orbitStar.attr("transform", `translate(${orbitX},${orbitY})`);

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

  return (
    <svg ref={svgRef} className="w-full" style={{ maxHeight: "60px" }}>
      <defs />
      <Star svgRef={svgRef} starId={`orbit-${period}`} radius={4} highlightRadius={2} />
      <Star svgRef={svgRef} starId={`wave-${period}`} radius={3} highlightRadius={1.5} />
    </svg>
  );
}