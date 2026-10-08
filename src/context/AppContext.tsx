'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ClinicInfo,
  Doctor,
  StaffUser,
  Appointment,
  AppointmentStatus,
  Prescription,
  PrescriptionMedicine,
  PatientReview,
} from '../types';
import {
  CLINIC_INFO,
  INITIAL_STAFF_USERS,
  INITIAL_DOCTORS,
  INITIAL_APPOINTMENTS,
  INITIAL_REVIEWS,
  DEFAULT_DRUG_PRESETS,
} from '../data/mockData';
import { getLocalDateString } from '../utils/dateUtils';

export type AppView = 'public-home' | 'public-booking' | 'reception-desk' | 'doctor-chair' | 'doctor-info';

interface AppContextType {
  // Navigation & Public Clinic Data
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  clinicInfo: ClinicInfo;

  // Staff Authentication
  currentStaffUser: StaffUser | null;
  login: (username: string, password: string) => { success: boolean; requireNewPassword?: boolean; error?: string };
  completeFirstTimePassword: (username: string, newPassword: string) => void;
  logout: () => void;

  // Doctor Management (Admin can add/toggle doctors)
  doctors: Doctor[];
  addDoctor: (data: Omit<Doctor, 'id' | 'rating' | 'reviewsCount' | 'isActive'>) => Doctor;
  toggleDoctorStatus: (doctorId: string, isActive: boolean) => void;

  // Appointments Management
  appointments: Appointment[];
  createAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => Appointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  rescheduleAppointment: (id: string, newDate: string, newTime: string) => void;

  // Prescriptions Management
  prescriptions: Prescription[];
  createPrescription: (prescription: Omit<Prescription, 'id' | 'prescriptionNumber' | 'date'>) => Prescription;

  // Quick Drug Presets (Pharmacopoeia)
  quickDrugPresets: PrescriptionMedicine[];
  addQuickDrugPreset: (preset: Omit<PrescriptionMedicine, 'id'>) => void;
  removeQuickDrugPreset: (id: string) => void;

  // Reviews Management
  reviews: PatientReview[];
  addReview: (review: Omit<PatientReview, 'id' | 'date'>) => void;

  // Quick modals
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (open: boolean) => void;
  isReviewModalOpen: boolean;
  setIsReviewModalOpen: (open: boolean) => void;
  isDoctorInfoOpen: boolean;
  setIsDoctorInfoOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'classicsmile_v2_';

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error saving ${key} to storage:`, e);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clinicInfo] = useState<ClinicInfo>(CLINIC_INFO);
  const [activeView, setActiveView] = useState<AppView>('public-home');

  // Modals
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isDoctorInfoOpen, setIsDoctorInfoOpen] = useState(false);

  // Hydration state tracking
  const [isInitialized, setIsInitialized] = useState(false);

  // Initial state matches server-rendered defaults to ensure perfect hydration
  const [quickDrugPresets, setQuickDrugPresets] = useState<PrescriptionMedicine[]>(DEFAULT_DRUG_PRESETS);
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>(INITIAL_STAFF_USERS);
  const [currentStaffUser, setCurrentStaffUser] = useState<StaffUser | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [reviews, setReviews] = useState<PatientReview[]>(INITIAL_REVIEWS);

  // Load persisted state from localStorage ONCE after mount (client-side only, post-hydration)
  useEffect(() => {
    try {
      const savedStaff = loadFromStorage<StaffUser[] | null>('staff_users', null);
      if (savedStaff) {
        const migratedStaff = savedStaff.map((staff) =>
          staff.id === 'user-doc-1' && staff.avatar.includes('images.unsplash.com')
            ? { ...staff, avatar: '/doc_img.jpeg' }
            : staff
        );
        setStaffUsers(migratedStaff);
      }

      const savedSession = loadFromStorage<StaffUser | null>('current_session', null);
      if (savedSession) setCurrentStaffUser(savedSession);

      const savedDoctors = loadFromStorage<Doctor[] | null>('doctors', null);
      if (savedDoctors) {
        const migratedDoctors = savedDoctors.map((doc) =>
          doc.id === 'doc-abhishek' && doc.avatar.includes('images.unsplash.com')
            ? { ...doc, avatar: '/doc_img.jpeg' }
            : doc
        );
        setDoctors(migratedDoctors);
      }

      const savedAppointments = loadFromStorage<Appointment[] | null>('appointments', null);
      if (savedAppointments) setAppointments(savedAppointments);

      const savedPrescriptions = loadFromStorage<Prescription[] | null>('prescriptions', null);
      if (savedPrescriptions) setPrescriptions(savedPrescriptions);

      const savedPresets = loadFromStorage<PrescriptionMedicine[] | null>('quick_drug_presets', null);
      if (savedPresets) setQuickDrugPresets(savedPresets);

      const savedReviews = loadFromStorage<PatientReview[] | null>('reviews', null);
      if (savedReviews) setReviews(savedReviews);
    } catch (e) {
      console.warn('Error loading persisted clinic data:', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to storage ONLY AFTER initialization is complete to protect existing persisted data
  useEffect(() => {
    if (!isInitialized) return;
    saveToStorage('staff_users', staffUsers);
  }, [staffUsers, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    saveToStorage('current_session', currentStaffUser);
  }, [currentStaffUser, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    saveToStorage('doctors', doctors);
  }, [doctors, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    saveToStorage('appointments', appointments);
  }, [appointments, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    saveToStorage('prescriptions', prescriptions);
  }, [prescriptions, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    saveToStorage('quick_drug_presets', quickDrugPresets);
  }, [quickDrugPresets, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    saveToStorage('reviews', reviews);
  }, [reviews, isInitialized]);

  // Auth Methods
  const login = (username: string, password: string): { success: boolean; requireNewPassword?: boolean; error?: string } => {
    const user = staffUsers.find((u) => u.username.toLowerCase() === username.trim().toLowerCase());
    if (!user) {
      return { success: false, error: 'Invalid username. Please check your credentials.' };
    }

    if (!user.isActive) {
      return { success: false, error: 'This staff account has been deactivated by the clinic administrator.' };
    }

    if (user.password !== password) {
      return { success: false, error: 'Incorrect password.' };
    }

    // Check if user is still using the initial default password "admin1234"
    if (user.isDefaultPassword || password === 'admin1234') {
      return { success: true, requireNewPassword: true };
    }

    // Normal successful login
    setCurrentStaffUser(user);
    setIsLoginModalOpen(false);

    if (user.role === 'doctor') {
      setActiveView('doctor-chair');
    } else {
      setActiveView('reception-desk');
    }

    return { success: true };
  };

  const completeFirstTimePassword = (username: string, newPassword: string) => {
    setStaffUsers((prev) =>
      prev.map((u) => {
        if (u.username.toLowerCase() === username.trim().toLowerCase()) {
          const updated = {
            ...u,
            password: newPassword,
            isDefaultPassword: false,
          };
          setCurrentStaffUser(updated);
          return updated;
        }
        return u;
      })
    );

    const loggedUser = staffUsers.find((u) => u.username.toLowerCase() === username.trim().toLowerCase());
    if (loggedUser) {
      if (loggedUser.role === 'doctor') {
        setActiveView('doctor-chair');
      } else {
        setActiveView('reception-desk');
      }
    }
    setIsLoginModalOpen(false);
  };

  const logout = () => {
    setCurrentStaffUser(null);
    setActiveView('public-home');
  };

  // Doctor Management (Admin)
  const addDoctor = (data: Omit<Doctor, 'id' | 'rating' | 'reviewsCount' | 'isActive'>): Doctor => {
    const docId = `doc-${Date.now().toString().slice(-4)}`;
    const newDoc: Doctor = {
      ...data,
      id: docId,
      rating: 5.0,
      reviewsCount: 1,
      isActive: true,
      username: data.name.toLowerCase().replace(/[^a-z]/g, ''),
    };

    setDoctors((prev) => [...prev, newDoc]);

    // Also create a staff user login for this doctor with default password admin1234
    const newStaff: StaffUser = {
      id: `user-${docId}`,
      username: newDoc.username || docId,
      name: newDoc.name,
      role: 'doctor',
      password: 'admin1234',
      isDefaultPassword: true,
      isActive: true,
      avatar: newDoc.avatar,
      doctorId: docId,
    };
    setStaffUsers((prev) => [...prev, newStaff]);

    return newDoc;
  };

  const toggleDoctorStatus = (doctorId: string, isActive: boolean) => {
    setDoctors((prev) =>
      prev.map((d) => (d.id === doctorId ? { ...d, isActive } : d))
    );

    // Also update staff user login active state
    setStaffUsers((prev) =>
      prev.map((u) => (u.doctorId === doctorId ? { ...u, isActive } : u))
    );
  };

  // Appointment Methods
  const createAppointment = (data: Omit<Appointment, 'id' | 'createdAt'>): Appointment => {
    const newApt: Appointment = {
      ...data,
      id: `apt-${Date.now().toString().slice(-5)}`,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setAppointments((prev) => [newApt, ...prev]);
    return newApt;
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  const rescheduleAppointment = (id: string, newDate: string, newTime: string) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              date: newDate,
              time: newTime,
              status: 'scheduled',
              notes: a.notes ? `${a.notes} (Rescheduled to ${newDate} ${newTime})` : `Rescheduled to ${newDate} ${newTime}`,
            }
          : a
      )
    );
  };

  // Prescription Methods
  const createPrescription = (
    data: Omit<Prescription, 'id' | 'prescriptionNumber' | 'date'>
  ): Prescription => {
    const newRx: Prescription = {
      ...data,
      id: `rx-${Date.now().toString().slice(-5)}`,
      prescriptionNumber: `RX-CS-${Math.floor(1000 + Math.random() * 9000)}`,
      date: getLocalDateString(),
    };
    setPrescriptions((prev) => [newRx, ...prev]);
    return newRx;
  };

  // Quick Drug Preset Methods (Pharmacopoeia Management)
  const addQuickDrugPreset = (preset: Omit<PrescriptionMedicine, 'id'>) => {
    const newPreset: PrescriptionMedicine = {
      ...preset,
      id: `preset-${Date.now()}`,
    };
    setQuickDrugPresets((prev) => [...prev, newPreset]);
  };

  const removeQuickDrugPreset = (id: string) => {
    setQuickDrugPresets((prev) => prev.filter((p) => p.id !== id));
  };

  // Review Methods
  const addReview = (data: Omit<PatientReview, 'id' | 'date'>) => {
    const newRev: PatientReview = {
      ...data,
      id: `rev-${Date.now().toString().slice(-5)}`,
      date: new Date().toISOString().split('T')[0],
    };
    setReviews((prev) => [newRev, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        clinicInfo,
        currentStaffUser,
        login,
        completeFirstTimePassword,
        logout,
        doctors,
        addDoctor,
        toggleDoctorStatus,
        appointments,
        createAppointment,
        updateAppointmentStatus,
        rescheduleAppointment,
        prescriptions,
        createPrescription,
        quickDrugPresets,
        addQuickDrugPreset,
        removeQuickDrugPreset,
        reviews,
        addReview,
        isLoginModalOpen,
        setIsLoginModalOpen,
        isBookingModalOpen,
        setIsBookingModalOpen,
        isReviewModalOpen,
        setIsReviewModalOpen,
        isDoctorInfoOpen,
        setIsDoctorInfoOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
