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

// Scale types
type ScaleType = "majorPentatonic" | "major" | "naturalMinor" | "chromatic";

// Base frequencies for notes (C4 to B4)
const BASE_NOTES = {
  C: 261.63, 'C#': 277.18, D: 293.66, 'D#': 311.13, E: 329.63,
  F: 349.23, 'F#': 369.99, G: 392.0, 'G#': 415.3, A: 440.0,
  'A#': 466.16, B: 493.88
};

// Scale patterns (semitone intervals from root)
const SCALE_PATTERNS: Record<ScaleType, number[]> = {
  majorPentatonic: [0, 2, 4, 7, 9],
  major: [0, 2, 4, 5, 7, 9, 11],
  naturalMinor: [0, 2, 3, 5, 7, 8, 10],
  chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
};

function generateScaleFrequencies(scaleType: ScaleType, rootNote: keyof typeof BASE_NOTES, octaves: number = 8): number[] {
  const pattern = SCALE_PATTERNS[scaleType];
  const rootFreq = BASE_NOTES[rootNote];
  const frequencies: number[] = [];

  for (let octave = 0; octave < octaves; octave++) {
    for (const semitones of pattern) {
      const freq = rootFreq * Math.pow(2, (octave * 12 + semitones) / 12);
      frequencies.push(freq);
    }
  }

  return frequencies;
}

// Linear interpolation helper function
function interpolateValues(start: number, end: number, count: number): number[] {
  const result = [];
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0 : i / (count - 1);
    result.push(start + (end - start) * t);
  }
  return result;
}

export default function Simulator() {
  const [section, setSection] = useState<'intro' | 'two' | 'three' | 'simulation'>('intro');
  const [numOrbits, setNumOrbits] = useState(4);
  const [minPeriod, setMinPeriod] = useState(1.5);  
  const [maxPeriod, setMaxPeriod] = useState(3);   
  const [scale, setScale] = useState(0.8);
  const [scaleType, setScaleType] = useState<ScaleType>("majorPentatonic");
  const [rootNote, setRootNote] = useState<keyof typeof BASE_NOTES>("C");
  const audioContextRef = useRef<AudioContext>();
  const ref = useRef(null);

  const isInView = useInView(ref, {
    amount: 0.3,
    once: false
  });

  // Configure orbits based on section
  const getSectionConfig = () => {
    switch (section) {
      case 'intro':
        return { numOrbits: 1, periods: [1] };
      case 'two':
        return { numOrbits: 2, periods: [1, 2] };
      case 'three':
        return { numOrbits: 3, periods: [1, 2, 3] };
      default:
        return { 
          numOrbits: numOrbits,
          periods: Array.from({ length: numOrbits }, (_, i) => 
            minPeriod + (maxPeriod - minPeriod) * (i / (numOrbits - 1))
          )
        };
    }
  };

  const config = getSectionConfig();

  const addOrbit = () => {
    if (numOrbits < 50) {
      setNumOrbits(numOrbits + 1);
    }
  };

  const removeOrbit = () => {
    if (numOrbits > 4) {
      setNumOrbits(numOrbits - 1);
    }
  };

  const resetSimulation = () => {
    setNumOrbits(4);
    setMinPeriod(1.5);
    setMaxPeriod(3);
    setScale(0.8);
  };

  const playSimulatorSound = (orbitIndex: number) => {
    if (!isInView) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const context = audioContextRef.current;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    const frequencies = generateScaleFrequencies(scaleType, rootNote);
    const frequency = frequencies[orbitIndex % frequencies.length];

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);

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
          {section === 'intro' && "Understanding Orbital Periods"}
          {section === 'two' && "Synchronizing Two Orbits"}
          {section === 'three' && "Complex Orbital Patterns"}
          {section === 'simulation' && "Interactive Orbital Simulator"}
        </h2>

        <div className="text-center mb-8">
          {section === 'intro' && (
            <p className="text-lg text-gray-300">
              Watch as this single orbit completes one cycle every second. 
              Like a clock hand, it marks time with each revolution.
            </p>
          )}
          {section === 'two' && (
            <p className="text-lg text-gray-300">
              These two orbits have periods of 1 and 2 seconds. 
              They align at the top every 2 seconds - their least common multiple.
            </p>
          )}
          {section === 'three' && (
            <p className="text-lg text-gray-300">
              With periods of 1, 2, and 3 seconds, these orbits create a more complex pattern. 
              They all meet at the top every 6 seconds.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="p-6 col-span-2 bg-gray-900/50 border-gray-800">
            <div className="space-y-4 mb-4">
              <div className="flex justify-center space-x-4">
                <Button 
                  variant={section === 'intro' ? "default" : "outline"}
                  onClick={() => setSection('intro')}
                >
                  Single Orbit
                </Button>
                <Button 
                  variant={section === 'two' ? "default" : "outline"}
                  onClick={() => setSection('two')}
                >
                  Two Orbits
                </Button>
                <Button 
                  variant={section === 'three' ? "default" : "outline"}
                  onClick={() => setSection('three')}
                >
                  Three Orbits
                </Button>
                <Button 
                  variant={section === 'simulation' ? "default" : "outline"}
                  onClick={() => setSection('simulation')}
                >
                  Simulator
                </Button>
              </div>
            </div>
            <div className="aspect-square">
              <Orbits
                type="double"
                numOrbits={config.numOrbits}
                scale={scale}
                periods={config.periods}
                onTopReached={playSimulatorSound}
              />
            </div>
          </Card>

          {section === 'simulation' && (
            <div className="space-y-8">
              <Card className="p-6 bg-gray-900/50 border-gray-800">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Number of Orbits: {numOrbits}</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={removeOrbit}
                        disabled={numOrbits <= 4}
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
                    <Label>Orbit Scale</Label>
                    <Slider
                      value={[scale]}
                      onValueChange={([value]) => setScale(value)}
                      min={0.4}
                      max={1}
                      step={0.1}
                    />
                    <div className="text-sm text-gray-400">
                      Scale: {scale.toFixed(1)}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Minimum Period (seconds)</Label>
                    <Slider
                      value={[minPeriod]}
                      onValueChange={([value]) => setMinPeriod(Math.min(value, maxPeriod))}
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
                      onValueChange={([value]) => setMaxPeriod(Math.max(value, minPeriod))}
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
          )}
        </div>
      </div>
    </div>
  );
}