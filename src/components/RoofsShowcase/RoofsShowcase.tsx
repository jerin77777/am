import React, { forwardRef } from 'react';
import { ROOFS_DATA } from '../../constants';

interface RoofsShowcaseProps {
  activeRoofIndex: number;
  onRoofSelect: (index: number) => void;
  roofsRightColRef: React.RefObject<HTMLDivElement | null>;
  roofsCanvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export const RoofsShowcase = forwardRef<HTMLDivElement, RoofsShowcaseProps>(
  ({ activeRoofIndex, onRoofSelect, roofsRightColRef, roofsCanvasRef }, ref) => {
    return (
      <div ref={ref} className="roofs-showcase-container">
        {/* Decorative backdrop graphics matching aesthetic */}
        <svg
          className="roofs-backdrop-svg"
          viewBox="0 0 800 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="520" cy="400" r="390" fill="url(#roofGrayGlow)" opacity="0.6" />
          <circle
            cx="520"
            cy="400"
            r="390"
            stroke="#e2e8f0"
            strokeWidth="1.5"
            strokeDasharray="6 6"
            opacity="0.5"
          />
          <circle
            cx="520"
            cy="400"
            r="490"
            stroke="#e2e8f0"
            strokeWidth="1.5"
            opacity="0.35"
          />
          <defs>
            <radialGradient
              id="roofGrayGlow"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(520 400) rotate(90) scale(390)"
            >
              <stop stopColor="#e2e8f0" stopOpacity="0.75" />
              <stop offset="0.65" stopColor="#f1f5f9" stopOpacity="0.35" />
              <stop offset="1" stopColor="#fafafa" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>

        <div className="roofs-content-grid">
          {/* Left Column: Heading, Subtext & Accordion Features */}
          <div className="roofs-left-col">
            <div className="roofs-badge">
              <span className="roofs-badge-line" />
              <span>CUSTOM CRAFTSMANSHIP</span>
            </div>

            <h1 className="roofs-heading">
              <span className="heading-customizable">Customizable</span>
              <span className="heading-roofs-text">Roofs</span>
            </h1>

            <p className="roofs-subtext">
              Transform your Traveller vehicle with innovative interior roof designs. Built
              for your journey, with ambient lighting, smart storage, and acoustic excellence.
            </p>

            <div className="roofs-accordion">
              {ROOFS_DATA.map((roof, index) => {
                const isActive = activeRoofIndex === index;
                return (
                  <div
                    key={roof.id}
                    className={`roof-accordion-card ${isActive ? 'active' : ''}`}
                    onClick={() => onRoofSelect(index)}
                  >
                    <div className="roof-accordion-header">
                      <div className="roof-accordion-left">
                        <div className="roof-accordion-icon-box">
                          {index === 0 && (
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <circle cx="12" cy="12" r="4" />
                              <path d="M12 2v2" />
                              <path d="M12 20v2" />
                              <path d="m4.93 4.93 1.41 1.41" />
                              <path d="m17.66 17.66 1.41 1.41" />
                              <path d="M2 12h2" />
                              <path d="M20 12h2" />
                              <path d="m6.34 17.66-1.41 1.41" />
                              <path d="m19.07 4.93-1.41 1.41" />
                            </svg>
                          )}
                          {index === 1 && (
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect width="16" height="13" x="4" y="7" rx="2" />
                              <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                              <path d="M8 21h8" />
                            </svg>
                          )}
                          {index === 2 && (
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                            </svg>
                          )}
                        </div>
                        <span className="roof-accordion-title">{roof.featureTitle}</span>
                      </div>

                      <div className="roof-accordion-chevron">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="18 15 12 9 6 15" />
                        </svg>
                      </div>
                    </div>

                    <div className="roof-accordion-body">
                      <p className="roof-accordion-desc">{roof.featureDesc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Roof Visual Image / Canvas Card */}
          <div ref={roofsRightColRef} className="roofs-right-col">
            <div className="roofs-card-wrapper">
              <canvas ref={roofsCanvasRef} className="roofs-canvas" />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

RoofsShowcase.displayName = 'RoofsShowcase';
