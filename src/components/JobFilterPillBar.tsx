import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  X, 
  Check, 
  Search, 
  ShieldCheck, 
  Briefcase, 
  Clock, 
  DollarSign, 
  RotateCcw,
  Sparkles,
  Filter
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

interface JobFilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedTimezone: string;
  onTimezoneChange: (tz: string) => void;
  selectedCompType: string;
  onCompTypeChange: (type: string) => void;
  totalResultsCount: number;
  onReset: () => void;
}

export const ROLE_CATEGORY_LABELS: Record<string, string> = {
  executive_assistant: 'Executive Assistance & Admin',
  customer_support: 'Customer Care & Support',
  social_media_manager: 'Social Media & Content',
  lead_generation: 'Lead Generation & Sales Ops',
  creative_design: 'Graphic Design & Brand',
  tech_ops: 'IT, Web Ops & Software',
  content_writing: 'Copywriting & Newsletters',
  bookkeeping_finance: 'Virtual Bookkeeping',
  community_mod: 'Community Moderation'
};

export const JobFilterBar: React.FC<JobFilterBarProps> = ({
  filters,
  setFilters,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedTimezone,
  onTimezoneChange,
  selectedCompType,
  onCompTypeChange,
  totalResultsCount,
  onReset
}) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Count active filters
  const activeCount = 
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedTimezone !== 'all' ? 1 : 0) +
    (selectedCompType !== 'all' ? 1 : 0) +
    (filters.department !== 'all' ? 1 : 0) +
    (filters.experience !== 'all' ? 1 : 0) +
    (filters.shiftSchedule !== 'all' ? 1 : 0) +
    (filters.securityClearance !== 'all' ? 1 : 0) +
    (filters.keywords.trim() ? 1 : 0) +
    filters.excludeJobs.length;

  const handleExcludeToggle = (val: string) => {
    if (filters.excludeJobs.includes(val)) {
      setFilters({ ...filters, excludeJobs: filters.excludeJobs.filter(x => x !== val) });
    } else {
      setFilters({ ...filters, excludeJobs: [...filters.excludeJobs, val] });
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Primary Compact Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5">
        
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search jobs, skills, tools (Zendesk, Canva, Notion), or companies..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <button
            type="button"
            onClick={() => {}}
            className="flex-1 sm:flex-none bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition-all flex items-center justify-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            Search
          </button>

          <button
            type="button"
            onClick={() => setIsFilterModalOpen(true)}
            className={`flex-1 sm:flex-none font-bold text-xs px-4 py-2.5 rounded-xl border transition-all flex items-center justify-center gap-2 ${
              activeCount > 0
                ? 'bg-slate-900 text-white border-slate-900 shadow'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 text-teal-400" />
            <span>Filters</span>
            {activeCount > 0 && (
              <span className="bg-teal-500 text-slate-950 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center ml-0.5">
                {activeCount}
              </span>
            )}
          </button>
        </div>

      </div>

      {/* FILTER MODAL / DRAWER */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center">
                  <Filter className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Filter Opportunities</h3>
                  <p className="text-[11px] text-slate-500">Refine roles by category, experience, and compensation</p>
                </div>
              </div>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
              
              {/* Filter 1: Job Category */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-teal-600" /> Job Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => onCategoryChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="all">All Role Categories</option>
                  {Object.entries(ROLE_CATEGORY_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Filter 2: Work Type / Timezone */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-teal-600" /> Timezone & Overlap
                </label>
                <select
                  value={selectedTimezone}
                  onChange={(e) => onTimezoneChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="all">All Timezones / Overlaps</option>
                  <option value="EST (UTC-5)">EST (UTC-5)</option>
                  <option value="PST (UTC-8)">PST (UTC-8)</option>
                  <option value="GMT/BST (UTC+0)">GMT/BST (UTC+0)</option>
                  <option value="CET (UTC+1)">CET (UTC+1)</option>
                  <option value="SGT/PHT (UTC+8)">SGT/PHT (UTC+8)</option>
                  <option value="Flexible / Async">Flexible / Async</option>
                </select>
              </div>

              {/* Filter 3: Experience Level */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" /> Experience Level
                </label>
                <select
                  value={filters.experience}
                  onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="all">All Experience Levels</option>
                  <option value="entry">Entry Level / Open to Zero Experience</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                </select>
              </div>

              {/* Filter 4: Salary & Rate Type */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-900 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-teal-600" /> Compensation Type
                </label>
                <select
                  value={selectedCompType}
                  onChange={(e) => onCompTypeChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="all">All Compensation Types</option>
                  <option value="paid_stipend">Paid Monthly Stipend</option>
                  <option value="hourly_rate">Hourly Paid Mentorship</option>
                </select>
              </div>

              {/* Filter 5: Specific Tool Keywords */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-900">Specific Tools / Skills</label>
                <input
                  type="text"
                  value={filters.keywords}
                  onChange={(e) => setFilters({ ...filters, keywords: e.target.value })}
                  placeholder="e.g. Asana, Zendesk, Notion, Canva..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Filter 6: Security & Safety */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Client Verification Status
                </label>
                <select
                  value={filters.securityClearance}
                  onChange={(e) => setFilters({ ...filters, securityClearance: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="all">All Employers</option>
                  <option value="kyc_verified">Verified Facial KYC Clients Only</option>
                </select>
              </div>

              {/* Excludes */}
              <div className="pt-2 border-t border-slate-200 space-y-2">
                <label className="font-bold text-slate-900 block">Exclusions & Safety Filters</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleExcludeToggle('agency')}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                      filters.excludeJobs.includes('agency')
                        ? 'bg-rose-50 text-rose-800 border-rose-300 font-bold'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {filters.excludeJobs.includes('agency') ? '✓ Excluding Staffing Agencies' : '+ Exclude Staffing Agencies'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExcludeToggle('no_stipend')}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                      filters.excludeJobs.includes('no_stipend')
                        ? 'bg-rose-50 text-rose-800 border-rose-300 font-bold'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {filters.excludeJobs.includes('no_stipend') ? '✓ Excluding Unpaid Roles' : '+ Exclude Unpaid Roles'}
                  </button>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={onReset}
                className="text-slate-600 hover:text-slate-900 font-bold text-xs flex items-center gap-1 hover:underline"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Clear Filters
              </button>
              <button
                type="button"
                onClick={() => setIsFilterModalOpen(false)}
                className="bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow transition-all"
              >
                Apply Filters ({totalResultsCount} Jobs)
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

// Export alias for backward compatibility
export const JobFilterPillBar = JobFilterBar;
