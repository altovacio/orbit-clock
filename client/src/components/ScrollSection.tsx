import { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import Orbits from './Orbits';

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
  const isInView = useInView(ref, { amount: 0.5 });
  const audioContextRef = useRef<AudioContext>();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [controls, isInView]);

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

  // Math explanation based on section type
  const getMathExplanation = () => {
    switch (id) {
      case 'intro':
        return (
          <div className="mt-4 p-4 bg-blue-950/50 rounded-lg border border-blue-500/30">
            <h3 className="text-lg font-semibold text-blue-300 mb-2">The Math Behind It</h3>
            <p className="text-sm text-blue-200">
              Period (T) = Time for one complete revolution
              <br />
              Angular Velocity (ω) = 2π / T
              <br />
              Position = f(t) = (r·cos(ωt), r·sin(ωt))
            </p>
          </div>
        );
      case 'two-orbits':
        return (
          <div className="mt-4 p-4 bg-blue-950/50 rounded-lg border border-blue-500/30">
            <h3 className="text-lg font-semibold text-blue-300 mb-2">Synchronization Time</h3>
            <p className="text-sm text-blue-200">
              T₁ = 1s, T₂ = 2s
              <br />
              They sync when: n₁T₁ = n₂T₂
              <br />
              LCM(1, 2) = 2 seconds to sync
            </p>
          </div>
        );
      case 'three-orbits':
        return (
          <div className="mt-4 p-4 bg-blue-950/50 rounded-lg border border-blue-500/30">
            <h3 className="text-lg font-semibold text-blue-300 mb-2">Three-Body Sync</h3>
            <p className="text-sm text-blue-200">
              T₁ = 1s, T₂ = 2s, T₃ = 3s
              <br />
              Sync Time = LCM(1, 2, 3)
              <br />
              = LCM(LCM(1, 2), 3) = LCM(2, 3) = 6 seconds
            </p>
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