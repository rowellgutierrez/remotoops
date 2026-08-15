import React from 'react';
import logoImg from '../assets/images/remotoops_logo_1786167434166.jpg';
import { UserAccount } from '../types';
import { AppTab } from './Header';
import { 
  Search, 
  Bookmark, 
  Bell, 
  Briefcase, 
  User, 
  Building2, 
  MessageSquare, 
  Sparkles,
  CreditCard,
  Sun, 
  Moon, 
  LogOut, 
  LogIn, 
  ShieldCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface SidebarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  currentUser: UserAccount | null;
  savedJobsCount: number;
  savedSearchesCount?: number;
  applicationCount: number;
  unreadMessagesCount?: number;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  onOpenAccountModal: () => void;
  onOpenAuthModal: (mode?: 'login' | 'signup') => void;
  onLogout: () => void;
  onOpenAdminConsole?: () => void;
  onOpenCareersModal?: () => void;
  onOpenPricingModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  savedJobsCount,
  savedSearchesCount = 0,
  applicationCount,
  unreadMessagesCount = 0,
  theme = 'light',
  onToggleTheme,
  onOpenAccountModal,
  onOpenAuthModal,
  onLogout,
  onOpenAdminConsole,
  onOpenCareersModal,
  onOpenPricingModal
}) => {
  return (
    <aside className="w-68 lg:w-72 shrink-0 bg-white border-r border-slate-200 min-h-screen flex flex-col justify-between p-5 select-none z-30 transition-colors shadow-xs">
      
      {/* Top Section: Logo & Main Navigation */}
      <div className="space-y-6">
        
        {/* Large Prominent Brand Logo Header (~2x size) */}
        <div 
          onClick={() => {
            setActiveTab('find_jobs');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 p-2.5 cursor-pointer group rounded-2xl hover:bg-indigo-50/50 transition-all border border-transparent hover:border-indigo-100"
          title="Return to RemotoOps Home"
        >
          <img 
            src={logoImg} 
            alt="RemotoOps Logo" 
            referrerPolicy="no-referrer"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-indigo-500/20 object-cover shadow-md group-hover:scale-105 transition-transform shrink-0" 
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-2xl sm:text-3xl tracking-tight text-slate-900 leading-tight">RemotoOps</span>
            </div>
            <p className="text-xs font-bold text-indigo-600 tracking-wide mt-0.5">
              Remote Job Ecosystem
            </p>
          </div>
        </div>

        {/* Primary Navigation Menu */}
        <nav className="space-y-1.5 pt-1">
          
          {/* Find Jobs */}
          <button
            onClick={() => {
              setActiveTab('find_jobs');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'find_jobs'
                ? 'bg-indigo-50 text-indigo-950 font-extrabold shadow-xs border border-indigo-200/60'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <Search className={`w-5 h-5 ${activeTab === 'find_jobs' ? 'text-indigo-600 stroke-[2.5]' : 'text-slate-500'}`} />
              <span className="text-[13px]">Find Jobs</span>
            </div>
          </button>

          {/* Saved Jobs */}
          <button
            onClick={() => setActiveTab('saved_jobs')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'saved_jobs'
                ? 'bg-indigo-50 text-indigo-950 font-extrabold shadow-xs border border-indigo-200/60'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <Bookmark className={`w-5 h-5 ${activeTab === 'saved_jobs' ? 'text-indigo-600 stroke-[2.5]' : 'text-slate-500'}`} />
              <span className="text-[13px]">Saved Jobs</span>
            </div>
            {savedJobsCount > 0 && (
              <span className="bg-indigo-100 text-indigo-800 text-[11px] font-black px-2 py-0.5 rounded-full">
                {savedJobsCount}
              </span>
            )}
          </button>

          {/* Saved Searches */}
          <button
            onClick={() => setActiveTab('saved_searches')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'saved_searches'
                ? 'bg-indigo-50 text-indigo-950 font-extrabold shadow-xs border border-indigo-200/60'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <Bell className={`w-5 h-5 ${activeTab === 'saved_searches' ? 'text-indigo-600 stroke-[2.5]' : 'text-slate-500'}`} />
              <span className="text-[13px]">Saved Searches</span>
            </div>
            {savedSearchesCount > 0 && (
              <span className="bg-slate-100 text-slate-700 text-[11px] font-bold px-2 py-0.5 rounded-full">
                {savedSearchesCount}
              </span>
            )}
          </button>

          {/* My Applications */}
          <button
            onClick={() => setActiveTab('my_applications')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'my_applications'
                ? 'bg-indigo-50 text-indigo-950 font-extrabold shadow-xs border border-indigo-200/60'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <Briefcase className={`w-5 h-5 ${activeTab === 'my_applications' ? 'text-indigo-600 stroke-[2.5]' : 'text-slate-500'}`} />
              <span className="text-[13px]">My Applications</span>
            </div>
            {applicationCount > 0 && (
              <span className="bg-indigo-600 text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                {applicationCount}
              </span>
            )}
          </button>

          {/* Account */}
          <button
            onClick={onOpenAccountModal}
            className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition-all"
          >
            <div className="flex items-center gap-3.5">
              <User className="w-5 h-5 text-slate-500" />
              <span className="text-[13px]">Account</span>
            </div>
          </button>

        </nav>

        {/* Section Divider */}
        <div className="border-t border-slate-100 my-2" />

        {/* Employer & Inbox Group */}
        <div className="space-y-1.5">
          
          {/* Employers */}
          <button
            onClick={() => setActiveTab('employers')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'employers'
                ? 'bg-indigo-50 text-indigo-950 font-extrabold shadow-xs border border-indigo-200/60'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <Building2 className={`w-5 h-5 ${activeTab === 'employers' ? 'text-indigo-600' : 'text-slate-500'}`} />
              <span className="text-[13px]">Employers</span>
            </div>
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
              Hiring
            </span>
          </button>

          {/* Inbox / Messages */}
          <button
            onClick={() => setActiveTab('messages')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'messages'
                ? 'bg-indigo-50 text-indigo-950 font-extrabold shadow-xs border border-indigo-200/60'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <MessageSquare className={`w-5 h-5 ${activeTab === 'messages' ? 'text-indigo-600 stroke-[2.5]' : 'text-slate-500'}`} />
              <span className="text-[13px]">Inbox</span>
            </div>
            {unreadMessagesCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          {/* Pricing Plans */}
          <button
            onClick={() => onOpenPricingModal && onOpenPricingModal()}
            className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition-all"
          >
            <div className="flex items-center gap-3.5">
              <CreditCard className="w-5 h-5 text-slate-500" />
              <span className="text-[13px]">Pricing Plans</span>
            </div>
            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
              Plans
            </span>
          </button>

        </div>

        {/* Section Divider */}
        <div className="border-t border-slate-100 my-2" />

        {/* Careers / We're Hiring Card */}
        <div 
          onClick={() => {
            if (onOpenCareersModal) onOpenCareersModal();
            else setActiveTab('find_jobs');
          }}
          className="p-3.5 bg-gradient-to-br from-indigo-50/80 to-purple-50/80 border border-indigo-200/70 rounded-2xl cursor-pointer hover:border-indigo-400 transition-all space-y-1 group shadow-xs"
        >
          <div className="flex items-center justify-between text-xs font-extrabold text-indigo-950">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Careers — We're hiring
            </span>
            <ChevronRight className="w-4 h-4 text-indigo-500 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
            Join the RemotoOps core team building the future of remote work.
          </p>
        </div>

        {/* Admin Shortcut if Admin */}
        {currentUser?.role === 'admin' && onOpenAdminConsole && (
          <button
            onClick={onOpenAdminConsole}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-all"
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-purple-600" />
              <span className="text-[13px]">Admin Console</span>
            </div>
          </button>
        )}

      </div>

      {/* Bottom Section: User Info / Logout */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        
        {/* User Status / Login Tile */}
        {currentUser ? (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2.5 space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{currentUser.email}</p>
              </div>
            </div>
            
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-1.5 text-[11px] font-bold text-rose-600 hover:bg-rose-50 py-1.5 rounded-lg transition-colors border border-rose-100"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <button
              onClick={() => onOpenAuthModal('login')}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <LogIn className="w-3.5 h-3.5 text-teal-400" />
              <span>Log In</span>
            </button>
            
            <button
              onClick={() => onOpenAuthModal('signup')}
              className="w-full bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 font-bold text-xs py-2 rounded-xl transition-all flex items-center justify-center"
            >
              <span>Create Account</span>
            </button>
          </div>
        )}

      </div>

    </aside>
  );
};
