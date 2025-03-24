export const BALL_GRADIENTS = {
  default: {
    id: (index: number, colorScheme: 'highQuality' | 'lowQuality') => `ballGradient-${index}-${colorScheme}`,
    create: (defs: d3.Selection<SVGDefsElement, unknown, null, undefined>, index: number, colorScheme: 'highQuality' | 'lowQuality', colorMode: 'monochrome' | 'multicolor') => {
      const colors = colorMode === 'monochrome' 
        ? STAR_COLOR
        : BALL_COLORS(colorMode)[index % 12];
      
      if (colorScheme === 'lowQuality') {
        return defs.append('radialGradient')
          .attr('id', BALL_GRADIENTS.default.id(index, colorScheme))
          .call((g) => {
            g.append('stop').attr('offset', '0%').attr('stop-color', colors.primary);
            g.append('stop').attr('offset', '100%').attr('stop-color', colors.primary);
          });
      }

      // Updated gradient with solid white core
      return defs.append('radialGradient')
        .attr('id', BALL_GRADIENTS.default.id(index, colorScheme))
        .attr('gradientUnits', 'userSpaceOnUse')
        .call((g) => {
          // Solid white core with no transparency
          g.append('stop').attr('offset', '0%').attr('stop-color', '#FFFFFF');
          g.append('stop').attr('offset', '40%').attr('stop-color', '#FFFFFF');
          
          // Sharp transition to colored corona
          g.append('stop').attr('offset', '40%')
            .attr('stop-color', colors.primary)
          
          g.append('stop').attr('offset', '100%')
            .attr('stop-color', colors.secondary)
            .attr('stop-opacity', '0.8');
        });
    }
  }
};

export const BALL_FILTERS = {
  glow: {
    id: (index: number, colorScheme: 'highQuality' | 'lowQuality') => `ball-glow-${index}-${colorScheme}`,
    create: (defs: d3.Selection<SVGDefsElement, unknown, null, undefined>, index: number, colorScheme: 'highQuality' | 'lowQuality', colorMode: 'monochrome' | 'multicolor') => {
      if (colorScheme === 'lowQuality') return null;
      
      const color = colorMode === 'monochrome' 
        ? STAR_COLOR.primary 
        : BALL_COLORS(colorMode)[index % 12].primary;

      return defs.append('filter')
        .attr('id', BALL_FILTERS.glow.id(index, colorScheme))
        .attr('x', '-30%')
        .attr('y', '-30%')
        .attr('width', '160%')
        .attr('height', '160%')
        .attr('filterUnits', 'userSpaceOnUse')
        .call((f) => {
          f.append('feGaussianBlur')
            .attr('stdDeviation', '3')
            .attr('result', 'glow');
          f.append('feMerge')
            .call((m) => {
              m.append('feMergeNode').attr('in', 'glow');
              m.append('feMergeNode').attr('in', 'SourceGraphic');
            });
        });
    }
  }
};

export const BALL_SIZES = {
  base: 6,
  highlight: 4,  
  coreOpacity: 1,
  glowIntensity: 0.8
};

export const STAR_COLOR = {
  primary: '#E0F7FA',  // Light Cyan
  secondary: '#B2EBF2', // Light Blue
  tertiary: '#80DEEA'  // Cyan
};

export const BALL_COLORS = (colorMode: 'monochrome' | 'multicolor') => 
  colorMode === 'monochrome' 
    ? Array(12).fill(STAR_COLOR)
    : [
        { primary: '#f8e8ff', secondary: '#c79df2', tertiary: '#8e5de4' }, // Ethereal Lavender Star
        { primary: '#e0f7fa', secondary: '#7ddce5', tertiary: '#3aaec4' }, // Aqua Borealis Star
        { primary: '#fff8dc', secondary: '#f6d57c', tertiary: '#d1a638' }, // Golden Dawn Star
        { primary: '#fbe9e7', secondary: '#f7a8a0', tertiary: '#d46a6a' }, // Rose Nebula Star
        { primary: '#e0eafc', secondary: '#a6c1ee', tertiary: '#5d7fd3' }, // Ice Comet Star
        { primary: '#ecfdf5', secondary: '#99f6e4', tertiary: '#2dd4bf' }, // Emerald Glow Star
        { primary: '#fef9f9', secondary: '#fbb6ce', tertiary: '#f06292' }, // Celestial Blossom Star
        { primary: '#ede7f6', secondary: '#b39ddb', tertiary: '#7e57c2' }, // Amethyst Core Star
        { primary: '#fff3e0', secondary: '#ffb74d', tertiary: '#f57c00' }, // Solar Flare Star
        { primary: '#e8f5e9', secondary: '#81c784', tertiary: '#388e3c' }, // Verdant Nova Star
        { primary: '#e3f2fd', secondary: '#64b5f6', tertiary: '#1976d2' }, // Blue Giant Star
        { primary: '#fbe9f9', secondary: '#e1bee7', tertiary: '#9c27b0' }  // Violet Pulse Star
      ];

export type ScaleType = keyof typeof SCALE_PATTERNS;
export type BaseNote = keyof typeof BASE_NOTES;

export const BASE_NOTES = {
  C: 261.63,
  CSharp: 277.18,
  D: 293.66,
  DSharp: 311.13,
  E: 329.63,
  F: 349.23,
  FSharp: 369.99,
  G: 392.0,
  GSharp: 415.30,
  A: 440.0,
  ASharp: 466.16,
  B: 493.88,
} as const;

export const SCALE_PATTERNS = {
  majorPentatonic: [0, 2, 4, 7, 9],
  minorPentatonic: [0, 3, 5, 7, 10],
  major: [0, 2, 4, 5, 7, 9, 11],
  naturalMinor: [0, 2, 3, 5, 7, 8, 10],
  harmonicMinor: [0, 2, 3, 5, 7, 8, 11],
  blues: [0, 3, 5, 6, 7, 10],
  chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
} as const;

export const getBallSize = (starSize: number) => BALL_SIZES.base * starSize;
export const getHighlightSize = (starSize: number) => BALL_SIZES.highlight * starSize;
