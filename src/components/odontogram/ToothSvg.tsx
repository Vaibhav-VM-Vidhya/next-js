import React from 'react';
import type { ToothRecord, ToothSurfaceKey, NumberingSystem } from '../../types';
import { CONDITIONS_REGISTRY } from '../../data/toothCatalog';

interface ToothSvgProps {
  tooth: ToothRecord;
  numberingSystem: NumberingSystem;
  isSelected?: boolean;
  onSelectTooth: (tooth: ToothRecord) => void;
  onSelectSurface?: (tooth: ToothRecord, surface: ToothSurfaceKey) => void;
}

export const ToothSvg: React.FC<ToothSvgProps> = ({
  tooth,
  numberingSystem,
  isSelected = false,
  onSelectTooth,
  onSelectSurface,
}) => {
  // Determine display number based on numbering system
  let displayNumber = tooth.fdiNumber.toString();
  if (numberingSystem === 'universal') {
    displayNumber = tooth.universalNumber;
  } else if (numberingSystem === 'palmer') {
    displayNumber = tooth.palmerNotation;
  }

  // Orientation of surfaces:
  // For Maxillary (Upper): Top is Buccal/Facial, Bottom is Lingual/Palatal
  // For Mandibular (Lower): Top is Lingual/Palatal, Bottom is Buccal/Facial
  // Mesial is towards the midline; Distal is away from midline.
  // Upper Right (Q1) & Lower Right (Q4): Midline is to the RIGHT (so Right side is Mesial, Left is Distal)
  // Upper Left (Q2) & Lower Left (Q3): Midline is to the LEFT (so Left side is Mesial, Right is Distal)
  const isRightQuadrant = tooth.quadrant === 1 || tooth.quadrant === 4 || tooth.quadrant === 5 || tooth.quadrant === 8;
  const leftSurface: ToothSurfaceKey = isRightQuadrant ? 'distal' : 'mesial';
  const rightSurface: ToothSurfaceKey = isRightQuadrant ? 'mesial' : 'distal';
  const topSurface: ToothSurfaceKey = tooth.arch === 'maxillary' ? 'buccal' : 'lingual';
  const bottomSurface: ToothSurfaceKey = tooth.arch === 'maxillary' ? 'lingual' : 'buccal';

  const getSurfaceColor = (surfaceKey: ToothSurfaceKey): string => {
    const condition = tooth.surfaces[surfaceKey] || 'sound';
    return CONDITIONS_REGISTRY[condition]?.color || '#f1f5f9';
  };

  const getSurfaceBorder = (surfaceKey: ToothSurfaceKey): string => {
    const condition = tooth.surfaces[surfaceKey] || 'sound';
    return CONDITIONS_REGISTRY[condition]?.borderColor || '#cbd5e1';
  };

  const hasWholeCondition = !!tooth.wholeToothCondition && tooth.wholeToothCondition !== 'sound';
  const wholeMeta = tooth.wholeToothCondition ? CONDITIONS_REGISTRY[tooth.wholeToothCondition] : null;

  // Root graphic paths based on tooth type and arch
  const renderRoots = () => {
    const isUpper = tooth.arch === 'maxillary';
    const isMolar = tooth.type === 'molar';
    const isPremolar = tooth.type === 'premolar';

    // In upper arch, roots point upwards (Y: 2 to 24). In lower arch, roots point downwards (Y: 66 to 88).
    if (isUpper) {
      if (isMolar) {
        // Upper molar has 3 roots
        return (
          <g className="roots stroke-slate-300 dark:stroke-slate-600 fill-slate-100 dark:fill-slate-800">
            <path d="M 12 26 C 10 14, 14 6, 17 4 C 19 6, 20 16, 22 26 Z" strokeWidth="1" />
            <path d="M 23 26 C 24 16, 27 6, 30 4 C 33 6, 34 16, 36 26 Z" strokeWidth="1" />
            <path d="M 37 26 C 39 16, 42 6, 45 4 C 48 6, 49 14, 48 26 Z" strokeWidth="1" />
          </g>
        );
      } else if (isPremolar) {
        // Upper premolar has 2 roots
        return (
          <g className="roots stroke-slate-300 fill-slate-100">
            <path d="M 18 26 C 16 14, 20 6, 24 4 C 27 6, 28 16, 29 26 Z" strokeWidth="1" />
            <path d="M 31 26 C 32 16, 35 6, 38 4 C 42 6, 43 14, 42 26 Z" strokeWidth="1" />
          </g>
        );
      } else {
        // Incisor / Canine single conical root
        return (
          <g className="roots stroke-slate-300 fill-slate-100">
            <path d="M 20 26 C 22 14, 26 4, 30 2 C 34 4, 38 14, 40 26 Z" strokeWidth="1" />
          </g>
        );
      }
    } else {
      // Lower arch roots point downwards
      if (isMolar) {
        // Lower molar has 2 broad roots
        return (
          <g className="roots stroke-slate-300 fill-slate-100">
            <path d="M 14 64 C 12 76, 16 86, 22 88 C 25 86, 26 76, 27 64 Z" strokeWidth="1" />
            <path d="M 33 64 C 34 76, 36 86, 40 88 C 45 86, 48 76, 46 64 Z" strokeWidth="1" />
          </g>
        );
      } else if (isPremolar) {
        return (
          <g className="roots stroke-slate-300 fill-slate-100">
            <path d="M 20 64 C 19 76, 24 86, 28 88 C 33 86, 37 76, 36 64 Z" strokeWidth="1" />
          </g>
        );
      } else {
        // Single root
        return (
          <g className="roots stroke-slate-300 fill-slate-100">
            <path d="M 21 64 C 23 76, 27 86, 30 88 C 33 86, 37 76, 39 64 Z" strokeWidth="1" />
          </g>
        );
      }
    }
  };

  const handleSurfaceClick = (e: React.MouseEvent, surf: ToothSurfaceKey) => {
    e.stopPropagation();
    if (onSelectSurface) {
      onSelectSurface(tooth, surf);
    } else {
      onSelectTooth(tooth);
    }
  };

  return (
    <div
      onClick={() => onSelectTooth(tooth)}
      className={`group relative flex flex-col items-center p-1.5 rounded-xl cursor-pointer transition-all duration-200 select-none ${
        isSelected
          ? 'bg-sky-100 border-2 border-sky-600 shadow-md scale-105'
          : 'bg-white hover:bg-slate-50 border border-slate-200 hover:border-sky-300 hover:shadow-sm'
      }`}
      style={{ width: '64px' }}
      title={`${tooth.name} (#${tooth.fdiNumber}) - Click to inspect or chart`}
    >
      {/* Top Number Label */}
      <div className="flex items-center justify-between w-full px-0.5 mb-1">
        <span
          className={`text-xs font-bold leading-none ${
            isSelected ? 'text-sky-700' : 'text-slate-800'
          }`}
        >
          {displayNumber}
        </span>
        <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-400">
          {tooth.type[0].toUpperCase()}
        </span>
      </div>

      {/* SVG Canvas for Tooth Graphic */}
      <div className="relative w-12 h-[82px] flex items-center justify-center">
        <svg
          viewBox="0 0 60 90"
          className="w-full h-full overflow-visible drop-shadow-xs"
        >
          {/* Roots outline */}
          {renderRoots()}

          {/* Endodontic RCT Obturation Line Graphic (if RCT) */}
          {(tooth.wholeToothCondition === 'rct_completed' || tooth.wholeToothCondition === 'rct_needed') && (
            <g>
              <line
                x1="30"
                y1={tooth.arch === 'maxillary' ? 6 : 66}
                x2="30"
                y2={tooth.arch === 'maxillary' ? 26 : 84}
                stroke={tooth.wholeToothCondition === 'rct_completed' ? '#10b981' : '#f97316'}
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray={tooth.wholeToothCondition === 'rct_needed' ? '2,2' : undefined}
              />
            </g>
          )}

          {/* Implant Screw Graphic (if implant) */}
          {tooth.wholeToothCondition === 'implant' && (
            <g>
              <rect
                x="24"
                y={tooth.arch === 'maxillary' ? 4 : 64}
                width="12"
                height="22"
                rx="2"
                fill="#6366f1"
                stroke="#4338ca"
                strokeWidth="1"
              />
              <line x1="24" y1={tooth.arch === 'maxillary' ? 8 : 68} x2="36" y2={tooth.arch === 'maxillary' ? 8 : 68} stroke="#ffffff" strokeWidth="1.5" />
              <line x1="24" y1={tooth.arch === 'maxillary' ? 14 : 74} x2="36" y2={tooth.arch === 'maxillary' ? 14 : 74} stroke="#ffffff" strokeWidth="1.5" />
              <line x1="24" y1={tooth.arch === 'maxillary' ? 20 : 80} x2="36" y2={tooth.arch === 'maxillary' ? 20 : 80} stroke="#ffffff" strokeWidth="1.5" />
            </g>
          )}

          {/* 5-Surface Crown Geometric Representation */}
          {/* Center: Occlusal (O) or Incisal */}
          {/* Top: Buccal / Lingual */}
          {/* Bottom: Lingual / Buccal */}
          {/* Left: Mesial / Distal */}
          {/* Right: Distal / Mesial */}
          <g transform="translate(10, 25)">
            {/* Crown Base Background */}
            <rect
              x="0"
              y="0"
              width="40"
              height="40"
              rx="6"
              fill={tooth.wholeToothCondition === 'crown' ? '#f59e0b' : '#ffffff'}
              stroke={tooth.wholeToothCondition === 'crown' ? '#d97706' : '#94a3b8'}
              strokeWidth={tooth.wholeToothCondition === 'crown' ? '2.5' : '1'}
            />

            {/* Top Surface (Buccal or Lingual) */}
            <polygon
              points="2,2 38,2 29,11 11,11"
              fill={getSurfaceColor(topSurface)}
              stroke={getSurfaceBorder(topSurface)}
              strokeWidth="0.8"
              className="transition-colors hover:brightness-90 cursor-pointer"
              onClick={(e) => handleSurfaceClick(e, topSurface)}
            />

            {/* Bottom Surface (Lingual or Buccal) */}
            <polygon
              points="11,29 29,29 38,38 2,38"
              fill={getSurfaceColor(bottomSurface)}
              stroke={getSurfaceBorder(bottomSurface)}
              strokeWidth="0.8"
              className="transition-colors hover:brightness-90 cursor-pointer"
              onClick={(e) => handleSurfaceClick(e, bottomSurface)}
            />

            {/* Left Surface (Mesial or Distal) */}
            <polygon
              points="2,2 11,11 11,29 2,38"
              fill={getSurfaceColor(leftSurface)}
              stroke={getSurfaceBorder(leftSurface)}
              strokeWidth="0.8"
              className="transition-colors hover:brightness-90 cursor-pointer"
              onClick={(e) => handleSurfaceClick(e, leftSurface)}
            />

            {/* Right Surface (Distal or Mesial) */}
            <polygon
              points="38,2 38,38 29,29 29,11"
              fill={getSurfaceColor(rightSurface)}
              stroke={getSurfaceBorder(rightSurface)}
              strokeWidth="0.8"
              className="transition-colors hover:brightness-90 cursor-pointer"
              onClick={(e) => handleSurfaceClick(e, rightSurface)}
            />

            {/* Center Surface (Occlusal / Incisal) */}
            <rect
              x="11"
              y="11"
              width="18"
              height="18"
              rx="2"
              fill={getSurfaceColor('occlusal')}
              stroke={getSurfaceBorder('occlusal')}
              strokeWidth="0.8"
              className="transition-colors hover:brightness-90 cursor-pointer"
              onClick={(e) => handleSurfaceClick(e, 'occlusal')}
            />
          </g>

          {/* Missing Tooth Overlay (Bold Red Cross) */}
          {tooth.wholeToothCondition === 'missing' && (
            <g className="missing-cross stroke-red-600" strokeWidth="3" strokeLinecap="round">
              <line x1="8" y1="10" x2="52" y2="80" />
              <line x1="52" y1="10" x2="8" y2="80" />
            </g>
          )}

          {/* Extraction Indicated Overlay */}
          {tooth.wholeToothCondition === 'extraction_indicated' && (
            <g className="extraction-cross stroke-red-600" strokeWidth="3" strokeDasharray="4,2">
              <line x1="10" y1="20" x2="50" y2="70" />
              <line x1="50" y1="20" x2="10" y2="70" />
            </g>
          )}

          {/* Crown Badge Icon */}
          {tooth.wholeToothCondition === 'crown' && (
            <g transform="translate(22, 12)">
              <polygon points="0,7 3,0 8,5 13,0 16,7" fill="#f59e0b" stroke="#b45309" strokeWidth="0.8" />
            </g>
          )}
        </svg>

        {/* Condition mini tag if whole tooth status exists */}
        {hasWholeCondition && wholeMeta && (
          <span
            className={`absolute bottom-0 text-[8px] font-black uppercase px-1 py-0.2 rounded shadow-xs ${wholeMeta.bgClass} ${wholeMeta.textClass}`}
            style={{ fontSize: '7.5px' }}
          >
            {wholeMeta.shortLabel}
          </span>
        )}
      </div>

      {/* Planned procedure indicator dot */}
      {tooth.plannedProcedure && (
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-0.5 animate-pulse" title={`Plan: ${tooth.plannedProcedure}`} />
      )}
    </div>
  );
};
