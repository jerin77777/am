import React from 'react';
import { PAINTS, DEFAULT_PAINT_OFFSETS } from '../../constants';

interface PaintDebugControlsProps {
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

export const PaintDebugControls: React.FC<PaintDebugControlsProps> = ({
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
}) => {
  return (
    <div className="paint-buttons-container">
      {PAINTS.map((color) => {
        const colorHex = color === 'purple' ? '#8e44ad' : color === 'red' ? '#e74c3c' : '#2ecc71';
        const isActive = selectedPaint === color;
        return (
          <button
            key={color}
            className={`color-btn ${isActive ? 'active' : ''}`}
            onClick={() => {
              if (isActive) {
                setSelectedPaint(null);
              } else {
                setSelectedPaint(color);
                const defs = DEFAULT_PAINT_OFFSETS[color] || DEFAULT_PAINT_OFFSETS.purple;
                setPaintScale(defs.scale);
                setPaintXOffset(defs.x);
                setPaintYOffset(defs.y);
              }
            }}
          >
            <span className="color-swatch" style={{ backgroundColor: colorHex }} />
            <span className="color-name">{color.charAt(0).toUpperCase() + color.slice(1)}</span>
          </button>
        );
      })}

      {selectedPaint && (
        <div className="paint-controls-card">
          <div className="controls-header">Adjust Position</div>

          <div className="control-group">
            <div className="control-label">
              <span>Scale</span>
              <span>{paintScale.toFixed(3)}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="2.0"
              step="0.005"
              value={paintScale}
              onChange={(e) => setPaintScale(parseFloat(e.target.value))}
              className="control-slider"
            />
          </div>

          <div className="control-group">
            <div className="control-label">
              <span>Offset X</span>
              <span>{Math.round(paintXOffset)}px</span>
            </div>
            <input
              type="range"
              min="-600"
              max="600"
              step="1"
              value={paintXOffset}
              onChange={(e) => setPaintXOffset(parseFloat(e.target.value))}
              className="control-slider"
            />
          </div>

          <div className="control-group">
            <div className="control-label">
              <span>Offset Y</span>
              <span>{Math.round(paintYOffset)}px</span>
            </div>
            <input
              type="range"
              min="-600"
              max="600"
              step="1"
              value={paintYOffset}
              onChange={(e) => setPaintYOffset(parseFloat(e.target.value))}
              className="control-slider"
            />
          </div>

          <div className="button-row">
            <button
              className="copy-btn"
              onClick={() => {
                const textToCopy = `Scale: ${paintScale.toFixed(3)}, X Offset: ${Math.round(paintXOffset)}px, Y Offset: ${Math.round(paintYOffset)}px`;
                navigator.clipboard.writeText(textToCopy);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              {copied ? 'Copied! ✓' : 'Copy Values'}
            </button>

            <button
              className="reset-btn"
              onClick={() => {
                const defs =
                  (selectedPaint && DEFAULT_PAINT_OFFSETS[selectedPaint]) ||
                  DEFAULT_PAINT_OFFSETS.purple;
                setPaintScale(defs.scale);
                setPaintXOffset(defs.x);
                setPaintYOffset(defs.y);
              }}
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
