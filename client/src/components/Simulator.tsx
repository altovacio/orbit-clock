import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Minus, RotateCcw } from "lucide-react";
import { useInView } from "framer-motion";
import Orbits from "./Orbits";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PianoKeys from "./PianoKeys";

// Color mapping for musical notes
const NOTE_COLORS = {
  C: { core: "#ffffff", mid: "#FF6B6B", glow: "#FF0844" },      // Red
  "C#": { core: "#ffffff", mid: "#FF9F6B", glow: "#FF4908" },   // Orange-Red
  D: { core: "#ffffff", mid: "#FFD76B", glow: "#FFB108" },      // Orange
  "D#": { core: "#ffffff", mid: "#FFEB6B", glow: "#FFD908" },   // Yellow-Orange
  E: { core: "#ffffff", mid: "#C4FF6B", glow: "#96FF08" },      // Yellow-Green
  F: { core: "#ffffff", mid: "#6BFF7C", glow: "#08FF2B" },      // Green
  "F#": { core: "#ffffff", mid: "#6BFFC4", glow: "#08FF96" },   // Blue-Green
  G: { core: "#ffffff", mid: "#6BC4FF", glow: "#0896FF" },      // Light Blue
  "G#": { core: "#ffffff", mid: "#6B8CFF", glow: "#083DFF" },   // Blue
  A: { core: "#ffffff", mid: "#966BFF", glow: "#5908FF" },      // Purple
  "A#": { core: "#ffffff", mid: "#C46BFF", glow: "#9608FF" },   // Purple-Pink
  B: { core: "#ffffff", mid: "#FF6BC4", glow: "#FF0896" }       // Pink
};

// Get base note name (without octave number)
function getBaseNote(note: string): string {
  return note.replace(/\d+$/, '');
}

// Preset configurations
interface PresetConfig {
  title: string;
  subtitle: string;
  minPeriod: number;
  maxPeriod: number;
  numOrbits: number;
}

const PRESETS: PresetConfig[] = [
  {
    title: "Three-Orbit Dance",
    subtitle: "6s recurrence",
    minPeriod: 1.5,
    maxPeriod: 3,
    numOrbits: 3,
  },
  {
    title: "Four Notes Melody",
    subtitle: "20s recurrence",
    minPeriod: 1,
    maxPeriod: 2,
    numOrbits: 4,
  },
  {
    title: "Seven Note Rhythm",
    subtitle: "3m30s recurrence",
    minPeriod: 0.5,
    maxPeriod: 2,
    numOrbits: 7,
  },
  {
    title: "10 Note Madness",
    subtitle: "1.304e10y ⚠️(Age of the universe)",
    minPeriod: 1,
    maxPeriod: 2.1,
    numOrbits: 10,
  },
];

// Scale types
type ScaleType = "majorPentatonic" | "major" | "naturalMinor" | "chromatic";

// Base frequencies for notes (C4 to B4)
const BASE_NOTES = {
  C: 261.63,
  "C#": 277.18,
  D: 293.66,
  "D#": 311.13,
  E: 329.63,
  F: 349.23,
  "F#": 369.99,
  G: 392.0,
  "G#": 415.3,
  A: 440.0,
  "A#": 466.16,
  B: 493.88,
};

// Scale patterns (semitone intervals from root)
const SCALE_PATTERNS: Record<ScaleType, number[]> = {
  majorPentatonic: [0, 2, 4, 7, 9],  // C D E G A
  major: [0, 2, 4, 5, 7, 9, 11],     // C D E F G A B
  naturalMinor: [0, 2, 3, 5, 7, 8, 10], // C D Eb F G Ab Bb
  chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
};

// Generate notes for the scale
function generateScaleNotes(
  scaleType: ScaleType,
  rootNote: keyof typeof BASE_NOTES
): { note: string; frequency: number }[] {
  const pattern = SCALE_PATTERNS[scaleType];
  const rootFreq = BASE_NOTES[rootNote];
  const notes = Object.keys(BASE_NOTES);
  const rootIndex = notes.indexOf(rootNote);

  return pattern.map(semitones => {
    const noteIndex = (rootIndex + semitones) % 12;
    const note = notes[noteIndex];
    const frequency = rootFreq * Math.pow(2, semitones / 12);
    return { note, frequency };
  });
}

// Linear interpolation helper function
function interpolateValues(
  start: number,
  end: number,
  count: number,
): number[] {
  const result = [];
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0 : i / (count - 1);
    result.push(start + (end - start) * t);
  }
  return result;
}

export default function Simulator() {
  const [numOrbits, setNumOrbits] = useState(3);
  const [minPeriod, setMinPeriod] = useState(1.5);
  const [maxPeriod, setMaxPeriod] = useState(3);
  const [scaleType, setScaleType] = useState<ScaleType>("majorPentatonic");
  const [rootNote, setRootNote] = useState<keyof typeof BASE_NOTES>("C");
  const [activePreset, setActivePreset] = useState<number>(0);
  const audioContextRef = useRef<AudioContext>();
  const ref = useRef(null);

  const isInView = useInView(ref, {
    amount: 0.3,
    once: false,
  });

  // Calculate interpolated periods based on min and max
  const periods = interpolateValues(minPeriod, maxPeriod, numOrbits);
  const scaleNotes = generateScaleNotes(scaleType, rootNote);

  // Generate colors for each orbit based on its corresponding note in the scale
  const orbitColors = Array(numOrbits).fill(0).map((_, i) => {
    const scaleIndex = i % scaleNotes.length;
    const { note } = scaleNotes[scaleIndex];
    // Get base note and its color
    const baseNote = note.replace(/\d+$/, '') as keyof typeof NOTE_COLORS;
    const color = {...NOTE_COLORS[baseNote]}; // Create a new object to avoid reference issues

    console.log(`Ball ${i}:`, {
      note: baseNote,
      color: color.mid,
      scaleIndex,
      scaleLength: scaleNotes.length
    });

    return {
      ...color,
      note: `${baseNote}-${color.mid}` // Show both note and color for debugging
    };
  });

  const applyPreset = (presetIndex: number) => {
    const preset = PRESETS[presetIndex];
    setNumOrbits(preset.numOrbits);
    setMinPeriod(preset.minPeriod);
    setMaxPeriod(preset.maxPeriod);
    setActivePreset(presetIndex);
  };

  const addOrbit = () => {
    if (numOrbits < 50) {
      setNumOrbits(numOrbits + 1);
    }
  };

  const removeOrbit = () => {
    if (numOrbits > 2) {
      setNumOrbits(numOrbits - 1);
    }
  };

  const resetSimulation = () => {
    setNumOrbits(3);
    setMinPeriod(1.5);
    setMaxPeriod(3);
  };

  const playSimulatorSound = (orbitIndex: number) => {
    if (!isInView) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const context = audioContextRef.current;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    const scaleLength = scaleNotes.length;
    const scaleIndex = orbitIndex % scaleLength;
    const octave = Math.floor(orbitIndex / scaleLength);
    const { frequency } = scaleNotes[scaleIndex];

    // Adjust frequency for the correct octave
    const adjustedFrequency = frequency * Math.pow(2, octave);

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(adjustedFrequency, context.currentTime);

    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.15, context.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + 0.5);
  };

  return (
    <div ref={ref} className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Interactive Orbital Simulator
        </h2>

        {/* Preset Chips */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          {PRESETS.map((preset, index) => (
            <button
              key={index}
              onClick={() => applyPreset(index)}
              className={`
                px-4 py-2 rounded-lg text-left
                ${
                  activePreset === index
                    ? "bg-blue-500/30 border-blue-500"
                    : "bg-gray-900/50 border-gray-800"
                }
                border transition-colors duration-200
                hover:border-blue-400
              `}
            >
              <div className="font-semibold">{preset.title}</div>
              <div className="text-sm text-gray-400">{preset.subtitle}</div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="p-6 col-span-2 bg-gray-900/50 border-gray-800">
            <div className="aspect-square">
              <Orbits
                type="double"
                numOrbits={numOrbits}
                scale={1}
                periods={periods}
                onTopReached={playSimulatorSound}
                orbitColors={orbitColors}
              />
            </div>
          </Card>

          <div className="space-y-8">
            {/* Orbit Controls Card */}
            <Card className="p-6 bg-gray-900/50 border-gray-800">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">
                    Number of Orbits: {numOrbits}
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={removeOrbit}
                      disabled={numOrbits <= 2}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={addOrbit}
                      disabled={numOrbits >= 50}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Minimum Period (seconds)</Label>
                  <Slider
                    value={[minPeriod]}
                    onValueChange={([value]) =>
                      setMinPeriod(Math.min(value, maxPeriod))
                    }
                    min={0.1}
                    max={10}
                    step={0.1}
                  />
                  <div className="text-sm text-gray-400">
                    Min Period: {minPeriod.toFixed(1)}s
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Maximum Period (seconds)</Label>
                  <Slider
                    value={[maxPeriod]}
                    onValueChange={([value]) =>
                      setMaxPeriod(Math.max(value, minPeriod))
                    }
                    min={0.1}
                    max={10}
                    step={0.1}
                  />
                  <div className="text-sm text-gray-400">
                    Max Period: {maxPeriod.toFixed(1)}s
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={resetSimulation}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Simulation
                </Button>
              </div>
            </Card>

            {/* Sound Settings Card */}
            <Card className="p-6 bg-gray-900/50 border-gray-800">
              <div className="space-y-6">
                <h3 className="font-semibold">Sound Settings</h3>

                <div className="space-y-4">
                  <Label htmlFor="scale-type">Scale Type</Label>
                  <Select
                    value={scaleType}
                    onValueChange={(value) => setScaleType(value as ScaleType)}
                  >
                    <SelectTrigger id="scale-type">
                      <SelectValue placeholder="Select scale type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="majorPentatonic">
                        Major Pentatonic
                      </SelectItem>
                      <SelectItem value="major">Major</SelectItem>
                      <SelectItem value="naturalMinor">
                        Natural Minor
                      </SelectItem>
                      <SelectItem value="chromatic">Chromatic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="root-note">Root Note</Label>
                  <Select
                    value={rootNote}
                    onValueChange={(value) =>
                      setRootNote(value as keyof typeof BASE_NOTES)
                    }
                  >
                    <SelectTrigger id="root-note">
                      <SelectValue placeholder="Select root note" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(BASE_NOTES).map((note) => (
                        <SelectItem key={note} value={note}>
                          {note}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Piano Visualization */}
                <div className="space-y-2">
                  <Label>Scale Notes</Label>
                  <PianoKeys rootNote={rootNote} scaleType={scaleType} />
                </div>

                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <p className="text-sm text-gray-400">
                    Each orbit creates a unique note when reaching the top.
                    Adjust the scale and root note to create different musical
                    patterns.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}