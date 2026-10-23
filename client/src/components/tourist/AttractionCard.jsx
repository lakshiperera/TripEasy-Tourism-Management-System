import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useItinerary } from '../../context/ItineraryContext';
import {
  FiClock,
  FiDollarSign,
  FiPlus,
  FiCheck,
  FiArrowRight,
  FiCompass,
} from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

/**
 * Attraction Card Component
 * Earthy Forest & Outdoor Green aesthetic: warm stone card background, dark forest buttons
 */
const AttractionCard = ({ attraction }) => {
  const { addItem, removeItem, isInItinerary } = useItinerary();
  const [imgError, setImgError] = useState(false);
  const inItinerary = isInItinerary(attraction._id);

  const primaryImage = attraction.images?.[0];
  const imgSrc = primaryImage
    ? `${API_URL}${primaryImage.url}`
    : `https://placehold.co/400x280/e7e2d6/436d46?text=${encodeURIComponent(attraction.name)}`;

  const handleItineraryToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inItinerary) {
      removeItem(attraction._id);
    } else {
      addItem(attraction);
    }
  };

  return (
    <div className="card group flex flex-col h-full bg-white border border-stone-200/90 hover:border-forest-300 transition-all duration-300 shadow-sm hover:shadow-card-nature-hover">
      {/* Thumbnail and Category Badge */}
      <Link to={`/attraction/${attraction._id}`} className="block relative overflow-hidden">
        <div className="w-full h-48 bg-stone-100 overflow-hidden">
          <img
            src={imgError ? `https://placehold.co/400x280/e7e2d6/436d46?text=${encodeURIComponent(attraction.name)}` : imgSrc}
            alt={attraction.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            onError={() => setImgError(true)}
          />
        </div>

        {/* Gradient shadow overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

        {/* Category Pill Badge */}
        <div className="absolute top-3 left-3">
          <span
            className="badge text-white shadow-md font-semibold text-xs px-2.5 py-1"
            style={{ backgroundColor: attraction.category?.color || '#355637' }}
          >
            <span>{attraction.category?.icon || '🌿'}</span>
            <span>{attraction.category?.name || 'Attraction'}</span>
          </span>
        </div>

        {/* Distance from Ragama Pill */}
        {attraction.travelInfo?.distanceFromRagama !== undefined && (
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-stone-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md border border-stone-100">
            <FiCompass className="text-forest-700 w-3.5 h-3.5" />
            <span>{attraction.travelInfo.distanceFromRagama} km</span>
          </div>
        )}
      </Link>

      {/* Card Content: warm stone background styling */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 bg-stone-50/40">
        <Link to={`/attraction/${attraction._id}`} className="focus:outline-none">
          <h3 className="font-extrabold text-stone-900 text-base leading-snug mb-2 hover:text-forest-800 transition-colors line-clamp-2">
            {attraction.name}
          </h3>
        </Link>

        <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 flex-1 mb-4 leading-relaxed">
          {attraction.description}
        </p>

        {/* Info Meta Row */}
        <div className="flex items-center gap-3 text-xs text-stone-500 mb-4 pb-3 border-b border-stone-200/70">
          {attraction.openingHours?.weekdays && (
            <span className="flex items-center gap-1.5" title="Opening hours">
              <FiClock className="w-3.5 h-3.5 text-forest-600 flex-shrink-0" />
              <span className="truncate max-w-[120px]">
                {attraction.openingHours.weekdays.split('–')[0].trim()}
              </span>
            </span>
          )}

          <span className="flex items-center gap-1" title="Entrance fee">
            <FiDollarSign className="w-3.5 h-3.5 text-forest-600 flex-shrink-0" />
            <span className="font-medium text-stone-700">
              {attraction.entranceFee?.isFree ? 'Free Admission' : 'Ticketed'}
            </span>
          </span>
        </div>

        {/* Action Button Row */}
        <div className="flex items-center gap-2 mt-auto">
          <Link
            to={`/attraction/${attraction._id}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-bold py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200/90 text-stone-800 border border-stone-300 transition-colors"
          >
            <span>Explore</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleItineraryToggle}
            className={`flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-bold py-2.5 px-3 rounded-xl transition-all duration-200 shadow-sm ${
              inItinerary
                ? 'bg-forest-900 text-stone-50 hover:bg-red-800 hover:text-white'
                : 'bg-forest-800 hover:bg-forest-900 text-stone-50'
            }`}
            title={inItinerary ? 'Remove from plan' : 'Add to Day Itinerary'}
          >
            {inItinerary ? (
              <>
                <FiCheck className="w-3.5 h-3.5 text-sage-300" />
                <span>Added</span>
              </>
            ) : (
              <>
                <FiPlus className="w-3.5 h-3.5" />
                <span>+ Itinerary</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttractionCard;
