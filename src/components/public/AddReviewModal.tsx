'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Star, X, CheckCircle2, MessageSquare, User, ArrowRight } from 'lucide-react';

export const AddReviewModal: React.FC = () => {
  const { isReviewModalOpen, setIsReviewModalOpen, addReview } = useApp();

  const [patientName, setPatientName] = useState('');
  const [rating, setRating] = useState(5);
  const [treatment, setTreatment] = useState('Dental Implants & Crown');
  const [comment, setComment] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isReviewModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !comment.trim()) return;

    addReview({
      patientName: patientName.trim(),
      rating,
      treatment,
      comment: comment.trim(),
    });

    setIsSuccess(true);
  };

  const handleClose = () => {
    setIsReviewModalOpen(false);
    setIsSuccess(false);
    setPatientName('');
    setComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>Patient Feedback</span>
          </div>
          <h3 className="text-xl font-bold text-white">Share Your Smile Experience</h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Your review helps other patients choose the right dental care.
          </p>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border-4 border-emerald-50 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-900">Thank You, {patientName}!</h4>
              <p className="text-xs text-slate-500 mt-1">
                Your 5-star review has been published to our patient wall and doctor portal.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-md hover:bg-slate-800 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* Rating Stars */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">Your Rating</label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 focus:outline-hidden"
                  >
                    <Star
                      className={`w-7 h-7 transition-colors ${
                        star <= rating
                          ? 'fill-amber-400 text-amber-400 scale-110'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-700 ml-2">
                  {rating === 5 ? '5.0 - Exceptional' : `${rating}.0 Stars`}
                </span>
              </div>
            </div>

            {/* Patient Name */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">Your Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Meera Joshi"
                  className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Treatment */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">Treatment Received</label>
              <input
                type="text"
                value={treatment}
                onChange={(e) => setTreatment(e.target.value)}
                placeholder="e.g. Root Canal, Teeth Whitening, Braces"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              />
            </div>

            {/* Review Comment */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">Your Feedback / Review *</label>
              <textarea
                rows={3}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with Dr. Abhishek V. Kamble and Classic Smile Dental Care..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-sky-500 focus:outline-hidden leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center space-x-2"
            >
              <span>Submit Verified Review</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
