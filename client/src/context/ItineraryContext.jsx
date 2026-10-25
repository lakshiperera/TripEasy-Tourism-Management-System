import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const ItineraryContext = createContext(null);

// Reference point: Ragama
export const REFERENCE_POINT = { lat: 7.0305, lng: 79.9217, name: 'Ragama' };
const DEFAULT_VISIT_DURATION = 45; // minutes per attraction
const TOUR_START_HOUR = 8; // Depart from Ragama at 8:00 AM
const AVG_SPEED_KMH = 30; // average city driving speed

/**
 * Calculate straight-line distance between two lat/lng points (Haversine formula)
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Returns the best recommended visit time window for an attraction
 * based on its category and opening hours data.
 */
export const getBestVisitTime = (attraction) => {
  const category = attraction.category?.slug || attraction.category?.name?.toLowerCase() || '';
  const isFree = attraction.entranceFee?.isFree;

  // Category-based best-time logic
  if (category.includes('hiking') || category.includes('nature')) {
    return { label: 'Early Morning', time: '6:00 AM – 9:00 AM', icon: '🌅', reason: 'Cooler temperatures & better views' };
  }
  if (category.includes('religious')) {
    return { label: 'Morning', time: '7:00 AM – 10:00 AM', icon: '🙏', reason: 'Peaceful atmosphere before crowds' };
  }
  if (category.includes('heritage')) {
    return { label: 'Morning', time: '8:00 AM – 11:00 AM', icon: '🏛️', reason: 'Best lighting for photography & exploration' };
  }
  if (category.includes('restaurant') || category.includes('dining')) {
    return { label: 'Lunchtime', time: '12:00 PM – 2:00 PM', icon: '🍽️', reason: 'Peak menu availability & fresh service' };
  }
  if (category.includes('sightseeing')) {
    return { label: 'Afternoon', time: '2:00 PM – 5:00 PM', icon: '🎡', reason: 'Ideal light & leisure pace' };
  }
  // Default fallback
  return { label: 'Morning', time: '8:00 AM – 11:00 AM', icon: '☀️', reason: 'Generally best time to visit' };
};

/**
 * Suggests an optimised visit order for itinerary items.
 * Strategy: nearest-first (greedy TSP) starting from Ragama,
 * with restaurants pushed toward midday and hiking/nature pushed first.
 */
export const suggestOptimalOrder = (items) => {
  if (items.length <= 1) return items;

  const remaining = [...items];
  const ordered = [];
  let currentLat = REFERENCE_POINT.lat;
  let currentLng = REFERENCE_POINT.lng;

  // Priority sort: hiking/nature first, restaurants last
  const priority = (item) => {
    const cat = item.category?.slug || item.category?.name?.toLowerCase() || '';
    if (cat.includes('hiking') || cat.includes('nature')) return 0;
    if (cat.includes('religious') || cat.includes('heritage')) return 1;
    if (cat.includes('sightseeing')) return 2;
    if (cat.includes('restaurant')) return 10; // push to end
    return 5;
  };

  while (remaining.length > 0) {
    // Find the nearest unvisited attraction (weighted by priority)
    let bestIdx = 0;
    let bestScore = Infinity;

    remaining.forEach((item, idx) => {
      const [lng, lat] = item.location.coordinates;
      const dist = calculateDistance(currentLat, currentLng, lat, lng);
      const score = dist + priority(item) * 2; // blend distance + priority
      if (score < bestScore) {
        bestScore = score;
        bestIdx = idx;
      }
    });

    const chosen = remaining.splice(bestIdx, 1)[0];
    ordered.push(chosen);
    const [lng, lat] = chosen.location.coordinates;
    currentLat = lat;
    currentLng = lng;
  }

  return ordered;
};

/**
 * Computes a scheduled arrival & departure time for each itinerary item.
 * @param {Array} items - Itinerary attractions
 * @param {number} startMinutes - Minutes from midnight for departure (default 8:00 AM = 480)
 * Returns array of { arrivalMinutes, departureMinutes, travelMinutes, distKm } for each stop.
 */
export const computeSchedule = (items, startMinutes = TOUR_START_HOUR * 60) => {
  let currentMinutes = startMinutes;
  let currentLat = REFERENCE_POINT.lat;
  let currentLng = REFERENCE_POINT.lng;

  return items.map((item) => {
    const [lng, lat] = item.location.coordinates;
    const distKm = calculateDistance(currentLat, currentLng, lat, lng);
    const travelMinutes = Math.round((distKm / AVG_SPEED_KMH) * 60);
    const arrivalMinutes = currentMinutes + travelMinutes;
    const visitDuration = item.travelInfo?.estimatedVisitDuration || DEFAULT_VISIT_DURATION;
    const departureMinutes = arrivalMinutes + visitDuration;

    currentLat = lat;
    currentLng = lng;
    currentMinutes = departureMinutes;

    return { arrivalMinutes, departureMinutes, travelMinutes, distKm: parseFloat(distKm.toFixed(1)) };
  });
};

/**
 * Converts total minutes-from-midnight to a human-readable 12h time string.
 */
export const formatScheduleTime = (totalMinutes) => {
  const h24 = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  const ampm = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
};

/**
 * ItineraryProvider — manages day-visit itinerary state
 * Persisted in sessionStorage (FR-25)
 */
export const ItineraryProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = sessionStorage.getItem('tripeasy_itinerary');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist to sessionStorage on change
  useEffect(() => {
    sessionStorage.setItem('tripeasy_itinerary', JSON.stringify(items));
  }, [items]);

  const addItem = (attraction) => {
    if (items.find((i) => i._id === attraction._id)) {
      toast.error(`${attraction.name} is already in your itinerary`);
      return;
    }
    setItems((prev) => [...prev, attraction]);
    toast.success(`Added: ${attraction.name}`, { icon: '📍' });
  };

  const removeItem = (attractionId) => {
    setItems((prev) => prev.filter((i) => i._id !== attractionId));
    toast.success('Removed from itinerary');
  };

  const clearItinerary = () => {
    setItems([]);
    toast.success('Itinerary cleared');
  };

  const isInItinerary = (attractionId) => items.some((i) => i._id === attractionId);

  /**
   * Re-orders itinerary items using the smart optimal-order algorithm
   * and shows a toast notification with the suggested starting attraction.
   */
  const applySuggestedOrder = () => {
    if (items.length < 2) return;
    const optimised = suggestOptimalOrder(items);
    setItems(optimised);
    toast.success(
      `✨ Start with: ${optimised[0].name}`,
      { icon: '🗺️', duration: 4000 }
    );
  };

  // Calculate totals
  const stats = React.useMemo(() => {
    if (items.length === 0) return { totalDistance: 0, totalTime: 0 };

    // Total distance: reference → first attraction → ... → last
    let totalDistance = 0;
    let prev = { lat: REFERENCE_POINT.lat, lng: REFERENCE_POINT.lng };

    items.forEach((attraction) => {
      const [lng, lat] = attraction.location.coordinates;
      totalDistance += calculateDistance(prev.lat, prev.lng, lat, lng);
      prev = { lat, lng };
    });

    // Total time: travel + visit durations
    const avgSpeedKmh = 30; // avg city driving speed
    const travelTimeMinutes = (totalDistance / avgSpeedKmh) * 60;
    const visitTimeMinutes = items.reduce(
      (sum, a) => sum + (a.travelInfo?.estimatedVisitDuration || DEFAULT_VISIT_DURATION),
      0
    );

    return {
      totalDistance: parseFloat(totalDistance.toFixed(1)),
      totalTime: Math.round(travelTimeMinutes + visitTimeMinutes),
    };
  }, [items]);

  return (
    <ItineraryContext.Provider value={{ items, addItem, removeItem, clearItinerary, isInItinerary, stats, applySuggestedOrder }}>
      {children}
    </ItineraryContext.Provider>
  );
};

export const useItinerary = () => {
  const context = useContext(ItineraryContext);
  if (!context) throw new Error('useItinerary must be used within ItineraryProvider');
  return context;
};
