import React, { useState } from 'react';
import { 
  Bookmark, 
  BookmarkCheck, 
  ExternalLink, 
  MapPin, 
  DollarSign, 
  Clock, 
  Building2, 
  Trash2, 
  ArrowRight, 
  Search,
  Briefcase,
  Globe2,
  Sparkles
} from 'lucide-react';
import { SavedJob, UserAccount, JobPost } from '../types';

interface SavedJobsSectionProps {
  savedJobs?: SavedJob[];
  savedJobIds?: string[];
  jobs?: JobPost[];
  allJobs?: JobPost[];
  onUnsaveJob?: (jobId: string) => void;
  onToggleSaveJob?: (job: JobPost) => void;
  onApplyJob?: (job: JobPost) => void;
  onExploreJobs?: () => void;
  onFindJobs?: () => void;
  currentUser?: UserAccount | null;
  onOpenAuthModal?: (mode?: 'login' | 'signup') => void;
  isLoggedIn?: boolean;
}

export const SavedJobsSection: React.FC<SavedJobsSectionProps> = ({
  savedJobs: propSavedJobs = [],
  savedJobIds = [],
  jobs = [],
  allJobs = [],
  onUnsaveJob,
  onToggleSaveJob,
  onApplyJob,
  onExploreJobs,
  onFindJobs,
  currentUser,
  onOpenAuthModal,
  isLoggedIn
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Fallback handler for finding jobs
  const handleFindJobs = () => {
    if (onExploreJobs) onExploreJobs();
    else if (onFindJobs) onFindJobs();
  };

  // Combine job list sources
  const sourceJobs = allJobs.length > 0 ? allJobs : jobs;

  // Build unified saved items list
  const unifiedSavedJobs = React.useMemo(() => {
    if (propSavedJobs && propSavedJobs.length > 0) {
      return propSavedJobs;
    }
    // If propSavedJobs is empty, construct from savedJobIds and sourceJobs
    if (savedJobIds && savedJobIds.length > 0) {
      return savedJobIds.map(id => {
        const matchingJob = sourceJobs.find(j => j.id === id);
        if (matchingJob) {
          return {
            id: `saved_${id}`,
            userId: currentUser?.id || 'guest',
            jobId: matchingJob.id,
            jobTitle: matchingJob.title,
            company: matchingJob.company,
            companyLogo: matchingJob.companyLogo,
            location: matchingJob.clientLocation || 'Remote',
            compensation: matchingJob.compensation,
            experienceLevel: matchingJob.experienceLevelNum || 'Entry Level',
            jobStatus: matchingJob.jobStatus || 'OPEN',
            savedAt: matchingJob.postedDate || 'Recently',
            applicationMethod: matchingJob.applicationMethod,
            externalApplyUrl: matchingJob.externalApplyUrl
          } as SavedJob;
        }
        return null;
      }).filter((item): item is SavedJob => item !== null);
    }
    return [];
  }, [propSavedJobs, savedJobIds, sourceJobs, currentUser]);

  const handleRemove = (jobId: string) => {
    if (onUnsaveJob) {
      onUnsaveJob(jobId);
    } else if (onToggleSaveJob) {
      const match = sourceJobs.find(j => j.id === jobId);
      if (match) onToggleSaveJob(match);
      else onToggleSaveJob({ id: jobId } as JobPost);
    }
  };

  const handleApply = (jobId: string, savedItem: SavedJob) => {
    const fullJob = sourceJobs.find(j => j.id === jobId);
    if (fullJob && onApplyJob) {
      onApplyJob(fullJob);
    } else if (savedItem.externalApplyUrl) {
      window.open(savedItem.externalApplyUrl, '_blank', 'noopener,noreferrer');
    } else if (onApplyJob) {
      onApplyJob({
        id: savedItem.jobId,
        title: savedItem.jobTitle,
        company: savedItem.company,
        companyLogo: savedItem.companyLogo,
        clientName: savedItem.company,
        clientTitle: 'Hiring Team',
        clientAvatar: '',
        clientLocation: savedItem.location,
        roleCategory: 'general',
        compensation: savedItem.compensation,
        compensationType: 'paid_stipend',
        hoursPerWeek: 'Full-time / Flexible',
        timezone: 'Flexible / Async',
        mentorName: 'Direct Mentorship',
        mentorRole: 'Senior Team Lead',
        isMentorshipGuaranteed: true,
        isOpenToZeroExperience: true,
        isVerifiedSafeClient: true,
        description: 'Saved remote job opportunity.',
        responsibilities: ['Remote team collaboration', 'Async daily tasks'],
        learningOutcomes: ['Real-world experience', 'Remote communication skills'],
        requiredTools: ['Slack', 'Google Workspace'],
        postedDate: savedItem.savedAt,
        applicantCount: 0,
        applicationMethod: savedItem.applicationMethod || 'direct',
        externalApplyUrl: savedItem.externalApplyUrl
      });
    }
  };

  const filteredSavedJobs = unifiedSavedJobs.filter(job => {
    const term = searchTerm.toLowerCase();
    return (
      job.jobTitle.toLowerCase().includes(term) ||
      job.company.toLowerCase().includes(term) ||
      job.location.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Bookmark className="w-6 h-6 text-teal-600 fill-teal-600/20" />
            Saved Jobs
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Jobs you've saved for later. Review, manage, and apply at your own pace.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200 px-3.5 py-1.5 rounded-xl shadow-xs">
            {unifiedSavedJobs.length} {unifiedSavedJobs.length === 1 ? 'Job Saved' : 'Jobs Saved'}
          </span>
          <button
            onClick={handleFindJobs}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>Find Jobs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filter / Search Bar if items exist */}
      {unifiedSavedJobs.length > 0 && (
        <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search saved jobs by title, company, or location..."
            className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none font-medium"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-xs text-slate-400 hover:text-slate-600 font-bold mr-2"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* Empty State */}
      {unifiedSavedJobs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto border border-teal-100 shadow-xs">
            <Bookmark className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-lg font-bold text-slate-900">No saved jobs yet</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Save jobs you're interested in and come back to them anytime. Click the bookmark icon on any job card while browsing to add it here.
            </p>
          </div>
          <button
            onClick={handleFindJobs}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
          >
            Find Jobs
          </button>
        </div>
      ) : filteredSavedJobs.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-xs text-slate-500">
          No saved jobs match your search filter.
        </div>
      ) : (
        /* Saved Jobs Cards Grid */
        <div className="space-y-3">
          {filteredSavedJobs.map((item) => {
            const fullJob = sourceJobs.find(j => j.id === item.jobId);
            return (
              <div
                key={item.id || item.jobId}
                className="bg-white rounded-xl p-5 border border-slate-200 hover:border-teal-400 hover:shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-4">
                  {/* Company Logo or Initial Avatar */}
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 shrink-0 text-base overflow-hidden">
                    {item.companyLogo ? (
                      <img 
                        src={item.companyLogo} 
                        alt={item.company} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <span className="text-teal-700 font-extrabold">{item.company.charAt(0).toUpperCase()}</span>
                    )}
                  </div>

                  {/* Job Details */}
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-teal-700 transition-colors">
                        {item.jobTitle}
                      </h3>
                      {item.jobStatus === 'OPEN' && (
                        <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md">
                          Actively Hiring
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 font-medium">
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {item.company}
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Globe2 className="w-3.5 h-3.5 text-teal-600" />
                        {item.location || '100% Remote'}
                      </span>
                      {item.compensation && (
                        <span className="text-emerald-700 font-bold">
                          {item.compensation}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
                      <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md font-medium border border-slate-200">
                        {fullJob?.hoursPerWeek || 'Full-time'}
                      </span>
                      <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md font-medium border border-slate-200">
                        {item.experienceLevel || 'Open to Beginners'}
                      </span>
                      <span className="text-slate-400 text-[10px] ml-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Saved {item.savedAt}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 w-full md:w-auto justify-between md:justify-end">
                  <button
                    onClick={() => handleRemove(item.jobId)}
                    className="px-3 py-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>

                  <button
                    onClick={() => handleApply(item.jobId, item)}
                    className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
