import { useEffect, useRef } from "react";
import { select } from "d3-selection";
import { useOrbitalAnimation } from "@/hooks/useOrbitalAnimation";
import { BALL_GRADIENTS, BALL_FILTERS } from "@/config/orbitConfig";

interface OrbitProps {
  type: string;
  numOrbits?: number;
  scale?: number;
  periods?: number[];
  onTopReached?: (orbitIndex: number) => void;
}

export default function Orbits({
  type,
  numOrbits = 2,
  scale = 1,
  periods: customPeriods,
  onTopReached,
}: OrbitProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  // Set demonstration periods based on type
  let periods = customPeriods;
  if (!periods) {
    switch (type) {
      case "single":
        numOrbits = 1;
        periods = [1];
        break;
      case "double":
        numOrbits = 2;
        periods = [1, 2];
        break;
      case "multi":
        numOrbits = 3;
        periods = [1, 2, 3];
        break;
      default:
        periods = Array(numOrbits)
          .fill(0)
          .map((_, i) => 1 + i * 0.2);
    }
  }

  const { startAnimation, stopAnimation } = useOrbitalAnimation({
    svgRef,
    type,
    numOrbits,
    scale,
    periods,
    onTopReached,
  });

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = select(svgRef.current);
    svg.selectAll("*").remove();

    // Add definitions for gradients and filters
    const defs = svg.append("defs");

    // Setup SVG
    const width = 400;
    const height = 400;
    const centerX = width / 2;
    const centerY = height / 2;
    const baseRadius = width * 0.35 * scale;

    // Draw orbital paths based on number of orbits
    const orbits = type === "single" || type === "single-timer" ? 1 : numOrbits;

    for (let i = 0; i < orbits; i++) {
      const radius = baseRadius * ((i + 1) / orbits);

      // Create gradient for orbit path
      const gradientId = `orbitGradient${i}`;
      const gradient = defs
        .append("linearGradient")
        .attr("id", gradientId)
        .attr("gradientUnits", "userSpaceOnUse");

      gradient
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "rgba(255, 255, 255, 0.6)");

      gradient
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "rgba(255, 255, 255, 0.2)");

      // Create radial gradient for the neon star effect
      BALL_GRADIENTS.default.create(defs, i);

      const filterGlow = defs
        .append("filter")
        .attr("id", `simple-glow-${i}`)
        .attr("x", "-50%")
        .attr("y", "-50%")
        .attr("width", "200%")
        .attr("height", "200%");

      filterGlow
        .append("feGaussianBlur")
        .attr("in", "SourceAlpha")
        .attr("stdDeviation", "2") // Reduced blur for a simpler glow
        .attr("result", "blur");

      filterGlow
        .append("feFlood")
        .attr("flood-color", "rgba(255, 255, 255, 0.5)") // White glow
        .attr("result", "color");

      filterGlow
        .append("feComposite")
        .attr("in2", "blur")
        .attr("operator", "in")
        .attr("result", "coloredBlur");

      filterGlow
        .append("feMerge")
        .selectAll("feMergeNode")
        .data(["coloredBlur", "SourceGraphic"])
        .enter()
        .append("feMergeNode")
        .attr("in", (d) => d);

      // Draw orbit path with dash pattern
      svg
        .append("circle")
        .attr("cx", centerX)
        .attr("cy", centerY)
        .attr("r", radius)
        .attr("stroke", `url(#${gradientId})`)
        .attr("stroke-width", 0.6)
        .attr("stroke-dasharray", "4,4")
        .attr("fill", "none")
        .attr("class", `orbit-path-${i}`);

      svg
        .append("line")
        .attr("x1", centerX)
        .attr("y1", centerY - radius - 5)
        .attr("x2", centerX)
        .attr("y2", centerY - radius + 5) // Length of the vertical line
        .attr("stroke", "#ff8c00") // Color of the line
        .attr("stroke-width", 0.6); // Width of the line
    }

    // Add gradients and filters using config
    for (let i = 0; i < orbits; i++) {
      BALL_FILTERS.simpleGlow.create(defs, i);
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
