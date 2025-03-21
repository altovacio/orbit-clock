import { useEffect, useRef, useMemo } from "react";
import { select } from "d3-selection";
import { useOrbitalAnimation } from "@/hooks/useOrbitalAnimation";
import { BALL_GRADIENTS, BALL_FILTERS, BALL_SIZES, BALL_COLORS } from "@/config/orbitConfig";
import { useSettings } from "@/contexts/SettingsContext";
import { CELESTIAL_YELLOW } from "@/config/orbitConfig";

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
  const { colorScheme, starSize, colorMode } = useSettings();

  // Memoize periods calculation
  const periods = useMemo(() => {
    if (customPeriods) return customPeriods;
    // Existing period calculation logic...
    switch (type) {
      case "single":
        numOrbits = 1;
        return [1000];
      case "double":
        numOrbits = 2;
        return [1000, 2000];
      case "multi":
        numOrbits = 3;
        return [1000, 2000, 3000];
      default:
        return Array(numOrbits)
          .fill(0)
          .map((_, i) => 1 + i * 0.2);
    }
  }, [type, numOrbits, customPeriods]);

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

    const defs = svg.append("defs");

    // Create gradients and filters using config
    for (let i = 0; i < numOrbits; i++) {
      BALL_GRADIENTS.default.create(defs, i, colorScheme, colorMode);
      BALL_FILTERS.glow.create(defs, i, colorScheme, colorMode);
    }

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

      // Create orbit gradient
      const orbitGradient = defs
        .append("linearGradient")
        .attr("id", `orbitGradient-${i}`)
        .attr("gradientUnits", "userSpaceOnUse");

      orbitGradient
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "rgba(255, 255, 255, 0.4)");

      orbitGradient
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "rgba(255, 255, 255, 0.1)");
      // Draw orbit path with dash pattern
      svg
        .append("circle")
        .attr("cx", centerX)
        .attr("cy", centerY)
        .attr("r", radius)
        .attr("stroke", `url(#orbitGradient-${i})`)
        .attr("stroke-width", 0.6)
        .attr("stroke-dasharray", "4,4")
        .attr("fill", "none")
        .attr("class", `orbit-path-${i}`);

      // Vertical line color using config
      const lineColor = colorMode === 'monochrome' 
        ? CELESTIAL_YELLOW.primary
        : (colorScheme === 'highQuality' 
          ? BALL_COLORS(colorMode)[i % BALL_COLORS(colorMode).length].primary
          : '#ff8c00');

      svg.append("line")
        .attr("x1", centerX)
        .attr("y1", centerY - radius - 5)
        .attr("x2", centerX)
        .attr("y2", centerY - radius + 5)
        .attr("stroke", lineColor)
        .attr("stroke-width", 0.6);
    }

    // Start the animation
    startAnimation();
    
    return () => {
      // Clear all SVG elements and stop animation
      if (svgRef.current) {
        select(svgRef.current).selectAll("*").remove();
      }
      stopAnimation();
    };
  }, [type, numOrbits, scale, periods, colorScheme, starSize, startAnimation, stopAnimation]);

  return (
    <svg
      ref={svgRef}
      className="w-full h-full"
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid meet"
    />
  );
}
