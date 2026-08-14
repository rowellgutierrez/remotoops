import React, { useState } from 'react';
import { Search, Bell, Plus, Trash2, ArrowRight, CheckCircle2, Clock, Filter } from 'lucide-react';
import { SavedSearch, UserAccount, RoleCategory } from '../types';

interface SavedSearchesSectionProps {
  savedSearches: SavedSearch[];
  onAddSavedSearch: (search: SavedSearch) => void;
  onDeleteSavedSearch: (searchId: string) => void;
  onExecuteSearch: (search: SavedSearch) => void;
  onExploreJobs: () => void;
  currentUser: UserAccount | null;
}

export const SavedSearchesSection: React.FC<SavedSearchesSectionProps> = ({
  savedSearches,
  onAddSavedSearch,
  onDeleteSavedSearch,
  onExecuteSearch,
  onExploreJobs,
  currentUser
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [searchKeywords, setSearchKeywords] = useState('');
  const [searchCategory, setSearchCategory] = useState<RoleCategory | 'all'>('all');
  const [searchTimezone, setSearchTimezone] = useState('');

  const handleCreateSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchName.trim()) return;

    const newSearch: SavedSearch = {
      id: `search-${Date.now()}`,
      userId: currentUser?.id || 'guest',
      name: searchName.trim(),
      query: searchKeywords.trim(),
      category: searchCategory !== 'all' ? searchCategory : undefined,
      timezone: searchTimezone || undefined,
      createdAt: new Date().toISOString()
    };

    onAddSavedSearch(newSearch);
    setSearchName('');
    setSearchKeywords('');
    setSearchCategory('all');
    setSearchTimezone('');
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-700 text-xs font-black uppercase tracking-wider mb-1">
            <Search className="w-4 h-4 text-teal-600" />
            Job Alerts & Queries
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Saved Searches</h1>
          <p className="text-sm text-slate-600 mt-1">
            Save your favorite search filters to quickly find relevant remote jobs in 1 click.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-600/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Save New Search</span>
        </button>
      </div>

      {/* Creation Modal / Inline Box */}
      {isCreating && (
        <form onSubmit={handleCreateSearch} className="bg-white p-6 rounded-3xl border-2 border-teal-300 shadow-lg space-y-4 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-teal-600" /> Create New Saved Job Search
            </h3>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Search Alert Name *</label>
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="e.g. Remote Executive Assistant (EST)"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Keywords / Skills</label>
              <input
                type="text"
                value={searchKeywords}
                onChange={(e) => setSearchKeywords(e.target.value)}
                placeholder="e.g. Notion, Google Workspace, Customer Care"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Role Category</label>
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              >
                <option value="all">All Categories</option>
                <option value="executive_assistant">Executive Assistant</option>
                <option value="admin_ops">Admin & Virtual Operations</option>
                <option value="customer_support">Customer Support & Chat</option>
                <option value="social_media_manager">Social Media Manager</option>
                <option value="data_lead_gen">Data & Lead Gen</option>
                <option value="creative_design">Graphic Design & Video</option>
                <option value="tech_web_ops">Tech, Web & Automation</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Timezone Preference</label>
              <input
                type="text"
                value={searchTimezone}
                onChange={(e) => setSearchTimezone(e.target.value)}
                placeholder="e.g. EST (UTC-5) or Flexible"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Save Search
            </button>
          </div>
        </form>
      )}

      {/* Saved Searches Grid */}
      {savedSearches.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto border border-teal-100">
            <Search className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-black text-slate-900">No saved searches yet</h3>
            <p className="text-xs text-slate-600 mt-1">
              Create a saved search to instantly run specific job queries with one click.
            </p>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-teal-600/20"
          >
            Create Your First Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedSearches.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                      <Search className="w-4 h-4" />
                    </div>
                    <h3 className="font-extrabold text-sm text-slate-900">{item.name}</h3>
                  </div>

                  <button
                    onClick={() => onDeleteSavedSearch(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Saved Search"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  {item.query && (
                    <div className="flex items-center gap-1.5 font-medium">
                      <span className="text-slate-400">Keywords:</span>
                      <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">{item.query}</span>
                    </div>
                  )}
                  {item.category && (
                    <div className="flex items-center gap-1.5 font-medium">
                      <span className="text-slate-400">Category:</span>
                      <span className="text-slate-700 capitalize">{item.category.replace('_', ' ')}</span>
                    </div>
                  )}
                  {item.timezone && (
                    <div className="flex items-center gap-1.5 font-medium">
                      <span className="text-slate-400">Timezone:</span>
                      <span className="text-slate-700">{item.timezone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  Added {new Date(item.createdAt).toLocaleDateString()}
                </span>

                <button
                  onClick={() => onExecuteSearch(item)}
                  className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                >
                  <span>Run Search</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
