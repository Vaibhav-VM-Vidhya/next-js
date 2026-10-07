import {
  ClinicInfo,
  Doctor,
  StaffUser,
  Appointment,
  Prescription,
  PatientReview,
} from '../types';

export const CLINIC_INFO: ClinicInfo = {
  name: 'Classic Smile Dental Clinic',
  tagline: 'Centre for Advanced Dentistry, Implants & Aesthetics',
  address: 'Shop 12-14, Ground Floor, Platinum Square, FC Road, Shivaji Nagar',
  city: 'Pune, Maharashtra 411005',
  phone: '+91 98230 44890',
  email: 'contact@classicsmiledental.com',
  openingHours: 'Mon - Sat: 9:00 AM - 8:30 PM | Sunday: 10:00 AM - 2:00 PM',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.997232231908!2d73.8415274751919!3d18.529023482568604!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c0792078652d%3A0xb304b4d75f6ef283!2sFergusson%20College%20Rd%2C%20Shivajinagar%2C%20Pune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1712534400000!5m2!1sen!2sin',
};

export const INITIAL_STAFF_USERS: StaffUser[] = [
  {
    id: 'user-doc-1',
    username: 'doctor',
    name: 'Dr. Vaibhav Sharma',
    role: 'doctor',
    password: 'admin1234', // Default password requiring reset on first login
    isDefaultPassword: true,
    isActive: true,
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    doctorId: 'doc-vaibhav',
  },
  {
    id: 'user-rec-1',
    username: 'receptionist',
    name: 'Front Desk Reception',
    role: 'receptionist',
    password: 'admin1234', // Default password requiring reset on first login
    isDefaultPassword: true,
    isActive: true,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
  },
];

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'doc-vaibhav',
    name: 'Dr. Vaibhav Sharma',
    title: 'Chief Prosthodontist & Oral Implantologist',
    specialization: 'Dental Implants, Full Mouth Rehab & Aesthetic Dentistry',
    qualification: 'BDS, MDS (Prosthodontics), Fellow ICOI (USA)',
    experienceYears: 14,
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    bio: 'Dedicated to painless biomimetic restorative care with over 4,500 successful dental implants and porcelain smile transformations.',
    consultationFee: 800,
    rating: 4.98,
    reviewsCount: 384,
    isActive: true,
    username: 'doctor',
  },
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-101',
    patientName: 'Rohan Deshmukh',
    patientPhone: '+91 98221 44550',
    doctorId: 'doc-vaibhav',
    doctorName: 'Dr. Vaibhav Sharma',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    service: 'Dental Implant Consultation',
    status: 'in-chair',
    notes: 'Lower molar missing for 6 months. Evaluate bone depth with OPG.',
    createdAt: '2026-10-07 09:15',
  },
  {
    id: 'apt-102',
    patientName: 'Priya Kulkarni',
    patientPhone: '+91 94230 11223',
    doctorId: 'doc-vaibhav',
    doctorName: 'Dr. Vaibhav Sharma',
    date: new Date().toISOString().split('T')[0],
    time: '11:30 AM',
    service: 'Porcelain Veneer Smile Design',
    status: 'checked-in',
    notes: 'Incisal chipping on upper central incisors.',
    createdAt: '2026-10-07 09:45',
  },
  {
    id: 'apt-103',
    patientName: 'Amitabh Joshi',
    patientPhone: '+91 98500 77889',
    doctorId: 'doc-vaibhav',
    doctorName: 'Dr. Vaibhav Sharma',
    date: new Date().toISOString().split('T')[0],
    time: '02:00 PM',
    service: 'Root Canal & Zirconia Crown',
    status: 'scheduled',
    notes: 'Sensitivity to cold and hot on tooth 36.',
    createdAt: '2026-10-07 10:00',
  },
  {
    id: 'apt-104',
    patientName: 'Ananya Sen',
    patientPhone: '+91 99220 33441',
    doctorId: 'doc-vaibhav',
    doctorName: 'Dr. Vaibhav Sharma',
    date: new Date().toISOString().split('T')[0],
    time: '04:30 PM',
    service: 'Laser Teeth Whitening & Cleaning',
    status: 'scheduled',
    notes: 'Routine aesthetic prophylaxis.',
    createdAt: '2026-10-07 11:20',
  },
];

export const INITIAL_REVIEWS: PatientReview[] = [
  {
    id: 'rev-1',
    patientName: 'Kunal Ranade',
    rating: 5,
    date: '2026-10-02',
    treatment: 'Dental Implant (Single Tooth)',
    comment: 'Dr. Vaibhav Sharma is exceptionally skilled. The implant procedure was totally painless with computer guidance. The clinic is spotless and modern.',
  },
  {
    id: 'rev-2',
    patientName: 'Sneha More',
    rating: 5,
    date: '2026-09-28',
    treatment: 'Porcelain Smile Makeover',
    comment: 'Got 6 veneers done. The natural translucency and attention to detail is mindblowing. I can smile with complete confidence now!',
  },
  {
    id: 'rev-3',
    patientName: 'Rajesh Gokhale',
    rating: 5,
    date: '2026-09-18',
    treatment: 'Single Sitting Root Canal',
    comment: 'Zero pain during the root canal. High-magnification microscope and gentle hands. Highest recommendation for family dental care.',
  },
];
