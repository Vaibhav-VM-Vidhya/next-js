import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Prescription, PrescriptionMedicine } from '../../types';
import {
  FileText,
  Plus,
  Printer,
  Trash2,
  Sparkles,
  CheckCircle,
  Pill,
  User,
  Calendar,
  X,
  Stethoscope,
  Building2,
} from 'lucide-react';

export const PrescriptionManager: React.FC = () => {
  const {
    prescriptions,
    selectedPatient,
    currentUser,
    createPrescription,
    doctors,
    currentBranch,
  } = useApp();

  const [activePrescription, setActivePrescription] = useState<Prescription>(
    prescriptions[0]
  );
  const [isCreating, setIsCreating] = useState(false);

  // New Prescription State
  const [diagnosis, setDiagnosis] = useState('Acute periapical abscess with localized swelling');
  const [followUpDate, setFollowUpDate] = useState('2026-10-14');
  const [adviceText, setAdviceText] = useState('Complete the entire antibiotic course.\nAvoid hard foods on operative side.\nWarm saline rinses 3 times daily.');
  const [medicines, setMedicines] = useState<PrescriptionMedicine[]>([
    {
      id: 'm-1',
      drugName: 'Augmentin 625mg',
      genericName: 'Amoxicillin 500mg + Clavulanate 125mg',
      dosage: '625mg',
      form: 'Tablet',
      frequency: '1-0-1 (Twice daily after food)',
      duration: '5 days',
      specialInstructions: 'Must complete 5 days to avoid resistance.',
    },
    {
      id: 'm-2',
      drugName: 'Zerodol-SP',
      genericName: 'Aceclofenac 100mg + Paracetamol 325mg + Serratiopeptidase 15mg',
      dosage: '1 tab',
      form: 'Tablet',
      frequency: '1-0-1 (Twice daily after food)',
      duration: '3 days',
      specialInstructions: 'Take only if pain or swelling persists.',
    },
  ]);

  const dentalDrugPresets = [
    {
      drugName: 'Augmentin 625mg',
      genericName: 'Amoxicillin 500mg + Clavulanic Acid 125mg',
      dosage: '625mg',
      form: 'Tablet' as const,
      frequency: '1-0-1 (Twice daily)',
      duration: '5 days',
      specialInstructions: 'Take after meals. Complete full course.',
    },
    {
      drugName: 'Zerodol-SP',
      genericName: 'Aceclofenac 100mg + Paracetamol 325mg + Serratiopeptidase 15mg',
      dosage: '1 tab',
      form: 'Tablet' as const,
      frequency: '1-0-1 (Twice daily)',
      duration: '3 days',
      specialInstructions: 'Pain and anti-inflammatory relief.',
    },
    {
      drugName: 'Hexidine 0.2%',
      genericName: 'Chlorhexidine Gluconate 0.2% w/v',
      dosage: '10ml',
      form: 'Mouthwash' as const,
      frequency: 'Twice daily after brushing',
      duration: '7 days',
      specialInstructions: 'Swish for 60 seconds. Do not eat for 30 minutes.',
    },
    {
      drugName: 'Ketorol DT 10mg',
      genericName: 'Ketorolac Tromethamine 10mg',
      dosage: '10mg',
      form: 'Tablet' as const,
      frequency: 'SOS (Max 3 times daily)',
      duration: '3 days',
      specialInstructions: 'Disperse in 1 tablespoon of water.',
    },
    {
      drugName: 'Pan-D',
      genericName: 'Pantoprazole 40mg + Domperidone 30mg',
      dosage: '1 cap',
      form: 'Capsule' as const,
      frequency: '1-0-0 (Morning empty stomach)',
      duration: '5 days',
      specialInstructions: 'Take 30 minutes before breakfast.',
    },
    {
      drugName: 'Metrogyl 400mg',
      genericName: 'Metronidazole 400mg',
      dosage: '400mg',
      form: 'Tablet' as const,
      frequency: '1-0-1 (Twice daily)',
      duration: '5 days',
      specialInstructions: 'Avoid alcohol during and 48 hours after treatment.',
    },
  ];

  const handleAddPreset = (preset: typeof dentalDrugPresets[0]) => {
    setMedicines((prev) => [
      ...prev,
      {
        ...preset,
        id: `m-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      },
    ]);
  };

  const handleRemoveMedicine = (id: string) => {
    setMedicines((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSavePrescription = () => {
    if (!selectedPatient) return;

    const doctor = doctors.find((d) => d.id === currentUser.doctorId) || doctors[0];

    const newRx = createPrescription({
      patientId: selectedPatient.id,
      patientName: selectedPatient.fullName,
      patientAge: selectedPatient.age,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorQualification: doctor.qualification,
      diagnosis,
      medicines,
      advice: adviceText.split('\n').filter((l) => l.trim().length > 0),
      followUpDate,
    });

    setActivePrescription(newRx);
    setIsCreating(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="no-print bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            <span>Digital Dental Prescription Desk</span>
          </h2>
          <p className="text-xs text-slate-500">
            Official Classic Smile e-Prescription Pad with drug database & automated printing
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {!isCreating && (
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Write New Prescription</span>
            </button>
          )}

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Rx</span>
          </button>
        </div>
      </div>

      {isCreating ? (
        /* CREATE PRESCRIPTION FORM */
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Draft New Prescription for {selectedPatient?.fullName}
              </h3>
              <p className="text-xs text-slate-500">
                MRN: {selectedPatient?.mrn} • Age: {selectedPatient?.age} Yrs
              </p>
            </div>
            <button
              onClick={() => setIsCreating(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Diagnosis & Follow-up */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 block">
                Clinical Diagnosis *
              </label>
              <input
                type="text"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="e.g. Acute Irreversible Pulpitis / Post-Extraction Care"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 block">
                Recommended Follow-Up Date
              </label>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Quick Drug Presets */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 block flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>One-Click Dental Pharmacopoeia Presets</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {dentalDrugPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddPreset(preset)}
                  className="p-2 text-left rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-xs"
                >
                  <strong className="block font-bold text-slate-800 truncate">{preset.drugName}</strong>
                  <span className="text-[10px] text-slate-500 block truncate">{preset.dosage} • {preset.form}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Prescribed Medicines List */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 block">
              Prescribed Medications ({medicines.length})
            </label>
            <div className="space-y-2">
              {medicines.map((m, idx) => (
                <div
                  key={m.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center">
                      {idx + 1}
                    </div>
                    <div>
                      <strong className="font-bold text-slate-900">{m.drugName}</strong>
                      <div className="text-[11px] text-slate-500">
                        {m.genericName} • {m.frequency} • {m.duration}
                      </div>
                      <div className="text-[10px] text-slate-400 italic">{m.specialInstructions}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveMedicine(m.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Advice / Post-Op Instructions */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 block">
              Doctor's Advice & Post-Operative Instructions (One per line)
            </label>
            <textarea
              rows={3}
              value={adviceText}
              onChange={(e) => setAdviceText(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleSavePrescription}
              className="px-6 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs"
            >
              Issue & Save Prescription
            </button>
          </div>
        </div>
      ) : (
        /* OFFICIAL CLINICAL PRESCRIPTION LETTERHEAD SLIP (PRINT-READY) */
        <div className="bg-white border-2 border-slate-300 rounded-3xl p-8 sm:p-12 shadow-md max-w-4xl mx-auto printable-card">
          {/* Clinic Letterhead */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b-2 border-slate-900 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold">
                <Sparkles className="w-6 h-6 text-sky-400" />
              </div>
              <div>
                <h1 className="text-2xl font-serif font-black tracking-wider text-slate-950 uppercase">
                  CLASSIC SMILE
                </h1>
                <p className="text-[11px] font-sans font-bold tracking-widest text-sky-700 uppercase">
                  Centre for Advanced Dentistry & Oral Surgery
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {currentBranch.address} • Phone: {currentBranch.phone}
                </p>
              </div>
            </div>

            <div className="text-right text-xs">
              <span className="font-bold text-slate-900 block text-sm">
                {activePrescription.doctorName}
              </span>
              <span className="text-[11px] text-slate-500 block">
                {activePrescription.doctorQualification}
              </span>
              <span className="text-[10px] font-mono font-semibold text-slate-400 block mt-1">
                Ref: {activePrescription.prescriptionNumber}
              </span>
            </div>
          </div>

          {/* Patient Details Row */}
          <div className="py-4 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 uppercase font-semibold text-[10px] block">Patient Name</span>
              <strong className="text-slate-900 font-bold">{activePrescription.patientName}</strong>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-semibold text-[10px] block">Age / Gender</span>
              <span className="text-slate-800 font-medium">{activePrescription.patientAge} Years</span>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-semibold text-[10px] block">Date</span>
              <span className="text-slate-800 font-medium">{activePrescription.date}</span>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-semibold text-[10px] block">Next Follow-Up</span>
              <strong className="text-sky-700 font-bold">{activePrescription.followUpDate}</strong>
            </div>
          </div>

          {/* Diagnosis Bar */}
          <div className="py-3 text-xs bg-slate-50 px-4 rounded-xl my-4 border border-slate-100 flex items-center space-x-2">
            <span className="font-bold text-slate-500 uppercase text-[10px]">Diagnosis:</span>
            <span className="font-semibold text-slate-900">{activePrescription.diagnosis}</span>
          </div>

          {/* Rx Symbol & Medication Table */}
          <div className="my-6">
            <div className="text-3xl font-serif italic font-black text-slate-900 mb-3">
              ℞
            </div>

            <div className="divide-y divide-slate-100">
              {activePrescription.medicines.map((med, idx) => (
                <div key={med.id || idx} className="py-3 flex items-start justify-between text-xs">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-sm">{idx + 1}. {med.drugName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-sm bg-slate-100 text-slate-600 font-medium border border-slate-200">
                        {med.form}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 italic">{med.genericName}</p>
                    <p className="text-[11px] text-slate-600 mt-1 font-medium">{med.specialInstructions}</p>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-sky-800 block">{med.frequency}</span>
                    <span className="text-[11px] text-slate-500 block">Duration: {med.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Post-Op Advice */}
          <div className="mt-8 pt-4 border-t border-slate-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-2">
              Special Advice & Post-Care Instructions:
            </span>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
              {activePrescription.advice.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>

          {/* Doctor Signature & Stamp Footer */}
          <div className="mt-14 pt-6 border-t border-slate-200 flex items-end justify-between text-xs">
            <div className="text-[10px] text-slate-400">
              <p>Generated by Classic Smile Digital Clinical Suite.</p>
              <p>Valid without physical signature when verified online.</p>
            </div>

            <div className="text-center">
              <div className="font-serif italic text-base text-slate-800 font-bold mb-1">
                {activePrescription.doctorName}
              </div>
              <div className="w-36 border-t border-slate-400 mx-auto pt-1 text-[10px] text-slate-500 uppercase font-semibold">
                Authorized Signature
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
