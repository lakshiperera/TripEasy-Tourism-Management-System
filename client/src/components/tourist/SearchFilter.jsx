import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

/**
 * SearchBar Component
 * Styled in Earthy Forest & Outdoor Green theme
 */
const SearchBar = ({ value, onChange, placeholder = 'Search attractions...' }) => {
  const handleClear = () => onChange('');

  return (
    <div className="relative shadow-sm rounded-xl">
      <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-11 h-12 bg-white text-stone-900 text-sm font-medium rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-forest-600 transition-all placeholder:text-stone-400"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors p-1"
          aria-label="Clear search"
        >
          <FiX className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

/**
 * CategoryFilter Component
 * Pill filters for category selection in Earthy Forest colors
 */
export const CategoryFilter = ({ categories, activeCategory, onSelect }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
      <button
        onClick={() => onSelect('all')}
        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 border whitespace-nowrap flex items-center gap-1.5 shadow-sm ${
          activeCategory === 'all'
            ? 'bg-forest-900 text-stone-50 border-forest-900'
            : 'bg-white text-stone-700 border-stone-200 hover:border-forest-300 hover:text-forest-900 hover:bg-stone-50'
        }`}
      >
        <span>🗺️</span>
        <span>All Categories</span>
      </button>

      {categories.map((cat) => {
        const isActive = activeCategory === cat._id;
        return (
          <button
            key={cat._id}
            onClick={() => onSelect(cat._id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 border whitespace-nowrap flex items-center gap-1.5 shadow-sm ${
              isActive
                ? 'text-white border-transparent shadow-md scale-105'
                : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300 hover:text-stone-900 hover:bg-stone-50'
            }`}
            style={
              isActive
                ? { backgroundColor: cat.color || '#355637', borderColor: cat.color || '#355637' }
                : {}
            }
          >
            <span>{cat.icon || '🌿'}</span>
            <span>{cat.name}</span>
            {cat.attractionCount !== undefined && (
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-black/20 text-white' : 'bg-stone-100 text-stone-500'
                }`}
              >
                {cat.attractionCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default SearchBar;
