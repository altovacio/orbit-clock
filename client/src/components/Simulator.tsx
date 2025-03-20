import { useState, useRef, useEffect } from "react";
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
import { useAudioContext } from "@/hooks/useAudioContext"; // Fixed import path
import { BASE_NOTES, SCALE_PATTERNS, ScaleType, BaseNote } from '@/config/orbitConfig';

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
  const [rootNote, setRootNote] = useState<BaseNote>("C");
  const [activePreset, setActivePreset] = useState<number>(0);
  const ref = useRef(null);

  const isInView = useInView(ref, {
    amount: 0.3,
    once: false,
  });

  // Calculate interpolated periods based on min and max
  const periods = interpolateValues(minPeriod, maxPeriod, numOrbits);

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

  const { playSound, setScale, currentScale } = useAudioContext();

  const playSimulatorSound = (orbitIndex: number) => {
    if (!isInView) return;
    playSound(orbitIndex);
  };

  const handleNoteChange = (noteWithOctave: string) => {
    setScale(noteWithOctave, currentScale.scaleType);
  };

  const handleScaleTypeChange = (value: ScaleType) => {
    setScale(currentScale.rootNote, value);
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
            <div className="aspect-square relative">
              <Orbits
                type="double"
                numOrbits={numOrbits}
                scale={1}
                periods={periods}
                onTopReached={playSimulatorSound}
              />
              
              {/* Time Displays */}
              <div className="absolute bottom-2 left-2 p-2 bg-black/50 rounded-lg backdrop-blur-sm">
                <div className="text-xs text-gray-400">Elapsed Time</div>
                <div className="text-lg font-mono text-emerald-400">0:00</div>
              </div>
              
              <div className="absolute bottom-2 right-2 p-2 bg-black/50 rounded-lg backdrop-blur-sm">
                <div className="text-xs text-gray-400">Next Reset In</div>
                <div className="text-lg font-mono text-amber-400">0:00</div>
              </div>
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
                  <Label htmlFor="min-period">Minimum Period (seconds)</Label>
                  <Slider
                    id="min-period"
                    value={[minPeriod]}
                    onValueChange={([value]) => setMinPeriod(value)}
                    min={0.5}
                    max={5}
                    step={0.1}
                  />
                  <div className="text-sm text-gray-400">
                    Min Period: {minPeriod.toFixed(1)}s
                  </div>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="max-period">Maximum Period (seconds)</Label>
                  <Slider
                    id="max-period"
                    value={[maxPeriod]}
                    onValueChange={([value]) => setMaxPeriod(value)}
                    min={1}
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
                  <div className="flex gap-2 items-center">
                    <Label htmlFor="scale-type-select">Scale Type</Label>
                    <select
                      value={currentScale.scaleType}
                      onChange={(e) => handleScaleTypeChange(e.target.value as ScaleType)}
                      className="bg-background border rounded-md p-2"
                      id="scale-type-select"
                      name="scaleType"
                    >
                      {Object.keys(SCALE_PATTERNS).map(scale => (
                        <option key={scale} value={scale}>
                          {scale.replace(/([A-Z])/g, ' $1').trim()} {/* Format camelCase to spaced */}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="root-note-select">Root Note</Label>
                  <PianoKeys
                    rootNote={currentScale.rootNote}
                    scaleType={currentScale.scaleType}
                    onNoteChange={handleNoteChange}
                  />
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