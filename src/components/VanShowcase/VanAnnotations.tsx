import { forwardRef, useEffect, useRef, useState } from 'react';
import { getVanLayout, type VanLayout } from '../../constants';

interface VanAnnotationsProps {
  // Optional props if needed
}

export const VanAnnotations = forwardRef<HTMLDivElement, VanAnnotationsProps>((_, ref) => {
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);

  const [layout, setLayout] = useState<VanLayout | null>(null);

  const updatePositions = () => {
    const l = getVanLayout(window.innerWidth, window.innerHeight);
    setLayout(l);
  };

  useEffect(() => {
    updatePositions();
    window.addEventListener('resize', updatePositions);
    return () => window.removeEventListener('resize', updatePositions);
  }, []);

  return (
    <div
      ref={ref}
      className="van-annotations-overlay"
      style={
        {
          '--exterior-alpha': '0',
          '--paint-alpha': '0',
          '--exterior-header-alpha': '0',
          '--paint-header-alpha': '0',
        } as React.CSSProperties
      }
    >
      {/* Centered Top Heading & Subtitle Layered for Cinematic Transition */}
      <div className="van-assembly-header">
        {/* Exterior Upgrades Header (Assembly Phase) */}
        <div className="van-header-layer van-header-exterior">
          <h2 className="van-assembly-title">EXTERIOR UPGRADES</h2>
          <p className="van-assembly-subtitle">ADD ACCESSORIES, TRIMS, GRAPHICS AND MORE.</p>
        </div>
        {/* Custom Paints Header (Paints Phase) */}
        <div className="van-header-layer van-header-paint">
          <h2 className="van-assembly-title">CUSTOM PAINTS</h2>
          <p className="van-assembly-subtitle">MAKE IT YOURS, INSIDE AND OUT.</p>
        </div>
      </div>

      {/* SVG Leader Lines & Anchor Rings */}
      {layout && (
        <svg className="van-annotations-svg" viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}>
          {/* Custom Paints Leader Line & Dot (Top/Left) */}
          <path
            className="van-line-paint"
            d={layout.leftPath}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            className="van-dot-paint"
            cx={layout.roofTarget.x}
            cy={layout.roofTarget.y}
            r="4.5"
            fill="#ffffff"
            stroke="#94a3b8"
            strokeWidth="1.5"
          />

          {/* Exterior Upgrades Leader Line & Dot (Bottom/Right) */}
          <path
            className="van-line-exterior"
            d={layout.rightPath}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            className="van-dot-exterior"
            cx={layout.exteriorTarget.x}
            cy={layout.exteriorTarget.y}
            r="4.5"
            fill="#ffffff"
            stroke="#94a3b8"
            strokeWidth="1.5"
          />
        </svg>
      )}

      {/* Left Callout Card: Custom Paints (Appears when paints begin to change) */}
      {layout && (
        <div
          ref={leftCardRef}
          className="van-callout-card van-callout-left van-callout-paint"
          style={{
            transform: `translate3d(${layout.leftCardPos.left}px, ${layout.leftCardPos.top}px, 0) scale(calc(0.92 + 0.08 * var(--paint-alpha, 0)))`,
          }}
        >
          <div className="van-callout-icon">
            {/* Automotive Spray Paint Gun Icon */}
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2 L19 5 L16 8 L11 5 Z" />
              <line x1="13.5" y1="6.5" x2="11.5" y2="8.5" />
              <path d="M4 11 H13 V9 H5" />
              <path d="M4 10 L2 10" />
              <path d="M12 9 L15 12 L12 21 L9.5 20 L11 13" />
              <path d="M9 11 C8 13 8 14 9.5 15" />
              <line x1="11" y1="21" x2="11" y2="23" />
            </svg>
          </div>
          <div className="van-callout-text">
            <h4 className="van-callout-title">CUSTOM PAINTS</h4>
            <p className="van-callout-desc">
              Choose from a range of premium colours or create your own.
            </p>
          </div>
        </div>
      )}

      {/* Right Callout Card: Exterior Upgrades (Appears when assembly frames play) */}
      {layout && (
        <div
          ref={rightCardRef}
          className="van-callout-card van-callout-right van-callout-exterior"
          style={{
            transform: `translate3d(${layout.rightCardPos.left}px, ${layout.rightCardPos.top}px, 0) scale(calc(0.92 + 0.08 * var(--exterior-alpha, 0)))`,
          }}
        >
          <div className="van-callout-icon">
            {/* Exterior Vehicle Upgrade Icon */}
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.2-1.5.6L1.4 10.1C1.2 10.4 1 10.8 1 11.2V16c0 .6.4 1 1 1h2" />
              <circle cx="7" cy="17" r="2.5" />
              <circle cx="17" cy="17" r="2.5" />
              <path d="M5 11l2.5-3.5h4.5" />
            </svg>
          </div>
          <div className="van-callout-text">
            <h4 className="van-callout-title">EXTERIOR UPGRADES</h4>
            <p className="van-callout-desc">
              Add accessories, trims, graphics and more for a unique look.
            </p>
          </div>
        </div>
      )}
    </div>
  );
});

VanAnnotations.displayName = 'VanAnnotations';

