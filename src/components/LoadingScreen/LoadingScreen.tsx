import React from 'react';

interface LoadingScreenProps {
  progress: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress }) => {
  return (
    <div className="loading-screen-container">
      <div className="loading-logo-wrapper">
        <img
          src="/logo_clean.webp"
          alt="AM Auto Designers"
          className="loading-logo-img"
        />
        <div className="loading-progress-bar-container">
          <div
            className="loading-progress-bar-fill"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
        <span className="loading-progress-text">{progress}%</span>
      </div>
    </div>
  );
};

