// ==========================================
// CLASSIC SMILE - CLEAN REAL WEB TYPES
// ==========================================

export type StaffRole = 'doctor' | 'receptionist';
export type UserRole = 'admin' | 'doctor' | 'receptionist' | 'patient';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  branchId?: string;
  doctorId?: string;
  phone?: string;
}

export interface StaffUser {
  id: string;
  username: string;
  name: string;
  role: StaffRole;
  password: string; // Stored in LocalStorage
  isDefaultPassword: boolean; // True until user creates their own password
  isActive: boolean;
  avatar: string;
  doctorId?: string;
}

export interface ClinicInfo {
  name: string;
  tagline: string;
  clinicType: string;
  specialization: string;
  address: string;
  area: string;
  city: string;
  phone: string;
  secondaryPhone: string;
  email: string;
  openingHours: string;
  mapEmbedUrl: string;
  mapUrl: string;
  instagram: string;
  doctorInstagram: string;
  rating: number;
  reviewsCount: number;
}

export interface Branch {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  openingHours: string;
  chairsCount: number;
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialization: string;
  qualification: string;
  registration?: string;
  experienceYears: number;
  avatar: string;
  bio: string;
  consultationFee: number;
  rating: number;
  reviewsCount: number;
  isActive: boolean;
  username?: string;
  instagram?: string;
  branchIds?: string[];
}

export interface Patient {
  id: string;
  fullName: string;
  phone: string;
  age?: number;
  gender?: string;
  allergies?: string[];
  registeredDate: string;
  mrn?: string;
  bloodGroup?: string;
  branchId?: string;
  medicalConditions?: string[];
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  totalBilled?: number;
  totalPaid?: number;
}

export type AppointmentStatus = 'scheduled' | 'checked-in' | 'in-chair' | 'completed' | 'cancelled' | 'confirmed';

export interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  service: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  patientId?: string;
  branchId?: string;
  durationMinutes?: number;
  type?: string;
  estimatedCost?: number;
}

export interface PrescriptionMedicine {
  id: string;
  drugName: string;
  genericName: string;
  dosage: string;
  frequency: string;
  duration: string;
  specialInstructions: string;
  form?: string;
}

export interface Prescription {
  id: string;
  prescriptionNumber: string;
  patientName: string;
  doctorName: string;
  doctorQualification: string;
  date: string;
  diagnosis: string;
  medicines: PrescriptionMedicine[];
  advice: string[];
  followUpDate: string;
  patientId?: string;
  patientAge?: number;
  doctorId?: string;
}

export interface PatientReview {
  id: string;
  patientName: string;
  rating: number;
  date: string;
  treatment: string;
  comment: string;
  verified?: boolean;
  platform?: string;
  clinicResponse?: string;
  doctorName?: string;
}


