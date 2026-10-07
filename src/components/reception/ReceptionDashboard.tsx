import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppointmentStatus } from '../../types';
import {
  Users,
  Calendar,
  Clock,
  CheckCircle,
  UserPlus,
  Search,
  Filter,
  Stethoscope,
  X,
  Phone,
  CheckCircle2,
} from 'lucide-react';

export const ReceptionDashboard: React.FC = () => {
  const {
    appointments,
    updateAppointmentStatus,
    createAppointment,
    doctors,
    clinicInfo,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Walk-in form state
  const [walkinName, setWalkinName] = useState('');
  const [walkinPhone, setWalkinPhone] = useState('');
  const [walkinService, setWalkinService] = useState('Toothache / Emergency Evaluation');
  const [walkinDoctorId, setWalkinDoctorId] = useState(doctors[0]?.id || 'doc-abhishek');
  const [walkinTime, setWalkinTime] = useState('Immediate / Walk-In');
  const [walkinNotes, setWalkinNotes] = useState('');

  const filteredAppointments = appointments.filter((a) => {
    const matchesSearch =
      a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.patientPhone.includes(searchTerm) ||
      a.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const countInChair = appointments.filter((a) => a.status === 'in-chair').length;
  const countCheckedIn = appointments.filter((a) => a.status === 'checked-in').length;
  const countScheduled = appointments.filter((a) => a.status === 'scheduled').length;
  const countCompleted = appointments.filter((a) => a.status === 'completed').length;

  const handleRegisterWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkinName.trim() || !walkinPhone.trim()) return;

    const doc = doctors.find((d) => d.id === walkinDoctorId) || doctors[0];

    createAppointment({
      patientName: walkinName.trim(),
      patientPhone: walkinPhone.trim(),
      doctorId: doc.id,
      doctorName: doc.name,
      date: new Date().toISOString().split('T')[0],
      time: walkinTime === 'Immediate / Walk-In' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : walkinTime,
      service: walkinService,
      status: 'checked-in',
      notes: walkinNotes ? `Walk-in: ${walkinNotes}` : 'Walk-in registered at front desk.',
    });

    setIsRegisterOpen(false);
    setWalkinName('');
    setWalkinPhone('');
    setWalkinNotes('');
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'in-chair':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
            In Chair
          </span>
        );
      case 'checked-in':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-300">
            Checked In
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            Completed
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
            Scheduled
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Front-Desk Overview Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">In Operatory Chair</span>
          <div className="text-2xl font-black text-amber-600 mt-1 flex items-center justify-between">
            <span>{countInChair}</span>
            <Stethoscope className="w-5 h-5 text-amber-400" />
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Active treatment</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Waiting in Lounge</span>
          <div className="text-2xl font-black text-sky-600 mt-1 flex items-center justify-between">
            <span>{countCheckedIn}</span>
            <Users className="w-5 h-5 text-sky-400" />
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Checked in & ready</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Scheduled Today</span>
          <div className="text-2xl font-black text-slate-800 mt-1 flex items-center justify-between">
            <span>{countScheduled}</span>
            <Calendar className="w-5 h-5 text-slate-400" />
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Confirmed visits</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Completed Sessions</span>
          <div className="text-2xl font-black text-emerald-600 mt-1 flex items-center justify-between">
            <span>{countCompleted}</span>
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Discharged patients</span>
        </div>
      </div>

      {/* Control Bar: Search, Status Filter, Walk-In Button */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3 flex-1 min-w-[280px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search patient name, phone, or service..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center space-x-1.5">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-700"
            >
              <option value="all">All Appointments</option>
              <option value="in-chair">In Chair</option>
              <option value="checked-in">Checked In</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => setIsRegisterOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Register Walk-In Patient</span>
        </button>
      </div>

      {/* Queue Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-800">
            Today's Front-Desk Schedule ({filteredAppointments.length})
          </h3>
          <span className="text-xs text-slate-500">{clinicInfo.name}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Time</th>
                <th className="px-6 py-3.5">Patient Details</th>
                <th className="px-6 py-3.5">Doctor</th>
                <th className="px-6 py-3.5">Treatment Requested</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    No appointments found matching your filter.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-3.5 font-bold text-slate-900">{apt.time}</td>

                    <td className="px-6 py-3.5">
                      <strong className="text-slate-900 font-bold block">{apt.patientName}</strong>
                      <div className="text-[11px] text-slate-400 flex items-center space-x-1 mt-0.5">
                        <Phone className="w-3 h-3" />
                        <span>{apt.patientPhone}</span>
                      </div>
                    </td>

                    <td className="px-6 py-3.5 font-medium text-slate-800">{apt.doctorName}</td>

                    <td className="px-6 py-3.5">
                      <span className="font-medium text-slate-800">{apt.service}</span>
                      {apt.notes && (
                        <p className="text-[10px] text-slate-400 italic truncate max-w-xs">{apt.notes}</p>
                      )}
                    </td>

                    <td className="px-6 py-3.5">
                      {getStatusBadge(apt.status)}
                    </td>

                    <td className="px-6 py-3.5 text-right space-x-1.5">
                      {apt.status === 'scheduled' && (
                        <button
                          onClick={() => updateAppointmentStatus(apt.id, 'checked-in')}
                          className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-[11px] shadow-xs cursor-pointer"
                        >
                          Check In
                        </button>
                      )}

                      {apt.status === 'checked-in' && (
                        <button
                          onClick={() => updateAppointmentStatus(apt.id, 'in-chair')}
                          className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] shadow-xs cursor-pointer"
                        >
                          Send to Chair
                        </button>
                      )}

                      {apt.status === 'in-chair' && (
                        <button
                          onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs cursor-pointer"
                        >
                          Mark Done
                        </button>
                      )}

                      {apt.status === 'completed' && (
                        <span className="text-emerald-700 font-bold text-[11px] inline-flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Done</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fast Walk-In Registration Modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Register Immediate Walk-In Patient</h3>
              <button
                onClick={() => setIsRegisterOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterWalkIn} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 mb-1 block">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  value={walkinName}
                  onChange={(e) => setWalkinName(e.target.value)}
                  placeholder="e.g. Suresh Shinde"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 block">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={walkinPhone}
                  onChange={(e) => setWalkinPhone(e.target.value)}
                  placeholder="+91 98000 00000"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 block">Attending Doctor</label>
                <select
                  value={walkinDoctorId}
                  onChange={(e) => setWalkinDoctorId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.specialization})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 block">Treatment / Complaint</label>
                <input
                  type="text"
                  value={walkinService}
                  onChange={(e) => setWalkinService(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 block">Notes / Allergy Warning</label>
                <input
                  type="text"
                  value={walkinNotes}
                  onChange={(e) => setWalkinNotes(e.target.value)}
                  placeholder="e.g. Penicillin allergy, severe throbbing pain"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  Register & Check-In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
