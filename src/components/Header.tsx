import React, { useState, useEffect } from 'react';
import { UserAccount } from '../types';
import logoImg from '../assets/images/remotoops_logo.png';
import { 
  Search, 
  Bookmark, 
  Bell, 
  Briefcase, 
  MessageSquare, 
  Building2, 
  User as UserIcon, 
  LogOut, 
  LogIn, 
  PlusCircle, 
  Sun, 
  Moon, 
  ShieldCheck, 
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

export type AppTab = 
  | 'find_jobs' 
  | 'saved_jobs' 
  | 'saved_searches' 
  | 'my_applications' 
  | 'messages' 
  | 'employers' 
  | 'ats_resume' 
  | 'interview_prep' 
  | 'anti_scam';

interface HeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  currentUser: UserAccount | null;
  onOpenAuthModal: (mode?: 'login' | 'signup') => void;
  onLogout: () => void;
  onOpenPostJob: () => void;
  onOpenAccountModal: () => void;
  onOpenPricingModal?: () => void;
  onOpenAdminConsole?: () => void;
  savedJobsCount: number;
  applicationCount: number;
  unreadMessagesCount?: number;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  onToggleMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuthModal,
  onLogout,
  onOpenPostJob,
  onOpenAccountModal,
  onOpenPricingModal,
  onOpenAdminConsole,
  savedJobsCount,
  applicationCount,
  unreadMessagesCount = 0,
  theme = 'light',
  onToggleTheme,
  searchQuery = '',
  setSearchQuery,
  onToggleMobileSidebar
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const isEmployer = currentUser && (currentUser.role === 'client' || currentUser.role === 'employer' || currentUser.role === 'admin');

  useEffect(() => {
    setAvatarError(false);
  }, [currentUser?.avatar]);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 transition-colors">
      <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto">
        
        {/* Mobile menu trigger & mobile brand */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={onToggleMobileSidebar}
            className="p-2 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div 
            onClick={() => {
              setActiveTab('find_jobs');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-xs p-0.5 flex items-center justify-center shrink-0">
              <img 
                src={logoImg} 
                alt="RemotoOps" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain" 
              />
            </div>
            <span className="font-black text-lg text-slate-900 tracking-tight">RemotoOps</span>
          </div>
        </div>

        {/* Global Search Bar in Top Header */}
        <div className="hidden md:flex flex-1 max-w-xl items-center relative">
          <div className="w-full flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-indigo-500/40 focus-within:border-indigo-500 transition-all">
            <Search className="w-5 h-5 text-slate-400 mr-2.5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              placeholder="Search jobs, skills, or companies..."
              className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery && setSearchQuery('')}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold ml-1"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
          
          {/* Saved Searches / Alert Icon shortcut */}
          <button
            onClick={() => setActiveTab('saved_searches')}
            className="p-2.5 text-slate-600 hover:text-slate-950 hover:bg-slate-100 rounded-xl transition-colors relative"
            title="Saved Searches & Alerts"
          >
            <Bell className="w-5 h-5" />
          </button>

          {/* Post Job Action Button */}
          <button
            onClick={onOpenPostJob}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all"
          >
            <PlusCircle className="w-4 h-4 text-white" />
            <span className="hidden sm:inline">Post Job</span>
          </button>

          {/* User Account / Dropdown */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 pl-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all text-xs font-bold"
              >
                {currentUser.avatar && !avatarError ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 rounded-lg object-cover border border-slate-200 shrink-0"
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <div className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <span className="text-slate-800 hidden lg:inline max-w-[120px] truncate">{currentUser.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 space-y-1 text-xs z-50 animate-in fade-in zoom-in-95">
                  <div className="p-2.5 bg-slate-50 rounded-xl mb-1">
                    <p className="font-bold text-slate-900 text-xs">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{currentUser.email}</p>
                  </div>

                  <button
                    onClick={() => {
                      onOpenAccountModal();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl flex items-center gap-2 font-bold transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-teal-600" />
                    <span>Account Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('saved_jobs');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl flex items-center gap-2 transition-colors"
                  >
                    <Bookmark className="w-4 h-4 text-teal-600" />
                    <span>Saved Jobs ({savedJobsCount})</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('my_applications');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl flex items-center gap-2 transition-colors"
                  >
                    <Briefcase className="w-4 h-4 text-teal-600" />
                    <span>My Applications ({applicationCount})</span>
                  </button>

                  <button
                    onClick={() => {
                      if (onOpenPricingModal) onOpenPricingModal();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl flex items-center gap-2 font-medium transition-colors"
                  >
                    <Building2 className="w-4 h-4 text-teal-600" />
                    <span>Employer Pricing Plans</span>
                  </button>

                  <button
                    onClick={() => {
                      onLogout();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2 font-bold border-t border-slate-100 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuthModal('login')}
                className="text-slate-700 hover:text-slate-900 font-bold text-xs px-3 py-2 rounded-xl hover:bg-slate-100 transition-all flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-teal-600" />
                <span>Log In</span>
              </button>

              <button
                onClick={() => onOpenAuthModal('signup')}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-xs"
              >
                <span>Sign Up</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </header>
  );
};
