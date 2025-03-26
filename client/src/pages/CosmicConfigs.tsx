import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { calculateNextReset } from "@/utils/periodMath";
import { formatResetTime } from "@/hooks/useResetTimer";
import { Badge } from "@/components/ui/badge";

const CosmicConfigList = () => {
  const generateConfigs = (category: string) => {
    const configs = [];
    
    // Start from 1 orbit instead of 0
    for (let orbits = 2; orbits <= 15; orbits++) {
      for (let min = 500; min <= 1000; min += 100) {
        for (let max = 1000; max <= 3000; max += 100) {
          if (min >= max) continue;
          
          const periods = Array.from({length: orbits}, (_, i) => 
            Number((min + (max - min) * (i / (orbits - 1 || 1))).toFixed(1))
          );
          
          try {
            const resetTime = calculateNextReset(periods);
            const formatted = formatResetTime(resetTime);
            
            if (formatted === category) {
              configs.push({
                orbits,
                min: Number(min.toFixed(1)),
                max: Number(max.toFixed(1)),
                time: formatted
              });
            }
          } catch (e) {
            console.warn('Skipping invalid configuration:', {orbits, min, max});
          }
        }
      }
    }
    
    return configs;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Cosmic Configuration Explorer</h1>
        <p className="text-muted-foreground">Orbital patterns that span extraordinary timescales</p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <Label className="text-xl">🌌 Cosmic Scale Patterns</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {generateConfigs("🌌 Cosmic Scale Time").map((config, i) => (
                <div key={i} className="p-4 border rounded-lg hover:bg-accent/10 transition-colors">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="text-sm">
                      {config.orbits} Orbits
                    </Badge>
                    <span className="text-sm text-muted-foreground">{config.time}</span>
                  </div>
                  <div className="mt-2 text-sm">
                    Periods: {config.min}ms - {config.max}ms
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-xl">🚀 Millennium Patterns</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {generateConfigs("🚀 Millenniums!").map((config, i) => (
                <div key={i} className="p-4 border rounded-lg hover:bg-accent/10 transition-colors">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="text-sm">
                      {config.orbits} Orbits
                    </Badge>
                    <span className="text-sm text-muted-foreground">{config.time}</span>
                  </div>
                  <div className="mt-2 text-sm">
                    Periods: {config.min}ms - {config.max}ms
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CosmicConfigList; 