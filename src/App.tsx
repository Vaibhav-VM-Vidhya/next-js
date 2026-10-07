import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { PublicHome } from './components/public/PublicHome';
import { BookingModal } from './components/public/BookingModal';
import { OdontogramView } from './components/odontogram/OdontogramView';
import { ReceptionDashboard } from './components/reception/ReceptionDashboard';
import { DoctorDashboard } from './components/doctor/DoctorDashboard';
import { PrescriptionManager } from './components/doctor/PrescriptionManager';
import { XrayManager } from './components/doctor/XrayManager';
import { BillingManager } from './components/billing/BillingManager';
import { CommunicationsManager } from './components/communications/CommunicationsManager';
import { InventoryManager } from './components/inventory/InventoryManager';
import { ClinicAnalytics } from './components/analytics/ClinicAnalytics';
import { ReviewsManager } from './components/reviews/ReviewsManager';

const AppContent: React.FC = () => {
  const { activeView } = useApp();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeView === 'public-home' && <PublicHome />}
        {activeView === 'public-booking' && <BookingModal />}
        {activeView === 'reception-desk' && <ReceptionDashboard />}
        {activeView === 'doctor-chair' && <DoctorDashboard />}
        {activeView === 'odontogram' && <OdontogramView />}
        {activeView === 'prescriptions' && <PrescriptionManager />}
        {activeView === 'xrays' && <XrayManager />}
        {activeView === 'billing' && <BillingManager />}
        {activeView === 'communications' && <CommunicationsManager />}
        {activeView === 'inventory' && <InventoryManager />}
        {activeView === 'analytics' && <ClinicAnalytics />}
        {activeView === 'reviews' && <ReviewsManager />}
      </main>
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
