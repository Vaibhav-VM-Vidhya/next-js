import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Stethoscope,
  Smile,
  FileText,
  Image as ImageIcon,
  CheckCircle,
  AlertTriangle,
  Clock,
  User,
  ShieldAlert,
  ArrowRight,
  Printer,
  Calendar,
  Sparkles,
  ClipboardList,
} from 'lucide-react';

export const DoctorDashboard: React.FC = () => {
  const {
    currentUser,
    appointments,
    selectedPatient,
    setSelectedPatientId,
    setActiveView,
    updateAppointmentStatus,
    patients,
  } = useApp();

  // Find appointment currently in chair or upcoming
  const inChairApt = appointments.find((a) => a.status === 'in-chair');
  const activePatient = inChairApt
    ? patients.find((p) => p.id === inChairApt.patientId) || selectedPatient
    : selectedPatient;

  // Doctor's today schedule
  const doctorSchedule = appointments.filter((a) => {
    if (currentUser.doctorId) {
      return a.doctorId === currentUser.doctorId;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Active Chair Banner / Doctor Header */}
      <div className="bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <Stethoscope className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-bold text-white">
                  Operatory Station — {currentUser.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Chair Active
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Hospital-grade digital operatory console • Electronic Dental Records (EDR)
              </p>
            </div>
          </div>

          {/* Quick Doctor Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveView('odontogram')}
              className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-2"
            >
              <Smile className="w-4 h-4" />
              <span>Open Odontogram Chart</span>
            </button>

            <button
              onClick={() => setActiveView('prescriptions')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 font-semibold text-xs transition-colors flex items-center space-x-2"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Write Prescription</span>
            </button>

            <button
              onClick={() => setActiveView('xrays')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 font-semibold text-xs transition-colors flex items-center space-x-2"
            >
              <ImageIcon className="w-4 h-4 text-amber-400" />
              <span>View Radiographs</span>
            </button>
          </div>
        </div>
      </div>

      {/* CURRENT PATIENT IN OPERATORY CHAIR */}
      {activePatient && (
        <div className="bg-white border-2 border-sky-500/40 rounded-3xl p-6 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-100 gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-700 font-black text-xl flex items-center justify-center border border-sky-200">
                {activePatient.fullName.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <div className="flex items-center space-x-3">
                  <h3 className="text-xl font-bold text-slate-900">
                    {activePatient.fullName}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                    Currently in Chair #1
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
                  <span>MRN: {activePatient.mrn}</span>
                  <span>{activePatient.age} Yrs • {activePatient.gender}</span>
                  <span>Blood: {activePatient.bloodGroup}</span>
                  <span>Phone: {activePatient.phone}</span>
                </div>
              </div>
            </div>

            {/* In-Chair Status Controls */}
            {inChairApt && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateAppointmentStatus(inChairApt.id, 'completed')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center space-x-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Complete Treatment & Discharge</span>
                </button>
              </div>
            )}
          </div>

          {/* Clinical Alerts Banner */}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {activePatient.allergies.length > 0 ? (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-start space-x-3">
                <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-xs font-bold text-red-900 block">
                    CRITICAL DRUG ALLERGIES:
                  </strong>
                  <span className="text-xs font-semibold text-red-700">
                    {activePatient.allergies.join(', ')}
                  </span>
                  <p className="text-[11px] text-red-600 mt-0.5">
                    Avoid prescribing penicillin-group or cross-reacting cephalosporins.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center space-x-3 text-xs text-slate-600">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>No known drug allergies reported.</span>
              </div>
            )}

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs font-bold text-amber-900 block">
                  MEDICAL HISTORY & SYSTEMIC CONDITIONS:
                </strong>
                <span className="text-xs font-semibold text-amber-800">
                  {activePatient.medicalConditions.length > 0
                    ? activePatient.medicalConditions.join(', ')
                    : 'Systemically Healthy'}
                </span>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  Monitor local anesthetic with adrenaline clearance.
                </p>
              </div>
            </div>
          </div>

          {/* Clinical Quick Launch Cards */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              onClick={() => {
                setSelectedPatientId(activePatient.id);
                setActiveView('odontogram');
              }}
              className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200 hover:border-sky-400 hover:shadow-md cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-sky-800 uppercase tracking-wider">
                  Interactive Odontogram
                </span>
                <Smile className="w-5 h-5 text-sky-600 group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-xs text-slate-600">
                Inspect 32 teeth, chart caries, composite fillings, crowns, and implants.
              </p>
              <div className="mt-3 flex items-center text-xs font-bold text-sky-700">
                <span>Open Odontogram</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <div
              onClick={() => {
                setSelectedPatientId(activePatient.id);
                setActiveView('prescriptions');
              }}
              className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 hover:border-emerald-400 hover:shadow-md cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  Digital Prescription Pad
                </span>
                <FileText className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-xs text-slate-600">
                Write dental analgesics, antibiotics, mouthwashes with print-ready letterhead.
              </p>
              <div className="mt-3 flex items-center text-xs font-bold text-emerald-700">
                <span>Write Prescription</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <div
              onClick={() => {
                setSelectedPatientId(activePatient.id);
                setActiveView('xrays');
              }}
              className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 hover:border-purple-400 hover:shadow-md cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-purple-800 uppercase tracking-wider">
                  Digital Radiographs
                </span>
                <ImageIcon className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-xs text-slate-600">
                High-definition OPG, periapical IOPA films, and intraoral photo reviews.
              </p>
              <div className="mt-3 flex items-center text-xs font-bold text-purple-700">
                <span>View X-Rays</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TODAY'S CASE ROSTER */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center space-x-2">
          <ClipboardList className="w-4 h-4 text-sky-600" />
          <span>Assigned Clinical Roster For Today</span>
        </h3>

        <div className="divide-y divide-slate-100">
          {doctorSchedule.map((apt) => (
            <div
              key={apt.id}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center space-x-3">
                <span className="w-8 h-8 rounded-xl bg-slate-100 font-bold text-slate-700 flex items-center justify-center">
                  {apt.time.split(' ')[0]}
                </span>
                <div>
                  <span className="font-bold text-slate-900 block">{apt.patientName}</span>
                  <span className="text-slate-500">{apt.service}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                  {apt.status}
                </span>

                <button
                  onClick={() => {
                    setSelectedPatientId(apt.patientId);
                    setActiveView('odontogram');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-sky-50 text-sky-700 font-bold hover:bg-sky-100 transition-colors"
                >
                  Load Patient Chart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
