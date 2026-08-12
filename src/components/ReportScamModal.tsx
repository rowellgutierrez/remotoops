import React, { useState } from 'react';
import { ScamReport } from '../types';
import { X, Flag, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { auth, db, doc, setDoc, collection } from '../lib/firebase';

interface ReportScamModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId?: string;
  jobTitle?: string;
  company?: string;
  employerUid?: string;
  onSubmitReport?: (report: ScamReport) => void;
}

export type ReportReason = 
  | 'scam_or_fraud'
  | 'request_for_payment'
  | 'suspicious_employer'
  | 'fake_job'
  | 'misleading_info'
  | 'inappropriate_content'
  | 'spam'
  | 'unsafe_external_link'
  | 'other';

export const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  scam_or_fraud: 'Scam or fraud',
  request_for_payment: 'Request for payment',
  suspicious_employer: 'Suspicious employer',
  fake_job: 'Fake job',
  misleading_info: 'Misleading information',
  inappropriate_content: 'Inappropriate content',
  spam: 'Spam',
  unsafe_external_link: 'External link appears unsafe',
  other: 'Other'
};

export const ReportScamModal: React.FC<ReportScamModalProps> = ({
  isOpen,
  onClose,
  jobId = 'job-general',
  jobTitle = 'Suspicious Listing',
  company = 'Unverified Employer',
  employerUid = 'unknown',
  onSubmitReport
}) => {
  const [reason, setReason] = useState<ReportReason>('request_for_payment');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const reportId = `report-${Date.now()}`;
    const reporterUid = auth.currentUser?.uid || 'anonymous-reporter';
    const timestamp = new Date().toISOString();

    const reportDoc = {
      reportId,
      id: reportId,
      reporterUid,
      reporterEmail: auth.currentUser?.email || 'anonymous',
      jobId,
      jobTitle,
      company,
      employerUid,
      reason,
      description: description.trim(),
      details: description.trim(),
      timestamp,
      reportedAt: new Date().toLocaleString(),
      status: 'OPEN'
    };

    try {
      if (auth.currentUser) {
        await setDoc(doc(db, 'reports', reportId), reportDoc);
        await setDoc(doc(collection(db, 'activity_logs')), {
          action: 'Job Reported',
          details: `Job '${jobTitle}' (ID: ${jobId}) reported for reason: ${REPORT_REASON_LABELS[reason]}`,
          timestamp
        });
      }
    } catch (err) {
      console.warn("[ReportScamModal] Firestore write fallback notice:", err);
    }

    if (onSubmitReport) {
      onSubmitReport({
        id: reportId,
        jobId,
        jobTitle,
        company,
        reporterName: auth.currentUser?.displayName || 'Concerned Member',
        reason: (reason === 'request_for_payment' ? 'upfront_payment_requested' : 'other') as ScamReport['reason'],
        details: description.trim(),
        reportedAt: new Date().toLocaleString()
      });
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setDescription('');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white font-bold">
              <Flag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Report Job or Employer</h3>
              <p className="text-[11px] text-slate-400">Reports are confidential & reviewed by admins</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
            <h4 className="font-bold text-slate-900 text-base">Report Submitted Securely</h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Thank you for protecting the community. Our admin team will review this report immediately.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-950 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                Reporting: {jobTitle} ({company})
              </p>
              <p className="text-[11px] text-slate-600">
                Your report is anonymous to the employer.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Reason for Report *</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as ReportReason)}
                className="w-full bg-slate-50 border border-slate-300 text-xs rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
              >
                <option value="scam_or_fraud">Scam or fraud</option>
                <option value="request_for_payment">Request for payment</option>
                <option value="suspicious_employer">Suspicious employer</option>
                <option value="fake_job">Fake job</option>
                <option value="misleading_info">Misleading information</option>
                <option value="inappropriate_content">Inappropriate content</option>
                <option value="spam">Spam</option>
                <option value="unsafe_external_link">External link appears unsafe</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Optional Explanation / Details:</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide additional context (e.g., recruiter requested money for training software, Telegram-only contact, etc.)..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 p-3 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Flag className="w-4 h-4" /> {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>

          </form>
        )}

      </div>
    </div>
  );
};

