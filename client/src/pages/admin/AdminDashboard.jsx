import React, { useState, useEffect, useMemo } from 'react';
import { attractionService, categoryService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import AttractionFormModal from '../../components/admin/AttractionFormModal';
import CategoryManager from '../../components/admin/CategoryManager';
import BrandLogo from '../../components/common/BrandLogo';
import { Spinner } from '../../components/common/LoadingStates';
import { initialCategories, initialAttractions } from '../../data/fallbackData';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiLogOut,
  FiMapPin,
  FiLayers,
  FiEye,
  FiEyeOff,
  FiGrid,
  FiCompass,
  FiExternalLink,
  FiChevronDown,
  FiChevronUp,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

/**
 * Admin Dashboard — Attraction and Category Management
 * Categorizes places under categories with Earthy Forest theme
 */
const AdminDashboard = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const [attractions, setAttractions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('attractions'); // 'attractions' | 'categories'
  const [attractionView, setAttractionView] = useState('byCategory'); // 'byCategory' | 'table'
  const [modal, setModal] = useState({ open: false, attraction: null });
  const [deletingId, setDeletingId] = useState(null);
  const [collapsedCategories, setCollapsedCategories] = useState({});

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [attrRes, catRes] = await Promise.all([
        attractionService.getAll({ isActive: 'false' }),
        categoryService.getAll(),
      ]);
      const attrs = attrRes.data?.data || [];
      const cats = catRes.data?.data || [];
      setAttractions(attrs);
      setCategories(cats);
      localStorage.setItem('tripeasy_admin_attractions', JSON.stringify(attrs));
      localStorage.setItem('tripeasy_admin_categories', JSON.stringify(cats));
    } catch (err) {
      console.warn('API / DB offline, loaded standalone offline data:', err);
      const savedAttrs = localStorage.getItem('tripeasy_admin_attractions');
      const savedCats = localStorage.getItem('tripeasy_admin_categories');
      if (savedAttrs && savedCats) {
        try {
          setAttractions(JSON.parse(savedAttrs));
          setCategories(JSON.parse(savedCats));
        } catch {
          setAttractions(initialAttractions);
          setCategories(initialCategories);
        }
      } else {
        setAttractions(initialAttractions);
        setCategories(initialCategories);
        localStorage.setItem('tripeasy_admin_attractions', JSON.stringify(initialAttractions));
        localStorage.setItem('tripeasy_admin_categories', JSON.stringify(initialCategories));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This action cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await attractionService.delete(id);
    } catch {
      console.info('Deleted locally in offline mode');
    }
    toast.success(`Deleted: ${name}`);
    setAttractions((prev) => {
      const updated = prev.filter((a) => a._id !== id);
      localStorage.setItem('tripeasy_admin_attractions', JSON.stringify(updated));
      return updated;
    });
    setDeletingId(null);
  };

  const handleToggleActive = async (attraction) => {
    try {
      await attractionService.update(attraction._id, { isActive: !attraction.isActive });
    } catch {
      console.info('Toggled locally in offline mode');
    }
    setAttractions((prev) => {
      const updated = prev.map((a) => (a._id === attraction._id ? { ...a, isActive: !a.isActive } : a));
      localStorage.setItem('tripeasy_admin_attractions', JSON.stringify(updated));
      return updated;
    });
    toast.success(`Attraction ${attraction.isActive ? 'hidden from public' : 'made visible'}`);
  };

  const handleFormSuccess = () => {
    setModal({ open: false, attraction: null });
    loadData();
  };

  const toggleCategoryCollapse = (catId) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  // Filtered attractions
  const filteredAttractions = useMemo(() => {
    return attractions.filter(
      (a) =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.category?.name?.toLowerCase().includes(search.toLowerCase()) ||
        a.location?.address?.toLowerCase().includes(search.toLowerCase())
    );
  }, [attractions, search]);

  // Group filtered attractions under categories
  const categorizedPlaces = useMemo(() => {
    const map = new Map();
    categories.forEach((cat) => {
      map.set(cat._id.toString(), {
        ...cat,
        places: [],
      });
    });

    const unassigned = [];
    filteredAttractions.forEach((attr) => {
      const catId = attr.category?._id?.toString() || attr.category?.toString();
      if (catId && map.has(catId)) {
        map.get(catId).places.push(attr);
      } else {
        unassigned.push(attr);
      }
    });

    const groups = Array.from(map.values());
    if (unassigned.length > 0) {
      groups.push({
        _id: 'unassigned',
        name: 'Unassigned Category',
        icon: '📁',
        color: '#6c6150',
        places: unassigned,
      });
    }
    return groups;
  }, [filteredAttractions, categories]);

  const stats = {
    total: attractions.length,
    active: attractions.filter((a) => a.isActive).length,
    categories: categories.length,
    hidden: attractions.filter((a) => !a.isActive).length,
  };

  return (
    <div className="min-h-screen bg-[#fbfdfc] flex flex-col font-sans">
      {/* Admin Header: Modern Light Green */}
      <header className="bg-white/95 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-40 shadow-sm text-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" variant="dark" showTagline={false} />
            <div className="h-6 w-px bg-emerald-200" />
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Admin Portal
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-500 hidden sm:inline">
              Signed in as <strong className="text-emerald-950 font-bold">{admin?.username || 'Admin'}</strong>
            </span>
            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors shadow-sm"
            >
              <FiExternalLink className="w-3.5 h-3.5 text-emerald-600" />
              <span>View Site</span>
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors shadow-sm"
            >
              <FiLogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex-1">
        {/* Admin Portal Panoramic Hero with Admin Background Image */}
        <div className="relative rounded-3xl overflow-hidden mb-8 shadow-card-nature border border-emerald-200/90">
          <div className="absolute inset-0 z-0">
            <img
              src="/images/admin-portal-bg.webp"
              alt="Admin Portal Background"
              className="w-full h-full object-cover object-center filter brightness-[0.9] contrast-[1.05]"
            />
            {/* Modern Light Green Frosted Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-900/80 to-teal-950/75 backdrop-blur-[1px]" />
          </div>

          <div className="relative z-10 p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold backdrop-blur-md mb-3 border border-emerald-400/30">
                <FiCompass className="w-3.5 h-3.5" />
                <span>Destination Management Center</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                TripEasy Admin Management Portal
              </h1>
              <p className="text-emerald-100/90 text-sm mt-1 max-w-xl">
                Curate day-trip destinations, manage category taxonomy, and oversee tourist exploration across Gampaha District.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setModal({ open: true, attraction: null })}
                className="btn-primary bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg shadow-emerald-950/40 text-sm font-semibold px-4 py-2.5 rounded-xl border border-emerald-300/30 transition-all flex items-center gap-2"
              >
                <FiPlus className="w-4 h-4" />
                <span>Add Destination</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Row: Modern Light Green */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-5 bg-white border border-emerald-100 shadow-sm hover:border-emerald-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/70 flex items-center justify-center mb-3">
              <FiMapPin className="w-5 h-5" />
            </div>
            <p className="text-3xl font-extrabold text-stone-900">{stats.total}</p>
            <p className="text-xs text-stone-500 font-medium">Total Destinations</p>
          </div>

          <div className="card p-5 bg-white border border-emerald-100 shadow-sm hover:border-emerald-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white flex items-center justify-center mb-3 shadow-sm">
              <FiEye className="w-5 h-5" />
            </div>
            <p className="text-3xl font-extrabold text-stone-900">{stats.active}</p>
            <p className="text-xs text-stone-500 font-medium">Active (Public)</p>
          </div>

          <div className="card p-5 bg-white border border-emerald-100 shadow-sm hover:border-emerald-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/70 flex items-center justify-center mb-3">
              <FiLayers className="w-5 h-5" />
            </div>
            <p className="text-3xl font-extrabold text-stone-900">{stats.categories}</p>
            <p className="text-xs text-stone-500 font-medium">Categories</p>
          </div>

          <div className="card p-5 bg-white border border-emerald-100 shadow-sm hover:border-emerald-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-600 flex items-center justify-center mb-3">
              <FiEyeOff className="w-5 h-5" />
            </div>
            <p className="text-3xl font-extrabold text-stone-900">{stats.hidden}</p>
            <p className="text-xs text-stone-500 font-medium">Draft / Hidden</p>
          </div>
        </div>

        {/* Tab Navigation: Attractions vs Categories */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div className="flex gap-1.5 bg-emerald-50/80 border border-emerald-100 p-1.5 rounded-2xl w-fit">
            <button
              onClick={() => setActiveTab('attractions')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'attractions'
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-sm'
                  : 'text-stone-700 hover:text-emerald-800 hover:bg-emerald-100/50'
              }`}
            >
              <FiMapPin className="w-4 h-4" />
              <span>Attractions ({attractions.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'categories'
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-sm'
                  : 'text-stone-700 hover:text-emerald-800 hover:bg-emerald-100/50'
              }`}
            >
              <FiLayers className="w-4 h-4" />
              <span>Categories ({categories.length})</span>
            </button>
          </div>

          {activeTab === 'attractions' && (
            <button
              onClick={() => setModal({ open: true, attraction: null })}
              className="btn-primary"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add New Attraction</span>
            </button>
          )}
        </div>

        {/* Attractions Tab */}
        {activeTab === 'attractions' && (
          <div className="space-y-6">
            {/* Toolbar & View Mode */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3.5 rounded-2xl border border-stone-200/90 shadow-sm">
              <div className="relative w-full sm:max-w-md">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search attractions by name or address..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input pl-10 h-10"
                />
              </div>

              {/* View Switcher: Categorized vs Table */}
              <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl self-end sm:self-auto border border-stone-200">
                <button
                  onClick={() => setAttractionView('byCategory')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    attractionView === 'byCategory'
                      ? 'bg-forest-900 text-stone-50 shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <FiLayers className="w-3.5 h-3.5" />
                  <span>Categorized View</span>
                </button>
                <button
                  onClick={() => setAttractionView('table')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    attractionView === 'table'
                      ? 'bg-forest-900 text-stone-50 shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <FiGrid className="w-3.5 h-3.5" />
                  <span>Master Table</span>
                </button>
              </div>
            </div>

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-center py-16">
                <Spinner size="lg" />
              </div>
            )}

            {/* 1. CATEGORIZED VIEW: Grouped under Category Cards */}
            {!isLoading && attractionView === 'byCategory' && (
              <div className="space-y-6">
                {categorizedPlaces.map((category) => {
                  const isCollapsed = !!collapsedCategories[category._id];
                  return (
                    <div
                      key={category._id}
                      className="card bg-white border border-stone-200/90 shadow-sm overflow-hidden"
                    >
                      {/* Category Group Header */}
                      <div
                        onClick={() => toggleCategoryCollapse(category._id)}
                        className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-stone-50/70 transition-colors border-b border-stone-100"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm"
                            style={{
                              backgroundColor: `${category.color || '#355637'}15`,
                              border: `2px solid ${category.color || '#355637'}`,
                            }}
                          >
                            {category.icon || '🌿'}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-stone-900 text-base sm:text-lg">
                                {category.name}
                              </h3>
                              <span
                                className="badge text-white text-xs px-2.5 py-0.5"
                                style={{ backgroundColor: category.color || '#355637' }}
                              >
                                {category.places.length} places
                              </span>
                            </div>
                            <p className="text-xs text-stone-500 mt-0.5">
                              {category.description || 'Places in this category'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setModal({
                                open: true,
                                attraction: { category: category._id },
                              });
                            }}
                            className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-forest-800 hover:text-forest-950 bg-forest-50 hover:bg-forest-100 px-3 py-1.5 rounded-lg border border-forest-200 transition-colors"
                          >
                            <FiPlus className="w-3.5 h-3.5" />
                            <span>Add here</span>
                          </button>
                          <span className="text-stone-400 p-1">
                            {isCollapsed ? <FiChevronDown className="w-5 h-5" /> : <FiChevronUp className="w-5 h-5" />}
                          </span>
                        </div>
                      </div>

                      {/* Places List under this category */}
                      {!isCollapsed && (
                        <div className="p-4 sm:p-5 bg-stone-50/40">
                          {category.places.length === 0 ? (
                            <p className="text-sm text-stone-400 italic py-4 text-center">
                              No attractions currently categorized under "{category.name}".
                            </p>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {category.places.map((place) => (
                                <div
                                  key={place._id}
                                  className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex flex-col justify-between hover:border-forest-300 transition-colors"
                                >
                                  <div>
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                      <h4 className="font-bold text-stone-900 text-sm leading-snug line-clamp-2">
                                        {place.name}
                                      </h4>
                                      <button
                                        onClick={() => handleToggleActive(place)}
                                        className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                                          place.isActive
                                            ? 'bg-forest-100 text-forest-800'
                                            : 'bg-stone-200 text-stone-600'
                                        }`}
                                        title="Click to toggle visibility"
                                      >
                                        {place.isActive ? <><FiEye /> Live</> : <><FiEyeOff /> Draft</>}
                                      </button>
                                    </div>
                                    <p className="text-xs text-stone-500 line-clamp-2 mb-3">
                                      {place.description}
                                    </p>
                                    <div className="text-xs text-stone-600 space-y-1 mb-3">
                                      <p className="flex items-center gap-1.5">
                                        <FiCompass className="text-forest-600 w-3.5 h-3.5" />
                                        <span>{place.travelInfo?.distanceFromRagama || 0} km from Ragama</span>
                                      </p>
                                      <p className="flex items-center gap-1.5">
                                        <FiMapPin className="text-forest-600 w-3.5 h-3.5" />
                                        <span className="truncate">{place.location?.address || 'Gampaha'}</span>
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                                    <Link
                                      to={`/attraction/${place._id}`}
                                      target="_blank"
                                      className="p-1.5 text-stone-500 hover:text-forest-800 hover:bg-forest-50 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1"
                                      title="Preview page"
                                    >
                                      <FiExternalLink className="w-3.5 h-3.5" />
                                      <span>Preview</span>
                                    </Link>
                                    <button
                                      onClick={() => setModal({ open: true, attraction: place })}
                                      className="p-1.5 text-stone-600 hover:text-forest-900 hover:bg-forest-50 rounded-lg transition-colors"
                                      title="Edit"
                                    >
                                      <FiEdit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDelete(place._id, place.name)}
                                      disabled={deletingId === place._id}
                                      className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                      title="Delete"
                                    >
                                      {deletingId === place._id ? <Spinner size="sm" /> : <FiTrash2 className="w-4 h-4" />}
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* 2. MASTER TABLE VIEW */}
            {!isLoading && attractionView === 'table' && (
              <div className="card overflow-hidden bg-white border border-stone-200/90 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-stone-100/70 border-b border-stone-200 text-stone-700">
                        <th className="text-left px-5 py-3 font-semibold">#</th>
                        <th className="text-left px-5 py-3 font-semibold">Name & Description</th>
                        <th className="text-left px-5 py-3 font-semibold hidden sm:table-cell">Category</th>
                        <th className="text-left px-5 py-3 font-semibold hidden md:table-cell">Distance</th>
                        <th className="text-left px-5 py-3 font-semibold">Status</th>
                        <th className="text-right px-5 py-3 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAttractions.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-12 text-stone-400">
                            {search ? 'No attractions match your search.' : 'No attractions registered yet.'}
                          </td>
                        </tr>
                      ) : (
                        filteredAttractions.map((attraction, index) => (
                          <tr
                            key={attraction._id}
                            className="border-b border-stone-100 hover:bg-stone-50/70 transition-colors"
                          >
                            <td className="px-5 py-3.5 text-stone-400 font-mono text-xs">{index + 1}</td>
                            <td className="px-5 py-3.5 max-w-xs">
                              <p className="font-bold text-stone-900 line-clamp-1">{attraction.name}</p>
                              <p className="text-xs text-stone-500 line-clamp-1">
                                {attraction.description?.substring(0, 70)}...
                              </p>
                            </td>
                            <td className="px-5 py-3.5 hidden sm:table-cell">
                              {attraction.category && (
                                <span
                                  className="badge text-white text-xs px-2.5 py-0.5"
                                  style={{ backgroundColor: attraction.category.color || '#355637' }}
                                >
                                  {attraction.category.icon} {attraction.category.name}
                                </span>
                              )}
                            </td>
                            <td className="px-5 py-3.5 text-stone-600 hidden md:table-cell text-xs font-medium">
                              {attraction.travelInfo?.distanceFromRagama || 0} km
                            </td>
                            <td className="px-5 py-3.5">
                              <button
                                onClick={() => handleToggleActive(attraction)}
                                className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
                                  attraction.isActive
                                    ? 'bg-forest-100 text-forest-800 hover:bg-red-100 hover:text-red-700'
                                    : 'bg-stone-200 text-stone-600 hover:bg-forest-100 hover:text-forest-800'
                                }`}
                              >
                                {attraction.isActive ? <><FiEye /> Active</> : <><FiEyeOff /> Hidden</>}
                              </button>
                            </td>
                            <td className="px-5 py-3.5">
                              <div className="flex items-center justify-end gap-1.5">
                                <Link
                                  to={`/attraction/${attraction._id}`}
                                  target="_blank"
                                  className="p-1.5 text-stone-500 hover:text-forest-800 hover:bg-forest-50 rounded-lg transition-colors"
                                  title="View page"
                                >
                                  <FiExternalLink className="w-4 h-4" />
                                </Link>
                                <button
                                  onClick={() => setModal({ open: true, attraction })}
                                  className="p-1.5 text-stone-500 hover:text-forest-800 hover:bg-forest-50 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <FiEdit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(attraction._id, attraction.name)}
                                  disabled={deletingId === attraction._id}
                                  className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  {deletingId === attraction._id ? <Spinner size="sm" /> : <FiTrash2 className="w-4 h-4" />}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <CategoryManager categories={categories} onUpdate={loadData} />
        )}
      </div>

      {/* Attraction Form Modal */}
      {modal.open && (
        <AttractionFormModal
          attraction={modal.attraction}
          categories={categories}
          onClose={() => setModal({ open: false, attraction: null })}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
