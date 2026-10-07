import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Calendar,
  Phone,
  Clock,
  MapPin,
  Lock,
  LogOut,
  User,
  Stethoscope,
  ClipboardList,
  Menu,
  X,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    clinicInfo,
    currentStaffUser,
    logout,
    setIsLoginModalOpen,
    setIsBookingModalOpen,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="no-print bg-slate-950 text-white sticky top-0 z-40 shadow-xl border-b border-slate-800">
      {/* Top Clinical Announcement Strip */}
      <div className="bg-slate-900 border-b border-slate-800/80 text-[11px] text-slate-400 py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              <span>Tanish Orchid, Charholi Bk., Pune</span>
            </span>
            <span className="hidden sm:flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>{clinicInfo.openingHours}</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href={`tel:${clinicInfo.phone.replace(/\s+/g, '')}`}
              className="flex items-center space-x-1 text-teal-300 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-teal-400" />
              <span>{clinicInfo.phone}</span>
            </a>
            <span className="text-slate-600 hidden md:inline">|</span>
            <a
              href={`tel:${clinicInfo.secondaryPhone.replace(/\s+/g, '')}`}
              className="hidden md:flex items-center space-x-1 text-slate-300 hover:text-white transition-colors"
            >
              <span>{clinicInfo.secondaryPhone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveView('public-home')}
          className="flex items-center space-x-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-teal-500 to-sky-400 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-serif tracking-tight text-lg sm:text-xl font-bold text-white">
                CLASSIC SMILE
              </span>
              <span className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-sm bg-teal-500/20 text-teal-300 border border-teal-400/30">
                DENTAL CARE & IMPLANTS
              </span>
            </div>
            <p className="text-[10px] text-teal-300/80 font-sans tracking-wide">
              {clinicInfo.tagline}
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-2 text-xs font-semibold">
          <button
            onClick={() => setActiveView('public-home')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeView === 'public-home'
                ? 'bg-slate-800 text-sky-400 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Clinic Portfolio
          </button>

          {/* If logged in as Doctor */}
          {currentStaffUser?.role === 'doctor' && (
            <button
              onClick={() => setActiveView('doctor-chair')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
                activeView === 'doctor-chair'
                  ? 'bg-sky-600 text-white font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Doctor Console</span>
            </button>
          )}

          {/* If logged in as Receptionist */}
          {currentStaffUser?.role === 'receptionist' && (
            <button
              onClick={() => setActiveView('reception-desk')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
                activeView === 'reception-desk'
                  ? 'bg-sky-600 text-white font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>Reception Desk</span>
            </button>
          )}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center space-x-3">
          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-linear-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Visit</span>
          </button>

          {/* Staff Auth Button / Badge */}
          {currentStaffUser ? (
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
              <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-slate-200">{currentStaffUser.name}</span>
                <span className="text-[10px] text-slate-400 capitalize">({currentStaffUser.role})</span>
              </div>
              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-900 rounded-xl transition-colors cursor-pointer"
                title="Logout from Staff Portal"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 font-semibold text-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-sky-400" />
              <span>Staff Login</span>
            </button>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center space-x-2">
          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-sky-500 text-white font-bold text-xs"
          >
            Book
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white rounded-xl bg-slate-900"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 p-4 space-y-3 bg-slate-950 text-xs">
          <button
            onClick={() => {
              setActiveView('public-home');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 font-semibold text-slate-200"
          >
            Clinic Portfolio
          </button>

          {currentStaffUser?.role === 'doctor' && (
            <button
              onClick={() => {
                setActiveView('doctor-chair');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 font-bold text-sky-400"
            >
              Doctor Console & Rx
            </button>
          )}

          {currentStaffUser?.role === 'receptionist' && (
            <button
              onClick={() => {
                setActiveView('reception-desk');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 font-bold text-sky-400"
            >
              Reception Desk Queue
            </button>
          )}

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            {currentStaffUser ? (
              <div className="flex items-center justify-between w-full">
                <span className="text-slate-300 font-bold">{currentStaffUser.name}</span>
                <button onClick={logout} className="text-red-400 font-bold">
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsLoginModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 bg-slate-900 text-sky-400 rounded-xl font-bold text-center"
              >
                Staff Login (Doctor / Reception)
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
