'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Phone, Calendar, Stethoscope, User, MapPin, MessageSquare, ClipboardList, Lock } from 'lucide-react';

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
  </svg>
);

export const MobileBottomNav: React.FC = () => {
  const {
    activeView,
    setActiveView,
    clinicInfo,
    currentStaffUser,
    setIsBookingModalOpen,
    setIsLoginModalOpen,
  } = useApp();

  const rawPhone = clinicInfo.phone.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${rawPhone}?text=${encodeURIComponent(
    'Hello Classic Smile Dental Care, I would like to inquire about booking an appointment.'
  )}`;

  return (
    <aside
      aria-label="Mobile quick navigation"
      className="no-print fixed bottom-0 inset-x-0 z-40 md:hidden bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/80 px-3 py-2 shadow-2xl transition-all"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 items-center gap-1">
        {/* 1. Services / Home */}
        <button
          type="button"
          onClick={() => {
            setActiveView('public-home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-95 touch-manipulation cursor-pointer ${
            activeView === 'public-home' ? 'text-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Stethoscope className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5">Services</span>
        </button>

        {/* 2. Doctor Profile / Console */}
        {currentStaffUser?.role === 'doctor' ? (
          <button
            type="button"
            onClick={() => setActiveView('doctor-chair')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-95 touch-manipulation cursor-pointer ${
              activeView === 'doctor-chair' ? 'text-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-5 h-5 text-teal-400" />
            <span className="text-[10px] tracking-tight mt-0.5 font-bold">Console</span>
          </button>
        ) : currentStaffUser?.role === 'receptionist' ? (
          <button
            type="button"
            onClick={() => setActiveView('reception-desk')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-95 touch-manipulation cursor-pointer ${
              activeView === 'reception-desk' ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ClipboardList className="w-5 h-5 text-sky-400" />
            <span className="text-[10px] tracking-tight mt-0.5 font-bold">Desk</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setActiveView('doctor-info');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-95 touch-manipulation cursor-pointer ${
              activeView === 'doctor-info' ? 'text-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-0.5">Doctor</span>
          </button>
        )}

        {/* 3. Central Fast Booking CTA */}
        <button
          type="button"
          onClick={() => setIsBookingModalOpen(true)}
          className="flex flex-col items-center justify-center -mt-4 bg-linear-to-tr from-teal-500 to-sky-500 text-white rounded-2xl p-2.5 shadow-lg shadow-teal-500/30 active:scale-90 transition-transform touch-manipulation cursor-pointer"
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-wider mt-0.5">Book</span>
        </button>

        {/* 4. WhatsApp Chat */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1 text-emerald-400 hover:text-emerald-300 transition-all active:scale-95 touch-manipulation"
        >
          <WhatsAppIcon className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5">Chat</span>
        </a>

        {/* 5. Staff Access / Workspace Login */}
        {currentStaffUser ? (
          <button
            type="button"
            onClick={() => {
              setActiveView(currentStaffUser.role === 'doctor' ? 'doctor-chair' : 'reception-desk');
            }}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-95 touch-manipulation cursor-pointer ${
              activeView === 'doctor-chair' || activeView === 'reception-desk'
                ? 'text-teal-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Stethoscope className="w-5 h-5 text-teal-400" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 font-bold">Portal</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsLoginModalOpen(true)}
            className="flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-95 touch-manipulation cursor-pointer text-slate-400 hover:text-teal-300"
          >
            <Lock className="w-5 h-5 text-teal-400" />
            <span className="text-[10px] tracking-tight mt-0.5 font-bold text-teal-300">Staff</span>
          </button>
        )}
      </div>
    </aside>
  );
};
