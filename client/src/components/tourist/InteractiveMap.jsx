import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { REFERENCE_POINT } from '../../context/ItineraryContext';
import { FiMapPin, FiArrowRight } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

// Fix Leaflet default icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

/**
 * Create custom colored marker icons for each category
 */
const createCategoryIcon = (color = '#10B981') => {
  return L.divIcon({
    className: '',
    html: `
      <div style="
        width: 32px; height: 32px;
        background-color: ${color};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex; align-items: center; justify-content: center;
      ">
        <div style="transform: rotate(45deg); color: white; font-size: 14px; line-height: 1;">📍</div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -36],
  });
};

// Reference point (Ragama) marker
const referenceIcon = L.divIcon({
  className: '',
  html: `
    <div style="
      width: 36px; height: 36px;
      background-color: #1D4ED8;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      display: flex; align-items: center; justify-content: center;
      font-size: 16px;
    ">🏠</div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -22],
});

/**
 * Automatically sets map bounds to fit all markers
 */
const FitBounds = ({ positions }) => {
  const map = useMap();
  useEffect(() => {
    if (positions && positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [positions, map]);
  return null;
};

/**
 * Interactive Leaflet map component
 * Shows attraction markers, reference point, and optional route polyline
 */
const InteractiveMap = ({ attractions = [], selectedAttraction = null, itineraryItems = [] }) => {
  const center = [REFERENCE_POINT.lat, REFERENCE_POINT.lng];

  // Build polyline for itinerary route
  const routePositions = itineraryItems.length > 0
    ? [
        [REFERENCE_POINT.lat, REFERENCE_POINT.lng],
        ...itineraryItems.map((a) => [a.location.coordinates[1], a.location.coordinates[0]]),
      ]
    : selectedAttraction
    ? [
        [REFERENCE_POINT.lat, REFERENCE_POINT.lng],
        [selectedAttraction.location.coordinates[1], selectedAttraction.location.coordinates[0]],
      ]
    : null;

  const allPositions = [
    center,
    ...attractions.map((a) => [a.location.coordinates[1], a.location.coordinates[0]]),
  ];

  return (
    <MapContainer
      center={center}
      zoom={12}
      className="w-full h-full min-h-[400px] rounded-xl z-0"
      style={{ height: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Fit bounds to all markers */}
      {attractions.length > 0 && <FitBounds positions={allPositions} />}

      {/* Reference point marker */}
      <Marker position={center} icon={referenceIcon}>
        <Popup>
          <div className="p-3 min-w-[160px]">
            <p className="font-semibold text-blue-800 text-sm">📍 {REFERENCE_POINT.name}</p>
            <p className="text-xs text-gray-500 mt-1">Reference Starting Point</p>
          </div>
        </Popup>
      </Marker>

      {/* Route polyline */}
      {routePositions && (
        <Polyline
          positions={routePositions}
          pathOptions={{ color: '#10B981', weight: 3, dashArray: '6 4', opacity: 0.8 }}
        />
      )}

      {/* Attraction markers */}
      {attractions.map((attraction) => {
        const [lng, lat] = attraction.location.coordinates;
        const icon = createCategoryIcon(attraction.category?.color || '#10B981');
        const img = attraction.images?.[0];
        const imgSrc = img ? `${API_URL}${img.url}` : null;

        return (
          <Marker key={attraction._id} position={[lat, lng]} icon={icon}>
            <Popup minWidth={220}>
              <div className="overflow-hidden">
                {imgSrc && (
                  <img
                    src={imgSrc}
                    alt={attraction.name}
                    className="w-full h-28 object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                )}
                <div className="p-3">
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: attraction.category?.color || '#6B7280' }}
                  >
                    {attraction.category?.icon} {attraction.category?.name}
                  </span>
                  <p className="font-semibold text-sm text-gray-900 mt-1.5 leading-snug">
                    {attraction.name}
                  </p>
                  {attraction.travelInfo?.distanceFromRagama && (
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <FiMapPin className="text-emerald-500" />
                      {attraction.travelInfo.distanceFromRagama} km from Ragama
                    </p>
                  )}
                  <Link
                    to={`/attraction/${attraction._id}`}
                    className="mt-2 flex items-center gap-1 text-xs text-emerald-700 font-medium hover:underline"
                  >
                    View details <FiArrowRight />
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default InteractiveMap;
