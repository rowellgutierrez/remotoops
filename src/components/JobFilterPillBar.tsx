import React, { useState, useRef, useEffect } from 'react';
import { 
  SlidersHorizontal, 
  ChevronDown, 
  X, 
  Check, 
  Search, 
  Sparkles, 
  Calendar, 
  Briefcase, 
  DollarSign, 
  GraduationCap, 
  ShieldCheck, 
  Globe2, 
  Building2, 
  Clock, 
  Award,
  Layers,
  MapPin,
  Users,
  RotateCcw
} from 'lucide-react';

export interface FilterState {
  datePosted: string;
  applyProcess: string;
  excludeJobs: string[];
  activityOutcome: string;
  department: string;
  keywords: string;
  experience: string;
  commitment: string;
  minSalary: number;
  benefits: string[];
  education: string;
  certifications: string[];
  securityClearance: string;
  languages: string[];
  encouragedToApply: string[];
  shiftSchedule: string;
  travelRequirement: string;
  companyName: string;
  industry: string;
  stageFunding: string;
  companySize: string;
  foundingYear: string;
}

export const INITIAL_FILTER_STATE: FilterState = {
  datePosted: 'all',
  applyProcess: 'all',
  excludeJobs: [],
  activityOutcome: 'all',
  department: 'all',
  keywords: '',
  experience: 'all',
  commitment: 'all',
  minSalary: 0,
  benefits: [],
  education: 'all',
  certifications: [],
  securityClearance: 'all',
  languages: [],
  encouragedToApply: [],
  shiftSchedule: 'all',
  travelRequirement: 'all',
  companyName: '',
  industry: 'all',
  stageFunding: 'all',
  companySize: 'all',
  foundingYear: 'all'
};

interface JobFilterPillBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  totalResultsCount: number;
  onReset: () => void;
}

export const JobFilterPillBar: React.FC<JobFilterPillBarProps> = ({
  filters,
  setFilters,
  totalResultsCount,
  onReset
}) => {
  const [activePopover, setActivePopover] = useState<string | null>(null);
  const [isMasterDrawerOpen, setIsMasterDrawerOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close popovers on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActivePopover(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Count total active filters
  const getActiveCount = (): number => {
    let count = 0;
    if (filters.datePosted !== 'all') count++;
    if (filters.applyProcess !== 'all') count++;
    if (filters.excludeJobs.length > 0) count += filters.excludeJobs.length;
    if (filters.activityOutcome !== 'all') count++;
    if (filters.department !== 'all') count++;
    if (filters.keywords.trim()) count++;
    if (filters.experience !== 'all') count++;
    if (filters.commitment !== 'all') count++;
    if (filters.minSalary > 0) count++;
    if (filters.benefits.length > 0) count += filters.benefits.length;
    if (filters.education !== 'all') count++;
    if (filters.certifications.length > 0) count += filters.certifications.length;
    if (filters.securityClearance !== 'all') count++;
    if (filters.languages.length > 0) count += filters.languages.length;
    if (filters.encouragedToApply.length > 0) count += filters.encouragedToApply.length;
    if (filters.shiftSchedule !== 'all') count++;
    if (filters.travelRequirement !== 'all') count++;
    if (filters.companyName.trim()) count++;
    if (filters.industry !== 'all') count++;
    if (filters.stageFunding !== 'all') count++;
    if (filters.companySize !== 'all') count++;
    if (filters.foundingYear !== 'all') count++;
    return count;
  };

  const activeCount = getActiveCount();

  const toggleArrayFilter = (key: keyof FilterState, value: string) => {
    setFilters((prev) => {
      const arr = (prev[key] as string[]) || [];
      const updated = arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value];
      return { ...prev, [key]: updated };
    });
  };

  // Helper for dynamic active labels on pills
  const getActiveLabel = (id: string): string | null => {
    switch (id) {
      case 'datePosted':
        if (filters.datePosted === '24h') return 'Past 24 Hours';
        if (filters.datePosted === '3d') return 'Past 3 Days';
        if (filters.datePosted === '7d') return 'Past Week';
        if (filters.datePosted === '30d') return 'Past Month';
        return null;
      case 'applyProcess':
        if (filters.applyProcess === 'direct_pitch') return 'Direct Pitch';
        if (filters.applyProcess === 'easy_apply') return '1-Click Apply';
        if (filters.applyProcess === 'external_portal') return 'Company Portal';
        return null;
      case 'excludeJobs':
        return filters.excludeJobs.length > 0 ? `${filters.excludeJobs.length} Excluded` : null;
      case 'activityOutcome':
        if (filters.activityOutcome === 'active_today') return 'Active Today';
        if (filters.activityOutcome === 'high_response') return 'High Response Rate';
        if (filters.activityOutcome === 'interviewing_now') return 'Interviewing Now';
        return null;
      case 'department':
        if (filters.department === 'executive_assistant') return 'Exec Assistance';
        if (filters.department === 'customer_care') return 'Customer Support';
        if (filters.department === 'marketing_smm') return 'Marketing & SMM';
        if (filters.department === 'design_media') return 'Design & Media';
        if (filters.department === 'tech_web') return 'IT & Software';
        if (filters.department === 'sales_leadgen') return 'Sales & Leads';
        return null;
      case 'keywords':
        return filters.keywords.trim() ? `"${filters.keywords}"` : null;
      case 'experience':
        if (filters.experience === 'entry') return 'Entry Level';
        if (filters.experience === 'mid') return 'Mid Level';
        if (filters.experience === 'senior') return 'Senior Level';
        return null;
      case 'commitment':
        if (filters.commitment === 'full_time') return 'Full-Time';
        if (filters.commitment === 'part_time') return 'Part-Time';
        if (filters.commitment === 'flexible') return 'Flexible';
        return null;
      case 'salary':
        return filters.minSalary > 0 ? `$${filters.minSalary}+/mo` : null;
      case 'benefits':
        return filters.benefits.length > 0 ? `${filters.benefits.length} Selected` : null;
      case 'education':
        if (filters.education === 'high_school') return 'High School';
        if (filters.education === 'bachelors') return "Bachelor's";
        if (filters.education === 'bootcamp') return 'Bootcamp / Self-Taught';
        return null;
      case 'certifications':
        return filters.certifications.length > 0 ? `${filters.certifications.length} Selected` : null;
      case 'securityClearance':
        if (filters.securityClearance === 'kyc_verified') return 'Verified Facial KYC';
        if (filters.securityClearance === 'background_checked') return 'Background Checked';
        return null;
      case 'languages':
        return filters.languages.length > 0 ? `${filters.languages.length} Languages` : null;
      case 'encouragedToApply':
        return filters.encouragedToApply.length > 0 ? `${filters.encouragedToApply.length} Selected` : null;
      case 'shiftSchedule':
        if (filters.shiftSchedule === 'day_shift') return 'Day Shift (Local)';
        if (filters.shiftSchedule === 'night_shift') return 'Night Shift (US)';
        if (filters.shiftSchedule === 'flexible_async') return '100% Async';
        return null;
      case 'travelRequirement':
        if (filters.travelRequirement === 'no_travel') return '100% Remote';
        if (filters.travelRequirement === 'occasional') return 'Occasional Retreats';
        return null;
      case 'companyName':
        return filters.companyName.trim() ? `"${filters.companyName}"` : null;
      case 'industry':
        if (filters.industry === 'ecommerce') return 'E-commerce';
        if (filters.industry === 'saas_software') return 'SaaS & Tech';
        if (filters.industry === 'digital_agency') return 'Digital Agency';
        if (filters.industry === 'finance_fintech') return 'Fintech';
        return null;
      case 'stageFunding':
        if (filters.stageFunding === 'bootstrapped') return 'Bootstrapped';
        if (filters.stageFunding === 'seed') return 'Seed Stage';
        if (filters.stageFunding === 'growth') return 'Growth Series A+';
        return null;
      case 'companySize':
        if (filters.companySize === '1-10') return '1-10 Team';
        if (filters.companySize === '11-50') return '11-50 Team';
        if (filters.companySize === '51-200') return '51-200 Team';
        if (filters.companySize === '200+') return '200+ Enterprise';
        return null;
      case 'foundingYear':
        if (filters.foundingYear === '2020+') return '2020 or Later';
        if (filters.foundingYear === '2015-2020') return '2015 - 2020';
        if (filters.foundingYear === 'pre-2015') return 'Pre-2015';
        return null;
      default:
        return null;
    }
  };

  const renderPill = (
    id: string,
    defaultLabel: string,
    hasNewBadge: boolean = false,
    popoverContent: React.ReactNode
  ) => {
    const activeText = getActiveLabel(id);
    const isActive = activeText !== null;
    const isPopoverOpen = activePopover === id;

    return (
      <div className="relative inline-block">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setActivePopover(isPopoverOpen ? null : id);
          }}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all flex items-center gap-1.5 shadow-sm ${
            isActive
              ? 'bg-slate-900 text-teal-300 border-teal-500 ring-2 ring-teal-400/20'
              : isPopoverOpen
              ? 'bg-slate-100 text-slate-900 border-teal-500 ring-2 ring-teal-400/20'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400'
          }`}
        >
          <span>{defaultLabel}</span>
          {activeText && (
            <span className="font-extrabold text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded-full text-[10px]">
              {activeText}
            </span>
          )}
          {hasNewBadge && !activeText && (
            <span className="bg-pink-100 text-pink-600 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-wider">
              New
            </span>
          )}
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isPopoverOpen ? 'rotate-180 text-teal-600' : ''}`} />
        </button>

        {/* POPUP SELECTION DROPDOWN MENU */}
        {isPopoverOpen && (
          <div 
            onClick={(e) => e.stopPropagation()}
            className="absolute left-0 top-full mt-2 w-60 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150"
          >
            {popoverContent}
          </div>
        )}
      </div>
    );
  };

  return (
    <div ref={containerRef} className="relative space-y-3">
      
      {/* WRAPPED FLEX PILL CONTAINER (EXACT MATCH FOR USER SCREENSHOT) */}
      <div className="flex flex-wrap items-center gap-2 text-slate-800">
        
        {/* Main Filters Button */}
        <button
          type="button"
          onClick={() => setIsMasterDrawerOpen(true)}
          className="px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap bg-slate-900 text-white border border-slate-900 hover:bg-slate-800 transition-all flex items-center gap-2 shadow-md shrink-0"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-teal-400" />
          <span>Filters</span>
          {activeCount > 0 && (
            <span className="bg-teal-400 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
              {activeCount}
            </span>
          )}
        </button>

        {/* 1. Date Posted */}
        {renderPill('datePosted', 'Date Posted', false, (
          <div className="space-y-1">
            <div className="px-3 py-1 font-bold text-slate-800 text-[11px] uppercase tracking-wider border-b border-slate-100">
              Filter Posted Date
            </div>
            {[
              { id: 'all', label: 'Any time' },
              { id: '24h', label: 'Past 24 hours' },
              { id: '3d', label: 'Past 3 days' },
              { id: '7d', label: 'Past week (7 days)' },
              { id: '30d', label: 'Past month (30 days)' }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setFilters({ ...filters, datePosted: opt.id });
                  setActivePopover(null);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl font-medium flex items-center justify-between transition-colors ${
                  filters.datePosted === opt.id ? 'bg-teal-50 text-teal-900 font-bold' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span>{opt.label}</span>
                {filters.datePosted === opt.id && <Check className="w-4 h-4 text-teal-600 font-bold" />}
              </button>
            ))}
          </div>
        ))}

        {/* 2. Apply Process */}
        {renderPill('applyProcess', 'Apply Process', false, (
          <div className="space-y-1">
            <div className="px-3 py-1 font-bold text-slate-800 text-[11px] uppercase tracking-wider border-b border-slate-100">
              Application Type
            </div>
            {[
              { id: 'all', label: 'All Application Processes' },
              { id: 'direct_pitch', label: 'Direct Pitch (RemotoOps)' },
              { id: 'easy_apply', label: '1-Click Easy Apply' },
              { id: 'external_portal', label: 'Company Portal' }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setFilters({ ...filters, applyProcess: opt.id });
                  setActivePopover(null);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl font-medium flex items-center justify-between transition-colors ${
                  filters.applyProcess === opt.id ? 'bg-teal-50 text-teal-900 font-bold' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span>{opt.label}</span>
                {filters.applyProcess === opt.id && <Check className="w-4 h-4 text-teal-600 font-bold" />}
              </button>
            ))}
          </div>
        ))}

        {/* 3. Exclude Jobs */}
        {renderPill('excludeJobs', 'Exclude Jobs', false, (
          <div className="p-1 space-y-2">
            <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider pb-1 border-b border-slate-100">
              Exclude From Search
            </div>
            {[
              { id: 'agency', label: 'Recruitment Agencies' },
              { id: 'no_stipend', label: 'Unpaid / Zero Stipend Roles' },
              { id: 'us_only', label: 'US-Only Timezone Roles' }
            ].map((opt) => (
              <label key={opt.id} className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded-xl cursor-pointer text-slate-700 font-medium">
                <input
                  type="checkbox"
                  checked={filters.excludeJobs.includes(opt.id)}
                  onChange={() => toggleArrayFilter('excludeJobs', opt.id)}
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        ))}

        {/* 4. Activity & Outcomes */}
        {renderPill('activityOutcome', 'Activity & Outcomes', true, (
          <div className="space-y-1">
            <div className="px-3 py-1 font-bold text-slate-800 text-[11px] uppercase tracking-wider border-b border-slate-100">
              Employer Hiring Status
            </div>
            {[
              { id: 'all', label: 'All Employer Statuses' },
              { id: 'active_today', label: 'Active Today (Responded <24h)' },
              { id: 'high_response', label: 'High Response Rate (>90%)' },
              { id: 'interviewing_now', label: 'Interviewing Candidates Now' }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setFilters({ ...filters, activityOutcome: opt.id });
                  setActivePopover(null);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl font-medium flex items-center justify-between transition-colors ${
                  filters.activityOutcome === opt.id ? 'bg-teal-50 text-teal-900 font-bold' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span>{opt.label}</span>
                {filters.activityOutcome === opt.id && <Check className="w-4 h-4 text-teal-600 font-bold" />}
              </button>
            ))}
          </div>
        ))}

        {/* 5. Departments */}
        {renderPill('department', 'Departments', false, (
          <div className="space-y-1">
            <div className="px-3 py-1 font-bold text-slate-800 text-[11px] uppercase tracking-wider border-b border-slate-100">
              Job Category / Dept
            </div>
            {[
              { id: 'all', label: 'All Departments' },
              { id: 'executive_assistant', label: 'Executive Assistance & Admin' },
              { id: 'customer_care', label: 'Customer Care & Support' },
              { id: 'marketing_smm', label: 'Social Media & Marketing' },
              { id: 'design_media', label: 'Graphic Design & Video' },
              { id: 'tech_web', label: 'IT, Web Ops & Software' },
              { id: 'sales_leadgen', label: 'Sales & Lead Generation' }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setFilters({ ...filters, department: opt.id });
                  setActivePopover(null);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl font-medium flex items-center justify-between transition-colors ${
                  filters.department === opt.id ? 'bg-teal-50 text-teal-900 font-bold' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span>{opt.label}</span>
                {filters.department === opt.id && <Check className="w-4 h-4 text-teal-600 font-bold" />}
              </button>
            ))}
          </div>
        ))}

        {/* 6. Job Titles & Keywords */}
        {renderPill('keywords', 'Job Titles & Keywords', false, (
          <div className="p-2 space-y-2">
            <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider pb-1 border-b border-slate-100">
              Keyword or Tool Filter
            </div>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={filters.keywords}
                onChange={(e) => setFilters({ ...filters, keywords: e.target.value })}
                placeholder="e.g. Zendesk, Canva, Notion..."
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-teal-500"
              />
            </div>
            {filters.keywords && (
              <button
                type="button"
                onClick={() => setFilters({ ...filters, keywords: '' })}
                className="text-[11px] text-rose-600 font-bold hover:underline"
              >
                Clear keyword filter
              </button>
            )}
          </div>
        ))}

        {/* 7. Experience */}
        {renderPill('experience', 'Experience', false, (
          <div className="space-y-1">
            <div className="px-3 py-1 font-bold text-slate-800 text-[11px] uppercase tracking-wider border-b border-slate-100">
              Experience Level
            </div>
            {[
              { id: 'all', label: 'All Experience Levels' },
              { id: 'entry', label: 'Entry Level / Beginner Friendly' },
              { id: 'mid', label: 'Mid Level (1-3 Years)' },
              { id: 'senior', label: 'Senior Level (3+ Years)' }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setFilters({ ...filters, experience: opt.id });
                  setActivePopover(null);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl font-medium flex items-center justify-between transition-colors ${
                  filters.experience === opt.id ? 'bg-teal-50 text-teal-900 font-bold' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span>{opt.label}</span>
                {filters.experience === opt.id && <Check className="w-4 h-4 text-teal-600 font-bold" />}
              </button>
            ))}
          </div>
        ))}

        {/* 8. Commitment */}
        {renderPill('commitment', 'Commitment', false, (
          <div className="space-y-1">
            <div className="px-3 py-1 font-bold text-slate-800 text-[11px] uppercase tracking-wider border-b border-slate-100">
              Hours & Commitment
            </div>
            {[
              { id: 'all', label: 'Any Hours' },
              { id: 'full_time', label: 'Full-Time (40h/week)' },
              { id: 'part_time', label: 'Part-Time (20h/week)' },
              { id: 'flexible', label: 'Flexible Project Basis' }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setFilters({ ...filters, commitment: opt.id });
                  setActivePopover(null);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl font-medium flex items-center justify-between transition-colors ${
                  filters.commitment === opt.id ? 'bg-teal-50 text-teal-900 font-bold' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span>{opt.label}</span>
                {filters.commitment === opt.id && <Check className="w-4 h-4 text-teal-600 font-bold" />}
              </button>
            ))}
          </div>
        ))}

        {/* 9. Salary */}
        {renderPill('salary', 'Salary', false, (
          <div className="space-y-1">
            <div className="px-3 py-1 font-bold text-slate-800 text-[11px] uppercase tracking-wider border-b border-slate-100">
              Minimum Salary / Rate
            </div>
            {[
              { id: 0, label: 'All Compensation Levels' },
              { id: 300, label: '$300+/month' },
              { id: 500, label: '$500+/month' },
              { id: 1000, label: '$1,000+/month' },
              { id: 2000, label: '$2,000+/month' }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setFilters({ ...filters, minSalary: opt.id });
                  setActivePopover(null);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl font-medium flex items-center justify-between transition-colors ${
                  filters.minSalary === opt.id ? 'bg-teal-50 text-teal-900 font-bold' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span>{opt.label}</span>
                {filters.minSalary === opt.id && <Check className="w-4 h-4 text-teal-600 font-bold" />}
              </button>
            ))}
          </div>
        ))}

        {/* 10. Benefits & Perks */}
        {renderPill('benefits', 'Benefits & Perks', false, (
          <div className="p-1 space-y-2">
            <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider pb-1 border-b border-slate-100">
              Included Perks & Growth
            </div>
            {[
              { id: 'mentorship', label: '1-on-1 Dedicated Mentor' },
              { id: 'flexible_hours', label: 'Flexible Work Hours' },
              { id: 'equipment', label: 'Equipment Allowance' },
              { id: 'career_track', label: 'Guaranteed Growth Track' }
            ].map((opt) => (
              <label key={opt.id} className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded-xl cursor-pointer text-slate-700 font-medium">
                <input
                  type="checkbox"
                  checked={filters.benefits.includes(opt.id)}
                  onChange={() => toggleArrayFilter('benefits', opt.id)}
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        ))}

        {/* 11. Education */}
        {renderPill('education', 'Education', false, (
          <div className="space-y-1">
            <div className="px-3 py-1 font-bold text-slate-800 text-[11px] uppercase tracking-wider border-b border-slate-100">
              Education Requirement
            </div>
            {[
              { id: 'all', label: 'No Degree Requirement' },
              { id: 'high_school', label: 'High School Diploma' },
              { id: 'bachelors', label: "Bachelor's Degree" },
              { id: 'bootcamp', label: 'Self-Taught / Bootcamp Cert' }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setFilters({ ...filters, education: opt.id });
                  setActivePopover(null);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl font-medium flex items-center justify-between transition-colors ${
                  filters.education === opt.id ? 'bg-teal-50 text-teal-900 font-bold' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span>{opt.label}</span>
                {filters.education === opt.id && <Check className="w-4 h-4 text-teal-600 font-bold" />}
              </button>
            ))}
          </div>
        ))}

        {/* 12. Licenses & Certifications */}
        {renderPill('certifications', 'Licenses & Certifications', false, (
          <div className="p-1 space-y-2">
            <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider pb-1 border-b border-slate-100">
              Required Certifications
            </div>
            {[
              { id: 'remotoops_certified', label: 'RemotoOps Tool Certified' },
              { id: 'hubspot', label: 'Hubspot Academy' },
              { id: 'google_analytics', label: 'Google Analytics' }
            ].map((opt) => (
              <label key={opt.id} className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded-xl cursor-pointer text-slate-700 font-medium">
                <input
                  type="checkbox"
                  checked={filters.certifications.includes(opt.id)}
                  onChange={() => toggleArrayFilter('certifications', opt.id)}
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        ))}

        {/* 13. Security Clearance */}
        {renderPill('securityClearance', 'Security Clearance', false, (
          <div className="space-y-1">
            <div className="px-3 py-1 font-bold text-slate-800 text-[11px] uppercase tracking-wider border-b border-slate-100">
              Verification & Safety Level
            </div>
            {[
              { id: 'all', label: 'All Security Levels' },
              { id: 'kyc_verified', label: 'Verified Facial KYC Clients Only' },
              { id: 'background_checked', label: 'Background Check Approved' }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setFilters({ ...filters, securityClearance: opt.id });
                  setActivePopover(null);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl font-medium flex items-center justify-between transition-colors ${
                  filters.securityClearance === opt.id ? 'bg-teal-50 text-teal-900 font-bold' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span>{opt.label}</span>
                {filters.securityClearance === opt.id && <Check className="w-4 h-4 text-teal-600 font-bold" />}
              </button>
            ))}
          </div>
        ))}

        {/* 14. Languages */}
        {renderPill('languages', 'Languages', false, (
          <div className="p-1 space-y-2">
            <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider pb-1 border-b border-slate-100">
              Spoken Languages
            </div>
            {[
              { id: 'english', label: 'English (Fluent / Native)' },
              { id: 'spanish', label: 'Spanish' },
              { id: 'tagalog', label: 'Tagalog / Filipino' }
            ].map((opt) => (
              <label key={opt.id} className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded-xl cursor-pointer text-slate-700 font-medium">
                <input
                  type="checkbox"
                  checked={filters.languages.includes(opt.id)}
                  onChange={() => toggleArrayFilter('languages', opt.id)}
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        ))}

        {/* 15. Encouraged to Apply */}
        {renderPill('encouragedToApply', 'Encouraged to Apply', false, (
          <div className="p-1 space-y-2">
            <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider pb-1 border-b border-slate-100">
              Special Talent Groups
            </div>
            {[
              { id: 'beginners', label: 'Zero-Experience Beginners' },
              { id: 'fresh_graduates', label: 'Fresh Graduates' },
              { id: 'career_changers', label: 'Career Changers' },
              { id: 'ofw_returnees', label: 'OFW / Overseas Returnees' }
            ].map((opt) => (
              <label key={opt.id} className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded-xl cursor-pointer text-slate-700 font-medium">
                <input
                  type="checkbox"
                  checked={filters.encouragedToApply.includes(opt.id)}
                  onChange={() => toggleArrayFilter('encouragedToApply', opt.id)}
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        ))}

        {/* 16. Shifts & Schedules */}
        {renderPill('shiftSchedule', 'Shifts & Schedules', false, (
          <div className="space-y-1">
            <div className="px-3 py-1 font-bold text-slate-800 text-[11px] uppercase tracking-wider border-b border-slate-100">
              Shift Timing
            </div>
            {[
              { id: 'all', label: 'All Shift Schedules' },
              { id: 'day_shift', label: 'Day Shift (SGT / Local)' },
              { id: 'night_shift', label: 'Night Shift / Graveyard (US/EST)' },
              { id: 'flexible_async', label: '100% Async / Flexible Shift' }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setFilters({ ...filters, shiftSchedule: opt.id });
                  setActivePopover(null);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl font-medium flex items-center justify-between transition-colors ${
                  filters.shiftSchedule === opt.id ? 'bg-teal-50 text-teal-900 font-bold' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span>{opt.label}</span>
                {filters.shiftSchedule === opt.id && <Check className="w-4 h-4 text-teal-600 font-bold" />}
              </button>
            ))}
          </div>
        ))}

        {/* 17. Travel Requirement */}
        {renderPill('travelRequirement', 'Travel Requirement', false, (
          <div className="space-y-1">
            <div className="px-3 py-1 font-bold text-slate-800 text-[11px] uppercase tracking-wider border-b border-slate-100">
              Travel Expectation
            </div>
            {[
              { id: 'all', label: 'Any Travel Requirement' },
              { id: 'no_travel', label: '100% Remote (Zero Travel)' },
              { id: 'occasional', label: 'Occasional Retreats / Meetups' }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setFilters({ ...filters, travelRequirement: opt.id });
                  setActivePopover(null);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl font-medium flex items-center justify-between transition-colors ${
                  filters.travelRequirement === opt.id ? 'bg-teal-50 text-teal-900 font-bold' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span>{opt.label}</span>
                {filters.travelRequirement === opt.id && <Check className="w-4 h-4 text-teal-600 font-bold" />}
              </button>
            ))}
          </div>
        ))}

        {/* 18. Company */}
        {renderPill('companyName', 'Company', false, (
          <div className="p-2 space-y-2">
            <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider pb-1 border-b border-slate-100">
              Company Name Search
            </div>
            <input
              type="text"
              value={filters.companyName}
              onChange={(e) => setFilters({ ...filters, companyName: e.target.value })}
              placeholder="e.g. Apex, TechCorp..."
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-teal-500"
            />
            {filters.companyName && (
              <button
                type="button"
                onClick={() => setFilters({ ...filters, companyName: '' })}
                className="text-[11px] text-rose-600 font-bold hover:underline"
              >
                Clear company filter
              </button>
            )}
          </div>
        ))}

        {/* 19. Industry */}
        {renderPill('industry', 'Industry', false, (
          <div className="space-y-1">
            <div className="px-3 py-1 font-bold text-slate-800 text-[11px] uppercase tracking-wider border-b border-slate-100">
              Industry Sector
            </div>
            {[
              { id: 'all', label: 'All Industries' },
              { id: 'ecommerce', label: 'E-commerce & Retail' },
              { id: 'saas_software', label: 'SaaS & Technology' },
              { id: 'digital_agency', label: 'Digital Agency & Marketing' },
              { id: 'finance_fintech', label: 'Finance & Fintech' }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setFilters({ ...filters, industry: opt.id });
                  setActivePopover(null);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl font-medium flex items-center justify-between transition-colors ${
                  filters.industry === opt.id ? 'bg-teal-50 text-teal-900 font-bold' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span>{opt.label}</span>
                {filters.industry === opt.id && <Check className="w-4 h-4 text-teal-600 font-bold" />}
              </button>
            ))}
          </div>
        ))}

        {/* 20. Stage & Funding */}
        {renderPill('stageFunding', 'Stage & Funding', false, (
          <div className="space-y-1">
            <div className="px-3 py-1 font-bold text-slate-800 text-[11px] uppercase tracking-wider border-b border-slate-100">
              Funding Stage
            </div>
            {[
              { id: 'all', label: 'All Company Stages' },
              { id: 'bootstrapped', label: 'Bootstrapped / Profitable' },
              { id: 'seed', label: 'Seed / Early Stage' },
              { id: 'growth', label: 'Series A+ Growth Stage' }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setFilters({ ...filters, stageFunding: opt.id });
                  setActivePopover(null);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl font-medium flex items-center justify-between transition-colors ${
                  filters.stageFunding === opt.id ? 'bg-teal-50 text-teal-900 font-bold' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span>{opt.label}</span>
                {filters.stageFunding === opt.id && <Check className="w-4 h-4 text-teal-600 font-bold" />}
              </button>
            ))}
          </div>
        ))}

        {/* 21. Size */}
        {renderPill('companySize', 'Size', false, (
          <div className="space-y-1">
            <div className="px-3 py-1 font-bold text-slate-800 text-[11px] uppercase tracking-wider border-b border-slate-100">
              Team Size
            </div>
            {[
              { id: 'all', label: 'All Company Sizes' },
              { id: '1-10', label: '1 - 10 Employees' },
              { id: '11-50', label: '11 - 50 Employees' },
              { id: '51-200', label: '51 - 200 Employees' },
              { id: '200+', label: '200+ Employees' }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setFilters({ ...filters, companySize: opt.id });
                  setActivePopover(null);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl font-medium flex items-center justify-between transition-colors ${
                  filters.companySize === opt.id ? 'bg-teal-50 text-teal-900 font-bold' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span>{opt.label}</span>
                {filters.companySize === opt.id && <Check className="w-4 h-4 text-teal-600 font-bold" />}
              </button>
            ))}
          </div>
        ))}

        {/* 22. Founding Year */}
        {renderPill('foundingYear', 'Founding Year', false, (
          <div className="space-y-1">
            <div className="px-3 py-1 font-bold text-slate-800 text-[11px] uppercase tracking-wider border-b border-slate-100">
              Founding Year
            </div>
            {[
              { id: 'all', label: 'Any Founding Year' },
              { id: '2020+', label: 'Founded 2020 or Later' },
              { id: '2015-2020', label: 'Founded 2015 - 2020' },
              { id: 'pre-2015', label: 'Established Pre-2015' }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setFilters({ ...filters, foundingYear: opt.id });
                  setActivePopover(null);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl font-medium flex items-center justify-between transition-colors ${
                  filters.foundingYear === opt.id ? 'bg-teal-50 text-teal-900 font-bold' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span>{opt.label}</span>
                {filters.foundingYear === opt.id && <Check className="w-4 h-4 text-teal-600 font-bold" />}
              </button>
            ))}
          </div>
        ))}

        {/* Reset Button when active */}
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-rose-600 font-bold hover:underline flex items-center gap-1 ml-1 px-2 py-1 bg-rose-50 rounded-full border border-rose-200"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All ({activeCount})</span>
          </button>
        )}

      </div>

      {/* MASTER FILTERS DRAWER MODAL */}
      {isMasterDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col justify-between overflow-hidden">
            
            {/* Drawer Header */}
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <SlidersHorizontal className="w-5 h-5 text-teal-400" />
                <div>
                  <h3 className="font-extrabold text-base text-white">All Filter Controls</h3>
                  <p className="text-xs text-slate-400">Filter jobs & talent by 23 precise criteria</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMasterDrawerOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-800">
              
              {/* Active Badges */}
              {activeCount > 0 && (
                <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-2xl flex items-center justify-between">
                  <span className="font-bold text-teal-900">{activeCount} filter(s) active</span>
                  <button
                    type="button"
                    onClick={onReset}
                    className="text-xs text-rose-600 font-bold hover:underline"
                  >
                    Clear All
                  </button>
                </div>
              )}

              {/* Category 1: Job & Department */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-teal-700">Department & Keywords</h4>
                <div className="space-y-2">
                  <label className="block font-semibold">Keywords or Tools:</label>
                  <input
                    type="text"
                    value={filters.keywords}
                    onChange={(e) => setFilters({ ...filters, keywords: e.target.value })}
                    placeholder="e.g. Asana, Zendesk, React..."
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block font-semibold">Department:</label>
                  <select
                    value={filters.department}
                    onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs bg-white"
                  >
                    <option value="all">All Departments</option>
                    <option value="executive_assistant">Executive Assistance & Admin</option>
                    <option value="customer_care">Customer Care & Support</option>
                    <option value="marketing_smm">Social Media & Marketing</option>
                    <option value="tech_web">IT, Web Ops & Software</option>
                  </select>
                </div>
              </div>

              {/* Category 2: Experience & Commitment */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-teal-700">Experience & Schedule</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Experience:</label>
                    <select
                      value={filters.experience}
                      onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                      className="w-full p-2.5 border border-slate-300 rounded-xl text-xs bg-white"
                    >
                      <option value="all">All Levels</option>
                      <option value="entry">Entry Level / Beginner</option>
                      <option value="mid">Mid Level</option>
                      <option value="senior">Senior Level</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Shift Schedule:</label>
                    <select
                      value={filters.shiftSchedule}
                      onChange={(e) => setFilters({ ...filters, shiftSchedule: e.target.value })}
                      className="w-full p-2.5 border border-slate-300 rounded-xl text-xs bg-white"
                    >
                      <option value="all">All Shifts</option>
                      <option value="day_shift">Day Shift</option>
                      <option value="night_shift">Night Shift (US)</option>
                      <option value="flexible_async">Flexible / Async</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Category 3: Security & Verification */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-teal-700">Verification & Safety</h4>
                <div className="space-y-2">
                  <label className="block font-semibold">Security Clearance Level:</label>
                  <select
                    value={filters.securityClearance}
                    onChange={(e) => setFilters({ ...filters, securityClearance: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs bg-white"
                  >
                    <option value="all">All Postings</option>
                    <option value="kyc_verified">Verified Facial KYC Clients Only</option>
                    <option value="background_checked">Background Checked</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={onReset}
                className="px-4 py-2.5 text-slate-600 hover:text-slate-900 font-bold text-xs"
              >
                Reset All Filters
              </button>
              <button
                type="button"
                onClick={() => setIsMasterDrawerOpen(false)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-lg"
              >
                Show {totalResultsCount} Matching Results
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
