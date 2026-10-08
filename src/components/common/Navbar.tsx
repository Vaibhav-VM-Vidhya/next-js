'use client';

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
      {/* Top Clinical Announcement Strip (desktop only to preserve mobile screen height) */}
      <div className="hidden sm:block bg-slate-900 border-b border-slate-800/80 text-[10px] sm:text-[11px] text-slate-400 py-1.5 px-3 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center space-x-3 truncate">
            <span className="flex items-center space-x-1.5 text-slate-300 truncate">
              <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-teal-400 shrink-0" />
              <span className="truncate">Tanish Orchid, Charholi Bk., Pune</span>
            </span>
            <span className="hidden md:flex items-center space-x-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{clinicInfo.openingHours}</span>
            </span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
            <a
              href={`tel:${clinicInfo.phone.replace(/[^0-9+]/g, '')}`}
              className="flex items-center space-x-1 text-teal-300 hover:text-white transition-colors font-bold active:scale-95"
            >
              <Phone className="w-3 h-3 text-teal-400" />
              <span>{clinicInfo.phone}</span>
            </a>
            <span className="text-slate-600 hidden md:inline">|</span>
            <a
              href={`tel:${clinicInfo.secondaryPhone.replace(/[^0-9+]/g, '')}`}
              className="hidden md:flex items-center space-x-1 text-slate-300 hover:text-white transition-colors"
            >
              <span>{clinicInfo.secondaryPhone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => {
            setActiveView('public-home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group select-none active:scale-95 transition-transform shrink min-w-0"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-linear-to-tr from-teal-500 to-sky-400 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950 font-bold" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="font-serif tracking-tight text-sm sm:text-xl font-bold text-white whitespace-nowrap">
                CLASSIC SMILE
              </span>
              <span className="hidden md:inline-block text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-sm bg-teal-500/20 text-teal-300 border border-teal-400/30 shrink-0">
                DENTAL CARE & IMPLANTS
              </span>
            </div>
            <p className="text-[9px] sm:text-[10px] text-teal-300/80 font-sans tracking-wide truncate">
              Charholi, Pune
            </p>
          </div>
        </div>

        {/* Right CTA Actions for Desktop */}
        <div className="hidden md:flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setActiveView(activeView === 'doctor-info' ? 'public-home' : 'doctor-info')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeView === 'doctor-info'
                ? 'bg-teal-950 text-teal-300 border border-teal-500/50'
                : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
            }`}
          >
            Doctor Profile
          </button>

          <button
            type="button"
            onClick={() => setIsBookingModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-linear-to-r from-teal-500 to-sky-500 hover:from-teal-600 hover:to-sky-600 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Visit</span>
          </button>

          {/* Staff Auth Button / Quick Switcher */}
          {currentStaffUser ? (
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
              {currentStaffUser.role === 'doctor' && (
                <button
                  type="button"
                  onClick={() =>
                    setActiveView(activeView === 'doctor-chair' ? 'public-home' : 'doctor-chair')
                  }
                  className="px-3 py-1.5 rounded-xl bg-teal-950/80 border border-teal-500/40 text-teal-300 hover:text-white hover:bg-teal-900 font-semibold text-xs flex items-center space-x-1 transition-colors cursor-pointer"
                >
                  <Stethoscope className="w-3.5 h-3.5 text-teal-400" />
                  <span>{activeView === 'doctor-chair' ? 'View Website' : 'Doctor Console'}</span>
                </button>
              )}

              {currentStaffUser.role === 'receptionist' && (
                <button
                  type="button"
                  onClick={() =>
                    setActiveView(activeView === 'reception-desk' ? 'public-home' : 'reception-desk')
                  }
                  className="px-3 py-1.5 rounded-xl bg-sky-950/80 border border-sky-500/40 text-sky-300 hover:text-white hover:bg-sky-900 font-semibold text-xs flex items-center space-x-1 transition-colors cursor-pointer"
                >
                  <ClipboardList className="w-3.5 h-3.5 text-sky-400" />
                  <span>{activeView === 'reception-desk' ? 'View Website' : 'Reception Desk'}</span>
                </button>
              )}

              <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-slate-200">{currentStaffUser.name}</span>
                <span className="text-[10px] text-slate-400 capitalize">({currentStaffUser.role})</span>
              </div>

              <button
                type="button"
                onClick={logout}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-900 rounded-xl transition-colors cursor-pointer"
                title="Logout from Staff Portal"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsLoginModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 font-semibold text-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-teal-400" />
              <span>Staff Login</span>
            </button>
          )}
        </div>

        {/* Mobile Header Right Actions (Sleek, direct staff access, book & menu) */}
        <div className="md:hidden flex items-center space-x-1.5 shrink-0">
          {/* Quick Staff Button on Mobile Header */}
          {currentStaffUser ? (
            <button
              type="button"
              onClick={() =>
                setActiveView(
                  currentStaffUser.role === 'doctor'
                    ? activeView === 'doctor-chair' ? 'public-home' : 'doctor-chair'
                    : activeView === 'reception-desk' ? 'public-home' : 'reception-desk'
                )
              }
              className="px-2.5 py-1.5 rounded-xl bg-teal-950 border border-teal-500/50 text-teal-300 text-[11px] font-bold flex items-center space-x-1 active:scale-95 cursor-pointer shadow-xs"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                {currentStaffUser.role === 'doctor'
                  ? activeView === 'doctor-chair' ? 'Website' : 'Console'
                  : activeView === 'reception-desk' ? 'Website' : 'Desk'}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsLoginModalOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-teal-300 hover:text-white text-[11px] font-bold flex items-center space-x-1 active:scale-95 cursor-pointer shadow-xs"
              title="Staff Portal Login"
            >
              <Lock className="w-3 h-3 text-teal-400" />
              <span>Staff</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsBookingModalOpen(true)}
            className="px-2.5 py-1.5 rounded-xl bg-linear-to-r from-teal-500 to-sky-500 text-white font-bold text-[11px] shadow-sm active:scale-95 cursor-pointer"
          >
            Book
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-slate-300 hover:text-white rounded-xl bg-slate-900 border border-slate-800 active:scale-95 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-teal-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Modern High-Z Mobile Drawer with Prominent Staff Card */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Sheet */}
          <div className="fixed top-0 right-0 bottom-0 w-4/5 max-w-xs bg-slate-950 border-l border-slate-800 flex flex-col p-4 sm:p-5 space-y-4 shadow-2xl overflow-y-auto overscroll-contain pb-24 z-10">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-teal-500 to-sky-400 flex items-center justify-center font-bold shadow-xs">
                  <Sparkles className="w-4 h-4 text-slate-950 font-black" />
                </div>
                <div>
                  <span className="font-serif font-bold text-white text-sm block leading-tight">CLASSIC SMILE</span>
                  <span className="text-[10px] text-teal-400 block font-semibold">Dental Care & Implants</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* STAFF PORTAL BANNER (Highlighted right at the top of menu!) */}
            <div className="p-3.5 rounded-2xl bg-linear-to-r from-slate-900 to-teal-950/40 border border-teal-500/30 shadow-inner">
              {currentStaffUser ? (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-bold text-white text-xs">{currentStaffUser.name}</span>
                    </div>
                    <span className="text-[10px] text-teal-300 font-bold uppercase bg-teal-950 px-2 py-0.5 rounded-full border border-teal-500/30 capitalize">
                      {currentStaffUser.role}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveView(currentStaffUser.role === 'doctor' ? 'doctor-chair' : 'reception-desk');
                        setMobileMenuOpen(false);
                      }}
                      className="py-2 px-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-xs flex items-center justify-center space-x-1 active:scale-95 cursor-pointer shadow-xs"
                    >
                      <Stethoscope className="w-3.5 h-3.5" />
                      <span>Console</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="py-2 px-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 font-bold text-xs flex items-center justify-center space-x-1 active:scale-95 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 block">
                      Staff Portal
                    </span>
                    <span className="text-xs font-semibold text-slate-200 block">
                      Doctor & Reception
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLoginModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-md active:scale-95 cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Login</span>
                  </button>
                </div>
              )}
            </div>

            {/* Navigation Options */}
            <div className="space-y-2 flex-1">
              <button
                type="button"
                onClick={() => {
                  setActiveView('public-home');
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`w-full text-left p-3 rounded-xl font-bold text-xs flex items-center space-x-3 transition-colors cursor-pointer ${
                  activeView === 'public-home'
                    ? 'bg-teal-950/80 text-teal-300 border border-teal-500/40'
                    : 'text-slate-200 bg-slate-900/60 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Home & Clinical Services</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveView('doctor-info');
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`w-full text-left p-3 rounded-xl font-bold text-xs flex items-center space-x-3 transition-colors cursor-pointer ${
                  activeView === 'doctor-info'
                    ? 'bg-teal-950/80 text-teal-300 border border-teal-500/40'
                    : 'text-slate-200 bg-slate-900/60 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <User className="w-4 h-4 text-teal-400 shrink-0" />
                <div>
                  <span className="block">Doctor Profile (Portfolio)</span>
                  <span className="text-[10px] text-slate-400 font-normal">Dr. Abhishek V. Kamble (BDS, MDS)</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsBookingModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left p-3 rounded-xl font-bold text-xs bg-linear-to-r from-teal-500 to-sky-500 text-white shadow-md flex items-center space-x-3 active:scale-95 cursor-pointer"
              >
                <Calendar className="w-4 h-4 shrink-0" />
                <span>Book Appointment (Instant Slot)</span>
              </button>
            </div>

            {/* Quick Contact & Details */}
            <div className="pt-3 border-t border-slate-800 space-y-2.5 text-xs text-slate-300">
              <a
                href={`tel:${clinicInfo.phone.replace(/[^0-9+]/g, '')}`}
                className="flex items-center space-x-2 text-teal-300 font-semibold p-2.5 rounded-xl bg-slate-900"
              >
                <Phone className="w-3.5 h-3.5 text-teal-400" />
                <span>{clinicInfo.phone}</span>
              </a>
              <div className="px-2.5 py-1 text-[11px] text-slate-400 flex items-center space-x-2">
                <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{clinicInfo.openingHours}</span>
              </div>
              <div className="px-2.5 py-1 text-[11px] text-slate-400 flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>{clinicInfo.address}, {clinicInfo.city}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
