import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { PublicHome } from './components/public/PublicHome';
import { BookingModal } from './components/public/BookingModal';
import { ReceptionDashboard } from './components/reception/ReceptionDashboard';
import { DoctorDesk } from './components/doctor/DoctorDesk';

const AppContent: React.FC = () => {
  const { activeView } = useApp();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeView === 'public-home' && <PublicHome />}
        {activeView === 'public-booking' && <BookingModal />}
        {activeView === 'reception-desk' && <ReceptionDashboard />}
        {(activeView === 'doctor-chair' || activeView === 'odontogram' || activeView === 'prescriptions') && (
          <DoctorDesk />
        )}
      </main>

      {/* Global Clean Clinical Footer */}
      <footer className="no-print bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-serif font-bold text-white tracking-wider text-sm">
              CLASSIC SMILE
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Centre for Advanced Dentistry & Oral Surgery • All rights reserved
            </p>
          </div>
          <div className="flex items-center space-x-6 text-[11px]">
            <span>📞 Direct Desk: +1 (555) 234-8890</span>
            <span>📍 Suite 400, Platinum Towers, Metropolis</span>
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
