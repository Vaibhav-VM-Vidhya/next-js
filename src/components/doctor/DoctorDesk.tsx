import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PrescriptionMedicine } from '../../types';
import { OdontogramView } from '../odontogram/OdontogramView';
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
  Smile,
  ShieldAlert,
  ChevronRight,
} from 'lucide-react';

export const DoctorDesk: React.FC = () => {
  const {
    appointments,
    updateAppointmentStatus,
    selectedPatient,
    setSelectedPatientId,
    patients,
    doctors,
    createPrescription,
    currentBranch,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'rx' | 'chart'>('rx');
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id || '');
  const [rxSuccess, setRxSuccess] = useState(false);

  // Prescription Form State
  const [diagnosis, setDiagnosis] = useState('Dental evaluation & restorative care');
  const [followUpDate, setFollowUpDate] = useState('2026-10-15');
  const [advice, setAdvice] = useState('Take medicines after meals.\nMaintain gentle oral hygiene.\nWarm saline rinses twice daily.');
  const [medicines, setMedicines] = useState<PrescriptionMedicine[]>([
    {
      id: 'm1',
      drugName: 'Augmentin 625mg',
      genericName: 'Amoxicillin 500mg + Clavulanic Acid 125mg',
      dosage: '625mg',
      form: 'Tablet',
      frequency: '1-0-1 (Twice daily)',
      duration: '5 days',
      specialInstructions: 'Take after meals. Complete full 5-day course.',
    },
    {
      id: 'm2',
      drugName: 'Zerodol-SP',
      genericName: 'Aceclofenac 100mg + Paracetamol 325mg + Serratiopeptidase 15mg',
      dosage: '1 tab',
      form: 'Tablet',
      frequency: '1-0-1 (Twice daily)',
      duration: '3 days',
      specialInstructions: 'For pain and swelling relief.',
    },
  ]);

  const dentalQuickMedicines = [
    {
      drugName: 'Augmentin 625mg',
      genericName: 'Amoxicillin + Clavulanic Acid',
      dosage: '625mg',
      form: 'Tablet' as const,
      frequency: '1-0-1 (Twice daily)',
      duration: '5 days',
      specialInstructions: 'Take after meals. Complete full course.',
    },
    {
      drugName: 'Zerodol-SP',
      genericName: 'Aceclofenac + Paracetamol + Serratiopeptidase',
      dosage: '1 tab',
      form: 'Tablet' as const,
      frequency: '1-0-1 (Twice daily)',
      duration: '3 days',
      specialInstructions: 'Take after food for pain/inflammation.',
    },
    {
      drugName: 'Hexidine 0.2%',
      genericName: 'Chlorhexidine Gluconate 0.2%',
      dosage: '10ml',
      form: 'Mouthwash' as const,
      frequency: 'Twice daily after brushing',
      duration: '7 days',
      specialInstructions: 'Rinse for 60 seconds. Do not swallow.',
    },
    {
      drugName: 'Ketorol DT 10mg',
      genericName: 'Ketorolac Tromethamine',
      dosage: '10mg',
      form: 'Tablet' as const,
      frequency: 'SOS (As needed for acute pain)',
      duration: '3 days',
      specialInstructions: 'Disperse in 1 tablespoon of water.',
    },
    {
      drugName: 'Pan-D',
      genericName: 'Pantoprazole + Domperidone',
      dosage: '1 cap',
      form: 'Capsule' as const,
      frequency: '1-0-0 (Morning empty stomach)',
      duration: '5 days',
      specialInstructions: 'Take 30 minutes before breakfast.',
    },
  ];

  const handleAddMedicine = (med: typeof dentalQuickMedicines[0]) => {
    setMedicines((prev) => [
      ...prev,
      {
        ...med,
        id: `med-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      },
    ]);
  };

  const handleRemoveMedicine = (id: string) => {
    setMedicines((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSavePrescription = () => {
    if (!selectedPatient) return;
    const currentDoc = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];

    createPrescription({
      patientId: selectedPatient.id,
      patientName: selectedPatient.fullName,
      patientAge: selectedPatient.age,
      doctorId: currentDoc.id,
      doctorName: currentDoc.name,
      doctorQualification: currentDoc.qualification,
      diagnosis,
      medicines,
      advice: advice.split('\n').filter((l) => l.trim().length > 0),
      followUpDate,
    });

    setRxSuccess(true);
    setTimeout(() => setRxSuccess(false), 2500);
  };

  const currentDoctor = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];
  const doctorAppointments = appointments.filter((a) => a.doctorId === selectedDoctorId || true);

  return (
    <div className="space-y-6">
      {/* Doctor Header Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-600 flex items-center justify-center font-bold">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Doctor Operatory Station</h2>
            <p className="text-xs text-slate-500">
              Manage patient appointments, clinical charting, and digital prescriptions
            </p>
          </div>
        </div>

        {/* Doctor Switcher */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-medium">Doctor:</span>
          <select
            value={selectedDoctorId}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
          >
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.specialization})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Left Appointment Roster, Right Patient Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Doctor's Appointment Schedule */}
        <div className="lg:col-span-1 space-y-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                Today's Patient Schedule ({doctorAppointments.length})
              </h3>
              <span className="text-[11px] text-sky-600 font-semibold">Select to treat</span>
            </div>

            <div className="space-y-2.5 max-h-[580px] overflow-y-auto">
              {doctorAppointments.map((apt) => {
                const isSelected = selectedPatient?.id === apt.patientId;
                const isDone = apt.status === 'completed';

                return (
                  <div
                    key={apt.id}
                    onClick={() => setSelectedPatientId(apt.patientId)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-sky-500 bg-sky-50/80 shadow-xs ring-1 ring-sky-400'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <strong className="text-xs font-bold text-slate-900">
                        {apt.patientName}
                      </strong>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
                        {apt.time}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 truncate">{apt.service}</div>

                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span
                        className={`font-semibold ${
                          isDone ? 'text-emerald-600' : 'text-amber-600'
                        }`}
                      >
                        {apt.status}
                      </span>

                      {!isDone && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateAppointmentStatus(apt.id, 'completed');
                          }}
                          className="px-2 py-0.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px]"
                        >
                          Mark Done
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Selected Patient Workspace (Prescriptions & Dental Chart) */}
        <div className="lg:col-span-2 space-y-4">
          {selectedPatient ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
              {/* Patient Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-bold text-slate-900">
                      {selectedPatient.fullName}
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 font-semibold text-slate-600">
                      {selectedPatient.age} Yrs • {selectedPatient.gender}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Phone: {selectedPatient.phone} • MRN: {selectedPatient.mrn}
                  </p>
                </div>

                {/* Sub-tabs: Prescription vs Odontogram */}
                <div className="bg-slate-100 p-1 rounded-xl flex space-x-1 text-xs font-bold">
                  <button
                    onClick={() => setActiveTab('rx')}
                    className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                      activeTab === 'rx'
                        ? 'bg-white text-emerald-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Prescription Pad</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('chart')}
                    className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                      activeTab === 'chart'
                        ? 'bg-white text-sky-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Smile className="w-3.5 h-3.5" />
                    <span>Dental Chart (Odontogram)</span>
                  </button>
                </div>
              </div>

              {/* Allergy Warning if present */}
              {selectedPatient.allergies.length > 0 && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                  <span>
                    <strong>Drug Allergy Alert:</strong> {selectedPatient.allergies.join(', ')}
                  </span>
                </div>
              )}

              {/* TAB 1: FAST PRESCRIPTION CREATOR */}
              {activeTab === 'rx' && (
                <div className="space-y-5">
                  {rxSuccess && (
                    <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center space-x-2 animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Prescription created & saved! Ready to print letterhead.</span>
                    </div>
                  )}

                  {/* Diagnosis & Follow-up */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 mb-1 block">Clinical Diagnosis</label>
                      <input
                        type="text"
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 mb-1 block">Next Follow-Up</label>
                      <input
                        type="date"
                        value={followUpDate}
                        onChange={(e) => setFollowUpDate(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* 1-Click Fast Drug Buttons */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Quick Dental Pharmacopoeia (Click to Add)</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {dentalQuickMedicines.map((m, idx) => (
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

                  {/* Medicines List */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 block">
                      Prescribed Medicines ({medicines.length})
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
                              <span className="text-[11px] text-slate-500 ml-2">({med.frequency} • {med.duration})</span>
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

                  {/* Advice textarea */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 block">
                      Doctor Advice & Instructions
                    </label>
                    <textarea
                      rows={2}
                      value={advice}
                      onChange={(e) => setAdvice(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center space-x-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Prescription</span>
                    </button>

                    <button
                      onClick={handleSavePrescription}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center space-x-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Save Prescription</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: INTERACTIVE ODONTOGRAM */}
              {activeTab === 'chart' && (
                <div className="pt-2">
                  <OdontogramView />
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400">
              Select a patient from the appointment schedule on the left to begin consultation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
