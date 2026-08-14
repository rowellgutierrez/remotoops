import React, { useState } from 'react';
import { JobPost, RoleCategory, TimezoneOverlap, CompensationType, ExperienceLevel, UserAccount } from '../types';
import { X, Sparkles, Send, Briefcase, Zap, ShieldCheck, AlertCircle, Building2 } from 'lucide-react';

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddJob: (job: JobPost) => void;
  onEnhanceJobWithAI: (data: any) => Promise<any>;
  currentUser?: UserAccount | null;
  onOpenAuthModal?: (mode?: 'login' | 'signup') => void;
  onOpenPricingModal?: () => void;
}

const COMMON_ROLE_SUGGESTIONS = [
  'Executive Assistant (EA)',
  'Virtual Assistant (VA)',
  'Social Media Manager (SMM)',
  'Customer Support & Chat Specialist',
  'Data Entry Specialist',
  'Bookkeeper / Accounting Assistant',
  'Lead Generation Specialist',
  'Graphic Designer',
  'Video Editor / Content Creator',
  'Project Coordinator',
  'Administrative Support Specialist',
  'Sales Development Representative (SDR)',
  'Content Writer & Copywriter',
  'E-commerce Store Manager',
  'Community & Discord Moderator',
  'Operations Coordinator'
];

export const PostJobModal: React.FC<PostJobModalProps> = ({
  isOpen,
  onClose,
  onAddJob,
  onEnhanceJobWithAI,
  currentUser,
  onOpenAuthModal,
  onOpenPricingModal
}) => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState(currentUser?.companyName || '');
  const [clientName, setClientName] = useState(currentUser?.name || 'Hiring Manager');
  const [clientTitle, setClientTitle] = useState('Founder / Team Lead');
  const [clientLocation, setClientLocation] = useState('100% Remote / Worldwide');
  const [customRoleCategory, setCustomRoleCategory] = useState('Executive Assistant (EA)');
  const [compensation, setCompensation] = useState('$800 - $1,500 / month');
  const [compensationType, setCompensationType] = useState<CompensationType>('paid_stipend');
  const [hoursPerWeek, setHoursPerWeek] = useState('Full-time (40 hrs/wk)');
  const [timezone, setTimezone] = useState<TimezoneOverlap>('Flexible / Async');
  const [mentorName, setMentorName] = useState(currentUser?.name || 'Direct Supervisor');
  const [mentorRole, setMentorRole] = useState('Senior Mentor & Direct Coach');
  const [description, setDescription] = useState('');
  const [toolsInput, setToolsInput] = useState('Google Workspace, Slack, Notion');

  // Application method & experience level fields
  const [applicationMethod, setApplicationMethod] = useState<'direct' | 'external'>('direct');
  const [externalApplyUrl, setExternalApplyUrl] = useState('');
  const [experienceLevelNum, setExperienceLevelNum] = useState<ExperienceLevel>('beginner');

  const [isEnhancing, setIsEnhancing] = useState(false);
  const [aiEnhancedData, setAiEnhancedData] = useState<any>(null);

  if (!isOpen) return null;

  // Authorization validation: if user is not logged in or is a candidate
  const isAuthorizedEmployer = currentUser && (
    currentUser.role === 'client' || 
    currentUser.role === 'employer' || 
    currentUser.role === 'admin'
  );

  const handleRunAiEnhance = async () => {
    if (!title.trim() && !description.trim()) return;

    setIsEnhancing(true);
    try {
      const res = await onEnhanceJobWithAI({
        title,
        company,
        roleType: customRoleCategory,
        rawDescription: description,
        mentorshipGoals: `Hands-on training and career growth for remote talent in ${customRoleCategory}`
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

    // Map custom role to standard RoleCategory or fallback to general
    let mappedCategory: RoleCategory = 'general';
    const lowerCategory = customRoleCategory.toLowerCase();
    if (lowerCategory.includes('executive') || lowerCategory.includes('ea')) mappedCategory = 'executive_assistant';
    else if (lowerCategory.includes('admin') || lowerCategory.includes('virtual assistant') || lowerCategory.includes('va')) mappedCategory = 'admin_ops';
    else if (lowerCategory.includes('social') || lowerCategory.includes('smm')) mappedCategory = 'social_media_manager';
    else if (lowerCategory.includes('customer') || lowerCategory.includes('support')) mappedCategory = 'customer_support';
    else if (lowerCategory.includes('data') || lowerCategory.includes('lead')) mappedCategory = 'data_lead_gen';
    else if (lowerCategory.includes('design') || lowerCategory.includes('video')) mappedCategory = 'creative_design';
    else if (lowerCategory.includes('tech') || lowerCategory.includes('web') || lowerCategory.includes('dev')) mappedCategory = 'tech_web_ops';
    else if (lowerCategory.includes('writ') || lowerCategory.includes('content')) mappedCategory = 'content_writing';
    else if (lowerCategory.includes('book') || lowerCategory.includes('ecom')) mappedCategory = 'ecom_bookkeeping';
    else if (lowerCategory.includes('mod') || lowerCategory.includes('discord')) mappedCategory = 'community_mod';

    const newJob: JobPost = {
      id: `job-${Date.now()}`,
      title,
      company,
      companyLogo: '',
      clientName: clientName.trim() || company,
      clientTitle: clientTitle.trim() || 'Hiring Manager',
      clientAvatar: '',
      clientLocation: clientLocation.trim() || '100% Remote / Worldwide',
      roleCategory: mappedCategory,
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
        'Collaborate with remote team members across asynchronous channels',
        'Execute core tasks and deliver regular project updates',
        'Maintain high attention to detail and clear communication'
      ],
      learningOutcomes: aiEnhancedData?.mentorshipHighlights || [
        `Master essential remote workflows in ${customRoleCategory}`,
        'Build real-world professional portfolio deliverables',
        'Receive direct guidance and feedback from experienced team leads'
      ],
      requiredTools: toolsArr.length > 0 ? toolsArr : ['Google Workspace', 'Slack', 'Notion'],
      postedDate: 'Just now',
      applicantCount: 0,
      featured: false,

      // Application Method & Experience fields
      applicationMethod,
      externalApplyUrl: applicationMethod === 'external' ? externalApplyUrl.trim() : undefined,
      experienceLevelNum,
      jobStatus: 'OPEN',
      viewsCount: 0,
      savesCount: 0,
      applicationsCount: 0,
      postedBy: currentUser?.id || 'employer'
    };

    onAddJob(newJob);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-teal-600" /> Post Remote Job Opening
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Reach thousands of qualified remote candidates looking for immediate work.</p>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Access Notice if not authenticated or not employer */}
        {!currentUser ? (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-900 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-950">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Employer Sign-In Required</span>
            </div>
            <p className="text-amber-800">
              To post jobs and prevent recruitment spam, please sign in or register as an employer.
            </p>
            {onOpenAuthModal && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAuthModal('login');
                }}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-lg transition-colors inline-block text-[11px]"
              >
                Sign In as Employer
              </button>
            )}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-800">Job / Role Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Remote Executive Assistant"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-800">Company / Organization *</label>
              <input
                type="text"
                required
                placeholder="e.g. Apex Media Group"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              />
            </div>
          </div>

          {/* ROLE CATEGORY — Free form text input with common recommendations */}
          <div className="space-y-1.5 bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900">Role Category / Department *</label>
              <span className="text-[11px] text-slate-500 font-medium">Type any job role or select below</span>
            </div>
            
            <input
              type="text"
              required
              placeholder="e.g. Executive Assistant, Customer Support, Social Media, Bookkeeper..."
              value={customRoleCategory}
              onChange={(e) => setCustomRoleCategory(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold text-xs"
            />

            {/* Quick click suggestions */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {COMMON_ROLE_SUGGESTIONS.slice(0, 8).map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setCustomRoleCategory(suggestion)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all ${
                    customRoleCategory === suggestion
                      ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-teal-400 hover:text-teal-700'
                  }`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* APPLICATION METHOD & EXPERIENCE LEVEL */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">Application Method *</label>
                <div className="flex gap-2 pt-1">
                  <label className={`flex-1 p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                    applicationMethod === 'direct' ? 'bg-teal-50 border-teal-500 text-teal-950 font-bold shadow-xs' : 'bg-white border-slate-300 text-slate-600'
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
                  <label className={`flex-1 p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                    applicationMethod === 'external' ? 'bg-teal-50 border-teal-500 text-teal-950 font-bold shadow-xs' : 'bg-white border-slate-300 text-slate-600'
                  }`}>
                    <input
                      type="radio"
                      name="appMethod"
                      value="external"
                      checked={applicationMethod === 'external'}
                      onChange={() => setApplicationMethod('external')}
                      className="sr-only"
                    />
                    Company Website / ATS
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">Experience Requirement *</label>
                <select
                  value={experienceLevelNum}
                  onChange={(e) => setExperienceLevelNum(e.target.value as ExperienceLevel)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none font-medium text-xs mt-1"
                >
                  <option value="no_experience">No Experience Required / Entry Level</option>
                  <option value="beginner">Beginner (0-1 Year)</option>
                  <option value="1_2_years">1-2 Years Experience</option>
                  <option value="3_5_years">3-5 Years Mid-Level</option>
                  <option value="5_plus_years">5+ Years Senior</option>
                </select>
              </div>
            </div>

            {applicationMethod === 'external' && (
              <div className="space-y-1 pt-1">
                <label className="font-bold text-slate-800 block">Company Application URL *</label>
                <input
                  type="url"
                  required={applicationMethod === 'external'}
                  placeholder="https://yourcompany.com/careers/apply"
                  value={externalApplyUrl}
                  onChange={(e) => setExternalApplyUrl(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-800">Compensation *</label>
              <input
                type="text"
                placeholder="e.g. $1,000 - $1,500 / month"
                value={compensation}
                onChange={(e) => setCompensation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-800">Job Type *</label>
              <select
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none font-medium"
              >
                <option value="Full-time (40 hrs/wk)">Full-time (40 hrs/wk)</option>
                <option value="Part-time (20 hrs/wk)">Part-time (20 hrs/wk)</option>
                <option value="Contract / Freelance">Contract / Freelance</option>
                <option value="Flexible / Hourly">Flexible / Hourly</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-800">Timezone / Location *</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value as TimezoneOverlap)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none font-medium"
              >
                <option value="Flexible / Async">Flexible / Async (Worldwide)</option>
                <option value="EST (UTC-5)">EST (UTC-5)</option>
                <option value="PST (UTC-8)">PST (UTC-8)</option>
                <option value="GMT/BST (UTC+0)">GMT/BST (UTC+0)</option>
                <option value="CET (UTC+1)">CET (UTC+1)</option>
                <option value="SGT/PHT (UTC+8)">SGT/PHT (UTC+8)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-800">Tools Required (comma-separated)</label>
            <input
              type="text"
              value={toolsInput}
              onChange={(e) => setToolsInput(e.target.value)}
              placeholder="Google Workspace, Slack, Notion, Canva, Loom"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none font-medium"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800">Role Description & Expectations:</label>
              <button
                type="button"
                onClick={handleRunAiEnhance}
                disabled={isEnhancing || (!title && !description)}
                className="text-[11px] font-bold text-teal-700 hover:text-teal-900 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200 flex items-center gap-1 disabled:opacity-40"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                {isEnhancing ? 'Polishing with AI...' : 'AI Polish & Format'}
              </button>
            </div>

            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe daily responsibilities, skills, team culture, and how the applicant will contribute..."
              className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
            />
          </div>

          {/* Employer Hiring Guarantee Note */}
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-slate-600 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Job Seekers apply for <strong className="text-teal-800">100% Free</strong>. No applicant fees allowed.</span>
            </div>
            {onOpenPricingModal && (
              <button
                type="button"
                onClick={onOpenPricingModal}
                className="text-xs font-bold text-teal-700 hover:underline shrink-0"
              >
                View Hiring Plans
              </button>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" /> Publish Job Posting
          </button>

        </form>

      </div>
    </div>
  );
};
