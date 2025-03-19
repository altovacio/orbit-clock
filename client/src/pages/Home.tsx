import { useEffect, useRef } from 'react';
import ScrollSection from '@/components/ScrollSection';
import Simulator from '@/components/Simulator';

const sections = [
  {
    id: 'intro',
    title: 'What is an Orbital Period?',
    content: 'In circular motion, the period \( T \) is defined as the time taken to complete one full revolution. In this example, \( T = 1s \).',
    type: 'single'
  },
  {
    id: 'two-orbits',
    title: 'When Two Orbits Meet',
    content: 'In this scenario, one body completes its orbit in 1 second, while the other takes 2 seconds. They will realign to their initial positions at the top after the smaller orbit has completed two full cycles, which occurs after 2 seconds.',
    type: 'double'
  },
  {
    id: 'three-orbits',
    title: 'Three-Body Dance',
    content: 'With three objects (periods of 1, 2, and 3 seconds), the pattern becomes a little more complex. When will they all align again at the top?',
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