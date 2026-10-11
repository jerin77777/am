import React, { forwardRef } from 'react';

interface CameraShowcaseProps {
  cameraSubtitle: string;
  cameraCanvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export const CameraShowcase = forwardRef<HTMLDivElement, CameraShowcaseProps>(
  ({ cameraSubtitle, cameraCanvasRef }, ref) => {
    return (
      <div ref={ref} className="camera-showcase-container">
        {/* Subtle radial lighting backdrop */}
        <div className="camera-ambient-backdrop" />

        {/* Top Header HUD Overlay */}
        <div className="camera-hud-top">
          <h2 className="camera-main-title">
            <span className="camera-title-line1">Luxury Interior</span>{' '}
            <span className="camera-title-line2">Transformation</span>
          </h2>

          <div className="camera-subtitle-wrapper">
            <p className="camera-main-subtitle" key={cameraSubtitle}>
              {cameraSubtitle}
            </p>
          </div>
        </div>

        {/* Center Canvas Area with Ground Shadow */}
        <div className="camera-canvas-stage">
          <div className="camera-ground-shadow" />
          <canvas ref={cameraCanvasRef} className="camera-canvas" />
        </div>
      </div>
    );
  }
);

CameraShowcase.displayName = 'CameraShowcase';
