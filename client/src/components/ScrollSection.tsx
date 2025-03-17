import { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import Orbits from './Orbits';
import katex from 'katex';
import 'katex/dist/katex.min.css';

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
          <div className="mt-4 p-4 bg-blue-950/50 rounded-lg border border-blue-500/30">
            <h3 className="text-lg font-semibold text-blue-300 mb-2">The Math Behind It</h3>
            <div ref={mathRef} className="space-y-4">
              <div className="latex" data-formula="T = \text{Time for one revolution}" />
              <div className="latex" data-formula="\omega = \frac{2\pi}{T} \text{ (Angular Velocity)}" />
              <div className="latex" data-formula="\begin{cases} x(t) = r \cos(\omega t) \\ y(t) = r \sin(\omega t) \end{cases}" />
            </div>
          </div>
        );
      case 'two-orbits':
        return (
          <div className="mt-4 p-4 bg-blue-950/50 rounded-lg border border-blue-500/30">
            <h3 className="text-lg font-semibold text-blue-300 mb-2">Synchronization Time</h3>
            <div ref={mathRef} className="space-y-4">
              <div className="latex" data-formula="T_1 = 1s, T_2 = 2s" />
              <div className="latex" data-formula="\text{Sync when: } n_1T_1 = n_2T_2" />
              <div className="latex" data-formula="\text{LCM}(1, 2) = 2 \text{ seconds}" />
            </div>
          </div>
        );
      case 'three-orbits':
        return (
          <div className="mt-4 p-4 bg-blue-950/50 rounded-lg border border-blue-500/30">
            <h3 className="text-lg font-semibold text-blue-300 mb-2">Three-Body Sync</h3>
            <div ref={mathRef} className="space-y-4">
              <div className="latex" data-formula="T_1 = 1s, T_2 = 2s, T_3 = 3s" />
              <div className="latex" data-formula="\text{Sync Time} = \text{LCM}(1, 2, 3)" />
              <div className="latex" data-formula="\text{LCM}(\text{LCM}(1, 2), 3) = \text{LCM}(2, 3) = 6 \text{ seconds}" />
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
            onTopReached={isInView ? playScrollSound : undefined}
          />
        </motion.div>
      </div>
    </div>
  );
}