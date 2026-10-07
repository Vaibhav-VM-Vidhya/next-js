import React, { useState, useEffect } from 'react';
import type { ToothRecord, ToothSurfaceKey, ConditionCategory, NumberingSystem } from '../../types';
import { CONDITIONS_REGISTRY } from '../../data/toothCatalog';
import { X, Check, Trash2, Sparkles, DollarSign, FileText } from 'lucide-react';

interface ToothDetailModalProps {
  tooth: ToothRecord | null;
  numberingSystem: NumberingSystem;
  onClose: () => void;
  onUpdateSurface: (surface: ToothSurfaceKey, condition: ConditionCategory) => void;
  onUpdateWholeTooth: (condition: ConditionCategory | undefined) => void;
  onUpdateDetails: (details: { notes?: string; plannedProcedure?: string; estimatedFee?: number }) => void;
  onResetTooth: () => void;
}

export const ToothDetailModal: React.FC<ToothDetailModalProps> = ({
  tooth,
  numberingSystem,
  onClose,
  onUpdateSurface,
  onUpdateWholeTooth,
  onUpdateDetails,
  onResetTooth,
}) => {
  if (!tooth) return null;

  const [selectedSurfaces, setSelectedSurfaces] = useState<ToothSurfaceKey[]>(['occlusal']);
  const [notes, setNotes] = useState(tooth.clinicalNotes || '');
  const [procedure, setProcedure] = useState(tooth.plannedProcedure || '');
  const [fee, setFee] = useState<string>(tooth.estimatedFee ? tooth.estimatedFee.toString() : '');

  useEffect(() => {
    setNotes(tooth.clinicalNotes || '');
    setProcedure(tooth.plannedProcedure || '');
    setFee(tooth.estimatedFee ? tooth.estimatedFee.toString() : '');
  }, [tooth]);

  let displayNum = tooth.fdiNumber.toString();
  if (numberingSystem === 'universal') displayNum = tooth.universalNumber;
  if (numberingSystem === 'palmer') displayNum = tooth.palmerNotation;

  const toggleSurface = (surf: ToothSurfaceKey) => {
    if (selectedSurfaces.includes(surf)) {
      setSelectedSurfaces(selectedSurfaces.filter((s) => s !== surf));
    } else {
      setSelectedSurfaces([...selectedSurfaces, surf]);
    }
  };

  const applyConditionToSelectedSurfaces = (cond: ConditionCategory) => {
    selectedSurfaces.forEach((surf) => {
      onUpdateSurface(surf, cond);
    });
    // Auto populate procedure and fee if empty
    if (!procedure && CONDITIONS_REGISTRY[cond]?.defaultFee > 0) {
      setProcedure(`${CONDITIONS_REGISTRY[cond].label} (${selectedSurfaces.join(', ')})`);
      setFee(CONDITIONS_REGISTRY[cond].defaultFee.toString());
    }
  };

  const handleSaveDetails = () => {
    onUpdateDetails({
      notes,
      plannedProcedure: procedure,
      estimatedFee: fee ? parseFloat(fee) : undefined,
    });
    onClose();
  };

  const surfacesList: { key: ToothSurfaceKey; label: string; short: string }[] = [
    { key: 'occlusal', label: tooth.type === 'incisor' || tooth.type === 'canine' ? 'Incisal (I)' : 'Occlusal (O)', short: 'O' },
    { key: 'mesial', label: 'Mesial (M)', short: 'M' },
    { key: 'distal', label: 'Distal (D)', short: 'D' },
    { key: 'buccal', label: 'Buccal / Facial (B)', short: 'B' },
    { key: 'lingual', label: 'Lingual / Palatal (L)', short: 'L' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400 font-bold text-lg">
              #{displayNum}
            </div>
            <div>
              <h3 className="font-semibold text-lg text-white">
                {tooth.name}
              </h3>
              <p className="text-xs text-slate-400">
                FDI #{tooth.fdiNumber} • Universal #{tooth.universalNumber} • {tooth.arch.toUpperCase()} ARCH • Q{tooth.quadrant}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Quick Presets */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
              Quick Clinical Presets
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => {
                  onUpdateWholeTooth(undefined);
                  ['occlusal', 'mesial', 'distal', 'buccal', 'lingual'].forEach((s) =>
                    onUpdateSurface(s as any, 'sound')
                  );
                }}
                className="px-3 py-2 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors border border-slate-200"
              >
                Mark All Sound
              </button>
              <button
                onClick={() => onUpdateWholeTooth('missing')}
                className="px-3 py-2 text-xs font-medium bg-slate-100 hover:bg-red-50 text-red-600 rounded-lg transition-colors border border-slate-200 hover:border-red-300"
              >
                Extracted / Missing
              </button>
              <button
                onClick={() => {
                  onUpdateWholeTooth('implant');
                  setProcedure('Titanium Implant & Abutment');
                  setFee('35000');
                }}
                className="px-3 py-2 text-xs font-medium bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors border border-indigo-200"
              >
                Implant Fixture
              </button>
              <button
                onClick={() => {
                  onUpdateWholeTooth('crown');
                  setProcedure('Zirconia Crown Placement');
                  setFee('9500');
                }}
                className="px-3 py-2 text-xs font-medium bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg transition-colors border border-amber-200"
              >
                Full Crown
              </button>
            </div>
          </div>

          {/* Section 1: Surface Selector & Condition Application */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                1. Select Tooth Surfaces to Chart
              </label>
              <div className="space-x-1.5">
                <button
                  onClick={() => setSelectedSurfaces(['occlusal', 'mesial', 'distal', 'buccal', 'lingual'])}
                  className="text-[11px] font-semibold text-sky-600 hover:underline"
                >
                  Select All
                </button>
                <span className="text-slate-300">|</span>
                <button
                  onClick={() => setSelectedSurfaces([])}
                  className="text-[11px] font-semibold text-slate-500 hover:underline"
                >
                  Deselect
                </button>
              </div>
            </div>

            {/* Surface Pills with Current Condition Display */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
              {surfacesList.map((surf) => {
                const currentCond = tooth.surfaces[surf.key] || 'sound';
                const condMeta = CONDITIONS_REGISTRY[currentCond];
                const isChecked = selectedSurfaces.includes(surf.key);

                return (
                  <button
                    key={surf.key}
                    onClick={() => toggleSurface(surf.key)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isChecked
                        ? 'border-sky-500 bg-sky-50/80 ring-2 ring-sky-400/30'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-800">{surf.short}</span>
                      <span
                        className="w-2.5 h-2.5 rounded-full border"
                        style={{ backgroundColor: condMeta.color, borderColor: condMeta.borderColor }}
                      />
                    </div>
                    <span className="text-[11px] text-slate-600 truncate">{surf.label}</span>
                    <span className="text-[10px] font-medium text-slate-400 mt-1 truncate">
                      {condMeta.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Condition Palette */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 block">
                2. Apply Condition to Selected Surface(s) ({selectedSurfaces.length} chosen)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(
                  [
                    'caries',
                    'restoration_composite',
                    'restoration_amalgam',
                    'restoration_gic',
                    'veneer',
                    'calculus',
                    'sound',
                  ] as ConditionCategory[]
                ).map((condKey) => {
                  const meta = CONDITIONS_REGISTRY[condKey];
                  return (
                    <button
                      key={condKey}
                      disabled={selectedSurfaces.length === 0}
                      onClick={() => applyConditionToSelectedSurfaces(condKey)}
                      className={`flex items-center space-x-2 p-2 rounded-lg border text-left transition-all ${
                        selectedSurfaces.length === 0
                          ? 'opacity-40 cursor-not-allowed bg-slate-100'
                          : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded shadow-xs shrink-0 border"
                        style={{ backgroundColor: meta.color, borderColor: meta.borderColor }}
                      />
                      <span className="text-xs font-medium text-slate-700 truncate">
                        {meta.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 2: Whole Tooth Condition */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 block">
              Whole Tooth Status (Structural / Surgical)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(
                [
                  'crown',
                  'rct_needed',
                  'rct_completed',
                  'missing',
                  'extraction_indicated',
                  'implant',
                  'bridge_pontic',
                  'bridge_abutment',
                  'impacted',
                ] as ConditionCategory[]
              ).map((condKey) => {
                const meta = CONDITIONS_REGISTRY[condKey];
                const isActive = tooth.wholeToothCondition === condKey;

                return (
                  <button
                    key={condKey}
                    onClick={() => {
                      const next = isActive ? undefined : condKey;
                      onUpdateWholeTooth(next);
                      if (next && meta.defaultFee > 0 && !procedure) {
                        setProcedure(meta.label);
                        setFee(meta.defaultFee.toString());
                      }
                    }}
                    className={`flex items-center space-x-2 p-2 rounded-lg border text-left transition-all ${
                      isActive
                        ? 'border-sky-500 bg-sky-50 font-bold text-sky-900 ring-1 ring-sky-500'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded shadow-xs shrink-0 border"
                      style={{ backgroundColor: meta.color, borderColor: meta.borderColor }}
                    />
                    <span className="text-xs font-medium truncate">{meta.label}</span>
                  </button>
                );
              })}
            </div>
            {tooth.wholeToothCondition && (
              <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                <span>
                  Current status:{' '}
                  <strong className="text-slate-800">
                    {CONDITIONS_REGISTRY[tooth.wholeToothCondition]?.label}
                  </strong>
                </span>
                <button
                  onClick={() => onUpdateWholeTooth(undefined)}
                  className="text-red-500 hover:underline"
                >
                  Clear Status
                </button>
              </div>
            )}
          </div>

          {/* Section 3: Treatment Planning & Clinical Notes */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Planned Procedure</span>
              </label>
              <input
                type="text"
                value={procedure}
                onChange={(e) => setProcedure(e.target.value)}
                placeholder="e.g. Class II Composite Resin / All-Ceramic Zirconia Crown"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center space-x-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Estimated Procedure Fee (₹ / $)</span>
                </label>
                <input
                  type="number"
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  placeholder="e.g. 3500"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center space-x-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>Clinical Observations & Notes</span>
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Mild tenderness on percussion, pulp vitality positive"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-100 px-6 py-4 flex items-center justify-between border-t border-slate-200">
          <button
            onClick={() => {
              onResetTooth();
              onClose();
            }}
            className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Reset Tooth</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveDetails}
              className="flex items-center space-x-1.5 px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-xs transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
