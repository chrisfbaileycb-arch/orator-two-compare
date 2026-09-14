import React, { useEffect, useRef } from 'react';
import { PlasmaRenderer } from '../canvas/plasma';

export const PlasmaBackdrop: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const renderer = new PlasmaRenderer(canvasRef.current);
    renderer.start();

    return () => {
      renderer.destroy();
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      <canvas
        id="plasma-canvas"
        ref={canvasRef}
        className="w-full h-full block opacity-75"
      />
      <div className="absolute inset-0 scanlines opacity-40" />
    </div>
  );
};
