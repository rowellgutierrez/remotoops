import React, { useState } from 'react';
import { Application, DirectMessage } from '../types';
import { 
  FileCheck2, 
  Clock, 
  CheckCircle2, 
  MessageSquare, 
  Send, 
  User, 
  Building2, 
  Award,
  ChevronRight,
  XCircle,
  HelpCircle
} from 'lucide-react';

interface PortalSectionProps {
  applications: Application[];
  onUpdateStatus: (appId: string, status: Application['status'], notes?: string) => void;
  userType: 'candidate' | 'client';
  messages: DirectMessage[];
  onSendDirectMessage: (text: string, receiverName: string) => void;
}

export const PortalSection: React.FC<PortalSectionProps> = ({
  applications,
  onUpdateStatus,
  userType,
  messages,
  onSendDirectMessage
}) => {
  const [activeTab, setActiveTab] = useState<'applications' | 'messages'>('applications');
  const [msgInput, setMsgInput] = useState('');
  const [activeMentorNote, setActiveMentorNote] = useState<{ [appId: string]: string }>({});

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgInput.trim()) return;

    onSendDirectMessage(msgInput, 'Sarah Jenkins');
    setMsgInput('');
  };

  const getStatusBadge = (status: Application['status']) => {
    switch (status) {
      case 'applied':
        return <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-200">Applied</span>;
      case 'under_review':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-200">Under Review</span>;
      case 'intro_chat':
        return <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2.5 py-1 rounded-full border border-indigo-200">Intro Chat Scheduled</span>;
      case 'accepted':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-200">Accepted into Mentorship! 🎉</span>;
      case 'declined':
        return <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2.5 py-1 rounded-full border border-rose-200">Declined</span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-teal-500/20 text-teal-300 text-xs font-bold px-3 py-1 rounded-full border border-teal-500/30 mb-2">
            <FileCheck2 className="w-3.5 h-3.5" /> RemotoOps Management Desk
          </div>
          <h1 className="text-2xl font-extrabold">
            {userType === 'candidate' ? 'My Applications & Mentorship Status' : 'Client Hiring & Mentorship Portal'}
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            {userType === 'candidate' 
              ? 'Track your submitted pitches, interview chats, and mentor feedback.' 
              : 'Review candidate applications, schedule intro chats, and update internship statuses.'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs shrink-0">
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'applications' ? 'bg-teal-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            Applications ({applications.length})
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'messages' ? 'bg-teal-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            Direct Messages ({messages.length})
          </button>
        </div>
      </div>

      {/* APPLICATIONS TAB */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 space-y-2">
              <FileCheck2 className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">No Applications Yet</h3>
              <p className="text-xs text-slate-500">Explore the job board to apply for mentorship-driven remote internships.</p>
            </div>
          ) : (
            applications.map(app => (
              <div key={app.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
                
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <img
                      src={app.candidateAvatar}
                      alt={app.candidateName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{app.jobTitle}</h3>
                      <p className="text-xs text-slate-500">{app.company} • Applied by <strong className="text-slate-800">{app.candidateName}</strong> ({app.appliedAt})</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(app.status)}
                  </div>
                </div>

                {/* Pitch Body */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-2">
                  <p className="font-bold text-slate-800">Submitted Cover Pitch:</p>
                  <p className="text-slate-700 leading-relaxed italic">"{app.coverPitch}"</p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="font-semibold text-slate-500 text-[10px]">Practiced Tools:</span>
                    {app.toolExperience.map((t, idx) => (
                      <span key={idx} className="bg-white text-slate-700 text-[10px] px-2 py-0.5 rounded border border-slate-200 font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Mentor Notes */}
                {app.mentorNotes && (
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                    <Award className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-amber-950">Mentor Feedback & Notes:</p>
                      <p className="text-amber-800 mt-0.5">{app.mentorNotes}</p>
                    </div>
                  </div>
                )}

                {/* Client Status Update Actions (When viewed in Client mode) */}
                {userType === 'client' && (
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-slate-700">Update Status:</span>
                      <button
                        onClick={() => onUpdateStatus(app.id, 'intro_chat', 'Intro chat scheduled! Please check email.')}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] px-3 py-1 rounded-lg"
                      >
                        Schedule Intro Chat
                      </button>
                      <button
                        onClick={() => onUpdateStatus(app.id, 'accepted', 'Accepted into mentorship program!')}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] px-3 py-1 rounded-lg"
                      >
                        Accept Candidate
                      </button>
                      <button
                        onClick={() => onUpdateStatus(app.id, 'declined')}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-[11px] px-3 py-1 rounded-lg"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                )}

              </div>
            ))
          )}
        </div>
      )}

      {/* MESSAGES TAB */}
      {activeTab === 'messages' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-teal-600" /> Direct Messaging Log
          </h3>

          <div className="space-y-3 max-h-80 overflow-y-auto p-3 bg-slate-50 rounded-xl border border-slate-200">
            {messages.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No direct messages yet.</p>
            ) : (
              messages.map(msg => (
                <div key={msg.id} className="flex gap-3 text-xs">
                  <img
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                  />
                  <div className="bg-white p-3 rounded-xl border border-slate-200 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{msg.senderName}</span>
                      <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                    </div>
                    <p className="text-slate-700 mt-1">{msg.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Send Message Form */}
          <form onSubmit={handleSendChat} className="flex gap-2">
            <input
              type="text"
              placeholder="Type a direct message to mentor/candidate..."
              value={msgInput}
              onChange={(e) => setMsgInput(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="submit"
              disabled={!msgInput.trim()}
              className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> Send
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
