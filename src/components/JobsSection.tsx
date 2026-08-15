import React, { useState, useRef } from 'react';
import logoImg from '../assets/images/remotoops_logo.png';
import heroPhoto from '../assets/images/remote_pro_hero_1786683107206.jpg';
import { JobPost, RoleCategory, TimezoneOverlap, CompensationType, ROLE_CATEGORY_LABELS, UserAccount } from '../types';
import { 
  Search, 
  MapPin, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  Globe2, 
  Briefcase, 
  Send, 
  X, 
  ShieldCheck, 
  Flag, 
  ChevronRight, 
  ExternalLink, 
  Building2,
  Bell,
  FileText,
  Upload,
  Bookmark,
  BookmarkCheck,
  Check,
  Compass,
  FileCheck2,
  ShieldAlert,
  ArrowRight,
  Sparkles
} from 'lucide-react';

import { uploadResumeFile } from '../lib/resumeUploader';

interface JobsSectionProps {
  jobs: JobPost[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentUser: UserAccount | null;
  onOpenAuthModal: (mode?: 'login' | 'signup') => void;
  onApply: (job: JobPost, pitch: string, tools: string[], candidateDetails?: any) => void;
  onOpenPostJob: () => void;
  onOpenReportModal?: (jobId?: string, jobTitle?: string, company?: string) => void;
  onOpenSafetyHub?: () => void;
  onOpenAccountModal?: () => void;
  onOpenAtsResume?: () => void;
  onOpenInterviewGuide?: () => void;
  savedJobIds?: string[];
  onToggleSaveJob?: (job: JobPost) => void;
  onSaveSearch?: (searchName: string, query: string, filters: any) => void;
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
  onOpenReportModal,
  onOpenSafetyHub,
  onOpenAccountModal,
  onOpenAtsResume,
  onOpenInterviewGuide,
  savedJobIds = [],
  onToggleSaveJob,
  onSaveSearch,
  onExternalApply
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedJobType, setSelectedJobType] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [activeJobModal, setActiveJobModal] = useState<JobPost | null>(null);

  const jobsListRef = useRef<HTMLDivElement>(null);

  // Application form state inside modal
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantLocation, setApplicantLocation] = useState('');
  const [applicantResumeUrl, setApplicantResumeUrl] = useState('');
  const [applicantResumeFileName, setApplicantResumeFileName] = useState('');
  const [applicantPortfolio, setApplicantPortfolio] = useState('');
  const [applicantLinkedin, setApplicantLinkedin] = useState('');
  const [applicantPitch, setApplicantPitch] = useState('');
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [resumeUploadProgress, setResumeUploadProgress] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [saveSearchSuccess, setSaveSearchSuccess] = useState(false);

  // Smooth scroll to jobs section
  const handleScrollToJobs = () => {
    jobsListRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Pre-fill application form when opening a job
  const handleOpenModal = (job: JobPost) => {
    setActiveJobModal(job);
    setApplicantName(currentUser?.name || '');
    setApplicantEmail(currentUser?.email || '');
    setApplicantPhone(currentUser?.phoneNumber || '');
    setApplicantLocation(currentUser?.location || '100% Remote');
    setApplicantResumeUrl(currentUser?.resumeUrl || '');
    setApplicantResumeFileName(currentUser?.resumeFileName || 'Saved Resume');
    setApplicantPortfolio(currentUser?.portfolioUrl || '');
    setApplicantLinkedin(currentUser?.linkedinUrl || '');
    setApplicantPitch('');
    setSelectedTools(job.requiredTools ? job.requiredTools.slice(0, 3) : []);
    setIsSubmitted(false);
    setResumeUploadProgress(0);
  };

  // Filter jobs logic
  const filteredJobs = jobs.filter(job => {
    // Category filter
    if (selectedCategory !== 'all' && job.roleCategory !== selectedCategory) {
      return false;
    }

    // Job Type filter
    if (selectedJobType !== 'all') {
      const lowerHours = (job.hoursPerWeek || '').toLowerCase();
      if (selectedJobType === 'full_time' && !lowerHours.includes('full')) return false;
      if (selectedJobType === 'part_time' && !lowerHours.includes('part')) return false;
      if (selectedJobType === 'contract' && !lowerHours.includes('contract') && !lowerHours.includes('freelance')) return false;
      if (selectedJobType === 'internship' && !job.isOpenToZeroExperience) return false;
    }

    // Location / Timezone filter
    if (selectedLocation !== 'all') {
      const loc = (job.clientLocation || job.timezone || '').toLowerCase();
      if (!loc.includes(selectedLocation.toLowerCase())) return false;
    }

    // Search Query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = job.title.toLowerCase().includes(q);
      const matchCompany = job.company.toLowerCase().includes(q);
      const matchDesc = job.description.toLowerCase().includes(q);
      const matchTools = job.requiredTools?.some(t => t.toLowerCase().includes(q));
      const matchLocation = (job.clientLocation || '').toLowerCase().includes(q);
      if (!matchTitle && !matchCompany && !matchDesc && !matchTools && !matchLocation) {
        return false;
      }
    }

    return true;
  });

  const handleToolToggle = (tool: string) => {
    if (selectedTools.includes(tool)) {
      setSelectedTools(selectedTools.filter(t => t !== tool));
    } else {
      setSelectedTools([...selectedTools, tool]);
    }
  };

  const handleResumeFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!currentUser?.id) {
      alert("Please sign in or register to upload your resume.");
      onOpenAuthModal('login');
      return;
    }

    try {
      setIsUploadingResume(true);
      setResumeUploadProgress(0);
      const uploadRes = await uploadResumeFile(currentUser.id, file, (progress) => {
        setResumeUploadProgress(progress);
      });
      setApplicantResumeUrl(uploadRes.url);
      setApplicantResumeFileName(uploadRes.fileName);
    } catch (err: any) {
      alert(err.message || "Failed to upload resume. Please check your file and try again.");
    } finally {
      setIsUploadingResume(false);
    }
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeJobModal) return;

    if (!currentUser?.id) {
      alert("Please sign in to submit your job application.");
      onOpenAuthModal('login');
      return;
    }

    if (!applicantResumeUrl.trim()) {
      alert("Please upload your resume before submitting your application.");
      return;
    }

    const candidateDetails = {
      name: applicantName.trim() || currentUser.name || 'Applicant',
      email: applicantEmail.trim() || currentUser.email || '',
      phone: applicantPhone.trim() || currentUser.phoneNumber || '',
      location: applicantLocation.trim() || currentUser.location || '',
      resumeUrl: applicantResumeUrl.trim(),
      resumeFileName: applicantResumeFileName.trim() || 'Candidate Resume',
      portfolioUrl: applicantPortfolio.trim() || currentUser.portfolioUrl || '',
      linkedinUrl: applicantLinkedin.trim() || currentUser.linkedinUrl || ''
    };

    onApply(activeJobModal, applicantPitch, selectedTools, candidateDetails);
    setIsSubmitted(true);
    setTimeout(() => {
      setActiveJobModal(null);
      setIsSubmitted(false);
    }, 1800);
  };

  const handleSaveCurrentSearch = () => {
    if (onSaveSearch) {
      const searchName = searchQuery.trim() 
        ? `Search: "${searchQuery.trim()}"`
        : (selectedCategory !== 'all' ? `${ROLE_CATEGORY_LABELS[selectedCategory as RoleCategory] || selectedCategory} Jobs` : 'Remote Job Alert');
      
      onSaveSearch(searchName, searchQuery, {
        category: selectedCategory,
        jobType: selectedJobType,
        location: selectedLocation
      });
      setSaveSearchSuccess(true);
      setTimeout(() => setSaveSearchSuccess(false), 2500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-in fade-in duration-200">
      
      {/* 1. HOMEPAGE HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50/95 via-sky-50/70 to-purple-50/85 rounded-3xl p-6 sm:p-10 lg:p-12 border border-indigo-100/90 shadow-md shadow-indigo-100/30">
        {/* Subtle Ambient Background Elements */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-indigo-200/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-6 right-6 w-32 h-32 bg-sky-200/30 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* LEFT COLUMN: Large RemotoOps Logo, Headline, Supporting Copy, Buttons */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Large RemotoOps Logo / Brand Header */}
            <div 
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-4 cursor-pointer group"
              title="RemotoOps Remote Work Ecosystem"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-white border border-indigo-100 shadow-md p-1.5 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                <img 
                  src={logoImg} 
                  alt="RemotoOps" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain" 
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">RemotoOps</span>
                  <span className="bg-indigo-100 text-indigo-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-indigo-200">
                    Official
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-indigo-700">Remote Work & Hiring Ecosystem</p>
              </div>
            </div>

            {/* Main Headline & Supporting Text */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-[1.15]">
                Find a remote job <br className="hidden sm:inline" />
                <span className="text-indigo-600">and apply in minutes.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-xl">
                Thousands of remote jobs. Simple process. <br className="hidden sm:inline" />
                Real opportunities.
              </p>
            </div>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                onClick={handleScrollToJobs}
                className="px-6 sm:px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2.5 group"
              >
                <Search className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                <span>BROWSE JOBS</span>
              </button>

              <button
                onClick={() => {
                  if (currentUser && onOpenAccountModal) {
                    onOpenAccountModal();
                  } else {
                    onOpenAuthModal('signup');
                  }
                }}
                className="px-6 sm:px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-900 font-extrabold text-xs sm:text-sm rounded-2xl border border-slate-300 shadow-xs transition-all flex items-center gap-2.5 hover:border-slate-400"
              >
                <Upload className="w-5 h-5 text-indigo-600" />
                <span>UPLOAD RESUME</span>
              </button>
            </div>

            {/* Quick Badges */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs font-semibold text-slate-600 pt-2 border-t border-indigo-100">
              <span className="flex items-center gap-1.5 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-teal-600" /> 100% Free for Job Seekers
              </span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <ShieldCheck className="w-4 h-4 text-indigo-600" /> Verified Remote Employers
              </span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <Sparkles className="w-4 h-4 text-amber-500" /> Entry-Level Friendly
              </span>
            </div>

          </div>

          {/* RIGHT COLUMN: Realistic Professional Remote-Work Photograph Card */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            <div className="relative w-full max-w-md bg-white/95 backdrop-blur-xs rounded-3xl p-3 sm:p-4 border border-indigo-100/90 shadow-xl shadow-indigo-100/50 group">
              <img 
                src={heroPhoto} 
                alt="Professional Working Remotely"
                referrerPolicy="no-referrer"
                className="w-full h-auto max-h-72 sm:max-h-80 object-cover rounded-2xl group-hover:scale-[1.01] transition-transform duration-300 shadow-xs"
              />
              {/* Status Pill */}
              <div className="absolute -bottom-3 left-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-indigo-100 shadow-md flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                    <Briefcase className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-slate-900">Active Openings</p>
                    <p className="text-[10px] text-slate-500 font-medium">{jobs.length}+ Verified Remote Positions</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                  Live Today
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. SEARCH AND FILTER BAR */}
      <section className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        
        {/* Main Search Input */}
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search jobs, skills, or companies..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Dropdown Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
          
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:border-teal-500 text-xs"
          >
            <option value="all">All Categories</option>
            <option value="executive_assistant">Executive Assistant (EA)</option>
            <option value="admin_ops">Admin & Virtual Operations</option>
            <option value="social_media_manager">Social Media Manager (SMM)</option>
            <option value="customer_support">Customer Support & Chat</option>
            <option value="data_lead_gen">Data Entry & Lead Gen</option>
            <option value="creative_design">Graphic Design & Video</option>
            <option value="tech_web_ops">Tech, Web & Automation</option>
            <option value="content_writing">Content & Copywriting</option>
            <option value="ecom_bookkeeping">E-commerce & Bookkeeping</option>
            <option value="community_mod">Community & Discord Mod</option>
            <option value="general">General Remote</option>
          </select>

          {/* Job Type Dropdown */}
          <select
            value={selectedJobType}
            onChange={(e) => setSelectedJobType(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:border-teal-500 text-xs"
          >
            <option value="all">All Job Types</option>
            <option value="full_time">Full-time (40 hrs/wk)</option>
            <option value="part_time">Part-time (20 hrs/wk)</option>
            <option value="contract">Contract / Freelance</option>
            <option value="internship">Entry Level / Internship</option>
          </select>

          {/* Location / Timezone Dropdown */}
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:border-teal-500 text-xs"
          >
            <option value="all">All Locations</option>
            <option value="Remote">100% Remote / Worldwide</option>
            <option value="EST">EST (UTC-5)</option>
            <option value="PST">PST (UTC-8)</option>
            <option value="GMT">GMT / BST (UTC+0)</option>
            <option value="CET">CET (UTC+1)</option>
            <option value="SGT">SGT / PHT (UTC+8)</option>
          </select>

          {/* Reset Filters / Action Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedJobType('all');
                setSelectedLocation('all');
                setSearchQuery('');
              }}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-3 rounded-xl transition-all text-center text-xs"
            >
              Reset Filters
            </button>
            
            {onSaveSearch && (
              <button
                onClick={handleSaveCurrentSearch}
                title="Create Job Alert from this filter"
                className={`p-2 rounded-xl border transition-all ${
                  saveSearchSuccess
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100'
                }`}
              >
                {saveSearchSuccess ? <Check className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
              </button>
            )}
          </div>

        </div>

      </section>

      {/* 3. TWO COLUMN MAIN AREA: FEATURED REMOTE JOBS (LEFT) & SIDEBAR WIDGETS (RIGHT) */}
      <div ref={jobsListRef} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT / MAIN COLUMN: FEATURED REMOTE JOBS (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="flex items-center justify-between pb-1">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Featured Remote Jobs
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {filteredJobs.length} active positions available
              </p>
            </div>

            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedJobType('all');
                setSelectedLocation('all');
                setSearchQuery('');
              }}
              className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 transition-colors"
            >
              <span>View all jobs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Job Cards List */}
          {filteredJobs.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">
                {jobs.length === 0 ? 'No jobs available yet.' : 'No remote jobs match your filters'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {jobs.length === 0 
                  ? 'New verified remote job listings will appear here as soon as employers publish them.'
                  : 'Try searching for broader keywords, clearing specific filters, or checking back soon.'}
              </p>
              {jobs.length > 0 && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedJobType('all');
                    setSelectedLocation('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 bg-teal-600 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredJobs.map((job) => {
                const isSaved = savedJobIds.includes(job.id);
                const isExternal = job.applicationMethod === 'external';

                return (
                  <div
                    key={job.id}
                    className="bg-white rounded-xl p-5 border border-slate-200 hover:border-teal-400 hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div className="flex items-start gap-4">
                      
                      {/* Company Avatar / Logo Badge */}
                      <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 shrink-0 text-base overflow-hidden">
                        {job.companyLogo ? (
                          <img 
                            src={job.companyLogo} 
                            alt={job.company} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <span className="text-teal-700 font-black">{job.company.charAt(0).toUpperCase()}</span>
                        )}
                      </div>

                      {/* Job Title & Details */}
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 
                            onClick={() => handleOpenModal(job)}
                            className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-teal-700 transition-colors cursor-pointer"
                          >
                            {job.title}
                          </h3>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 font-medium">
                          <span className="font-bold text-slate-800 flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            {job.company}
                          </span>
                          <span className="flex items-center gap-1 text-slate-500">
                            <Globe2 className="w-3.5 h-3.5 text-teal-600" />
                            {job.clientLocation || '100% Remote'}
                          </span>
                          {job.compensation && (
                            <span className="text-emerald-700 font-bold">
                              {job.compensation}
                            </span>
                          )}
                        </div>

                        {/* Badges / Tags */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
                          <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md font-medium border border-slate-200">
                            {job.hoursPerWeek || 'Full-time'}
                          </span>
                          <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md font-medium border border-slate-200">
                            {job.experienceLevelNum === 'no_experience' || job.isOpenToZeroExperience
                              ? 'Open to Beginners'
                              : '1+ Years Exp'}
                          </span>
                          <span className="text-slate-400 text-[10px] ml-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {job.postedDate || 'Recent'}
                          </span>
                        </div>
                      </div>

                    </div>

                    {/* Actions: Apply & Save */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 w-full sm:w-auto justify-between sm:justify-end">
                      
                      {/* Save / Bookmark Button */}
                      {onToggleSaveJob && (
                        <button
                          onClick={() => onToggleSaveJob(job)}
                          className={`p-2.5 rounded-xl border transition-colors ${
                            isSaved
                              ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                              : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                          }`}
                          title={isSaved ? "Saved in My Saved Jobs" : "Save Job for Later"}
                        >
                          {isSaved ? (
                            <BookmarkCheck className="w-5 h-5 fill-indigo-600 text-indigo-600" />
                          ) : (
                            <Bookmark className="w-5 h-5" />
                          )}
                        </button>
                      )}

                      {/* Apply Now Button */}
                      {isExternal ? (
                        <button
                          onClick={() => {
                            if (onExternalApply) {
                              onExternalApply(job);
                            } else if (job.externalApplyUrl) {
                              window.open(job.externalApplyUrl, '_blank', 'noopener,noreferrer');
                            }
                          }}
                          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                        >
                          <span>Apply</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenModal(job)}
                          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                        >
                          <span>Apply Now</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}

                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: SIDEBAR WIDGETS (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Quick Links Widget */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900">Quick Links</h3>
            
            <div className="space-y-1.5">
              
              <button
                onClick={handleSaveCurrentSearch}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors border border-slate-100"
              >
                <div className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4 text-teal-600" />
                  <span>Create Job Alert</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  if (onOpenAtsResume) onOpenAtsResume();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors border border-slate-100"
              >
                <div className="flex items-center gap-2.5">
                  <FileCheck2 className="w-4 h-4 text-teal-600" />
                  <span>Resume Tips</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  if (onOpenInterviewGuide) onOpenInterviewGuide();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors border border-slate-100"
              >
                <div className="flex items-center gap-2.5">
                  <Compass className="w-4 h-4 text-teal-600" />
                  <span>Application Guide</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

            </div>
          </div>

          {/* Start Your Job Search Widget */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-5 border border-slate-800 shadow-sm space-y-3">
            <h3 className="font-extrabold text-sm text-white">Start Your Job Search</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Upload your resume and let remote employers find you for fast direct interviews.
            </p>
            
            <button
              onClick={() => {
                if (currentUser && onOpenAccountModal) {
                  onOpenAccountModal();
                } else {
                  onOpenAuthModal('signup');
                }
              }}
              className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <Upload className="w-3.5 h-3.5 text-slate-950" />
              <span>Upload Resume</span>
            </button>
          </div>

          {/* Anti-Scam Shield Card */}
          {onOpenSafetyHub && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2 text-emerald-950">
              <div className="flex items-center gap-2 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Anti-Scam Verified Jobs</span>
              </div>
              <p className="text-[11px] text-emerald-900 leading-relaxed">
                Zero candidate fees guaranteed. We verify all client identities before listings go live.
              </p>
              <button
                onClick={onOpenSafetyHub}
                className="text-[11px] font-bold text-emerald-800 hover:underline flex items-center gap-1"
              >
                Learn about scam prevention <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}

        </div>

      </div>

      {/* 4. BOTTOM BENEFITS SECTION (4 COLUMNS) */}
      <section className="pt-6 border-t border-slate-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: 100% Remote */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <Globe2 className="w-5 h-5 text-teal-600" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900">100% Remote</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Work from anywhere in the world with async flexibility.
            </p>
          </div>

          {/* Card 2: Easy Application */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <Briefcase className="w-5 h-5 text-indigo-600" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900">Easy Application</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Apply in just a few simple steps with pre-filled profiles.
            </p>
          </div>

          {/* Card 3: Secure & Safe */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900">Secure & Safe</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your data is protected and scam-free opportunities verified.
            </p>
          </div>

          {/* Card 4: Real Opportunities */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5 text-emerald-600" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900">Real Opportunities</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Verified employers and genuine remote jobs for all experience levels.
            </p>
          </div>

        </div>
      </section>

      {/* JOB DETAILS & FAST APPLICATION MODAL */}
      {activeJobModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
            
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-200 gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-0.5 rounded-md">
                    {ROLE_CATEGORY_LABELS[activeJobModal.roleCategory] || activeJobModal.roleCategory}
                  </span>
                  <span className="text-xs text-emerald-700 font-bold">
                    {activeJobModal.compensation}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {activeJobModal.title}
                </h2>
                <p className="text-xs text-slate-600 font-medium flex items-center gap-2">
                  <span>{activeJobModal.company}</span>
                  <span>•</span>
                  <span>{activeJobModal.clientLocation || '100% Remote'}</span>
                  <span>•</span>
                  <span>{activeJobModal.hoursPerWeek || 'Full-time'}</span>
                </p>
              </div>

              <button
                onClick={() => setActiveJobModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Submitted Success Notice */}
            {isSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-6 rounded-2xl text-center space-y-2 animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h3 className="font-extrabold text-base">Application Submitted Successfully!</h3>
                <p className="text-xs text-emerald-700">
                  The hiring team at {activeJobModal.company} has received your application and will review it shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitApplication} className="space-y-4 text-xs">
                
                {/* Job Description Brief */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs">About this position:</h4>
                  <p className="text-slate-600 leading-relaxed text-xs">
                    {activeJobModal.description || "Exciting remote opportunity with direct mentorship and flexible asynchronous workflows."}
                  </p>
                </div>

                {/* Candidate Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-800">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Rivera"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-800">Your Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="alex@example.com"
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                    />
                  </div>
                </div>

                {/* Resume Upload / Link */}
                <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-900 text-xs">Resume / CV</label>
                    {applicantResumeUrl && (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {applicantResumeFileName ? `${applicantResumeFileName} (Attached)` : 'Resume Attached'}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <label className="w-full sm:w-auto bg-white border border-slate-300 hover:border-teal-500 text-slate-700 font-bold px-4 py-2 rounded-xl cursor-pointer text-center text-xs flex items-center justify-center gap-1.5 transition-colors shrink-0">
                      <Upload className="w-3.5 h-3.5 text-teal-600" />
                      <span>{isUploadingResume ? `Uploading ${resumeUploadProgress}%` : 'Upload PDF/Doc'}</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleResumeFileUpload}
                        disabled={isUploadingResume}
                        className="sr-only"
                      />
                    </label>

                    <input
                      type="url"
                      placeholder="Or paste resume link (Google Drive / Dropbox / Portfolio)"
                      value={applicantResumeUrl}
                      onChange={(e) => setApplicantResumeUrl(e.target.value)}
                      className="flex-1 w-full bg-white border border-slate-300 rounded-xl p-2 text-slate-900 text-xs focus:outline-none font-medium"
                    />
                  </div>

                  {isUploadingResume && (
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-teal-600 h-full transition-all duration-200"
                        style={{ width: `${resumeUploadProgress}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Quick Pitch / Cover Note */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">Quick Introduction / Cover Pitch:</label>
                  <textarea
                    rows={3}
                    value={applicantPitch}
                    onChange={(e) => setApplicantPitch(e.target.value)}
                    placeholder="Share why you're a great fit for this remote role and what tools you know..."
                    className="w-full bg-white border border-slate-300 rounded-2xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-xs"
                  />
                </div>

                {/* Report Scam Link */}
                {onOpenReportModal && (
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>RemotoOps 100% Free Applicant Protection</span>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveJobModal(null);
                        onOpenReportModal(activeJobModal.id, activeJobModal.title, activeJobModal.company);
                      }}
                      className="text-slate-400 hover:text-rose-600 flex items-center gap-1 underline"
                    >
                      <Flag className="w-3 h-3" /> Report suspicious listing
                    </button>
                  </div>
                )}

                {/* Submit Application Button */}
                <button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Submit Application to {activeJobModal.company}
                </button>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
