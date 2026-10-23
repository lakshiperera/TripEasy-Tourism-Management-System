import React, { useState, useEffect, useMemo } from 'react';
import { attractionService, categoryService } from '../../services';
import AttractionCard from '../../components/tourist/AttractionCard';
import SearchBar, { CategoryFilter } from '../../components/tourist/SearchFilter';
import ItineraryPanel from '../../components/tourist/ItineraryPanel';
import InteractiveMap from '../../components/tourist/InteractiveMap';
import { AttractionCardSkeleton, EmptyState } from '../../components/common/LoadingStates';
import {
  FiGrid,
  FiMap,
  FiLayers,
  FiSliders,
  FiCompass,
  FiCalendar,
  FiMapPin,
  FiChevronRight,
} from 'react-icons/fi';

/**
 * Tourist Discovery Dashboard
 * Categorizes places under categories with Earthy Forest & Outdoor Green theme
 */
const DiscoverPage = () => {
  const [attractions, setAttractions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('categories'); // 'categories' | 'grid' | 'map'
  const [mapAttractions, setMapAttractions] = useState([]);

  // Load categories and map data on mount
  useEffect(() => {
    categoryService.getAll().then((res) => setCategories(res.data.data || []));
    attractionService.getForMap().then((res) => setMapAttractions(res.data.data || []));
  }, []);

  // Fetch attractions on search / category filter change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAttractions();
    }, 250);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, activeCategory]);

  const fetchAttractions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {};
      if (search) params.search = search;
      if (activeCategory !== 'all') params.category = activeCategory;
      const res = await attractionService.getAll(params);
      setAttractions(res.data.data || []);
    } catch (err) {
      setError('Failed to load attractions. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSearch('');
    setActiveCategory('all');
  };

  const hasFilters = search || activeCategory !== 'all';

  // Group attractions under categories for the categorized dashboard view
  const categorizedGroups = useMemo(() => {
    if (!attractions.length) return [];

    // Map categories by ID
    const catMap = new Map();
    categories.forEach((cat) => {
      catMap.set(cat._id.toString(), {
        ...cat,
        places: [],
      });
    });

    // Bucket attractions
    const uncategorized = [];
    attractions.forEach((attraction) => {
      const catId = attraction.category?._id?.toString() || attraction.category?.toString();
      if (catId && catMap.has(catId)) {
        catMap.get(catId).places.push(attraction);
      } else {
        uncategorized.push(attraction);
      }
    });

    const groups = Array.from(catMap.values()).filter((g) => g.places.length > 0);
    if (uncategorized.length > 0) {
      groups.push({
        _id: 'uncategorized',
        name: 'Other Attractions',
        icon: '📍',
        color: '#6c6150',
        description: 'General places of interest',
        places: uncategorized,
      });
    }
    return groups;
  }, [attractions, categories]);

  return (
    <div className="min-h-screen bg-[#fbfdfc]">
      {/* Hero Section: Top Banner Image with Modern Light Green Frosted Overlay */}
      <section className="relative overflow-hidden text-stone-100 py-16 sm:py-24 px-4 sm:px-6 shadow-sm">
        {/* Banner Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/banner-image.jpg"
            alt="TripEasy Gampaha Hero Banner"
            className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.05]"
          />
          {/* Light Green Modern Frosted Glass Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/85 via-emerald-900/75 to-emerald-950/85 backdrop-blur-[1.5px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/95 via-transparent to-emerald-950/40" />
        </div>

        {/* Soft Modern Emerald Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-green-400/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-semibold mb-5 shadow-sm backdrop-blur-md">
            <FiCompass className="w-3.5 h-3.5 text-emerald-300" />
            <span>Eco-Tourism & Cultural Heritage Planner</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight leading-tight text-white drop-shadow-sm">
            Explore Gampaha's <span className="text-emerald-300 font-serif italic">Hidden Gems</span>
          </h1>

          <p className="text-emerald-100/90 text-base sm:text-lg max-w-2xl mx-auto mb-8 font-normal leading-relaxed drop-shadow-sm">
            Discover sacred temples, botanical sanctuaries, coastal beaches, and panoramic peaks
            curated within a 25 km radius of Ragama.
          </p>

          {/* Search bar anchored in hero */}
          <div className="max-w-xl mx-auto">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search by name, cave, temple, beach, or park..."
            />
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Left Content: Category Filters + Categorized Places */}
          <div className="flex-1 min-w-0">
            {/* View Bar & Controls */}
            <div className="bg-white p-3.5 rounded-2xl border border-stone-200/90 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Category Filter Pills */}
              <div className="flex-1 overflow-x-auto pb-1">
                <CategoryFilter
                  categories={categories}
                  activeCategory={activeCategory}
                  onSelect={setActiveCategory}
                />
              </div>

              {/* View Mode Switcher */}
              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl flex-shrink-0 border border-stone-200">
                <button
                  onClick={() => setViewMode('categories')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === 'categories'
                      ? 'bg-forest-900 text-stone-50 shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                  title="Categorized Sections"
                >
                  <FiLayers className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">By Category</span>
                </button>

                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === 'grid'
                      ? 'bg-forest-900 text-stone-50 shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                  title="Grid View"
                >
                  <FiGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Grid</span>
                </button>

                <button
                  onClick={() => setViewMode('map')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === 'map'
                      ? 'bg-forest-900 text-stone-50 shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                  title="Map View"
                >
                  <FiMap className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Map</span>
                </button>
              </div>
            </div>

            {/* Results count & status banner */}
            {!isLoading && (
              <div className="flex items-center justify-between text-xs text-stone-500 mb-5 px-1">
                <p>
                  Showing <strong className="text-forest-900 font-bold">{attractions.length}</strong>{' '}
                  attraction{attractions.length !== 1 ? 's' : ''}
                  {hasFilters ? ' matching current filter' : ' across Gampaha District'}
                </p>
                {hasFilters && (
                  <button
                    onClick={handleReset}
                    className="text-forest-700 hover:text-forest-900 font-semibold underline"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}

            {/* Interactive Map View */}
            {viewMode === 'map' && (
              <div className="h-[550px] rounded-2xl overflow-hidden shadow-card-nature border border-stone-200/90 mb-6">
                <InteractiveMap attractions={mapAttractions} />
              </div>
            )}

            {/* Loading Skeleton */}
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <AttractionCardSkeleton key={i} />
                  ))}
              </div>
            )}

            {/* Error State */}
            {!isLoading && error && (
              <EmptyState
                icon="⚠️"
                title="Failed to Load Places"
                message={error}
                action={
                  <button onClick={fetchAttractions} className="btn-primary">
                    Retry Loading
                  </button>
                }
              />
            )}

            {/* Empty State */}
            {!isLoading && !error && attractions.length === 0 && (
              <EmptyState
                icon="🌲"
                title="No Attractions Found"
                message={
                  hasFilters
                    ? 'No places match your search query or selected category.'
                    : 'No attractions are currently available in the database.'
                }
                action={
                  hasFilters && (
                    <button onClick={handleReset} className="btn-primary">
                      <FiSliders className="w-4 h-4" /> Reset Filters
                    </button>
                  )
                }
              />
            )}

            {/* 1. CATEGORIZED VIEW: Places grouped under Category Sections */}
            {!isLoading && !error && attractions.length > 0 && viewMode === 'categories' && (
              <div className="space-y-10">
                {categorizedGroups.map((group) => (
                  <section
                    key={group._id}
                    className="bg-stone-100/50 rounded-2xl p-5 sm:p-6 border border-stone-200/80 shadow-sm"
                  >
                    {/* Category Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-stone-200/70">
                      <div className="flex items-center gap-3">
                        <span
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm"
                          style={{
                            backgroundColor: `${group.color || '#355637'}18`,
                            border: `2px solid ${group.color || '#355637'}`,
                          }}
                        >
                          {group.icon || '🌿'}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-stone-900">{group.name}</h2>
                            <span
                              className="badge px-2.5 py-0.5 text-white text-[11px] shadow-sm font-semibold"
                              style={{ backgroundColor: group.color || '#355637' }}
                            >
                              {group.places.length} {group.places.length === 1 ? 'place' : 'places'}
                            </span>
                          </div>
                          {group.description && (
                            <p className="text-xs text-stone-500 mt-0.5">{group.description}</p>
                          )}
                        </div>
                      </div>

                      {/* Filter by this category quick action */}
                      {activeCategory === 'all' && (
                        <button
                          onClick={() => setActiveCategory(group._id)}
                          className="text-xs font-semibold text-forest-700 hover:text-forest-900 flex items-center gap-1 self-start sm:self-auto"
                        >
                          <span>Only this category</span>
                          <FiChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Places Grid in Category */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                      {group.places.map((attraction) => (
                        <AttractionCard key={attraction._id} attraction={attraction} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}

            {/* 2. FLAT GRID VIEW */}
            {!isLoading && !error && attractions.length > 0 && viewMode === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {attractions.map((attraction) => (
                  <AttractionCard key={attraction._id} attraction={attraction} />
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar: Day Itinerary Planner & Mini Map */}
          <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0">
            <div className="sticky top-24 space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                    <FiCalendar className="text-forest-700" />
                    <span>Day Itinerary Builder</span>
                  </h2>
                  <span className="text-[11px] font-semibold text-forest-700 bg-forest-50 px-2 py-0.5 rounded-full border border-forest-200">
                    Ragama Hub
                  </span>
                </div>
                <ItineraryPanel />
              </div>

              {/* Mini Map Preview */}
              <div className="bg-white p-3 rounded-2xl border border-stone-200/90 shadow-sm">
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                    <FiMapPin className="text-forest-600 w-3.5 h-3.5" /> Route Map
                  </span>
                  <span className="text-[10px] text-stone-400">10 Locations</span>
                </div>
                <div className="h-52 rounded-xl overflow-hidden border border-stone-200">
                  <InteractiveMap attractions={mapAttractions} />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default DiscoverPage;
