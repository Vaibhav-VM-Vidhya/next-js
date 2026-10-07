import React from 'react';
import { CONDITIONS_REGISTRY } from '../../data/toothCatalog';
import type { ConditionCategory } from '../../types';

interface OdontogramLegendProps {
  activeConditionFilter?: ConditionCategory | null;
  onSelectConditionFilter?: (condition: ConditionCategory | null) => void;
}

export const OdontogramLegend: React.FC<OdontogramLegendProps> = ({
  activeConditionFilter,
  onSelectConditionFilter,
}) => {
  const legendItems = Object.values(CONDITIONS_REGISTRY);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Clinical Conditions & Color Standard
        </h4>
        {activeConditionFilter && onSelectConditionFilter && (
          <button
            onClick={() => onSelectConditionFilter(null)}
            className="text-[11px] font-semibold text-sky-600 hover:text-sky-700 underline"
          >
            Clear Filter
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 text-xs">
        {legendItems.map((item) => {
          const isSelected = activeConditionFilter === item.key;
          return (
            <button
              key={item.key}
              onClick={() =>
                onSelectConditionFilter &&
                onSelectConditionFilter(isSelected ? null : item.key)
              }
              className={`flex items-center space-x-2 p-1.5 rounded-lg border text-left transition-all ${
                isSelected
                  ? 'border-sky-500 bg-sky-50 shadow-xs'
                  : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span
                className="w-3.5 h-3.5 rounded shadow-xs shrink-0 border"
                style={{
                  backgroundColor: item.color,
                  borderColor: item.borderColor,
                }}
              />
              <span className="truncate text-[11px] font-medium text-slate-700">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
