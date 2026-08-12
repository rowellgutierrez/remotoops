import React, { useState } from 'react';
import { MentorshipModule, RoleCategory } from '../types';
import { MENTORSHIP_MODULES } from '../data/mockData';
import { 
  GraduationCap, 
  Sparkles, 
  CheckCircle2, 
  BookOpen, 
  Award, 
  Send, 
  Play, 
  MessageSquare, 
  HelpCircle,
  Zap,
  Bot,
  RefreshCw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface MentorshipHubProps {
  onAnalyzePitch: (targetRole: string, draftPitch: string, background?: string) => Promise<any>;
  onGenerateInterviewPrep: (roleType: string, experienceLevel: string) => Promise<any>;
}

export const MentorshipHub: React.FC<MentorshipHubProps> = ({
  onAnalyzePitch,
  onGenerateInterviewPrep
}) => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'pitch_studio' | 'interview_coach'>('roadmap');
  const [selectedRoleCategory, setSelectedRoleCategory] = useState<RoleCategory>('executive_assistant');

  // Module state
  const [modules, setModules] = useState<MentorshipModule[]>(MENTORSHIP_MODULES);
  const [completedSteps, setCompletedSteps] = useState<{ [key: string]: boolean }>({});

  // AI Pitch Studio state
  const [pitchBackground, setPitchBackground] = useState('');
  const [pitchDraft, setPitchDraft] = useState('');
  const [pitchTools, setPitchTools] = useState('Google Workspace, Notion, Slack, Canva');
  const [pitchAnalysisResult, setPitchAnalysisResult] = useState<any>(null);
  const [isAnalyzingPitch, setIsAnalyzingPitch] = useState(false);

  // AI Interview Coach state
  const [interviewRole, setInterviewRole] = useState<RoleCategory>('executive_assistant');
  const [interviewPrepResult, setInterviewPrepResult] = useState<any>(null);
  const [isGeneratingInterview, setIsGeneratingInterview] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const handleToggleStep = (stepKey: string) => {
    setCompletedSteps(prev => ({ ...prev, [stepKey]: !prev[stepKey] }));
  };

  const handleRunPitchStudio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pitchDraft.trim()) return;

    setIsAnalyzingPitch(true);
    try {
      const res = await onAnalyzePitch(selectedRoleCategory, pitchDraft, pitchBackground);
      if (res && res.success && res.data) {
        setPitchAnalysisResult(res.data);
      } else {
        alert(res?.error || "AI service is temporarily unavailable. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("AI service is temporarily unavailable. Please try again.");
    } finally {
      setIsAnalyzingPitch(false);
    }
  };

  const handleRunInterviewPrep = async () => {
    setIsGeneratingInterview(true);
    try {
      const res = await onGenerateInterviewPrep(interviewRole, 'Entry-Level / Mentorship Candidate');
      if (res && res.success && res.data) {
        setInterviewPrepResult(res.data);
        if (res.data.questions && res.data.questions.length > 0) {
          setExpandedQuestion(res.data.questions[0].id);
        }
      } else {
        alert(res?.error || "AI service is temporarily unavailable. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("AI service is temporarily unavailable. Please try again.");
    } finally {
      setIsGeneratingInterview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-teal-500 to-indigo-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full mb-2 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-slate-950" /> Gemini Powered Career Accelerator
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              RemotoOps Mentorship & AI Skill Studio
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Gain practical tool skills for Executive Assistant, Admin Operations, and Social Media roles. Use Gemini AI to optimize your application pitches and master remote interview scenarios.
            </p>
          </div>
        </div>

        {/* Studio Sub-Navigation */}
        <div className="flex gap-2 pt-3 border-t border-slate-800 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'roadmap'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" /> 1. Practical Skill Modules
          </button>

          <button
            onClick={() => setActiveTab('pitch_studio')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'pitch_studio'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" /> 2. AI Pitch & Resume Coach
          </button>

          <button
            onClick={() => setActiveTab('interview_coach')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'interview_coach'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Bot className="w-4 h-4 text-indigo-300" /> 3. AI Remote Interview Simulator
          </button>
        </div>
      </div>

      {/* TAB 1: PRACTICAL SKILL MODULES ROADMAP */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Step-by-Step Tool Mastery Modules</h2>
            
            <div className="flex gap-2 text-xs">
              <button
                onClick={() => setSelectedRoleCategory('executive_assistant')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  selectedRoleCategory === 'executive_assistant'
                    ? 'bg-teal-600 text-white'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                Executive Assistant
              </button>
              <button
                onClick={() => setSelectedRoleCategory('social_media_manager')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  selectedRoleCategory === 'social_media_manager'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                Social Media
              </button>
              <button
                onClick={() => setSelectedRoleCategory('admin_ops')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  selectedRoleCategory === 'admin_ops'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                Admin Ops
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {modules
              .filter(m => m.roleCategory === selectedRoleCategory)
              .map(module => (
                <div key={module.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200 uppercase tracking-wider">
                        {module.duration}
                      </span>
                      <h3 className="text-lg font-extrabold text-slate-900 mt-1">{module.title}</h3>
                      <p className="text-xs text-slate-600 mt-1">{module.description}</p>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 shrink-0">
                      <p className="text-[10px] font-bold text-amber-800 uppercase">Skills Earned:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {module.skillsLearned.map((s, idx) => (
                          <span key={idx} className="bg-white text-amber-900 text-[10px] font-medium px-2 py-0.5 rounded border border-amber-200">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Steps list */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Practical Action Steps & Tool Exercises:</h4>

                    {module.steps.map((step, idx) => {
                      const stepKey = `${module.id}-step-${idx}`;
                      const isDone = !!completedSteps[stepKey];

                      return (
                        <div
                          key={idx}
                          className={`p-4 rounded-xl border transition-all ${
                            isDone ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleToggleStep(stepKey)}
                                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                                  isDone ? 'bg-emerald-600 text-white' : 'border-2 border-slate-300 hover:border-teal-500'
                                }`}
                              >
                                {isDone && <CheckCircle2 className="w-4 h-4" />}
                              </button>

                              <div>
                                <h5 className={`text-xs font-bold ${isDone ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                                  Step {step.stepNumber}: {step.title}
                                </h5>
                                <p className="text-xs text-slate-600 mt-1">{step.details}</p>

                                <div className="mt-2.5 bg-white p-2.5 rounded-lg border border-slate-200/80 text-xs text-slate-800">
                                  <span className="font-bold text-teal-700">Practical Task: </span>
                                  {step.practicalTask}
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-1">
                              {step.recommendedTools.map((tool, tIdx) => (
                                <span key={tIdx} className="bg-slate-200 text-slate-800 text-[10px] font-semibold px-2 py-0.5 rounded">
                                  {tool}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 2: AI PITCH & COVER LETTER STUDIO */}
      {activeTab === 'pitch_studio' && (
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" /> AI Pitch Polish & Resume Studio
            </h2>
            <p className="text-xs text-slate-600">
              New to remote work? Enter your draft cover note or background below. Gemini AI will analyze your remote readiness, give constructive feedback, and rewrite a highly persuasive pitch!
            </p>
          </div>

          <form onSubmit={handleRunPitchStudio} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">Target Remote Role Category:</label>
                <select
                  value={selectedRoleCategory}
                  onChange={(e) => setSelectedRoleCategory(e.target.value as RoleCategory)}
                  className="w-full bg-slate-50 border border-slate-300 text-xs text-slate-800 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="executive_assistant">Executive Assistant (EA)</option>
                  <option value="social_media_manager">Social Media Manager (SMM)</option>
                  <option value="admin_ops">Admin & Support Operations</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">Tools You Know or Are Learning:</label>
                <input
                  type="text"
                  value={pitchTools}
                  onChange={(e) => setPitchTools(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-xs text-slate-800 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g. Google Workspace, Notion, Canva, Asana, Slack"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Your Current Background / Education:</label>
              <input
                type="text"
                value={pitchBackground}
                onChange={(e) => setPitchBackground(e.target.value)}
                placeholder="e.g. Recent Communications graduate with 0 formal corporate experience, but fast learner in Google Calendar and Canva"
                className="w-full bg-slate-50 border border-slate-300 text-xs text-slate-800 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Your Draft Application Pitch / Cover Note:</label>
              <textarea
                rows={4}
                value={pitchDraft}
                onChange={(e) => setPitchDraft(e.target.value)}
                placeholder="Write your rough cover pitch here... e.g. Hi! I want to apply for the Junior EA role. I am very organized and good at managing emails. I am willing to learn under your mentorship..."
                className="w-full bg-slate-50 border border-slate-300 text-xs text-slate-800 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <button
              type="submit"
              disabled={isAnalyzingPitch || !pitchDraft.trim()}
              className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-teal-400" />
              {isAnalyzingPitch ? 'Analyzing & Polishing with Gemini...' : 'Analyze & Upgrade Pitch with AI'}
            </button>

          </form>

          {/* AI Analysis Result Display */}
          {pitchAnalysisResult && (
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 border border-slate-700 space-y-4 animate-in fade-in duration-300">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-teal-400" />
                  <h3 className="font-bold text-base text-white">Gemini AI Pitch Analysis</h3>
                </div>

                <div className="flex items-center gap-2 bg-teal-500/20 px-3 py-1 rounded-full border border-teal-500/30">
                  <span className="text-xs text-teal-300 font-semibold">Remote Readiness Score:</span>
                  <span className="text-sm font-black text-teal-400">{pitchAnalysisResult.score}/100</span>
                </div>
              </div>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
                  <h4 className="font-bold text-emerald-400 uppercase tracking-wider mb-2">Key Strengths Highlighted:</h4>
                  <ul className="space-y-1 text-slate-300 list-disc list-inside">
                    {pitchAnalysisResult.strengths?.map((s: string, idx: number) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
                  <h4 className="font-bold text-amber-400 uppercase tracking-wider mb-2">Areas for Growth:</h4>
                  <ul className="space-y-1 text-slate-300 list-disc list-inside">
                    {pitchAnalysisResult.improvementAreas?.map((i: string, idx: number) => (
                      <li key={idx}>{i}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Rewritten Pitch */}
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-teal-300 text-xs uppercase tracking-wider">
                    ✨ Recommended Optimized Cover Pitch (Copy & Use):
                  </h4>
                  <button
                    onClick={() => navigator.clipboard.writeText(pitchAnalysisResult.rewrittenPitch)}
                    className="text-[11px] font-bold text-slate-300 hover:text-white bg-slate-700 px-2.5 py-1 rounded"
                  >
                    Copy Text
                  </button>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line bg-slate-900/80 p-3 rounded-lg border border-slate-800 font-sans">
                  {pitchAnalysisResult.rewrittenPitch}
                </p>
              </div>

            </div>
          )}

        </div>
      )}

      {/* TAB 3: AI REMOTE SCENARIO INTERVIEW SIMULATOR */}
      {activeTab === 'interview_coach' && (
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Bot className="w-5 h-5 text-indigo-600" /> AI Remote Scenario Interview Coach
            </h2>
            <p className="text-xs text-slate-600">
              Practice real-world situational questions used by global clients during EA, Admin Ops, and Social Media Manager remote interviews. Includes recommended STAR method answer frameworks.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex-1 space-y-1 w-full">
              <label className="text-xs font-bold text-slate-800">Select Role Scenario:</label>
              <select
                value={interviewRole}
                onChange={(e) => setInterviewRole(e.target.value as RoleCategory)}
                className="w-full bg-white border border-slate-300 text-xs text-slate-800 rounded-lg p-2 focus:outline-none"
              >
                <option value="executive_assistant">Executive Assistant (Multi-timezone calendar, Inbox Zero, Travel)</option>
                <option value="social_media_manager">Social Media Manager (Content calendar, Reel hooks, Community Crisis)</option>
                <option value="admin_ops">Admin & Support Ops (Asana board updates, Airtable, SOP writing)</option>
              </select>
            </div>

            <button
              onClick={handleRunInterviewPrep}
              disabled={isGeneratingInterview}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 self-end sm:self-auto"
            >
              <RefreshCw className={`w-4 h-4 ${isGeneratingInterview ? 'animate-spin' : ''}`} />
              {isGeneratingInterview ? 'Generating Scenarios...' : 'Generate AI Interview Scenarios'}
            </button>
          </div>

          {/* Interview Questions List */}
          {interviewPrepResult && interviewPrepResult.questions ? (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">
                Generated Remote Interview Questions & STAR Templates
              </h3>

              {interviewPrepResult.questions.map((q: any) => {
                const isOpen = expandedQuestion === q.id;

                return (
                  <div key={q.id} className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                    <button
                      onClick={() => setExpandedQuestion(isOpen ? null : q.id)}
                      className="w-full text-left p-4 flex items-center justify-between gap-3 hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-start gap-2.5">
                        <HelpCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                        <span className="font-bold text-slate-900 text-xs">{q.question}</span>
                      </div>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                    </button>

                    {isOpen && (
                      <div className="p-4 bg-white border-t border-slate-200 space-y-3 text-xs">
                        
                        <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-lg text-indigo-900">
                          <span className="font-bold">What the Employer is Looking For: </span>
                          {q.whatInterviewerIsLookingFor}
                        </div>

                        {/* STAR Framework */}
                        <div className="space-y-2">
                          <h5 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">STAR Method Answer Framework:</h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                              <span className="font-bold text-indigo-600">S - Situation: </span>{q.starTemplate?.situation}
                            </div>
                            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                              <span className="font-bold text-indigo-600">T - Task: </span>{q.starTemplate?.task}
                            </div>
                            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                              <span className="font-bold text-teal-600">A - Action: </span>{q.starTemplate?.action}
                            </div>
                            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                              <span className="font-bold text-teal-600">R - Result: </span>{q.starTemplate?.result}
                            </div>
                          </div>
                        </div>

                        <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-lg text-amber-900 font-medium">
                          💡 <strong>Pro Tip:</strong> {q.proTip}
                        </div>

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-xs">
              Click "Generate AI Interview Scenarios" above to create customized interview practice questions for your chosen remote role!
            </div>
          )}

        </div>
      )}

    </div>
  );
};
