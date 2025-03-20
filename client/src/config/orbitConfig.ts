export const BALL_GRADIENTS = {
  default: {
    id: (index: number, colorScheme: 'single' | 'variable') => `ballGradient-${index}-${colorScheme}`,
    create: (defs: any, index: number, colorScheme: 'single' | 'variable') => {
      const colors = colorScheme === 'single' 
        ? { primary: '#4f46e5', secondary: '#6366f1', tertiary: '#818cf8' }
        : BALL_COLORS[index % BALL_COLORS.length];

      return defs.append('radialGradient')
        .attr('id', BALL_GRADIENTS.default.id(index, colorScheme))
        .attr('gradientUnits', 'userSpaceOnUse')
        .call((g: any) => {
          if (colorScheme === 'single') {
            g.append('stop').attr('offset', '0%').attr('stop-color', colors.primary);
            g.append('stop').attr('offset', '100%').attr('stop-color', colors.secondary);
          } else {
            g.append('stop').attr('offset', '0%').attr('stop-color', '#ffffff');
            g.append('stop').attr('offset', '40%').attr('stop-color', BALL_COLORS[index % BALL_COLORS.length].primary);
            g.append('stop').attr('offset', '60%').attr('stop-color', colors.secondary);
            g.append('stop').attr('offset', '85%').attr('stop-color', colors.secondary)
              .attr('stop-opacity', '0.6');
            g.append('stop').attr('offset', '100%').attr('stop-color', colors.tertiary)
              .attr('stop-opacity', '0.1');
          }
        });
    }
  }
};

export const BALL_FILTERS = {
  simpleGlow: {
    id: (index: number, colorScheme: 'single' | 'variable') => `simple-glow-${index}-${colorScheme}`,
    create: (defs: any, index: number, colorScheme: 'single' | 'variable') => {
      const glowColor = colorScheme === 'single' 
        ? '#4f46e5' 
        : BALL_COLORS[index % BALL_COLORS.length].primary;

      return defs.append('filter')
        .attr('id', BALL_FILTERS.simpleGlow.id(index, colorScheme))
        .call((f: d3.Selection<SVGFilterElement, unknown, null, undefined>) => {
          f.append('feGaussianBlur')
            .attr('stdDeviation', '2')
            .attr('result', 'coloredBlur');

          f.append('feFlood')
            .attr('flood-color', glowColor)
            .attr('flood-opacity', '0.8')
            .attr('result', 'color');

          const feMerge = f.append('feMerge');
          feMerge.append('feMergeNode').attr('in', 'coloredBlur');
          feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
        });
    }
  }
};

export const BALL_SIZES = {
  base: 10,
  highlight: 6,
  highlightOffset: -1
};

export const BALL_COLORS = [
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
