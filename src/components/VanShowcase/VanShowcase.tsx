import React, { forwardRef } from 'react';
import { PaintDebugControls } from './PaintDebugControls';
import { VanAnnotations } from './VanAnnotations';
import { DEBUG_PAINT } from '../../constants';

interface VanShowcaseProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  annotationsRef?: React.RefObject<HTMLDivElement | null>;
  showPaintButtons: boolean;
  selectedPaint: string | null;
  setSelectedPaint: (paint: string | null) => void;
  paintScale: number;
  setPaintScale: (scale: number) => void;
  paintXOffset: number;
  setPaintXOffset: (x: number) => void;
  paintYOffset: number;
  setPaintYOffset: (y: number) => void;
  copied: boolean;
  setCopied: (copied: boolean) => void;
}

export const VanShowcase = forwardRef<HTMLDivElement, VanShowcaseProps>(
  (
    {
      canvasRef,
      annotationsRef,
      showPaintButtons,
      selectedPaint,
      setSelectedPaint,
      paintScale,
      setPaintScale,
      paintXOffset,
      setPaintXOffset,
      paintYOffset,
      setPaintYOffset,
      copied,
      setCopied,
    },
    ref
  ) => {
    return (
      <>
        {/* Fixed Canvas Container for Van Animation */}
        <div ref={ref} className="canvas-container">
          <canvas ref={canvasRef} />
          {/* Assembly & Custom Paints UI Annotations Overlay */}
          <VanAnnotations ref={annotationsRef} />
        </div>

        {/* Debug Controls when VITE_DEBUG_PAINT is enabled */}
        {DEBUG_PAINT && showPaintButtons && (
          <PaintDebugControls
            selectedPaint={selectedPaint}
            setSelectedPaint={setSelectedPaint}
            paintScale={paintScale}
            setPaintScale={setPaintScale}
            paintXOffset={paintXOffset}
            setPaintXOffset={setPaintXOffset}
            paintYOffset={paintYOffset}
            setPaintYOffset={setPaintYOffset}
            copied={copied}
            setCopied={setCopied}
          />
        )}
      </>
    );
  }
);

VanShowcase.displayName = 'VanShowcase';
