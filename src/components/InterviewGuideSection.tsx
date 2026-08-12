import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  Video, 
  Mic, 
  Wifi, 
  Sun, 
  MessageSquare, 
  ChevronDown, 
  ChevronUp, 
  Zap,
  HelpCircle as HelpIcon,
  Smile
} from 'lucide-react';

export const InterviewGuideSection: React.FC = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const QUESTIONS_AND_ANSWERS = [
    {
      q: "1. Why should we hire you if you have no prior corporate or client experience?",
      why: "The client wants to see self-confidence, self-awareness, and high motivation without defensive excuses.",
      answer: "While I am launching my remote career, I bring fresh energy, zero bad habits, and structured training in tools like Google Workspace, Notion, and Slack. I have spent the last month building real Standard Operating Procedures, like multi-timezone calendar scheduling and Inbox Zero triage. Because I am hungry to learn, you get a dedicated team member who adapts quickly to your exact workflows."
    },
    {
      q: "2. How do you handle a situation where you get stuck or don't know how to use a tool?",
      why: "Clients fear hiring someone who sits silently for hours waiting to be spoon-fed answers.",
      answer: "I follow a '15-minute search first' rule. I inspect help documentations, search YouTube tutorials, or test the tool in a sandbox environment. If I am still stuck, I send a concise Loom video or Slack message stating: 'Here is what I am trying to achieve, here is what I tried, and here is where I need guidance.' This saves time while showing proactive initiative."
    },
    {
      q: "3. How do you manage your time when working asynchronously across different time zones?",
      why: "The interviewer wants proof that you can work independently without constant supervision.",
      answer: "I rely on written checklists in Notion or Asana and send daily end-of-day Loom/Slack summaries. At the end of every shift, I log completed tasks, pending items, and any blockers so my team wakes up to total clarity without needing live sync meetings."
    },
    {
      q: "4. Tell me about a tool or project you mastered completely on your own.",
      why: "Tests your self-directed learning ability and technical curiosity.",
      answer: "I taught myself Canva Pro and Metricool by building a 30-day concept content calendar for a tech brand. I studied brand typography rules, short-form video hooks, and post scheduling algorithms. I published my project as a public Notion portfolio page."
    },
    {
      q: "5. How do you handle constructive criticism or feedback when a client edits your work?",
      why: "Tests emotional intelligence and coachability.",
      answer: "I view feedback as free coaching! When a client requests edits, I acknowledge the feedback promptly, update our team SOPs so I don't repeat the mistake, and resubmit the revised work ahead of deadline."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-slate-800 space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-indigo-500/20 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full border border-indigo-500/30 uppercase tracking-wider">
          <Bot className="w-4 h-4 text-indigo-400" /> Remote Interview Masterclass
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          How to Excel in Job Interviews with Zero Corporate Experience
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
          Master remote video interview setups, answer tough scenario questions with confidence, and ask smart client questions that close job offers!
        </p>
      </div>

      {/* SECTION 1: REMOTE VIDEO SETUP CHECKLIST */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
          <Video className="w-5 h-5 text-indigo-600" /> 1. The 4-Step Remote Video Interview Setup Checklist
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 font-bold">
              <Sun className="w-4 h-4" /> Lighting & Camera
            </div>
            <p className="text-slate-600">
              Position your main light source (window or ring light) facing you. Never sit directly in front of a bright window (backlighting). Place laptop camera at eye level!
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 font-bold">
              <Mic className="w-4 h-4" /> Crisp Audio & Quiet
            </div>
            <p className="text-slate-600">
              Use a wired earphone mic or headset. Test background noise cancellation tools like Krisp or Zoom noise suppression to eliminate fan/street sounds.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 font-bold">
              <Wifi className="w-4 h-4" /> Internet & Backup
            </div>
            <p className="text-slate-600">
              Run a speed test (minimum 15 Mbps download / 5 Mbps upload). Keep a mobile hotspot backup ready in case main wifi drops during the interview!
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 font-bold">
              <Smile className="w-4 h-4" /> Eye Contact Technique
            </div>
            <p className="text-slate-600">
              Look directly into the camera lens when speaking, not down at the screen. This creates instant warm eye contact with the global hiring manager.
            </p>
          </div>

        </div>
      </div>

      {/* SECTION 2: TOUGHEST BEGINNER QUESTIONS & ANSWERS */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-600" /> 2. 5 Toughest Beginner Questions & Winning Model Answers
        </h2>

        <div className="space-y-3">
          {QUESTIONS_AND_ANSWERS.map((qa, idx) => {
            const isOpen = expandedFaq === idx;

            return (
              <div key={idx} className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(isOpen ? null : idx)}
                  className="w-full text-left p-4 flex items-center justify-between gap-3 hover:bg-slate-100 transition-colors"
                >
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">{qa.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </button>

                {isOpen && (
                  <div className="p-4 bg-white border-t border-slate-200 space-y-3 text-xs">
                    
                    <div className="bg-indigo-50 border border-indigo-200 p-2.5 rounded-lg text-indigo-900">
                      <strong>Interviewer Intent:</strong> {qa.why}
                    </div>

                    <div className="bg-slate-900 text-slate-100 p-3.5 rounded-xl border border-slate-800 space-y-1">
                      <div className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">
                        ✨ Winning Sample Response (Adapt to your story):
                      </div>
                      <p className="text-slate-200 leading-relaxed font-sans italic">
                        "{qa.answer}"
                      </p>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: SMART QUESTIONS CANDIDATES MUST ASK */}
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-lg space-y-4">
        <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-teal-400" /> 3. 3 High-Impact Questions Candidates MUST Ask the Client
        </h2>

        <p className="text-xs text-slate-300">
          When the interviewer asks "Do you have any questions for us?", asking these questions proves strategic thinking and enthusiasm:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-1">
            <h4 className="font-bold text-teal-300">Question 1:</h4>
            <p className="text-slate-200">"What does success look like for this role in the first 30 to 60 days?"</p>
          </div>

          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-1">
            <h4 className="font-bold text-teal-300">Question 2:</h4>
            <p className="text-slate-200">"How does your team handle async updates vs live meetings?"</p>
          </div>

          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-1">
            <h4 className="font-bold text-teal-300">Question 3:</h4>
            <p className="text-slate-200">"What tools does your team use daily, and how is feedback delivered?"</p>
          </div>

        </div>
      </div>

    </div>
  );
};
