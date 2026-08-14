import React, { useState } from 'react';
import { 
  Building2, 
  Briefcase, 
  Plus, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  DollarSign, 
  MapPin, 
  Eye, 
  FileText,
  Lock,
  ChevronRight,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { JobPost, Application, UserAccount } from '../types';

interface EmployerSectionProps {
  currentUser: UserAccount | null;
  jobs: JobPost[];
  applications: Application[];
  onOpenPostJob: () => void;
  onOpenEmployerPricing: () => void;
  onUpdateApplicationStatus: (applicationId: string, newStatus: Application['status'], notes?: string) => void;
  onOpenAuthModal?: () => void;
  onOpenAccountModal?: () => void;
}

export const EmployerSection: React.FC<EmployerSectionProps> = ({
  currentUser,
  jobs,
  applications,
  onOpenPostJob,
  onOpenEmployerPricing,
  onUpdateApplicationStatus,
  onOpenAuthModal,
  onOpenAccountModal
}) => {
  const isEmployerOrAdmin = currentUser && (currentUser.role === 'client' || currentUser.role === 'employer' || currentUser.role === 'admin');
  const [selectedJobId, setSelectedJobId] = useState<string>('all');
  const [selectedApplicant, setSelectedApplicant] = useState<Application | null>(null);
  const [statusToUpdate, setStatusToUpdate] = useState<Application['status']>('under_review');
  const [mentorNotes, setMentorNotes] = useState('');

  // Filter jobs posted by this employer (or show all in demo if admin/employer)
  const employerJobs = jobs.filter(j => {
    if (!currentUser) return true;
    if (currentUser.role === 'admin') return true;
    if (j.postedBy === currentUser.id || j.clientName === currentUser.name) return true;
    return true; // Show demo jobs for employer
  });

  const employerApplications = applications.filter(app => {
    if (selectedJobId === 'all') return true;
    return app.jobId === selectedJobId;
  });

  const handleUpdateStatus = () => {
    if (!selectedApplicant) return;
    onUpdateApplicationStatus(selectedApplicant.id, statusToUpdate, mentorNotes);
    setSelectedApplicant(null);
    setMentorNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-900/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-bold">
            <Building2 className="w-3.5 h-3.5" />
            Employer & Hiring Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Hire Top Entry-Level & Remote Talent
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200/80 leading-relaxed">
            Post opportunities, review screened applicant pitches, and schedule interviews directly.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={onOpenEmployerPricing}
            className="px-4 py-2.5 bg-indigo-800/60 hover:bg-indigo-700/60 text-white font-bold text-xs rounded-xl border border-indigo-500/30 transition-colors flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>Pricing Plans</span>
          </button>

          {isEmployerOrAdmin ? (
            <button
              onClick={onOpenPostJob}
              className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Job</span>
            </button>
          ) : (
            <button
              onClick={onOpenAccountModal || onOpenAuthModal}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Register as Employer</span>
            </button>
          )}
        </div>
      </div>

      {/* Permission Notification if not Employer */}
      {!isEmployerOrAdmin && (
        <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-extrabold text-xs text-amber-950">Employer Account Required to Post Jobs</h4>
              <p className="text-xs text-amber-800 mt-0.5">
                Job seekers can find and apply for jobs. To post opportunities or review company applications, switch or register with an Employer profile.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenAccountModal || onOpenAuthModal}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl whitespace-nowrap shadow-sm"
          >
            Switch to Employer Role
          </button>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-teal-600" /> Active Postings
          </div>
          <div className="text-2xl font-black text-slate-900">{employerJobs.length}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-indigo-600" /> Total Applicants
          </div>
          <div className="text-2xl font-black text-slate-900">{applications.length}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> Under Review
          </div>
          <div className="text-2xl font-black text-slate-900">
            {applications.filter(a => a.status === 'applied' || a.status === 'under_review').length}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Shortlisted / Hired
          </div>
          <div className="text-2xl font-black text-slate-900">
            {applications.filter(a => a.status === 'shortlisted' || a.status === 'interview' || a.status === 'accepted' || a.status === 'hired').length}
          </div>
        </div>
      </div>

      {/* Main Content Area: Manage Jobs & Candidate Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Job Postings List */}
        <div className="lg:col-span-1 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-teal-600" /> Your Job Postings
            </h3>
            {isEmployerOrAdmin && (
              <button
                onClick={onOpenPostJob}
                className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> New Job
              </button>
            )}
          </div>

          <button
            onClick={() => setSelectedJobId('all')}
            className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
              selectedJobId === 'all'
                ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="font-bold text-xs">All Postings ({applications.length} applicants)</div>
            <ChevronRight className="w-4 h-4 opacity-75" />
          </button>

          {employerJobs.map(job => {
            const count = applications.filter(a => a.jobId === job.id).length;
            const isSelected = selectedJobId === job.id;
            return (
              <div
                key={job.id}
                onClick={() => setSelectedJobId(job.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                  isSelected
                    ? 'bg-indigo-50 border-indigo-300 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-indigo-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-xs text-slate-900 leading-tight">{job.title}</h4>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 shrink-0">
                    {count} {count === 1 ? 'applicant' : 'applicants'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-2">
                  <span>{job.company}</span>
                  <span>•</span>
                  <span>{job.timezone}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Candidate Applications Pipeline */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              Applicant Pipeline ({employerApplications.length})
            </h3>
          </div>

          {employerApplications.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3 shadow-sm">
              <Users className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="font-bold text-sm text-slate-700">No applicants for this job yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                As candidates submit their applications, they will appear here with their resumes and skill scores.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {employerApplications.map(app => (
                <div
                  key={app.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 shadow-sm transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-slate-700 text-sm">
                        {app.candidateName ? app.candidateName.charAt(0) : 'A'}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900">{app.candidateName}</h4>
                        <p className="text-xs text-slate-500">{app.candidateEmail} • Applied for: <span className="font-bold text-slate-700">{app.jobTitle}</span></p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider self-start sm:self-auto ${
                      app.status === 'accepted' || app.status === 'hired'
                        ? 'bg-emerald-100 text-emerald-800'
                        : app.status === 'interview'
                        ? 'bg-purple-100 text-purple-800'
                        : app.status === 'shortlisted'
                        ? 'bg-indigo-100 text-indigo-800'
                        : app.status === 'declined'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}>
                      {app.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Pitch preview */}
                  {app.coverPitch && (
                    <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 line-clamp-2">
                      "{app.coverPitch}"
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      {app.resumeUrl && (
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Resume</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setSelectedApplicant(app);
                        setStatusToUpdate(app.status);
                        setMentorNotes(app.mentorNotes || '');
                      }}
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                    >
                      Update Candidate Status
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review Candidate Status Modal */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-lg w-full text-slate-900 overflow-hidden my-6 animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-black text-sm text-slate-900">Review Candidate: {selectedApplicant.candidateName}</h3>
                <p className="text-xs text-slate-500">Applying for {selectedApplicant.jobTitle}</p>
              </div>
              <button
                onClick={() => setSelectedApplicant(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1.5">Application Status</label>
                <select
                  value={statusToUpdate}
                  onChange={(e) => setStatusToUpdate(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-bold"
                >
                  <option value="under_review">Under Review</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="interview">Interview Scheduled</option>
                  <option value="accepted">Accepted / Offer Extended</option>
                  <option value="declined">Declined</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1.5">Feedback / Next Steps for Candidate</label>
                <textarea
                  rows={3}
                  value={mentorNotes}
                  onChange={(e) => setMentorNotes(e.target.value)}
                  placeholder="e.g. Please check your email for the interview invitation link."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setSelectedApplicant(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow"
              >
                Save Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
