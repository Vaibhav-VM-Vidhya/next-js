import React from 'react';
import { useApp, AppView } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Sparkles,
  Building2,
  Calendar,
  Stethoscope,
  Smile,
  FileText,
  Image as ImageIcon,
  CreditCard,
  MessageSquare,
  Package,
  BarChart3,
  Star,
  Globe,
  Bell,
  RefreshCw,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    currentUser,
    switchUserRole,
    branches,
    currentBranchId,
    setCurrentBranchId,
    resetToInitialData,
  } = useApp();

  const navItems: { view: AppView; label: string; icon: React.ReactNode; roleRequired?: UserRole[] }[] = [
    { view: 'public-home', label: 'Public Website', icon: <Globe className="w-4 h-4" /> },
    { view: 'public-booking', label: 'Book Appointment', icon: <Calendar className="w-4 h-4" /> },
    { view: 'reception-desk', label: 'Front Desk & Queue', icon: <Building2 className="w-4 h-4" /> },
    { view: 'doctor-chair', label: 'Doctor Chair', icon: <Stethoscope className="w-4 h-4" /> },
    { view: 'odontogram', label: 'Dental Odontogram', icon: <Smile className="w-4 h-4" /> },
    { view: 'prescriptions', label: 'Prescriptions', icon: <FileText className="w-4 h-4" /> },
    { view: 'xrays', label: 'X-Rays & Imaging', icon: <ImageIcon className="w-4 h-4" /> },
    { view: 'billing', label: 'Invoices & Payments', icon: <CreditCard className="w-4 h-4" /> },
    { view: 'communications', label: 'WhatsApp & SMS', icon: <MessageSquare className="w-4 h-4" /> },
    { view: 'inventory', label: 'Inventory', icon: <Package className="w-4 h-4" /> },
    { view: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { view: 'reviews', label: 'Reviews & Follow-up', icon: <Star className="w-4 h-4" /> },
  ];

  return (
    <header className="no-print bg-slate-900 text-white sticky top-0 z-40 shadow-lg border-b border-slate-800">
      {/* Top Bar: Brand, Multi-Branch Selector, Role Switcher */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveView('public-home')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-sky-500 to-teal-400 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-serif tracking-wider text-lg font-bold text-white">
                CLASSIC SMILE
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-sm bg-sky-500/20 text-sky-400 border border-sky-400/30">
                AESTHETICS
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-sans tracking-wide">
              Centre for Advanced Dentistry & Oral Surgery
            </p>
          </div>
        </div>

        {/* Middle: Active Branch Switcher */}
        <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
          <Building2 className="w-4 h-4 text-sky-400" />
          <span className="text-xs text-slate-400 font-medium">Branch:</span>
          <select
            value={currentBranchId}
            onChange={(e) => setCurrentBranchId(e.target.value)}
            className="text-xs font-semibold bg-transparent text-white border-0 focus:ring-0 focus:outline-hidden cursor-pointer"
          >
            {branches.map((b) => (
              <option key={b.id} value={b.id} className="bg-slate-900 text-white">
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Right: Demo Role Switcher & User Profile */}
        <div className="flex items-center space-x-3">
          {/* Role Switcher Pill */}
          <div className="flex items-center bg-slate-800 p-0.5 rounded-xl border border-slate-700">
            <span className="text-[11px] text-slate-400 px-2 font-medium">Demo As:</span>
            {(['admin', 'doctor', 'receptionist', 'patient'] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => switchUserRole(r)}
                className={`px-2.5 py-1 text-xs font-bold capitalize rounded-lg transition-all ${
                  currentUser.role === r
                    ? 'bg-sky-500 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Reset Demo Data Button */}
          <button
            onClick={() => {
              if (window.confirm('Reset all demo data back to default?')) {
                resetToInitialData();
              }
            }}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Reset to initial seed data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none text-xs font-medium">
          {navItems.map((item) => {
            const isActive = activeView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => setActiveView(item.view)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
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
      </div>
    </header>
  );
};
