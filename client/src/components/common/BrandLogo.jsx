import React from 'react';
import { Link } from 'react-router-dom';

/**
 * TripEasy Brand Logo Component
 * Incorporates nature, compass/trail and conifer tree motifs with Earthy Forest aesthetic
 */
const BrandLogo = ({ size = 'md', variant = 'dark', showTagline = true, to = '/' }) => {
  // Dimensions based on size prop
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const taglineSizes = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
  };

  const isLight = variant === 'light';

  const logoContent = (
    <div className="flex items-center gap-2.5 group select-none">
      {/* Nature Emblem Icon */}
      <div
        className={`${iconSizes[size]} relative flex items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-105 shadow-sm overflow-hidden flex-shrink-0 ${
          isLight
            ? 'bg-gradient-to-br from-emerald-700 to-green-800 border border-emerald-500/60 shadow-green-glow/20'
            : 'bg-gradient-to-br from-emerald-600 to-green-700 border border-emerald-500/70 shadow-card-nature'
        }`}
      >
        {/* SVG Emblem: Twin Pines & Compass Path */}
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1.5"
        >
          {/* Subtle sun/circle in background */}
          <circle cx="20" cy="16" r="10" fill={isLight ? '#10b981' : '#059669'} opacity="0.4" />
          
          {/* Mountains outline */}
          <path
            d="M8 29L16 17L23 27L29 20L34 29H8Z"
            fill={isLight ? '#065f46' : '#047857'}
            opacity="0.85"
          />

          {/* Central Pine Tree */}
          <path
            d="M20 7L24 13H22L25 18H23L26 24H14L17 18H15L18 13H16L20 7Z"
            fill="#bbf7d0"
          />
          <rect x="19" y="24" width="2" height="4" fill="#a7f3d0" />

          {/* Compass trail curve */}
          <path
            d="M10 32C14 28 26 34 31 29"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="2 2"
          />
        </svg>
      </div>

      {/* Brand Name & Tagline */}
      <div className="flex flex-col leading-tight">
        <div className={`font-extrabold tracking-tight ${textSizes[size]}`}>
          <span className={isLight ? 'text-white' : 'text-stone-900'}>Trip</span>
          <span className="text-emerald-600 font-serif italic ml-0.5">Easy</span>
        </div>
        {showTagline && (
          <span
            className={`font-semibold tracking-wider uppercase ${taglineSizes[size]} ${
              isLight ? 'text-emerald-300' : 'text-emerald-700'
            }`}
          >
            Gampaha Day Planner
          </span>
        )}
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="inline-block focus:outline-none">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
};

export default BrandLogo;
