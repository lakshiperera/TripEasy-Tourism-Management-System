import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { attractionService } from '../../services';
import { useItinerary } from '../../context/ItineraryContext';
import InteractiveMap from '../../components/tourist/InteractiveMap';
import { LoadingPage } from '../../components/common/LoadingStates';
import {
  FiMapPin,
  FiClock,
  FiArrowLeft,
  FiPlus,
  FiCheck,
  FiDollarSign,
  FiPhone,
  FiGlobe,
  FiCompass,
  FiShare2,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

/**
 * Attraction Detail Page
 * Earthy Forest & Outdoor Green theme with rich metadata, photos, tips, and location map
 */
const AttractionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, removeItem, isInItinerary } = useItinerary();

  const [attraction, setAttraction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [imgErrors, setImgErrors] = useState({});

  const inItinerary = attraction ? isInItinerary(attraction._id) : false;

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await attractionService.getById(id);
        setAttraction(res.data.data);
      } catch {
        setError('Attraction not found.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  if (isLoading) return <LoadingPage message="Loading destination details..." />;

  if (error || !attraction) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <p className="text-5xl mb-4">🌲</p>
          <h2 className="text-2xl font-bold text-stone-900 mb-2">Destination Not Found</h2>
          <p className="text-stone-500 text-sm mb-6">
            The attraction you requested could not be located or may have been removed.
          </p>
          <Link to="/" className="btn-primary">
            Back to Exploration
          </Link>
        </div>
      </div>
    );
  }

  const handleItinerary = () => {
    if (inItinerary) removeItem(attraction._id);
    else addItem(attraction);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: attraction.name,
        text: attraction.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const formatTime = (min) => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const getImgSrc = (img, index) => {
    if (imgErrors[index]) {
      return `https://placehold.co/800x500/e7e2d6/355637?text=${encodeURIComponent(attraction.name)}`;
    }
    return img?.url
      ? `${API_URL}${img.url}`
      : `https://placehold.co/800x500/e7e2d6/355637?text=${encodeURIComponent(attraction.name)}`;
  };

  return (
    <div className="min-h-screen bg-stone-50 page-enter pb-16">
      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-forest-900 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" /> Back to places
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-forest-900 transition-colors"
          >
            <FiShare2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Left Content: Gallery, Title, Description, Tips, Facilities, Map */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="card overflow-hidden bg-white border border-stone-200 shadow-sm">
              <div className="relative bg-stone-100">
                <img
                  src={getImgSrc(attraction.images?.[activeImage], activeImage)}
                  alt={attraction.name}
                  className="w-full h-72 sm:h-96 object-cover"
                  onError={() => setImgErrors((prev) => ({ ...prev, [activeImage]: true }))}
                />
                {/* Category Pill */}
                <div className="absolute top-4 left-4">
                  <span
                    className="badge text-white shadow-lg text-xs px-3 py-1 font-semibold"
                    style={{ backgroundColor: attraction.category?.color || '#355637' }}
                  >
                    <span>{attraction.category?.icon || '🌿'}</span>
                    <span>{attraction.category?.name}</span>
                  </span>
                </div>
              </div>

              {/* Thumbnail Strip */}
              {attraction.images?.length > 1 && (
                <div className="flex gap-2.5 p-3 overflow-x-auto bg-stone-100/70 border-t border-stone-200">
                  {attraction.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                        activeImage === i
                          ? 'border-forest-700 shadow-sm scale-105'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={`${API_URL}${img.url}`}
                        alt={`Thumbnail ${i + 1}`}
                        className="w-16 h-12 object-cover"
                        onError={(e) => {
                          e.target.src = `https://placehold.co/64x48/e7e2d6/355637?text=${i + 1}`;
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Overview & Description */}
            <div className="card p-6 bg-white border border-stone-200">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mb-3 tracking-tight">
                {attraction.name}
              </h1>
              <p className="text-stone-700 leading-relaxed text-sm sm:text-base">
                {attraction.description}
              </p>

              {/* Travel Tips */}
              {attraction.travelTips?.length > 0 && (
                <div className="mt-8 pt-6 border-t border-stone-100">
                  <h3 className="font-bold text-stone-900 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <span>💡</span>
                    <span>Visitor Advice & Tips</span>
                  </h3>
                  <ul className="space-y-2.5">
                    {attraction.travelTips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-600">
                        <span className="text-forest-700 font-bold mt-0.5">✓</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Facilities */}
              {attraction.facilities?.length > 0 && (
                <div className="mt-6 pt-6 border-t border-stone-100">
                  <h3 className="font-bold text-stone-900 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <span>🏕️</span>
                    <span>Available Amenities</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {attraction.facilities.map((f, i) => (
                      <span
                        key={i}
                        className="bg-stone-100 text-stone-800 border border-stone-200 text-xs px-3 py-1.5 rounded-xl font-semibold"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Interactive Location Map */}
            <div className="card overflow-hidden bg-white border border-stone-200">
              <div className="px-5 py-4 border-b border-stone-100">
                <h3 className="font-bold text-stone-900 flex items-center gap-2 text-sm">
                  <FiMapPin className="text-forest-700" /> Geographic Location
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">{attraction.location?.address}</p>
              </div>
              <div className="h-80">
                <InteractiveMap
                  attractions={[attraction]}
                  selectedAttraction={attraction}
                />
              </div>
            </div>
          </div>

          {/* Right Sidebar: Key Visit Stats, Action Buttons */}
          <aside className="space-y-4">
            <div className="card p-5 bg-white border border-stone-200 space-y-4">
              {/* Opening hours */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 flex items-center gap-1.5">
                  <FiClock className="text-forest-700" /> Opening Schedule
                </h3>
                <div className="space-y-1.5 text-xs text-stone-700">
                  <p>
                    <span className="font-semibold text-stone-900">Weekdays:</span>{' '}
                    {attraction.openingHours?.weekdays || 'N/A'}
                  </p>
                  {attraction.openingHours?.weekends && (
                    <p>
                      <span className="font-semibold text-stone-900">Weekends:</span>{' '}
                      {attraction.openingHours.weekends}
                    </p>
                  )}
                  {attraction.openingHours?.notes && (
                    <p className="text-stone-500 italic mt-1 text-[11px]">
                      {attraction.openingHours.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Distance from Ragama */}
              <div className="border-t border-stone-100 pt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 flex items-center gap-1.5">
                  <FiCompass className="text-forest-700" /> Transit From Ragama Hub
                </h3>
                <div className="space-y-1 text-xs text-stone-700">
                  <p className="font-extrabold text-forest-950 text-base">
                    {attraction.travelInfo?.distanceFromRagama || 0} km
                  </p>
                  <p className="text-stone-500">
                    Est. Travel Time: ~{attraction.travelInfo?.estimatedTravelTime || 15} mins
                  </p>
                  <p className="text-stone-500">
                    Recommended Visit: ~{formatTime(attraction.travelInfo?.estimatedVisitDuration || 45)}
                  </p>
                </div>
              </div>

              {/* Entrance fee */}
              <div className="border-t border-stone-100 pt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 flex items-center gap-1.5">
                  <FiDollarSign className="text-forest-700" /> Entrance Tickets
                </h3>
                {attraction.entranceFee?.isFree ? (
                  <p className="text-forest-800 font-bold text-sm bg-forest-50 px-2.5 py-1 rounded-lg border border-forest-200 inline-block">
                    Free Admission
                  </p>
                ) : (
                  <div className="space-y-1 text-xs text-stone-700 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                    <p>Local Adult: Rs. {attraction.entranceFee?.localAdult}</p>
                    <p>Local Child: Rs. {attraction.entranceFee?.localChild}</p>
                    <p>Foreign Adult: Rs. {attraction.entranceFee?.foreignAdult}</p>
                  </div>
                )}
              </div>

              {/* Contact Information */}
              {(attraction.contactInfo?.phone || attraction.contactInfo?.website) && (
                <div className="border-t border-stone-100 pt-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                    Inquiries
                  </h3>
                  {attraction.contactInfo?.phone && (
                    <a
                      href={`tel:${attraction.contactInfo.phone}`}
                      className="flex items-center gap-2 text-xs font-semibold text-forest-800 hover:underline"
                    >
                      <FiPhone /> {attraction.contactInfo.phone}
                    </a>
                  )}
                  {attraction.contactInfo?.website && (
                    <a
                      href={attraction.contactInfo.website}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-xs font-semibold text-forest-800 hover:underline mt-1"
                    >
                      <FiGlobe /> Visit Official Web
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Primary Action Button */}
            <button
              onClick={handleItinerary}
              className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-200 text-sm shadow-card-nature ${
                inItinerary
                  ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                  : 'bg-forest-900 text-stone-50 hover:bg-forest-950'
              }`}
            >
              {inItinerary ? (
                <>
                  <FiCheck className="w-4 h-4 text-forest-700" />
                  <span>Remove from Day Plan</span>
                </>
              ) : (
                <>
                  <FiPlus className="w-4 h-4" />
                  <span>Add to Day Plan</span>
                </>
              )}
            </button>

            {/* Traveler disclaimer */}
            <div className="bg-stone-100/80 border border-stone-200/90 rounded-2xl p-4">
              <p className="text-xs text-stone-600 leading-relaxed">
                ⚠️ <strong>Traveler Notice:</strong> Always confirm weather, trail safety, and temple
                pooja schedules independently prior to starting your journey.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default AttractionDetailPage;
