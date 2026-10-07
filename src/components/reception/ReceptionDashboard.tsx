import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppointmentStatus, Patient } from '../../types';
import {
  Users,
  Calendar,
  Clock,
  CheckCircle,
  MessageSquare,
  UserPlus,
  Search,
  Filter,
  AlertCircle,
  Stethoscope,
  Send,
  Building2,
  Check,
  X,
  CreditCard,
} from 'lucide-react';

export const ReceptionDashboard: React.FC = () => {
  const {
    appointments,
    updateAppointmentStatus,
    sendReminder,
    patients,
    createPatient,
    createAppointment,
    setSelectedPatientId,
    setActiveView,
    doctors,
    currentBranchId,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // New Patient Form State
  const [newPatient, setNewPatient] = useState({
    fullName: '',
    age: 32,
    gender: 'Female' as 'Male' | 'Female' | 'Other',
    phone: '',
    email: '',
    bloodGroup: 'O+',
    allergies: '',
    medicalConditions: '',
  });

  const branchAppointments = appointments.filter((a) => a.branchId === currentBranchId || true);

  const filteredAppointments = branchAppointments.filter((a) => {
    const matchesSearch =
      a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Counters
  const countInChair = branchAppointments.filter((a) => a.status === 'in-chair').length;
  const countCheckedIn = branchAppointments.filter((a) => a.status === 'checked-in').length;
  const countScheduled = branchAppointments.filter((a) => a.status === 'scheduled' || a.status === 'confirmed').length;
  const countCompleted = branchAppointments.filter((a) => a.status === 'completed').length;

  const handleRegisterPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatient.fullName || !newPatient.phone) return;

    const patient = createPatient({
      fullName: newPatient.fullName,
      age: Number(newPatient.age),
      gender: newPatient.gender,
      phone: newPatient.phone,
      email: newPatient.email || `${newPatient.fullName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      bloodGroup: newPatient.bloodGroup,
      branchId: currentBranchId,
      allergies: newPatient.allergies ? newPatient.allergies.split(',').map((s) => s.trim()) : [],
      medicalConditions: newPatient.medicalConditions ? newPatient.medicalConditions.split(',').map((s) => s.trim()) : [],
      emergencyContact: {
        name: newPatient.fullName,
        relationship: 'Self',
        phone: newPatient.phone,
      },
    });

    // Create an immediate walk-in appointment
    createAppointment({
      patientId: patient.id,
      patientName: patient.fullName,
      patientPhone: patient.phone,
      doctorId: doctors[0].id,
      doctorName: doctors[0].name,
      branchId: currentBranchId,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      durationMinutes: 30,
      service: 'Walk-In Consultation & Triage',
      status: 'checked-in',
      type: 'New Consultation',
      notes: 'New walk-in patient registered at front desk.',
    });

    setIsRegisterOpen(false);
    setNewPatient({
      fullName: '',
      age: 32,
      gender: 'Female',
      phone: '',
      email: '',
      bloodGroup: 'O+',
      allergies: '',
      medicalConditions: '',
    });
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'in-chair':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center space-x-1 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>In Chair (Active)</span>
          </span>
        );
      case 'checked-in':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-100 text-sky-800 border border-sky-300 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
            <span>Checked In (Waiting)</span>
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            Completed
          </span>
        );
      case 'confirmed':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-300">
            Confirmed
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
            {status}
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
          <span className="text-[11px] text-slate-500 mt-0.5 block">Under active clinical treatment</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Waiting in Lounge</span>
          <div className="text-2xl font-black text-sky-600 mt-1 flex items-center justify-between">
            <span>{countCheckedIn}</span>
            <Users className="w-5 h-5 text-sky-400" />
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Checked in and ready</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Scheduled Today</span>
          <div className="text-2xl font-black text-slate-800 mt-1 flex items-center justify-between">
            <span>{countScheduled}</span>
            <Calendar className="w-5 h-5 text-slate-400" />
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Upcoming time slots</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Completed Sessions</span>
          <div className="text-2xl font-black text-emerald-600 mt-1 flex items-center justify-between">
            <span>{countCompleted}</span>
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Discharged with prescription</span>
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
              placeholder="Search patient, doctor, or treatment..."
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
              <option value="all">All Statuses</option>
              <option value="in-chair">In Chair</option>
              <option value="checked-in">Checked In</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => setIsRegisterOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Walk-In Patient</span>
        </button>
      </div>

      {/* Queue Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-800">
            Daily Patient Queue & Operatory Allocation
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Showing {filteredAppointments.length} patients
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Patient & MRN</th>
                <th className="px-6 py-3">Time & Chair</th>
                <th className="px-6 py-3">Assigned Specialist</th>
                <th className="px-6 py-3">Service</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Automated Reminders</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAppointments.map((apt) => {
                const patient = patients.find((p) => p.id === apt.patientId);

                return (
                  <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="font-bold text-slate-900">{apt.patientName}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {patient?.mrn || 'WALK-IN'} • {apt.patientPhone}
                      </div>
                      {patient?.allergies && patient.allergies.length > 0 && (
                        <span className="inline-block mt-1 text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.2 rounded">
                          Allergy: {patient.allergies[0]}
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-3.5">
                      <div className="font-bold text-slate-800 flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{apt.time}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {apt.chairNumber ? `Operatory Chair #${apt.chairNumber}` : 'Chair Pending'}
                      </div>
                    </td>

                    <td className="px-6 py-3.5">
                      <div className="font-semibold text-slate-800">{apt.doctorName}</div>
                    </td>

                    <td className="px-6 py-3.5">
                      <div className="text-slate-800 font-medium">{apt.service}</div>
                      {apt.notes && (
                        <div className="text-[10px] text-slate-400 italic truncate max-w-xs">{apt.notes}</div>
                      )}
                    </td>

                    <td className="px-6 py-3.5">
                      {getStatusBadge(apt.status)}
                    </td>

                    <td className="px-6 py-3.5">
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => sendReminder(apt.id, 'WhatsApp')}
                          className={`p-1.5 rounded-lg border text-[10px] font-semibold flex items-center space-x-1 transition-colors ${
                            apt.remindersSent.whatsapp
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                          title="Trigger WhatsApp reminder"
                        >
                          <Send className="w-3 h-3 text-emerald-600" />
                          <span>WhatsApp</span>
                        </button>
                        <button
                          onClick={() => sendReminder(apt.id, 'SMS')}
                          className={`p-1.5 rounded-lg border text-[10px] font-semibold flex items-center space-x-1 transition-colors ${
                            apt.remindersSent.sms
                              ? 'bg-sky-50 text-sky-700 border-sky-300'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                          title="Trigger SMS reminder"
                        >
                          <span>SMS</span>
                        </button>
                      </div>
                    </td>

                    <td className="px-6 py-3.5 text-right space-x-1">
                      {apt.status === 'scheduled' && (
                        <button
                          onClick={() => updateAppointmentStatus(apt.id, 'checked-in')}
                          className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-[11px] shadow-xs"
                        >
                          Check In
                        </button>
                      )}

                      {apt.status === 'checked-in' && (
                        <button
                          onClick={() => updateAppointmentStatus(apt.id, 'in-chair')}
                          className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] shadow-xs"
                        >
                          Send to Chair
                        </button>
                      )}

                      {apt.status === 'in-chair' && (
                        <button
                          onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs"
                        >
                          Mark Done
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setSelectedPatientId(apt.patientId);
                          setActiveView('doctor-chair');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition-colors"
                        title="Send patient to Doctor Station"
                      >
                        Doctor Desk
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Walk-In / Patient Registration Modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-sky-400" />
                <h3 className="font-bold text-sm text-white">Register Walk-In Patient</h3>
              </div>
              <button
                onClick={() => setIsRegisterOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterPatient} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 mb-1 block">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newPatient.fullName}
                  onChange={(e) => setNewPatient({ ...newPatient, fullName: e.target.value })}
                  placeholder="e.g. Richard Hendricks"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 mb-1 block">Age *</label>
                  <input
                    type="number"
                    required
                    value={newPatient.age}
                    onChange={(e) => setNewPatient({ ...newPatient, age: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 mb-1 block">Gender *</label>
                  <select
                    value={newPatient.gender}
                    onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 mb-1 block">Mobile (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    value={newPatient.phone}
                    onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 mb-1 block">Blood Group</label>
                  <select
                    value={newPatient.bloodGroup}
                    onChange={(e) => setNewPatient({ ...newPatient, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  >
                    <option value="O+">O+</option>
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="AB+">AB+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-red-600 mb-1 block">Drug Allergies (Important)</label>
                <input
                  type="text"
                  value={newPatient.allergies}
                  onChange={(e) => setNewPatient({ ...newPatient, allergies: e.target.value })}
                  placeholder="e.g. Penicillin, Latex, NSAIDs (Leave empty if none)"
                  className="w-full px-3 py-2 bg-red-50/50 border border-red-200 rounded-xl text-red-900 focus:ring-2 focus:ring-red-400 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 block">Medical History / Chronic Conditions</label>
                <input
                  type="text"
                  value={newPatient.medicalConditions}
                  onChange={(e) => setNewPatient({ ...newPatient, medicalConditions: e.target.value })}
                  placeholder="e.g. Hypertension, Type 2 Diabetes, Cardiac pacemaker"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRegisterOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold shadow-xs"
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
