import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import Orbits from './Orbits';

export default function Simulator() {
  const [period1, setPeriod1] = useState(3);
  const [period2, setPeriod2] = useState(5);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Interactive Orbital Simulator
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="p-6 col-span-2 bg-gray-900/50 border-gray-800">
            <div className="aspect-square">
              <Orbits type="double" />
            </div>
          </Card>

          <Card className="p-6 bg-gray-900/50 border-gray-800">
            <div className="space-y-8">
              <div className="space-y-4">
                <Label>Orbit 1 Period (seconds)</Label>
                <Slider
                  value={[period1]}
                  onValueChange={([value]) => setPeriod1(value)}
                  min={1}
                  max={10}
                  step={0.1}
                />
                <div className="text-sm text-gray-400">
                  Current: {period1}s
                </div>
              </div>

              <div className="space-y-4">
                <Label>Orbit 2 Period (seconds)</Label>
                <Slider
                  value={[period2]}
                  onValueChange={([value]) => setPeriod2(value)}
                  min={1}
                  max={10}
                  step={0.1}
                />
                <div className="text-sm text-gray-400">
                  Current: {period2}s
                </div>
              </div>

              <div className="p-4 bg-gray-800/50 rounded-lg">
                <h3 className="font-semibold mb-2">Pattern Info</h3>
                <p className="text-sm text-gray-400">
                  The orbits will align every {(period1 * period2) / 
                  Math.max(period1, period2)} seconds
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
