import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  User,
  UserRole,
  Branch,
  Doctor,
  Patient,
  Appointment,
  AppointmentStatus,
  PatientOdontogram,
  ConditionCategory,
  ToothSurfaceKey,
  DentitionType,
  NumberingSystem,
  Prescription,
  DentalDocument,
  Invoice,
  InventoryItem,
  CommunicationLog,
  PatientReview,
  PatientFollowUp,
} from '../types';
import {
  INITIAL_BRANCHES,
  INITIAL_DOCTORS,
  SYSTEM_USERS,
  INITIAL_PATIENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_DOCUMENTS,
  INITIAL_INVOICES,
  INITIAL_INVENTORY,
  INITIAL_COMMUNICATIONS,
  INITIAL_REVIEWS,
  INITIAL_FOLLOW_UPS,
  createSamplePatientOdontogram,
} from '../data/mockData';

export type AppView =
  | 'public-home'
  | 'public-booking'
  | 'odontogram'
  | 'appointments'
  | 'prescriptions'
  | 'reception-desk'
  | 'doctor-chair'
  | 'xrays'
  | 'billing'
  | 'communications'
  | 'inventory'
  | 'analytics'
  | 'reviews';

interface AppContextType {
  // Navigation & Session
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  currentUser: User;
  switchUserRole: (role: UserRole) => void;
  currentBranchId: string;
  setCurrentBranchId: (branchId: string) => void;
  currentBranch: Branch;

  // Selected Patient Context
  selectedPatientId: string;
  setSelectedPatientId: (id: string) => void;
  selectedPatient?: Patient;

  // Data Collections
  branches: Branch[];
  doctors: Doctor[];
  patients: Patient[];
  appointments: Appointment[];
  prescriptions: Prescription[];
  documents: DentalDocument[];
  invoices: Invoice[];
  inventory: InventoryItem[];
  communications: CommunicationLog[];
  reviews: PatientReview[];
  followUps: PatientFollowUp[];

  // Odontogram Data & Actions
  getPatientOdontogram: (patientId: string) => PatientOdontogram;
  updateToothSurface: (
    patientId: string,
    toothId: number,
    surface: ToothSurfaceKey,
    condition: ConditionCategory
  ) => void;
  updateWholeToothCondition: (
    patientId: string,
    toothId: number,
    condition: ConditionCategory | undefined
  ) => void;
  updateToothDetails: (
    patientId: string,
    toothId: number,
    data: { notes?: string; plannedProcedure?: string; estimatedFee?: number }
  ) => void;
  setOdontogramDentition: (patientId: string, type: DentitionType) => void;
  setOdontogramNumbering: (patientId: string, system: NumberingSystem) => void;
  resetPatientOdontogram: (patientId: string) => void;

  // Appointment Actions
  createAppointment: (appointment: Omit<Appointment, 'id' | 'remindersSent'>) => Appointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  sendReminder: (appointmentId: string, channel: 'WhatsApp' | 'SMS' | 'Email') => void;

  // Clinical & Billing Actions
  createPatient: (patient: Omit<Patient, 'id' | 'mrn' | 'registeredDate' | 'totalBilled' | 'totalPaid'>) => Patient;
  createPrescription: (prescription: Omit<Prescription, 'id' | 'prescriptionNumber' | 'date'>) => Prescription;
  addDocument: (document: Omit<DentalDocument, 'id' | 'date'>) => DentalDocument;
  createInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'date'>) => Invoice;
  recordPayment: (
    invoiceId: string,
    amount: number,
    method: 'UPI' | 'Card' | 'Cash' | 'NetBanking' | 'Insurance',
    ref?: string
  ) => void;

  // Inventory & Follow-ups
  adjustInventoryStock: (itemId: string, delta: number) => void;
  updateFollowUpStatus: (id: string, status: PatientFollowUp['status'], notes?: string) => void;
  addReview: (review: Omit<PatientReview, 'id' | 'date' | 'verified'>) => void;

  // Reset demo
  resetToInitialData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'classic_smile_v1_';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Error loading ${key} from storage:`, e);
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error saving ${key} to storage:`, e);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Session State
  const [activeView, setActiveView] = useState<AppView>('public-home');
  const [currentUser, setCurrentUser] = useState<User>(SYSTEM_USERS[0]); // Default: Admin
  const [currentBranchId, setCurrentBranchId] = useState<string>('branch-flagship');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('pat-1');

  // Core Data Collections
  const [branches] = useState<Branch[]>(INITIAL_BRANCHES);
  const [doctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [patients, setPatients] = useState<Patient[]>(() =>
    loadFromStorage('patients', INITIAL_PATIENTS)
  );
  const [appointments, setAppointments] = useState<Appointment[]>(() =>
    loadFromStorage('appointments', INITIAL_APPOINTMENTS)
  );
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() =>
    loadFromStorage('prescriptions', INITIAL_PRESCRIPTIONS)
  );
  const [documents, setDocuments] = useState<DentalDocument[]>(() =>
    loadFromStorage('documents', INITIAL_DOCUMENTS)
  );
  const [invoices, setInvoices] = useState<Invoice[]>(() =>
    loadFromStorage('invoices', INITIAL_INVOICES)
  );
  const [inventory, setInventory] = useState<InventoryItem[]>(() =>
    loadFromStorage('inventory', INITIAL_INVENTORY)
  );
  const [communications, setCommunications] = useState<CommunicationLog[]>(() =>
    loadFromStorage('communications', INITIAL_COMMUNICATIONS)
  );
  const [reviews, setReviews] = useState<PatientReview[]>(() =>
    loadFromStorage('reviews', INITIAL_REVIEWS)
  );
  const [followUps, setFollowUps] = useState<PatientFollowUp[]>(() =>
    loadFromStorage('followUps', INITIAL_FOLLOW_UPS)
  );

  // Odontograms dictionary: patientId -> PatientOdontogram
  const [odontograms, setOdontograms] = useState<Record<string, PatientOdontogram>>(() => {
    const saved = loadFromStorage<Record<string, PatientOdontogram>>('odontograms', {});
    return saved;
  });

  // Sync state to local storage
  useEffect(() => saveToStorage('patients', patients), [patients]);
  useEffect(() => saveToStorage('appointments', appointments), [appointments]);
  useEffect(() => saveToStorage('prescriptions', prescriptions), [prescriptions]);
  useEffect(() => saveToStorage('documents', documents), [documents]);
  useEffect(() => saveToStorage('invoices', invoices), [invoices]);
  useEffect(() => saveToStorage('inventory', inventory), [inventory]);
  useEffect(() => saveToStorage('communications', communications), [communications]);
  useEffect(() => saveToStorage('reviews', reviews), [reviews]);
  useEffect(() => saveToStorage('followUps', followUps), [followUps]);
  useEffect(() => saveToStorage('odontograms', odontograms), [odontograms]);

  // Derived current branch
  const currentBranch = branches.find((b) => b.id === currentBranchId) || branches[0];
  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  // Switch role handler
  const switchUserRole = (role: UserRole) => {
    const targetUser = SYSTEM_USERS.find((u) => u.role === role) || SYSTEM_USERS[0];
    setCurrentUser(targetUser);

    // Auto navigate to relevant workspace view
    if (role === 'doctor') {
      setActiveView('doctor-chair');
    } else if (role === 'receptionist') {
      setActiveView('reception-desk');
    } else if (role === 'admin') {
      setActiveView('analytics');
    } else if (role === 'patient') {
      setActiveView('public-home');
    }
  };

  // -------------------------------------------------------------
  // ODONTOGRAM METHODS
  // -------------------------------------------------------------
  const getPatientOdontogram = (patientId: string): PatientOdontogram => {
    if (odontograms[patientId]) {
      return odontograms[patientId];
    }
    // Generate sample or fresh default
    const newChart = createSamplePatientOdontogram(patientId);
    setOdontograms((prev) => ({ ...prev, [patientId]: newChart }));
    return newChart;
  };

  const updateToothSurface = (
    patientId: string,
    toothId: number,
    surface: ToothSurfaceKey,
    condition: ConditionCategory
  ) => {
    setOdontograms((prev) => {
      const current = prev[patientId] || createSamplePatientOdontogram(patientId);
      const tooth = current.teeth[toothId];
      if (!tooth) return prev;

      const updatedTooth = {
        ...tooth,
        surfaces: {
          ...tooth.surfaces,
          [surface]: condition,
        },
        updatedAt: new Date().toISOString(),
      };

      return {
        ...prev,
        [patientId]: {
          ...current,
          teeth: {
            ...current.teeth,
            [toothId]: updatedTooth,
          },
          lastUpdated: new Date().toLocaleString(),
        },
      };
    });
  };

  const updateWholeToothCondition = (
    patientId: string,
    toothId: number,
    condition: ConditionCategory | undefined
  ) => {
    setOdontograms((prev) => {
      const current = prev[patientId] || createSamplePatientOdontogram(patientId);
      const tooth = current.teeth[toothId];
      if (!tooth) return prev;

      const updatedTooth = {
        ...tooth,
        wholeToothCondition: condition,
        updatedAt: new Date().toISOString(),
      };

      return {
        ...prev,
        [patientId]: {
          ...current,
          teeth: {
            ...current.teeth,
            [toothId]: updatedTooth,
          },
          lastUpdated: new Date().toLocaleString(),
        },
      };
    });
  };

  const updateToothDetails = (
    patientId: string,
    toothId: number,
    data: { notes?: string; plannedProcedure?: string; estimatedFee?: number }
  ) => {
    setOdontograms((prev) => {
      const current = prev[patientId] || createSamplePatientOdontogram(patientId);
      const tooth = current.teeth[toothId];
      if (!tooth) return prev;

      const updatedTooth = {
        ...tooth,
        clinicalNotes: data.notes !== undefined ? data.notes : tooth.clinicalNotes,
        plannedProcedure: data.plannedProcedure !== undefined ? data.plannedProcedure : tooth.plannedProcedure,
        estimatedFee: data.estimatedFee !== undefined ? data.estimatedFee : tooth.estimatedFee,
        updatedAt: new Date().toISOString(),
      };

      return {
        ...prev,
        [patientId]: {
          ...current,
          teeth: {
            ...current.teeth,
            [toothId]: updatedTooth,
          },
          lastUpdated: new Date().toLocaleString(),
        },
      };
    });
  };

  const setOdontogramDentition = (patientId: string, type: DentitionType) => {
    setOdontograms((prev) => {
      const current = prev[patientId] || createSamplePatientOdontogram(patientId);
      return {
        ...prev,
        [patientId]: { ...current, dentitionType: type },
      };
    });
  };

  const setOdontogramNumbering = (patientId: string, system: NumberingSystem) => {
    setOdontograms((prev) => {
      const current = prev[patientId] || createSamplePatientOdontogram(patientId);
      return {
        ...prev,
        [patientId]: { ...current, numberingSystem: system },
      };
    });
  };

  const resetPatientOdontogram = (patientId: string) => {
    const fresh = createSamplePatientOdontogram(patientId);
    setOdontograms((prev) => ({ ...prev, [patientId]: fresh }));
  };

  // -------------------------------------------------------------
  // APPOINTMENTS & AUTOMATION METHODS
  // -------------------------------------------------------------
  const createAppointment = (data: Omit<Appointment, 'id' | 'remindersSent'>): Appointment => {
    const newApt: Appointment = {
      ...data,
      id: `apt-${Date.now().toString().slice(-6)}`,
      remindersSent: {
        whatsapp: true,
        sms: true,
        email: true,
        lastNotifiedAt: new Date().toLocaleString(),
      },
    };

    setAppointments((prev) => [newApt, ...prev]);

    // Automatically log instant WhatsApp & SMS confirmations
    const newCommWa: CommunicationLog = {
      id: `comm-${Date.now()}-wa`,
      patientId: newApt.patientId,
      patientName: newApt.patientName,
      channel: 'WhatsApp',
      type: 'Booking Confirmation',
      message: `Dear ${newApt.patientName}, your appointment with ${newApt.doctorName} for ${newApt.service} is confirmed on ${newApt.date} at ${newApt.time}. Classic Smile.`,
      status: 'delivered',
      sentAt: new Date().toLocaleString(),
    };
    const newCommSms: CommunicationLog = {
      id: `comm-${Date.now()}-sms`,
      patientId: newApt.patientId,
      patientName: newApt.patientName,
      channel: 'SMS',
      type: 'Booking Confirmation',
      message: `Classic Smile: Appointment confirmed on ${newApt.date} ${newApt.time} with ${newApt.doctorName}. See you soon!`,
      status: 'delivered',
      sentAt: new Date().toLocaleString(),
    };
    setCommunications((prev) => [newCommWa, newCommSms, ...prev]);

    return newApt;
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status } : apt))
    );
  };

  const sendReminder = (appointmentId: string, channel: 'WhatsApp' | 'SMS' | 'Email') => {
    const apt = appointments.find((a) => a.id === appointmentId);
    if (!apt) return;

    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id === appointmentId) {
          return {
            ...a,
            remindersSent: {
              ...a.remindersSent,
              [channel.toLowerCase()]: true,
              lastNotifiedAt: new Date().toLocaleString(),
            },
          };
        }
        return a;
      })
    );

    const log: CommunicationLog = {
      id: `comm-${Date.now()}`,
      patientId: apt.patientId,
      patientName: apt.patientName,
      channel,
      type: 'Appointment Reminder',
      message: `Reminder for ${apt.patientName}: Dental appointment today at ${apt.time} with ${apt.doctorName}. We look forward to seeing you!`,
      status: 'delivered',
      sentAt: new Date().toLocaleString(),
    };

    setCommunications((prev) => [log, ...prev]);
  };

  // -------------------------------------------------------------
  // PATIENT & CLINICAL METHODS
  // -------------------------------------------------------------
  const createPatient = (
    data: Omit<Patient, 'id' | 'mrn' | 'registeredDate' | 'totalBilled' | 'totalPaid'>
  ): Patient => {
    const randomMrn = `CS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPat: Patient = {
      ...data,
      id: `pat-${Date.now().toString().slice(-5)}`,
      mrn: randomMrn,
      registeredDate: new Date().toISOString().split('T')[0],
      totalBilled: 0,
      totalPaid: 0,
    };
    setPatients((prev) => [newPat, ...prev]);
    setSelectedPatientId(newPat.id);
    return newPat;
  };

  const createPrescription = (
    data: Omit<Prescription, 'id' | 'prescriptionNumber' | 'date'>
  ): Prescription => {
    const newRx: Prescription = {
      ...data,
      id: `rx-${Date.now().toString().slice(-6)}`,
      prescriptionNumber: `RX-CS-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
    };
    setPrescriptions((prev) => [newRx, ...prev]);
    return newRx;
  };

  const addDocument = (data: Omit<DentalDocument, 'id' | 'date'>): DentalDocument => {
    const newDoc: DentalDocument = {
      ...data,
      id: `doc-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().split('T')[0],
    };
    setDocuments((prev) => [newDoc, ...prev]);
    return newDoc;
  };

  // -------------------------------------------------------------
  // BILLING & FINANCIALS
  // -------------------------------------------------------------
  const createInvoice = (data: Omit<Invoice, 'id' | 'invoiceNumber' | 'date'>): Invoice => {
    const newInv: Invoice = {
      ...data,
      id: `inv-${Date.now().toString().slice(-6)}`,
      invoiceNumber: `INV-CS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
    };

    setInvoices((prev) => [newInv, ...prev]);

    // Update patient total billed
    setPatients((prev) =>
      prev.map((p) =>
        p.id === newInv.patientId
          ? {
              ...p,
              totalBilled: p.totalBilled + newInv.grandTotal,
              totalPaid: p.totalPaid + newInv.paidAmount,
            }
          : p
      )
    );

    return newInv;
  };

  const recordPayment = (
    invoiceId: string,
    amount: number,
    method: 'UPI' | 'Card' | 'Cash' | 'NetBanking' | 'Insurance',
    ref?: string
  ) => {
    let patientId = '';
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === invoiceId) {
          patientId = inv.patientId;
          const newPaid = inv.paidAmount + amount;
          const status = newPaid >= inv.grandTotal ? 'paid' : 'partially-paid';
          return {
            ...inv,
            paidAmount: newPaid,
            status,
            paymentMethod: method,
            transactionReference: ref || `TXN-${Date.now().toString().slice(-8)}`,
          };
        }
        return inv;
      })
    );

    if (patientId) {
      setPatients((prev) =>
        prev.map((p) =>
          p.id === patientId ? { ...p, totalPaid: p.totalPaid + amount } : p
        )
      );
    }
  };

  // -------------------------------------------------------------
  // INVENTORY & OTHERS
  // -------------------------------------------------------------
  const adjustInventoryStock = (itemId: string, delta: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: Math.max(0, item.quantity + delta),
              lastRestocked: delta > 0 ? new Date().toISOString().split('T')[0] : item.lastRestocked,
            }
          : item
      )
    );
  };

  const updateFollowUpStatus = (
    id: string,
    status: PatientFollowUp['status'],
    notes?: string
  ) => {
    setFollowUps((prev) =>
      prev.map((fol) =>
        fol.id === id
          ? {
              ...fol,
              status,
              notes: notes ? `${fol.notes} | ${notes}` : fol.notes,
            }
          : fol
      )
    );
  };

  const addReview = (reviewData: Omit<PatientReview, 'id' | 'date' | 'verified'>) => {
    const newRev: PatientReview = {
      ...reviewData,
      id: `rev-${Date.now().toString().slice(-5)}`,
      date: new Date().toISOString().split('T')[0],
      verified: true,
    };
    setReviews((prev) => [newRev, ...prev]);
  };

  const resetToInitialData = () => {
    localStorage.clear();
    setPatients(INITIAL_PATIENTS);
    setAppointments(INITIAL_APPOINTMENTS);
    setPrescriptions(INITIAL_PRESCRIPTIONS);
    setDocuments(INITIAL_DOCUMENTS);
    setInvoices(INITIAL_INVOICES);
    setInventory(INITIAL_INVENTORY);
    setCommunications(INITIAL_COMMUNICATIONS);
    setReviews(INITIAL_REVIEWS);
    setFollowUps(INITIAL_FOLLOW_UPS);
    setOdontograms({});
    setCurrentUser(SYSTEM_USERS[0]);
    setActiveView('public-home');
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        currentUser,
        switchUserRole,
        currentBranchId,
        setCurrentBranchId,
        currentBranch,
        selectedPatientId,
        setSelectedPatientId,
        selectedPatient,
        branches,
        doctors,
        patients,
        appointments,
        prescriptions,
        documents,
        invoices,
        inventory,
        communications,
        reviews,
        followUps,
        getPatientOdontogram,
        updateToothSurface,
        updateWholeToothCondition,
        updateToothDetails,
        setOdontogramDentition,
        setOdontogramNumbering,
        resetPatientOdontogram,
        createAppointment,
        updateAppointmentStatus,
        sendReminder,
        createPatient,
        createPrescription,
        addDocument,
        createInvoice,
        recordPayment,
        adjustInventoryStock,
        updateFollowUpStatus,
        addReview,
        resetToInitialData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
