import React, { useState } from 'react';
import { UserAccount } from '../types';
import logoImg from '../assets/images/remotoops_logo_1786167434166.jpg';
import { 
  Briefcase, 
  Rss, 
  Users, 
  GraduationCap, 
  PlusCircle, 
  Search, 
  UserCheck, 
  FileCheck2,
  FileText,
  Bot,
  ShieldAlert,
  ShieldCheck,
  LogIn,
  LogOut,
  ChevronDown,
  Sparkles,
  User as UserIcon,
  BadgeCheck
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'jobs' | 'ats_resume' | 'interview_prep' | 'anti_scam' | 'mentorship' | 'talent' | 'portal' | 'feed';
  setActiveTab: (tab: 'jobs' | 'ats_resume' | 'interview_prep' | 'anti_scam' | 'mentorship' | 'talent' | 'portal' | 'feed') => void;
  currentUser: UserAccount | null;
  onOpenAuthModal: (mode?: 'login' | 'signup') => void;
  onLogout: () => void;
  onOpenPostJob: () => void;
  onOpenPricingModal?: () => void;
  onOpenAdminConsole?: () => void;
  onOpenKycModal?: () => void;
  onOpenProfileModal?: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  applicationCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuthModal,
  onLogout,
  onOpenPostJob,
  onOpenPricingModal,
  onOpenAdminConsole,
  onOpenKycModal,
  onOpenProfileModal,
  searchQuery,
  setSearchQuery,
  applicationCount
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-2">
            <div 
              onClick={() => setActiveTab('jobs')}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <img 
                src={logoImg} 
                alt="RemotoOps Logo" 
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full border border-teal-500/40 object-cover shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform" 
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight text-white">RemotoOps</span>
                  <span className="bg-teal-500/20 text-teal-300 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full border border-teal-500/30 uppercase tracking-wider">
                    Safe Remote Jobs
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                  No Experience Required • Verified Clients & Mentorship
                </p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xs hidden lg:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search jobs, tools, or mentorship..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700/80 text-xs text-slate-200 placeholder-slate-400 rounded-full pl-8 pr-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              />
            </div>
          </div>

          {/* Nav Icons / Main Tabs */}
          <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            
            <button
              onClick={() => setActiveTab('jobs')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'jobs'
                  ? 'bg-slate-800 text-teal-400 border border-teal-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Jobs</span>
            </button>

            <button
              onClick={() => setActiveTab('ats_resume')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'ats_resume'
                  ? 'bg-slate-800 text-teal-400 border border-teal-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>ATS Resume</span>
            </button>

            <button
              onClick={() => setActiveTab('interview_prep')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'interview_prep'
                  ? 'bg-slate-800 text-teal-400 border border-teal-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-indigo-400" />
              <span>Interview Guide</span>
            </button>

            <button
              onClick={() => setActiveTab('anti_scam')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'anti_scam'
                  ? 'bg-slate-800 text-rose-400 border border-rose-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Anti-Scam</span>
            </button>

            <button
              onClick={() => setActiveTab('mentorship')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all hidden md:flex ${
                activeTab === 'mentorship'
                  ? 'bg-slate-800 text-teal-400 border border-teal-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI Mentorship</span>
            </button>

            <button
              onClick={() => setActiveTab('portal')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                activeTab === 'portal'
                  ? 'bg-slate-800 text-teal-400 border border-teal-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Portal</span>
              {applicationCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-teal-500 text-slate-900 font-bold text-[9px] flex items-center justify-center">
                  {applicationCount}
                </span>
              )}
            </button>

          </nav>

          {/* User Auth Controls & Post Job CTA */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800 shrink-0">
            
            {/* Show Admin Panel button ONLY if user is logged in as Admin */}
            {onOpenAdminConsole && currentUser?.role === 'admin' && (
              <button
                onClick={onOpenAdminConsole}
                className="flex items-center gap-1.5 bg-indigo-950/80 hover:bg-indigo-900/90 text-teal-300 font-bold text-[11px] px-2.5 py-1.5 rounded-lg border border-indigo-700/80 shadow-sm transition-all"
                title="Admin Console - View Users, Firebase DB, Signups & Subscriptions"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span className="hidden sm:inline">Admin Panel</span>
              </button>
            )}

            {onOpenPricingModal && (
              <button
                onClick={onOpenPricingModal}
                className="hidden xl:flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold text-[11px] px-2.5 py-1.5 rounded-lg border border-slate-700 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span>Employer Pricing</span>
              </button>
            )}

            {/* Post Job Button */}
            <button
              onClick={onOpenPostJob}
              className="flex items-center gap-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg shadow-md transition-all hover:scale-105"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Post Opportunity</span>
            </button>

            {/* Auth State Button */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700/80 p-1.5 pl-2.5 rounded-xl border border-slate-700/80 transition-all text-xs"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-6 h-6 rounded-full object-cover border border-slate-600"
                  />
                  <div className="text-left hidden md:block">
                    <p className="font-bold text-slate-100 text-[11px] leading-tight flex items-center gap-1">
                      {currentUser.name}
                      {currentUser.role === 'client' && <BadgeCheck className="w-3 h-3 text-emerald-400" />}
                    </p>
                    <p className="text-[9px] text-slate-400 uppercase font-semibold">
                      {currentUser.role === 'candidate' ? 'Trainee' : 'Client'}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 space-y-1 text-xs z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60 mb-1">
                      <p className="font-bold text-white">{currentUser.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
                      
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                          currentUser.role === 'candidate' 
                            ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                            : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        }`}>
                          {currentUser.role === 'candidate' ? 'Beginner Applicant' : 'Verified Employer'}
                        </span>

                        {!currentUser.emailVerified ? (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            Email Unverified
                          </span>
                        ) : currentUser.verificationStatus === 'verified' ? (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            ✓ Verified Profile
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 capitalize">
                            Status: {currentUser.verificationStatus || 'incomplete'}
                          </span>
                        )}
                      </div>
                    </div>

                    {onOpenProfileModal && (
                      <button
                        onClick={() => {
                          onOpenProfileModal();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg flex items-center gap-2 font-bold"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-teal-400" /> My Profile & Cover Banner
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setActiveTab('portal');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg flex items-center gap-2"
                    >
                      <FileCheck2 className="w-3.5 h-3.5 text-teal-400" /> My Applications & Messages
                    </button>

                    {onOpenKycModal && (
                      <button
                        onClick={() => {
                          onOpenKycModal();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-teal-300 hover:bg-teal-950/40 rounded-lg flex items-center gap-2 font-semibold border border-teal-500/30 my-1"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                        {currentUser?.isKycVerified ? 'Verified KYC Badge ✓' : 'Verify Facial ID (KYC)'}
                      </button>
                    )}

                    <button
                      onClick={() => {
                        onOpenAuthModal('login');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg flex items-center gap-2"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-indigo-400" /> Switch Account
                    </button>

                    <button
                      onClick={() => {
                        onLogout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-rose-400 hover:bg-rose-950/40 rounded-lg flex items-center gap-2 font-bold border-t border-slate-800"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onOpenAuthModal('login')}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition-all flex items-center gap-1"
                >
                  <LogIn className="w-3.5 h-3.5 text-teal-400" /> Log In
                </button>

                <button
                  onClick={() => onOpenAuthModal('signup')}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition-all hidden sm:flex items-center gap-1 shadow-sm"
                >
                  <UserCheck className="w-3.5 h-3.5" /> Sign Up
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
