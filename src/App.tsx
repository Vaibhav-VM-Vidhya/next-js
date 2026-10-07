'use client';

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { PublicHome } from './components/public/PublicHome';
import { ReceptionDashboard } from './components/reception/ReceptionDashboard';
import { DoctorPortal } from './components/doctor/DoctorPortal';
import { DoctorInfoPage } from './components/public/DoctorInfoPage';
import { LoginModal } from './components/auth/LoginModal';
import { QuickBookingModal } from './components/public/QuickBookingModal';
import { AddReviewModal } from './components/public/AddReviewModal';

const AppContent: React.FC = () => {
  const { activeView, clinicInfo } = useApp();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeView === 'public-home' && <PublicHome />}
        {activeView === 'doctor-info' && <DoctorInfoPage />}
        {activeView === 'reception-desk' && <ReceptionDashboard />}
        {activeView === 'doctor-chair' && <DoctorPortal />}
      </main>

      {/* Global Modals */}
      <LoginModal />
      <QuickBookingModal />
      <AddReviewModal />

      {/* Clean Global Clinical Footer */}
      <footer className="no-print bg-slate-950 text-slate-400 border-t border-slate-800 text-xs py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-serif font-bold text-white tracking-wider text-sm">
              {clinicInfo.name}
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {clinicInfo.address}, {clinicInfo.city}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[11px]">
            <span>📞 Call / WhatsApp: <strong className="text-slate-200">{clinicInfo.phone}</strong> | <strong className="text-slate-200">{clinicInfo.secondaryPhone}</strong></span>
            <span>⏰ {clinicInfo.openingHours}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
