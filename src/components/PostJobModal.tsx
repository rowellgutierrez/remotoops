import React, { useState } from 'react';
import { JobPost, RoleCategory, TimezoneOverlap, CompensationType, ExperienceLevel } from '../types';
import { X, Sparkles, Send, Briefcase, Zap, ShieldCheck } from 'lucide-react';

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddJob: (job: JobPost) => void;
  onEnhanceJobWithAI: (data: any) => Promise<any>;
}

export const PostJobModal: React.FC<PostJobModalProps> = ({
  isOpen,
  onClose,
  onAddJob,
  onEnhanceJobWithAI
}) => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [clientName, setClientName] = useState('Sarah Jenkins');
  const [clientTitle, setClientTitle] = useState('Founder / Chief of Staff');
  const [clientLocation, setClientLocation] = useState('Remote Worldwide');
  const [roleCategory, setRoleCategory] = useState<RoleCategory>('executive_assistant');
  const [compensation, setCompensation] = useState('$800 - $1,200 / month Stipend');
  const [compensationType, setCompensationType] = useState<CompensationType>('paid_stipend');
  const [hoursPerWeek, setHoursPerWeek] = useState('20 hrs/week');
  const [timezone, setTimezone] = useState<TimezoneOverlap>('EST (UTC-5)');
  const [mentorName, setMentorName] = useState('Sarah Jenkins');
  const [mentorRole, setMentorRole] = useState('Direct 1-on-1 Weekly Executive Coaching');
  const [description, setDescription] = useState('');
  const [toolsInput, setToolsInput] = useState('Google Workspace, Notion, Slack, Loom');
  const [selectedTier, setSelectedTier] = useState<'FREE' | 'PRO' | 'BUSINESS'>('FREE');
  const [isFeaturedUpgrade, setIsFeaturedUpgrade] = useState(true);

  // New application method & experience level fields
  const [applicationMethod, setApplicationMethod] = useState<'direct' | 'external'>('direct');
  const [externalApplyUrl, setExternalApplyUrl] = useState('');
  const [experienceLevelNum, setExperienceLevelNum] = useState<ExperienceLevel>('no_experience');

  const [isEnhancing, setIsEnhancing] = useState(false);
  const [aiEnhancedData, setAiEnhancedData] = useState<any>(null);

  if (!isOpen) return null;

  const handleRunAiEnhance = async () => {
    if (!title.trim() && !description.trim()) return;

    setIsEnhancing(true);
    try {
      const res = await onEnhanceJobWithAI({
        title,
        company,
        roleType: roleCategory,
        rawDescription: description,
        mentorshipGoals: `Hands-on training for entry-level remote talent in ${roleCategory}`
      });

      if (res && res.success && res.data) {
        setAiEnhancedData(res.data);
        if (res.data.enhancedTitle) setTitle(res.data.enhancedTitle);
        if (res.data.summary) setDescription(res.data.summary);
      } else {
        alert(res?.error || "AI service is temporarily unavailable. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("AI service is temporarily unavailable. Please try again.");
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !company.trim()) return;

    // Validate external URL if external application selected
    if (applicationMethod === 'external') {
      if (!externalApplyUrl.trim() || (!externalApplyUrl.startsWith('http://') && !externalApplyUrl.startsWith('https://'))) {
        alert('Please enter a valid company website URL starting with http:// or https://');
        return;
      }
    }

    // Proactive Scam & Safety Validation Check
    const lowerText = `${title} ${description} ${compensation}`.toLowerCase();
    const scamTerms = [
      'pay fee', 'registration fee', 'training fee', 'buy equipment', 'payment required',
      'wire transfer', 'crypto deposit', 'send money', 'bank password', 'credit card number',
      'ssn', 'cashier check', 'money order', 'deposit money'
    ];
    const foundScamTerm = scamTerms.find(term => lowerText.includes(term));
    if (foundScamTerm) {
      alert(`Safety Policy Violation: Your posting contains text associated with recruitment scams ("${foundScamTerm}"). RemotoOps strictly prohibits asking applicants for payments, fees, financial deposits, or sensitive credentials.`);
      return;
    }

    const toolsArr = toolsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const newJob: JobPost = {
      id: `job-${Date.now()}`,
      title,
      company,
      companyLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&auto=format&fit=crop&q=80',
      clientName,
      clientTitle,
      clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      clientLocation,
      roleCategory,
      compensation,
      compensationType,
      hoursPerWeek,
      timezone,
      mentorName,
      mentorRole,
      isMentorshipGuaranteed: true,
      isOpenToZeroExperience: experienceLevelNum === 'no_experience' || experienceLevelNum === 'beginner',
      isVerifiedSafeClient: true,
      description,
      responsibilities: [
        'Assist with daily operational tasks and multi-timezone schedules',
        'Maintain async documentation and team project boards',
        'Participate in weekly 1-on-1 mentorship feedback sessions'
      ],
      learningOutcomes: aiEnhancedData?.mentorshipHighlights || [
        `Master essential remote tools for ${roleCategory}`,
        'Build real-world client workflow experience',
        'Receive formal letter of recommendation upon internship completion'
      ],
      requiredTools: toolsArr.length > 0 ? toolsArr : ['Google Workspace', 'Notion', 'Slack'],
      postedDate: 'Just now',
      applicantCount: 0,
      featured: isFeaturedUpgrade || selectedTier !== 'FREE',

      // Application Method & Experience fields
      applicationMethod,
      externalApplyUrl: applicationMethod === 'external' ? externalApplyUrl.trim() : undefined,
      experienceLevelNum,
      jobStatus: 'OPEN',
      viewsCount: 0,
      savesCount: 0,
      applicationsCount: 0
    };

    onAddJob(newJob);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 md:p-8 space-y-6">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-teal-600" /> Post Remote Mentorship Opportunity
            </h2>
            <p className="text-xs text-slate-500">Global clients post remote internships for entry-level EAs, Admin, and Social Media talent.</p>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-800">Job / Role Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Junior Executive Assistant Intern"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-800">Company / Studio Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Apex Global Ventures"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* APPLICATION METHOD & EXPERIENCE LEVEL */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">Application Method *</label>
                <div className="flex gap-2 pt-1">
                  <label className={`flex-1 p-2 rounded-lg border text-center cursor-pointer transition-all ${
                    applicationMethod === 'direct' ? 'bg-teal-50 border-teal-500 text-teal-900 font-bold' : 'bg-white border-slate-300 text-slate-600'
                  }`}>
                    <input
                      type="radio"
                      name="appMethod"
                      value="direct"
                      checked={applicationMethod === 'direct'}
                      onChange={() => setApplicationMethod('direct')}
                      className="sr-only"
                    />
                    Apply on RemotoOps
                  </label>
                  <label className={`flex-1 p-2 rounded-lg border text-center cursor-pointer transition-all ${
                    applicationMethod === 'external' ? 'bg-teal-50 border-teal-500 text-teal-900 font-bold' : 'bg-white border-slate-300 text-slate-600'
                  }`}>
                    <input
                      type="radio"
                      name="appMethod"
                      value="external"
                      checked={applicationMethod === 'external'}
                      onChange={() => setApplicationMethod('external')}
                      className="sr-only"
                    />
                    Apply on Company Website
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">Experience Level Required *</label>
                <select
                  value={experienceLevelNum}
                  onChange={(e) => setExperienceLevelNum(e.target.value as ExperienceLevel)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none"
                >
                  <option value="no_experience">No Experience Required / Entry Level</option>
                  <option value="beginner">Beginner (0-1 Year)</option>
                  <option value="1_2_years">1+ Years Experience</option>
                  <option value="3_5_years">3+ Years Experience</option>
                  <option value="5_plus_years">5+ Years Senior</option>
                </select>
              </div>
            </div>

            {applicationMethod === 'external' && (
              <div className="space-y-1 pt-1">
                <label className="font-bold text-slate-800 block">Employer External Application URL *</label>
                <input
                  type="url"
                  required={applicationMethod === 'external'}
                  placeholder="https://company.com/careers/apply"
                  value={externalApplyUrl}
                  onChange={(e) => setExternalApplyUrl(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <p className="text-[10px] text-slate-500">
                  Applicants clicking "Apply" will be informed and redirected to your company website or ATS portal in a new tab.
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-800">Role Category *</label>
              <select
                value={roleCategory}
                onChange={(e) => setRoleCategory(e.target.value as RoleCategory)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none"
              >
                <option value="executive_assistant">Executive Assistant (EA)</option>
                <option value="social_media_manager">Social Media Manager (SMM)</option>
                <option value="admin_ops">Admin & Support Operations</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-800">Compensation *</label>
              <input
                type="text"
                placeholder="e.g. $800 / month Stipend"
                value={compensation}
                onChange={(e) => setCompensation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-800">Timezone / Overlap *</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value as TimezoneOverlap)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none"
              >
                <option value="EST (UTC-5)">EST (UTC-5)</option>
                <option value="PST (UTC-8)">PST (UTC-8)</option>
                <option value="GMT/BST (UTC+0)">GMT/BST (UTC+0)</option>
                <option value="CET (UTC+1)">CET (UTC+1)</option>
                <option value="SGT/PHT (UTC+8)">SGT/PHT (UTC+8)</option>
                <option value="Flexible / Async">Flexible / Async</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-800">Assigned Mentor Name *</label>
              <input
                type="text"
                value={mentorName}
                onChange={(e) => setMentorName(e.target.value)}
                placeholder="e.g. Sarah Jenkins"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-800">Tools Required (comma-separated)</label>
              <input
                type="text"
                value={toolsInput}
                onChange={(e) => setToolsInput(e.target.value)}
                placeholder="Google Workspace, Notion, Slack, Canva"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800">Role Description & Mentorship Expectations:</label>
              <button
                type="button"
                onClick={handleRunAiEnhance}
                disabled={isEnhancing || (!title && !description)}
                className="text-[11px] font-bold text-teal-700 hover:text-teal-900 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200 flex items-center gap-1 disabled:opacity-40"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                {isEnhancing ? 'Enhancing with Gemini...' : 'AI Structure & Polish'}
              </button>
            </div>

            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what the intern will learn, key tasks, and weekly feedback structure..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Employer Subscription Tier Selection */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-3 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xs text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-400" /> Employer Hiring Plan Selection
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Job Seekers apply for $0 FREE</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setSelectedTier('FREE')}
                className={`p-2.5 rounded-xl border font-bold transition-all text-left space-y-0.5 ${
                  selectedTier === 'FREE'
                    ? 'bg-teal-500/20 border-teal-500 text-teal-300'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="text-[11px]">Free Tier</div>
                <div className="text-sm font-black">$0 / mo</div>
                <div className="text-[9px] text-slate-400 font-normal">1 active listing</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTier('PRO')}
                className={`p-2.5 rounded-xl border font-bold transition-all text-left space-y-0.5 ${
                  selectedTier === 'PRO'
                    ? 'bg-teal-500/20 border-teal-500 text-teal-300'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="text-[11px] text-teal-400 font-extrabold">Pro Tier ⭐</div>
                <div className="text-sm font-black">$6 / mo</div>
                <div className="text-[9px] text-slate-400 font-normal">10 active listings</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTier('BUSINESS')}
                className={`p-2.5 rounded-xl border font-bold transition-all text-left space-y-0.5 ${
                  selectedTier === 'BUSINESS'
                    ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="text-[11px] text-indigo-400 font-extrabold">Business</div>
                <div className="text-sm font-black">$16 / mo</div>
                <div className="text-[9px] text-slate-400 font-normal">Unlimited listings</div>
              </button>
            </div>

            {/* Featured Job Addon Checkbox */}
            <label className="flex items-center justify-between p-3 bg-slate-800/90 rounded-xl border border-slate-700 cursor-pointer hover:bg-slate-800 transition-colors">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={isFeaturedUpgrade}
                  onChange={(e) => setIsFeaturedUpgrade(e.target.checked)}
                  className="w-4 h-4 rounded text-teal-500 focus:ring-teal-500 accent-teal-500"
                />
                <div>
                  <span className="font-bold text-xs text-amber-300 flex items-center gap-1">
                    💎 Add Featured Top Placement ($3 Boost)
                  </span>
                  <p className="text-[10px] text-slate-400">
                    Pins listing at top of candidate search results for 7 days.
                  </p>
                </div>
              </div>
              <span className="text-xs font-black text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                +$3.00
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" /> Publish Mentorship Job Posting
          </button>

        </form>

      </div>
    </div>
  );
};
