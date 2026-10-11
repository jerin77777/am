import React, { forwardRef } from 'react';
import { SEATS_DATA } from '../../constants';

interface SeatsShowcaseProps {
  activeSeatIndex: number;
  onSeatSelect: (index: number) => void;
  seatsRightColRef: React.RefObject<HTMLDivElement | null>;
  seatsCanvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export const SeatsShowcase = forwardRef<HTMLDivElement, SeatsShowcaseProps>(
  ({ activeSeatIndex, onSeatSelect, seatsRightColRef, seatsCanvasRef }, ref) => {
    return (
      <div ref={ref} className="seats-showcase-container">
        {/* Decorative backdrop graphics matching gray/black theme */}
        <svg
          className="seats-backdrop-svg"
          viewBox="0 0 800 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="520" cy="400" r="390" fill="url(#grayGlow)" opacity="0.6" />
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
              id="grayGlow"
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

        <div className="seats-content-grid">
          {/* Left Column: Heading, Subtext & Accordion Features */}
          <div className="seats-left-col">
            <div className="seats-badge">
              <span className="seats-badge-line" />
              <span>PREMIUM TRAVEL EXPERIENCE</span>
            </div>

            <h1 className="seats-heading">
              <span className="heading-comfy">Comfy</span>
              <span className="heading-seats">Seats</span>
            </h1>

            <p className="seats-subtext">
              Experience next-level comfort with our thoughtfully designed traveller seats. Built
              for your journey, with innovative features that make every mile better.
            </p>

            <div className="seats-accordion">
              {SEATS_DATA.map((seat, index) => {
                const isActive = activeSeatIndex === index;
                return (
                  <div
                    key={seat.id}
                    className={`accordion-card ${isActive ? 'active' : ''}`}
                    onClick={() => onSeatSelect(index)}
                  >
                    <div className="accordion-header">
                      <div className="accordion-left">
                        <div className="accordion-icon-box">
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
                              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
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
                              <polygon points="12 2 2 7 12 12 22 7 12 2" />
                              <polyline points="2 17 12 22 22 17" />
                              <polyline points="2 12 12 17 22 12" />
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
                              <line x1="4" y1="21" x2="4" y2="14" />
                              <line x1="4" y1="10" x2="4" y2="3" />
                              <line x1="12" y1="21" x2="12" y2="12" />
                              <line x1="12" y1="8" x2="12" y2="3" />
                              <line x1="20" y1="21" x2="20" y2="16" />
                              <line x1="20" y1="12" x2="20" y2="3" />
                              <line x1="1" y1="14" x2="7" y2="14" />
                              <line x1="9" y1="8" x2="15" y2="8" />
                              <line x1="17" y1="16" x2="23" y2="16" />
                            </svg>
                          )}
                        </div>
                        <span className="accordion-title">{seat.featureTitle}</span>
                      </div>

                      <div className="accordion-chevron">
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

                    <div className="accordion-body">
                      <p className="accordion-desc">{seat.featureDesc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Seats Canvas Showcase with Smooth Color Blending */}
          <div ref={seatsRightColRef} className="seats-right-col">
            <div className="seats-card-wrapper">
              <div className="seat-ground-shadow" />
              <canvas ref={seatsCanvasRef} className="seats-canvas" />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

SeatsShowcase.displayName = 'SeatsShowcase';
