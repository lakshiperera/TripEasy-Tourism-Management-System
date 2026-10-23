import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const ItineraryContext = createContext(null);

// Reference point: Ragama
export const REFERENCE_POINT = { lat: 7.0305, lng: 79.9897, name: 'Ragama' };
const DEFAULT_VISIT_DURATION = 45; // minutes per attraction

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
    <ItineraryContext.Provider value={{ items, addItem, removeItem, clearItinerary, isInItinerary, stats }}>
      {children}
    </ItineraryContext.Provider>
  );
};

export const useItinerary = () => {
  const context = useContext(ItineraryContext);
  if (!context) throw new Error('useItinerary must be used within ItineraryProvider');
  return context;
};
