import type { ConditionCategory, DentitionType, ToothRecord } from '../types';

export interface ConditionMeta {
  key: ConditionCategory;
  label: string;
  shortLabel: string;
  color: string;
  borderColor: string;
  bgClass: string;
  textClass: string;
  defaultFee: number;
  description: string;
  scope: 'surface' | 'whole' | 'both';
}

export const CONDITIONS_REGISTRY: Record<ConditionCategory, ConditionMeta> = {
  sound: {
    key: 'sound',
    label: 'Healthy / Sound',
    shortLabel: 'S',
    color: '#e2e8f0', // slate-200
    borderColor: '#94a3b8',
    bgClass: 'bg-slate-100',
    textClass: 'text-slate-700',
    defaultFee: 0,
    description: 'Natural tooth structure without pathology or restoration',
    scope: 'both',
  },
  caries: {
    key: 'caries',
    label: 'Dental Caries / Decay',
    shortLabel: 'D',
    color: '#ef4444', // red-500
    borderColor: '#b91c1c',
    bgClass: 'bg-red-500',
    textClass: 'text-white',
    defaultFee: 2500,
    description: 'Active carious lesion requiring excavation and restoration',
    scope: 'both',
  },
  restoration_composite: {
    key: 'restoration_composite',
    label: 'Composite Filling (Tooth Colored)',
    shortLabel: 'CR',
    color: '#0284c7', // sky-600
    borderColor: '#0369a1',
    bgClass: 'bg-sky-500',
    textClass: 'text-white',
    defaultFee: 3200,
    description: 'Existing or placed tooth-colored aesthetic resin restoration',
    scope: 'surface',
  },
  restoration_amalgam: {
    key: 'restoration_amalgam',
    label: 'Amalgam / Silver Restoration',
    shortLabel: 'AM',
    color: '#475569', // slate-600
    borderColor: '#334155',
    bgClass: 'bg-slate-600',
    textClass: 'text-white',
    defaultFee: 2000,
    description: 'Existing metal amalgam restoration',
    scope: 'surface',
  },
  restoration_gic: {
    key: 'restoration_gic',
    label: 'Glass Ionomer (GIC)',
    shortLabel: 'GIC',
    color: '#0d9488', // teal-600
    borderColor: '#0f766e',
    bgClass: 'bg-teal-600',
    textClass: 'text-white',
    defaultFee: 2200,
    description: 'Fluoride-releasing glass ionomer cement restoration',
    scope: 'surface',
  },
  crown: {
    key: 'crown',
    label: 'Prosthetic Crown / Cap',
    shortLabel: 'CRW',
    color: '#f59e0b', // amber-500
    borderColor: '#d97706',
    bgClass: 'bg-amber-500',
    textClass: 'text-white',
    defaultFee: 9500,
    description: 'Full-coverage zirconia, ceramic, or porcelain fused to metal crown',
    scope: 'whole',
  },
  veneer: {
    key: 'veneer',
    label: 'Ceramic Veneer',
    shortLabel: 'VEN',
    color: '#a855f7', // purple-500
    borderColor: '#9333ea',
    bgClass: 'bg-purple-500',
    textClass: 'text-white',
    defaultFee: 12000,
    description: 'Aesthetic labial ceramic laminate veneer',
    scope: 'surface',
  },
  rct_needed: {
    key: 'rct_needed',
    label: 'RCT Indicated (Pulpitis)',
    shortLabel: 'RCT-?',
    color: '#f97316', // orange-500
    borderColor: '#ea580c',
    bgClass: 'bg-orange-500',
    textClass: 'text-white',
    defaultFee: 6500,
    description: 'Endodontic treatment required due to irreversible pulpitis or necrosis',
    scope: 'whole',
  },
  rct_completed: {
    key: 'rct_completed',
    label: 'RCT Completed & Obturated',
    shortLabel: 'RCT-✓',
    color: '#10b981', // emerald-500
    borderColor: '#059669',
    bgClass: 'bg-emerald-500',
    textClass: 'text-white',
    defaultFee: 0,
    description: 'Hermetically obturated root canal treatment in situ',
    scope: 'whole',
  },
  missing: {
    key: 'missing',
    label: 'Missing / Congenitally Absent',
    shortLabel: 'M',
    color: '#94a3b8', // slate-400
    borderColor: '#64748b',
    bgClass: 'bg-slate-400',
    textClass: 'text-white',
    defaultFee: 0,
    description: 'Tooth is absent or previously extracted',
    scope: 'whole',
  },
  extraction_indicated: {
    key: 'extraction_indicated',
    label: 'Extraction Indicated',
    shortLabel: 'EXT',
    color: '#dc2626', // red-600
    borderColor: '#991b1b',
    bgClass: 'bg-red-600',
    textClass: 'text-white',
    defaultFee: 1800,
    description: 'Grossly decayed / fractured / periodontally hopeless tooth indicated for removal',
    scope: 'whole',
  },
  implant: {
    key: 'implant',
    label: 'Osseointegrated Implant',
    shortLabel: 'IMP',
    color: '#6366f1', // indigo-500
    borderColor: '#4f46e5',
    bgClass: 'bg-indigo-600',
    textClass: 'text-white',
    defaultFee: 35000,
    description: 'Titanium dental implant fixture with abutment',
    scope: 'whole',
  },
  bridge_pontic: {
    key: 'bridge_pontic',
    label: 'Bridge Pontic',
    shortLabel: 'PON',
    color: '#ec4899', // pink-500
    borderColor: '#db2777',
    bgClass: 'bg-pink-500',
    textClass: 'text-white',
    defaultFee: 8500,
    description: 'Artificial tooth suspended between bridge abutments',
    scope: 'whole',
  },
  bridge_abutment: {
    key: 'bridge_abutment',
    label: 'Bridge Abutment',
    shortLabel: 'ABT',
    color: '#8b5cf6', // violet-500
    borderColor: '#7c3aed',
    bgClass: 'bg-violet-500',
    textClass: 'text-white',
    defaultFee: 8500,
    description: 'Prepared natural tooth serving as anchor for fixed dental prosthesis',
    scope: 'whole',
  },
  impacted: {
    key: 'impacted',
    label: 'Impacted Tooth',
    shortLabel: 'IMPCT',
    color: '#78716c', // stone-500
    borderColor: '#57534e',
    bgClass: 'bg-stone-500',
    textClass: 'text-white',
    defaultFee: 4500,
    description: 'Submerged / horizontally impacted tooth requiring surgical disimpaction',
    scope: 'whole',
  },
  calculus: {
    key: 'calculus',
    label: 'Calculus / Plaque Accumulation',
    shortLabel: 'CALC',
    color: '#eab308', // yellow-500
    borderColor: '#ca8a04',
    bgClass: 'bg-yellow-500',
    textClass: 'text-slate-900',
    defaultFee: 1500,
    description: 'Supragingival or subgingival calculus requiring ultrasonic scaling',
    scope: 'surface',
  },
};

// Universal Numbering System mappings (Adult 1 to 32)
// Upper Right (Q1): 18->1, 17->2, 16->3, 15->4, 14->5, 13->6, 12->7, 11->8
// Upper Left (Q2): 21->9, 22->10, 23->11, 24->12, 25->13, 26->14, 27->15, 28->16
// Lower Left (Q3): 38->17, 37->18, 36->19, 35->20, 34->21, 33->22, 32->23, 31->24
// Lower Right (Q4): 41->25, 42->26, 43->27, 44->28, 45->29, 46->30, 47->31, 48->32

// Pediatric Universal Numbering (A to T)
// Upper Right (Q5): 55->A, 54->B, 53->C, 52->D, 51->E
// Upper Left (Q6): 61->F, 62->G, 63->H, 64->I, 65->J
// Lower Left (Q7): 75->K, 74->L, 73->M, 72->N, 71->O
// Lower Right (Q8): 81->P, 82->Q, 83->R, 84->S, 85->T

const TOOTH_NAMES: Record<number, string> = {
  1: 'Central Incisor',
  2: 'Lateral Incisor',
  3: 'Canine',
  4: 'First Premolar',
  5: 'Second Premolar',
  6: 'First Molar',
  7: 'Second Molar',
  8: 'Third Molar (Wisdom)',
};

const PED_NAMES: Record<number, string> = {
  1: 'Central Incisor',
  2: 'Lateral Incisor',
  3: 'Canine',
  4: 'First Molar',
  5: 'Second Molar',
};

export function createDefaultToothRecord(fdiNumber: number, dentition: DentitionType = 'adult'): ToothRecord {
  const q = Math.floor(fdiNumber / 10);
  const toothIndex = fdiNumber % 10;
  const isAdult = dentition === 'adult';

  let universalNumber = '';
  let palmerNotation = '';
  let type: 'incisor' | 'canine' | 'premolar' | 'molar' = 'molar';
  let name = '';
  let arch: 'maxillary' | 'mandibular' = 'maxillary';

  if (isAdult) {
    name = TOOTH_NAMES[toothIndex] || 'Tooth';
    if (toothIndex <= 2) type = 'incisor';
    else if (toothIndex === 3) type = 'canine';
    else if (toothIndex <= 5) type = 'premolar';
    else type = 'molar';

    arch = (q === 1 || q === 2) ? 'maxillary' : 'mandibular';

    // Universal mapping
    if (q === 1) universalNumber = (9 - toothIndex).toString();
    else if (q === 2) universalNumber = (8 + toothIndex).toString();
    else if (q === 3) universalNumber = (25 - toothIndex).toString();
    else if (q === 4) universalNumber = (24 + toothIndex).toString();

    // Palmer notation
    const qSymbols = { 1: `┘${toothIndex}`, 2: `└${toothIndex}`, 3: `┌${toothIndex}`, 4: `┐${toothIndex}` };
    palmerNotation = qSymbols[q as 1 | 2 | 3 | 4] || `${toothIndex}`;
  } else {
    name = `Primary ${PED_NAMES[toothIndex] || 'Tooth'}`;
    if (toothIndex <= 2) type = 'incisor';
    else if (toothIndex === 3) type = 'canine';
    else type = 'molar';

    arch = (q === 5 || q === 6) ? 'maxillary' : 'mandibular';

    const pedUniversalLetters: Record<number, string> = {
      55: 'A', 54: 'B', 53: 'C', 52: 'D', 51: 'E',
      61: 'F', 62: 'G', 63: 'H', 64: 'I', 65: 'J',
      75: 'K', 74: 'L', 73: 'M', 72: 'N', 71: 'O',
      81: 'P', 82: 'Q', 83: 'R', 84: 'S', 85: 'T',
    };
    universalNumber = pedUniversalLetters[fdiNumber] || 'A';
    const pedLetter = String.fromCharCode(64 + toothIndex);
    palmerNotation = `${pedLetter}`;
  }

  return {
    id: fdiNumber,
    fdiNumber,
    universalNumber,
    palmerNotation,
    name,
    type,
    dentition,
    arch,
    quadrant: q as any,
    surfaces: {
      occlusal: 'sound',
      mesial: 'sound',
      distal: 'sound',
      buccal: 'sound',
      lingual: 'sound',
    },
  };
}

export const ADULT_UPPER_TEETH = [
  18, 17, 16, 15, 14, 13, 12, 11, // Q1 (Right to Midline)
  21, 22, 23, 24, 25, 26, 27, 28, // Q2 (Midline to Left)
];

export const ADULT_LOWER_TEETH = [
  48, 47, 46, 45, 44, 43, 42, 41, // Q4 (Right to Midline)
  31, 32, 33, 34, 35, 36, 37, 38, // Q3 (Midline to Left)
];

export const PEDIATRIC_UPPER_TEETH = [
  55, 54, 53, 52, 51,
  61, 62, 63, 64, 65,
];

export const PEDIATRIC_LOWER_TEETH = [
  85, 84, 83, 82, 81,
  71, 72, 73, 74, 75,
];

export function generateDefaultOdontogram(_patientId: string): Record<number, ToothRecord> {
  const teeth: Record<number, ToothRecord> = {};
  
  // Initialize Adult Teeth
  [...ADULT_UPPER_TEETH, ...ADULT_LOWER_TEETH].forEach((fdi) => {
    teeth[fdi] = createDefaultToothRecord(fdi, 'adult');
  });

  // Initialize Pediatric Teeth
  [...PEDIATRIC_UPPER_TEETH, ...PEDIATRIC_LOWER_TEETH].forEach((fdi) => {
    teeth[fdi] = createDefaultToothRecord(fdi, 'pediatric');
  });

  return teeth;
}
