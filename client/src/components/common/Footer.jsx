import React from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from './BrandLogo';
import {
  FiMapPin,
  FiCompass,
  FiMail,
  FiGlobe,
  FiShield,
  FiHeart,
  FiArrowUpRight,
} from 'react-icons/fi';

/**
 * Site Footer for TripEasy
 * Features Earthy Forest & Outdoor Green aesthetic, eco-tourism info, and react-icons
 */
const Footer = () => {
  return (
    <footer className="bg-forest-950 text-stone-300 mt-auto border-t border-forest-900 selection:bg-forest-700 selection:text-stone-100">
      {/* Top Banner: Outdoor & Eco-tourism Ethos */}
      <div className="bg-forest-900/60 border-b border-forest-800/80 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-300">
          <div className="flex items-center gap-2">
            <span className="text-base">🌲</span>
            <span className="font-medium">
              Dedicated to eco-friendly, cultural & heritage exploration across Gampaha District.
            </span>
          </div>
          <div className="flex items-center gap-4 text-sage-300">
            <span className="flex items-center gap-1">
              <FiCompass className="w-3.5 h-3.5" /> 25 km Radius from Ragama
            </span>
            <span className="flex items-center gap-1">
              <FiShield className="w-3.5 h-3.5" /> Verified Attraction Data
            </span>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand & Description (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="md" variant="light" />
            <p className="text-sm text-stone-400 leading-relaxed pr-4">
              TripEasy is an open-source, digital day-visit planning platform designed for travelers,
              families, and eco-tourists exploring the prominent and hidden attractions of Gampaha, Sri Lanka.
            </p>
            <div className="p-3.5 bg-forest-900/70 rounded-xl border border-forest-800/80 text-xs text-stone-300 space-y-1">
              <div className="font-semibold text-sage-200 flex items-center gap-1.5">
                <FiCompass className="w-3.5 h-3.5 text-forest-400" /> Reference Point: Ragama Hub
              </div>
              <p className="text-stone-400 text-[11px] leading-relaxed">
                All travel durations and route distances are calculated from central Ragama junction.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-stone-100 text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-forest-400"></span>
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/"
                  className="hover:text-sage-200 transition-colors flex items-center gap-1.5 group"
                >
                  <span>Discover Places</span>
                  <FiArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-sage-400" />
                </Link>
              </li>
              <li>
                <Link
                  to="/map"
                  className="hover:text-sage-200 transition-colors flex items-center gap-1.5 group"
                >
                  <span>Interactive Map</span>
                  <FiArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-sage-400" />
                </Link>
              </li>
              <li>
                <Link
                  to="/itinerary"
                  className="hover:text-sage-200 transition-colors flex items-center gap-1.5 group"
                >
                  <span>Day Itinerary Builder</span>
                  <FiArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-sage-400" />
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-sage-200 transition-colors flex items-center gap-1.5 group"
                >
                  <span>About & Contact</span>
                  <FiArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-sage-400" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold text-stone-100 text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-forest-400"></span>
              Categories
            </h3>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li className="flex items-center gap-2">
                <span>🕌</span>
                <span>Religious Heritage</span>
              </li>
              <li className="flex items-center gap-2">
                <span>🌿</span>
                <span>Botanical & Nature</span>
              </li>
              <li className="flex items-center gap-2">
                <span>⛰️</span>
                <span>Hiking & Peaks</span>
              </li>
              <li className="flex items-center gap-2">
                <span>🏛️</span>
                <span>Cave Temples</span>
              </li>
              <li className="flex items-center gap-2">
                <span>🏖️</span>
                <span>Coastal & Canals</span>
              </li>
            </ul>
          </div>

          {/* Contact & Administration */}
          <div>
            <h3 className="font-bold text-stone-100 text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-forest-400"></span>
              Information
            </h3>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li className="flex items-start gap-2.5">
                <FiMapPin className="text-forest-400 flex-shrink-0 mt-0.5" />
                <span>Gampaha District, Western Province, Sri Lanka</span>
              </li>
              <li className="flex items-center gap-2.5">
                <FiMail className="text-forest-400 flex-shrink-0" />
                <span>info@tripeasy.lk</span>
              </li>
              <li className="flex items-center gap-2.5">
                <FiGlobe className="text-forest-400 flex-shrink-0" />
                <span>www.tripeasy.lk</span>
              </li>
              <li className="pt-2">
                <Link
                  to="/admin/login"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-forest-900 hover:bg-forest-800 text-stone-200 text-xs font-semibold border border-forest-700/60 transition-colors"
                >
                  <FiShield className="w-3.5 h-3.5 text-sage-300" />
                  <span>Admin Access</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Alert */}
        <div className="mt-10 p-4 rounded-xl bg-forest-900/40 border border-forest-800 text-xs text-stone-400 flex items-start gap-3">
          <span className="text-base flex-shrink-0">ℹ️</span>
          <p>
            <strong>Traveler Disclaimer:</strong> Operating hours, entrance fees, and trail conditions
            may vary by season and public holidays. Visitors are encouraged to verify conditions locally
            before embarking on journeys. Respect sacred shrines by adhering to local dress codes.
          </p>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-forest-900 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-stone-400">
          <p>
            © {new Date().getFullYear()} <strong>TripEasy™</strong> — Day Visit Planner. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-stone-400">
            <span>Crafted with</span>
            <FiHeart className="w-3.5 h-3.5 text-red-400 inline mx-0.5" />
            <span>for Gampaha Eco-Tourism & Day Travel</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
