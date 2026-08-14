import React, { useState } from 'react';
import { 
  FileText, 
  Building2, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ExternalLink, 
  MessageSquare, 
  ArrowRight, 
  Search, 
  Filter,
  Eye,
  Briefcase,
  User,
  Sparkles
} from 'lucide-react';
import { Application, UserAccount } from '../types';

interface MyApplicationsSectionProps {
  applications: Application[];
  onExploreJobs: () => void;
  onOpenMessages?: () => void;
  currentUser: UserAccount | null;
}

export const MyApplicationsSection: React.FC<MyApplicationsSectionProps> = ({
  applications,
  onExploreJobs,
  onOpenMessages,
  currentUser
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingApp, setViewingApp] = useState<Application | null>(null);

  // Filter applications for current user if logged in
  const userApplications = applications.filter(app => {
    if (!currentUser) return true;
    if (app.candidateId && app.candidateId === currentUser.id) return true;
    if (app.candidateEmail && app.candidateEmail.toLowerCase() === currentUser.email.toLowerCase()) return true;
    return true; // Show in local state
  });

  const filteredApps = userApplications.filter(app => {
    const matchesStatus = selectedStatus === 'all' || app.status === selectedStatus;
    const matchesSearch = 
      app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: Application['status']) => {
    switch (status) {
      case 'accepted':
      case 'hired':
        return (
          <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Accepted / Offer
          </span>
        );
      case 'interview':
      case 'intro_chat':
        return (
          <span className="bg-purple-100 text-purple-800 border border-purple-300 text-[11px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Interview Scheduled
          </span>
        );
      case 'shortlisted':
        return (
          <span className="bg-indigo-100 text-indigo-800 border border-indigo-300 text-[11px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-indigo-600" />
            Shortlisted
          </span>
        );
      case 'under_review':
        return (
          <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Under Review
          </span>
        );
      case 'declined':
        return (
          <span className="bg-rose-100 text-rose-800 border border-rose-300 text-[11px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            Not Selected
          </span>
        );
      case 'applied':
      default:
        return (
          <span className="bg-teal-100 text-teal-800 border border-teal-300 text-[11px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
            Submitted
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-700 text-xs font-black uppercase tracking-wider mb-1">
            <Briefcase className="w-4 h-4 text-teal-600" />
            Application Tracker
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Applications</h1>
          <p className="text-sm text-slate-600 mt-1">
            Track the status of all your submitted job applications and direct pitches in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200 px-3.5 py-1.5 rounded-xl">
            {userApplications.length} {userApplications.length === 1 ? 'Application' : 'Applications'}
          </span>
          <button
            onClick={onExploreJobs}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>Apply to More Jobs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All' },
            { id: 'applied', label: 'Submitted' },
            { id: 'under_review', label: 'Under Review' },
            { id: 'shortlisted', label: 'Shortlisted' },
            { id: 'interview', label: 'Interview' },
            { id: 'accepted', label: 'Accepted' },
            { id: 'declined', label: 'Declined' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedStatus === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search company or title..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
          />
        </div>
      </div>

      {/* Application List */}
      {userApplications.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto border border-teal-100">
            <FileText className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-black text-slate-900">No applications yet</h3>
            <p className="text-xs text-slate-600 mt-1">
              Browse open job opportunities and submit your direct pitch or application. Your progress and interview steps will appear right here.
            </p>
          </div>
          <button
            onClick={onExploreJobs}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-teal-600/20"
          >
            Find Jobs & Apply
          </button>
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-xs text-slate-500">
          No applications match the selected filter.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-slate-700 shrink-0 text-base">
                  {app.company ? app.company.charAt(0) : 'R'}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-extrabold text-sm text-slate-900">{app.jobTitle}</h3>
                    {getStatusBadge(app.status)}
                  </div>

                  <p className="text-xs font-semibold text-slate-600 flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{app.company}</span>
                    <span className="text-slate-300">•</span>
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-500">Applied {app.appliedAt}</span>
                  </p>

                  {app.mentorNotes && (
                    <div className="mt-2 bg-teal-50 border border-teal-200 p-2.5 rounded-xl text-xs text-teal-900 font-medium">
                      <span className="font-bold text-teal-950">Feedback / Next Steps: </span>
                      {app.mentorNotes}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => setViewingApp(app)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>

                {onOpenMessages && (
                  <button
                    onClick={onOpenMessages}
                    className="px-3.5 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs rounded-xl border border-teal-200 transition-colors flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Messages</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Application Details Modal */}
      {viewingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-xl w-full text-slate-900 overflow-hidden my-6 animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-black text-sm text-slate-900">{viewingApp.jobTitle}</h3>
                <p className="text-xs text-slate-500">{viewingApp.company} • Applied {viewingApp.appliedAt}</p>
              </div>
              <button
                onClick={() => setViewingApp(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs text-slate-700">
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900">Current Status:</span>
                {getStatusBadge(viewingApp.status)}
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Candidate Details</h4>
                <p className="font-medium">{viewingApp.candidateName} ({viewingApp.candidateEmail})</p>
              </div>

              {viewingApp.resumeUrl && (
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Attached Resume</h4>
                  <a
                    href={viewingApp.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-teal-700 font-bold bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200 hover:bg-teal-100 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Attached Resume</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {viewingApp.toolExperience && viewingApp.toolExperience.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-900 mb-1.5">Submitted Tools & Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {viewingApp.toolExperience.map((t, idx) => (
                      <span key={idx} className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md font-semibold text-slate-800">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {viewingApp.coverPitch && (
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Cover Pitch / Motivation</h4>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-slate-800 leading-relaxed whitespace-pre-line font-medium">
                    {viewingApp.coverPitch}
                  </div>
                </div>
              )}

              {viewingApp.mentorNotes && (
                <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-amber-900">
                  <h4 className="font-bold mb-1">Employer / Mentor Notes</h4>
                  <p className="font-medium">{viewingApp.mentorNotes}</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setViewingApp(null)}
                className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
