import React, { useState } from 'react';
import { DirectMessage, UserAccount } from '../types';
import { 
  MessageSquare, 
  Send, 
  Search, 
  Building2, 
  User as UserIcon, 
  Clock, 
  CheckCheck, 
  ShieldCheck, 
  Briefcase,
  Sparkles
} from 'lucide-react';

interface MessagesSectionProps {
  currentUser: UserAccount | null;
  messages: DirectMessage[];
  onSendMessage: (text: string, receiverId: string, receiverName: string, conversationId?: string) => void;
  onOpenAuthModal: () => void;
}

export const MessagesSection: React.FC<MessagesSectionProps> = ({
  currentUser,
  messages,
  onSendMessage,
  onOpenAuthModal
}) => {
  const [activeConversationId, setActiveConversationId] = useState<string>('conv-1');
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
          <MessageSquare className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Sign in to Access Your Messages</h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          Communicate directly with hiring managers, receive application updates, and schedule interviews.
        </p>
        <button
          onClick={onOpenAuthModal}
          className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs px-6 py-2.5 rounded-xl shadow transition-all"
        >
          Sign In / Create Account
        </button>
      </div>
    );
  }

  // Group messages into distinct conversations
  const conversationsMap = new Map<string, DirectMessage[]>();
  messages.forEach((msg) => {
    const convId = msg.conversationId || 'general';
    if (!conversationsMap.has(convId)) {
      conversationsMap.set(convId, []);
    }
    conversationsMap.get(convId)!.push(msg);
  });

  // Ensure default mock conversation exists if none
  if (conversationsMap.size === 0) {
    conversationsMap.set('conv-1', [
      {
        id: 'msg-welcome',
        conversationId: 'conv-1',
        senderId: 'client-1',
        receiverId: currentUser.id,
        senderName: 'Apex Global Hiring Team',
        senderAvatar: '',
        text: 'Hello! Thank you for applying through RemotoOps. We review beginner-friendly applications within 24-48 hours.',
        timestamp: 'Today at 10:00 AM'
      }
    ]);
  }

  const conversationKeys = Array.from(conversationsMap.keys());
  const currentConversation = conversationsMap.get(activeConversationId) || conversationsMap.get(conversationKeys[0]) || [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const firstMsg = currentConversation[0];
    const receiverId = firstMsg ? (firstMsg.senderId === currentUser.id ? firstMsg.receiverId : firstMsg.senderId) : 'client-1';
    const receiverName = firstMsg ? (firstMsg.senderId === currentUser.id ? 'Hiring Manager' : firstMsg.senderName) : 'Hiring Manager';

    onSendMessage(messageInput.trim(), receiverId, receiverName, activeConversationId);
    setMessageInput('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Title banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full border border-indigo-200 mb-2">
            <MessageSquare className="w-3.5 h-3.5" /> Direct Candidate & Employer Messaging
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Inbox & Messages</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Safe, verified communication between job seekers and employers.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Anti-Scam Protected Chat</span>
        </div>
      </div>

      {/* Messaging Layout */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[550px]">
        
        {/* Left: Conversation List */}
        <div className="lg:col-span-4 border-r border-slate-200 flex flex-col bg-slate-50/50">
          
          <div className="p-3.5 border-b border-slate-200">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {conversationKeys.map((convId) => {
              const msgs = conversationsMap.get(convId) || [];
              const lastMsg = msgs[msgs.length - 1];
              const isActive = convId === activeConversationId;

              return (
                <button
                  key={convId}
                  onClick={() => setActiveConversationId(convId)}
                  className={`w-full text-left p-4 transition-colors flex items-start gap-3 ${
                    isActive ? 'bg-indigo-50/80 border-l-4 border-indigo-600' : 'hover:bg-slate-100/80'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-slate-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-bold text-slate-900 text-xs truncate">
                        {lastMsg ? lastMsg.senderName : 'Employer Conversation'}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {lastMsg?.timestamp || 'Today'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {lastMsg?.text || 'No messages yet.'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

        </div>

        {/* Right: Message Window */}
        <div className="lg:col-span-8 flex flex-col bg-white">
          
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/30">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xs">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                  {currentConversation[0]?.senderName || 'Hiring Manager'}
                </h3>
                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Active on RemotoOps
                </p>
              </div>
            </div>

            <div className="text-right hidden sm:block">
              <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200">
                Official Job Discussion
              </span>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 max-h-[420px]">
            
            {/* Safety Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-800 text-center space-y-1">
              <p className="font-bold">🛡️ RemotoOps Anti-Scam Policy Notice</p>
              <p>
                Never send registration fees, buy equipment checks, or leave RemotoOps for unverified external chat channels.
              </p>
            </div>

            {currentConversation.map((msg) => {
              const isMe = msg.senderId === currentUser.id || msg.senderId === 'user-me';

              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  {!isMe && (
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                      {msg.senderName.charAt(0)}
                    </div>
                  )}

                  <div className={`max-w-md rounded-2xl p-3.5 text-xs shadow-sm space-y-1 ${
                    isMe
                      ? 'bg-slate-900 text-white rounded-br-none'
                      : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200'
                  }`}>
                    {!isMe && (
                      <p className="font-bold text-[10px] text-indigo-700">{msg.senderName}</p>
                    )}
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    <div className={`flex items-center gap-1 text-[9px] pt-0.5 ${isMe ? 'text-slate-400 justify-end' : 'text-slate-500'}`}>
                      <Clock className="w-2.5 h-2.5" />
                      <span>{msg.timestamp}</span>
                      {isMe && <CheckCheck className="w-3 h-3 text-teal-400 ml-0.5" />}
                    </div>
                  </div>

                  {isMe && (
                    <div className="w-7 h-7 rounded-lg bg-teal-500 text-slate-950 flex items-center justify-center font-bold text-[10px] shrink-0">
                      {currentUser.name ? currentUser.name.charAt(0) : 'Me'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSend} className="p-3.5 border-t border-slate-200 bg-slate-50/50 flex items-center gap-2">
            <input
              type="text"
              placeholder="Type your reply to the employer..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="submit"
              disabled={!messageInput.trim()}
              className="bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl shadow transition-all flex items-center gap-1.5 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>

        </div>

      </div>

    </div>
  );
};
