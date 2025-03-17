import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Minus, RotateCcw } from 'lucide-react';
import { useInView } from 'framer-motion';
import Orbits from './Orbits';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Scale types
type ScaleType = 'majorPentatonic' | 'major' | 'naturalMinor' | 'chromatic';

// Base frequencies for notes (C4 to B4)
const BASE_NOTES = {
  'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13, 'E': 329.63,
  'F': 349.23, 'F#': 369.99, 'G': 392.00, 'G#': 415.30, 'A': 440.00,
  'A#': 466.16, 'B': 493.88
};

// Scale patterns (semitone intervals from root)
const SCALE_PATTERNS: Record<ScaleType, number[]> = {
  majorPentatonic: [0, 2, 4, 7, 9],
  major: [0, 2, 4, 5, 7, 9, 11],
  naturalMinor: [0, 2, 3, 5, 7, 8, 10],
  chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
};

function generateScaleFrequencies(scaleType: ScaleType, rootNote: keyof typeof BASE_NOTES, octaves: number = 4): number[] {
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
  const [numOrbits, setNumOrbits] = useState(3);
  const [minPeriod, setMinPeriod] = useState(1.5);  
  const [maxPeriod, setMaxPeriod] = useState(23);   
  const [scale, setScale] = useState(0.8);
  const [scaleType, setScaleType] = useState<ScaleType>('majorPentatonic');
  const [rootNote, setRootNote] = useState<keyof typeof BASE_NOTES>('C');
  const audioContextRef = useRef<AudioContext>();
  const ref = useRef(null);

  const isInView = useInView(ref, { 
    amount: 0.3,
    once: false
  });

  // Calculate interpolated periods based on min and max
  const periods = interpolateValues(minPeriod, maxPeriod, numOrbits);

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
    setMaxPeriod(23);
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

    oscillator.type = 'sine';
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
          Interactive Orbital Simulator
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="p-6 col-span-2 bg-gray-900/50 border-gray-800">
            <div className="aspect-square">
              <Orbits 
                type="double" 
                numOrbits={numOrbits}
                scale={scale}
                periods={periods}
                onTopReached={playSimulatorSound}
              />
            </div>
          </Card>

          <div className="space-y-8">
            {/* Orbit Controls Card */}
            <Card className="p-6 bg-gray-900/50 border-gray-800">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Number of Orbits: {numOrbits}</h3>
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
                      <SelectItem value="majorPentatonic">Major Pentatonic</SelectItem>
                      <SelectItem value="major">Major</SelectItem>
                      <SelectItem value="naturalMinor">Natural Minor</SelectItem>
                      <SelectItem value="chromatic">Chromatic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="root-note">Root Note</Label>
                  <Select 
                    value={rootNote} 
                    onValueChange={(value) => setRootNote(value as keyof typeof BASE_NOTES)}
                  >
                    <SelectTrigger id="root-note">
                      <SelectValue placeholder="Select root note" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(BASE_NOTES).map((note) => (
                        <SelectItem key={note} value={note}>{note}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <p className="text-sm text-gray-400">
                    Each orbit creates a unique note when reaching the top. 
                    Adjust the scale and root note to create different musical patterns.
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