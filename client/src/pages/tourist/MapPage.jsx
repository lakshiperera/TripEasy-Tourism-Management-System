import React, { useEffect, useState } from 'react';
import { attractionService } from '../../services';
import InteractiveMap from '../../components/tourist/InteractiveMap';
import { LoadingSection } from '../../components/common/LoadingStates';
import { FiMapPin, FiCompass } from 'react-icons/fi';

/**
 * Full-page map view of all attractions
 * Earthy Forest & Outdoor Green theme
 */
const MapPage = () => {
  const [attractions, setAttractions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    attractionService.getForMap().then((res) => {
      setAttractions(res.data.data || []);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="flex flex-col bg-stone-50" style={{ height: 'calc(100vh - 72px)' }}>
      {/* Header Bar */}
      <div className="bg-white border-b border-stone-200 px-6 py-3.5 flex items-center justify-between flex-shrink-0 shadow-sm">
        <div>
          <h1 className="font-extrabold text-stone-900 text-lg flex items-center gap-2">
            <FiMapPin className="text-forest-700" /> Geographic Map Explorer
          </h1>
          <p className="text-xs text-stone-500">
            Interactive view of all 10 verified destinations within 25 km of Ragama Hub
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge bg-forest-100 text-forest-900 border border-forest-200 px-3 py-1 text-xs font-bold">
            <FiCompass className="w-3.5 h-3.5" />
            {attractions.length} destinations
          </span>
        </div>
      </div>

      {/* Full-height map container */}
      <div className="flex-1 p-4">
        {isLoading ? (
          <LoadingSection message="Preparing spatial map and routes..." />
        ) : (
          <div className="h-full rounded-2xl overflow-hidden shadow-card-nature border border-stone-200">
            <InteractiveMap attractions={attractions} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPage;
