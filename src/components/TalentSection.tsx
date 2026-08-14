import React, { useState } from 'react';
import { CandidateProfile, RoleCategory, TimezoneOverlap } from '../types';
import { JobFilterPillBar, FilterState, INITIAL_FILTER_STATE } from './JobFilterPillBar';
import { 
  Search, 
  MapPin, 
  Clock, 
  Award, 
  CheckCircle2, 
  ExternalLink, 
  MessageSquare, 
  Star, 
  UserCheck, 
  Sparkles,
  BookOpen,
  Send,
  X
} from 'lucide-react';

interface TalentSectionProps {
  candidates: CandidateProfile[];
  onSendMessage: (candidateName: string) => void;
  onOpenEmployerPricing?: () => void;
}

export const TalentSection: React.FC<TalentSectionProps> = ({
  candidates,
  onSendMessage,
  onOpenEmployerPricing
}) => {
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedTimezone, setSelectedTimezone] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pillFilters, setPillFilters] = useState<FilterState>(INITIAL_FILTER_STATE);
  const [selectedCandidateModal, setSelectedCandidateModal] = useState<CandidateProfile | null>(null);
  const [directMsgText, setDirectMsgText] = useState('');
  const [msgSent, setMsgSent] = useState(false);
  
  // State for candidate profile boosting ($2 optional promotion)
  const [boostedCandidateIds, setBoostedCandidateIds] = useState<string[]>(['cand-1']);
  const [isBoostModalOpen, setIsBoostModalOpen] = useState(false);
  const [boostSuccess, setBoostSuccess] = useState(false);

  const handleBoostProfile = (candidateId: string) => {
    if (!boostedCandidateIds.includes(candidateId)) {
      setBoostedCandidateIds([...boostedCandidateIds, candidateId]);
    }
    setBoostSuccess(true);
    setTimeout(() => {
      setBoostSuccess(false);
      setIsBoostModalOpen(false);
    }, 1600);
  };

  const filteredCandidates = candidates.filter(cand => {
    if (selectedRole !== 'all' && cand.targetCategory !== selectedRole) return false;
    if (selectedTimezone !== 'all' && cand.timezone !== selectedTimezone) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = cand.name.toLowerCase().includes(q);
      const matchBio = cand.bio.toLowerCase().includes(q);
      const matchHeadline = cand.headline.toLowerCase().includes(q);
      const matchTools = cand.tools.some(t => t.name.toLowerCase().includes(q));
      if (!matchName && !matchBio && !matchHeadline && !matchTools) return false;
    }

    // Pill Filters
    if (pillFilters.keywords.trim()) {
      const kw = pillFilters.keywords.toLowerCase();
      const matchName = cand.name.toLowerCase().includes(kw);
      const matchHeadline = cand.headline.toLowerCase().includes(kw);
      const matchTools = cand.tools.some(t => t.name.toLowerCase().includes(kw));
      if (!matchName && !matchHeadline && !matchTools) return false;
    }

    if (pillFilters.department !== 'all') {
      const deptMap: Record<string, string> = {
        executive_assistant: 'executive_assistant',
        customer_care: 'admin_ops',
        marketing_smm: 'social_media_manager'
      };
      const target = deptMap[pillFilters.department];
      if (target && cand.targetCategory !== target) return false;
    }

    if (pillFilters.securityClearance !== 'all') {
      if (pillFilters.securityClearance === 'kyc_verified' && !cand.isVerifiedSafe) return false;
    }

    return true;
  });

  const handleSendMsgSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directMsgText.trim() || !selectedCandidateModal) return;

    onSendMessage(selectedCandidateModal.name);
    setMsgSent(true);
    setTimeout(() => {
      setSelectedCandidateModal(null);
      setMsgSent(false);
      setDirectMsgText('');
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl border border-slate-700/80 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-teal-500/20 text-teal-300 text-xs font-bold px-3 py-1 rounded-full border border-teal-500/30 mb-2">
              <UserCheck className="w-3.5 h-3.5" /> Verified Remote Apprentices & Newbies
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Entry-Level EA, Admin & Social Media Talent Worldwide
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Hire eager, trained career-starters who have completed RemotoOps practical tool modules. Ready for mentorship-driven remote roles.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setIsBoostModalOpen(true)}
              className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs px-3.5 py-2 rounded-xl transition-all shadow-lg flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" /> Boost My Profile ($2)
            </button>

            {onOpenEmployerPricing && (
              <button
                onClick={onOpenEmployerPricing}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
              >
                <span>Employer Hiring Plans ($0 - $16/mo)</span>
              </button>
            )}
          </div>
        </div>

        {/* Skills Over Experience Core Value Bar */}
        <div className="bg-slate-800/90 rounded-xl p-3.5 border border-slate-700 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold shrink-0">
              ⚡
            </div>
            <div>
              <p className="font-extrabold text-white text-xs">
                ⭐ Skills & Portfolios Over Years of Experience
              </p>
              <p className="text-[11px] text-slate-300">
                0 Years Corporate Experience? Show Google Workspace, Canva, Excel, Calendar & Travel SOPs, and Sample Spreadsheets.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-teal-300 bg-teal-500/20 px-2.5 py-1 rounded-full border border-teal-500/30 shrink-0">
            100% Free for Job Seekers
          </span>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-700/60">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by candidate name or tool..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/90 border border-slate-600 text-xs text-white placeholder-slate-400 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="bg-slate-800/90 border border-slate-600 text-xs text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Specialties</option>
            <option value="executive_assistant">Executive Assistant (EA)</option>
            <option value="social_media_manager">Social Media Manager (SMM)</option>
            <option value="admin_ops">Admin & Support Operations</option>
          </select>

          <select
            value={selectedTimezone}
            onChange={(e) => setSelectedTimezone(e.target.value)}
            className="bg-slate-800/90 border border-slate-600 text-xs text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Timezones</option>
            <option value="SGT/PHT (UTC+8)">SGT/PHT (UTC+8)</option>
            <option value="EST (UTC-5)">EST (UTC-5)</option>
            <option value="GMT/BST (UTC+0)">GMT/BST (UTC+0)</option>
          </select>
        </div>
      </div>

      {/* REUSABLE PILL FILTER BAR FOR TALENT SEARCH */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <JobFilterPillBar
          filters={pillFilters}
          setFilters={setPillFilters}
          totalResultsCount={filteredCandidates.length}
          onReset={() => {
            setPillFilters(INITIAL_FILTER_STATE);
            setSelectedRole('all');
            setSelectedTimezone('all');
            setSearchQuery('');
          }}
        />
      </div>

      {/* Grid of Candidate Profiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCandidates.map(candidate => {
          const isBoosted = boostedCandidateIds.includes(candidate.id);
          return (
            <div
              key={candidate.id}
              className={`bg-white rounded-2xl p-5 shadow-sm border transition-all flex flex-col justify-between space-y-4 relative ${
                isBoosted ? 'border-2 border-teal-500 shadow-teal-500/10 shadow-lg' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {isBoosted && (
                <div className="bg-teal-500 text-slate-950 font-extrabold text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full absolute -top-2.5 right-4 shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3 fill-slate-950" /> ⚡ Boosted Top Talent
                </div>
              )}

              <div className="space-y-3">
                {/* Profile Card Header */}
                <div className="flex items-start gap-3">
                  <img
                    src={candidate.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={candidate.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm bg-slate-100"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 text-sm truncate">{candidate.name}</h3>
                      <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400" /> {candidate.rating}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 font-medium line-clamp-1">{candidate.headline}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{candidate.location} • {candidate.timezone}</p>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {candidate.bio}
                </p>

                {/* Skills Over Experience Badge */}
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/80 text-[11px]">
                  <span className="font-bold text-slate-800 block text-[10px] text-indigo-700 uppercase tracking-wider mb-0.5">
                    💡 Verified Tool Portfolio:
                  </span>
                  <p className="text-slate-600 font-medium">
                    Google Workspace, Canva SOPs, Executive Travel Itinerary, Excel Budgeting
                  </p>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {candidate.badges.map((badge, idx) => (
                    <span key={idx} className="bg-teal-50 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-md border border-teal-200 flex items-center gap-1">
                      <Award className="w-3 h-3 text-teal-600" /> {badge}
                    </span>
                  ))}
                </div>

                {/* Tools Proficiency */}
                <div className="pt-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tool Skills:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {candidate.tools.map((tool, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-800 text-[10px] font-medium px-2 py-0.5 rounded border border-slate-200">
                        {tool.name} ({tool.level})
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* CTA */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                Open to Internships
              </span>

              <button
                onClick={() => {
                  setSelectedCandidateModal(candidate);
                  setMsgSent(false);
                  setDirectMsgText('');
                }}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" /> View Profile & Invite
              </button>
            </div>

            </div>
          );
        })}
      </div>

      {/* Candidate Profile Modal */}
      {selectedCandidateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 md:p-8 space-y-6">
            
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div className="flex gap-4">
                <img
                  src={selectedCandidateModal.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={selectedCandidateModal.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-md bg-slate-100"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
                  }}
                />
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">{selectedCandidateModal.name}</h2>
                  <p className="text-xs text-teal-700 font-bold">{selectedCandidateModal.headline}</p>
                  <p className="text-xs text-slate-500 mt-1">{selectedCandidateModal.location} • {selectedCandidateModal.timezone}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCandidateModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* About */}
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">About Candidate</h3>
              <p className="text-xs text-slate-700 leading-relaxed">{selectedCandidateModal.bio}</p>
            </div>

            {/* Mentorship Track Progress */}
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" /> RemotoOps Mentorship Track Modules
              </h3>
              <div className="space-y-2">
                {selectedCandidateModal.mentorshipTrack.map((track, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
                    <span className="font-medium text-slate-800">{track.module}</span>
                    {track.completed ? (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        Completed (Score: {track.score}%)
                      </span>
                    ) : (
                      <span className="bg-slate-200 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded">
                        In Progress
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Portfolio / Proof of Work */}
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-600" /> Proof of Work & Sample Workspaces
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedCandidateModal.portfolioLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    onClick={(e) => e.preventDefault()}
                    className="p-3 bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 rounded-xl block transition-all group"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-indigo-700">
                      <span>{link.title}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">{link.category}</p>
                  </a>
                ))}
              </div>
            </div>

            {/* Send Direct Message / Invitation Form */}
            <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                <Send className="w-4 h-4 text-teal-400" /> Send Direct Invitation to {selectedCandidateModal.name}
              </h3>

              {msgSent ? (
                <div className="bg-teal-500/20 border border-teal-500/40 text-teal-200 p-3 rounded-xl text-center text-xs">
                  Message sent successfully! Check your Direct Messages in Portal.
                </div>
              ) : (
                <form onSubmit={handleSendMsgSubmit} className="space-y-3">
                  <textarea
                    rows={3}
                    value={directMsgText}
                    onChange={(e) => setDirectMsgText(e.target.value)}
                    placeholder={`Hi ${selectedCandidateModal.name}! We saw your profile on RemotoOps and would love to invite you to apply for our remote mentorship program...`}
                    className="w-full bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    type="submit"
                    disabled={!directMsgText.trim()}
                    className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl transition-all"
                  >
                    Send Invitation Message
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Candidate Profile Boost Modal ($2 Optional Promotion) */}
      {isBoostModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-800 flex items-center justify-center font-black">
                  ⚡
                </div>
                <h3 className="font-extrabold text-base text-slate-900">Boost My Candidate Profile</h3>
              </div>
              <button onClick={() => setIsBoostModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {boostSuccess ? (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-2xl text-center space-y-1">
                <p className="font-extrabold text-sm">Profile Boost Activated! ⚡</p>
                <p className="text-xs text-emerald-700">Your candidate profile is now pinned with a Featured Top Talent badge for clients.</p>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-2">
                  <span className="text-[10px] font-extrabold text-teal-400 uppercase tracking-wider block">
                    Optional $2 Profile Promotion
                  </span>
                  <p className="text-slate-200 leading-relaxed">
                    Get your profile highlighted in candidate search results for employers seeking entry-level EAs, Admin, and Social Media assistants.
                  </p>
                </div>

                <div className="space-y-2 text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    <span><strong>⚡ Featured Top Talent badge</strong> on your candidate card</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    <span>Priority placement in client candidate searches</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    <span>Highlight Google Workspace, Canva, & Excel tool scores</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 block">One-time Boost</span>
                    <span className="text-lg font-black text-slate-900">$2.00</span>
                  </div>

                  <button
                    onClick={() => handleBoostProfile('cand-1')}
                    className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4" /> Activate Profile Boost ($2)
                  </button>
                </div>

                <p className="text-[10px] text-slate-400 text-center font-medium">
                  Note: Applying for jobs and creating your profile is always 100% FREE. Boosting is strictly optional.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
