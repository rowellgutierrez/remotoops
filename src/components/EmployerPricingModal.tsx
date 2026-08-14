import React, { useState } from 'react';
import { X, Check, ShieldCheck, Sparkles, Building2, Flame, Lock } from 'lucide-react';

interface EmployerPricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan?: (planName: string) => void;
}

interface PlanTier {
  id: string;
  name: string;
  badge?: string;
  popular?: boolean;
  price: string;
  period: string;
  description: string;
  features: string[];
  ctaText: string;
}

const PRICING_TIERS: PlanTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: '₱0',
    period: '/ month',
    description: 'Essential access to explore the talent pool and test remote hiring.',
    features: [
      '1 active job post',
      'Standard search indexing',
      'Basic applicant dashboard',
      'Community talent access',
      'Zero candidate application fees'
    ],
    ctaText: 'Active Free Tier'
  },
  {
    id: 'starter',
    name: 'Starter',
    price: '$5',
    period: '/ month',
    description: 'Ideal for small startups and founders seeking quick, quality hires.',
    features: [
      '10 active job posts',
      'Featured job listing badge',
      'Full applicant contact access',
      'Resume & portfolio review',
      'Email notifications on new applicants'
    ],
    ctaText: 'Select Starter'
  },
  {
    id: 'business',
    name: 'Business',
    popular: true,
    price: '$19',
    period: '/ month',
    badge: 'Most Popular',
    description: 'Best for growing businesses with ongoing hiring and pipeline requirements.',
    features: [
      '30 active job posts',
      'Top priority feed placement',
      'AI candidate skill matching',
      'Applicant qualification filter',
      'Direct candidate messaging access'
    ],
    ctaText: 'Select Business'
  },
  {
    id: 'unlimited',
    name: 'Unlimited',
    price: '$39',
    period: '/ month',
    description: 'For scaling agencies and staffing teams hiring across multiple departments.',
    features: [
      'Unlimited active job posts*',
      'Permanent featured job status',
      'Candidate mentorship & test scores',
      'Team collaboration accounts (5 seats)',
      'Priority 24/7 hiring support'
    ],
    ctaText: 'Select Unlimited'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$59',
    period: '/ month',
    description: 'Custom solutions for high-volume enterprise organizations and BPOs.',
    features: [
      'Unlimited active job posts',
      'Custom ATS / HR integrations',
      'Dedicated hiring account manager',
      'Bulk candidate pipeline access',
      'Custom role screening assessments',
      'SLA & compliance verification'
    ],
    ctaText: 'Contact Enterprise'
  }
];

export const EmployerPricingModal: React.FC<EmployerPricingModalProps> = ({
  isOpen,
  onClose,
  onSelectPlan
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string>('business');
  const [purchased, setPurchased] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = (planId: string) => {
    setSelectedPlan(planId);
    setPurchased(true);
    if (onSelectPlan) onSelectPlan(planId.toUpperCase());
    setTimeout(() => {
      setPurchased(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[94vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 md:p-8 space-y-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-800 text-[11px] font-extrabold px-3 py-1 rounded-full border border-teal-200 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> Employer Hiring Subscriptions
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Fair & Scalable Employer Pricing
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Job seekers search & apply for <span className="font-extrabold text-teal-700 underline decoration-teal-300">100% FREE</span>. All employer plans are currently unlocked in beta preview mode.
            </p>
          </div>

          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
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
            <p className="text-xs text-emerald-700">You selected the {selectedPlan.toUpperCase()} plan. Your job limits and hiring tools are now active.</p>
          </div>
        )}

        {/* Value Proposition Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-2xl p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-800 shadow-md">
          <div className="space-y-1">
            <p className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" /> RemotoOps Hiring Guarantee
            </p>
            <h3 className="text-sm sm:text-base font-extrabold text-white">
              “Free to search & apply for job seekers. Employers gain top-tier talent discovery tools.”
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We test candidate skills (Google Suite, Communication, SOP compliance) with zero applicant barriers.
            </p>
          </div>
          <div className="bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-700 text-center shrink-0 text-xs">
            <span className="text-[10px] text-slate-400 block font-bold">Candidate App Fee</span>
            <span className="text-lg font-black text-emerald-400">$0.00 ALWAYS FREE</span>
          </div>
        </div>

        {/* 5-Tier Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {PRICING_TIERS.map((tier) => {
            const isPopular = tier.popular;
            return (
              <div 
                key={tier.id}
                className={`rounded-2xl p-5 border flex flex-col justify-between transition-all ${
                  isPopular 
                    ? 'bg-slate-900 text-white border-2 border-teal-500 shadow-xl relative' 
                    : 'bg-white text-slate-900 border-slate-200 shadow-sm hover:border-slate-300'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-500 text-slate-950 font-black text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-slate-950" /> {tier.badge}
                  </div>
                )}

                <div className="space-y-3">
                  <div className="space-y-0.5">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isPopular ? 'text-teal-400' : 'text-slate-500'}`}>
                      {tier.name}
                    </span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className={`text-2xl sm:text-3xl font-black ${isPopular ? 'text-white' : 'text-slate-900'}`}>
                        {tier.price}
                      </span>
                      <span className={`text-[11px] font-medium ${isPopular ? 'text-slate-400' : 'text-slate-500'}`}>
                        {tier.period}
                      </span>
                    </div>
                    <p className={`text-[11px] leading-relaxed pt-1 ${isPopular ? 'text-slate-300' : 'text-slate-600'}`}>
                      {tier.description}
                    </p>
                  </div>

                  <div className={`space-y-2 pt-3 border-t text-[11px] ${isPopular ? 'border-slate-800 text-slate-200' : 'border-slate-100 text-slate-700'}`}>
                    {tier.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-1.5">
                        <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isPopular ? 'text-teal-400' : 'text-emerald-500'}`} />
                        <span className="leading-tight">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-auto">
                  {tier.id === 'free' ? (
                    <button
                      onClick={() => handleCheckout(tier.id)}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 rounded-xl text-center border border-slate-300 flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{tier.ctaText}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleCheckout(tier.id)}
                      className={`w-full font-bold text-xs py-2.5 rounded-xl text-center transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                        isPopular
                          ? 'bg-teal-500 hover:bg-teal-400 text-slate-950 font-black shadow-teal-500/20'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      <span>{tier.ctaText}</span>
                    </button>
                  )}
                  <p className="text-[9px] text-center text-slate-400 mt-1">Preview mode • Payment coming soon</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Add-on */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0 font-bold text-lg">
                💎
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  Add-On: Featured Job Boost ($3)
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Pin your job posting directly to the top of the search feed with a highlighted badge. Gets 5x more candidate applications!
                </p>
              </div>
            </div>

            <button
              onClick={() => handleCheckout('starter')}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl shrink-0 transition-all shadow-md"
            >
              Enable Featured Boost
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-[11px] text-slate-500 space-y-1">
          <p>
            💡 <strong>Candidate Protection:</strong> RemotoOps will never charge job seekers a fee to apply for employment.
          </p>
          <p className="text-[10px] text-slate-400">
            Payment gateways are in active integration. All plans are currently previewable and activated during the beta period.
          </p>
        </div>

      </div>
    </div>
  );
};
