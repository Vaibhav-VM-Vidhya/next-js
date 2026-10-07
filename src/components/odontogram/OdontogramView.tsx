import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ToothRecord, ToothSurfaceKey, ConditionCategory, DentitionType, NumberingSystem } from '../../types';
import {
  ADULT_UPPER_TEETH,
  ADULT_LOWER_TEETH,
  PEDIATRIC_UPPER_TEETH,
  PEDIATRIC_LOWER_TEETH,
} from '../../data/toothCatalog';
import { ToothSvg } from './ToothSvg';
import { OdontogramLegend } from './OdontogramLegend';
import { ToothDetailModal } from './ToothDetailModal';
import { TreatmentPlanSummary } from './TreatmentPlanSummary';
import {
  Activity,
  User as UserIcon,
  AlertTriangle,
  RotateCcw,
  Printer,
  Sparkles,
  Info,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export const OdontogramView: React.FC = () => {
  const {
    patients,
    selectedPatientId,
    setSelectedPatientId,
    selectedPatient,
    getPatientOdontogram,
    updateToothSurface,
    updateWholeToothCondition,
    updateToothDetails,
    setOdontogramDentition,
    setOdontogramNumbering,
    resetPatientOdontogram,
  } = useApp();

  const [activeTooth, setActiveTooth] = useState<ToothRecord | null>(null);
  const [conditionFilter, setConditionFilter] = useState<ConditionCategory | null>(null);

  if (!selectedPatient) {
    return (
      <div className="p-8 text-center text-slate-500">
        Please select a patient to view their dental odontogram.
      </div>
    );
  }

  const odontogram = getPatientOdontogram(selectedPatient.id);
  const { dentitionType, numberingSystem, teeth } = odontogram;

  const upperTeethFdis =
    dentitionType === 'adult' ? ADULT_UPPER_TEETH : PEDIATRIC_UPPER_TEETH;
  const lowerTeethFdis =
    dentitionType === 'adult' ? ADULT_LOWER_TEETH : PEDIATRIC_LOWER_TEETH;

  // Split into quadrants for visual midline separation
  const upperRight = upperTeethFdis.slice(0, upperTeethFdis.length / 2);
  const upperLeft = upperTeethFdis.slice(upperTeethFdis.length / 2);

  const lowerRight = lowerTeethFdis.slice(0, lowerTeethFdis.length / 2);
  const lowerLeft = lowerTeethFdis.slice(lowerTeethFdis.length / 2);

  const handleSelectTooth = (tooth: ToothRecord) => {
    setActiveTooth(tooth);
  };

  const handleSelectSurface = (tooth: ToothRecord, surface: ToothSurfaceKey) => {
    setActiveTooth(tooth);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Patient Header & Clinical Alert Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-600 flex items-center justify-center font-bold text-lg">
            {selectedPatient.fullName
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-bold text-slate-900">
                {selectedPatient.fullName}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                MRN: {selectedPatient.mrn}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
              <span>{selectedPatient.age} Yrs • {selectedPatient.gender}</span>
              <span>Blood: {selectedPatient.bloodGroup}</span>
              <span>Phone: {selectedPatient.phone}</span>
            </div>
          </div>
        </div>

        {/* Patient Switcher & Alerts */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {selectedPatient.allergies.length > 0 && (
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-semibold">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              <span>Allergy: {selectedPatient.allergies.join(', ')}</span>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-medium">Switch:</span>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.fullName} ({p.mrn})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Odontogram Control Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Dentition Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-1">
            Dentition:
          </span>
          <div className="bg-slate-100 p-1 rounded-xl flex space-x-1">
            <button
              onClick={() => setOdontogramDentition(selectedPatient.id, 'adult')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                dentitionType === 'adult'
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Adult (32 Teeth)
            </button>
            <button
              onClick={() => setOdontogramDentition(selectedPatient.id, 'pediatric')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                dentitionType === 'pediatric'
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pediatric (20 Primary Teeth)
            </button>
          </div>
        </div>

        {/* Numbering System Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-1">
            Notation:
          </span>
          <div className="bg-slate-100 p-1 rounded-xl flex space-x-1">
            <button
              onClick={() => setOdontogramNumbering(selectedPatient.id, 'fdi')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                numberingSystem === 'fdi'
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              FDI (11-48)
            </button>
            <button
              onClick={() => setOdontogramNumbering(selectedPatient.id, 'universal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                numberingSystem === 'universal'
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Universal ({dentitionType === 'adult' ? '1-32' : 'A-T'})
            </button>
            <button
              onClick={() => setOdontogramNumbering(selectedPatient.id, 'palmer')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                numberingSystem === 'palmer'
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Palmer
            </button>
          </div>
        </div>

        {/* Quick Chart Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => resetPatientOdontogram(selectedPatient.id)}
            className="flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200"
            title="Reset chart back to default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Chart</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Chart Report</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Dental Chart Board */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs overflow-x-auto">
        <div className="min-w-[880px] space-y-6">
          {/* Chart Header Labels (Patient's Right / Patient's Left) */}
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 px-4 border-b border-slate-100 pb-2">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              <span>PATIENT RIGHT (DEXTER)</span>
            </span>
            <span className="text-slate-500 font-black">MIDLINE DIVIDER</span>
            <span className="flex items-center space-x-1.5">
              <span>PATIENT LEFT (SINISTER)</span>
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            </span>
          </div>

          {/* UPPER ARCH (MAXILLA) */}
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2 text-xs font-black tracking-widest uppercase text-sky-800 bg-sky-50/70 py-1 rounded-lg">
              <span>Upper Arch — Maxilla</span>
            </div>

            <div className="flex items-center justify-center space-x-1">
              {/* Upper Right Quadrant (Q1 / Q5) */}
              <div className="flex space-x-1 justify-end">
                {upperRight.map((fdi) => {
                  const tooth = teeth[fdi];
                  if (!tooth) return null;
                  return (
                    <ToothSvg
                      key={fdi}
                      tooth={tooth}
                      numberingSystem={numberingSystem}
                      isSelected={activeTooth?.fdiNumber === fdi}
                      onSelectTooth={handleSelectTooth}
                      onSelectSurface={handleSelectSurface}
                    />
                  );
                })}
              </div>

              {/* Center Midline separator */}
              <div className="w-0.5 h-36 bg-sky-400 mx-2 rounded-full opacity-60 flex flex-col justify-between items-center py-2" />

              {/* Upper Left Quadrant (Q2 / Q6) */}
              <div className="flex space-x-1 justify-start">
                {upperLeft.map((fdi) => {
                  const tooth = teeth[fdi];
                  if (!tooth) return null;
                  return (
                    <ToothSvg
                      key={fdi}
                      tooth={tooth}
                      numberingSystem={numberingSystem}
                      isSelected={activeTooth?.fdiNumber === fdi}
                      onSelectTooth={handleSelectTooth}
                      onSelectSurface={handleSelectSurface}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* OCCLUSAL PLANE DIVIDER */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-dashed border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Occlusal Plane
              </span>
            </div>
          </div>

          {/* LOWER ARCH (MANDIBLE) */}
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-1">
              {/* Lower Right Quadrant (Q4 / Q8) */}
              <div className="flex space-x-1 justify-end">
                {lowerRight.map((fdi) => {
                  const tooth = teeth[fdi];
                  if (!tooth) return null;
                  return (
                    <ToothSvg
                      key={fdi}
                      tooth={tooth}
                      numberingSystem={numberingSystem}
                      isSelected={activeTooth?.fdiNumber === fdi}
                      onSelectTooth={handleSelectTooth}
                      onSelectSurface={handleSelectSurface}
                    />
                  );
                })}
              </div>

              {/* Center Midline separator */}
              <div className="w-0.5 h-36 bg-sky-400 mx-2 rounded-full opacity-60" />

              {/* Lower Left Quadrant (Q3 / Q7) */}
              <div className="flex space-x-1 justify-start">
                {lowerLeft.map((fdi) => {
                  const tooth = teeth[fdi];
                  if (!tooth) return null;
                  return (
                    <ToothSvg
                      key={fdi}
                      tooth={tooth}
                      numberingSystem={numberingSystem}
                      isSelected={activeTooth?.fdiNumber === fdi}
                      onSelectTooth={handleSelectTooth}
                      onSelectSurface={handleSelectSurface}
                    />
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-center space-x-2 text-xs font-black tracking-widest uppercase text-sky-800 bg-sky-50/70 py-1 rounded-lg">
              <span>Lower Arch — Mandible</span>
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Legend & Surface Code Filter */}
      <OdontogramLegend
        activeConditionFilter={conditionFilter}
        onSelectConditionFilter={(c) => setConditionFilter(c)}
      />

      {/* Treatment Plan & Cost Estimator Slice */}
      <TreatmentPlanSummary
        teeth={teeth}
        patient={selectedPatient}
        numberingSystem={numberingSystem}
      />

      {/* Selected Tooth Detail / Clinical Editing Modal */}
      {activeTooth && (
        <ToothDetailModal
          tooth={teeth[activeTooth.fdiNumber] || activeTooth}
          numberingSystem={numberingSystem}
          onClose={() => setActiveTooth(null)}
          onUpdateSurface={(surface, condition) =>
            updateToothSurface(selectedPatient.id, activeTooth.fdiNumber, surface, condition)
          }
          onUpdateWholeTooth={(condition) =>
            updateWholeToothCondition(selectedPatient.id, activeTooth.fdiNumber, condition)
          }
          onUpdateDetails={(details) =>
            updateToothDetails(selectedPatient.id, activeTooth.fdiNumber, details)
          }
          onResetTooth={() => {
            ['occlusal', 'mesial', 'distal', 'buccal', 'lingual'].forEach((s) =>
              updateToothSurface(selectedPatient.id, activeTooth.fdiNumber, s as any, 'sound')
            );
            updateWholeToothCondition(selectedPatient.id, activeTooth.fdiNumber, undefined);
            updateToothDetails(selectedPatient.id, activeTooth.fdiNumber, {
              notes: '',
              plannedProcedure: '',
              estimatedFee: 0,
            });
          }}
        />
      )}
    </div>
  );
};
