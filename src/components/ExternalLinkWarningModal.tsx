import React from 'react';
import { ExternalLink, ShieldAlert, AlertTriangle, X, Check } from 'lucide-react';

interface ExternalLinkWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUrl: string;
  companyName?: string;
  jobTitle?: string;
  onConfirmProceed: (url: string) => void;
}

export const ExternalLinkWarningModal: React.FC<ExternalLinkWarningModalProps> = ({
  isOpen,
  onClose,
  targetUrl,
  companyName = 'External Portal',
  jobTitle = 'External Application',
  onConfirmProceed
}) => {
  if (!isOpen) return null;

  // Sanitize URL scheme: strictly enforce http or https
  const isHttps = targetUrl.startsWith('https://');
  const safeUrl = targetUrl.startsWith('http://') || targetUrl.startsWith('https://') 
    ? targetUrl 
    : `https://${targetUrl}`;

  const handleProceed = () => {
    onConfirmProceed(safeUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
        
        {/* Header */}
        <div className="bg-amber-500 text-slate-950 p-5 flex items-center justify-between border-b border-amber-600/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-950">Leaving RemotoOps</h3>
              <p className="text-[11px] text-slate-900 font-semibold">External Link Safety Check</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="text-slate-950/80 hover:text-slate-950 p-1 rounded-full hover:bg-amber-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2">
            <p className="text-slate-600">
              You are about to be redirected to an external career portal for:
            </p>
            <p className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <ExternalLink className="w-4 h-4 text-indigo-600" />
              {jobTitle} {companyName ? `at ${companyName}` : ''}
            </p>
            <div className="bg-white p-2.5 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-700 break-all flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full shrink-0 ${isHttps ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              <span className="truncate">{safeUrl}</span>
            </div>
          </div>

          {/* Safety Warning Card */}
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs text-rose-950 space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-rose-800">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              Important Safety Reminders for Job Seekers:
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-700 leading-relaxed font-medium">
              <li><strong>NEVER pay fees</strong> for training, background checks, or equipment software.</li>
              <li><strong>NEVER cash checks</strong> or send money back to an employer.</li>
              <li><strong>NEVER share passwords</strong>, SSN, or online banking credentials.</li>
              <li>Legitimate clients evaluate your skills, not your bank account.</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              onClick={handleProceed}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              Continue to External Site <ExternalLink className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-3 px-4 rounded-xl transition-all"
            >
              Cancel & Stay Safe
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
