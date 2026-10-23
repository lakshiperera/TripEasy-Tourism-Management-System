import React from 'react';

/**
 * Reusable Loading Spinner
 * Styled for Earthy Forest & Outdoor Green theme
 */
export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-7 h-7 border-2',
    lg: 'w-10 h-10 border-3',
    xl: 'w-14 h-14 border-4',
  };
  return (
    <div
      className={`${sizes[size]} border-forest-800 border-t-transparent rounded-full animate-spin ${className}`}
    />
  );
};

/**
 * Full-page Loading Overlay
 */
export const LoadingPage = ({ message = 'Loading destinations...' }) => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-stone-50 text-stone-800">
    <div className="relative flex items-center justify-center">
      <Spinner size="xl" />
      <span className="absolute text-lg">🌲</span>
    </div>
    <p className="text-stone-600 font-semibold text-sm">{message}</p>
  </div>
);

/**
 * Inline Loading Section
 */
export const LoadingSection = ({ message = 'Loading content...' }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-3">
    <Spinner size="lg" />
    <p className="text-stone-500 text-xs font-medium">{message}</p>
  </div>
);

/**
 * Skeleton Card for Attraction Grid Loading
 * Warm stone hues for earthy look
 */
export const AttractionCardSkeleton = () => (
  <div className="card animate-pulse bg-white border border-stone-200">
    <div className="bg-stone-200 h-48 w-full" />
    <div className="p-4 space-y-3 bg-stone-50/50">
      <div className="flex gap-2">
        <div className="bg-stone-200 h-5 w-20 rounded-full" />
      </div>
      <div className="bg-stone-200 h-5 w-3/4 rounded-lg" />
      <div className="bg-stone-200 h-3.5 w-full rounded" />
      <div className="bg-stone-200 h-3.5 w-5/6 rounded" />
      <div className="flex gap-2 pt-2">
        <div className="bg-stone-200 h-9 flex-1 rounded-xl" />
        <div className="bg-stone-200 h-9 flex-1 rounded-xl" />
      </div>
    </div>
  </div>
);

/**
 * Empty State Component
 */
export const EmptyState = ({
  icon = '🌲',
  title = 'No places found',
  message = '',
  action = null,
}) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-3xl border border-stone-200/90 shadow-sm max-w-lg mx-auto my-6">
    <span className="text-5xl mb-4">{icon}</span>
    <h3 className="text-lg font-bold text-stone-900 mb-1.5">{title}</h3>
    {message && <p className="text-stone-500 text-xs sm:text-sm max-w-sm mb-4 leading-relaxed">{message}</p>}
    {action && <div className="mt-2">{action}</div>}
  </div>
);

export default Spinner;
