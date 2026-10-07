import React from 'react';
import type { ToothRecord, NumberingSystem, Patient } from '../../types';
import { CONDITIONS_REGISTRY } from '../../data/toothCatalog';
import { Calculator, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface TreatmentPlanSummaryProps {
  teeth: Record<number, ToothRecord>;
  patient: Patient;
  numberingSystem: NumberingSystem;
}

export const TreatmentPlanSummary: React.FC<TreatmentPlanSummaryProps> = ({
  teeth,
  patient,
  numberingSystem,
}) => {
  const { createInvoice, setActiveView } = useApp();

  // Find all teeth that either have active caries, planned procedures, or indicated treatments
  const teethWithIssues = Object.values(teeth).filter((t) => {
    const hasCaries = Object.values(t.surfaces).some((c) => c === 'caries');
    const hasProcedures = !!t.plannedProcedure || (t.estimatedFee && t.estimatedFee > 0);
    const hasPathology =
      t.wholeToothCondition === 'rct_needed' ||
      t.wholeToothCondition === 'extraction_indicated' ||
      t.wholeToothCondition === 'implant';
    return hasCaries || hasProcedures || hasPathology;
  });

  const totalEstimatedCost = teethWithIssues.reduce((sum, t) => {
    return sum + (t.estimatedFee || 0);
  }, 0);

  const handleGenerateInvoice = () => {
    if (teethWithIssues.length === 0) return;

    const items = teethWithIssues.map((t, idx) => ({
      id: `item-${Date.now()}-${idx}`,
      description: t.plannedProcedure || `${t.name} Treatment`,
      toothNumber: t.fdiNumber,
      unitPrice: t.estimatedFee || 2500,
      quantity: 1,
      discount: 0,
      total: t.estimatedFee || 2500,
    }));

    const subtotal = items.reduce((s, i) => s + i.total, 0);
    const taxRate = 5;
    const taxAmount = Math.round((subtotal * taxRate) / 100);

    createInvoice({
      patientId: patient.id,
      patientName: patient.fullName,
      patientPhone: patient.phone,
      branchId: patient.branchId,
      doctorId: 'doc-sarah',
      dueDate: new Date().toISOString().split('T')[0],
      items,
      subtotal,
      taxRate,
      taxAmount,
      discountAmount: 0,
      grandTotal: subtotal + taxAmount,
      paidAmount: 0,
      status: 'pending',
      notes: `Generated from Clinical Odontogram Chart for ${patient.fullName}`,
    });

    setActiveView('billing');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">
              Clinical Treatment Plan & Cost Estimate
            </h3>
            <p className="text-xs text-slate-500">
              Active pathologies & restorative requirements identified on chart
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">
              Total Estimate
            </span>
            <span className="text-lg font-black text-slate-900">
              ₹{totalEstimatedCost.toLocaleString('en-IN')}
            </span>
          </div>

          <button
            disabled={teethWithIssues.length === 0}
            onClick={handleGenerateInvoice}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              teethWithIssues.length === 0
                ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
            }`}
          >
            <span>Convert to Invoice</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {teethWithIssues.length === 0 ? (
        <div className="py-8 text-center text-slate-400 flex flex-col items-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
          <p className="text-sm font-medium text-slate-600">No active pathologies charted</p>
          <p className="text-xs text-slate-400 mt-0.5">
            All teeth are marked healthy/sound or restorations are stable.
          </p>
        </div>
      ) : (
        <div className="mt-4 divide-y divide-slate-100 max-h-60 overflow-y-auto">
          {teethWithIssues.map((t) => {
            let displayNum = t.fdiNumber.toString();
            if (numberingSystem === 'universal') displayNum = t.universalNumber;
            if (numberingSystem === 'palmer') displayNum = t.palmerNotation;

            const surfacesAffected = Object.entries(t.surfaces)
              .filter(([_, cond]) => cond !== 'sound')
              .map(([surf, cond]) => `${surf.toUpperCase()} (${CONDITIONS_REGISTRY[cond]?.shortLabel || cond})`)
              .join(', ');

            return (
              <div
                key={t.fdiNumber}
                className="py-2.5 flex items-center justify-between text-xs hover:bg-slate-50 px-2 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-7 h-7 rounded-lg bg-sky-50 text-sky-700 font-bold flex items-center justify-center border border-sky-200">
                    #{displayNum}
                  </span>
                  <div>
                    <span className="font-semibold text-slate-800">
                      {t.name}
                    </span>
                    <div className="text-[11px] text-slate-500 flex items-center space-x-2 mt-0.5">
                      {surfacesAffected && <span>Surfaces: {surfacesAffected}</span>}
                      {t.wholeToothCondition && (
                        <span className="font-medium text-amber-600">
                          [{CONDITIONS_REGISTRY[t.wholeToothCondition]?.label}]
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className="font-medium text-slate-700 block">
                      {t.plannedProcedure || 'Evaluation & Restoration'}
                    </span>
                    <span className="font-bold text-slate-900 text-[11px]">
                      {t.estimatedFee ? `₹${t.estimatedFee.toLocaleString('en-IN')}` : 'Fee Pending'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
