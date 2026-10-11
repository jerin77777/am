import React, { forwardRef } from 'react';

interface HeaderLogoProps {
  onLogoClick?: () => void;
  pillRef?: React.RefObject<HTMLDivElement | null>;
  hintRef?: React.RefObject<HTMLDivElement | null>;
}

export const HeaderLogo = forwardRef<HTMLDivElement, HeaderLogoProps>(
  ({ onLogoClick, pillRef, hintRef }, ref) => {
    return (
      <header ref={ref} className="floating-logo-header" aria-label="Brand Header">
        <div
          ref={pillRef}
          className="logo-pill-card"
          onClick={onLogoClick}
          role="button"
          tabIndex={0}
          title="AM Auto Designers - Scroll to Top"
        >
          <img
            src="/logo_clean.webp"
            alt="AM Auto Designers - Modeling the Automobile Interiors & Exteriors"
            className="logo-img"
          />
        </div>

        <div ref={hintRef} className="scroll-prompt-indicator">
          <span className="scroll-prompt-text">Scroll to explore</span>
          <div className="scroll-mouse-icon">
            <div className="scroll-wheel-dot" />
          </div>
        </div>
      </header>
    );
  }
);

HeaderLogo.displayName = 'HeaderLogo';
