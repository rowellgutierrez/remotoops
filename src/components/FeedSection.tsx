import React, { useState } from 'react';
import { FeedPost, RoleCategory, JobPost, CandidateProfile } from '../types';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Send, 
  Sparkles, 
  Award, 
  Briefcase, 
  CheckCircle2, 
  Bookmark, 
  HelpCircle,
  Filter
} from 'lucide-react';

interface FeedSectionProps {
  posts: FeedPost[];
  setPosts: React.Dispatch<React.SetStateAction<FeedPost[]>>;
  jobs: JobPost[];
  candidates: CandidateProfile[];
  onSelectJob: (job: JobPost) => void;
  onNavigateToMentorship: () => void;
}

export const FeedSection: React.FC<FeedSectionProps> = ({
  posts,
  setPosts,
  jobs,
  candidates,
  onSelectJob,
  onNavigateToMentorship
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newPostText, setNewPostText] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<RoleCategory>('executive_assistant');
  const [isMentorshipStory, setIsMentorshipStory] = useState(false);
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});

  const filteredPosts = posts.filter(post => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'mentorship_story') return post.isMentorshipStory;
    return post.roleCategory === selectedCategory;
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost: FeedPost = {
      id: `post-${Date.now()}`,
      authorName: 'Alex Rivers (You)',
      authorTitle: 'Remote EA & SMM Apprenticeship Candidate',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      authorRoleType: 'candidate',
      roleCategory: newPostCategory,
      content: newPostText,
      timestamp: 'Just now',
      likes: 1,
      commentsCount: 0,
      tags: ['RemotoOps', newPostCategory === 'executive_assistant' ? 'EACareer' : newPostCategory === 'social_media_manager' ? 'SMMGrowth' : 'AdminOps'],
      isMentorshipStory,
      likedByMe: true,
      comments: []
    };

    setPosts([newPost, ...posts]);
    setNewPostText('');
    setIsMentorshipStory(false);
  };

  const handleToggleLike = (postId: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const liked = !p.likedByMe;
          return {
            ...p,
            likedByMe: liked,
            likes: liked ? p.likes + 1 : p.likes - 1
          };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const newComments = p.comments || [];
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [
              ...newComments,
              {
                id: `comm-${Date.now()}`,
                authorName: 'Alex Rivers',
                authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                text: text.trim(),
                time: 'Just now'
              }
            ]
          };
        }
        return p;
      })
    );

    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Category Header Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 border-b border-slate-200 mb-6 no-scrollbar">
        <span className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1 pr-2">
          <Filter className="w-3.5 h-3.5" /> Filter Feed:
        </span>
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
            selectedCategory === 'all'
              ? 'bg-slate-900 text-white font-semibold shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          All Activity
        </button>
        <button
          onClick={() => setSelectedCategory('executive_assistant')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
            selectedCategory === 'executive_assistant'
              ? 'bg-teal-600 text-white font-semibold shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Executive Assistant (EA)
        </button>
        <button
          onClick={() => setSelectedCategory('social_media_manager')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
            selectedCategory === 'social_media_manager'
              ? 'bg-purple-600 text-white font-semibold shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Social Media Manager (SMM)
        </button>
        <button
          onClick={() => setSelectedCategory('admin_ops')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
            selectedCategory === 'admin_ops'
              ? 'bg-indigo-600 text-white font-semibold shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Admin & Support Ops
        </button>
        <button
          onClick={() => setSelectedCategory('mentorship_story')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
            selectedCategory === 'mentorship_story'
              ? 'bg-amber-600 text-white font-semibold shadow-sm'
              : 'bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100'
          }`}
        >
          🏆 Mentorship Win Stories
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Feed Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Create Post Card */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <div className="flex gap-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                alt="Your Avatar"
                className="w-10 h-10 rounded-full object-cover border border-slate-200"
              />
              <form onSubmit={handleCreatePost} className="flex-1 space-y-3">
                <textarea
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  placeholder="Share a remote work learning win, ask an EA/SMM tool question, or post a mentorship opportunity..."
                  rows={3}
                  className="w-full text-xs text-slate-800 placeholder-slate-400 bg-slate-50 border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                />

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    {/* Role Tag Select */}
                    <select
                      value={newPostCategory}
                      onChange={(e) => setNewPostCategory(e.target.value as RoleCategory)}
                      className="text-xs text-slate-700 bg-slate-100 border border-slate-200 rounded-md px-2.5 py-1 focus:outline-none"
                    >
                      <option value="executive_assistant">Executive Assistant</option>
                      <option value="social_media_manager">Social Media Manager</option>
                      <option value="admin_ops">Admin & Support Ops</option>
                    </select>

                    <label className="flex items-center gap-1.5 text-xs text-slate-600 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isMentorshipStory}
                        onChange={(e) => setIsMentorshipStory(e.target.checked)}
                        className="rounded text-teal-600 focus:ring-teal-500"
                      />
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      Mentorship Milestone
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={!newPostText.trim()}
                    className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-xs px-4 py-1.5 rounded-lg transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Share Update
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Posts Stream */}
          <div className="space-y-4">
            {filteredPosts.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
                <p className="text-slate-500 text-sm">No feed updates in this category yet. Be the first to share!</p>
              </div>
            ) : (
              filteredPosts.map(post => (
                <div key={post.id} className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 space-y-4 transition-all hover:border-slate-300">
                  
                  {/* Post Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <img
                        src={post.authorAvatar}
                        alt={post.authorName}
                        className="w-11 h-11 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{post.authorName}</h4>
                          
                          {/* Author Role Badge */}
                          {post.authorRoleType === 'mentor' && (
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                              <Award className="w-3 h-3 text-amber-600" /> Mentor
                            </span>
                          )}
                          {post.authorRoleType === 'client' && (
                            <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-200">
                              Global Employer
                            </span>
                          )}
                          {post.authorRoleType === 'candidate' && (
                            <span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-200">
                              Remote Talent
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">{post.authorTitle}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{post.timestamp}</p>
                      </div>
                    </div>

                    {/* Category Tag */}
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        post.roleCategory === 'executive_assistant'
                          ? 'bg-teal-50 text-teal-700 border border-teal-200'
                          : post.roleCategory === 'social_media_manager'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      }`}>
                        {post.roleCategory === 'executive_assistant' ? 'Executive Asst' : post.roleCategory === 'social_media_manager' ? 'Social Media' : 'Admin Ops'}
                      </span>
                      {post.isMentorshipStory && (
                        <span className="bg-amber-50 text-amber-700 text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 border border-amber-200">
                          🏆 Mentorship Win
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-line font-normal">
                    {post.content}
                  </div>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {post.tags.map((tag, idx) => (
                        <span key={idx} className="text-[11px] font-medium text-teal-600 hover:underline cursor-pointer">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
                    <button
                      onClick={() => handleToggleLike(post.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
                        post.likedByMe ? 'text-rose-600 font-bold bg-rose-50' : 'hover:bg-slate-100 hover:text-slate-800'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${post.likedByMe ? 'fill-rose-600 text-rose-600' : ''}`} />
                      <span>{post.likes} Likes</span>
                    </button>

                    <span className="flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-slate-400" />
                      <span>{post.commentsCount} Comments</span>
                    </span>

                    <button className="flex items-center gap-1.5 hover:text-slate-800 transition-colors">
                      <Share2 className="w-4 h-4 text-slate-400" />
                      <span>Share</span>
                    </button>
                  </div>

                  {/* Comments Section */}
                  {post.comments && post.comments.length > 0 && (
                    <div className="bg-slate-50 rounded-lg p-3 space-y-2.5 border border-slate-100">
                      {post.comments.map(comment => (
                        <div key={comment.id} className="flex gap-2.5 text-xs">
                          <img
                            src={comment.authorAvatar}
                            alt={comment.authorName}
                            className="w-7 h-7 rounded-full object-cover border border-slate-200"
                          />
                          <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900">{comment.authorName}</span>
                              <span className="text-[10px] text-slate-400">{comment.time}</span>
                            </div>
                            <p className="text-slate-700 mt-1">{comment.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Comment Input */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Write a supportive comment..."
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="bg-slate-900 text-white font-semibold text-xs px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      Reply
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>

        </div>

        {/* Right Sidebar Widgets */}
        <div className="space-y-6">
          
          {/* AI Mentorship Banner Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-5 text-white shadow-lg border border-slate-700 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-400" />
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">AI Skill Accelerator</span>
            </div>
            <h3 className="font-bold text-base leading-snug">New to EA, Admin, or SMM? Polish Your Pitch with AI</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Use our Gemini AI coach to analyze your cover letter, build a custom remote pitch, and practice role-specific scenario questions.
            </p>
            <button
              onClick={onNavigateToMentorship}
              className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              Open AI Mentorship Studio
            </button>
          </div>

          {/* Featured Remote Opportunities */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-teal-600" /> Hot Mentorship Internships
              </h3>
            </div>

            <div className="space-y-3">
              {jobs.slice(0, 3).map(job => (
                <div
                  key={job.id}
                  onClick={() => onSelectJob(job)}
                  className="p-3 rounded-lg border border-slate-100 hover:border-teal-300 hover:bg-teal-50/30 cursor-pointer transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                      {job.compensationType === 'paid_stipend' ? 'Paid Stipend' : 'Hourly Rate'}
                    </span>
                    <span className="text-[10px] text-slate-400">{job.timezone}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1">
                    {job.title}
                  </h4>
                  <p className="text-[11px] text-slate-500">{job.company}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Spotlight Candidate Newbies */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <Award className="w-4 h-4 text-amber-500" /> Featured Entry Talent
            </h3>

            <div className="space-y-3">
              {candidates.map(candidate => (
                <div key={candidate.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <img
                    src={candidate.avatar}
                    alt={candidate.name}
                    className="w-9 h-9 rounded-full object-cover border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{candidate.name}</h4>
                    <p className="text-[11px] text-slate-500 truncate">{candidate.headline}</p>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Ready
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
