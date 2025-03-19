import { useEffect, useRef } from "react";
import { select } from "d3-selection";
import { useOrbitalAnimation } from "@/hooks/useOrbitalAnimation";
import OrbitalBall from "./OrbitalBall";
import ReactDOMServer from "react-dom/server";

interface OrbitProps {
  type: string;
  numOrbits?: number;
  scale?: number;
  periods?: number[];
  onTopReached?: (orbitIndex: number) => void;
}

// Helper function to create SVG element from React component
function createSVGNode(component: JSX.Element): SVGGElement {
  const markup = ReactDOMServer.renderToStaticMarkup(component);
  const template = document.createElement('template');
  template.innerHTML = markup.trim();
  return template.content.firstChild as SVGGElement;
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
      const defs = svg.append("defs");
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

      // Add top marker line
      svg
        .append("line")
        .attr("x1", centerX)
        .attr("y1", centerY - radius - 2.5)
        .attr("x2", centerX)
        .attr("y2", centerY - radius + 2.5)
        .attr("stroke", "#ff8c00")
        .attr("stroke-width", 0.6);

      // Create orbital ball group
      const orbitGroup = svg
        .append("g")
        .attr("class", `orbit${i + 1}`)
        .attr("transform", `translate(${centerX},${centerY - radius})`)
        .node();

      if (orbitGroup) {
        orbitGroup.appendChild(createSVGNode(<OrbitalBall radius={7} highlightRadius={4} />));
      }
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