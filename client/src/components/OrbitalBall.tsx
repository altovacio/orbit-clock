import { useId } from 'react';

interface OrbitalBallProps {
  radius?: number;
  highlightRadius?: number;
}

export default function OrbitalBall({ 
  radius = 7,
  highlightRadius = 4
}: OrbitalBallProps) {
  // Generate unique IDs for gradient and filter
  const id = useId().replace(/:/g, '');
  const ballGradientId = `ballGradient-${id}`;
  const glowFilterId = `neon-glow-${id}`;

  return (
    <g>
      <defs>
        {/* Ball gradient */}
        <radialGradient
          id={ballGradientId}
          gradientUnits="objectBoundingBox"
          cx="0.5"
          cy="0.5"
          r="0.6"
        >
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#ffd700" />
          <stop offset="85%" stopColor="#ff8c00" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ff8c00" stopOpacity="0.1" />
        </radialGradient>

        {/* Glow filter */}
        <filter
          id={glowFilterId}
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feGaussianBlur
            in="SourceAlpha"
            stdDeviation="2"
            result="blur"
          />
          <feFlood
            floodColor="rgba(255, 255, 255, 0.5)"
            result="color"
          />
          <feComposite
            in2="blur"
            operator="in"
            result="coloredBlur"
          />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Core glow */}
      <circle
        className="ball-core"
        r={radius}
        fill={`url(#${ballGradientId})`}
        filter={`url(#${glowFilterId})`}
      />

      {/* Center highlight */}
      <circle
        className="ball-highlight"
        r={highlightRadius}
        cx={-1}
        cy={-1}
        fill="rgba(255, 255, 255, 0.9)"
      />
    </g>
  );
}
