import { useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import Simulator from '@/components/Simulator';
import Orbits from '@/components/Orbits';

const sections = [
  {
    id: 'intro',
    title: 'Understanding Periodic Motion',
    content: 'Watch this single orbit - like the hand of a clock, it demonstrates the basic concept of a period. One complete revolution takes exactly one second.',
    orbits: 1,
    periods: [1]
  },
  {
    id: 'two-orbits',
    title: 'Two Orbits in Harmony',
    content: 'Here we have two orbits - one takes 1 second and the other takes 2 seconds to complete. They align at the top every 2 seconds, which is the least common multiple of their periods.',
    orbits: 2,
    periods: [1, 2]
  },
  {
    id: 'three-orbits',
    title: 'A Trio of Motion',
    content: 'Now with three orbits of 1, 2, and 3 seconds, the pattern becomes more complex. These bodies will only align together every 6 seconds - the least common multiple of all three periods.',
    orbits: 3,
    periods: [1, 2, 3]
  }
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add star background
    const container = containerRef.current;
    if (!container) return;

    for (let i = 0; i < 100; i++) {
      const star = document.createElement('div');
      star.className = 'absolute w-1 h-1 bg-white rounded-full animate-twinkle';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 3}s`;
      container.appendChild(star);
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-[#0a0a2a] text-white relative overflow-hidden"
    >
      {/* Learning sections */}
      <div className="relative z-10">
        {sections.map((section) => (
          <div key={section.id} className="min-h-screen p-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {section.title}
              </h2>
              <p className="text-lg text-gray-300 mb-8 text-center max-w-3xl mx-auto">
                {section.content}
              </p>
              <Card className="p-6 bg-gray-900/50 border-gray-800 max-w-2xl mx-auto">
                <div className="aspect-square">
                  <Orbits
                    type="double"
                    numOrbits={section.orbits}
                    scale={0.8}
                    periods={section.periods}
                  />
                </div>
              </Card>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive simulator */}
      <div className="min-h-screen relative z-10 bg-[#0a0a2a]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Your Turn to Explore
          </h2>
          <p className="text-lg text-gray-300 mb-8 text-center max-w-3xl mx-auto">
            Now it's your turn to experiment! Starting with 4 orbits, you can adjust their periods and discover how changing these values creates unique patterns of motion and harmony. How long will it take for your configuration to repeat its pattern?
          </p>
          <Simulator />
        </div>
      </div>
    </div>
  );
}