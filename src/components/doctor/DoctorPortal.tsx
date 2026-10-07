import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PrescriptionMedicine } from '../../types';
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
  Phone,
  ShieldCheck,
  AlertCircle,
  X,
  Edit3,
  Sliders,
  RotateCcw,
} from 'lucide-react';

export const DoctorPortal: React.FC = () => {
  const {
    clinicInfo,
    currentStaffUser,
    appointments,
    updateAppointmentStatus,
    doctors,
    addDoctor,
    toggleDoctorStatus,
    createPrescription,
    quickDrugPresets,
    addQuickDrugPreset,
    removeQuickDrugPreset,
    reviews,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'appointments' | 'rx' | 'reviews' | 'team'>('appointments');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string>(appointments[0]?.id || '');
  const [rxSuccess, setRxSuccess] = useState(false);

  // Modals
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);
  const [isManagePresetsOpen, setIsManagePresetsOpen] = useState(false);
  const [isAddCustomMedOpen, setIsAddCustomMedOpen] = useState(false);

  // New Doctor Form State
  const [newDocName, setNewDocName] = useState('');
  const [newDocSpecialization, setNewDocSpecialization] = useState('Endodontics & Conservative Dentistry');
  const [newDocQualification, setNewDocQualification] = useState('BDS, MDS');
  const [newDocFee, setNewDocFee] = useState(700);

  // Quick Preset Management Form State
  const [presetDrugName, setPresetDrugName] = useState('');
  const [presetGenericName, setPresetGenericName] = useState('');
  const [presetDosage, setPresetDosage] = useState('');
  const [presetFrequency, setPresetFrequency] = useState('1-0-1 (Twice daily)');
  const [presetDuration, setPresetDuration] = useState('5 days');
  const [presetInstructions, setPresetInstructions] = useState('Take after meals.');

  // Custom Medicine Form State (for adding directly to the current prescription)
  const [customDrugName, setCustomDrugName] = useState('');
  const [customGenericName, setCustomGenericName] = useState('');
  const [customDosage, setCustomDosage] = useState('1 tab');
  const [customFrequency, setCustomFrequency] = useState('1-0-1 (Twice daily)');
  const [customDuration, setCustomDuration] = useState('5 days');
  const [customInstructions, setCustomInstructions] = useState('Take after meals.');

  // Selected Patient Details
  const selectedApt = appointments.find((a) => a.id === selectedAppointmentId) || appointments[0];

  // Prescription Form State
  const [rxDiagnosis, setRxDiagnosis] = useState('Dental evaluation & restorative care');
  const [rxFollowUp, setRxFollowUp] = useState('2026-10-15');
  const [rxAdvice, setRxAdvice] = useState(
    '1. Take all medicines strictly after meals.\n2. Maintain gentle oral hygiene and avoid pressure on the treated area.\n3. Lukewarm water gargles with a pinch of salt twice daily starting tomorrow.\n4. Avoid smoking and alcohol during the antibiotic course.'
  );
  const [patientAge, setPatientAge] = useState('34');
  const [patientGender, setPatientGender] = useState('Female');
  const [medicines, setMedicines] = useState<PrescriptionMedicine[]>([
    {
      id: 'm1',
      drugName: 'Augmentin 625mg',
      genericName: 'Amoxicillin 500mg + Clavulanic Acid 125mg',
      dosage: '625mg',
      frequency: '1-0-1 (Twice daily)',
      duration: '5 days',
      specialInstructions: 'Take strictly after meals. Complete full 5-day course.',
    },
    {
      id: 'm2',
      drugName: 'Zerodol-SP',
      genericName: 'Aceclofenac 100mg + Paracetamol 325mg + Serratiopeptidase 15mg',
      dosage: '1 tab',
      frequency: '1-0-1 (Twice daily)',
      duration: '3 days',
      specialInstructions: 'Take after meals for pain and swelling relief.',
    },
  ]);

  // Handlers for medicines
  const handleAddPresetToSlip = (preset: PrescriptionMedicine) => {
    setMedicines((prev) => [
      ...prev,
      {
        ...preset,
        id: `med-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      },
    ]);
  };

  const handleRemoveMedicine = (id: string) => {
    setMedicines((prev) => prev.filter((m) => m.id !== id));
  };

  const handleClearMedicines = () => {
    setMedicines([]);
  };

  // Handler for adding a new preset to the Quick-Add pharmacopoeia
  const handleSaveNewPreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!presetDrugName.trim()) return;

    addQuickDrugPreset({
      drugName: presetDrugName.trim(),
      genericName: presetGenericName.trim() || 'Dental formulation',
      dosage: presetDosage.trim() || 'As directed',
      frequency: presetFrequency.trim() || '1-0-1',
      duration: presetDuration.trim() || '5 days',
      specialInstructions: presetInstructions.trim() || 'Take after meals',
    });

    setPresetDrugName('');
    setPresetGenericName('');
    setPresetDosage('');
  };

  // Handler for adding a custom medicine directly onto the current prescription slip
  const handleAddCustomMedicineToSlip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDrugName.trim()) return;

    setMedicines((prev) => [
      ...prev,
      {
        id: `med-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        drugName: customDrugName.trim(),
        genericName: customGenericName.trim() || 'Dental formulation',
        dosage: customDosage.trim() || '1 tab',
        frequency: customFrequency.trim() || '1-0-1',
        duration: customDuration.trim() || '5 days',
        specialInstructions: customInstructions.trim() || 'Take after meals',
      },
    ]);

    setIsAddCustomMedOpen(false);
    setCustomDrugName('');
    setCustomGenericName('');
    setCustomDosage('1 tab');
    setCustomFrequency('1-0-1 (Twice daily)');
    setCustomDuration('5 days');
    setCustomInstructions('Take after meals.');
  };

  // Save Rx to Clinic Records
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
    setTimeout(() => setRxSuccess(false), 3000);
  };

  // Add Doctor Handler
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
      {/* Console Header Bar (Hidden on Print) */}
      <div className="no-print bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-600 flex items-center justify-center font-bold">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-slate-900">
                Doctor Console — {currentStaffUser?.name || 'Dr. Abhishek V. Kamble'}
              </h2>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                MDS Specialist
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Periodontics & Oral Implantology • Reg. No: A-43344
            </p>
          </div>
        </div>

        {/* Console Navigation Tabs */}
        <div className="bg-slate-100 p-1 rounded-2xl flex flex-wrap gap-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'appointments'
                ? 'bg-white text-teal-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Today's Patients ({appointments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('rx')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'rx'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Clinical Prescription Pad</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer ${
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
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer ${
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
        <div className="no-print bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-800">
                Active Appointments for Dr. Abhishek V. Kamble
              </h3>
              <p className="text-xs text-slate-500">
                Click "Write Rx" to prepare a clinical prescription slip for any patient
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
              {appointments.length} Consultations Scheduled
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Time</th>
                  <th className="px-6 py-3.5">Patient Name</th>
                  <th className="px-6 py-3.5">Contact</th>
                  <th className="px-6 py-3.5">Procedure / Service</th>
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
                              : 'bg-teal-100 text-teal-800'
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
                          className="px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          Write Rx
                        </button>

                        {!isDone ? (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] shadow-xs cursor-pointer"
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

      {/* TAB 2: CLINICAL PRESCRIPTION PAD */}
      {activeTab === 'rx' && (
        <div className="space-y-6">
          {/* Top Prescription Action Bar (Controls & Switcher - Hidden on Print) */}
          <div className="no-print bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex flex-wrap items-center gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    Patient Consultation
                  </label>
                  <select
                    value={selectedAppointmentId}
                    onChange={(e) => setSelectedAppointmentId(e.target.value)}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-xs text-slate-900"
                  >
                    {appointments.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.patientName} ({a.time} - {a.service})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    Age / Gender
                  </label>
                  <div className="flex items-center space-x-1.5">
                    <input
                      type="text"
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                      placeholder="Age"
                      className="w-16 px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-center"
                    />
                    <select
                      value={patientGender}
                      onChange={(e) => setPatientGender(e.target.value)}
                      className="px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddCustomMedOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-teal-600" />
                  <span>+ Add Medicine</span>
                </button>

                <button
                  type="button"
                  onClick={handleClearMedicines}
                  className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-semibold text-xs flex items-center space-x-1 transition-colors cursor-pointer"
                  title="Clear all medicines from slip"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveRx}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Save Record</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-teal-400" />
                  <span>Print Official Rx</span>
                </button>
              </div>
            </div>

            {rxSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center space-x-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Prescription recorded successfully! You can print or download the clean slip anytime.</span>
              </div>
            )}

            {/* Quick Add Pharmacopoeia Bar with '+' button beside it */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  <span>Quick Pharmacopoeia (Click to Add):</span>
                </label>
                <span className="text-[11px] text-slate-400">
                  {quickDrugPresets.length} presets configured
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {quickDrugPresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleAddPresetToSlip(preset)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-teal-500 bg-slate-50 hover:bg-teal-50/50 text-slate-800 transition-all text-xs font-medium flex items-center space-x-1.5 cursor-pointer shadow-2xs"
                    title={`${preset.genericName} (${preset.dosage})`}
                  >
                    <Plus className="w-3 h-3 text-teal-600" />
                    <span className="font-bold">{preset.drugName}</span>
                    <span className="text-[10px] text-slate-400">({preset.frequency.split(' ')[0]})</span>
                  </button>
                ))}

                {/* '+' Button Beside Quick Add to Manage / Update Presets */}
                <button
                  type="button"
                  onClick={() => setIsManagePresetsOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center space-x-1 shadow-xs transition-colors cursor-pointer"
                  title="Add new medicine to Quick-Add menu or remove presets"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add / Manage Presets</span>
                </button>
              </div>
            </div>
          </div>

          {/* THE CLINICAL PRESCRIPTION LETTERHEAD SLIP (Authentic Hospital Pad) */}
          <div className="bg-white border border-slate-300 rounded-3xl p-8 sm:p-12 shadow-xl max-w-4xl mx-auto print:shadow-none print:border-none print:p-4 print:max-w-none print:w-full print:rounded-none">
            {/* Pad Letterhead Header */}
            <div className="border-b-2 border-slate-900 pb-5 flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl sm:text-2xl font-black font-serif uppercase tracking-tight text-slate-950">
                    {clinicInfo.name}
                  </span>
                </div>
                <p className="text-xs font-serif italic text-teal-800 font-semibold mt-0.5">
                  "{clinicInfo.tagline}"
                </p>
                <p className="text-[11px] text-slate-600 mt-1 max-w-md leading-relaxed font-sans">
                  {clinicInfo.address}, {clinicInfo.area}, {clinicInfo.city}
                </p>
                <p className="text-[11px] text-slate-700 font-sans mt-0.5 font-medium">
                  Helpline: <strong>{clinicInfo.phone}</strong> | <strong>{clinicInfo.secondaryPhone}</strong>
                </p>
                <p className="text-[10px] text-slate-500 font-sans">
                  Email: {clinicInfo.email}
                </p>
              </div>

              {/* Doctor Details */}
              <div className="text-left sm:text-right font-sans">
                <h3 className="text-base sm:text-lg font-bold text-slate-950">
                  {doctors[0]?.name || 'Dr. Abhishek V. Kamble'}
                </h3>
                <p className="text-xs font-bold text-teal-800">
                  {doctors[0]?.qualification || 'BDS, MDS'}
                </p>
                <p className="text-[11px] text-slate-600 font-medium">
                  {doctors[0]?.specialization || 'Periodontist & Oral Implantologist'}
                </p>
                <p className="text-[11px] font-mono font-bold text-slate-800 mt-0.5">
                  Reg. No: {doctors[0]?.registration || 'A-43344'}
                </p>
                <span className="inline-block text-[9px] uppercase font-bold tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-sm mt-1 border border-teal-200">
                  Multispeciality Dental Clinic
                </span>
              </div>
            </div>

            {/* Patient & Consultation Metadata Strip */}
            <div className="my-5 py-3 px-4 bg-slate-50/80 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-sans">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Patient Name</span>
                <strong className="text-slate-950 font-bold text-sm block">
                  {selectedApt?.patientName || 'Consultation Patient'}
                </strong>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Age / Gender</span>
                <span className="text-slate-800 font-semibold block">
                  {patientAge} Yrs / {patientGender}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Date</span>
                <span className="text-slate-800 font-semibold block">
                  {new Date().toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Rx Reference No.</span>
                <span className="text-slate-800 font-mono font-bold block">
                  CS-{selectedApt?.id.replace(/[^0-9]/g, '').slice(-4) || '4392'}
                </span>
              </div>
            </div>

            {/* Diagnosis Inline Section */}
            <div className="mb-4 pb-3 border-b border-slate-200 flex items-center space-x-2 text-xs font-sans">
              <strong className="text-slate-800 uppercase tracking-wider text-[11px] shrink-0">
                Diagnosis:
              </strong>
              <input
                type="text"
                value={rxDiagnosis}
                onChange={(e) => setRxDiagnosis(e.target.value)}
                placeholder="Clinical findings / diagnosis"
                className="w-full bg-transparent border-b border-dashed border-slate-300 focus:border-teal-500 focus:outline-hidden py-0.5 text-slate-800 font-medium"
              />
            </div>

            {/* Classic Medical ℞ Symbol */}
            <div className="flex items-center justify-between mb-2">
              <div className="text-3xl font-serif font-black text-slate-900 select-none">
                ℞
              </div>
              <div className="no-print">
                <button
                  type="button"
                  onClick={() => setIsAddCustomMedOpen(true)}
                  className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Medicine</span>
                </button>
              </div>
            </div>

            {/* Prescribed Medicines Table */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-left text-xs border border-slate-300 font-sans">
                <thead className="bg-slate-100 text-slate-700 uppercase font-bold tracking-wider text-[10px] border-b border-slate-300">
                  <tr>
                    <th className="p-2.5 border-r border-slate-300 w-10 text-center">#</th>
                    <th className="p-2.5 border-r border-slate-300">Medicine & Salt Formulation</th>
                    <th className="p-2.5 border-r border-slate-300 w-24">Dosage</th>
                    <th className="p-2.5 border-r border-slate-300 w-36">Frequency / Timing</th>
                    <th className="p-2.5 border-r border-slate-300 w-24">Duration</th>
                    <th className="p-2.5">Instructions</th>
                    <th className="p-2.5 no-print w-10 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {medicines.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-slate-400 italic font-sans">
                        No medications prescribed yet. Click any Quick Preset above or "+ Add Medicine" to prescribe.
                      </td>
                    </tr>
                  ) : (
                    medicines.map((med, idx) => (
                      <tr key={med.id} className="hover:bg-slate-50/50">
                        <td className="p-2.5 border-r border-slate-300 font-bold text-slate-900 text-center">
                          {idx + 1}
                        </td>
                        <td className="p-2.5 border-r border-slate-300">
                          <strong className="block font-bold text-slate-900 text-sm">
                            {med.drugName}
                          </strong>
                          {med.genericName && (
                            <span className="text-[10px] text-slate-500 font-sans block">
                              {med.genericName}
                            </span>
                          )}
                        </td>
                        <td className="p-2.5 border-r border-slate-300 font-medium text-slate-800">
                          {med.dosage}
                        </td>
                        <td className="p-2.5 border-r border-slate-300 font-bold text-slate-900">
                          {med.frequency}
                        </td>
                        <td className="p-2.5 border-r border-slate-300 font-medium text-slate-800">
                          {med.duration}
                        </td>
                        <td className="p-2.5 text-slate-700">
                          {med.specialInstructions}
                        </td>
                        <td className="p-2.5 no-print text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveMedicine(med.id)}
                            className="p-1 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
                            title="Remove medication"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Clinical Advice & Follow-Up Section */}
            <div className="space-y-4 pt-2 border-t border-slate-200 font-sans text-xs">
              <div>
                <strong className="block font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1.5">
                  Advice & Directions:
                </strong>
                <textarea
                  rows={3}
                  value={rxAdvice}
                  onChange={(e) => setRxAdvice(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 leading-relaxed font-sans print:border-none print:p-0 print:bg-transparent print:resize-none"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center space-x-2">
                  <strong className="text-slate-900 font-bold text-[11px] uppercase tracking-wider">
                    Next Review / Follow-Up:
                  </strong>
                  <input
                    type="date"
                    value={rxFollowUp}
                    onChange={(e) => setRxFollowUp(e.target.value)}
                    className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 print:border-none print:p-0 print:bg-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Signature & Seal Block */}
            <div className="mt-12 pt-6 border-t-2 border-slate-900 flex justify-between items-end font-sans text-xs">
              <div className="space-y-1 text-[10px] text-slate-500 max-w-sm">
                <p className="font-semibold text-slate-700">
                  * Official Digital Medical Prescription — Classic Smile Dental Care.
                </p>
                <p>
                  For dental emergencies or drug reactions, contact clinic helpline at {clinicInfo.phone} immediately.
                </p>
              </div>

              <div className="text-right">
                <div className="h-12 flex items-center justify-end">
                  <span className="font-serif italic text-slate-400 text-sm select-none">
                    [Dr. Abhishek Kamble]
                  </span>
                </div>
                <strong className="block text-slate-950 font-bold text-sm">
                  {doctors[0]?.name || 'Dr. Abhishek V. Kamble'}
                </strong>
                <span className="text-[11px] text-teal-800 font-semibold block">
                  BDS, MDS (Periodontist & Oral Implantologist)
                </span>
                <span className="text-[10px] text-slate-600 font-mono block">
                  Reg. No: {doctors[0]?.registration || 'A-43344'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PATIENT REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="no-print bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-800">
                Patient Feedback & Clinic Reviews ({reviews.length})
              </h3>
              <p className="text-xs text-slate-500">Live reviews submitted by patients on the clinic website</p>
            </div>
            <div className="flex items-center space-x-1.5 px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>4.9 / 5.0 Average</span>
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
                      {rev.rating}.0
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

      {/* TAB 4: MANAGE DOCTORS */}
      {activeTab === 'team' && (
        <div className="no-print bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <h3 className="font-bold text-sm text-slate-800">
                Clinic Medical Staff & Doctor Accounts
              </h3>
              <p className="text-xs text-slate-500">
                Lead Doctor (Dr. Abhishek V. Kamble) can add new doctors and activate or deactivate doctor logins
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

                {doc.id !== 'doc-abhishek' && (
                  <button
                    onClick={() => toggleDoctorStatus(doc.id, !doc.isActive)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-[11px] border transition-colors cursor-pointer ${
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

      {/* MODAL 1: ADD / MANAGE QUICK PRESETS MODAL */}
      {isManagePresetsOpen && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-teal-400" />
                <h3 className="font-bold text-sm text-white">
                  Quick Pharmacopoeia Manager
                </h3>
              </div>
              <button
                onClick={() => setIsManagePresetsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              {/* Add New Preset Form */}
              <form onSubmit={handleSaveNewPreset} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <strong className="text-slate-900 font-bold block text-sm">
                  Add New 1-Click Medication Preset
                </strong>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Drug / Brand Name *</label>
                    <input
                      type="text"
                      required
                      value={presetDrugName}
                      onChange={(e) => setPresetDrugName(e.target.value)}
                      placeholder="e.g. Dolo 650mg"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Generic Composition</label>
                    <input
                      type="text"
                      value={presetGenericName}
                      onChange={(e) => setPresetGenericName(e.target.value)}
                      placeholder="e.g. Paracetamol 650mg"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Dosage</label>
                    <input
                      type="text"
                      value={presetDosage}
                      onChange={(e) => setPresetDosage(e.target.value)}
                      placeholder="e.g. 1 tab / 650mg"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Frequency</label>
                    <input
                      type="text"
                      value={presetFrequency}
                      onChange={(e) => setPresetFrequency(e.target.value)}
                      placeholder="e.g. 1-0-1 (After food)"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Duration</label>
                    <input
                      type="text"
                      value={presetDuration}
                      onChange={(e) => setPresetDuration(e.target.value)}
                      placeholder="e.g. 3 days"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Special Instructions</label>
                    <input
                      type="text"
                      value={presetInstructions}
                      onChange={(e) => setPresetInstructions(e.target.value)}
                      placeholder="e.g. Take after meals for fever/pain"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl flex items-center space-x-1.5 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Save to Quick Add Menu</span>
                  </button>
                </div>
              </form>

              {/* Current Presets List */}
              <div className="space-y-2">
                <strong className="text-slate-800 font-bold block text-sm">
                  Configured Presets ({quickDrugPresets.length})
                </strong>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {quickDrugPresets.map((preset) => (
                    <div
                      key={preset.id}
                      className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between"
                    >
                      <div>
                        <strong className="font-bold text-slate-900 block">{preset.drugName}</strong>
                        <span className="text-[11px] text-slate-500 block">
                          {preset.genericName} • {preset.dosage} • {preset.frequency}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeQuickDrugPreset(preset.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete Preset"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setIsManagePresetsOpen(false)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD CUSTOM MEDICINE TO PRESCRIPTION SLIP */}
      {isAddCustomMedOpen && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-sm text-white flex items-center space-x-1.5">
                <Plus className="w-4 h-4 text-teal-400" />
                <span>Add Medication to Prescription</span>
              </h3>
              <button
                onClick={() => setIsAddCustomMedOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomMedicineToSlip} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Medicine / Drug Name *</label>
                <input
                  type="text"
                  required
                  value={customDrugName}
                  onChange={(e) => setCustomDrugName(e.target.value)}
                  placeholder="e.g. Amox 500mg, Metrogyl 400mg, Ketorol DT"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Generic Salt / Composition</label>
                <input
                  type="text"
                  value={customGenericName}
                  onChange={(e) => setCustomGenericName(e.target.value)}
                  placeholder="e.g. Metronidazole 400mg"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Dosage</label>
                  <input
                    type="text"
                    value={customDosage}
                    onChange={(e) => setCustomDosage(e.target.value)}
                    placeholder="e.g. 1 tab"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Frequency</label>
                  <input
                    type="text"
                    value={customFrequency}
                    onChange={(e) => setCustomFrequency(e.target.value)}
                    placeholder="e.g. 1-0-1 (Twice daily)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Duration</label>
                  <input
                    type="text"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(e.target.value)}
                    placeholder="e.g. 5 days"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Special Instructions</label>
                  <input
                    type="text"
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value)}
                    placeholder="e.g. Take after meals"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddCustomMedOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  Add to Slip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD DOCTOR MODAL */}
      {isAddDoctorOpen && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Add New Doctor Profile</h3>
              <button
                onClick={() => setIsAddDoctorOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
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
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold cursor-pointer"
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
