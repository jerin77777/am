import React from 'react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="loading-screen-container">
      <div className="loading-logo-wrapper">
        <img
          src="/logo_clean.webp"
          alt="AM Auto Designers"
          className="loading-logo-img"
        />
      </div>
    </div>
  );
};

