import React from 'react';
import { useApp, AppView } from '../../context/AppContext';
import {
  Sparkles,
  Calendar,
  Smile,
  FileText,
  Globe,
  ClipboardList,
  Phone,
  Clock,
  MapPin,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeView, setActiveView, currentBranch } = useApp();

  const navItems: { view: AppView; label: string; icon: React.ReactNode }[] = [
    { view: 'public-home', label: 'Home', icon: <Globe className="w-4 h-4" /> },
    { view: 'public-booking', label: 'Book Appointment', icon: <Calendar className="w-4 h-4" /> },
    { view: 'odontogram', label: 'Dental Odontogram', icon: <Smile className="w-4 h-4" /> },
    { view: 'appointments', label: 'Appointments & Queue', icon: <ClipboardList className="w-4 h-4" /> },
    { view: 'prescriptions', label: 'Prescriptions', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <header className="no-print bg-slate-900 text-white sticky top-0 z-40 shadow-md border-b border-slate-800">
      {/* Top Clinical Announcement / Contact Info Strip */}
      <div className="bg-slate-950/80 border-b border-slate-800/80 text-[11px] text-slate-400 py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span>{currentBranch.name} ({currentBranch.city})</span>
            </span>
            <span className="hidden sm:flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mon - Sat: 8:00 AM - 8:00 PM</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="tel:+15552348890"
              className="flex items-center space-x-1 text-sky-300 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-sky-400" />
              <span>Call Us: +1 (555) 234-8890</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveView('public-home')}
          className="flex items-center space-x-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-sky-500 to-teal-400 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-serif tracking-wider text-xl font-bold text-white">
                CLASSIC SMILE
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-sm bg-sky-500/20 text-sky-400 border border-sky-400/30">
                CLINIC
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-sans tracking-wide">
              Centre for Advanced Dentistry & Oral Aesthetics
            </p>
          </div>
        </div>

        {/* Primary Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const isActive = activeView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => setActiveView(item.view)}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-sky-600 text-white font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Header Action Button */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveView('public-booking')}
            className="px-4 py-2 rounded-xl bg-linear-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Visit</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Scrollbar */}
      <div className="md:hidden border-t border-slate-800 px-4 py-2 flex space-x-2 overflow-x-auto">
        {navItems.map((item) => {
          const isActive = activeView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => setActiveView(item.view)}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                isActive ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
