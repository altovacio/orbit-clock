import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import Orbits from './Orbits';
import MathOverlay from './MathOverlay';

interface ScrollSectionProps {
  id: string;
  title: string;
  content: string;
  type: string;
  periods?: number[];
}

export default function ScrollSection({ id, title, content, type, periods }: ScrollSectionProps) {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5 });
  const audioContextRef = useRef<AudioContext>();
  const [elapsedTime, setElapsedTime] = useState(0);
  const startTimeRef = useRef<number>(0);
  const frameRef = useRef<number>();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
      // Start time tracking when section comes into view
      startTimeRef.current = Date.now();
      const updateTimer = () => {
        setElapsedTime((Date.now() - startTimeRef.current) / 1000);
        frameRef.current = requestAnimationFrame(updateTimer);
      };
      frameRef.current = requestAnimationFrame(updateTimer);
    } else {
      controls.start('hidden');
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
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

    // Calculate frequency based on orbit index
    const baseFrequency = 440; // A4 note
    const frequency = baseFrequency * Math.pow(1.5, orbitIndex); // Using perfect fifths for harmony

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);

    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.15, context.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + 0.5);
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
          <MathOverlay
            sectionId={id}
            elapsedTime={elapsedTime}
            periods={periods}
            isInView={isInView}
          />
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
            periods={periods}
            numOrbits={periods?.length}
            onTopReached={playScrollSound}
          />
        </motion.div>
      </div>
    </div>
  );
}