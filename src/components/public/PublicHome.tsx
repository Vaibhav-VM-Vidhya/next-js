'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Calendar,
  CheckCircle,
  Star,
  Award,
  Phone,
  Clock,
  MapPin,
  Smile,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  MessageSquare,
  ArrowRight,
  Activity,
  Heart,
  Plus,
  ExternalLink,
  CheckCircle2,
  HelpCircle,
  Zap,
  ShieldAlert,
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

export const PublicHome: React.FC = () => {
  const { clinicInfo, doctors, reviews, setActiveView, setIsBookingModalOpen, setIsReviewModalOpen } = useApp();
  const [sliderPosition, setSliderPosition] = useState(50);
  const [selectedConcern, setSelectedConcern] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const leadDoctor = doctors[0];

  const dentalConcerns = [
    {
      id: 0,
      badge: 'Gums & Pyorrhea',
      icon: <Sparkles className="w-4 h-4 text-teal-400" />,
      symptom: 'Bleeding, Swollen Gums or Loose Teeth',
      diagnosisTitle: 'Periodontal Disease & Gum Inflammation',
      solution: 'Non-surgical ultrasonic debridement, regenerative bone grafting, and targeted diode laser gum therapy led by specialist Periodontist Dr. Abhishek V. Kamble.',
      recovery: 'Noticeable reduction in bleeding within 48 to 72 hours.',
      specialist: 'Dr. Abhishek V. Kamble (MDS Periodontist)',
      recommendedService: 'Periodontal / Gum Treatment',
    },
    {
      id: 1,
      badge: 'Tooth Replacement',
      icon: <ShieldCheck className="w-4 h-4 text-sky-400" />,
      symptom: 'Missing Tooth or Uncomfortable Denture',
      diagnosisTitle: 'Tooth Loss & Bone Resorption',
      solution: 'Permanent German titanium implant fixtures with computer-guided surgical precision, bone augmentation, and lifelike monolithic zirconia ceramic crowns.',
      recovery: 'Immediate function or 3-month solid osseointegration for lifelong chewing strength.',
      specialist: 'Oral Implantologist Lead',
      recommendedService: 'Dental Implants & Oral Implantology',
    },
    {
      id: 2,
      badge: 'Pain Relief',
      icon: <Zap className="w-4 h-4 text-amber-400" />,
      symptom: 'Throbbing Toothache, Cavity or Night Pain',
      diagnosisTitle: 'Deep Pulp Infection / Acute Pulpitis',
      solution: 'Rotary microscope-assisted painless Root Canal Treatment (RCT) in single or dual visits, followed by custom CAD/CAM crown placement to save natural tooth structure.',
      recovery: 'Immediate pain relief upon first session.',
      specialist: 'Endodontics & Restorative Specialists',
      recommendedService: 'Root Canal Treatment (RCT)',
    },
    {
      id: 3,
      badge: 'Smile Makeover',
      icon: <Smile className="w-4 h-4 text-purple-400" />,
      symptom: 'Stained, Chipped or Uneven Front Teeth',
      diagnosisTitle: 'Enamel Discoloration & Aesthetic Asymmetry',
      solution: 'Ultra-thin porcelain laminates, E-Max veneers, composite artistic bonding, and advanced 1-hour laser teeth whitening with zero sensitivity.',
      recovery: 'Instant radiant transformation with natural enamel translucency.',
      specialist: 'Cosmetic & Aesthetic Dental Team',
      recommendedService: 'Restorative & Cosmetic Dentistry',
    },
    {
      id: 4,
      badge: 'Preventive Checkup',
      icon: <Heart className="w-4 h-4 text-pink-400" />,
      symptom: 'Routine Checkup, Plaque or Bad Breath',
      diagnosisTitle: 'Calculus Buildup & Preventive Screening',
      solution: 'Ultrasonic micro-scaling, air-polishing, low-dose digital RVG imaging, enamel remineralization, and customized home oral hygiene guidance.',
      recovery: 'Leaves teeth feeling ultra-smooth, clean, and fresh immediately.',
      specialist: 'Preventive Dentistry Team',
      recommendedService: 'General Dentistry & Checkup',
    },
  ];

  const treatments = [
    {
      title: 'Dental Implants & Oral Implantology',
      desc: 'Permanent titanium & zirconia tooth replacement with computer-guided surgical precision, bone grafting, and immediate loading options.',
      icon: <ShieldCheck className="w-5 h-5 text-sky-400" />,
      tag: 'Specialist Implant Care',
      highlight: 'Lifelong Stability & Bone Preservation',
    },
    {
      title: 'Periodontal / Gum Treatment',
      desc: 'Expert care for bleeding gums, pyorrhea, deep pocket scaling, regenerative bone grafts, and advanced laser gum therapy by Dr. Abhishek.',
      icon: <Sparkles className="w-5 h-5 text-teal-400" />,
      tag: 'Periodontist Lead',
      highlight: 'Save Natural Teeth from Mobility',
    },
    {
      title: 'Root Canal Treatment (RCT)',
      desc: 'Painless, rotary microscope-assisted endodontics to relieve acute toothaches and seal internal tooth canals with precision crowns.',
      icon: <Activity className="w-5 h-5 text-amber-400" />,
      tag: 'Painless Rotary RCT',
      highlight: 'Comfortable, Single-Sitting Option',
    },
    {
      title: 'Multispeciality Dental Care',
      desc: 'Complete multidisciplinary oral care, full mouth reconstruction, orthodontic aligner consultations, and family dental health.',
      icon: <Award className="w-5 h-5 text-indigo-400" />,
      tag: 'Comprehensive Care',
      highlight: 'All Dental Specialties Under One Roof',
    },
    {
      title: 'Cosmetic & Aesthetic Dentistry',
      desc: 'Ultra-thin porcelain veneers, smile sculpting, composite bonding, and in-office diode laser teeth whitening for dazzling smiles.',
      icon: <Smile className="w-5 h-5 text-purple-400" />,
      tag: 'Smile Makeover',
      highlight: 'Natural Translucency & Perfect Symmetry',
    },
    {
      title: 'General & Preventive Dentistry',
      desc: 'Routine wellness examinations, ultrasonic scaling, digital RVG low-radiation X-rays, cavity fillings, and pediatric preventive sealants.',
      icon: <Heart className="w-5 h-5 text-pink-400" />,
      tag: 'Preventive Wellness',
      highlight: 'Your Step towards Dental Wellness',
    },
  ];

  const faqs = [
    {
      question: 'Is dental implant surgery painful at Classic Smile?',
      answer: 'Not at all. Implant procedures are performed under profound computer-assisted local anesthesia. Most patients report feeling only mild pressure during the procedure. Post-operative discomfort is comparable to a minor tooth extraction and is easily managed with gentle medications.',
    },
    {
      question: 'Why is seeing a Periodontist (Gum Specialist) so critical?',
      answer: 'Periodontal disease affects the supporting bone and tissue anchoring your teeth. Untreated gum infections cause bone loss, loose teeth, and systemic health risks. Dr. Abhishek V. Kamble has specialized MDS training to arrest infection, regenerate lost tissue, and preserve natural teeth.',
    },
    {
      question: 'How long does a Root Canal Treatment (RCT) usually take?',
      answer: 'With our advanced rotary endodontic equipment and digital imaging, most root canals can be comfortably completed in a single 45-to-60 minute sitting or two short appointments depending on tooth infection severity.',
    },
    {
      question: 'How often should I get my teeth cleaned and scaled?',
      answer: 'We recommend professional ultrasonic scaling and polishing every 6 months to remove hardened calculus that regular brushing cannot eliminate. This keeps your breath fresh and completely halts early gingivitis.',
    },
    {
      question: 'Where is the clinic located in Charholi and is parking available?',
      answer: 'We are situated on the 1st Floor, Shop No. 18, T Wing, Tanish Orchid, Charholi Road, Pune - 412105 (Chovisawadi / Charholi Budruk). Ample customer parking is available within the complex.',
    },
  ];

  return (
    <div className="space-y-16 pb-12">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-950 text-white rounded-3xl p-6 sm:p-12 lg:p-16 border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-teal-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>{clinicInfo.clinicType} • Charholi, Pune</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-white leading-tight">
              {clinicInfo.name}
            </h1>

            <p className="text-teal-300 font-serif italic text-lg sm:text-xl">
              "{clinicInfo.tagline}"
            </p>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Led by <strong>{leadDoctor?.name}</strong>, BDS, MDS (Periodontist & Oral Implantologist, Reg. No: A-43344). Expert clinical care for painless dental implants, advanced gum surgery, single-sitting root canals, and modern smile transformations in Charholi Bk., Pune.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="px-6 py-3.5 rounded-2xl bg-linear-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white font-bold text-xs sm:text-sm shadow-xl shadow-sky-500/20 hover:scale-105 transition-all flex items-center space-x-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment (Instant Slot)</span>
              </button>

              <a
                href={`tel:${clinicInfo.phone.replace(/\s+/g, '')}`}
                className="px-5 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm transition-colors flex items-center space-x-2"
              >
                <Phone className="w-4 h-4 text-teal-400" />
                <span>{clinicInfo.phone}</span>
              </a>

              <a
                href={clinicInfo.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-semibold text-xs transition-colors flex items-center space-x-1.5"
              >
                <MapPin className="w-4 h-4 text-rose-400" />
                <span>Find on Maps</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>

              <button
                onClick={() => setActiveView('doctor-info')}
                className="px-4 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-teal-300 border border-teal-500/30 font-semibold text-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <Award className="w-4 h-4 text-teal-400" />
                <span>Doctor Credentials</span>
              </button>
            </div>

            {/* Trust Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80">
              <div>
                <strong className="text-2xl sm:text-3xl font-black text-white block">12+</strong>
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Years Clinical Exp</span>
              </div>
              <div>
                <strong className="text-2xl sm:text-3xl font-black text-teal-400 block">150+</strong>
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Verified Reviews</span>
              </div>
              <div>
                <strong className="text-2xl sm:text-3xl font-black text-amber-400 flex items-center">
                  4.9 <Star className="w-4 h-4 ml-1 fill-amber-400 text-amber-400" />
                </strong>
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Google Rating</span>
              </div>
            </div>
          </div>

          {/* Doctor Portrait Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-2xl max-w-sm w-full">
              <div className="h-80 sm:h-96 rounded-2xl overflow-hidden relative">
                <img
                  src={leadDoctor?.avatar}
                  alt={leadDoctor?.name}
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-slate-950 via-slate-950/80 to-transparent p-5 text-white">
                  <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest block">
                    Chief Specialist
                  </span>
                  <strong className="text-lg font-bold block">{leadDoctor?.name}</strong>
                  <span className="text-xs text-slate-300 block">{leadDoctor?.qualification} • Reg: {leadDoctor?.registration}</span>
                  <span className="text-[11px] text-teal-300 font-semibold block mt-0.5">{leadDoctor?.specialization}</span>
                </div>
              </div>

              {/* Doctor Social & Badges */}
              <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-slate-300">
                  <InstagramIcon className="w-4 h-4 text-pink-400 shrink-0" />
                  <a
                    href={`https://instagram.com/${clinicInfo.doctorInstagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    {clinicInfo.doctorInstagram}
                  </a>
                </div>
                <button
                  onClick={() => setActiveView('doctor-info')}
                  className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-600 text-white font-bold text-[11px] transition-colors cursor-pointer"
                >
                  Doctor Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE DENTAL CONCERN / SYMPTOM TRIAGE NAVIGATOR */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold uppercase mb-2">
              <Zap className="w-3.5 h-3.5 text-teal-600" />
              <span>Patient Symptom Checker</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              What Dental Concern Are You Experiencing?
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select your symptom below to discover our recommended clinical solution and expected recovery.
            </p>
          </div>
          <span className="text-xs font-bold text-teal-700 hidden sm:block">
            Specialist Diagnosis Protocol
          </span>
        </div>

        {/* Concern Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {dentalConcerns.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedConcern(c.id)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                selectedConcern === c.id
                  ? 'bg-teal-600 text-white border-teal-600 shadow-md scale-[1.02]'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                  selectedConcern === c.id ? 'bg-teal-700 text-white' : 'bg-white text-slate-600'
                }`}>
                  {c.badge}
                </span>
                <span className={selectedConcern === c.id ? 'text-white' : ''}>{c.icon}</span>
              </div>
              <p className="text-xs font-bold leading-tight line-clamp-2">
                {c.symptom}
              </p>
            </button>
          ))}
        </div>

        {/* Selected Concern Clinical Pathway Detail */}
        {dentalConcerns[selectedConcern] && (
          <div className="p-6 rounded-2xl bg-linear-to-br from-slate-900 to-slate-950 text-white border border-slate-800 space-y-4 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">
                  Targeted Clinical Pathway
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {dentalConcerns[selectedConcern].diagnosisTitle}
                </h3>
              </div>
              <span className="text-xs font-medium text-slate-300 bg-slate-800 px-3 py-1 rounded-full w-fit">
                Attending: <strong>{dentalConcerns[selectedConcern].specialist}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8 space-y-3">
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {dentalConcerns[selectedConcern].solution}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <span><strong>Expected Recovery:</strong> {dentalConcerns[selectedConcern].recovery}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-sky-400" />
                    <span>Strict sterilization & zero-pain protocol</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-4 flex justify-end">
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs shadow-lg transition-transform hover:scale-105 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book for This Concern</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* MEET THE DOCTOR SECTION */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold uppercase">
              <Award className="w-3.5 h-3.5" />
              <span>Lead Specialist Profile</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              {leadDoctor?.name}
            </h2>
            <p className="text-sm font-semibold text-teal-700">
              {leadDoctor?.qualification} | Registration No: {leadDoctor?.registration}
            </p>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Specialist Periodontist and Oral Implantologist with extensive training in restorative biology, regenerative flap surgeries, bone expansion techniques, and precise dental implant placements. Committed to gentle, pain-free dental care tailored to each patient's comfort and long-term oral wellness.
            </p>
            <div className="pt-2 space-y-2 text-xs text-slate-700">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Specialized in Periodontal Surgery & Laser Gum Therapy</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Oral Implantology & Guided Full-Mouth Restoration</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Multispeciality Dental Team with Highest Sterilization Standards</span>
              </div>
            </div>
            <div className="pt-2">
              <button
                onClick={() => setActiveView('doctor-info')}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                <span>View Full Credentials & Academic Profile</span>
                <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Oral Implantology</h3>
              <p className="text-xs text-slate-600">
                Permanent replacement for single or multiple missing teeth with high biocompatibility and natural chewing efficiency.
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Periodontal Care</h3>
              <p className="text-xs text-slate-600">
                Specialized therapy for bleeding gums, mobile teeth, bad breath, bone loss, and gum recession.
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Clinical Hours</h3>
              <p className="text-xs text-slate-600">
                Mon - Sat: 10:00 AM - 9:00 PM<br />
                <span className="text-rose-600 font-semibold">Sunday: Closed</span>
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Direct Contact</h3>
              <p className="text-xs text-slate-600">
                {clinicInfo.phone}<br />
                {clinicInfo.secondaryPhone}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SIGNATURE CLINICAL SERVICES */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-600">
            Comprehensive Dental Services
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            Advanced Treatments & Procedures
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            State-of-the-art operatory equipment, digital radiography, and stringent sterilization protocols.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {treatments.map((t, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
                    {t.icon}
                  </div>
                  <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md">
                    {t.tag}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1.5">{t.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">{t.desc}</p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">{t.highlight}</span>
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center space-x-1 cursor-pointer"
                >
                  <span>Book This</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4-PILLAR CLINICAL SAFETY & STERILIZATION SHOWCASE */}
      <section className="bg-linear-to-r from-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-teal-800/40">
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-300">
            Clinical Rigor & Safety
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
            Why Patients Choose Classic Smile
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            We adhere strictly to international clinical safety, infection control, and biomaterial biocompatibility standards.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Class-B Autoclave</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Hospital-grade steam sterilization with individually sealed instrument pouches opened directly in front of each patient.
            </p>
          </div>

          <div className="p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Digital Low-Dose RVG</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Instant ultra-high-definition sensor X-rays with up to 85% reduced radiation exposure compared to conventional film.
            </p>
          </div>

          <div className="p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Painless Anesthesia</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Topical pre-numbing gels and fine-gauge needles ensure virtually painless administration before every procedure.
            </p>
          </div>

          <div className="p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Certified Implants</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              100% genuine medical Grade-4 pure titanium and zirconia fixtures with manufacturer traceability passports.
            </p>
          </div>
        </div>
      </section>

      {/* BEFORE / AFTER SMILE MAKEOVER SLIDER */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-12 border border-slate-800 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-400">
              Clinical Results
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Smile Transformation Gallery
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
              See the transformative impact of expert periodontal gum recontouring, dental implants, and aesthetic ceramic restorations. Drag the comparison handle left and right to inspect the natural tissue harmony and alignment.
            </p>

            <div className="space-y-2 text-xs text-slate-300 pt-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Healthy pink gum margins and tissue regeneration</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Biocompatible porcelain and zirconia lifelike shading</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Schedule Smile Consultation
              </button>
            </div>
          </div>

          {/* Interactive Comparison Slider */}
          <div className="lg:col-span-7 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="relative h-72 sm:h-80 rounded-xl overflow-hidden select-none">
              {/* After Image */}
              <img
                src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800"
                alt="After Transformation"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <span className="absolute top-3 right-3 bg-teal-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shadow-md">
                Post-Treatment Smile
              </span>

              {/* Before Image (Clipped) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPosition}%` }}
              >
                <img
                  src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800"
                  alt="Before"
                  className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-125"
                  style={{ width: '100%', minWidth: '400px' }}
                />
                <span className="absolute top-3 left-3 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shadow-md">
                  Pre-Op Baseline
                </span>
              </div>

              {/* Divider Handle */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white flex items-center justify-center cursor-ew-resize"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="w-7 h-7 rounded-full bg-white text-slate-950 shadow-xl flex items-center justify-center text-[9px] font-black">
                  ◀▶
                </div>
              </div>
            </div>

            <div className="mt-3 px-1">
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={(e) => setSliderPosition(Number(e.target.value))}
                className="w-full accent-teal-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>◀ Slide left for Pre-Op</span>
                <span>Slide right for Post-Op ▶</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VERIFIED PATIENT REVIEWS & ADD REVIEW BUTTON */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold uppercase mb-2">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>4.9 / 5 Rating • 150+ Google Reviews</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              Verified Patient Experiences
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Read authentic feedback from patients treated at Classic Smile Dental Care & Implant Centre.
            </p>
          </div>

          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Write a Patient Review</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-1 text-amber-400 mb-2">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic mb-4">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <strong className="text-slate-900 font-bold block">{rev.patientName}</strong>
                  <span className="text-[10px] text-slate-400">{rev.treatment}</span>
                </div>
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                  Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS (ACCORDION) */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-600">
            Patient Information & Queries
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-1">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Clear, honest answers to help you prepare for your consultation and dental procedures.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = expandedFaq === index;
            return (
              <div
                key={index}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaq(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-left bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 cursor-pointer"
                >
                  <span className="flex items-center space-x-2.5">
                    <HelpCircle className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-teal-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="p-4 sm:p-5 pt-0 bg-slate-50/50 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* REAL CLINIC LOCATION WITH USER-PROVIDED GOOGLE MAPS EMBED & EXACT CONTACT */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-600">
            Charholi Bk. Clinic Location
          </span>
          <h2 className="text-2xl font-serif font-bold text-slate-900 mt-1">
            Visit Classic Smile Dental Care & Implant Centre
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Conveniently located at Tanish Orchid on Charholi Road, Chovisawadi / Charholi Budruk, Pimpri-Chinchwad.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Location Details Card */}
          <div className="lg:col-span-5 space-y-4 text-xs">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3.5">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-slate-900 block text-sm">{clinicInfo.name}</strong>
                  <p className="text-slate-700 mt-1 leading-relaxed font-medium">
                    {clinicInfo.address}
                  </p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Area: {clinicInfo.area}
                  </p>
                  <span className="text-teal-700 font-bold block mt-1">{clinicInfo.city}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 space-y-1.5 text-slate-700">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>
                    Primary Phone: <strong className="text-slate-900">{clinicInfo.phone}</strong>
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>
                    Secondary Phone: <strong className="text-slate-900">{clinicInfo.secondaryPhone}</strong>
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 space-y-1 text-slate-700">
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{clinicInfo.openingHours}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center gap-3 text-slate-700">
                <div className="flex items-center space-x-1.5">
                  <InstagramIcon className="w-4 h-4 text-pink-600 shrink-0" />
                  <a
                    href={`https://instagram.com/${clinicInfo.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-slate-800 hover:text-teal-600 transition-colors"
                  >
                    {clinicInfo.instagram}
                  </a>
                </div>
                <span className="text-slate-300">•</span>
                <div className="flex items-center space-x-1.5">
                  <InstagramIcon className="w-4 h-4 text-pink-600 shrink-0" />
                  <a
                    href={`https://instagram.com/${clinicInfo.doctorInstagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-slate-800 hover:text-teal-600 transition-colors"
                  >
                    {clinicInfo.doctorInstagram}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="flex-1 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment</span>
              </button>

              <a
                href={clinicInfo.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center space-x-1.5"
              >
                <span>Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* User-provided Authentic Google Maps Iframe */}
          <div className="lg:col-span-7 h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-300 shadow-sm relative">
            <iframe
              title="Classic Smile Dental Care & Implant Centre Google Maps Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3893.290966957671!2d73.89516660000001!3d18.660168399999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c7d3a3b77d87%3A0x98a77e38c14f44d5!2sClassic%20Smile%20Dental%20Care%20%26%20Implant%20Centre%20(Periodontist%20%26%20Implantologist)!5e1!3m2!1sen!2sin!4v1791396156704!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              className="w-full h-full"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
