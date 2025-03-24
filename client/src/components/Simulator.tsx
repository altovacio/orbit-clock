import { useState, useRef, useEffect, useCallback } from "react";
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
import { useTime } from '@/contexts/TimeContext';
import { useResetTimer } from '@/hooks/useResetTimer';
import { calculateNextReset } from '@/utils/periodMath';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useSettings } from "@/contexts/SettingsContext";
import { STAR_COLOR, BALL_COLORS, BALL_FILTERS } from '@/config/orbitConfig';

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
    minPeriod: 1000,
    maxPeriod: 3000,
    numOrbits: 3,
  },
  {
    title: "Four Notes Melody",
    subtitle: "20s recurrence",
    minPeriod: 1000,
    maxPeriod: 2000,
    numOrbits: 4,
  },
  {
    title: "Seven Note Rhythm",
    subtitle: "3m30s recurrence",
    minPeriod: 500,
    maxPeriod: 2000,
    numOrbits: 7,
  },
  {
    title: "10 Note Madness",
    subtitle: "1.304e10y ⚠️(cosmic time)",
    minPeriod: 1000,
    maxPeriod: 2100,
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
  const [minPeriod, setMinPeriod] = useState(1000); // 1.5s in milliseconds
  const [maxPeriod, setMaxPeriod] = useState(3000); // 3s in milliseconds
  const [scaleType, setScaleType] = useState<ScaleType>("majorPentatonic");
  const [rootNote, setRootNote] = useState<BaseNote>("C");
  const [activePreset, setActivePreset] = useState<number>(0);
  const ref = useRef(null);
  
  // Correct placement of useRef
  const lastPlayedRef = useRef<number[]>([]);

  const isInView = useInView(ref, {
    amount: 0.3,
    once: false,
  });

  // Calculate interpolated periods based on min and max
  const periods = interpolateValues(minPeriod, maxPeriod, numOrbits);

  const nextReset = calculateNextReset(periods);

  const { elapsedTime, isRunning, resetTime: contextResetTime } = useTime();

  const { playSound, setScale, currentScale } = useAudioContext();

  const { formattedReset } = useResetTimer(periods, nextReset);

  const { starSize, setStarSize, colorScheme, toggleColorScheme, colorMode, toggleColorMode } = useSettings();

  // Add this useEffect hook
  useEffect(() => {
    // Reset timer when orbit parameters change
    contextResetTime();
  }, [numOrbits, minPeriod, maxPeriod, activePreset]); // Add these dependencies

  const applyPreset = (presetIndex: number) => {
    const preset = PRESETS[presetIndex];
    setNumOrbits(preset.numOrbits);
    setMinPeriod(preset.minPeriod);
    setMaxPeriod(preset.maxPeriod);
    setActivePreset(presetIndex);
    contextResetTime(); // Explicit reset when presets change
  };

  const addOrbit = () => {
    if (numOrbits < 50) {
      setNumOrbits(numOrbits + 1);
      contextResetTime(); // Reset when adding orbits
    }
  };

  const removeOrbit = () => {
    if (numOrbits > 2) {
      setNumOrbits(numOrbits - 1);
      contextResetTime(); // Reset when removing orbits
    }
  };

  const playSimulatorSound = useCallback((orbitIndex: number) => {
    if (!isInView) return;
    
    // Sound cooldown of 100ms per orbit
    const now = Date.now();
    if (!lastPlayedRef.current[orbitIndex] || now - lastPlayedRef.current[orbitIndex] > 100) {
      playSound(orbitIndex);
      lastPlayedRef.current[orbitIndex] = now;
    }
  }, [isInView, playSound]);

  const handleNoteChange = (noteWithOctave: string) => {
    setScale(noteWithOctave, currentScale.scaleType);
  };

  const handleScaleTypeChange = (value: ScaleType) => {
    setScale(currentScale.rootNote, value);
  };

  // Update the slider handlers
  const handleMinPeriodChange = (value: number) => {
    setMinPeriod(value);
    contextResetTime(); // Reset when period changes
  };

  const handleMaxPeriodChange = (value: number) => {
    setMaxPeriod(value);
    contextResetTime(); // Reset when period changes
  };

  // Add this function inside the Simulator component
  const resetSimulation = () => {
    contextResetTime();
    setNumOrbits(3);
    setMinPeriod(1000);
    setMaxPeriod(3000);
    setActivePreset(0);
  };

  return (
    <div ref={ref} className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-2 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Interactive Orbital Simulator
        </h2>
        <h3 className="text-xl font-semibold mb-8 text-center text-gray-300">
          Have fun creating music and exploring the celestial rythms!
        </h3>
        <div className="flex flex-col lg:flex-row gap-6 w-full">
          {/* Simulation visualization */}
          <div className="flex-1 h-[600px] relative">
            <div className="aspect-square relative">
              <Orbits
                type="double"
                numOrbits={numOrbits}
                scale={1}
                periods={periods}
                onTopReached={playSimulatorSound}
              />
              
              {/* Time Displays */}
              <div className="absolute bottom-1 left-1 p-2 bg-black/50 rounded-lg backdrop-blur-sm">
                <div className="text-xs text-gray-400">Elapsed Time</div>
                <div className="text-lg font-mono text-emerald-400">
                  {Math.floor(elapsedTime / 60000)}:{(Math.floor(elapsedTime / 1000) % 60).toString().padStart(2, '0')}
                  <span className="text-sm">.{(Math.floor(elapsedTime % 1000 / 10)).toString().padStart(2, '0')}</span>
                </div>
              </div>
              
              <div className="absolute bottom-1 right-1 p-2 bg-black/50 rounded-lg backdrop-blur-sm">
                <div className="text-xs text-gray-400">Next Reset In</div>
                <div className="text-lg font-mono text-amber-400">
                  {formattedReset}
                </div>
              </div>
            </div>
          </div>

          {/* Accordion controls */}
          <div className="lg:w-[380px] w-full">
            <Accordion 
              type="multiple" 
              defaultValue={['presets']}
              className="space-y-4"
            >
              {/* Presets Accordion Item */}
              <AccordionItem value="presets" className="rounded-lg bg-gray-900/50 backdrop-blur-sm">
                <AccordionTrigger className="px-4 py-3 text-lg font-semibold hover:no-underline transition-colors">
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    🌟 Harmonic Presets
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-2">
                  <div className="flex flex-wrap gap-2">
                    {PRESETS.map((preset, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="text-sm px-3 py-1 h-auto rounded-full border-blue-400/30 hover:border-blue-400/50 hover:bg-blue-400/10 transition-colors"
                        onClick={() => applyPreset(index)}
                      >
                        {preset.title}
                        <span className="ml-1 text-blue-300/70 text-xs">{preset.subtitle}</span>
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Orbit Controls Accordion Item */}
              <AccordionItem value="orbits" className="rounded-lg bg-gray-900/50 backdrop-blur-sm">
                <AccordionTrigger className="px-4 py-3 text-lg font-semibold hover:no-underline transition-colors">
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    🪐 Orbital Dynamics
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-2 space-y-4">
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Button onClick={addOrbit} variant="outline" size="sm" className="flex-1">
                        Add Orbit
                      </Button>
                      <Button onClick={removeOrbit} variant="outline" size="sm" className="flex-1">
                        Remove Orbit
                      </Button>
                    </div>
                    
                    {/* Min Period Slider */}
                    <div className="space-y-2">
                      <Label>Minimum Orbital Period</Label>
                      <Slider
                        value={[minPeriod / 1000]}
                        onValueChange={([value]) => handleMinPeriodChange(Math.round(value * 1000))}
                        min={0.5}
                        max={5}
                        step={0.1}
                      />
                      <div className="text-sm text-muted-foreground">
                        {(minPeriod / 1000).toFixed(1)} seconds
                      </div>
                    </div>

                    {/* Max Period Slider */}
                    <div className="space-y-2">
                      <Label>Maximum Orbital Period</Label>
                      <Slider
                        value={[maxPeriod / 1000]}
                        onValueChange={([value]) => handleMaxPeriodChange(Math.round(value * 1000))}
                        min={1}
                        max={10}
                        step={0.1}
                      />
                      <div className="text-sm text-muted-foreground">
                        {(maxPeriod / 1000).toFixed(1)} seconds
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              {/* Sound Settings Accordion Item */}
              <AccordionItem value="sound" className="rounded-lg bg-gray-900/50 backdrop-blur-sm">
                <AccordionTrigger className="px-4 py-3 text-lg font-semibold hover:no-underline transition-colors">
                  <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                    🎵 Sonic Parameters
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-2 space-y-4">
                  <div className="space-y-4">
                    <p className="text-sm text-gray-400">This section just for fun!</p>
                    <div className="space-y-2">
                      <Label htmlFor="scale-select">Musical Scale</Label>
                      <select
                        id="scale-select"
                        value={currentScale.scaleType}
                        onChange={(e) => handleScaleTypeChange(e.target.value as ScaleType)}
                        className="bg-gray-800/50 border border-gray-700 rounded-md p-2 w-full text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      >
                        {Object.keys(SCALE_PATTERNS).map((scale) => (
                          <option key={scale} value={scale}>
                            {scale.replace(/([A-Z])/g, ' $1').trim()}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="root-note-select">Root Note</Label>
                      <PianoKeys
                        rootNote={currentScale.rootNote}
                        scaleType={currentScale.scaleType}
                        onNoteChange={handleNoteChange}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Visual Presets Accordion Item */}
              <AccordionItem value="visual-presets" className="rounded-lg bg-gray-900/50 backdrop-blur-sm">
                <AccordionTrigger className="px-4 py-3 text-lg font-semibold hover:no-underline transition-colors">
                  <div className="flex items-center ">
                    {/* Live preview star */}
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <circle
                        cx="12"
                        cy="12"
                        r={6 * starSize}
                        fill={colorMode === 'monochrome' ? STAR_COLOR.primary : BALL_COLORS(colorMode)[0].primary}
                        filter={colorScheme === 'highQuality' ? `url(#${BALL_FILTERS.glow.id(0, colorScheme)})` : undefined}
                      />
                    </svg>
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Visual Presets</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-2 space-y-4">
                  <p className="text-sm text-muted-foreground -mt-2 mb-4">
                    ✨ Live preview - changes affect all orbits
                  </p>
                  
                  {/* Visual controls */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Label>Star Size</Label>
                      <Slider
                        value={[starSize]}
                        onValueChange={([value]) => setStarSize(value)}
                        min={0.5}
                        max={2}
                        step={0.1}
                      />
                    </div>
                    {/* Preview star */}
                    <div className="relative w-12 h-12">
                      <svg width="48" height="48" viewBox="0 0 24 24">
                        <circle
                          cx="12"
                          cy="12"
                          r={6 * starSize}
                          fill={colorMode === 'monochrome' ? STAR_COLOR.primary : BALL_COLORS(colorMode)[0].primary}
                          filter={colorScheme === 'highQuality' ? `url(#${BALL_FILTERS.glow.id(0, colorScheme)})` : undefined}
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="flex items-center justify-between space-x-4">
                    <Label htmlFor="color-scheme">High Quality Colors</Label>
                    <Switch
                      id="color-scheme"
                      checked={colorScheme === 'highQuality'}
                      onCheckedChange={toggleColorScheme}
                    />
                  </div>

                  <div className="flex items-center justify-between space-x-4">
                    <Label htmlFor="color-mode">Colorful Mode</Label>
                    <Switch
                      id="color-mode"
                      checked={colorMode === 'multicolor'}
                      onCheckedChange={toggleColorMode}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}