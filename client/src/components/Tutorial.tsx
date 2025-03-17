import { useRef } from "react";
import { Card } from "@/components/ui/card";
import { useInView } from "framer-motion";
import Orbits from "./Orbits";
import Simulator from "./Simulator";

interface SectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

function Section({ title, description, children }: SectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    amount: 0.3,
    once: true,
  });

  return (
    <div
      ref={ref}
      className={`min-h-screen p-8 transition-opacity duration-1000 ${
        isInView ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {title}
        </h2>
        <p className="text-lg text-gray-300 mb-8 text-center max-w-3xl mx-auto">
          {description}
        </p>
        {children}
      </div>
    </div>
  );
}

export default function Tutorial() {
  return (
    <div className="space-y-24">
      {/* Introduction Section */}
      <Section
        title="Understanding Orbital Motion"
        description="Observe this single orbit, where a celestial body marks time like a cosmic clock. Each complete revolution represents one period - the time taken for the body to return to its starting point."
      >
        <Card className="p-6 bg-gray-900/50 border-gray-800 max-w-2xl mx-auto">
          <div className="aspect-square">
            <Orbits
              type="single"
              numOrbits={1}
              scale={0.8}
              periods={[1]}
            />
          </div>
        </Card>
      </Section>

      {/* Two Orbits Section */}
      <Section
        title="The Dance of Two Orbits"
        description="Here we have two orbits with periods of 1 and 2 seconds. Notice how they align at the top every 2 seconds - this is their synchronization period, determined by the least common multiple of their individual periods."
      >
        <Card className="p-6 bg-gray-900/50 border-gray-800 max-w-2xl mx-auto">
          <div className="aspect-square">
            <Orbits
              type="double"
              numOrbits={2}
              scale={0.8}
              periods={[1, 2]}
            />
          </div>
        </Card>
      </Section>

      {/* Three Orbits Section */}
      <Section
        title="A Trio in Motion"
        description="Now with three orbits of 1, 2, and 3 seconds, the pattern becomes more intricate. These bodies will only align together every 6 seconds - the least common multiple of all three periods. Watch and listen as they create a more complex rhythmic pattern."
      >
        <Card className="p-6 bg-gray-900/50 border-gray-800 max-w-2xl mx-auto">
          <div className="aspect-square">
            <Orbits
              type="double"
              numOrbits={3}
              scale={0.8}
              periods={[1, 2, 3]}
            />
          </div>
        </Card>
      </Section>

      {/* Interactive Simulation Section */}
      <Section
        title="Your Turn to Explore"
        description="Now it's your turn to experiment! Starting with 4 orbits, you can adjust their periods and discover how changing these values creates unique patterns of motion and harmony. How long will it take for your configuration to repeat its pattern?"
      >
        <Simulator />
      </Section>
    </div>
  );
}