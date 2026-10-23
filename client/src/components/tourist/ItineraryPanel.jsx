import React from 'react';
import { useItinerary } from '../../context/ItineraryContext';
import { Link } from 'react-router-dom';
import { FiX, FiArrowRight, FiCompass } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

/**
 * ItineraryPanel Component
 * Day-plan sidebar widget in Earthy Forest & Outdoor Green theme
 */
const ItineraryPanel = ({ compact = false }) => {
  const { items, removeItem, clearItinerary, stats } = useItinerary();

  const formatTime = (minutes) => {
    if (!minutes) return '0m';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m}m`;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  if (items.length === 0) {
    return (
      <div className="bg-stone-50/70 border border-dashed border-stone-300 rounded-xl p-6 text-center">
        <p className="text-3xl mb-2">🧭</p>
        <p className="font-bold text-stone-800 text-sm">Your Itinerary is Empty</p>
        <p className="text-stone-500 text-xs mt-1">
          Add attractions using the <strong>+ Itinerary</strong> button to plan your route.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-4 py-3 border-b border-stone-200 flex items-center justify-between bg-stone-100">
        <h3 className="font-bold text-forest-900 text-xs uppercase tracking-wide flex items-center gap-2">
          <span>Stops Selected</span>
          <span className="bg-forest-900 text-stone-50 text-[11px] px-2 py-0.5 rounded-full font-bold">
            {items.length}
          </span>
        </h3>
        <button
          onClick={clearItinerary}
          className="text-xs text-stone-500 hover:text-red-700 font-semibold transition-colors"
        >
          Clear all
        </button>
      </div>

      {/* Items list */}
      <ol className="divide-y divide-stone-100 max-h-72 overflow-y-auto">
        {items.map((attraction, index) => {
          const img = attraction.images?.[0];
          const imgSrc = img ? `${API_URL}${img.url}` : null;

          return (
            <li
              key={attraction._id}
              className="flex items-center gap-3 px-3.5 py-2.5 hover:bg-stone-50 transition-colors"
            >
              {/* Step number */}
              <div className="w-5 h-5 rounded-full bg-forest-100 text-forest-900 text-[11px] font-extrabold flex items-center justify-center flex-shrink-0 border border-forest-300">
                {index + 1}
              </div>

              {/* Thumbnail */}
              {imgSrc && (
                <img
                  src={imgSrc}
                  alt={attraction.name}
                  className="w-9 h-9 rounded-lg object-cover flex-shrink-0 border border-stone-200"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-stone-900 truncate">{attraction.name}</p>
                <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                  <FiCompass className="w-3 h-3 text-forest-600" />
                  <span>{attraction.travelInfo?.distanceFromRagama || 0} km</span>
                </p>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeItem(attraction._id)}
                className="text-stone-400 hover:text-red-600 transition-colors p-1"
                aria-label="Remove item"
              >
                <FiX className="w-4 h-4" />
              </button>
            </li>
          );
        })}
      </ol>

      {/* Trip stats */}
      <div className="px-4 py-3 bg-stone-50 border-t border-stone-200">
        <div className="grid grid-cols-2 gap-2 text-xs text-stone-700">
          <div className="p-2 bg-white rounded-lg border border-stone-200">
            <span className="text-[10px] text-stone-400 block uppercase font-bold">Total Dist.</span>
            <span className="font-extrabold text-forest-900 text-sm">
              {stats.totalDistance} km
            </span>
          </div>
          <div className="p-2 bg-white rounded-lg border border-stone-200">
            <span className="text-[10px] text-stone-400 block uppercase font-bold">Est. Duration</span>
            <span className="font-extrabold text-forest-900 text-sm">
              {formatTime(stats.totalTime)}
            </span>
          </div>
        </div>
      </div>

      {/* View full itinerary button */}
      <div className="p-3 bg-white border-t border-stone-200">
        <Link to="/itinerary" className="btn-primary w-full text-xs py-2">
          <span>Complete Itinerary</span>
          <FiArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default ItineraryPanel;
