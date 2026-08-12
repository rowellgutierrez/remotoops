import React, { useState } from 'react';
import { RoleCategory, ROLE_CATEGORY_LABELS } from '../types';
import { 
  FileText, 
  Sparkles, 
  Copy, 
  Download, 
  CheckCircle2, 
  HelpCircle, 
  BookOpen, 
  Wand2, 
  Zap,
  Check,
  AlertCircle
} from 'lucide-react';

export const ATSResumeSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tutorial' | 'builder'>('builder');

  // Generator State
  const [fullName, setFullName] = useState('Alex Rivers');
  const [email, setEmail] = useState('alex.rivers@email.com');
  const [phone, setPhone] = useState('+63 917 123 4567');
  const [location, setLocation] = useState('Manila, Philippines');
  const [portfolioUrl, setPortfolioUrl] = useState('linkedin.com/in/alex-rivers-remote');
  const [targetCategory, setTargetCategory] = useState<RoleCategory>('executive_assistant');

  const [summary, setSummary] = useState(
    'Highly organized, self-motivated Remote Executive Assistant Trainee skilled in Google Workspace, Notion workflow design, and multi-timezone calendar coordination. Experienced in drafting executive email briefings and creating Standard Operating Procedures (SOPs).'
  );

  const [selectedTools, setSelectedTools] = useState<string[]>([
    'Google Workspace (Calendar, Gmail, Docs, Sheets)',
    'Notion',
    'Slack & Loom',
    'Canva Pro Basics',
    'Calendly'
  ]);

  const [projectTitle1, setProjectTitle1] = useState('Multi-Timezone Executive Calendar & Meeting Conflict Resolution SOP');
  const [projectDesc1, setProjectDesc1] = useState('Designed a multi-timezone Google Calendar workflow for 3 remote executives across PST, EST, and GMT. Built buffer-time focus blocks and automated meeting confirmations via Calendly.');

  const [projectTitle2, setProjectTitle2] = useState('C-Suite Email Priority Triage & Inbox Zero Framework');
  const [projectDesc2, setProjectDesc2] = useState('Categorized 50+ mock executive emails using color-coded priority labels in Gmail. Drafted concise 3-sentence daily briefings and action-item summaries.');

  const [education, setEducation] = useState('B.S. Communications / RemotoOps Remote Executive Assistant Mentorship Certification');

  const [isCopied, setIsCopied] = useState(false);

  // Available Tools Pool
  const ALL_TOOLS = [
    'Google Workspace (Calendar, Gmail, Docs, Sheets)',
    'Notion Knowledge Management',
    'Slack & Loom Async Communication',
    'Canva Pro Graphics Design',
    'Zendesk & Intercom Live Chat',
    'Asana & Trello Project Boards',
    'Airtable Relational Databases',
    'Zapier & Make No-Code Automation',
    'LinkedIn Sales Navigator & Apollo.io',
    'QuickBooks Online & Excel Bookkeeping',
    'CapCut Short-Form Video Editing',
    'Substack & Mailchimp Email Newsletters'
  ];

  const handleToggleTool = (tool: string) => {
    if (selectedTools.includes(tool)) {
      setSelectedTools(selectedTools.filter(t => t !== tool));
    } else {
      setSelectedTools([...selectedTools, tool]);
    }
  };

  const handleGenerateSummary = () => {
    const roleTitle = ROLE_CATEGORY_LABELS[targetCategory];
    setSummary(
      `Enthusiastic, detail-driven ${roleTitle} Trainee eager to contribute strong organizational skills, rapid software adaptiveness, and async reliability to a global remote team. Certified through RemotoOps practical modules in tool mastery and SOP creation with zero corporate bad habits.`
    );
  };

  const generateATSPlainText = () => {
    return `${fullName.toUpperCase()}
${email} | ${phone} | ${location} | ${portfolioUrl}

OBJECTIVE & PROFESSIONAL SUMMARY
${summary}

CORE TECHNICAL COMPETENCIES & REMOTE TOOLS
${selectedTools.map(t => `• ${t}`).join('\n')}

PRACTICAL VIRTUAL PROJECTS & SOPS CREATED
1. ${projectTitle1}
   • ${projectDesc1}

2. ${projectTitle2}
   • ${projectDesc2}

EDUCATION, CERTIFICATIONS & TRAINING
• ${education}
• RemotoOps Global Remote Talent Program (Passed Tool Proficiency Verification)
`;
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(generateATSPlainText());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const element = document.createElement('a');
    const file = new Blob([generateATSPlainText()], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${fullName.replaceAll(' ', '_')}_ATS_Resume.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-teal-500/20 text-teal-300 text-xs font-bold px-3 py-1 rounded-full border border-teal-500/30 uppercase tracking-wider mb-2">
              <FileText className="w-4 h-4 text-teal-400" /> Free ATS Resume Tool for Beginners
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              ATS-Friendly Resume Builder & No-Experience Tutorial
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Learn how Applicant Tracking Systems work and format your self-taught projects into a clean, 100% ATS-optimized resume that gets noticed by remote employers!
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('builder')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'builder'
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Wand2 className="w-4 h-4 inline mr-1.5" /> Interactive Generator
            </button>
            <button
              onClick={() => setActiveTab('tutorial')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'tutorial'
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <BookOpen className="w-4 h-4 inline mr-1.5" /> ATS Masterclass Guide
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: INTERACTIVE BUILDER */}
      {activeTab === 'builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Form Column */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-teal-600" /> Input Your Contact & Project Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-800">Full Name:</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800">Target Remote Role:</label>
                <select
                  value={targetCategory}
                  onChange={(e) => setTargetCategory(e.target.value as RoleCategory)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {Object.entries(ROLE_CATEGORY_LABELS).map(([k, label]) => (
                    <option key={k} value={k}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800">Email Address:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 mt-1 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800">Phone / WhatsApp:</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 mt-1 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800">City, Country:</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 mt-1 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800">LinkedIn or Portfolio URL:</label>
                <input
                  type="text"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 mt-1 focus:outline-none"
                />
              </div>
            </div>

            {/* Professional Summary & Auto Generate */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">Professional Summary:</label>
                <button
                  onClick={handleGenerateSummary}
                  className="text-[11px] font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Auto-Suggest Summary
                </button>
              </div>
              <textarea
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Tool Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Select Tools You Mastered / Self-Taught:</label>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                {ALL_TOOLS.map(t => {
                  const isSel = selectedTools.includes(t);
                  return (
                    <button
                      type="button"
                      key={t}
                      onClick={() => handleToggleTool(t)}
                      className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-all ${
                        isSel 
                          ? 'bg-teal-600 text-white shadow-sm'
                          : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {isSel ? '✓ ' : '+ '}{t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Projects & Virtual SOPs (Framing No Experience) */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Virtual Projects & SOPs Created (Framing No Experience):
                </label>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 text-xs">
                <input
                  type="text"
                  value={projectTitle1}
                  onChange={(e) => setProjectTitle1(e.target.value)}
                  placeholder="Project 1 Title"
                  className="w-full font-bold bg-white border border-slate-300 rounded p-1.5 focus:outline-none"
                />
                <textarea
                  rows={2}
                  value={projectDesc1}
                  onChange={(e) => setProjectDesc1(e.target.value)}
                  placeholder="Project 1 Details & Tools Used..."
                  className="w-full bg-white border border-slate-300 rounded p-1.5 focus:outline-none text-[11px]"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 text-xs">
                <input
                  type="text"
                  value={projectTitle2}
                  onChange={(e) => setProjectTitle2(e.target.value)}
                  placeholder="Project 2 Title"
                  className="w-full font-bold bg-white border border-slate-300 rounded p-1.5 focus:outline-none"
                />
                <textarea
                  rows={2}
                  value={projectDesc2}
                  onChange={(e) => setProjectDesc2(e.target.value)}
                  placeholder="Project 2 Details & Tools Used..."
                  className="w-full bg-white border border-slate-300 rounded p-1.5 focus:outline-none text-[11px]"
                />
              </div>
            </div>

            {/* Education */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Education & Training:</label>
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs focus:outline-none"
              />
            </div>

          </div>

          {/* Right Live ATS Plain Text Preview Column */}
          <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 border border-slate-800 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal-400" />
                  <h3 className="font-bold text-sm text-white">Live ATS-Compliant Plain Text Resume</h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyText}
                    className="bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition-all flex items-center gap-1.5"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {isCopied ? 'Copied!' : 'Copy Text'}
                  </button>

                  <button
                    onClick={handleDownloadTxt}
                    className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-teal-500/20"
                  >
                    <Download className="w-3.5 h-3.5" /> Download .TXT
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/90 font-mono text-[11px] leading-relaxed text-slate-300 whitespace-pre-wrap max-h-[500px] overflow-y-auto selection:bg-teal-500 selection:text-slate-950">
                {generateATSPlainText()}
              </div>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-[11px] text-slate-300 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Why this passes ATS bots:</strong> Zero graphics, standard section headers, top-to-bottom layout, and high density of keyword tools!
              </span>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: ATS MASTERCLASS TUTORIAL */}
      {activeTab === 'tutorial' && (
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" /> How to Build an ATS-Friendly Resume Without Corporate Experience
            </h2>
            <p className="text-xs text-slate-600">
              75% of job applications are automatically rejected by Applicant Tracking System (ATS) software before a human ever reads them. Here is how to guarantee 100% readability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs">1</span>
                Strict Formatting Rules
              </h3>
              <p className="text-slate-600 leading-relaxed">
                ATS bots parse plain text line-by-line. Never use columns, graphic design bars, headshot photos, tables, or complex PDF elements from Canva templates. Stick to clean, single-column plain text layouts.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs">2</span>
                Standard Section Titles
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Use standard headings that software recognizes: <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-900 font-mono">PROFESSIONAL SUMMARY</code>, <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-900 font-mono">TECHNICAL TOOLS</code>, <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-900 font-mono">PRACTICAL PROJECTS</code>, and <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-900 font-mono">EDUCATION</code>. Avoid creative names like "My Journey" or "Stuff I Do".
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs">3</span>
                Frame Personal Projects as "Practical SOPs"
              </h3>
              <p className="text-slate-600 leading-relaxed">
                If you have no client experience, don't leave the experience section empty! Highlight mock projects, Google Workspace SOPs, Canva brand kits, or Zendesk ticket simulations built during training.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs">4</span>
                Use Strong Action Verbs & Software Names
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Start bullet points with active verbs: <em>Coordinated, Engineered, Curated, Audited, Optimized, Synthesized</em>. Always mention specific software names (Google Calendar, Notion, Canva, Asana, Zendesk).
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
