import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PatientReview, PatientFollowUp } from '../../types';
import {
  Star,
  PhoneCall,
  CheckCircle2,
  Clock,
  User,
  Plus,
  MessageSquare,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const ReviewsManager: React.FC = () => {
  const { reviews, followUps, updateFollowUpStatus, addReview, doctors } = useApp();

  const [activeTab, setActiveTab] = useState<'reviews' | 'followups'>('followups');
  const [isNewReviewOpen, setIsNewReviewOpen] = useState(false);

  // New review state
  const [patientName, setPatientName] = useState('');
  const [rating, setRating] = useState(5);
  const [treatment, setTreatment] = useState('Porcelain Smile Makeover');
  const [doctorName, setDoctorName] = useState(doctors[0].name);
  const [comment, setComment] = useState('');

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !comment) return;

    addReview({
      patientName,
      patientInitial: patientName
        .split(' ')
        .map((n) => n[0])
        .join(''),
      rating,
      treatment,
      doctorName,
      comment,
      platform: 'Classic Smile Web',
    });

    setIsNewReviewOpen(false);
    setPatientName('');
    setComment('');
  };

  return (
    <div className="space-y-6">
      {/* Top Bar with Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span>Patient Follow-Ups & Reviews Desk</span>
          </h2>
          <p className="text-xs text-slate-500">
            Post-operative recovery monitoring, outbound recall calls, and verified patient testimonials
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="bg-slate-100 p-1 rounded-xl flex space-x-1 text-xs font-bold">
            <button
              onClick={() => setActiveTab('followups')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'followups'
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Post-Op Follow-Up Queue ({followUps.length})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'reviews'
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Verified Reviews ({reviews.length})
            </button>
          </div>

          {activeTab === 'reviews' && (
            <button
              onClick={() => setIsNewReviewOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Review</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: POST-OP FOLLOW-UP QUEUE */}
      {activeTab === 'followups' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-800">
              Active Patient Recovery & Post-Op Call List
            </h3>
            <span className="text-xs text-slate-500">
              Assigned Front-Desk Protocol: Check healing within 48h of surgical procedures
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Patient & Contact</th>
                  <th className="px-6 py-3">Procedure Performed</th>
                  <th className="px-6 py-3">Due Date</th>
                  <th className="px-6 py-3">Follow-Up Status</th>
                  <th className="px-6 py-3">Clinical Notes</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {followUps.map((fol) => {
                  const isPending = fol.status === 'Pending Call';

                  return (
                    <tr key={fol.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-3.5">
                        <strong className="text-slate-900 font-bold block">{fol.patientName}</strong>
                        <span className="text-[11px] text-slate-400 font-mono">{fol.patientPhone}</span>
                      </td>

                      <td className="px-6 py-3.5">
                        <span className="font-semibold text-slate-800 block">{fol.treatmentDone}</span>
                        <span className="text-[10px] text-slate-400">Date: {fol.treatmentDate}</span>
                      </td>

                      <td className="px-6 py-3.5 font-bold text-sky-700">
                        {fol.dueDate}
                      </td>

                      <td className="px-6 py-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            isPending
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}
                        >
                          {fol.status}
                        </span>
                      </td>

                      <td className="px-6 py-3.5 text-slate-600 max-w-xs truncate">
                        {fol.notes}
                      </td>

                      <td className="px-6 py-3.5 text-right space-x-1">
                        {isPending ? (
                          <button
                            onClick={() =>
                              updateFollowUpStatus(fol.id, 'Contacted - Recovering Well', 'Called via phone. No swelling or pain.')
                            }
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] shadow-xs flex items-center space-x-1 ml-auto"
                          >
                            <PhoneCall className="w-3 h-3" />
                            <span>Mark Contacted</span>
                          </button>
                        ) : (
                          <span className="text-emerald-700 font-bold text-[11px] flex items-center justify-end space-x-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Resolved</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: VERIFIED REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    {rev.platform}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed italic mb-4">
                  "{rev.comment}"
                </p>

                {rev.clinicResponse && (
                  <div className="p-3 rounded-xl bg-sky-50 border border-sky-100 text-[11px] text-sky-900 mt-2">
                    <strong className="block text-[10px] font-bold uppercase text-sky-700 mb-0.5">
                      Classic Smile Response:
                    </strong>
                    {rev.clinicResponse}
                  </div>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <strong className="font-bold text-slate-900 block">{rev.patientName}</strong>
                  <span className="text-[10px] text-slate-400">{rev.treatment} • {rev.doctorName}</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Review Modal */}
      {isNewReviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900">Add Verified Patient Testimonial</h3>

            <form onSubmit={handleAddReview} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Patient Name</label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Rachel Adams"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Star Rating (1-5)</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                >
                  <option value={5}>5 Stars (Exceptional)</option>
                  <option value={4}>4 Stars (Very Good)</option>
                  <option value={3}>3 Stars (Average)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Treatment Undergone</label>
                <input
                  type="text"
                  required
                  value={treatment}
                  onChange={(e) => setTreatment(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Patient Testimonial / Feedback</label>
                <textarea
                  rows={3}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share the patient's exact words about their smile transformation..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsNewReviewOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold"
                >
                  Publish Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
