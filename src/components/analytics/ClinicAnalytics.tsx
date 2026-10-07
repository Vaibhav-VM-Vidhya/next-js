import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Building2,
  Calendar,
  Award,
  Layers,
} from 'lucide-react';

export const ClinicAnalytics: React.FC = () => {
  const { doctors, branches, invoices, appointments, patients } = useApp();

  const totalRevenue = invoices.reduce((s, i) => s + i.paidAmount, 0);
  const avgTicketSize = Math.round(totalRevenue / (invoices.length || 1));

  // Category revenue split
  const proceduresStats = [
    { name: 'Computer-Guided Implants', revenue: 63000, percentage: 42, color: 'bg-indigo-500' },
    { name: 'Porcelain Aesthetic Veneers', revenue: 50000, percentage: 33, color: 'bg-purple-500' },
    { name: 'Microscope Endodontics (RCT)', revenue: 19500, percentage: 13, color: 'bg-amber-500' },
    { name: 'Laser Whitening & Hygiene', revenue: 17000, percentage: 12, color: 'bg-sky-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Analytics Overview Top Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Cleared Revenue</span>
          <div className="text-2xl font-black text-slate-900 mt-1 flex items-center justify-between">
            <span>₹{totalRevenue.toLocaleString('en-IN')}</span>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">+18.4% vs last month</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Average Case Value</span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            ₹{avgTicketSize.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">High-yield restorative procedures</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Active Patients</span>
          <div className="text-2xl font-black text-slate-900 mt-1 flex items-center justify-between">
            <span>{patients.length}</span>
            <Users className="w-5 h-5 text-sky-500" />
          </div>
          <span className="text-[11px] text-sky-600 font-semibold mt-0.5 block">94% treatment plan acceptance</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Chair Utilization Rate</span>
          <div className="text-2xl font-black text-slate-900 mt-1 flex items-center justify-between">
            <span>87.5%</span>
            <Activity className="w-5 h-5 text-amber-500" />
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Optimal operatory occupancy</span>
        </div>
      </div>

      {/* Mid Section: Treatment Distribution & Multi-Doctor Production */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Treatment Distribution */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-4 flex items-center space-x-2">
            <Layers className="w-4 h-4 text-sky-600" />
            <span>Revenue by Clinical Discipline</span>
          </h3>

          <div className="space-y-4">
            {proceduresStats.map((item, idx) => (
              <div key={idx} className="space-y-1.5 text-xs">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-800">{item.name}</span>
                  <span className="text-slate-900">
                    ₹{item.revenue.toLocaleString('en-IN')} ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Multi-Doctor Production Roster */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-4 flex items-center space-x-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Multi-Doctor Production & Efficiency</span>
          </h3>

          <div className="divide-y divide-slate-100">
            {doctors.map((doc) => (
              <div key={doc.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <img
                    src={doc.avatar}
                    alt={doc.name}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div>
                    <strong className="text-slate-900 block font-bold">{doc.name}</strong>
                    <span className="text-[11px] text-slate-400">{doc.specialization}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-slate-900 block">
                    ⭐ {doc.rating} Rating
                  </span>
                  <span className="text-[11px] text-emerald-600 font-semibold block">
                    {doc.reviewsCount} Cases Completed
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Multi-Branch Comparison */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-4 flex items-center space-x-2">
          <Building2 className="w-4 h-4 text-sky-600" />
          <span>Multi-Branch Operational Metrics</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {branches.map((b) => (
            <div key={b.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <strong className="text-slate-900 font-bold block mb-1 text-sm">{b.name}</strong>
              <p className="text-slate-500 mb-3">{b.city}</p>
              <div className="space-y-1.5 border-t border-slate-200 pt-2 text-slate-600">
                <div className="flex justify-between">
                  <span>Operatory Chairs:</span>
                  <strong className="text-slate-800">{b.chairsCount} Chairs</strong>
                </div>
                <div className="flex justify-between">
                  <span>Operating Status:</span>
                  <span className="font-bold text-emerald-600">Full Capacity</span>
                </div>
                <div className="flex justify-between">
                  <span>Patient Rating:</span>
                  <span className="font-bold text-amber-600">4.96 / 5.0</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
