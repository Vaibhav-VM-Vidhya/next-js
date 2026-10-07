import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppointmentStatus, Patient } from '../../types';
import {
  Calendar,
  Clock,
  User,
  Plus,
  Search,
  CheckCircle2,
  Smile,
  FileText,
  Phone,
  AlertTriangle,
  X,
  Stethoscope,
} from 'lucide-react';

export const AppointmentsView: React.FC = () => {
  const {
    appointments,
    updateAppointmentStatus,
    patients,
    createAppointment,
    createPatient,
    setSelectedPatientId,
    setActiveView,
    doctors,
    currentBranchId,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New appointment form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [doctorId, setDoctorId] = useState(doctors[0]?.id || '');
  const [service, setService] = useState('Dental Examination & Cleaning');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('10:00 AM');
  const [allergies, setAllergies] = useState('');
  const [notes, setNotes] = useState('');

  const filteredAppointments = appointments.filter((a) => {
    const matchesSearch =
      a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;

    let patient = patients.find((p) => p.phone === phone);
    if (!patient) {
      patient = createPatient({
        fullName,
        age: Number(age),
        gender,
        phone,
        email: `${fullName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
        bloodGroup: 'O+',
        branchId: currentBranchId,
        allergies: allergies ? allergies.split(',').map((s) => s.trim()) : [],
        medicalConditions: [],
        emergencyContact: { name: fullName, relationship: 'Self', phone },
      });
    }

    const doc = doctors.find((d) => d.id === doctorId) || doctors[0];

    createAppointment({
      patientId: patient.id,
      patientName: fullName,
      patientPhone: phone,
      doctorId: doc.id,
      doctorName: doc.name,
      branchId: currentBranchId,
      date,
      time,
      durationMinutes: 30,
      service,
      status: 'scheduled',
      type: 'New Consultation',
      notes,
      estimatedCost: doc.consultationFee,
    });

    setIsModalOpen(false);
    setFullName('');
    setPhone('');
    setNotes('');
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            Completed
          </span>
        );
      case 'in-chair':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
            In Chair
          </span>
        );
      case 'checked-in':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-100 text-sky-800 border border-sky-300">
            Checked In
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
            Scheduled
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-sky-600" />
            <span>Appointments & Patient Records</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage daily schedule, patient visits, and launch clinical odontograms
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Appointment / Walk-In</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by patient name, phone, or service..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-700"
          >
            <option value="all">All Appointments</option>
            <option value="scheduled">Scheduled</option>
            <option value="checked-in">Checked In</option>
            <option value="in-chair">In Chair</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Appointments List / Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Patient</th>
                <th className="px-6 py-3.5">Date & Time</th>
                <th className="px-6 py-3.5">Doctor</th>
                <th className="px-6 py-3.5">Treatment / Service</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
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
                filteredAppointments.map((apt) => {
                  const patient = patients.find((p) => p.id === apt.patientId);

                  return (
                    <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-3.5">
                        <strong className="text-slate-900 font-bold block">{apt.patientName}</strong>
                        <div className="text-[11px] text-slate-400 flex items-center space-x-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{apt.patientPhone}</span>
                        </div>
                        {patient?.allergies && patient.allergies.length > 0 && (
                          <span className="inline-block mt-1 text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.2 rounded">
                            Allergy: {patient.allergies[0]}
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-3.5">
                        <div className="font-bold text-slate-800">{apt.date}</div>
                        <div className="text-[11px] text-slate-500 flex items-center space-x-1 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{apt.time}</span>
                        </div>
                      </td>

                      <td className="px-6 py-3.5">
                        <span className="font-semibold text-slate-800">{apt.doctorName}</span>
                      </td>

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
                            className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold text-[11px] transition-colors"
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
                            Complete
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setSelectedPatientId(apt.patientId);
                            setActiveView('odontogram');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-700 font-semibold text-[11px] transition-colors inline-flex items-center space-x-1"
                          title="Open Dental Odontogram Chart"
                        >
                          <Smile className="w-3.5 h-3.5 text-sky-600" />
                          <span>Chart</span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedPatientId(apt.patientId);
                            setActiveView('prescriptions');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-semibold text-[11px] transition-colors inline-flex items-center space-x-1"
                          title="Write Prescription"
                        >
                          <FileText className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Rx</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Appointment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Create New Dental Appointment</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 mb-1 block">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rachel Adams"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 mb-1 block">Phone / Mobile *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 mb-1 block">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 block">Doctor / Specialist</label>
                <select
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {d.specialization}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 mb-1 block">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 mb-1 block">Time Slot</label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:30 PM">03:30 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 block">Treatment / Purpose</label>
                <input
                  type="text"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  placeholder="e.g. Toothache Evaluation / Dental Implant Consult"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 block">Known Drug Allergies (Optional)</label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="e.g. Penicillin, Latex"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold shadow-xs"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
