import React from 'react';
import { Link } from 'react-router-dom';
import { useItinerary, REFERENCE_POINT } from '../../context/ItineraryContext';
import InteractiveMap from '../../components/tourist/InteractiveMap';
import {
  FiMapPin,
  FiClock,
  FiTrash2,
  FiArrowLeft,
  FiCompass,
  FiShare2,
  FiDollarSign,
  FiPlus,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

/**
 * Full Day-Visit Itinerary Page
 * Styled in Earthy Forest & Outdoor Green theme
 */
const ItineraryPage = () => {
  const { items, removeItem, clearItinerary, stats } = useItinerary();

  const formatTime = (minutes) => {
    if (!minutes) return '0m';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m}m`;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My TripEasy Day Tour',
        text: `Check out my Gampaha day tour with ${items.length} stops!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Itinerary link copied to clipboard!');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-stone-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
          <p className="text-6xl mb-4">🧭</p>
          <h1 className="text-2xl font-extrabold text-stone-900 mb-2">
            Your Day Itinerary is Empty
          </h1>
          <p className="text-stone-500 text-sm mb-6 leading-relaxed">
            Begin exploring Gampaha's destinations, cave temples, and nature parks, and add stops to
            calculate your custom travel schedule.
          </p>
          <Link to="/" className="btn-primary">
            <FiArrowLeft className="w-4 h-4" />
            <span>Discover Destinations</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 page-enter pb-16">
      {/* Header Bar */}
      <div className="bg-white border-b border-stone-200 sticky top-16 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-stone-500 hover:text-stone-900 transition-colors p-1 rounded-lg hover:bg-stone-100"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-stone-900">Personalized Day Itinerary</h1>
              <p className="text-xs text-stone-500">
                {items.length} stop{items.length !== 1 ? 's' : ''} planned across Gampaha District
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5"
            >
              <FiShare2 className="w-3.5 h-3.5" />
              <span>Share Plan</span>
            </button>
            <button
              onClick={clearItinerary}
              className="text-xs text-red-600 hover:text-red-800 font-bold px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1"
            >
              <FiTrash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column: Itinerary Stops (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            {/* Trip summary card: Earthy Forest Green */}
            <div className="bg-gradient-to-br from-forest-950 via-forest-900 to-forest-800 rounded-2xl p-6 text-stone-100 shadow-card-nature border border-forest-800">
              <h2 className="font-bold text-base mb-4 flex items-center gap-2 text-stone-100">
                <span>🌲</span> Day Tour Route Overview
              </h2>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/10">
                  <p className="text-2xl font-extrabold text-stone-50">{items.length}</p>
                  <p className="text-[11px] text-sage-200 uppercase font-semibold">Destinations</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/10">
                  <p className="text-2xl font-extrabold text-stone-50">{stats.totalDistance}</p>
                  <p className="text-[11px] text-sage-200 uppercase font-semibold">Total km</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/10">
                  <p className="text-2xl font-extrabold text-stone-50">
                    {formatTime(stats.totalTime)}
                  </p>
                  <p className="text-[11px] text-sage-200 uppercase font-semibold">Est. Duration</p>
                </div>
              </div>
              <p className="text-xs text-stone-300 mt-4 text-center">
                Departure point: <strong className="text-white">{REFERENCE_POINT.name} Hub</strong>{' '}
                · Drive speed computed at ~30 km/h average
              </p>
            </div>

            {/* Starting Point Banner */}
            <div className="flex items-center gap-3 px-4 py-3 bg-stone-100 border border-stone-200 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-forest-900 text-stone-50 text-xs font-bold flex items-center justify-center flex-shrink-0 shadow-sm">
                🏠
              </div>
              <div>
                <p className="text-xs font-bold text-stone-900">Tour Origin Hub</p>
                <p className="text-xs text-stone-500">
                  {REFERENCE_POINT.name} Junction, Gampaha District
                </p>
              </div>
            </div>

            {/* Stop cards */}
            <div className="space-y-3">
              {items.map((attraction, index) => {
                const img = attraction.images?.[0];
                const imgSrc = img ? `${API_URL}${img.url}` : null;

                return (
                  <div
                    key={attraction._id}
                    className="card p-4 bg-white border border-stone-200 shadow-sm"
                  >
                    <div className="flex gap-4">
                      {/* Step Number & Line */}
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-forest-100 text-forest-900 text-xs font-bold flex items-center justify-center border border-forest-300 shadow-sm">
                          {index + 1}
                        </div>
                        {index < items.length - 1 && (
                          <div className="w-0.5 bg-forest-200 flex-1 my-1.5 min-h-[30px]" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex gap-3 mb-2">
                          {imgSrc && (
                            <img
                              src={imgSrc}
                              alt={attraction.name}
                              className="w-20 h-16 rounded-xl object-cover flex-shrink-0 border border-stone-200"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <span
                              className="badge text-white text-[10px] px-2 py-0.5 mb-1"
                              style={{ backgroundColor: attraction.category?.color || '#355637' }}
                            >
                              {attraction.category?.icon || '🌿'} {attraction.category?.name}
                            </span>
                            <Link
                              to={`/attraction/${attraction._id}`}
                              className="block font-bold text-stone-900 hover:text-forest-800 transition-colors line-clamp-1 text-sm"
                            >
                              {attraction.name}
                            </Link>
                            <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                              <FiCompass className="text-forest-600 w-3 h-3" />
                              <span>{attraction.travelInfo?.distanceFromRagama || 0} km from Ragama</span>
                            </p>
                          </div>
                        </div>

                        {/* Info Chips */}
                        <div className="flex flex-wrap gap-2 text-[11px] text-stone-600 pt-2 border-t border-stone-100">
                          <span className="flex items-center gap-1 bg-stone-100 px-2 py-0.5 rounded-lg">
                            <FiClock className="text-forest-600" />
                            <span>Visit: ~{formatTime(attraction.travelInfo?.estimatedVisitDuration || 45)}</span>
                          </span>
                          <span className="flex items-center gap-1 bg-stone-100 px-2 py-0.5 rounded-lg">
                            <FiDollarSign className="text-forest-600" />
                            <span>{attraction.entranceFee?.isFree ? 'Free Admission' : 'Ticketed'}</span>
                          </span>
                        </div>

                        {/* Remove Action */}
                        <button
                          onClick={() => removeItem(attraction._id)}
                          className="mt-3 text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-semibold transition-colors"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                          <span>Remove Stop</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add More Stops CTA */}
            <div className="text-center pt-4">
              <Link
                to="/"
                className="btn-secondary text-xs inline-flex items-center gap-1.5 py-2 px-4"
              >
                <FiPlus className="w-3.5 h-3.5" />
                <span>Add More Places to Itinerary</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Route Map (2 Cols) */}
          <div className="lg:col-span-2">
            <div className="sticky top-36 space-y-4">
              <div className="card p-3 bg-white border border-stone-200 shadow-sm">
                <div className="flex items-center justify-between mb-2 px-2">
                  <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wide flex items-center gap-1.5">
                    <FiMapPin className="text-forest-700" /> Interactive Route Map
                  </h3>
                  <span className="text-[10px] text-stone-500 font-medium">Sequential Stops</span>
                </div>
                <div className="h-96 rounded-xl overflow-hidden border border-stone-200">
                  <InteractiveMap attractions={items} itineraryItems={items} />
                </div>
              </div>

              <div className="bg-stone-100/90 rounded-2xl border border-stone-200 p-4 text-xs text-stone-600 leading-relaxed">
                <p>
                  📍 <strong>Route Guidance:</strong> Coordinates mark destinations in sequential
                  order starting from Ragama. Road conditions and local festival traffic may influence
                  actual drive times.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryPage;
