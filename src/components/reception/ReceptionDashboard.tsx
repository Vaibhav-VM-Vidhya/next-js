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
    rescheduleAppointment,
    createAppointment,
    doctors,
    clinicInfo,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Clinic Time Slots
  const clinicSlots = [
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '12:00 PM',
    '12:30 PM',
    '01:00 PM',
    '04:00 PM',
    '04:30 PM',
    '05:00 PM',
    '05:30 PM',
    '06:00 PM',
    '06:30 PM',
    '07:00 PM',
    '07:30 PM',
    '08:00 PM',
    '08:30 PM',
  ];

  // Walk-in form state with structured slots
  const [walkinName, setWalkinName] = useState('');
  const [walkinPhone, setWalkinPhone] = useState('');
  const [walkinService, setWalkinService] = useState('Dental Implants & Consultation');
  const [walkinDoctorId, setWalkinDoctorId] = useState(doctors[0]?.id || 'doc-abhishek');
  const [walkinDate, setWalkinDate] = useState(new Date().toISOString().split('T')[0]);
  const [walkinSlot, setWalkinSlot] = useState('10:30 AM');
  const [walkinNotes, setWalkinNotes] = useState('');

  // Reschedule Modal State
  const [rescheduleTarget, setRescheduleTarget] = useState<any>(null);
  const [rescheduleDate, setRescheduleDate] = useState(new Date().toISOString().split('T')[0]);
  const [rescheduleSlot, setRescheduleSlot] = useState('11:30 AM');
  const [rescheduleSuccess, setRescheduleSuccess] = useState(false);

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
      date: walkinDate,
      time: walkinSlot,
      service: walkinService,
      status: 'checked-in',
      notes: walkinNotes ? `Walk-in: ${walkinNotes}` : 'Walk-in registered at front desk.',
    });

    setIsRegisterOpen(false);
    setWalkinName('');
    setWalkinPhone('');
    setWalkinNotes('');
  };

  const handleConfirmReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleTarget) return;

    rescheduleAppointment(rescheduleTarget.id, rescheduleDate, rescheduleSlot);
    setRescheduleSuccess(true);
    setTimeout(() => {
      setRescheduleSuccess(false);
      setRescheduleTarget(null);
    }, 900);
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

                    <td className="px-6 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                      {apt.status !== 'completed' && (
                        <button
                          onClick={() => {
                            setRescheduleTarget(apt);
                            setRescheduleDate(apt.date);
                            setRescheduleSlot(apt.time);
                          }}
                          className="px-2.5 py-1 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-[11px] transition-colors cursor-pointer"
                          title="Reschedule Appointment Date & Time"
                        >
                          Reschedule
                        </button>
                      )}

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

      {/* Fast Walk-In Registration Modal with Slot Selection */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">Book & Register Patient at Reception</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Select preferred date & operatory time slot</p>
              </div>
              <button
                onClick={() => setIsRegisterOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterWalkIn} className="p-6 space-y-4 text-xs max-h-[85vh] overflow-y-auto">
              {/* Date & Slot selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 mb-1 block">Visit Date *</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={walkinDate}
                    onChange={(e) => setWalkinDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 mb-1 block">Selected Time Slot *</label>
                  <div className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl font-bold text-teal-700">
                    {walkinSlot}
                  </div>
                </div>
              </div>

              {/* Slots Grid */}
              <div>
                <label className="font-bold text-slate-700 mb-1.5 block">Select Available Time Slot *</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 max-h-32 overflow-y-auto p-1.5 bg-slate-50 rounded-xl border border-slate-200">
                  {clinicSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setWalkinSlot(slot)}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all ${
                        walkinSlot === slot
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Patient Name and Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 mb-1 block">Patient Full Name *</label>
                  <input
                    type="text"
                    required
                    value={walkinName}
                    onChange={(e) => setWalkinName(e.target.value)}
                    placeholder="e.g. Suresh Shinde"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
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
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  />
                </div>
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
                <select
                  value={walkinService}
                  onChange={(e) => setWalkinService(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                >
                  <option value="Dental Implants & Oral Implantology">Dental Implants & Oral Implantology</option>
                  <option value="Periodontal / Gum Treatment">Periodontal / Gum Treatment</option>
                  <option value="Root Canal Treatment (RCT)">Root Canal Treatment (RCT)</option>
                  <option value="General Dentistry & Checkup">General Dentistry & Checkup</option>
                  <option value="Multispeciality Dental Care">Multispeciality Dental Care</option>
                  <option value="Restorative & Cosmetic Dentistry">Restorative & Cosmetic Dentistry</option>
                  <option value="Emergency Toothache & Pain Relief">Emergency Toothache & Pain Relief</option>
                  <option value="Teeth Cleaning & Polishing">Teeth Cleaning & Polishing</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 block">Notes / Allergy Warning</label>
                <input
                  type="text"
                  value={walkinNotes}
                  onChange={(e) => setWalkinNotes(e.target.value)}
                  placeholder="e.g. Penicillin allergy, severe pain"
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
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  Book & Check In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reschedule Appointment Modal */}
      {rescheduleTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">Reschedule Appointment</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Patient: {rescheduleTarget.patientName} ({rescheduleTarget.patientPhone})
                </p>
              </div>
              <button
                onClick={() => setRescheduleTarget(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {rescheduleSuccess ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Appointment Rescheduled!</h4>
                <p className="text-xs text-slate-500">
                  New appointment confirmed for <strong>{rescheduleDate}</strong> at <strong className="text-teal-700">{rescheduleSlot}</strong>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirmReschedule} className="p-6 space-y-4 text-xs">
                {/* Current Info */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
                  <p><strong>Current Slot:</strong> {rescheduleTarget.date} at {rescheduleTarget.time}</p>
                  <p><strong>Treatment:</strong> {rescheduleTarget.service}</p>
                </div>

                {/* New Date */}
                <div>
                  <label className="font-bold text-slate-700 mb-1 block">New Appointment Date *</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  />
                </div>

                {/* New Slot */}
                <div>
                  <label className="font-bold text-slate-700 mb-1.5 block">Select New Time Slot *</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 max-h-36 overflow-y-auto p-1.5 bg-slate-50 rounded-xl border border-slate-200">
                    {clinicSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setRescheduleSlot(slot)}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all ${
                          rescheduleSlot === slot
                            ? 'bg-teal-600 text-white shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setRescheduleTarget(null)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-xs cursor-pointer"
                  >
                    Confirm Reschedule
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
