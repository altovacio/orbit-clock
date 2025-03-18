import { FC } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const OrbitalSimulator: FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-primary">Celestial Mechanics Explorer</h1>
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Interactive Orbital Simulator</h2>
        <p className="text-muted-foreground mb-4">
          Explore the fascinating world of celestial mechanics through dynamic, multi-stage orbital simulations.
        </p>
        <div className="flex space-x-4">
          <Button variant="default">Start Simulation</Button>
          <Button variant="outline">Tutorial</Button>
        </div>
      </Card>
    </div>
  );
};

export default OrbitalSimulator;
