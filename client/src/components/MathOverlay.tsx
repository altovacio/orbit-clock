import { useRef, useEffect } from 'react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { motion, useAnimation } from 'framer-motion';

interface MathOverlayProps {
  sectionId: string;
  elapsedTime?: number;
  periods?: number[];
  isInView: boolean;
}

export default function MathOverlay({ sectionId, elapsedTime = 0, periods = [], isInView }: MathOverlayProps) {
  const controls = useAnimation();
  
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [isInView, controls]);

  const getMathContent = () => {
    switch (sectionId) {
      case 'intro':
        // For single orbit: Show period formula and current phase
        return {
          equations: [
            `\\omega = \\frac{2\\pi}{T}`,
            `\\theta(t) = \\omega t = \\frac{2\\pi t}{${periods[0]}}`,
            `\\text{Current Phase: } ${((2 * Math.PI * elapsedTime) % (2 * Math.PI)).toFixed(2)} \\text{ rad}`
          ],
          explanation: 'The angular velocity (ω) determines how fast the orbit completes one cycle. For a period (T) of 1 second, ω = 2π radians per second.'
        };

      case 'two-orbits':
        // For two orbits: Show the relationship between periods and synchronization time
        const lcm = periods[0] && periods[1] ? calculateLCM(periods[0], periods[1]) : 0;
        return {
          equations: [
            `T_1 = ${periods[0]}s, \\quad T_2 = ${periods[1]}s`,
            `\\text{LCM}(T_1, T_2) = ${lcm}s`,
            `\\text{Alignment every } ${lcm} \\text{ seconds}`
          ],
          explanation: 'The orbits align when they complete full cycles. This happens at the Least Common Multiple (LCM) of their periods.'
        };

      case 'three-orbits':
        // For three orbits: Show more complex synchronization pattern
        const lcm3 = periods.length === 3 ? calculateLCM3(periods[0], periods[1], periods[2]) : 0;
        return {
          equations: [
            `T_1 = ${periods[0]}s, \\quad T_2 = ${periods[1]}s, \\quad T_3 = ${periods[2]}s`,
            `\\text{LCM}(T_1, T_2, T_3) = ${lcm3}s`,
            `\\text{Complete pattern repeats every } ${lcm3} \\text{ seconds}`
          ],
          explanation: 'With three orbits, the pattern complexity increases. The system repeats when all orbits complete whole numbers of cycles.'
        };

      default:
        return {
          equations: [],
          explanation: ''
        };
    }
  };

  const { equations, explanation } = getMathContent();

  return (
    <motion.div
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
      }}
      transition={{ duration: 0.5 }}
      className="bg-black/40 backdrop-blur-sm p-6 rounded-lg"
    >
      <div className="space-y-4">
        {equations.map((eq, index) => (
          <div key={index} className="overflow-x-auto">
            <BlockMath math={eq} />
          </div>
        ))}
        <p className="text-sm text-gray-300 mt-4">{explanation}</p>
      </div>
    </motion.div>
  );
}

// Helper functions for calculating LCM
function calculateGCD(a: number, b: number): number {
  return b === 0 ? a : calculateGCD(b, a % b);
}

function calculateLCM(a: number, b: number): number {
  return (a * b) / calculateGCD(a, b);
}

function calculateLCM3(a: number, b: number, c: number): number {
  return calculateLCM(calculateLCM(a, b), c);
}
