import { useEffect, useRef, useState, useCallback } from 'react';
import ScrollSection from '@/components/ScrollSection';
import Simulator from '@/components/Simulator';
import { ArrowDown } from '@/components/ui/ArrowDown';
import { useIsMobile } from "@/hooks/use-mobile";

const sections = [
  {
    id: 'intro',
    title: 'What is an Orbital Period?',
    content: 'In circular motion, the period \( T \) is defined as the time taken to complete one full revolution. In this example, \( T = 1s \).',
    type: 'single',
    nextSectionId: 'two-orbits'
  },
  {
    id: 'two-orbits',
    title: 'When Two Orbits Meet',
    content: 'In this scenario, one body completes its orbit in 1 second, while the other takes 2 seconds. They will realign to their initial positions at the top after the smaller orbit has completed two full cycles, which occurs after 2 seconds.',
    type: 'double',
    nextSectionId: 'three-orbits'
  },
  {
    id: 'three-orbits',
    title: 'Three-Body Dance',
    content: 'With three objects (periods of 1, 2, and 3 seconds), the pattern becomes a little more complex. When will they all align again at the top?',
    type: 'multi',
    nextSectionId: 'simulator'
  }
];

export default function Home() {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const [sectionVisibilities, setSectionVisibilities] = useState<number[]>([]);

  // Update visibility tracking
  const handleVisibilityChange = useCallback((index: number, isVisible: boolean, ratio: number) => {
    const effectiveRatio = isMobile ? ratio * 1.2 : ratio;
    
    setSectionVisibilities(prev => {
      const newVisibilities = [...prev];
      newVisibilities[index] = isVisible ? effectiveRatio : 0;
      return newVisibilities;
    });
  }, [isMobile]);

  // Find most visible section
  const activeSectionIndex = sectionVisibilities.reduce(
    (maxIndex, ratio, currentIndex) => 
      ratio > (sectionVisibilities[maxIndex] || 0) ? currentIndex : maxIndex,
    0
  );

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
        {sections.map((section, index) => (
          <ScrollSection
            key={section.id}
            id={section.id}
            title={section.title}
            content={section.content}
            type={section.type}
            onVisibilityChange={(isVisible, ratio) => 
              handleVisibilityChange(index, isVisible, ratio)
            }
          />
        ))}
      </div>

      {/* Interactive simulator */}
      <div className="min-h-screen relative z-10 bg-[#0a0a2a]/80 backdrop-blur-sm" id="simulator">
        <Simulator />
      </div>

      {/* Single ArrowDown at the bottom */}
      <ArrowDown targetSectionId={
        activeSectionIndex < sections.length - 1 
          ? sections[activeSectionIndex + 1].id 
          : 'simulator'
      } />
    </div>
  );
}