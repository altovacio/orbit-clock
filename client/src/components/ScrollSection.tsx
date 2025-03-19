import { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import Orbits from './Orbits';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import OrbitalGraph from './OrbitalGraph';
import { NOTE_COLORS } from '@/lib/colors';

// Musical notes for scroll sections (C major scale)
const SCROLL_NOTES = [
  523.25, // C5
  587.33, // D5
  659.25, // E5
  698.46, // F5
  783.99, // G5
];

interface ScrollSectionProps {
  id: string;
  title: string;
  content: string;
  type: string;
}

export default function ScrollSection({ id, title, content, type }: ScrollSectionProps) {
  const controls = useAnimation();
  const ref = useRef(null);
  const mathRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.5 });
  const audioContextRef = useRef<AudioContext>();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
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

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const context = audioContextRef.current;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    const sectionIndex = parseInt(id.replace(/\D/g, '')) || 0;
    const baseNote = SCROLL_NOTES[sectionIndex % SCROLL_NOTES.length];
    const note = baseNote * (1 + (orbitIndex * 0.5));

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(note, context.currentTime);

    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.15, context.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + 0.5);
  };

  const getMathExplanation = () => {
    switch (id) {
      case 'intro':
        return (
          <div className="mt-4">
            <div className="p-6 bg-blue-950/50 rounded-lg border border-blue-500/30">
              <div ref={mathRef} className="mb-6">
                <div className="latex" data-formula="T = \text{Time for one revolution}" />
              </div>
              <div className="border-t border-blue-500/30 pt-4">
                <p className="text-sm text-gray-400 mb-2">Y-position over time (1 period)</p>
                <OrbitalGraph period={1} numPeriods={1} isRunning={isInView} note="C" />
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
                  <OrbitalGraph period={1} numPeriods={2} isRunning={isInView} note="D" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-2">Second orbit (2 periods)</p>
                  <OrbitalGraph period={2} numPeriods={1} isRunning={isInView} note="E" />
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
                  <OrbitalGraph period={1} numPeriods={6} isRunning={isInView} note="C" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-2">Second orbit (3 periods)</p>
                  <OrbitalGraph period={2} numPeriods={3} isRunning={isInView} note="E" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-2">Third orbit (2 periods)</p>
                  <OrbitalGraph period={3} numPeriods={2} isRunning={isInView} note="G" />
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={ref}
      className="min-h-screen flex items-center justify-center relative"
    >
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, x: -50 },
            visible: { opacity: 1, x: 0 }
          }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
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
          className="aspect-square relative"
        >
          <Orbits
            type={type}
            numOrbits={3} // Added numOrbits prop
            scale={1}
            periods={[1,2,3]} // Added periods prop
            onTopReached={isInView ? playScrollSound : undefined}
            notes={id === 'three-orbits' ? ['C', 'E', 'G'] :
                   id === 'two-orbits' ? ['D', 'E'] :
                   ['C']}
          />
        </motion.div>
      </div>
    </div>
  );
}