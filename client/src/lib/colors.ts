// Define color schemes for each musical note
export const NOTE_COLORS = {
  C: {
    core: "#ffffff",
    mid: "#ff6b6b",
    glow: "#ff0844",
  },
  "C#": {
    core: "#ffffff",
    mid: "#ff9f43",
    glow: "#ff6b00",
  },
  D: {
    core: "#ffffff",
    mid: "#ffd700",
    glow: "#ff8c00",
  },
  "D#": {
    core: "#ffffff",
    mid: "#a8e6cf",
    glow: "#3ebd93",
  },
  E: {
    core: "#ffffff",
    mid: "#4facfe",
    glow: "#0066ff",
  },
  F: {
    core: "#ffffff",
    mid: "#cd84f1",
    glow: "#9b59b6",
  },
  "F#": {
    core: "#ffffff",
    mid: "#ff9ff3",
    glow: "#f368e0",
  },
  G: {
    core: "#ffffff",
    mid: "#ffcccc",
    glow: "#ff6b6b",
  },
  "G#": {
    core: "#ffffff",
    mid: "#7bed9f",
    glow: "#2ed573",
  },
  A: {
    core: "#ffffff",
    mid: "#70a1ff",
    glow: "#1e90ff",
  },
  "A#": {
    core: "#ffffff",
    mid: "#a3a1ff",
    glow: "#5352ed",
  },
  B: {
    core: "#ffffff",
    mid: "#ff9ff3",
    glow: "#f368e0",
  },
} as const;

export type NoteColorScheme = typeof NOTE_COLORS[keyof typeof NOTE_COLORS];
