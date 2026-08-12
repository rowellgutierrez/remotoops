import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Sparkles, 
  Lock, 
  FileText, 
  Flag, 
  RefreshCw,
  Search,
  Check
} from 'lucide-react';

interface AntiScamHubProps {
  onOpenReportModal?: (jobId?: string, jobTitle?: string, company?: string) => void;
}

export const AntiScamHub: React.FC<AntiScamHubProps> = ({ onOpenReportModal }) => {
  const [activeTab, setActiveTab] = useState<'red_flags' | 'safety_quiz' | 'client_verification'>('red_flags');

  // Interactive Quiz state
  const [quizAnswers, setQuizAnswers] = useState({
    askedForMoney: false,
    telegramOnly: false,
    equipmentCheck: false,
    unrealisticPay: false,
    genericEmail: false
  });

  const calculateRiskLevel = () => {
    const riskCount = Object.values(quizAnswers).filter(Boolean).length;
    if (riskCount === 0) return { level: 'SAFE / LOW RISK', color: 'emerald', text: 'This job posting aligns with standard safe remote hiring practices.' };
    if (riskCount <= 2) return { level: 'MODERATE WARNING', color: 'amber', text: 'Exercise caution! Verify official company domain emails and insist on a live video chat.' };
    return { level: 'HIGH SCAM RISK 🚨', color: 'rose', text: 'STAY AWAY! This listing exhibits major red flags associated with recruitment scams.' };
  };

  const riskResult = calculateRiskLevel();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-rose-500/20 text-rose-300 text-xs font-bold px-3 py-1 rounded-full border border-rose-500/30 uppercase tracking-wider mb-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" /> RemotoOps Safe Community Shield
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Anti-Scam Protection & Safety Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              We protect aspiring remote job seekers from fake recruiters, equipment check scams, and unauthorized money requests. Learn the gold rules of safe remote job hunting.
            </p>
          </div>

          <button
            onClick={() => onOpenReportModal?.()}
            className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-lg transition-all flex items-center gap-2 shrink-0 self-start md:self-auto"
          >
            <Flag className="w-4 h-4" /> Report Suspicious Recruiter / Job
          </button>
        </div>

        {/* Sub-Tabs */}
        <div className="flex gap-2 pt-3 border-t border-slate-800/80 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('red_flags')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'red_flags'
                ? 'bg-rose-500 text-slate-950 shadow-md shadow-rose-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <AlertTriangle className="w-4 h-4" /> 1. Common Scams & Red Flags
          </button>

          <button
            onClick={() => setActiveTab('safety_quiz')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'safety_quiz'
                ? 'bg-rose-500 text-slate-950 shadow-md shadow-rose-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Search className="w-4 h-4 text-amber-300" /> 2. "Is This Job Safe?" Detector Quiz
          </button>

          <button
            onClick={() => setActiveTab('client_verification')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'client_verification'
                ? 'bg-rose-500 text-slate-950 shadow-md shadow-rose-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> 3. Verified Client Guarantee
          </button>
        </div>
      </div>

      {/* TAB 1: COMMON SCAMS & 7 GOLD RULES */}
      {activeTab === 'red_flags' && (
        <div className="space-y-6">
          
          {/* 7 Gold Rules Banner */}
          <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200 space-y-4">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-6 h-6 text-emerald-700 shrink-0" />
              <div>
                <h2 className="text-lg font-extrabold text-emerald-950">
                  The 7 Gold Rules of Safe Remote Job Hunting
                </h2>
                <p className="text-xs text-emerald-800">
                  Keep these rules in mind whenever applying or communicating with potential clients.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              
              <div className="bg-white p-3.5 rounded-xl border border-emerald-200/80 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-950 font-bold">1. NEVER Pay Money To Get a Job</strong>
                  <p className="text-slate-600 mt-0.5">Real clients pay YOU. Never pay for application fees, software licenses, background checks, or onboarding badges.</p>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-emerald-200/80 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-950 font-bold">2. NEVER Accept Equipment Checks</strong>
                  <p className="text-slate-600 mt-0.5">Scammers send fake checks and ask you to transfer funds to "their laptop vendor". The check will bounce, leaving you liable!</p>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-emerald-200/80 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-950 font-bold">3. Insist on a Live Video Interview</strong>
                  <p className="text-slate-600 mt-0.5">Legitimate global clients will meet you face-to-face via Zoom or Google Meet. Avoid text-only Telegram/WhatsApp interviews.</p>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-emerald-200/80 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-950 font-bold">4. Verify Company Email Domains</strong>
                  <p className="text-slate-600 mt-0.5">A recruiter claiming to represent Google or Microsoft will write from `@google.com`, NOT `@gmail.com` or `@yahoo.com`.</p>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-emerald-200/80 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-950 font-bold">5. Protect Banking & Passport Data</strong>
                  <p className="text-slate-600 mt-0.5">Never share online banking passwords, credit card PINs, or SSNs before signing an official employment agreement.</p>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-emerald-200/80 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-950 font-bold">6. Look for RemotoOps Verified Badge</strong>
                  <p className="text-slate-600 mt-0.5">All jobs on RemotoOps display a "Verified Safe Client" badge once client identity and email domains have been authenticated.</p>
                </div>
              </div>

            </div>
          </div>

          {/* Top 4 Major Scam Archetypes Breakdown */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              Anatomy of Common Remote Recruitment Scams
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                  <XCircle className="w-5 h-5 shrink-0" />
                  <span>Scam #1: The Fake Check Equipment Scam</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The recruiter "hires" you immediately with zero interview. They send a digital check for $2,000–$5,000 to "buy home office equipment" from a specific vendor. They ask you to deposit the check and wire money to the vendor. A week later, the check turns out to be fraudulent and bounces, leaving you owing money to your bank!
                </p>
                <div className="bg-rose-50 p-2.5 rounded-lg border border-rose-200 text-[11px] font-bold text-rose-900">
                  🚫 Safety Rule: Never deposit checks or transfer money on behalf of an employer.
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                  <XCircle className="w-5 h-5 shrink-0" />
                  <span>Scam #2: Telegram / WhatsApp Text Interview</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  You receive an email or SMS asking you to download Telegram or WhatsApp and chat with "HR Manager Mr. Smith". The entire interview happens over text questionnaire. You receive a job offer within 15 minutes. This is a classic bot scam designed to harvest personal information.
                </p>
                <div className="bg-rose-50 p-2.5 rounded-lg border border-rose-200 text-[11px] font-bold text-rose-900">
                  🚫 Safety Rule: Real companies schedule video chats on Zoom/Meet or official platform portals.
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                  <XCircle className="w-5 h-5 shrink-0" />
                  <span>Scam #3: The Upfront Onboarding / Badge Fee</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The client claims you need a "remote security clearance badge", "software license key", or "training certificate" that costs $50 to $150 before you can start working, promising they will reimburse you in your first paycheck.
                </p>
                <div className="bg-rose-50 p-2.5 rounded-lg border border-rose-200 text-[11px] font-bold text-rose-900">
                  🚫 Safety Rule: Legitimate employers cover all software software licenses and training costs directly.
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                  <XCircle className="w-5 h-5 shrink-0" />
                  <span>Scam #4: Too Good To Be True Data Entry Pay</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Listings promising "$75/hour for simple 1-hour typing data entry with 0 experience required". High pay is used as bait to trap beginners into phishing schemes.
                </p>
                <div className="bg-rose-50 p-2.5 rounded-lg border border-rose-200 text-[11px] font-bold text-rose-900">
                  🚫 Safety Rule: Compare pay rates against market standards ($10-$25/hr for entry-level remote roles).
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* TAB 2: IS THIS JOB SAFE? DETECTOR QUIZ */}
      {activeTab === 'safety_quiz' && (
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Search className="w-5 h-5 text-rose-600" /> "Is This Job Safe?" Anti-Scam Quiz & Checklist
            </h2>
            <p className="text-xs text-slate-600">
              Check off any conditions below that match the job post or communication you received to assess scam risk instantly.
            </p>
          </div>

          <div className="space-y-3 max-w-2xl">
            
            <label className={`p-4 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
              quizAnswers.askedForMoney ? 'bg-rose-50 border-rose-300' : 'bg-slate-50 border-slate-200'
            }`}>
              <input
                type="checkbox"
                checked={quizAnswers.askedForMoney}
                onChange={(e) => setQuizAnswers({ ...quizAnswers, askedForMoney: e.target.checked })}
                className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900">Did the recruiter ask for money upfront?</span>
                <p className="text-slate-500 mt-0.5">(For software, background check, registration, or onboarding badge)</p>
              </div>
            </label>

            <label className={`p-4 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
              quizAnswers.equipmentCheck ? 'bg-rose-50 border-rose-300' : 'bg-slate-50 border-slate-200'
            }`}>
              <input
                type="checkbox"
                checked={quizAnswers.equipmentCheck}
                onChange={(e) => setQuizAnswers({ ...quizAnswers, equipmentCheck: e.target.checked })}
                className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900">Are they offering to send a check for home office equipment?</span>
                <p className="text-slate-500 mt-0.5">(Telling you to deposit a check and wire money to their vendor)</p>
              </div>
            </label>

            <label className={`p-4 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
              quizAnswers.telegramOnly ? 'bg-rose-50 border-rose-300' : 'bg-slate-50 border-slate-200'
            }`}>
              <input
                type="checkbox"
                checked={quizAnswers.telegramOnly}
                onChange={(e) => setQuizAnswers({ ...quizAnswers, telegramOnly: e.target.checked })}
                className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900">Is the interview strictly text-only on Telegram / WhatsApp?</span>
                <p className="text-slate-500 mt-0.5">(Refusing to schedule a live video chat or meet on official video call)</p>
              </div>
            </label>

            <label className={`p-4 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
              quizAnswers.genericEmail ? 'bg-rose-50 border-rose-300' : 'bg-slate-50 border-slate-200'
            }`}>
              <input
                type="checkbox"
                checked={quizAnswers.genericEmail}
                onChange={(e) => setQuizAnswers({ ...quizAnswers, genericEmail: e.target.checked })}
                className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900">Is the recruiter using a free @gmail.com or @yahoo.com address?</span>
                <p className="text-slate-500 mt-0.5">(While claiming to represent a famous company or corporation)</p>
              </div>
            </label>

            <label className={`p-4 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
              quizAnswers.unrealisticPay ? 'bg-rose-50 border-rose-300' : 'bg-slate-50 border-slate-200'
            }`}>
              <input
                type="checkbox"
                checked={quizAnswers.unrealisticPay}
                onChange={(e) => setQuizAnswers({ ...quizAnswers, unrealisticPay: e.target.checked })}
                className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900">Is the offered pay unrealistically high for simple entry tasks?</span>
                <p className="text-slate-500 mt-0.5">(e.g., $80/hr for basic copy-paste or typing data entry with 0 experience)</p>
              </div>
            </label>

          </div>

          {/* Result Card */}
          <div className={`p-6 rounded-2xl border ${
            riskResult.color === 'emerald' ? 'bg-emerald-50 border-emerald-300 text-emerald-950' :
            riskResult.color === 'amber' ? 'bg-amber-50 border-amber-300 text-amber-950' :
            'bg-rose-50 border-rose-300 text-rose-950'
          }`}>
            <div className="flex items-center gap-3">
              {riskResult.color === 'emerald' && <ShieldCheck className="w-7 h-7 text-emerald-600" />}
              {riskResult.color === 'amber' && <AlertTriangle className="w-7 h-7 text-amber-600" />}
              {riskResult.color === 'rose' && <ShieldAlert className="w-7 h-7 text-rose-600 animate-pulse" />}
              <div>
                <h3 className="font-extrabold text-base uppercase tracking-wide">
                  Assessment: {riskResult.level}
                </h3>
                <p className="text-xs mt-0.5 font-medium">{riskResult.text}</p>
              </div>
            </div>

            {riskResult.color === 'rose' && (
              <div className="mt-4 pt-3 border-t border-rose-200">
                <button
                  onClick={() => onOpenReportModal?.()}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Flag className="w-4 h-4" /> Report This Suspicious Recruiter Immediately
                </button>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 3: CLIENT VERIFICATION GUARANTEE */}
      {activeTab === 'client_verification' && (
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" /> How RemotoOps Verifies Safe Clients
            </h2>
            <p className="text-xs text-slate-600">
              Every job post on our platform is vetted to guarantee safety for aspiring beginner talent.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-sm">
                1
              </div>
              <h4 className="font-bold text-slate-900 text-xs">Corporate Email Match</h4>
              <p className="text-xs text-slate-600">
                Clients must authenticate using an official company domain email matching their business registration.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center text-sm">
                2
              </div>
              <h4 className="font-bold text-slate-900 text-xs">No-Fee Pledge</h4>
              <p className="text-xs text-slate-600">
                Clients sign an agreement guaranteeing zero upfront charges, equipment check requests, or unpaid test work over 2 hours.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                3
              </div>
              <h4 className="font-bold text-slate-900 text-xs">Verified Safe Shield</h4>
              <p className="text-xs text-slate-600">
                Approved client profiles display our emerald verification shield so candidates can apply with 100% confidence.
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
