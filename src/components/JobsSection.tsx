import React, { useState } from 'react';
import { JobPost, RoleCategory, TimezoneOverlap, CompensationType, ROLE_CATEGORY_LABELS, UserAccount } from '../types';
import { JobFilterBar, FilterState, INITIAL_FILTER_STATE } from './JobFilterPillBar';
import { 
  Search, 
  MapPin, 
  Clock, 
  DollarSign, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  Globe2, 
  Briefcase, 
  User, 
  BookOpen, 
  Send, 
  X,
  Zap,
  ShieldCheck,
  ShieldAlert,
  Flag,
  ChevronRight,
  BadgeCheck,
  GraduationCap,
  Lock,
  LogIn,
  UserCheck,
  Heart,
  ExternalLink,
  Building2
} from 'lucide-react';

import { auth, db, doc, setDoc } from '../lib/firebase';

interface JobsSectionProps {
  jobs: JobPost[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentUser: UserAccount | null;
  onOpenAuthModal: (mode?: 'login' | 'signup') => void;
  onApply: (job: JobPost, pitch: string, tools: string[]) => void;
  onOpenPostJob: () => void;
  onAnalyzePitchWithAI: (targetRole: string, draftPitch: string) => Promise<any>;
  onOpenReportModal?: (jobId?: string, jobTitle?: string, company?: string) => void;
  onOpenSafetyHub?: () => void;
  onOpenProfileModal?: () => void;
  savedJobIds?: string[];
  onToggleSaveJob?: (job: JobPost) => void;
  onExternalApply?: (job: JobPost) => void;
}

export const JobsSection: React.FC<JobsSectionProps> = ({
  jobs,
  searchQuery,
  setSearchQuery,
  currentUser,
  onOpenAuthModal,
  onApply,
  onOpenPostJob,
  onAnalyzePitchWithAI,
  onOpenReportModal,
  onOpenSafetyHub,
  onOpenProfileModal,
  savedJobIds = [],
  onToggleSaveJob,
  onExternalApply
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTimezone, setSelectedTimezone] = useState<string>('all');
  const [selectedCompType, setSelectedCompType] = useState<string>('all');
  const [pillFilters, setPillFilters] = useState<FilterState>(INITIAL_FILTER_STATE);
  const [activeJobModal, setActiveJobModal] = useState<JobPost | null>(null);

  // Application form state inside modal
  const [applicantPitch, setApplicantPitch] = useState('');
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [aiFeedback, setAiFeedback] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // GATED ACCESS VIEW: Unauthenticated Public Visitor
  if (!currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
        
        {/* Anti-Scam Security Banner */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0 font-bold">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">Protected & Anti-Scam Verified Job Ecosystem</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                RemotoOps requires account authentication to keep recruitment scammers out and ensure 100% genuine opportunities.
              </p>
            </div>
          </div>
          {onOpenSafetyHub && (
            <button
              onClick={onOpenSafetyHub}
              className="text-xs font-extrabold text-amber-800 hover:text-amber-900 underline shrink-0 flex items-center gap-1"
            >
              Anti-Scam Guide <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Locked Portal Hero Card */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl border border-slate-800 text-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-300 text-xs font-extrabold px-4 py-1.5 rounded-full border border-teal-500/30 uppercase tracking-wider">
              <Lock className="w-4 h-4 text-teal-400" /> Members-Only Remote Job Portal
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              Sign In or Create an Account to Access Remote Job Postings
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
              To protect candidates from recruitment scams and maintain verified 1-on-1 mentorship standards, full job postings, client details, and application forms are reserved for registered members.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <button
                onClick={() => onOpenAuthModal('signup')}
                className="w-full sm:w-auto bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-sm px-7 py-3.5 rounded-2xl shadow-xl shadow-teal-500/20 transition-all flex items-center justify-center gap-2 hover:scale-105"
              >
                <UserCheck className="w-5 h-5" /> Create Free Account
              </button>

              <button
                onClick={() => onOpenAuthModal('login')}
                className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-sm px-7 py-3.5 rounded-2xl border border-slate-700 transition-all flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5 text-teal-400" /> Log In to Access Jobs
              </button>
            </div>

            <p className="text-xs text-slate-400 font-medium pt-1">
              ✨ Free for all applicants • Takes 30 seconds • Zero fees guaranteed
            </p>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">100% Vetted Remote Opportunities</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every job poster undergoes anti-scam verification. We strictly filter out fee demands, check-buying schemes, and suspicious telegram recruiters.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Zero-Experience Mentorships</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tailored for beginners in Executive Assistance, Admin Support, Social Media Management, and Remote Customer Care looking for entry experience.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Gemini AI Pitch & Resume Assistant</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Use our AI tools to optimize your pitch, tailor your experience, and generate ATS-friendly plain text resumes for high callback rates.
            </p>
          </div>
        </div>

        {/* Blurred Locked Job Listings Preview */}
        <div className="relative bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm overflow-hidden min-h-[320px] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-600" /> Currently Hidden Opportunities (45+ Active Remote Roles)
            </h3>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Gated from Unauthenticated Visitors
            </span>
          </div>

          {/* Locked items list representation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 filter blur-[3px] opacity-30 select-none pointer-events-none py-2">
            <div className="bg-slate-100 p-5 rounded-2xl space-y-3 border border-slate-200">
              <div className="h-5 bg-slate-300 rounded w-3/4" />
              <div className="h-3 bg-slate-200 rounded w-1/2" />
              <div className="h-12 bg-slate-200 rounded w-full" />
            </div>
            <div className="bg-slate-100 p-5 rounded-2xl space-y-3 border border-slate-200">
              <div className="h-5 bg-slate-300 rounded w-2/3" />
              <div className="h-3 bg-slate-200 rounded w-1/3" />
              <div className="h-12 bg-slate-200 rounded w-full" />
            </div>
          </div>

          {/* Center Lock Callout */}
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
            <div className="w-12 h-12 rounded-full bg-teal-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-teal-500/30">
              <Lock className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-lg sm:text-xl text-white">Unlock All 45+ Verified Remote Postings</h4>
            <p className="text-xs text-slate-200 max-w-md">
              Register or log in now to view full job requirements, stipend rates, client profiles, and directly submit your application pitch.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <button
                onClick={() => onOpenAuthModal('signup')}
                className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs px-5 py-3 rounded-xl shadow-xl transition-all flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4" /> Sign Up Free to Unlock
              </button>
              <button
                onClick={() => onOpenAuthModal('login')}
                className="bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs px-5 py-3 rounded-xl border border-slate-700 transition-all flex items-center gap-2"
              >
                <LogIn className="w-4 h-4 text-teal-400" /> Log In
              </button>
            </div>
          </div>

        </div>

      </div>
    );
  }

  // Comprehensive Filter logic
  const filteredJobs = jobs.filter(job => {
    // Category filter
    if (selectedCategory !== 'all' && job.roleCategory !== selectedCategory) return false;
    // Timezone filter
    if (selectedTimezone !== 'all' && job.timezone !== selectedTimezone) return false;
    // Comp filter
    if (selectedCompType !== 'all' && job.compensationType !== selectedCompType) return false;
    
    // Main Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = job.title.toLowerCase().includes(q);
      const matchCompany = job.company.toLowerCase().includes(q);
      const matchDesc = job.description.toLowerCase().includes(q);
      const matchTools = job.requiredTools.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchCompany && !matchDesc && !matchTools) return false;
    }

    // PILL FILTERS
    // 1. Apply Process
    if (pillFilters.applyProcess !== 'all') {
      if (job.applyProcess && job.applyProcess !== pillFilters.applyProcess) return false;
    }

    // 2. Department
    if (pillFilters.department !== 'all') {
      const deptMap: Record<string, string> = {
        executive_assistant: 'executive_assistant',
        customer_care: 'customer_support',
        marketing_smm: 'social_media',
        tech_web: 'tech_ops'
      };
      const mappedCategory = deptMap[pillFilters.department];
      if (mappedCategory && job.roleCategory !== mappedCategory) return false;
    }

    // 3. Keywords from Pill
    if (pillFilters.keywords.trim()) {
      const kw = pillFilters.keywords.toLowerCase();
      const matchTitle = job.title.toLowerCase().includes(kw);
      const matchTools = job.requiredTools.some(t => t.toLowerCase().includes(kw));
      const matchCompany = job.company.toLowerCase().includes(kw);
      if (!matchTitle && !matchTools && !matchCompany) return false;
    }

    // 4. Experience Level
    if (pillFilters.experience !== 'all') {
      if (pillFilters.experience === 'entry' && !job.isOpenToZeroExperience) return false;
    }

    // 5. Exclude Jobs
    if (pillFilters.excludeJobs.includes('agency')) {
      if (job.company.toLowerCase().includes('agency') || job.company.toLowerCase().includes('staffing')) return false;
    }
    if (pillFilters.excludeJobs.includes('no_stipend')) {
      if (job.compensation.toLowerCase().includes('unpaid') || job.compensation.toLowerCase().includes('$0')) return false;
    }

    // 6. Security Clearance
    if (pillFilters.securityClearance !== 'all') {
      if (pillFilters.securityClearance === 'kyc_verified' && !job.isVerifiedSafeClient) return false;
    }

    // 7. Shift Schedule
    if (pillFilters.shiftSchedule !== 'all') {
      if (pillFilters.shiftSchedule === 'night_shift' && !job.timezone.includes('EST') && !job.timezone.includes('PST')) return false;
      if (pillFilters.shiftSchedule === 'day_shift' && !job.timezone.includes('SGT') && !job.timezone.includes('PHT')) return false;
      if (pillFilters.shiftSchedule === 'flexible_async' && !job.timezone.includes('Flexible')) return false;
    }

    // 8. Company Name
    if (pillFilters.companyName.trim()) {
      if (!job.company.toLowerCase().includes(pillFilters.companyName.toLowerCase())) return false;
    }

    return true;
  });

  const handleOpenModal = (job: JobPost) => {
    setActiveJobModal(job);
    setApplicantPitch('');
    setSelectedTools(job.requiredTools.slice(0, 2));
    setAiFeedback(null);
    setIsSubmitted(false);
  };

  const handleToolToggle = (tool: string) => {
    if (selectedTools.includes(tool)) {
      setSelectedTools(selectedTools.filter(t => t !== tool));
    } else {
      setSelectedTools([...selectedTools, tool]);
    }
  };

  const handleRunAiPitchAnalysis = async () => {
    if (!applicantPitch.trim() || !activeJobModal) return;
    setIsAnalyzing(true);
    try {
      const result = await onAnalyzePitchWithAI(
        activeJobModal.roleCategory,
        applicantPitch
      );
      if (result && result.success && result.data) {
        setAiFeedback(result.data);
        if (result.data.rewrittenPitch) {
          setApplicantPitch(result.data.rewrittenPitch);
        }
      } else {
        alert(result?.error || "AI service is temporarily unavailable. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("AI service is temporarily unavailable. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeJobModal || !applicantPitch.trim()) return;

    onApply(activeJobModal, applicantPitch, selectedTools);
    setIsSubmitted(true);
    setTimeout(() => {
      setActiveJobModal(null);
      setIsSubmitted(false);
    }, 1800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Anti-Scam Alert Bar */}
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-3.5 px-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-950">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <span className="font-extrabold text-emerald-950">Anti-Scam Protection Guarantee:</span>{' '}
            <span className="text-emerald-900 font-medium">All jobs are vetted. Employers NEVER ask for money or send equipment checks.</span>
          </div>
        </div>

        <button
          onClick={onOpenSafetyHub}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-[11px] shrink-0"
        >
          View Safety Shield & Rules →
        </button>
      </div>

      {/* Search & Hero Filter Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 text-white shadow-xl border border-slate-700/80 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-teal-500/20 text-teal-300 text-xs font-bold px-3 py-1 rounded-full border border-teal-500/30 mb-2">
              <GraduationCap className="w-3.5 h-3.5" /> Open to Zero-Experience Beginners & Trainees
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Remote Internships & Entry Jobs for Beginners
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              From Customer Support and Lead Gen to Executive Assistant, SMM, Graphic Design & Web Ops. Verified global clients offering 1-on-1 mentorship and full onboarding.
            </p>
          </div>

          <button
            onClick={onOpenPostJob}
            className="self-start md:self-auto bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-teal-500/20 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <Zap className="w-4 h-4" /> Post Opportunity (Verified Client)
          </button>
        </div>
      </div>

      {/* Compact Clean Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <JobFilterBar
          filters={pillFilters}
          setFilters={setPillFilters}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedTimezone={selectedTimezone}
          onTimezoneChange={setSelectedTimezone}
          selectedCompType={selectedCompType}
          onCompTypeChange={setSelectedCompType}
          totalResultsCount={filteredJobs.length}
          onReset={() => {
            setPillFilters(INITIAL_FILTER_STATE);
            setSelectedCategory('all');
            setSelectedTimezone('all');
            setSelectedCompType('all');
            setSearchQuery('');
          }}
        />
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-600 font-semibold">
          Showing <span className="text-slate-900 font-bold">{filteredJobs.length}</span> verified beginner remote opportunities
        </p>

        {(selectedCategory !== 'all' || selectedTimezone !== 'all' || selectedCompType !== 'all' || searchQuery || pillFilters.datePosted !== 'all' || pillFilters.department !== 'all' || pillFilters.keywords) && (
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedTimezone('all');
              setSelectedCompType('all');
              setSearchQuery('');
              setPillFilters(INITIAL_FILTER_STATE);
            }}
            className="text-xs text-teal-700 font-semibold hover:underline"
          >
            Clear All Filters
          </button>
        )}
      </div>

      {/* Job Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
        {filteredJobs.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center mx-auto font-bold border border-teal-200">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">No jobs available yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Check back soon for new opportunities.
            </p>
          </div>
        ) : (
          filteredJobs.map(job => (
            <div
              key={job.id}
              className={`bg-white rounded-2xl p-5 shadow-sm border transition-all hover:shadow-md flex flex-col justify-between space-y-4 ${
                job.featured ? 'border-teal-300 ring-1 ring-teal-500/20' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-3">
                
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <img
                      src={job.companyLogo}
                      alt={job.company}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 
                          className="font-bold text-slate-900 text-sm leading-snug hover:text-teal-700 cursor-pointer" 
                          onClick={() => handleOpenModal(job)}
                        >
                          {job.title}
                        </h3>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-semibold text-slate-700">{job.company}</span>
                        {job.isVerifiedSafeClient && (
                          <span
                            title="Employer verification indicates that this business has completed RemotoOps' employer verification process."
                            className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 cursor-help"
                          >
                            <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" /> ✓ Employer Verified
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Globe2 className="w-3 h-3 text-slate-400" /> {job.clientLocation}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Role Category Badge, Job Status, Save Button & Report Flag */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <div className="flex items-center gap-1">
                      {onToggleSaveJob && (
                        <button
                          onClick={() => onToggleSaveJob(job)}
                          title={savedJobIds.includes(job.id) ? "Remove from Saved Jobs" : "Save Job"}
                          className={`p-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1 ${
                            savedJobIds.includes(job.id)
                              ? 'bg-rose-500/10 text-rose-600 border-rose-300'
                              : 'bg-slate-50 text-slate-500 border-slate-200 hover:text-rose-600 hover:bg-rose-50'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${savedJobIds.includes(job.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                          <span className="hidden sm:inline">{savedJobIds.includes(job.id) ? 'Saved' : 'Save'}</span>
                        </button>
                      )}

                      <button
                        onClick={() => onOpenReportModal?.(job.id, job.title, job.company)}
                        title="Report Suspicious Job or Recruiter"
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors text-[10px] flex items-center gap-1"
                      >
                        <Flag className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-200">
                      {ROLE_CATEGORY_LABELS[job.roleCategory] || job.roleCategory}
                    </span>

                    {job.applicationMethod === 'external' ? (
                      <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" /> External Apply
                      </span>
                    ) : (
                      <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-teal-600" /> Direct Apply
                      </span>
                    )}

                    {job.jobStatus && job.jobStatus !== 'OPEN' && (
                      <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-rose-500 text-white uppercase">
                        {job.jobStatus}
                      </span>
                    )}
                  </div>
                </div>

                {/* Zero Exp & Mentorship Callout */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div>
                      <p className="font-bold text-slate-900 text-[11px]">No Experience Required</p>
                      <p className="text-[10px] text-slate-600">Mentor: {job.mentorName} ({job.mentorRole})</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold bg-teal-500 text-slate-950 px-2 py-0.5 rounded-md shadow-sm">
                    100% Trainee Welcome
                  </span>
                </div>

                {/* Description Snippet */}
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {job.description}
                </p>

                {/* Required Tools */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {job.requiredTools.map((tool, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded-md border border-slate-200">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer info & CTA */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                <div>
                  <p className="font-extrabold text-slate-900 text-xs">{job.compensation}</p>
                  <p className="text-[10px] text-slate-500">{job.hoursPerWeek} • {job.timezone}</p>
                </div>

                <button
                  onClick={() => handleOpenModal(job)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1 hover:gap-2"
                >
                  View Details & Apply <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Detailed Role & Application Modal */}
      {activeJobModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 md:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div className="flex gap-4">
                <img
                  src={activeJobModal.companyLogo}
                  alt={activeJobModal.company}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-md shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-extrabold text-slate-900">{activeJobModal.title}</h2>
                    {activeJobModal.isVerifiedSafeClient && (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Safe
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-teal-700 mt-0.5">{activeJobModal.company} • {activeJobModal.clientLocation}</p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mt-2">
                    <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-md">
                      {activeJobModal.compensation}
                    </span>
                    <span>• {activeJobModal.hoursPerWeek}</span>
                    <span>• {activeJobModal.timezone}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenReportModal?.(activeJobModal.id, activeJobModal.title, activeJobModal.company)}
                  title="Report Post"
                  className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors text-xs flex items-center gap-1"
                >
                  <Flag className="w-4 h-4 text-rose-500" /> Report
                </button>

                <button
                  onClick={() => setActiveJobModal(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mentor Overview Card */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
              <img
                src={activeJobModal.clientAvatar}
                alt={activeJobModal.mentorName}
                className="w-12 h-12 rounded-full object-cover border-2 border-amber-300"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-xs">Your Mentor: {activeJobModal.mentorName}</h4>
                  <span className="bg-amber-500 text-white font-extrabold text-[9px] px-2 py-0.5 rounded">1-on-1 Mentorship</span>
                </div>
                <p className="text-xs text-slate-600">{activeJobModal.clientTitle}</p>
                <p className="text-[11px] text-amber-800 mt-0.5 italic">"{activeJobModal.mentorRole}"</p>
              </div>
            </div>

            {/* Overview & Responsibilities */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">Role Summary & Zero-Experience Training</h3>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{activeJobModal.description}</p>
            </div>

            {/* Key Outcomes */}
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Award className="w-4 h-4 text-teal-600" /> Key Skills & Outcomes You Will Learn
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                {activeJobModal.learningOutcomes.map((outcome, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Application Section */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-white">
                    {activeJobModal.applicationMethod === 'external' ? 'Apply on Company Website' : 'Apply Directly on RemotoOps'}
                  </h3>
                  <p className="text-xs text-slate-300">
                    {activeJobModal.applicationMethod === 'external' 
                      ? 'This employer receives applications on their official careers site or ATS portal.' 
                      : 'Beginners welcome! Highlight your passion and willingness to learn.'}
                  </p>
                </div>
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                  activeJobModal.applicationMethod === 'external'
                    ? 'text-sky-300 bg-sky-500/20 border-sky-500/30'
                    : 'text-teal-400 bg-teal-500/20 border-teal-500/30'
                }`}>
                  {activeJobModal.applicationMethod === 'external' ? 'External Application' : 'Direct Apply'}
                </span>
              </div>

              {activeJobModal.jobStatus && activeJobModal.jobStatus !== 'OPEN' ? (
                <div className="bg-rose-500/20 border border-rose-500/40 text-rose-200 p-4 rounded-xl text-center space-y-2">
                  <ShieldAlert className="w-8 h-8 text-rose-400 mx-auto" />
                  <h4 className="font-bold text-white text-sm uppercase">Applications Closed ({activeJobModal.jobStatus})</h4>
                  <p className="text-xs text-slate-300">
                    This job opportunity is currently closed or filled. You can save it to your list to stay updated if it re-opens.
                  </p>
                </div>
              ) : !currentUser?.emailVerified ? (
                <div className="bg-amber-500/20 border border-amber-500/40 text-amber-200 p-4 rounded-xl text-center space-y-2">
                  <ShieldAlert className="w-8 h-8 text-amber-400 mx-auto" />
                  <h4 className="font-bold text-white text-sm">Email Verification Required</h4>
                  <p className="text-xs text-slate-300">
                    You cannot apply for jobs until your email address (<strong className="text-amber-300">{currentUser?.email}</strong>) is verified.
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Please check your inbox / spam folder for the confirmation link.
                  </p>
                  <button
                    type="button"
                    onClick={async () => {
                      if (auth.currentUser) {
                        try {
                          await auth.currentUser.reload();
                          if (auth.currentUser.emailVerified) {
                            await setDoc(doc(db, 'users', auth.currentUser.uid), {
                              emailVerified: true,
                              updatedAt: new Date().toISOString()
                            }, { merge: true });
                            window.location.reload();
                          } else {
                            alert("Your email address has not been verified yet in Firebase. Please check your Inbox or Spam folder for the verification link.");
                          }
                        } catch (err) {
                          console.error("Error checking verification status:", err);
                        }
                      } else {
                        alert("Please log in to verify your email address.");
                      }
                    }}
                    className="mt-2 px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-all inline-flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-slate-950" /> Check Email Verification Status
                  </button>
                </div>
              ) : !((currentUser?.name?.trim() || currentUser?.displayName?.trim()) && currentUser?.professionalTitle?.trim() && currentUser?.location?.trim() && currentUser?.phoneNumber?.trim() && currentUser?.about?.trim() && currentUser?.skills && currentUser.skills.length >= 1) && !currentUser?.isProfileVerified ? (
                <div className="bg-amber-500/10 border border-amber-500/30 text-amber-200 p-5 rounded-xl text-center space-y-2">
                  <UserCheck className="w-8 h-8 text-amber-400 mx-auto" />
                  <h4 className="font-bold text-white text-sm">Complete Your Basic Profile</h4>
                  <p className="text-xs text-slate-300">
                    Complete your basic profile and verify your email before applying.
                  </p>
                  <p className="text-[11px] text-slate-400 max-w-md mx-auto">
                    Required basic fields: Full Name, Professional Title, Location, Phone Number, About Me, and Core Skills. <strong className="text-teal-300 font-semibold">Work experience, portfolio, and resume are completely optional!</strong>
                  </p>
                  {onOpenProfileModal && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveJobModal(null);
                        onOpenProfileModal();
                      }}
                      className="mt-2 px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-all inline-flex items-center gap-1.5"
                    >
                      <UserCheck className="w-4 h-4 text-slate-950" /> Complete My Profile
                    </button>
                  )}
                </div>
              ) : activeJobModal.applicationMethod === 'external' ? (
                <div className="bg-sky-950/80 border border-sky-800 p-5 rounded-xl space-y-3">
                  <div className="flex items-start gap-3">
                    <ExternalLink className="w-6 h-6 text-sky-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">External Employer Application Link</h4>
                      <p className="text-xs text-sky-200 leading-relaxed">
                        You will continue your application on the employer's website.
                      </p>
                      <p className="text-[11px] font-mono text-sky-400 underline break-all">
                        {activeJobModal.externalApplyUrl || 'https://company.com/careers'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (activeJobModal.externalApplyUrl) {
                          if (onExternalApply) {
                            onExternalApply(activeJobModal);
                          } else {
                            window.open(activeJobModal.externalApplyUrl, '_blank', 'noopener,noreferrer');
                          }
                          onApply(activeJobModal, 'Applied via Company Website', []);
                          setIsSubmitted(true);
                        } else {
                          alert("No external link specified for this job.");
                        }
                      }}
                      className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" /> Apply on Company Website ↗
                    </button>
                    <p className="text-[10px] text-slate-400 text-center mt-2">
                      RemotoOps does not submit forms on external sites. We record this redirect to track your application history.
                    </p>
                  </div>
                </div>
              ) : isSubmitted ? (
                <div className="bg-teal-500/20 border border-teal-500/40 text-teal-200 p-4 rounded-xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-teal-400 mx-auto" />
                  <h4 className="font-bold text-white text-sm">Application Submitted Successfully!</h4>
                  <p className="text-xs text-slate-300">The hiring mentor ({activeJobModal.mentorName}) has received your pitch.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitApplication} className="space-y-4">
                  
                  {/* Select Tool Experience */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Select Tools You Have Practiced Or Are Eager to Learn:</label>
                    <div className="flex flex-wrap gap-2">
                      {activeJobModal.requiredTools.map((tool) => (
                        <button
                          type="button"
                          key={tool}
                          onClick={() => handleToolToggle(tool)}
                          className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                            selectedTools.includes(tool)
                              ? 'bg-teal-500 text-slate-950 font-bold border-teal-400'
                              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                          }`}
                        >
                          {selectedTools.includes(tool) ? '✓ ' : '+ '}{tool}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cover Pitch */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-300">Your Remote Pitch / Motivation Statement:</label>
                      <button
                        type="button"
                        onClick={handleRunAiPitchAnalysis}
                        disabled={isAnalyzing || !applicantPitch.trim()}
                        className="text-[11px] font-bold text-teal-300 hover:text-teal-200 flex items-center gap-1 bg-teal-500/20 px-2.5 py-1 rounded-md border border-teal-500/30 disabled:opacity-40"
                      >
                        <Sparkles className="w-3 h-3 text-teal-400" />
                        {isAnalyzing ? 'Analyzing with Gemini...' : 'Polish Pitch with AI'}
                      </button>
                    </div>

                    <textarea
                      rows={4}
                      value={applicantPitch}
                      onChange={(e) => setApplicantPitch(e.target.value)}
                      placeholder="e.g. Hi! I am a passionate career starter with zero corporate experience, but I have built self-taught SOPs in Google Workspace and Canva. I am flexible, highly organized, and eager to learn under your mentorship..."
                      className="w-full bg-slate-800 border border-slate-700 text-xs text-slate-100 placeholder-slate-400 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  {/* AI Feedback Box */}
                  {aiFeedback && (
                    <div className="bg-slate-800/90 border border-teal-500/50 rounded-xl p-3.5 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-teal-400 font-bold">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4" /> Gemini AI Pitch Feedback
                        </span>
                        <span className="bg-teal-500 text-slate-950 px-2 py-0.5 rounded font-black">
                          Score: {aiFeedback.score}/100
                        </span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        <strong className="text-teal-300">Strengths:</strong> {aiFeedback.strengths?.join(', ')}
                      </p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!applicantPitch.trim()}
                    className="w-full bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 font-bold text-xs py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" /> Submit Application Pitch
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
