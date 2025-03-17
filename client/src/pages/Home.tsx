import { useEffect, useRef } from 'react';
import ScrollSection from '@/components/ScrollSection';
import Simulator from '@/components/Simulator';

const sections = [
  {
    id: 'intro',
    title: 'Understanding Periodic Motion',
    content: 'Just like a clock, this orbit completes one cycle every two seconds. This repeating pattern is called a period - the time it takes to complete one full circle.',
    type: 'single',
    periods: [2]  // Changed from 1 to 2 seconds
  },
  {
    id: 'two-orbits',
    title: 'When Two Orbits Meet',
    content: 'Here we have two orbits: one takes 1 second to complete, while the other takes 2 seconds. They will align again only when they complete their cycles - every 2 seconds. This is called their common period.',
    type: 'double',
    periods: [1, 2]
  },
  {
    id: 'three-orbits',
    title: 'Complex Patterns Emerge',
    content: 'With three orbits (1s, 2s, and 3s periods), the pattern becomes more intricate. All three will align only when they complete their respective cycles - every 6 seconds. This demonstrates how simple periodic motions can create complex patterns.',
    type: 'double',
    periods: [1, 2, 3]
  },
  {
    id: 'simulator',
    title: 'Interactive Orbital Simulator',
    content: 'Now it\'s your turn! Experiment with different numbers of orbits and periods to create your own patterns. Each orbit creates a unique sound when reaching the top position.',
    type: 'simulator'
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
      {/* Educational sections */}
      <div className="relative z-10">
        {sections.map((section) => (
          section.id !== 'simulator' ? (
            <ScrollSection
              key={section.id}
              id={section.id}
              title={section.title}
              content={section.content}
              type={section.type}
              periods={section.periods}
            />
          ) : null
        ))}
      </div>

      {/* Interactive simulator */}
      <div className="min-h-screen relative z-10 bg-[#0a0a2a]/80 backdrop-blur-sm">
        <Simulator initialOrbits={4} />
      </div>
    </div>
  );
}