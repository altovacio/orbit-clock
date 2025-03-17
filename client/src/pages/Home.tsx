import { useEffect, useRef } from 'react';
import ScrollSection from '@/components/ScrollSection';
import Simulator from '@/components/Simulator';

const sections = [
  {
    id: 'intro',
    title: 'What is an Orbital Period?',
    content: 'Just like a clock hand, an orbiting object follows a circular path. The time it takes to complete one full circle is called its period.',
    type: 'single'
  },
  {
    id: 'two-orbits',
    title: 'When Two Orbits Meet',
    content: 'Here we have two objects: one takes 1 second to orbit, the other takes 2 seconds. They will meet at the same point every 2 seconds - this is called their synchronization period.',
    type: 'double'
  },
  {
    id: 'three-orbits',
    title: 'Three-Body Dance',
    content: 'With three objects (periods of 1, 2, and 3 seconds), the pattern becomes more complex. All three align every 6 seconds - this is the least common multiple of their periods.',
    type: 'multi'
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
      {/* Scrollytelling sections */}
      <div className="relative z-10">
        {sections.map((section) => (
          <ScrollSection
            key={section.id}
            id={section.id}
            title={section.title}
            content={section.content}
            type={section.type}
          />
        ))}
      </div>

      {/* Interactive simulator */}
      <div className="min-h-screen relative z-10 bg-[#0a0a2a]/80 backdrop-blur-sm">
        <Simulator />
      </div>
    </div>
  );
}