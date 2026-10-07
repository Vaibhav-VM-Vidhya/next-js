import type {
  Branch,
  Doctor,
  Patient,
  Appointment,
  User,
  Prescription,
  DentalDocument,
  Invoice,
  InventoryItem,
  CommunicationLog,
  PatientReview,
  PatientFollowUp,
  PatientOdontogram,
} from '../types';
import { generateDefaultOdontogram } from './toothCatalog';

// -------------------------------------------------------------
// BRANCHES
// -------------------------------------------------------------
export const INITIAL_BRANCHES: Branch[] = [
  {
    id: 'branch-flagship',
    name: 'Classic Smile - Metropolis Flagship',
    city: 'Downtown Metropolis',
    address: 'Suite 400, Platinum Towers, 12th Avenue',
    phone: '+1 (555) 234-8890',
    email: 'metropolis@classicsmile.com',
    openingHours: 'Mon - Sat: 8:00 AM - 8:00 PM | Sun: 9:00 AM - 2:00 PM',
    chairsCount: 8,
  },
  {
    id: 'branch-westside',
    name: 'Classic Smile - Westside Aesthetic Studio',
    city: 'Westside Marina',
    address: 'Bayview Plaza, 4th Floor, Harbour View Road',
    phone: '+1 (555) 987-1234',
    email: 'westside@classicsmile.com',
    openingHours: 'Mon - Fri: 9:00 AM - 7:00 PM | Sat: 9:00 AM - 5:00 PM',
    chairsCount: 5,
  },
  {
    id: 'branch-royaloak',
    name: 'Classic Smile - Royal Oak Family Dental',
    city: 'Royal Oak Gardens',
    address: '77 Heritage Boulevard, Royal Oak Plaza',
    phone: '+1 (555) 456-7890',
    email: 'royaloak@classicsmile.com',
    openingHours: 'Mon - Sat: 9:00 AM - 6:00 PM',
    chairsCount: 4,
  },
];

// -------------------------------------------------------------
// DOCTORS
// -------------------------------------------------------------
export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'doc-sarah',
    name: 'Dr. Sarah Sterling',
    title: 'Chief Prosthodontist & Oral Implantologist',
    specialization: 'Prosthodontics & Implantology',
    qualification: 'BDS, MDS (Prostho), Harvard Dental Implant Fellow',
    experienceYears: 14,
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    branchIds: ['branch-flagship', 'branch-westside'],
    bio: 'Pioneer in computer-guided full-arch implant rehabilitation and digital smile design with over 3,000 successful restorations.',
    consultationFee: 1500,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timeSlots: ['09:00 AM', '10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM', '05:00 PM'],
    rating: 4.98,
    reviewsCount: 312,
  },
  {
    id: 'doc-marcus',
    name: 'Dr. Marcus Vance',
    title: 'Senior Cosmetic Dentist & Orthodontist',
    specialization: 'Orthodontics & Smile Aesthetics',
    qualification: 'BDS, MS (Ortho), Diamond Apex Invisalign Provider',
    experienceYears: 11,
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    branchIds: ['branch-flagship', 'branch-westside'],
    bio: 'Specialist in minimally invasive porcelain veneers, clear aligners, and biomimetic aesthetic transformations.',
    consultationFee: 1200,
    availableDays: ['Monday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    timeSlots: ['09:30 AM', '11:00 AM', '01:30 PM', '03:00 PM', '04:30 PM'],
    rating: 4.95,
    reviewsCount: 248,
  },
  {
    id: 'doc-elena',
    name: 'Dr. Elena Rostova',
    title: 'Microscopic Endodontist',
    specialization: 'Endodontics & Conservative Dentistry',
    qualification: 'BDS, MDS (Endo), Fellow of International College of Dentists',
    experienceYears: 9,
    avatar: 'https://images.unsplash.com/photo-1594824813568-1250f2495b6c?auto=format&fit=crop&q=80&w=400',
    branchIds: ['branch-flagship', 'branch-royaloak'],
    bio: 'Specializes in painless single-sitting root canals under high-magnification surgical operating microscopes.',
    consultationFee: 1000,
    availableDays: ['Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
    timeSlots: ['10:00 AM', '11:30 AM', '02:00 PM', '04:00 PM', '05:30 PM'],
    rating: 4.96,
    reviewsCount: 184,
  },
  {
    id: 'doc-arthur',
    name: 'Dr. Arthur Pendelton',
    title: 'Pediatric Dental Specialist',
    specialization: 'Pediatric & Preventive Dentistry',
    qualification: 'BDS, MDS (Pedo), Certified Conscious Sedationist',
    experienceYears: 12,
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
    branchIds: ['branch-royaloak', 'branch-westside'],
    bio: 'Dedicated to gentle, fear-free dentistry for infants, children, and teenagers with customized behavior management.',
    consultationFee: 900,
    availableDays: ['Monday', 'Tuesday', 'Friday', 'Saturday'],
    timeSlots: ['09:00 AM', '10:30 AM', '12:00 PM', '03:00 PM', '04:30 PM'],
    rating: 4.92,
    reviewsCount: 156,
  },
];

// -------------------------------------------------------------
// SYSTEM USERS (For Demo & Multi-Role Switching)
// -------------------------------------------------------------
export const SYSTEM_USERS: User[] = [
  {
    id: 'user-admin',
    name: 'Vikram Malhotra',
    email: 'director@classicsmile.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    branchId: 'branch-flagship',
    phone: '+1 (555) 100-2001',
  },
  {
    id: 'user-doctor',
    name: 'Dr. Sarah Sterling',
    email: 'sarah.sterling@classicsmile.com',
    role: 'doctor',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200',
    branchId: 'branch-flagship',
    doctorId: 'doc-sarah',
    phone: '+1 (555) 100-2002',
  },
  {
    id: 'user-receptionist',
    name: 'Priya Sharma',
    email: 'frontdesk@classicsmile.com',
    role: 'receptionist',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    branchId: 'branch-flagship',
    phone: '+1 (555) 100-2003',
  },
  {
    id: 'user-patient',
    name: 'James Harrison',
    email: 'james.harrison@gmail.com',
    role: 'patient',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    branchId: 'branch-flagship',
    phone: '+1 (555) 883-9912',
  },
];

// -------------------------------------------------------------
// PATIENTS
// -------------------------------------------------------------
export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat-1',
    mrn: 'CS-2026-0812',
    fullName: 'James Harrison',
    age: 38,
    gender: 'Male',
    phone: '+1 (555) 883-9912',
    email: 'james.harrison@gmail.com',
    bloodGroup: 'O+',
    branchId: 'branch-flagship',
    registeredDate: '2026-01-14',
    allergies: ['Penicillin', 'Sulfa drugs'],
    medicalConditions: ['Mild Hypertension (on Amlodipine)'],
    emergencyContact: {
      name: 'Claire Harrison',
      relationship: 'Spouse',
      phone: '+1 (555) 883-9915',
    },
    totalBilled: 42000,
    totalPaid: 42000,
    lastVisit: '2026-10-02',
    nextFollowUp: '2026-10-16',
  },
  {
    id: 'pat-2',
    mrn: 'CS-2026-0815',
    fullName: 'Sophia Kensington',
    age: 29,
    gender: 'Female',
    phone: '+1 (555) 441-2099',
    email: 'sophia.k@zenithcorp.io',
    bloodGroup: 'A+',
    branchId: 'branch-westside',
    registeredDate: '2026-02-20',
    allergies: ['Latex'],
    medicalConditions: ['None reported'],
    emergencyContact: {
      name: 'David Kensington',
      relationship: 'Brother',
      phone: '+1 (555) 441-2090',
    },
    totalBilled: 85000,
    totalPaid: 65000,
    lastVisit: '2026-10-05',
    nextFollowUp: '2026-10-12',
  },
  {
    id: 'pat-3',
    mrn: 'CS-2026-0820',
    fullName: 'Liam O’Connor',
    age: 52,
    gender: 'Male',
    phone: '+1 (555) 772-3341',
    email: 'liam.oconnor@apexlogistics.com',
    bloodGroup: 'B+',
    branchId: 'branch-flagship',
    registeredDate: '2026-03-05',
    allergies: [],
    medicalConditions: ['Type 2 Diabetes (HbA1c 6.8%)'],
    emergencyContact: {
      name: 'Maeve O’Connor',
      relationship: 'Spouse',
      phone: '+1 (555) 772-3349',
    },
    totalBilled: 120000,
    totalPaid: 100000,
    lastVisit: '2026-09-28',
    nextFollowUp: '2026-10-20',
  },
  {
    id: 'pat-4',
    mrn: 'CS-2026-0834',
    fullName: 'Maya Lin Chen',
    age: 8,
    gender: 'Female',
    phone: '+1 (555) 662-8810',
    email: 'w.chen@chenfamily.org',
    bloodGroup: 'O+',
    branchId: 'branch-royaloak',
    registeredDate: '2026-04-18',
    allergies: ['Peanuts'],
    medicalConditions: ['Asthma (inhaler available)'],
    emergencyContact: {
      name: 'Wei Chen',
      relationship: 'Father',
      phone: '+1 (555) 662-8810',
    },
    totalBilled: 14500,
    totalPaid: 14500,
    lastVisit: '2026-09-15',
    nextFollowUp: '2026-12-15',
  },
  {
    id: 'pat-5',
    mrn: 'CS-2026-0842',
    fullName: 'Ananya Deshmukh',
    age: 34,
    gender: 'Female',
    phone: '+1 (555) 332-9901',
    email: 'ananya.d@fintechinnovate.com',
    bloodGroup: 'AB+',
    branchId: 'branch-flagship',
    registeredDate: '2026-05-10',
    allergies: [],
    medicalConditions: ['None reported'],
    emergencyContact: {
      name: 'Rohan Deshmukh',
      relationship: 'Spouse',
      phone: '+1 (555) 332-9908',
    },
    totalBilled: 26000,
    totalPaid: 26000,
    lastVisit: '2026-10-06',
    nextFollowUp: '2026-10-18',
  },
];

// -------------------------------------------------------------
// TODAY'S APPOINTMENTS & QUEUE
// -------------------------------------------------------------
export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-101',
    patientId: 'pat-1',
    patientName: 'James Harrison',
    patientPhone: '+1 (555) 883-9912',
    doctorId: 'doc-sarah',
    doctorName: 'Dr. Sarah Sterling',
    branchId: 'branch-flagship',
    date: '2026-10-07',
    time: '09:00 AM',
    durationMinutes: 45,
    service: 'Implant Abutment & Crown Placement',
    status: 'in-chair',
    type: 'Procedure',
    chairNumber: 1,
    notes: 'Tooth #46 final zirconia crown torque and cementation. Check bite clearance.',
    estimatedCost: 35000,
    remindersSent: {
      whatsapp: true,
      sms: true,
      email: true,
      lastNotifiedAt: '2026-10-06 18:30',
    },
  },
  {
    id: 'apt-102',
    patientId: 'pat-2',
    patientName: 'Sophia Kensington',
    patientPhone: '+1 (555) 441-2099',
    doctorId: 'doc-marcus',
    doctorName: 'Dr. Marcus Vance',
    branchId: 'branch-westside',
    date: '2026-10-07',
    time: '10:00 AM',
    durationMinutes: 60,
    service: 'Porcelain Veneer Trial & Bonding',
    status: 'checked-in',
    type: 'Procedure',
    chairNumber: 3,
    notes: 'Anterior 6 teeth aesthetic review. Patient requested natural translucency.',
    estimatedCost: 72000,
    remindersSent: {
      whatsapp: true,
      sms: true,
      email: true,
      lastNotifiedAt: '2026-10-06 19:15',
    },
  },
  {
    id: 'apt-103',
    patientId: 'pat-3',
    patientName: 'Liam O’Connor',
    patientPhone: '+1 (555) 772-3341',
    doctorId: 'doc-elena',
    doctorName: 'Dr. Elena Rostova',
    branchId: 'branch-flagship',
    date: '2026-10-07',
    time: '11:30 AM',
    durationMinutes: 60,
    service: 'Microscopic RCT (Obturation Step)',
    status: 'confirmed',
    type: 'Procedure',
    chairNumber: 2,
    notes: 'Tooth #36 single-cone warm vertical condensation. Check working length.',
    estimatedCost: 6500,
    remindersSent: {
      whatsapp: true,
      sms: true,
      email: false,
      lastNotifiedAt: '2026-10-06 20:00',
    },
  },
  {
    id: 'apt-104',
    patientId: 'pat-5',
    patientName: 'Ananya Deshmukh',
    patientPhone: '+1 (555) 332-9901',
    doctorId: 'doc-sarah',
    doctorName: 'Dr. Sarah Sterling',
    branchId: 'branch-flagship',
    date: '2026-10-07',
    time: '02:00 PM',
    durationMinutes: 30,
    service: 'Laser Teeth Whitening & Polish',
    status: 'scheduled',
    type: 'Routine Cleaning',
    chairNumber: 1,
    notes: 'Shade baseline recorded: A3. Target shade: B1.',
    estimatedCost: 12500,
    remindersSent: {
      whatsapp: true,
      sms: false,
      email: true,
      lastNotifiedAt: '2026-10-07 08:00',
    },
  },
  {
    id: 'apt-105',
    patientId: 'pat-4',
    patientName: 'Maya Lin Chen',
    patientPhone: '+1 (555) 662-8810',
    doctorId: 'doc-arthur',
    doctorName: 'Dr. Arthur Pendelton',
    branchId: 'branch-royaloak',
    date: '2026-10-07',
    time: '03:30 PM',
    durationMinutes: 30,
    service: 'Pediatric Pit & Fissure Sealants',
    status: 'scheduled',
    type: 'Procedure',
    chairNumber: 1,
    notes: 'Apply fluoride varnish and sealants on primary molars 55, 65.',
    estimatedCost: 4500,
    remindersSent: {
      whatsapp: true,
      sms: true,
      email: true,
      lastNotifiedAt: '2026-10-06 18:45',
    },
  },
];

// -------------------------------------------------------------
// SAMPLE INITIAL ODONTOGRAM FOR PATIENTS
// -------------------------------------------------------------
export function createSamplePatientOdontogram(patientId: string): PatientOdontogram {
  const teeth = generateDefaultOdontogram(patientId);

  if (patientId === 'pat-1') {
    // James Harrison charted teeth
    // Tooth 16 (Upper Right 1st Molar) has occlusal and mesial composite filling
    teeth[16].surfaces.occlusal = 'restoration_composite';
    teeth[16].surfaces.mesial = 'restoration_composite';
    teeth[16].clinicalNotes = 'Composite restored in 2024. Margins intact.';

    // Tooth 21 (Upper Left Central Incisor) has ceramic veneer
    teeth[21].surfaces.buccal = 'veneer';
    teeth[21].clinicalNotes = 'Aesthetic ceramic laminate veneer.';

    // Tooth 36 (Lower Left 1st Molar) has caries on occlusal surface
    teeth[36].surfaces.occlusal = 'caries';
    teeth[36].plannedProcedure = 'Composite restoration or Onlay';
    teeth[36].estimatedFee = 3200;

    // Tooth 46 (Lower Right 1st Molar) has osseointegrated implant
    teeth[46].wholeToothCondition = 'implant';
    teeth[46].clinicalNotes = 'Titanium 4.5x10mm implant fixture. Final crown placed.';
    teeth[46].plannedProcedure = 'Zirconia screw-retained crown';
    teeth[46].estimatedFee = 35000;

    // Tooth 18 missing (Wisdom tooth extracted)
    teeth[18].wholeToothCondition = 'missing';
    teeth[48].wholeToothCondition = 'missing';

    // Tooth 26 has root canal treatment completed
    teeth[26].wholeToothCondition = 'rct_completed';
    teeth[26].surfaces.occlusal = 'crown';
    teeth[26].clinicalNotes = 'Endodontic obturation intact with PFM crown.';
  } else if (patientId === 'pat-2') {
    // Sophia Kensington (Cosmetic case)
    [13, 12, 11, 21, 22, 23].forEach((fdi) => {
      teeth[fdi].surfaces.buccal = 'veneer';
      teeth[fdi].clinicalNotes = 'Minimally invasive feldspathic porcelain veneer.';
      teeth[fdi].estimatedFee = 12000;
    });
  } else if (patientId === 'pat-3') {
    // Liam O'Connor (Endo case)
    teeth[36].wholeToothCondition = 'rct_needed';
    teeth[36].surfaces.occlusal = 'caries';
    teeth[36].clinicalNotes = 'Severe throbbing pain. Irreversible pulpitis diagnosed.';
    teeth[36].plannedProcedure = 'Microscopic Root Canal + Core Build-up';
    teeth[36].estimatedFee = 6500;
    
    teeth[47].surfaces.occlusal = 'restoration_amalgam';
    teeth[47].clinicalNotes = 'Old amalgam restoration with slight marginal stain.';
  }

  return {
    patientId,
    dentitionType: 'adult',
    numberingSystem: 'fdi',
    teeth,
    lastUpdated: '2026-10-07 10:15',
    chartNotes: 'Comprehensive clinical examination and charting complete.',
  };
}

// -------------------------------------------------------------
// PRESCRIPTIONS
// -------------------------------------------------------------
export const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx-2026-001',
    prescriptionNumber: 'RX-CS-8921',
    patientId: 'pat-1',
    patientName: 'James Harrison',
    patientAge: 38,
    doctorId: 'doc-sarah',
    doctorName: 'Dr. Sarah Sterling',
    doctorQualification: 'BDS, MDS (Prostho), Harvard Dental Fellow',
    date: '2026-10-07',
    diagnosis: 'Post-implant torque verification & soft tissue healing',
    medicines: [
      {
        id: 'm1',
        drugName: 'Augmentin 625mg',
        genericName: 'Amoxicillin + Clavulanic Acid (500mg + 125mg)',
        dosage: '625mg',
        form: 'Tablet',
        frequency: '1-0-1 (Twice daily after food)',
        duration: '5 days',
        specialInstructions: 'Strictly complete the 5-day course to prevent microbial resistance.',
      },
      {
        id: 'm2',
        drugName: 'Zerodol-SP',
        genericName: 'Aceclofenac 100mg + Paracetamol 325mg + Serratiopeptidase 15mg',
        dosage: '1 tab',
        form: 'Tablet',
        frequency: '1-0-1 (Twice daily after food)',
        duration: '3 days',
        specialInstructions: 'Take only if pain or swelling persists.',
      },
      {
        id: 'm3',
        drugName: 'Hexidine 0.2%',
        genericName: 'Chlorhexidine Gluconate 0.2% w/v',
        dosage: '10ml',
        form: 'Mouthwash',
        frequency: '0-1-0-1 (Twice daily)',
        duration: '7 days',
        specialInstructions: 'Rinse gently for 60 seconds after brushing. Do not swallow.',
      },
    ],
    advice: [
      'Maintain soft food diet on the non-operative side for 48 hours.',
      'Avoid drinking through a straw or vigorous spitting.',
      'Warm saline rinses recommended starting tomorrow morning.',
    ],
    followUpDate: '2026-10-14',
  },
  {
    id: 'rx-2026-002',
    prescriptionNumber: 'RX-CS-8922',
    patientId: 'pat-3',
    patientName: 'Liam O’Connor',
    patientAge: 52,
    doctorId: 'doc-elena',
    doctorName: 'Dr. Elena Rostova',
    doctorQualification: 'BDS, MDS (Endo)',
    date: '2026-10-05',
    diagnosis: 'Acute Irreversible Pulpitis - Tooth #36',
    medicines: [
      {
        id: 'm4',
        drugName: 'Ketorol DT 10mg',
        genericName: 'Ketorolac Tromethamine',
        dosage: '10mg',
        form: 'Tablet',
        frequency: 'As needed (SOS, max 3 times daily)',
        duration: '3 days',
        specialInstructions: 'Disperse in 1 tablespoon of water before consuming.',
      },
      {
        id: 'm5',
        drugName: 'Pan-D',
        genericName: 'Pantoprazole 40mg + Domperidone 30mg',
        dosage: '1 cap',
        form: 'Capsule',
        frequency: '1-0-0 (Once daily before breakfast)',
        duration: '3 days',
        specialInstructions: 'Take 30 minutes before first meal.',
      },
    ],
    advice: [
      'Avoid chewing hard foods on left side until final crown restoration is placed.',
      'Slight sensitivity to percussion is normal for 48 hours.',
    ],
    followUpDate: '2026-10-12',
  },
];

// -------------------------------------------------------------
// X-RAYS & CLINICAL DOCUMENTS
// -------------------------------------------------------------
export const INITIAL_DOCUMENTS: DentalDocument[] = [
  {
    id: 'doc-xray-1',
    patientId: 'pat-1',
    title: 'Full Arch Digital Panoramic OPG',
    category: 'X-Ray OPG',
    date: '2026-10-02',
    fileUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1200',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=400',
    toothNumbers: [16, 21, 36, 46],
    notes: 'Panoramic screening showing osseointegration at site #46 and sound bone levels throughout.',
  },
  {
    id: 'doc-xray-2',
    patientId: 'pat-1',
    title: 'IOPA Periapical - Site #46 Implant Fixture',
    category: 'IOPA Periapical',
    date: '2026-10-07',
    fileUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400',
    toothNumbers: [46],
    notes: 'Periapical confirmational radiograph verifying flush seating of custom titanium abutment.',
  },
  {
    id: 'doc-xray-3',
    patientId: 'pat-2',
    title: 'Pre-Op Aesthetic Macro Photography',
    category: 'Intraoral Photo',
    date: '2026-09-20',
    fileUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=1200',
    thumbnailUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=400',
    toothNumbers: [13, 12, 11, 21, 22, 23],
    notes: 'Pre-operative smile line analysis showing mild incisal wear and uneven gingival zeniths.',
  },
];

// -------------------------------------------------------------
// INVOICES & BILLING
// -------------------------------------------------------------
export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-1001',
    invoiceNumber: 'INV-CS-2026-0491',
    patientId: 'pat-1',
    patientName: 'James Harrison',
    patientPhone: '+1 (555) 883-9912',
    branchId: 'branch-flagship',
    doctorId: 'doc-sarah',
    date: '2026-10-07',
    dueDate: '2026-10-07',
    items: [
      {
        id: 'item-1',
        description: 'Titanium Dental Implant (Osseointegrated Stage 2)',
        toothNumber: 46,
        unitPrice: 28000,
        quantity: 1,
        discount: 0,
        total: 28000,
      },
      {
        id: 'item-2',
        description: 'Custom CAD/CAM Zirconia Screw-Retained Crown',
        toothNumber: 46,
        unitPrice: 12000,
        quantity: 1,
        discount: 2000,
        total: 10000,
      },
      {
        id: 'item-3',
        description: 'Digital High-Definition OPG Radiograph',
        unitPrice: 1500,
        quantity: 1,
        discount: 500,
        total: 1000,
      },
    ],
    subtotal: 39000,
    taxRate: 5,
    taxAmount: 1950,
    discountAmount: 2500,
    grandTotal: 40950,
    paidAmount: 40950,
    status: 'paid',
    paymentMethod: 'UPI',
    transactionReference: 'UPI-REF-9928192837',
    notes: 'Paid via instant Razorpay UPI QR at front desk.',
  },
  {
    id: 'inv-1002',
    invoiceNumber: 'INV-CS-2026-0492',
    patientId: 'pat-2',
    patientName: 'Sophia Kensington',
    patientPhone: '+1 (555) 441-2099',
    branchId: 'branch-westside',
    doctorId: 'doc-marcus',
    date: '2026-10-05',
    dueDate: '2026-10-15',
    items: [
      {
        id: 'item-4',
        description: 'E-Max Ultra-Thin Ceramic Veneers (6 Units Anterior)',
        unitPrice: 12000,
        quantity: 6,
        discount: 7000,
        total: 65000,
      },
    ],
    subtotal: 65000,
    taxRate: 5,
    taxAmount: 3250,
    discountAmount: 7000,
    grandTotal: 68250,
    paidAmount: 50000,
    status: 'partially-paid',
    paymentMethod: 'Card',
    transactionReference: 'CARD-AUTH-882194',
    notes: 'Initial 75% advance deposit received. Balance due upon final bonding.',
  },
  {
    id: 'inv-1003',
    invoiceNumber: 'INV-CS-2026-0493',
    patientId: 'pat-3',
    patientName: 'Liam O’Connor',
    patientPhone: '+1 (555) 772-3341',
    branchId: 'branch-flagship',
    doctorId: 'doc-elena',
    date: '2026-10-06',
    dueDate: '2026-10-07',
    items: [
      {
        id: 'item-5',
        description: 'Microscopic Rotary Endodontics (RCT)',
        toothNumber: 36,
        unitPrice: 6500,
        quantity: 1,
        discount: 0,
        total: 6500,
      },
      {
        id: 'item-6',
        description: 'Fiber Post & Core Build-Up',
        toothNumber: 36,
        unitPrice: 2500,
        quantity: 1,
        discount: 0,
        total: 2500,
      },
    ],
    subtotal: 9000,
    taxRate: 5,
    taxAmount: 450,
    discountAmount: 0,
    grandTotal: 9450,
    paidAmount: 0,
    status: 'pending',
    notes: 'Payment scheduled for checkout today.',
  },
];

// -------------------------------------------------------------
// INVENTORY & CLINIC SUPPLIES
// -------------------------------------------------------------
export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-item-1',
    sku: 'REST-COMP-A2',
    name: '3M Filtek Z350 XT Composite Syringe (Shade A2)',
    category: 'Restorative',
    quantity: 18,
    unit: 'pieces',
    minThreshold: 5,
    costPerUnit: 1850,
    supplier: '3M Healthcare Solutions',
    supplierPhone: '+1 (800) 555-3636',
    location: 'Cabinet 2 - Shelf A',
    expiryDate: '2027-11-30',
    batchNumber: '3M-9912A',
    lastRestocked: '2026-09-15',
  },
  {
    id: 'inv-item-2',
    sku: 'REST-COMP-A3',
    name: '3M Filtek Z350 XT Composite Syringe (Shade A3)',
    category: 'Restorative',
    quantity: 4, // Below threshold
    unit: 'pieces',
    minThreshold: 6,
    costPerUnit: 1850,
    supplier: '3M Healthcare Solutions',
    supplierPhone: '+1 (800) 555-3636',
    location: 'Cabinet 2 - Shelf A',
    expiryDate: '2027-10-15',
    batchNumber: '3M-9914A',
    lastRestocked: '2026-08-10',
  },
  {
    id: 'inv-item-3',
    sku: 'SURG-IMP-4010',
    name: 'Straumann Roxolid SLA Implant 4.1mm x 10mm',
    category: 'Surgical & Implants',
    quantity: 12,
    unit: 'pieces',
    minThreshold: 4,
    costPerUnit: 14500,
    supplier: 'Straumann Dental Group',
    supplierPhone: '+1 (800) 555-7872',
    location: 'Surgical Safe - Bay 1',
    expiryDate: '2029-04-30',
    batchNumber: 'STR-8827B',
    lastRestocked: '2026-09-01',
  },
  {
    id: 'inv-item-4',
    sku: 'ENDO-PROT-F2',
    name: 'Dentsply ProTaper Gold Rotary Files (F2 25mm)',
    category: 'Endodontics',
    quantity: 3, // Low stock
    unit: 'packs',
    minThreshold: 5,
    costPerUnit: 2400,
    supplier: 'Dentsply Sirona',
    supplierPhone: '+1 (800) 555-4433',
    location: 'Endo Trolley 1',
    expiryDate: '2028-06-30',
    batchNumber: 'DEN-44120',
    lastRestocked: '2026-07-20',
  },
  {
    id: 'inv-item-5',
    sku: 'PPE-GLOVE-M',
    name: 'Medical Nitrile Examination Gloves (Size Medium)',
    category: 'PPE & Sterilization',
    quantity: 45,
    unit: 'boxes',
    minThreshold: 15,
    costPerUnit: 450,
    supplier: 'Hartmann Medtech',
    supplierPhone: '+1 (800) 555-9012',
    location: 'Central Storage Room B',
    expiryDate: '2028-12-31',
    batchNumber: 'HRT-2026-M',
    lastRestocked: '2026-10-01',
  },
  {
    id: 'inv-item-6',
    sku: 'REST-BOND-SCOTCH',
    name: 'Single Bond Universal Adhesive 5ml',
    category: 'Restorative',
    quantity: 8,
    unit: 'vials',
    minThreshold: 3,
    costPerUnit: 2900,
    supplier: '3M Healthcare Solutions',
    supplierPhone: '+1 (800) 555-3636',
    location: 'Cabinet 2 - Shelf B',
    expiryDate: '2027-08-31',
    batchNumber: '3M-5521C',
    lastRestocked: '2026-09-22',
  },
];

// -------------------------------------------------------------
// COMMUNICATIONS & AUTOMATIONS LOG
// -------------------------------------------------------------
export const INITIAL_COMMUNICATIONS: CommunicationLog[] = [
  {
    id: 'comm-1',
    patientId: 'pat-1',
    patientName: 'James Harrison',
    channel: 'WhatsApp',
    type: 'Appointment Reminder',
    message: 'Hello James, your appointment with Dr. Sarah Sterling at Classic Smile Metropolis is confirmed for today at 09:00 AM. Location: Suite 400 Platinum Towers.',
    status: 'delivered',
    sentAt: '2026-10-06 18:30',
  },
  {
    id: 'comm-2',
    patientId: 'pat-1',
    patientName: 'James Harrison',
    channel: 'SMS',
    type: 'Appointment Reminder',
    message: 'Reminder: Classic Smile appointment today at 09:00 AM with Dr. Sarah Sterling. Reply C to confirm or call 555-234-8890.',
    status: 'delivered',
    sentAt: '2026-10-06 18:30',
  },
  {
    id: 'comm-3',
    patientId: 'pat-2',
    patientName: 'Sophia Kensington',
    channel: 'WhatsApp',
    type: 'Booking Confirmation',
    message: 'Dear Sophia, your Porcelain Veneer trial session is booked for today at 10:00 AM with Dr. Marcus Vance. See you soon!',
    status: 'delivered',
    sentAt: '2026-10-06 19:15',
  },
  {
    id: 'comm-4',
    patientId: 'pat-3',
    patientName: 'Liam O’Connor',
    channel: 'WhatsApp',
    type: 'Post-Op Follow-up',
    message: 'Hi Liam, Dr. Elena Rostova wanted to check how tooth #36 is feeling after the procedure. Please let us know if you experience any unexpected sensitivity.',
    status: 'delivered',
    sentAt: '2026-10-06 20:00',
  },
  {
    id: 'comm-5',
    patientId: 'pat-5',
    patientName: 'Ananya Deshmukh',
    channel: 'Email',
    type: 'Appointment Reminder',
    message: 'Subject: Classic Smile Appointment Confirmation for 02:00 PM Today. Attached are your pre-whitening preparation guidelines.',
    status: 'delivered',
    sentAt: '2026-10-07 08:00',
  },
];

// -------------------------------------------------------------
// PATIENT REVIEWS & TESTIMONIALS
// -------------------------------------------------------------
export const INITIAL_REVIEWS: PatientReview[] = [
  {
    id: 'rev-1',
    patientName: 'Charlotte Reynolds',
    patientInitial: 'CR',
    rating: 5,
    date: '2026-09-28',
    treatment: 'Full Smile Makeover (Porcelain Veneers)',
    doctorName: 'Dr. Marcus Vance',
    comment: 'The level of artistry and precision here is unmatched. Dr. Marcus Vance gave me a natural, dazzling smile that looks completely effortless. The clinic feels more like a 5-star spa than a dental practice!',
    verified: true,
    platform: 'Google Reviews',
    clinicResponse: 'Thank you Charlotte! It was an absolute delight crafting your new smile. Keep radiating that confidence!',
  },
  {
    id: 'rev-2',
    patientName: 'David K. Vance',
    patientInitial: 'DV',
    rating: 5,
    date: '2026-09-20',
    treatment: 'Computer-Guided Dental Implant',
    doctorName: 'Dr. Sarah Sterling',
    comment: 'I was genuinely terrified of getting an implant after a bad experience elsewhere. Dr. Sarah Sterling explained every single step using 3D scans and the procedure was completely painless. 10/10 recommendation.',
    verified: true,
    platform: 'Google Reviews',
    clinicResponse: 'We are so proud to hear this David. Patient comfort and surgical accuracy are our highest priorities.',
  },
  {
    id: 'rev-3',
    patientName: 'Meera Patel',
    patientInitial: 'MP',
    rating: 5,
    date: '2026-09-12',
    treatment: 'Microscope Root Canal Treatment',
    doctorName: 'Dr. Elena Rostova',
    comment: 'Single sitting root canal without feeling a pinprick. The operating microscope and painless digital anesthesia made this an absolute breeze. Truly modern dentistry.',
    verified: true,
    platform: 'Practo',
  },
  {
    id: 'rev-4',
    patientName: 'Robert Langdon',
    patientInitial: 'RL',
    rating: 5,
    date: '2026-08-30',
    treatment: 'Laser Teeth Whitening',
    doctorName: 'Dr. Sarah Sterling',
    comment: 'Noticeable 4 shades whiter in under 45 minutes with zero sensitivity. Front desk staff were exceptionally courteous and professional.',
    verified: true,
    platform: 'Google Reviews',
  },
];

// -------------------------------------------------------------
// PATIENT FOLLOW-UPS & RECALL
// -------------------------------------------------------------
export const INITIAL_FOLLOW_UPS: PatientFollowUp[] = [
  {
    id: 'fol-1',
    patientId: 'pat-1',
    patientName: 'James Harrison',
    patientPhone: '+1 (555) 883-9912',
    treatmentDone: 'Implant Crown Torque & Delivery',
    treatmentDate: '2026-10-07',
    dueDate: '2026-10-09',
    status: 'Pending Call',
    assignedStaff: 'Priya Sharma (Front Desk)',
    notes: 'Check occlusion comfort and mastication on right side.',
  },
  {
    id: 'fol-2',
    patientId: 'pat-3',
    patientName: 'Liam O’Connor',
    patientPhone: '+1 (555) 772-3341',
    treatmentDone: 'Microscope RCT Tooth #36',
    treatmentDate: '2026-10-05',
    dueDate: '2026-10-07',
    status: 'Contacted - Recovering Well',
    assignedStaff: 'Priya Sharma (Front Desk)',
    notes: 'Patient reports mild soreness completely managed by Ketorolac. Next step: core build-up.',
  },
  {
    id: 'fol-3',
    patientId: 'pat-4',
    patientName: 'Maya Lin Chen',
    patientPhone: '+1 (555) 662-8810',
    treatmentDone: 'Fluoride Varnish & Sealants',
    treatmentDate: '2026-09-15',
    dueDate: '2026-12-15',
    status: 'Recall Scheduled',
    assignedStaff: 'Dr. Arthur Pendelton',
    notes: '3-month pediatric hygiene and caries risk recall.',
  },
];
