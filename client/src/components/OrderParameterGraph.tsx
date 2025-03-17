import { useEffect, useRef } from 'react';

interface OrderParameterGraphProps {
  value: number;
  width?: number;
  height?: number;
}

export default function OrderParameterGraph({ 
  value, 
  width = 200, 
  height = 100 
}: OrderParameterGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<number[]>([]);
  const maxPoints = 100;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Add new value to points
    pointsRef.current.push(value);
    if (pointsRef.current.length > maxPoints) {
      pointsRef.current.shift();
    }

    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Draw points
    ctx.strokeStyle = '#2980b9';
    ctx.lineWidth = 2;
    ctx.beginPath();
    pointsRef.current.forEach((point, index) => {
      const x = (index / maxPoints) * width;
      const y = height - (point * height);
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

  }, [value, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="rounded-lg"
    />
  );
}
