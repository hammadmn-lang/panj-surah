import React, { useState } from 'react';
import appLogo from '../assets/images/app_logo_1791491470615.jpg';

interface AppLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  alt?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  className = 'w-10 h-10',
  size = 'md',
  alt = 'Panj Surah',
}) => {
  const [hasError, setHasError] = useState(false);

  // If image fails to load (e.g. offline cache miss on mobile or asset path issue),
  // render an exquisite SVG Islamic medallion so user never sees a broken image icon.
  if (hasError) {
    return (
      <div
        className={`${className} rounded-2xl bg-gradient-to-br from-emerald-800 via-emerald-950 to-teal-900 border border-emerald-500/60 shadow-md flex items-center justify-center shrink-0 text-amber-300 select-none`}
        title={alt}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-3/4 h-3/4 drop-shadow-sm"
        >
          {/* Islamic 8-Point Star Geometric Medallion */}
          <path
            d="M24 2L28.5 9.5H37.5L38.5 18.5L46 24L38.5 29.5L37.5 38.5H28.5L24 46L19.5 38.5H10.5L9.5 29.5L2 24L9.5 18.5L10.5 9.5H19.5L24 2Z"
            fill="#064E3B"
            stroke="#F59E0B"
            strokeWidth="1.5"
          />
          {/* Crescent Moon */}
          <path
            d="M26.5 15C21.8 15 18 18.8 18 23.5C18 28.2 21.8 32 26.5 32C28.2 32 29.8 31.5 31.1 30.6C27.5 30.1 24.7 27.1 24.7 23.5C24.7 19.9 27.5 16.9 31.1 16.4C29.8 15.5 28.2 15 26.5 15Z"
            fill="#FBBF24"
          />
          {/* Star */}
          <polygon
            points="31,19 32,21.5 34.5,21.5 32.5,23 33.2,25.5 31,24 28.8,25.5 29.5,23 27.5,21.5 30,21.5"
            fill="#FDE68A"
          />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={appLogo}
      alt={alt}
      onError={() => setHasError(true)}
      className={`${className} rounded-2xl shadow-md border border-emerald-600/40 object-cover shrink-0 bg-emerald-950`}
    />
  );
};
