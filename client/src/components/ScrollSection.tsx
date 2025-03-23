import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import Orbits from './Orbits';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import OrbitalGraph from './OrbitalGraph';
import { useAudioContext } from '@/hooks/useAudioContext';
import { useTime } from '@/contexts/TimeContext';
import { useIsMobile } from "@/hooks/use-mobile";

interface ScrollSectionProps {
  id: string;
  title: string;
  content: string;
  type: string;
  nextSectionId?: string;
  onVisibilityChange?: (isVisible: boolean, intersectionRatio: number) => void;
}

export default function ScrollSection({ id, title, content, type, nextSectionId, onVisibilityChange }: ScrollSectionProps) {
  const controls = useAnimation();
  const ref = useRef(null);
  const mathRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.5 });
  const { playSound } = useAudioContext();
  const { elapsedTime } = useTime();
  const [isFullyInView, setIsFullyInView] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isInView) {
      controls.start({
        opacity: 1,
        x: 0,
        transition: { duration: 0.5, ease: "easeOut" }
      });
    } else {
      controls.start({
        opacity: 0,
        x: -50,
        transition: { duration: 0.3 }
      });
    }
  }, [controls, isInView]);

  useEffect(() => {
    if (mathRef.current) {
      const elements = mathRef.current.getElementsByClassName('latex');
      Array.from(elements).forEach(element => {
        try {
          katex.render(element.getAttribute('data-formula') || '', element as HTMLElement, {
            throwOnError: false,
            displayMode: true
          });
        } catch (error) {
          console.error('KaTeX rendering error:', error);
        }
      });
    }
  }, [id]);

  const playScrollSound = (orbitIndex: number) => {
    if (!isInView) return;
    // Calculate sectionIndex for pitch variation
    const sectionIndex = parseInt(id.replace(/\D/g, '')) || 0;
    // Add section offset to orbit index for varied pitches
    playSound(orbitIndex + (sectionIndex * 3));
  };

  const getMathExplanation = () => {
    switch (id) {
      case 'one-orbit':
        return (
          <div className="mt-4">
            <div className="p-6 bg-blue-950/50 rounded-lg border border-blue-500/30">
              <div ref={mathRef} className="mb-6">
                <div className="latex" data-formula="T = \text{Time for one revolution}" />
              </div>
              <div className="border-t border-blue-500/30 pt-4">
                <p className="text-sm text-gray-400 mb-2">Y-position over time (1 period)</p>
                <OrbitalGraph period={1000} numPeriods={1} isRunning={isInView} />
              </div>
            </div>
          </div>
        );
      case 'two-orbits':
        return (
          <div className="mt-4">
            <div className="p-6 bg-blue-950/50 rounded-lg border border-blue-500/30">
              <div ref={mathRef} className="mb-6">
                <div className="latex" data-formula="T_1 = 1s, T_2 = 2s" />
              </div>
              <div className="border-t border-blue-500/30 pt-4 space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-2">First orbit (1 period)</p>
                  <OrbitalGraph period={1000} numPeriods={2} isRunning={isInView} />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-2">Second orbit (2 periods)</p>
                  <OrbitalGraph period={2000} numPeriods={1} isRunning={isInView} />
                </div>
              </div>
            </div>
          </div>
        );
      case 'three-orbits':
        return (
          <div className="mt-4">
            <div className="p-6 bg-blue-950/50 rounded-lg border border-blue-500/30">
              <div ref={mathRef} className="mb-6">
                <div className="latex" data-formula="T_1 = 1s, T_2 = 2s, T_3 = 3s" />
              </div>
              <div className="border-t border-blue-500/30 pt-4 space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-2">First orbit (6 periods)</p>
                  <OrbitalGraph period={1000} numPeriods={6} isRunning={isInView} />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-2">Second orbit (3 periods)</p>
                  <OrbitalGraph period={2000} numPeriods={3} isRunning={isInView} />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-2">Third orbit (2 periods)</p>
                  <OrbitalGraph period={3000} numPeriods={2} isRunning={isInView} />
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        onVisibilityChange?.(entry.isIntersecting, entry.intersectionRatio);
      },
      {
        threshold: [0, 0.1, 0.5, 0.9, 1],
        rootMargin: isMobile ? '-30% 0px -30% 0px' : '-50% 0px -50% 0px'
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [onVisibilityChange, isMobile]);

  useEffect(() => {
    return () => {
      controls.stop(); // Cleanup animations on unmount
    };
  }, [controls]);

  return (
    <div
      ref={ref}
      className="min-h-screen flex items-center justify-center relative pb-20 md:pb-8"
      id={id}
    >
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, x: -50 },
            visible: { opacity: 1, x: 0 }
          }}
          transition={{ duration: 0.5 }}
          className="space-y-6 z-50"
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {title}
          </h2>
          <p className="text-xl text-gray-300">
            {content}
          </p>
          {getMathExplanation()}
        </motion.div>

        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, scale: 0.8 },
            visible: { opacity: 1, scale: 1 }
          }}
          transition={{ duration: 0.5 }}
          className={`aspect-square relative z-40 ${
            type === 'intro' 
              ? 'opacity-100 h-auto pointer-events-auto' // Always visible for intro
              : 'opacity-0 h-0 md:opacity-100 md:h-auto pointer-events-none md:pointer-events-auto'
          }`}
        >
          <Orbits 
            type={type}
            numOrbits={type === 'intro' ? 3 : (type === 'single' ? 1 : type === 'double' ? 2 : 3)}
            onTopReached={playScrollSound}
          />
        </motion.div>
      </div>
    </div>
  );
}