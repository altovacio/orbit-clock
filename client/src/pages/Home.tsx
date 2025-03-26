import { useEffect, useRef, useState, useCallback } from 'react';
import ScrollSection from '@/components/ScrollSection';
import Simulator from '@/components/Simulator';
import { ArrowDown } from '@/components/ui/ArrowDown';
import { useIsMobile } from "@/hooks/use-mobile";

const sections = [
  {
    id: 'intro',
    title: 'Orbital Music',
    content: 'Let\'s make some music while we learn about periodic motion',
    type: 'intro',
    nextSectionId: 'one-orbit'
  },
  {
    id: 'one-orbit',
    title: 'Understanding Orbit Reset',
    content: 'In periodic motion, the period \(T\) is the time taken to return to the starting point. Here, T = 1s for this orbit.',
    type: 'single',
    nextSectionId: 'two-orbits'
  },
  {
    id: 'two-orbits',
    title: 'When Two Orbits Coincide',
    content: 'If there are two moving objects with different individual periods, we need to wait until their reset times align. In this example, one is moving twice as fast as the other, and they align every 2 seconds.',
    type: 'double',
    nextSectionId: 'three-orbits'
  },
  {
    id: 'three-orbits',
    title: 'Three-Body Dance',
    content: 'With three objects (periods of 1, 2, and 3 seconds), the pattern becomes a little more complex. When will they all align again at the top?',
    type: 'multi',
    nextSectionId: 'three-body-explanation'
  },
  {
    id: 'three-body-explanation',
    title: 'Least Common Multiple',
    content: 'They align at the top every 6 seconds in this example. This is because 6 divided by each period is an integer, so they all complete whole cycles! That is, 6 is their least common multiple!',
    type: 'multi',
    nextSectionId: 'simulator'
  }
];

export default function Home() {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const [sectionVisibilities, setSectionVisibilities] = useState<number[]>([]);
  const [simulatorInView, setSimulatorInView] = useState(false);
  const simulatorRef = useRef<HTMLDivElement>(null);

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
      star.className = 'absolute w-1 h-1 bg-white/30 rounded-full animate-twinkle'; // Reduced opacity
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 3}s`;
      container.appendChild(star);
    }
  }, []);

  // Add intersection observer for simulator section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setSimulatorInView(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    if (simulatorRef.current) {
      observer.observe(simulatorRef.current);
    }

    return () => {
      if (simulatorRef.current) {
        observer.unobserve(simulatorRef.current);
      }
    };
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
      <div 
        ref={simulatorRef}
        className="min-h-screen relative z-10 bg-[#0a0a2a]/80 backdrop-blur-sm" 
        id="simulator"
      >
        <Simulator />
      </div>

      {/* Conditionally render ArrowDown */}
      {!simulatorInView && (
        <ArrowDown targetSectionId={
          activeSectionIndex < sections.length - 1 
            ? sections[activeSectionIndex + 1].id 
            : 'simulator'
        } />
      )}
    </div>
  );
}