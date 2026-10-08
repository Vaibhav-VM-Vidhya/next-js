'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Calendar,
  Phone,
  Clock,
  MapPin,
  Star,
  Award,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Activity,
  Heart,
  Smile,
} from 'lucide-react';

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const DoctorInfoPage: React.FC = () => {
  const { clinicInfo, doctors, setActiveView, setIsBookingModalOpen } = useApp();
  const doctor = doctors[0];

  const clinicalAreas = [
    {
      title: 'Oral Implantology & Guided Surgery',
      desc: 'Computer-guided dental implant placement, single tooth to full mouth rehabilitations, sinus lifting, and ridge bone augmentation.',
      icon: <ShieldCheck className="w-5 h-5 text-teal-600" />,
    },
    {
      title: 'Periodontal Regeneration & Laser Gum Therapy',
      desc: 'Pioneering treatment for pyorrhea, bleeding gums, laser pocket debridement, bone graft regeneration, and cosmetic gum depigmentation.',
      icon: <Sparkles className="w-5 h-5 text-sky-600" />,
    },
    {
      title: 'Painless Rotary Root Canal Treatment (RCT)',
      desc: 'Precision microscope and rotary endodontics preserving structurally damaged teeth in comfortable, quick single or dual sittings.',
      icon: <Activity className="w-5 h-5 text-amber-600" />,
    },
    {
      title: 'Multispeciality Smile Reconstruction',
      desc: 'Comprehensive restorative dentistry, ultra-thin porcelain veneers, zirconia crowns, and multidisciplinary bite rehabilitation.',
      icon: <Smile className="w-5 h-5 text-purple-600" />,
    },
  ];

  return (
    <div className="space-y-10 pb-16 animate-in fade-in">
      {/* Back button */}
      <div>
        <button
          onClick={() => setActiveView('public-home')}
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-teal-700 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Clinic Website</span>
        </button>
      </div>

      {/* Main Profile Hero Card */}
      <section className="bg-slate-950 text-white rounded-3xl p-5 sm:p-12 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Portrait */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative max-w-xs sm:max-w-sm w-full bg-slate-900 p-3 rounded-3xl border border-slate-800 shadow-2xl">
              <div className="h-72 sm:h-96 rounded-2xl overflow-hidden relative">
                <img
                  src={doctor?.avatar && !doctor.avatar.includes('images.unsplash.com') ? doctor.avatar : '/doc_img.jpeg'}
                  alt={doctor?.name || 'Dr. Abhishek V. Kamble'}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    e.currentTarget.src = '/doc_img.jpeg';
                  }}
                />
                <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-slate-950 via-slate-950/80 to-transparent p-4 text-white">
                  <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest block">
                    Chief Periodontist & Implantologist
                  </span>
                  <strong className="text-lg sm:text-xl font-bold block">{doctor?.name}</strong>
                  <span className="text-xs text-slate-300 block">{doctor?.qualification}</span>
                </div>
              </div>

              {/* Council badge */}
              <div className="mt-3 p-2.5 sm:p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1.5 text-slate-300">
                  <Award className="w-4 h-4 text-teal-400 shrink-0" />
                  <span className="font-mono text-[10px] sm:text-[11px]">Reg: {doctor?.registration || 'A-43344'}</span>
                </div>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded-full border border-teal-500/30">
                  MDC Registered
                </span>
              </div>
            </div>
          </div>

          {/* Biography and Accolades */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-teal-300 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Lead Specialist • Classic Smile</span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-white">
                {doctor?.name}
              </h1>
              <p className="text-teal-300 font-semibold text-sm sm:text-lg mt-1">
                {doctor?.qualification} — {doctor?.specialization}
              </p>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Dental Council Registration Number: <strong>{doctor?.registration || 'A-43344'}</strong>
              </p>
            </div>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Dr. Abhishek V. Kamble is a distinguished Periodontist and Oral Implantologist practicing in Charholi Budruk, Pimpri-Chinchwad, Pune. With extensive postgraduate surgical training (BDS, MDS), Dr. Abhishek specializes in regenerative gum surgeries, dental implantology, bone augmentation, and complete multispeciality smile rehabilitation.
            </p>

            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 border-t border-slate-800/80 text-center sm:text-left">
              <div className="p-2 sm:p-0 bg-slate-900/60 sm:bg-transparent rounded-xl">
                <strong className="text-xl sm:text-3xl font-black text-white block">12+</strong>
                <span className="text-[10px] sm:text-[11px] text-slate-400 uppercase font-semibold block">Years Exp</span>
              </div>
              <div className="p-2 sm:p-0 bg-slate-900/60 sm:bg-transparent rounded-xl">
                <strong className="text-xl sm:text-3xl font-black text-teal-400 block">4.9</strong>
                <span className="text-[10px] sm:text-[11px] text-slate-400 uppercase font-semibold block">Rating</span>
              </div>
              <div className="p-2 sm:p-0 bg-slate-900/60 sm:bg-transparent rounded-xl">
                <strong className="text-xl sm:text-3xl font-black text-amber-400 block">150+</strong>
                <span className="text-[10px] sm:text-[11px] text-slate-400 uppercase font-semibold block">Reviews</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2.5 pt-1 sm:pt-2">
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-linear-to-r from-teal-500 to-sky-500 hover:from-teal-600 hover:to-sky-600 text-white font-bold text-xs sm:text-sm shadow-xl shadow-teal-500/20 active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Consultation with Dr. Abhishek</span>
              </button>

              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3">
                <a
                  href={`tel:${clinicInfo.phone.replace(/[^0-9+]/g, '')}`}
                  className="px-3.5 py-2.5 sm:px-5 sm:py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center space-x-2 active:scale-95"
                >
                  <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                  <span className="truncate">{clinicInfo.phone}</span>
                </a>

                <a
                  href={`https://instagram.com/${clinicInfo.doctorInstagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2.5 sm:px-4 sm:py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-pink-300 border border-slate-700 font-semibold text-xs transition-colors flex items-center justify-center space-x-1.5 active:scale-95"
                >
                  <InstagramIcon className="w-4 h-4 text-pink-400 shrink-0" />
                  <span className="truncate">{clinicInfo.doctorInstagram}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clinical Areas of Expertise */}
      <section className="space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-teal-600">
            Clinical Focus
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-1">
            Specialized Areas of Dental Excellence
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Advanced dental interventions performed with modern magnification and patient-first comfort.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clinicalAreas.map((area, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex items-start space-x-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                {area.icon}
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-base">{area.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">{area.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Philosophy of Care */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold uppercase">
            <Heart className="w-3.5 h-3.5" />
            <span>Clinical Philosophy</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-slate-900">
            "Your Step Towards Dental Wellness"
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            At Classic Smile Dental Care & Implant Centre, our mission is to eliminate dental anxiety through transparent patient education, gentle handling, and biological conservation. Rather than aggressive overtreatment, Dr. Abhishek focuses on salvaging the natural dentition through periodontal rejuvenation and placing dental implants only when anatomically indicated for long-term health.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-1.5 text-teal-700 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Pain-Managed Care</span>
            </div>
            <p className="text-slate-500 text-[11px]">Modern local anesthesia protocols and gentle touch technique.</p>
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-1.5 text-teal-700 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Hospital Sterilization</span>
            </div>
            <p className="text-slate-500 text-[11px]">Class-B autoclave sterilization and single-use disposable barriers.</p>
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-1.5 text-teal-700 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Long-Term Follow Up</span>
            </div>
            <p className="text-slate-500 text-[11px]">Dedicated periodontal recall schedule to maintain lifetime dental wellness.</p>
          </div>
        </div>
      </section>

      {/* Practice Information */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-400">
              Practice Information
            </span>
            <h2 className="text-2xl font-serif font-bold text-white">
              Consult Dr. Abhishek at Classic Smile
            </h2>
            <div className="space-y-2 text-xs text-slate-300">
              <p className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>
                  {clinicInfo.address}, {clinicInfo.area}, {clinicInfo.city}
                </span>
              </p>
              <p className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{clinicInfo.openingHours}</span>
              </p>
              <p className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Direct Contact: {clinicInfo.phone} / {clinicInfo.secondaryPhone}</span>
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="flex-1 py-3 px-5 rounded-2xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs shadow-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment Now</span>
            </button>
            <a
              href={clinicInfo.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors flex items-center justify-center space-x-1.5"
            >
              <span>Map Directions</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};