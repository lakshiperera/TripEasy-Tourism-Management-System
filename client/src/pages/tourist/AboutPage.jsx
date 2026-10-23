import React from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from '../../components/common/BrandLogo';
import {
  FiMapPin,
  FiMap,
  FiList,
  FiShield,
  FiCompass,
  FiCheckCircle,
} from 'react-icons/fi';

/**
 * About Page
 * Features Earthy Forest & Outdoor Green theme, project purpose, coverage area, and disclaimer
 */
const AboutPage = () => (
  <div className="min-h-screen bg-stone-50 page-enter py-12 px-4 sm:px-6">
    <div className="max-w-4xl mx-auto">
      {/* Hero Header with Banner Background */}
      <div className="relative rounded-3xl overflow-hidden mb-12 shadow-card-nature border border-emerald-100 text-center py-12 px-6">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/banner-image.jpg"
            alt="TripEasy Banner"
            className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-900/80 to-emerald-950/90 backdrop-blur-[1.5px]" />
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex justify-center mb-4">
            <BrandLogo size="lg" variant="light" showTagline={false} to={null} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight">
            About TripEasy
          </h1>
          <p className="text-emerald-100/90 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            An open, organic day-visit guide and itinerary system dedicated to the eco-tourism,
            cultural sites, and hidden gems of the Gampaha District, Sri Lanka.
          </p>
        </div>
      </div>

      {/* Feature Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {[
          {
            icon: <FiMapPin className="w-6 h-6" />,
            title: '10 Curated Places',
            desc: 'Explore temples, historical caves, botanical parks, canals, and beaches classified by thematic categories.',
          },
          {
            icon: <FiMap className="w-6 h-6" />,
            title: 'Interactive Leaflet Map',
            desc: 'Geographic spatial visualization with pinpoint markers, distance radius, and route paths.',
          },
          {
            icon: <FiList className="w-6 h-6" />,
            title: 'Smart Day Planner',
            desc: 'Real-time road transit computation, stop duration estimates, and session persistence.',
          },
        ].map((f, i) => (
          <div
            key={i}
            className="card p-6 bg-white border border-stone-200/90 hover:border-forest-300 transition-all shadow-sm"
          >
            <div className="w-12 h-12 bg-forest-100 text-forest-800 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-forest-200">
              {f.icon}
            </div>
            <h3 className="font-bold text-stone-900 text-base mb-1.5">{f.title}</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Coverage Area & Methodology */}
      <div className="card p-6 sm:p-8 bg-white border border-stone-200 shadow-sm mb-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">📍</span>
          <h2 className="text-lg font-bold text-stone-900">Geographic Scope & Methodology</h2>
        </div>
        <p className="text-sm text-stone-700 leading-relaxed">
          TripEasy focuses on destinations situated within a <strong>25 km radius of Ragama Hub</strong> in
          the Gampaha District, Western Province. Destinations include ancient pre-Christian cave hermitages
          (Pilikuttuwa, Vaarana, Maligatenna), sacred pilgrimage shrines (Tewatta Basilica, Kelaniya Raja Maha Viharaya),
          historic colonial engineering works (Hamilton Dutch Canal), and lush botanical ecosystems
          (Henarathgoda Botanical Garden).
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-stone-600 font-medium">
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center gap-2">
            <FiCheckCircle className="text-forest-700 flex-shrink-0" />
            <span>SLTDA-aligned tourist attraction dataset</span>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center gap-2">
            <FiCheckCircle className="text-forest-700 flex-shrink-0" />
            <span>OpenStreetMap verified GPS coordinates</span>
          </div>
        </div>
      </div>

      {/* Traveler Disclaimer */}
      <div className="bg-stone-100 border border-stone-300 rounded-2xl p-6 mb-10 text-xs sm:text-sm text-stone-700 space-y-2">
        <h3 className="font-bold text-stone-900 flex items-center gap-2 text-sm">
          <FiShield className="text-forest-800" /> Traveler Safety & Verification Notice
        </h3>
        <p className="leading-relaxed text-stone-600">
          TripEasy provides route advice and travel data for educational and tourism planning purposes.
          Estimated driving speeds (~30 km/h) are approximate and subject to road developments and
          monsoonal weather. Travelers should confirm pooja schedules and park holidays locally before
          departure.
        </p>
      </div>

      {/* Bottom CTA */}
      <div className="text-center">
        <Link to="/" className="btn-primary py-3 px-8 text-sm inline-flex items-center gap-2">
          <FiCompass className="w-4 h-4" />
          <span>Begin Exploring Gampaha</span>
        </Link>
      </div>
    </div>
  </div>
);

export default AboutPage;
