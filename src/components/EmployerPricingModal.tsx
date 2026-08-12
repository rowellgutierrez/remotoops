import React, { useState } from 'react';
import { X, Check, Zap, Crown, ShieldCheck, Sparkles, Building2, Flame, ArrowRight, Lock } from 'lucide-react';

interface EmployerPricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan?: (planName: 'FREE' | 'PRO' | 'BUSINESS') => void;
}

export const EmployerPricingModal: React.FC<EmployerPricingModalProps> = ({
  isOpen,
  onClose,
  onSelectPlan
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'FREE' | 'PRO' | 'BUSINESS'>('PRO');
  const [purchased, setPurchased] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = (plan: 'FREE' | 'PRO' | 'BUSINESS') => {
    setSelectedPlan(plan);
    setPurchased(true);
    if (onSelectPlan) onSelectPlan(plan);
    setTimeout(() => {
      setPurchased(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 md:p-8 space-y-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-800 text-[11px] font-extrabold px-3 py-1 rounded-full border border-teal-200 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> Employer Plans (Payments Coming Soon)
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Fair Hiring Subscription Plans for Clients
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Job seekers apply for <span className="font-extrabold text-teal-700 underline decoration-teal-300">100% FREE</span>. Online payment checkout is coming soon — all employer plans are currently activated directly.
            </p>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Success Banner */}
        {purchased && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-2xl text-center space-y-1 animate-in fade-in duration-200">
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto font-black shadow-lg shadow-emerald-500/20">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base">Employer Subscription Activated!</h3>
            <p className="text-xs text-emerald-700">You selected the {selectedPlan} plan. Your job limits and hiring tools are now active.</p>
          </div>
        )}

        {/* Core Value Proposition Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-800 shadow-md">
          <div className="space-y-1">
            <p className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" /> Why RemotoOps Monetizes Employers, Not Candidates
            </p>
            <h3 className="text-sm sm:text-base font-extrabold text-white">
              “Free to search & apply for work. Clients pay for better hiring tools.”
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We focus on entry-level skill validation (Google Workspace, Canva, Excel, SOP portfolios) without charging job seekers to find employment.
            </p>
          </div>
          <div className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 text-center shrink-0 text-xs">
            <span className="text-[10px] text-slate-400 block font-bold">Candidate App Fee</span>
            <span className="text-lg font-black text-emerald-400">$0.00 FREE</span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* FREE PLAN */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6 hover:border-slate-300 transition-all">
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Beta Starter</span>
                <h3 className="text-xl font-extrabold text-slate-900">FREE</h3>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-black text-slate-900">$0</span>
                  <span className="text-xs font-medium text-slate-500">/ month</span>
                </div>
                <p className="text-xs text-slate-600">Browse and post job opportunities according to beta rules.</p>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Browse & post according to beta rules</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Basic employer profile</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Basic job posting</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Basic applicant management</span>
                </div>
              </div>
            </div>

            <div className="w-full bg-slate-100 text-slate-700 font-bold text-xs py-3 rounded-xl text-center border border-slate-200 flex items-center justify-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" /> Active Beta Access
            </div>
          </div>

          {/* PRO PLAN */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 border-2 border-teal-500 shadow-xl relative flex flex-col justify-between space-y-6">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-500 text-slate-950 font-black text-[10px] uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md flex items-center gap-1">
              <Flame className="w-3 h-3 fill-slate-950" /> Most Popular
            </div>

            <div className="space-y-4 pt-1">
              <div className="space-y-1">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">Growth Hiring</span>
                <h3 className="text-xl font-extrabold text-white">PRO</h3>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-black text-white">$29</span>
                  <span className="text-xs font-medium text-slate-400">/ month</span>
                </div>
                <p className="text-xs text-slate-300">Unlimited job postings and full applicant profile background reviews.</p>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-slate-800 text-xs">
                <div className="flex items-center gap-2 text-slate-200">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span><strong>Unlimited</strong> job postings</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Advanced applicant management</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Applicant profile & background review</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Priority job visibility & enhanced tools</span>
                </div>
              </div>
            </div>

            <div className="w-full bg-teal-500/20 text-teal-300 font-extrabold text-xs py-3 rounded-xl border border-teal-500/40 text-center flex items-center justify-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-teal-400" /> Payments Coming Soon
            </div>
          </div>

          {/* BUSINESS PLAN */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6 hover:border-slate-300 transition-all">
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Scale-ups & Agencies</span>
                <h3 className="text-xl font-extrabold text-slate-900">BUSINESS</h3>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-black text-slate-900">$59</span>
                  <span className="text-xs font-medium text-slate-500">/ month</span>
                </div>
                <p className="text-xs text-slate-600">Everything in Pro plus team management and multi-campaign hiring tools.</p>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span><strong>Everything in Pro</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Advanced hiring tools & analytics</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Multiple active hiring campaigns</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Team / employer management & priority support</span>
                </div>
              </div>
            </div>

            <div className="w-full bg-slate-100 text-slate-700 font-bold text-xs py-3 rounded-xl text-center border border-slate-200 flex items-center justify-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-500" /> Payments Coming Soon
            </div>
          </div>

        </div>

        {/* A la carte Addon: Featured Job Boost */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0 font-bold">
                💎
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  Standalone Featured Job Boost ($2 - $5)
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Pin any single job posting to the top of the search feed for 7 days. Gets 5x more candidate applications!
                </p>
              </div>
            </div>

            <button
              onClick={() => handleCheckout('PRO')}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl shrink-0 transition-all shadow-md"
            >
              Add Featured Boost ($3)
            </button>
          </div>
        </div>

        {/* Future Marketplace Note */}
        <div className="text-center text-[11px] text-slate-500 space-y-1">
          <p>
            💡 <strong>Zero Applicant Fees Promise:</strong> RemotoOps will never charge job seekers a fee to apply for employment.
          </p>
          <p className="text-[10px] text-slate-400">
            Future plans may introduce an optional 5% client marketplace escrow fee upon successful candidate hiring, keeping platform operations sustainable.
          </p>
        </div>

      </div>
    </div>
  );
};
