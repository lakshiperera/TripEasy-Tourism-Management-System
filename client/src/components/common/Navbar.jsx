import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useItinerary } from '../../context/ItineraryContext';
import BrandLogo from './BrandLogo';
import {
  FiCompass,
  FiMap,
  FiList,
  FiInfo,
  FiShield,
  FiMenu,
  FiX,
  FiArrowRight,
} from 'react-icons/fi';

/**
 * Tourist-facing Navigation Header
 * Features Earthy Forest & Outdoor Green theme, TripEasy brand logo, and react-icons
 */
const Navbar = () => {
  const location = useLocation();
  const { items } = useItinerary();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Explore Places', icon: <FiCompass className="w-4 h-4" /> },
    { to: '/map', label: 'Interactive Map', icon: <FiMap className="w-4 h-4" /> },
    {
      to: '/itinerary',
      label: 'Day Itinerary',
      icon: <FiList className="w-4 h-4" />,
      badge: items.length,
    },
    { to: '/about', label: 'About Region', icon: <FiInfo className="w-4 h-4" /> },
  ];

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-50 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-18 py-2">
          {/* Brand Logo */}
          <BrandLogo size="md" variant="dark" />

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    active
                      ? 'bg-emerald-50 text-emerald-900 shadow-sm border border-emerald-200'
                      : 'text-stone-600 hover:text-emerald-900 hover:bg-emerald-50/50'
                  }`}
                >
                  <span className={active ? 'text-emerald-600' : 'text-stone-400'}>
                    {link.icon}
                  </span>
                  <span>{link.label}</span>

                  {link.badge > 0 && (
                    <span className="ml-1 min-w-[20px] h-5 bg-emerald-600 text-white text-[11px] rounded-full flex items-center justify-center font-bold px-1.5 shadow-sm">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Action: Admin Access Link + Mobile Menu Toggle */}
          <div className="flex items-center gap-2">
            <Link
              to="/admin/login"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-white bg-emerald-50 hover:bg-emerald-600 border border-emerald-200 px-3.5 py-1.5 rounded-xl transition-all shadow-sm"
              title="Admin Portal"
            >
              <FiShield className="w-3.5 h-3.5 text-emerald-600 hover:text-white" />
              <span>Admin</span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-stone-50 border-b border-stone-200 px-4 pt-2 pb-5 space-y-2 animate-slide-up">
          {navLinks.map((link) => {
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all ${
                  active
                    ? 'bg-forest-900 text-stone-50 font-semibold'
                    : 'text-stone-700 hover:bg-stone-200/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={active ? 'text-sage-300' : 'text-stone-400'}>
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                </div>
                {link.badge > 0 && (
                  <span
                    className={`min-w-[22px] h-[22px] text-xs rounded-full flex items-center justify-center font-bold px-1.5 ${
                      active ? 'bg-forest-700 text-white' : 'bg-forest-900 text-white'
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-2 border-t border-stone-200">
            <Link
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-600 hover:bg-stone-200/60"
            >
              <div className="flex items-center gap-2">
                <FiShield className="w-4 h-4 text-forest-700" />
                <span>Admin Management Portal</span>
              </div>
              <FiArrowRight className="w-4 h-4 text-stone-400" />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
