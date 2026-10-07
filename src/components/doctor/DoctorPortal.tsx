import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PrescriptionMedicine, AppointmentStatus } from '../../types';
import { downloadAppointmentReceiptImage } from '../../utils/receiptGenerator';
import { getLocalDateString } from '../../utils/dateUtils';
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
  Search,
  Filter,
  Download,
  Check,
  ChevronRight,
  UserCheck,
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

  // Today's Patients Interactive Filters
  const [patientSearch, setPatientSearch] = useState('');
  const [patientStatusFilter, setPatientStatusFilter] = useState<string>('all');
  const [patientDateFilter, setPatientDateFilter] = useState<string>('today');

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

  // Prescription Form State - Follow-up is optional/nullable!
  const [rxDiagnosis, setRxDiagnosis] = useState('Dental evaluation & restorative care');
  const [rxFollowUp, setRxFollowUp] = useState(''); // Nullable / optional by default
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

  // Switch to Rx tab and pre-select patient
  const handleSelectPatientForRx = (apt: any) => {
    setSelectedAppointmentId(apt.id);
    if (apt.service) {
      setRxDiagnosis(apt.service);
    }
    setActiveTab('rx');
  };

  // Download digital appointment slip for patient
  const handleDownloadPatientSlip = (apt: any) => {
    const doc = doctors.find((d) => d.id === apt.doctorId) || doctors[0];
    downloadAppointmentReceiptImage({
      patientName: apt.patientName,
      patientPhone: apt.patientPhone,
      doctorName: doc.name,
      doctorQualification: doc.qualification,
      doctorSpecialization: doc.specialization,
      doctorRegistration: doc.registration || 'A-43344',
      service: apt.service,
      date: apt.date,
      time: apt.time,
      referenceId: apt.id,
      clinicName: clinicInfo.name,
      clinicTagline: clinicInfo.tagline,
      clinicAddress: clinicInfo.address,
      clinicCity: clinicInfo.city,
      clinicPhone: clinicInfo.phone,
      clinicSecondaryPhone: clinicInfo.secondaryPhone,
    });
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
      followUpDate: rxFollowUp.trim() ? rxFollowUp.trim() : undefined,
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

  // Interactive filtering variables
  const todayStr = getLocalDateString();

  const filteredAppointments = appointments.filter((apt) => {
    const query = patientSearch.toLowerCase().trim();
    const matchesSearch =
      !query ||
      apt.patientName.toLowerCase().includes(query) ||
      apt.patientPhone.includes(query) ||
      apt.service.toLowerCase().includes(query) ||
      (apt.notes && apt.notes.toLowerCase().includes(query));

    const matchesStatus =
      patientStatusFilter === 'all' ||
      (patientStatusFilter === 'confirmed'
        ? apt.status === 'confirmed' || apt.status === 'scheduled'
        : apt.status === patientStatusFilter);

    const matchesDate =
      patientDateFilter === 'all'
        ? true
        : patientDateFilter === 'today'
        ? apt.date === todayStr
        : apt.date === patientDateFilter;

    return matchesSearch && matchesStatus && matchesDate;
  });

  const countTodayTotal = appointments.filter((a) => a.date === todayStr).length;
  const countInChair = appointments.filter((a) => a.status === 'in-chair').length;
  const countCheckedIn = appointments.filter((a) => a.status === 'checked-in').length;
  const countConfirmed = appointments.filter((a) => a.status === 'confirmed' || a.status === 'scheduled').length;
  const countCompletedToday = appointments.filter((a) => a.status === 'completed' && a.date === todayStr).length;
  const countPending = appointments.filter((a) => a.status === 'pending').length;

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
        <div className="no-print space-y-4">
          {/* Quick Metrics Bar for Doctor's Patient Load */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button
              onClick={() => {
                setPatientDateFilter('today');
                setPatientStatusFilter('all');
              }}
              className="p-4 bg-white border border-slate-200 hover:border-teal-400 rounded-2xl text-left transition-all shadow-xs cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Today's Consultations
                </span>
                <Calendar className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1">{countTodayTotal}</div>
              <span className="text-[11px] text-teal-700 font-semibold mt-0.5 block">
                {countCompletedToday} Completed
              </span>
            </button>

            <button
              onClick={() => {
                setPatientStatusFilter('checked-in');
              }}
              className="p-4 bg-white border border-slate-200 hover:border-sky-400 rounded-2xl text-left transition-all shadow-xs cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Waiting Lounge
                </span>
                <Clock className="w-4 h-4 text-sky-500" />
              </div>
              <div className="text-2xl font-black text-sky-600 mt-1">{countCheckedIn}</div>
              <span className="text-[11px] text-slate-500 mt-0.5 block">Ready for chair</span>
            </button>

            <button
              onClick={() => {
                setPatientStatusFilter('in-chair');
              }}
              className="p-4 bg-white border border-slate-200 hover:border-purple-400 rounded-2xl text-left transition-all shadow-xs cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  In Dental Chair
                </span>
                <Stethoscope className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-2xl font-black text-purple-600 mt-1">{countInChair}</div>
              <span className="text-[11px] text-purple-700 font-semibold mt-0.5 block">Active treatment</span>
            </button>

            <button
              onClick={() => {
                setPatientStatusFilter('confirmed');
              }}
              className="p-4 bg-white border border-slate-200 hover:border-teal-400 rounded-2xl text-left transition-all shadow-xs cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Confirmed / Booked
                </span>
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
              </div>
              <div className="text-2xl font-black text-teal-700 mt-1">{countConfirmed}</div>
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                {countPending > 0 ? `${countPending} pending verification` : 'Up to date'}
              </span>
            </button>
          </div>

          {/* Search, Status Filter & Date Range Filter */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-3 flex-1 min-w-[260px]">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                  placeholder="Search patient name, phone, symptom, or treatment..."
                  className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden font-medium"
                />
                {patientSearch && (
                  <button
                    onClick={() => setPatientSearch('')}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-1.5">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={patientStatusFilter}
                  onChange={(e) => setPatientStatusFilter(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 font-medium"
                >
                  <option value="all">All Statuses</option>
                  <option value="in-chair">In Chair (Active)</option>
                  <option value="checked-in">Waiting in Lounge</option>
                  <option value="confirmed">Confirmed / Scheduled</option>
                  <option value="pending">Pending Verification</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <select
                  value={patientDateFilter}
                  onChange={(e) => setPatientDateFilter(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 font-medium"
                >
                  <option value="today">Today Only ({todayStr})</option>
                  <option value="all">All Dates Scheduled</option>
                </select>
              </div>
            </div>

            <div className="text-xs font-semibold text-slate-500">
              Showing <span className="font-bold text-slate-900">{filteredAppointments.length}</span> patient(s)
            </div>
          </div>

          {/* Patients Interactive Table */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">Schedule</th>
                    <th className="px-5 py-3.5">Patient Details</th>
                    <th className="px-5 py-3.5">Treatment / Complaint</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Operatory Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                        <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="font-semibold text-slate-600">No appointments found matching your criteria</p>
                        <p className="text-[11px] text-slate-400 mt-1">Try resetting the search query or status filter</p>
                        <button
                          onClick={() => {
                            setPatientSearch('');
                            setPatientStatusFilter('all');
                            setPatientDateFilter('all');
                          }}
                          className="mt-3 px-3 py-1.5 rounded-xl bg-teal-50 text-teal-700 font-bold text-xs hover:bg-teal-100 transition-colors"
                        >
                          Reset Filters
                        </button>
                      </td>
                    </tr>
                  ) : (
                    filteredAppointments.map((apt) => {
                      const isDone = apt.status === 'completed';
                      const isInChair = apt.status === 'in-chair';
                      const isPending = apt.status === 'pending';

                      return (
                        <tr
                          key={apt.id}
                          className={`hover:bg-slate-50/80 transition-colors ${
                            isInChair ? 'bg-purple-50/30' : ''
                          }`}
                        >
                          <td className="px-5 py-3.5">
                            <span className="font-bold text-slate-900 block">{apt.time}</span>
                            <span className="text-[11px] text-slate-400 font-mono flex items-center space-x-1 mt-0.5">
                              <Calendar className="w-3 h-3" />
                              <span>{apt.date}</span>
                            </span>
                          </td>

                          <td className="px-5 py-3.5">
                            <strong className="text-slate-900 font-bold block text-sm">
                              {apt.patientName}
                            </strong>
                            <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-0.5">
                              <span className="flex items-center space-x-1">
                                <Phone className="w-3 h-3 text-slate-400" />
                                <span>{apt.patientPhone}</span>
                              </span>
                            </div>
                            {apt.notes && (
                              <div className="mt-1 text-[11px] text-slate-600 bg-slate-100/80 px-2 py-0.5 rounded-md italic max-w-xs truncate">
                                "{apt.notes}"
                              </div>
                            )}
                          </td>

                          <td className="px-5 py-3.5">
                            <span className="font-bold text-slate-800 block">{apt.service}</span>
                            <span className="text-[11px] text-slate-400">Dr. Abhishek V. Kamble</span>
                          </td>

                          <td className="px-5 py-3.5">
                            {isInChair && (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200 animate-pulse flex items-center space-x-1 w-fit">
                                <Stethoscope className="w-3 h-3" />
                                <span>In Chair</span>
                              </span>
                            )}
                            {apt.status === 'checked-in' && (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
                                Waiting in Lounge
                              </span>
                            )}
                            {(apt.status === 'confirmed' || apt.status === 'scheduled') && (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
                                Confirmed
                              </span>
                            )}
                            {isPending && (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                Pending Verification
                              </span>
                            )}
                            {isDone && (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                Completed
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                            {/* Write Rx Button */}
                            <button
                              onClick={() => handleSelectPatientForRx(apt)}
                              className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px] transition-colors shadow-xs cursor-pointer inline-flex items-center space-x-1"
                              title="Open prescription pad for this patient"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Write Rx</span>
                            </button>

                            {/* Chair control */}
                            {!isDone && !isInChair && (
                              <button
                                onClick={() => updateAppointmentStatus(apt.id, 'in-chair')}
                                className="px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold text-[11px] transition-colors cursor-pointer inline-flex items-center space-x-1"
                                title="Move patient into operatory chair"
                              >
                                <Stethoscope className="w-3.5 h-3.5 text-purple-600" />
                                <span>To Chair</span>
                              </button>
                            )}

                            {/* Complete control */}
                            {!isDone && isInChair && (
                              <button
                                onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                                className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] shadow-xs cursor-pointer inline-flex items-center space-x-1"
                                title="Mark consultation done"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Mark Done</span>
                              </button>
                            )}

                            {/* Pending Confirm control */}
                            {isPending && (
                              <button
                                onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                                className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-[11px] transition-colors cursor-pointer"
                              >
                                Confirm
                              </button>
                            )}

                            {/* Digital Slip Download Button */}
                            <button
                              onClick={() => handleDownloadPatientSlip(apt)}
                              className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-[11px] transition-colors cursor-pointer inline-flex items-center space-x-1"
                              title="Download digital appointment pass"
                            >
                              <Download className="w-3.5 h-3.5 text-slate-500" />
                              <span className="hidden sm:inline">Slip</span>
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
        </div>
      )}

      {/* TAB 2: CLINICAL PRESCRIPTION PAD */}
      {activeTab === 'rx' && (
        <div className="space-y-4">
          {rxSuccess && (
            <div className="no-print p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-xs flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="font-medium">
                Prescription recorded in clinic database successfully! Ready for printing or patient review.
              </span>
            </div>
          )}

          {/* Horizontal Split Layout: Left = Entry Controls, Right = Authentic Letterhead Pad */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: Data Entry & Action Controls (no-print) */}
            <div className="no-print lg:col-span-5 space-y-4">
              {/* Card 1: Patient Selection & Demographics */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3.5 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <strong className="text-slate-900 font-bold text-sm flex items-center space-x-1.5">
                    <User className="w-4 h-4 text-teal-600" />
                    <span>Patient Consultation</span>
                  </strong>
                  <span className="text-[11px] text-slate-400">
                    {appointments.length} patients in roster
                  </span>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Select Patient *</label>
                  <select
                    value={selectedAppointmentId}
                    onChange={(e) => {
                      setSelectedAppointmentId(e.target.value);
                      const chosen = appointments.find((a) => a.id === e.target.value);
                      if (chosen?.service) setRxDiagnosis(chosen.service);
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  >
                    {appointments.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.patientName} ({a.time} - {a.service})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Age</label>
                    <input
                      type="text"
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                      placeholder="e.g. 34"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Gender</label>
                    <select
                      value={patientGender}
                      onChange={(e) => setPatientGender(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-xs"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Clinical Diagnosis / Concern *</label>
                  <input
                    type="text"
                    value={rxDiagnosis}
                    onChange={(e) => setRxDiagnosis(e.target.value)}
                    placeholder="e.g. Periodontitis & Deep Pocketing, Root Canal Therapy"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700 block">
                      Next Review / Follow-Up (Optional)
                    </label>
                    {rxFollowUp && (
                      <button
                        type="button"
                        onClick={() => setRxFollowUp('')}
                        className="text-[11px] text-red-600 hover:text-red-700 font-bold cursor-pointer"
                        title="Remove follow-up date (Set as SOS)"
                      >
                        Clear (Set SOS)
                      </button>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="date"
                      min={getLocalDateString()}
                      value={rxFollowUp}
                      onChange={(e) => setRxFollowUp(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {rxFollowUp
                      ? `Follow-up set for: ${rxFollowUp}`
                      : 'Optional: Left empty, prints as "SOS / As needed on discomfort"'}
                  </p>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Clinical Advice & Directions</label>
                  <textarea
                    rows={3}
                    value={rxAdvice}
                    onChange={(e) => setRxAdvice(e.target.value)}
                    placeholder="Post-op instructions, dietary precautions, oral hygiene..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs leading-relaxed focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Card 2: Quick Pharmacopoeia Buttons */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <label className="font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    <span>Quick Add Pharmacopoeia</span>
                  </label>
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => setIsAddCustomMedOpen(true)}
                      className="px-2 py-1 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 font-bold text-[10px] transition-colors cursor-pointer flex items-center space-x-1"
                      title="Add one-off medicine to this slip"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Custom</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsManagePresetsOpen(true)}
                      className="px-2 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-[10px] transition-colors cursor-pointer flex items-center space-x-1"
                      title="Manage saved presets"
                    >
                      <Sliders className="w-3 h-3" />
                      <span>Manage</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {quickDrugPresets.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleAddPresetToSlip(preset)}
                      className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-teal-500 bg-slate-50 hover:bg-teal-50/60 text-slate-800 transition-all text-xs font-semibold flex items-center space-x-1 cursor-pointer shadow-2xs"
                      title={`${preset.genericName} (${preset.dosage})`}
                    >
                      <Plus className="w-3 h-3 text-teal-600" />
                      <span>{preset.drugName}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Card 3: Currently Added Medications on Slip */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <strong className="text-slate-900 font-bold text-xs">
                      Medications in Slip ({medicines.length})
                    </strong>
                  </div>
                  {medicines.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearMedicines}
                      className="text-[11px] font-bold text-slate-400 hover:text-red-600 flex items-center space-x-1 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Clear All</span>
                    </button>
                  )}
                </div>

                {medicines.length === 0 ? (
                  <p className="text-slate-400 italic text-center py-3 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    No medicines added yet. Click any Quick Preset above or "+ Custom".
                  </p>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {medicines.map((med, idx) => (
                      <div
                        key={med.id}
                        className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between gap-2"
                      >
                        <div>
                          <strong className="text-slate-900 font-bold block text-xs">
                            {idx + 1}. {med.drugName}
                          </strong>
                          <span className="text-[10px] text-slate-500 block">
                            {med.dosage} • {med.frequency} • {med.duration}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveMedicine(med.id)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
                          title="Remove medicine"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Card 4: Action Controls */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleSaveRx}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Record</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-teal-400" />
                  <span>Print Official Rx</span>
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: The Official Authentic Clinical Letterhead (Pad) */}
            <div className="lg:col-span-7 print:col-span-12 print:w-full">
              <div className="bg-white border border-slate-300 rounded-3xl p-6 sm:p-10 shadow-xl print:shadow-none print:border-none print:p-2 print:max-w-none print:w-full print:rounded-none">
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
                      {patientAge || '—'} Yrs / {patientGender}
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
                  <span className="text-slate-900 font-bold text-xs">
                    {rxDiagnosis || 'Dental Consultation & Evaluation'}
                  </span>
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
                            No medications prescribed yet. Click any Quick Preset on the left or "+ Add Medicine" to prescribe.
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
                                className="p-1 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
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
                    <div className="p-3 bg-slate-50/60 rounded-xl border border-slate-200/60 text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-line print:border-none print:p-0 print:bg-transparent">
                      {rxAdvice}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center space-x-2">
                      <strong className="text-slate-900 font-bold text-[11px] uppercase tracking-wider">
                        Next Review / Follow-Up:
                      </strong>
                      <span className="text-xs font-bold text-teal-800">
                        {rxFollowUp ? (
                          new Date(rxFollowUp).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })
                        ) : (
                          <span className="text-slate-600 font-medium italic">
                            SOS / As needed on discomfort or persistence of symptoms
                          </span>
                        )}
                      </span>
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
