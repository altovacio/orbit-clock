import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';
import { useInView } from 'framer-motion';
import Orbits from './Orbits';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Scale types
type ScaleType = 'majorPentatonic' | 'major' | 'naturalMinor' | 'chromatic';

// Base frequencies for notes (C4 to B4)
const BASE_NOTES = {
  'C': 261.63,
  'C#': 277.18,
  'D': 293.66,
  'D#': 311.13,
  'E': 329.63,
  'F': 349.23,
  'F#': 369.99,
  'G': 392.00,
  'G#': 415.30,
  'A': 440.00,
  'A#': 466.16,
  'B': 493.88
};

// Scale patterns (semitone intervals from root)
const SCALE_PATTERNS: Record<ScaleType, number[]> = {
  majorPentatonic: [0, 2, 4, 7, 9], // C, D, E, G, A
  major: [0, 2, 4, 5, 7, 9, 11], // C, D, E, F, G, A, B
  naturalMinor: [0, 2, 3, 5, 7, 8, 10], // C, D, Eb, F, G, Ab, Bb
  chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] // All 12 semitones
};

// Generate frequencies for a given scale type, root note, and number of octaves
function generateScaleFrequencies(scaleType: ScaleType, rootNote: keyof typeof BASE_NOTES, octaves: number = 4): number[] {
  const pattern = SCALE_PATTERNS[scaleType];
  const rootFreq = BASE_NOTES[rootNote];
  const frequencies: number[] = [];
  
  for (let octave = 0; octave < octaves; octave++) {
    for (const semitones of pattern) {
      // Calculate frequency using equal temperament formula: f = root * 2^(n/12)
      // where n is the number of semitones from the root
      const freq = rootFreq * Math.pow(2, (octave * 12 + semitones) / 12);
      frequencies.push(freq);
    }
  }
  
  return frequencies;
}

export default function Simulator() {
  const [periods, setPeriods] = useState<number[]>([1.4, 1.6, 1.8]);
  const [scale, setScale] = useState(0.8);
  const [scaleType, setScaleType] = useState<ScaleType>('majorPentatonic');
  const [rootNote, setRootNote] = useState<keyof typeof BASE_NOTES>('C');
  const audioContextRef = useRef<AudioContext>();
  const ref = useRef(null);
  
  // Increase threshold to detect visibility earlier
  const isInView = useInView(ref, { 
    amount: 0.3, // Lower threshold means it will trigger when less of the component is visible
    once: false  // Allow retriggering when scrolling back
  });
  
  const addOrbit = () => {
    if (periods.length < 50) {
      setPeriods([...periods, periods[periods.length - 1] + 0.2]);
    }
  };

  const removeOrbit = () => {
    if (periods.length > 2) {
      setPeriods(periods.slice(0, -1));
    }
  };

  const playSimulatorSound = (orbitIndex: number) => {
    if (!isInView) return; // Only play sound if simulator is visible

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const context = audioContextRef.current;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    // Generate frequencies based on current scale type and root note
    const frequencies = generateScaleFrequencies(scaleType, rootNote);
    
    // Use the generated frequencies based on orbit index
    const frequency = frequencies[orbitIndex % frequencies.length];

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);

    // Quick attack, slow release for a star-like shimmer
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
                numOrbits={periods.length}
                scale={scale}
                periods={periods}
                onTopReached={playSimulatorSound}
              />
            </div>
          </Card>

          <Card className="p-6 bg-gray-900/50 border-gray-800">
            <div className="space-y-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Number of Orbits: {periods.length}</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={removeOrbit}
                    disabled={periods.length <= 2}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={addOrbit}
                    disabled={periods.length >= 50}
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
              
              {/* Sound Settings */}
              <div className="space-y-4 border-t border-gray-800 pt-4">
                <h3 className="font-semibold">Sound Settings</h3>
                
                <div className="space-y-2">
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
                
                <div className="space-y-2">
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
              </div>

              {periods.map((period, index) => (
                <div key={index} className="space-y-4">
                  <Label>Orbit {index + 1} Period (seconds)</Label>
                  <Slider
                    value={[period]}
                    onValueChange={([value]) => {
                      const newPeriods = [...periods];
                      newPeriods[index] = value;
                      setPeriods(newPeriods);
                    }}
                    min={1}
                    max={10}
                    step={0.1}
                  />
                  <div className="text-sm text-gray-400">
                    Current: {period.toFixed(1)}s
                  </div>
                </div>
              ))}

              <div className="p-4 bg-gray-800/50 rounded-lg">
                <h3 className="font-semibold mb-2">Pattern Info</h3>
                <p className="text-sm text-gray-400">
                  The orbits create complex patterns based on their relative periods.
                  Listen for the sound when each ball reaches the top!
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}