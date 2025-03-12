import { useEffect, useRef } from 'react';
import ScrollSection from '@/components/ScrollSection';
import Simulator from '@/components/Simulator';

const sections = [
  {
    id: 'intro',
    title: 'Understanding Periodic Motion',
    content: 'This is a clock - a repeating cycle with a period',
    type: 'single'
  },
  {
    id: 'period',
    title: 'The Period',
    content: 'The time it takes to complete one full circle is called its period',
    type: 'single-timer'
  },
  {
    id: 'second',
    title: 'Two Cycles',
    content: 'What happens when we have two cycles with different periods?',
    type: 'double'
  },
  {
    id: 'crossing',
    title: 'Crossing Points',
    content: 'The balls cross paths at regular intervals that depend on their periods',
    type: 'crossing'
  },
  {
    id: 'alignment',
    title: 'Alignment',
    content: 'Sometimes the balls align at the same point - this creates a pattern',
    type: 'alignment'
  },
  {
    id: 'patterns',
    title: 'Complex Patterns',
    content: 'With more elements, we can create complex systems with fascinating patterns',
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
