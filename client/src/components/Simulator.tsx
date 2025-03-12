import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';
import Orbits from './Orbits';
import { useAudioContext } from '@/hooks/useAudioContext';

export default function Simulator() {
  const [periods, setPeriods] = useState<number[]>([3, 5]);
  const [scale, setScale] = useState(0.8);
  const { playSound } = useAudioContext();

  const addOrbit = () => {
    if (periods.length < 10) {
      setPeriods([...periods, periods.length + 3]);
    }
  };

  const removeOrbit = () => {
    if (periods.length > 2) {
      setPeriods(periods.slice(0, -1));
    }
  };

  const handleTopReached = (orbitIndex: number) => {
    playSound(orbitIndex);
  };

  return (
    <div className="min-h-screen p-8">
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
                onTopReached={handleTopReached}
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
                    disabled={periods.length >= 10}
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