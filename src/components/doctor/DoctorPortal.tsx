import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PrescriptionMedicine, Doctor } from '../../types';
import {
  Stethoscope,
  Calendar,
  Clock,
  User,
  Plus,
  Printer,
  Trash2,
  Sparkles,
  CheckCircle2,
  FileText,
  Star,
  UserCheck,
  UserX,
  Phone,
  ShieldCheck,
  AlertCircle,
  X,
} from 'lucide-react';

export const DoctorPortal: React.FC = () => {
  const {
    currentStaffUser,
    appointments,
    updateAppointmentStatus,
    doctors,
    addDoctor,
    toggleDoctorStatus,
    createPrescription,
    reviews,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'appointments' | 'rx' | 'reviews' | 'team'>('appointments');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string>(appointments[0]?.id || '');
  const [rxSuccess, setRxSuccess] = useState(false);
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);

  // New Doctor Form State
  const [newDocName, setNewDocName] = useState('');
  const [newDocSpecialization, setNewDocSpecialization] = useState('Endodontics & Conservative Dentistry');
  const [newDocQualification, setNewDocQualification] = useState('BDS, MDS');
  const [newDocFee, setNewDocFee] = useState(700);

  // Prescription Form State
  const [rxDiagnosis, setRxDiagnosis] = useState('Dental evaluation & restorative care');
  const [rxFollowUp, setRxFollowUp] = useState('2026-10-15');
  const [rxAdvice, setRxAdvice] = useState('Take medicines strictly after meals.\nMaintain gentle oral hygiene.\nWarm saline rinses twice daily.');
  const [medicines, setMedicines] = useState<PrescriptionMedicine[]>([
    {
      id: 'm1',
      drugName: 'Augmentin 625mg',
      genericName: 'Amoxicillin 500mg + Clavulanic Acid 125mg',
      dosage: '625mg',
      frequency: '1-0-1 (Twice daily)',
      duration: '5 days',
      specialInstructions: 'Take after meals. Complete full 5-day course.',
    },
    {
      id: 'm2',
      drugName: 'Zerodol-SP',
      genericName: 'Aceclofenac 100mg + Paracetamol 325mg + Serratiopeptidase 15mg',
      dosage: '1 tab',
      frequency: '1-0-1 (Twice daily)',
      duration: '3 days',
      specialInstructions: 'For pain and swelling relief.',
    },
  ]);

  const dentalPresets = [
    {
      drugName: 'Augmentin 625mg',
      genericName: 'Amoxicillin + Clavulanic Acid',
      dosage: '625mg',
      frequency: '1-0-1 (Twice daily)',
      duration: '5 days',
      specialInstructions: 'Take after meals. Complete full course.',
    },
    {
      drugName: 'Zerodol-SP',
      genericName: 'Aceclofenac + Paracetamol + Serratiopeptidase',
      dosage: '1 tab',
      frequency: '1-0-1 (Twice daily)',
      duration: '3 days',
      specialInstructions: 'Take after food for pain/inflammation.',
    },
    {
      drugName: 'Hexidine 0.2%',
      genericName: 'Chlorhexidine Gluconate 0.2%',
      dosage: '10ml',
      frequency: 'Twice daily after brushing',
      duration: '7 days',
      specialInstructions: 'Rinse for 60 seconds. Do not swallow.',
    },
    {
      drugName: 'Ketorol DT 10mg',
      genericName: 'Ketorolac Tromethamine',
      dosage: '10mg',
      frequency: 'SOS (As needed for acute pain)',
      duration: '3 days',
      specialInstructions: 'Disperse in 1 tablespoon of water.',
    },
    {
      drugName: 'Pan-D',
      genericName: 'Pantoprazole + Domperidone',
      dosage: '1 cap',
      frequency: '1-0-0 (Morning empty stomach)',
      duration: '5 days',
      specialInstructions: 'Take 30 minutes before breakfast.',
    },
  ];

  const handleAddMedicine = (med: typeof dentalPresets[0]) => {
    setMedicines((prev) => [
      ...prev,
      { ...med, id: `med-${Date.now()}-${Math.random().toString(36).substr(2, 4)}` },
    ]);
  };

  const handleRemoveMedicine = (id: string) => {
    setMedicines((prev) => prev.filter((m) => m.id !== id));
  };

  const selectedApt = appointments.find((a) => a.id === selectedAppointmentId) || appointments[0];

  const handleSaveRx = () => {
    if (!selectedApt) return;
    const currentDoc = doctors[0];

    createPrescription({
      patientName: selectedApt.patientName,
      doctorName: currentDoc.name,
      doctorQualification: currentDoc.qualification,
      diagnosis: rxDiagnosis,
      medicines,
      advice: rxAdvice.split('\n').filter((l) => l.trim().length > 0),
      followUpDate: rxFollowUp,
    });

    setRxSuccess(true);
    setTimeout(() => setRxSuccess(false), 2500);
  };

  const handleCreateDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) return;

    addDoctor({
      name: newDocName.trim(),
      title: 'Consultant Specialist',
      specialization: newDocSpecialization,
      qualification: newDocQualification,
      experienceYears: 6,
      avatar: 'https://images.unsplash.com/photo-1594824813568-1250f2495b6c?auto=format&fit=crop&q=80&w=400',
      bio: 'Consulting dental specialist at Classic Smile.',
      consultationFee: Number(newDocFee),
    });

    setIsAddDoctorOpen(false);
    setNewDocName('');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-600 flex items-center justify-center font-bold">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-slate-900">
                Doctor Console — {currentStaffUser?.name || 'Dr. Vaibhav Sharma'}
              </h2>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Clinic Admin
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Operatory appointments, digital prescriptions, patient reviews, and doctor profiles
            </p>
          </div>
        </div>

        {/* 4 Main Tabs */}
        <div className="bg-slate-100 p-1 rounded-2xl flex space-x-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
              activeTab === 'appointments'
                ? 'bg-white text-sky-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Today's Appointments ({appointments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('rx')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
              activeTab === 'rx'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Prescription Pad</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
              activeTab === 'reviews'
                ? 'bg-white text-amber-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Patient Reviews ({reviews.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('team')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
              activeTab === 'team'
                ? 'bg-white text-purple-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Manage Doctors ({doctors.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: APPOINTMENTS ROSTER */}
      {activeTab === 'appointments' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-800">
              Active Appointments for Dr. Vaibhav Sharma
            </h3>
            <span className="text-xs text-slate-500">
              Select any patient to prepare their prescription or update status
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Time</th>
                  <th className="px-6 py-3.5">Patient Name</th>
                  <th className="px-6 py-3.5">Contact</th>
                  <th className="px-6 py-3.5">Treatment Requested</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.map((apt) => {
                  const isDone = apt.status === 'completed';

                  return (
                    <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-3.5 font-bold text-slate-900">{apt.time}</td>
                      <td className="px-6 py-3.5">
                        <strong className="text-slate-900 font-bold block">{apt.patientName}</strong>
                        {apt.notes && (
                          <span className="text-[10px] text-slate-400 italic">{apt.notes}</span>
                        )}
                      </td>
                      <td className="px-6 py-3.5 text-slate-600">{apt.patientPhone}</td>
                      <td className="px-6 py-3.5 font-medium text-slate-800">{apt.service}</td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            isDone
                              ? 'bg-emerald-100 text-emerald-800'
                              : apt.status === 'in-chair'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-sky-100 text-sky-800'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right space-x-1.5">
                        <button
                          onClick={() => {
                            setSelectedAppointmentId(apt.id);
                            setActiveTab('rx');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[11px] transition-colors"
                        >
                          Write Rx
                        </button>

                        {!isDone ? (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] shadow-xs"
                          >
                            Mark Completed
                          </button>
                        ) : (
                          <span className="text-emerald-700 font-bold text-[11px] inline-flex items-center space-x-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Done</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: FAST PRESCRIPTION PAD */}
      {activeTab === 'rx' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-slate-900">
                  Prescription for {selectedApt?.patientName || 'Selected Patient'}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 font-semibold text-slate-600">
                  {selectedApt?.patientPhone}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Service: {selectedApt?.service} • Date: {selectedApt?.date}
              </p>
            </div>

            {/* Change patient selector */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-400">Switch Patient:</span>
              <select
                value={selectedAppointmentId}
                onChange={(e) => setSelectedAppointmentId(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
              >
                {appointments.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.patientName} ({a.time})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {rxSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Prescription saved successfully! Click "Print Prescription" to generate official letterhead.</span>
            </div>
          )}

          {/* Diagnosis & Follow-up */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 mb-1 block">Clinical Diagnosis</label>
              <input
                type="text"
                value={rxDiagnosis}
                onChange={(e) => setRxDiagnosis(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 mb-1 block">Follow-Up Date</label>
              <input
                type="date"
                value={rxFollowUp}
                onChange={(e) => setRxFollowUp(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          {/* Quick Drug Buttons */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>1-Click Pharmacopoeia Additions</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {dentalPresets.map((m, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddMedicine(m)}
                  className="p-2 text-left rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-xs"
                >
                  <strong className="block font-bold text-slate-800 truncate">{m.drugName}</strong>
                  <span className="text-[10px] text-slate-500 block truncate">{m.frequency}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Prescribed List */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 block">
              Medications on Slip ({medicines.length})
            </label>
            <div className="space-y-2">
              {medicines.map((med, idx) => (
                <div
                  key={med.id}
                  className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[11px]">
                      {idx + 1}
                    </span>
                    <div>
                      <strong className="font-bold text-slate-900">{med.drugName}</strong>
                      <span className="text-[11px] text-slate-500 ml-2">
                        ({med.frequency} • {med.duration})
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveMedicine(med.id)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 block">
              Instructions & Advice
            </label>
            <textarea
              rows={2}
              value={rxAdvice}
              onChange={(e) => setRxAdvice(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center space-x-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official Rx</span>
            </button>

            <button
              onClick={handleSaveRx}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center space-x-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Prescription</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: PATIENT REVIEWS (Live doctor feed) */}
      {activeTab === 'reviews' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-800">
                Patient Feedback & Clinic Reviews ({reviews.length})
              </h3>
              <p className="text-xs text-slate-500">Live reviews submitted by patients on the portfolio</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center space-x-1 text-amber-400 mb-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                    <span className="text-[10px] font-bold text-slate-500 ml-1">
                      {rev.rating}.0 / 5.0
                    </span>
                  </div>
                  <p className="text-slate-700 italic">"{rev.comment}"</p>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                  <div>
                    <strong className="text-slate-900 font-bold block">{rev.patientName}</strong>
                    <span className="text-slate-400 text-[10px]">{rev.treatment}</span>
                  </div>
                  <span className="text-slate-400 text-[10px]">{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MANAGE DOCTORS (Admin: add doctors & toggle active/inactive login) */}
      {activeTab === 'team' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <h3 className="font-bold text-sm text-slate-800">
                Clinic Medical Staff & Doctor Accounts
              </h3>
              <p className="text-xs text-slate-500">
                Admin can add new doctor profiles and activate or deactivate doctor logins
              </p>
            </div>

            <button
              onClick={() => setIsAddDoctorOpen(true)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Doctor</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {doctors.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-start justify-between gap-4 text-xs"
              >
                <div className="flex items-start space-x-3">
                  <img
                    src={doc.avatar}
                    alt={doc.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <strong className="font-bold text-slate-900 text-sm">{doc.name}</strong>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          doc.isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {doc.isActive ? 'Active Login' : 'Deactivated'}
                      </span>
                    </div>
                    <span className="text-slate-600 block mt-0.5">{doc.specialization}</span>
                    <span className="text-[11px] text-slate-400 font-mono block">
                      Login User: {doc.username || 'doctor'}
                    </span>
                  </div>
                </div>

                {/* Toggle Login Active / Deactivate */}
                {doc.id !== 'doc-vaibhav' && (
                  <button
                    onClick={() => toggleDoctorStatus(doc.id, !doc.isActive)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-[11px] border transition-colors ${
                      doc.isActive
                        ? 'border-red-200 text-red-600 hover:bg-red-50'
                        : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                    }`}
                  >
                    {doc.isActive ? 'Deactivate Login' : 'Activate Login'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Doctor Modal */}
      {isAddDoctorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Add New Doctor Profile</h3>
              <button
                onClick={() => setIsAddDoctorOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDoctor} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Doctor Full Name *</label>
                <input
                  type="text"
                  required
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  placeholder="e.g. Dr. Priya Kulkarni"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Specialization</label>
                <input
                  type="text"
                  value={newDocSpecialization}
                  onChange={(e) => setNewDocSpecialization(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Qualification</label>
                <input
                  type="text"
                  value={newDocQualification}
                  onChange={(e) => setNewDocQualification(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Consultation Fee (₹)</label>
                <input
                  type="number"
                  value={newDocFee}
                  onChange={(e) => setNewDocFee(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-[11px] text-purple-900">
                Staff login username will be auto-generated with default initial password <code>admin1234</code>.
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddDoctorOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
                >
                  Add Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
