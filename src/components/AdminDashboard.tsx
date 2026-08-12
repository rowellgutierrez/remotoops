import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CreditCard, 
  Briefcase, 
  Activity, 
  ShieldCheck, 
  Search, 
  Trash2, 
  ExternalLink, 
  RefreshCw, 
  UserPlus, 
  DollarSign, 
  Crown, 
  Building2, 
  CheckCircle, 
  AlertCircle,
  X,
  Lock,
  Mail,
  Copy,
  TrendingUp,
  Flag,
  ShieldAlert,
  Ban,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { db, collection, onSnapshot, query, orderBy, setDoc, doc, deleteDoc, updateDoc } from '../lib/firebase';

interface UserRecord {
  uid: string;
  email: string;
  displayName: string;
  role: 'jobseeker' | 'employer' | 'candidate' | 'client' | 'admin' | string;
  avatar?: string;
  coverImage?: string;
  headline?: string;
  professionalTitle?: string;
  phoneNumber?: string;
  location?: string;
  companyName?: string;
  about?: string;
  bio?: string;
  websiteUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  skills?: string[];
  experiences?: { id: string; title: string; company: string; period: string; description: string }[];
  education?: { id: string; degree: string; institution: string; year: string }[];
  createdAt?: string;
  lastLoginAt?: string;
  updatedAt?: string;
  subscriptionPlan?: string;
  status?: string;
  emailVerified?: boolean;
  verificationStatus?: 'incomplete' | 'pending' | 'verified' | 'rejected' | 'changes_required';
  verificationNotes?: string;
  isEmployerVerified?: boolean;
  isKycVerified?: boolean;
  kycDocType?: string;
  kycFacialMatchScore?: number;
}

interface ReportRecord {
  id: string;
  reportId?: string;
  reporterUid: string;
  reporterEmail?: string;
  jobId: string;
  jobTitle?: string;
  company?: string;
  employerUid?: string;
  reason: string;
  description?: string;
  details?: string;
  timestamp: string;
  status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED';
  adminNotes?: string;
}

interface FirestoreJobRecord {
  id: string;
  title: string;
  company: string;
  postedBy?: string;
  clientName?: string;
  jobStatus?: string;
  compensation?: string;
  postedDate?: string;
  isVerifiedSafeClient?: boolean;
}

interface SubscriptionRecord {
  id: string;
  userId: string;
  userEmail: string;
  userName?: string;
  plan: string;
  amountPhp: number;
  amountUsd?: number;
  reference: string;
  paymongoLink?: string;
  status: string;
  createdAt: string;
}

interface ActivityLogRecord {
  id: string;
  userId?: string;
  userEmail?: string;
  action: string;
  timestamp: string;
  details?: string;
}

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserEmail?: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose, currentUserEmail }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'reports' | 'employers' | 'jobs' | 'subscriptions' | 'logs'>('reports');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const [users, setUsers] = useState<UserRecord[]>([]);
  const [reports, setReports] = useState<ReportRecord[]>([]);
  const [dbJobs, setDbJobs] = useState<FirestoreJobRecord[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>([]);
  const [logs, setLogs] = useState<ActivityLogRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [inspectingUser, setInspectingUser] = useState<UserRecord | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);

    // 1. Subscribe to Users collection
    const usersUnsub = onSnapshot(collection(db, 'users'), (snapshot) => {
      const userList: UserRecord[] = [];
      snapshot.forEach((doc) => {
        userList.push({ uid: doc.id, ...doc.data() } as UserRecord);
      });
      setUsers(userList);
      setLoading(false);
    }, (err) => {
      console.warn("Firestore users listener error:", err);
      setLoading(false);
    });

    // 2. Subscribe to Reports collection
    const reportsUnsub = onSnapshot(collection(db, 'reports'), (snapshot) => {
      const repList: ReportRecord[] = [];
      snapshot.forEach((doc) => {
        repList.push({ id: doc.id, ...doc.data() } as ReportRecord);
      });
      repList.sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime());
      setReports(repList);
    }, (err) => console.warn("Firestore reports listener error:", err));

    // 3. Subscribe to Job Posts collection
    const jobsUnsub = onSnapshot(collection(db, 'job_posts'), (snapshot) => {
      const jobList: FirestoreJobRecord[] = [];
      snapshot.forEach((doc) => {
        jobList.push({ id: doc.id, ...doc.data() } as FirestoreJobRecord);
      });
      setDbJobs(jobList);
    }, (err) => console.warn("Firestore jobs listener error:", err));

    // 4. Subscribe to Subscriptions collection
    const subsUnsub = onSnapshot(collection(db, 'subscriptions'), (snapshot) => {
      const subList: SubscriptionRecord[] = [];
      snapshot.forEach((doc) => {
        subList.push({ id: doc.id, ...doc.data() } as SubscriptionRecord);
      });
      subList.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setSubscriptions(subList);
    }, (err) => console.warn("Firestore subs listener error:", err));

    // 5. Subscribe to Activity Logs collection
    const logsUnsub = onSnapshot(collection(db, 'activity_logs'), (snapshot) => {
      const logList: ActivityLogRecord[] = [];
      snapshot.forEach((doc) => {
        logList.push({ id: doc.id, ...doc.data() } as ActivityLogRecord);
      });
      logList.sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime());
      setLogs(logList);
    }, (err) => console.warn("Firestore logs listener error:", err));

    return () => {
      usersUnsub();
      reportsUnsub();
      jobsUnsub();
      subsUnsub();
      logsUnsub();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Analytics Metrics
  const totalUsers = users.length;
  const totalEmployers = users.filter(u => u.role === 'employer' || u.role === 'client').length;
  const openReportsCount = reports.filter(r => r.status === 'OPEN').length;
  const totalRevenuePhp = subscriptions.reduce((sum, s) => sum + (s.amountPhp || 0), 0);

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleUpdateReportStatus = async (reportId: string, status: 'RESOLVED' | 'DISMISSED' | 'UNDER_REVIEW', notes?: string) => {
    try {
      const now = new Date().toISOString();
      await setDoc(doc(db, 'reports', reportId), {
        status,
        adminNotes: notes || '',
        resolvedAt: now
      }, { merge: true });

      await setDoc(doc(collection(db, 'audit_logs')), {
        adminUid: currentUserEmail || 'Admin',
        action: `REPORT_${status}`,
        targetType: 'report',
        targetId: reportId,
        timestamp: now,
        details: notes || `Report marked as ${status}`
      });
    } catch (err) {
      console.error("Error updating report status:", err);
    }
  };

  const handleToggleEmployerVerification = async (uid: string, currentStatus?: boolean) => {
    const nextStatus = !currentStatus;
    try {
      const now = new Date().toISOString();
      await setDoc(doc(db, 'users', uid), {
        isEmployerVerified: nextStatus,
        verificationStatus: nextStatus ? 'verified' : 'incomplete',
        updatedAt: now
      }, { merge: true });

      await setDoc(doc(collection(db, 'audit_logs')), {
        adminUid: currentUserEmail || 'Admin',
        action: nextStatus ? 'EMPLOYER_VERIFIED' : 'EMPLOYER_VERIFICATION_REVOKED',
        targetType: 'employer',
        targetId: uid,
        timestamp: now
      });
    } catch (err) {
      console.error("Error toggling employer verification:", err);
    }
  };

  const handleSuspendEmployer = async (uid: string) => {
    if (!confirm("Are you sure you want to suspend this employer account?")) return;
    try {
      const now = new Date().toISOString();
      await setDoc(doc(db, 'users', uid), {
        status: 'suspended',
        isEmployerVerified: false,
        updatedAt: now
      }, { merge: true });

      await setDoc(doc(collection(db, 'audit_logs')), {
        adminUid: currentUserEmail || 'Admin',
        action: 'EMPLOYER_SUSPENDED',
        targetType: 'employer',
        targetId: uid,
        timestamp: now
      });
    } catch (err) {
      console.error("Error suspending employer:", err);
    }
  };

  const handleUpdateJobStatus = async (jobId: string, newStatus: 'OPEN' | 'SUSPENDED' | 'CLOSED') => {
    try {
      const now = new Date().toISOString();
      await setDoc(doc(db, 'job_posts', jobId), {
        jobStatus: newStatus,
        updatedAt: now
      }, { merge: true });

      await setDoc(doc(collection(db, 'audit_logs')), {
        adminUid: currentUserEmail || 'Admin',
        action: `JOB_${newStatus}`,
        targetType: 'job',
        targetId: jobId,
        timestamp: now
      });
    } catch (err) {
      console.error("Error updating job status:", err);
    }
  };

  const handleToggleAdmin = async (user: UserRecord) => {
    const newRole = user.role === 'admin' ? 'jobseeker' : 'admin';
    try {
      await setDoc(doc(db, 'users', user.uid), { ...user, role: newRole }, { merge: true });
    } catch (err) {
      console.error("Error updating user role:", err);
    }
  };

  const handleDeleteUser = async (uid: string) => {
    if (!confirm("Are you sure you want to delete this user from Firestore database?")) return;
    try {
      await deleteDoc(doc(db, 'users', uid));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-6xl w-full text-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Top Header */}
        <div className="p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center font-bold">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white">RemotoOps Admin Moderation Console</h2>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active Shield
                </span>
              </div>
              <p className="text-xs text-slate-400">Review scam reports, verify employers, moderate job listings, and inspect security audit logs.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 bg-slate-800/80 border border-slate-700/80 px-3 py-1.5 rounded-lg">
              Logged in as: <strong className="text-white">{currentUserEmail || 'System Admin'}</strong>
            </span>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Analytics Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-6 bg-slate-950/50 border-b border-slate-800/80">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-1">
              <span>Flagged Job Reports</span>
              <Flag className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-black text-rose-400">{openReportsCount}</div>
            <div className="text-[10px] text-slate-500 mt-1">{reports.length} Total Reports Logged</div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-1">
              <span>Employers Registered</span>
              <Building2 className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-indigo-300">{totalEmployers}</div>
            <div className="text-[10px] text-slate-500 mt-1">{users.filter(u => u.isEmployerVerified).length} Verified Employers</div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-1">
              <span>Total Job Postings</span>
              <Briefcase className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl font-black text-teal-300">{dbJobs.length}</div>
            <div className="text-[10px] text-slate-500 mt-1">Firestore job_posts collection</div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-1">
              <span>Total Users</span>
              <Users className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white">{totalUsers}</div>
            <div className="text-[10px] text-slate-500 mt-1">Registered Accounts</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap border-b border-slate-800 bg-slate-950 px-6 gap-2">
          <button
            onClick={() => setActiveTab('reports')}
            className={`py-3 px-4 font-bold text-xs border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'reports'
                ? 'border-rose-500 text-rose-400 bg-rose-500/10'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Flag className="w-4 h-4" />
            Scam & Job Reports ({reports.length})
            {openReportsCount > 0 && (
              <span className="bg-rose-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-extrabold animate-pulse">
                {openReportsCount} NEW
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('employers')}
            className={`py-3 px-4 font-bold text-xs border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'employers'
                ? 'border-indigo-400 text-indigo-400 bg-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Employer Verification Desk ({totalEmployers})
          </button>

          <button
            onClick={() => setActiveTab('jobs')}
            className={`py-3 px-4 font-bold text-xs border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'jobs'
                ? 'border-teal-400 text-teal-400 bg-teal-500/10'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Job Listings ({dbJobs.length})
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`py-3 px-4 font-bold text-xs border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'users'
                ? 'border-teal-400 text-teal-400 bg-teal-500/10'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            User Accounts ({users.length})
          </button>

          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`py-3 px-4 font-bold text-xs border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'subscriptions'
                ? 'border-teal-400 text-teal-400 bg-teal-500/10'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Subscriptions ({subscriptions.length})
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`py-3 px-4 font-bold text-xs border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'logs'
                ? 'border-teal-400 text-teal-400 bg-teal-500/10'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            Audit Logs ({logs.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* TAB: SCAM & JOB REPORTS */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              <div className="bg-rose-950/40 border border-rose-800/50 rounded-2xl p-4 flex items-center justify-between text-xs text-rose-200">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
                  <span>Reporter identity is kept confidential and is never shown to reported employers.</span>
                </div>
              </div>

              {reports.length === 0 ? (
                <div className="py-12 text-center bg-slate-950/40 border border-slate-800 rounded-2xl p-6 space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <p className="text-sm font-bold text-slate-300">No Job Reports Filed</p>
                  <p className="text-xs text-slate-500">When candidates flag suspicious job posts or recruiters, they will populate live here.</p>
                </div>
              ) : (
                <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/50">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                      <tr>
                        <th className="p-3.5">Reported Job & Employer</th>
                        <th className="p-3.5">Reason</th>
                        <th className="p-3.5">Description</th>
                        <th className="p-3.5">Date</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Moderation Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {reports.map((rep) => (
                        <tr key={rep.id} className="hover:bg-slate-900/60 transition-colors">
                          <td className="p-3.5">
                            <div className="font-bold text-white">{rep.jobTitle || 'Job Post'}</div>
                            <div className="text-[11px] text-indigo-300 font-medium">Company: {rep.company || 'Employer'}</div>
                            <div className="text-[10px] text-slate-500">ID: {rep.jobId}</div>
                          </td>

                          <td className="p-3.5">
                            <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2.5 py-1 rounded-lg font-bold text-[10px]">
                              {rep.reason}
                            </span>
                          </td>

                          <td className="p-3.5 max-w-xs text-[11px] text-slate-300 italic">
                            "{rep.description || rep.details || 'No explanation provided.'}"
                          </td>

                          <td className="p-3.5 text-slate-400 text-[11px]">
                            {rep.timestamp ? new Date(rep.timestamp).toLocaleString() : 'Recent'}
                          </td>

                          <td className="p-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                              rep.status === 'OPEN' 
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                                : rep.status === 'RESOLVED'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-slate-800 text-slate-400'
                            }`}>
                              {rep.status}
                            </span>
                          </td>

                          <td className="p-3.5 text-right space-x-1.5">
                            {rep.status === 'OPEN' && (
                              <>
                                <button
                                  onClick={() => handleUpdateReportStatus(rep.id, 'RESOLVED', 'Resolved by admin moderation')}
                                  className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] rounded-lg transition-all"
                                >
                                  Resolve
                                </button>
                                <button
                                  onClick={() => handleUpdateReportStatus(rep.id, 'DISMISSED', 'Dismissed after review')}
                                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[11px] rounded-lg transition-all"
                                >
                                  Dismiss
                                </button>
                              </>
                            )}

                            {rep.employerUid && rep.employerUid !== 'unknown' && (
                              <button
                                onClick={() => handleSuspendEmployer(rep.employerUid!)}
                                className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold text-[11px] rounded-lg transition-all"
                                title="Suspend Employer Account"
                              >
                                Suspend Employer
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB: EMPLOYER VERIFICATION DESK */}
          {activeTab === 'employers' && (
            <div className="space-y-4">
              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/50">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5">Employer / Company</th>
                      <th className="p-3.5">Email</th>
                      <th className="p-3.5">Account Status</th>
                      <th className="p-3.5">Verification Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {users.filter(u => u.role === 'employer' || u.role === 'client').map((emp) => (
                      <tr key={emp.uid} className="hover:bg-slate-900/60 transition-colors">
                        <td className="p-3.5 font-bold text-white">
                          {emp.companyName || emp.displayName || 'Employer'}
                        </td>
                        <td className="p-3.5 text-slate-300 font-mono text-[11px]">
                          {emp.email}
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            emp.status === 'suspended' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            {emp.status || 'active'}
                          </span>
                        </td>
                        <td className="p-3.5">
                          {emp.isEmployerVerified ? (
                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 w-fit">
                              <ShieldCheck className="w-3.5 h-3.5" /> ✓ Employer Verified
                            </span>
                          ) : (
                            <span className="bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-bold w-fit">
                              Verification Pending
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-right space-x-1.5">
                          <button
                            onClick={() => handleToggleEmployerVerification(emp.uid, emp.isEmployerVerified)}
                            className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all ${
                              emp.isEmployerVerified
                                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow'
                            }`}
                          >
                            {emp.isEmployerVerified ? 'Revoke Verification' : '✓ Mark Employer Verified'}
                          </button>

                          <button
                            onClick={() => handleSuspendEmployer(emp.uid)}
                            className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold text-[11px] rounded-lg"
                          >
                            Suspend
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: JOB POSTINGS */}
          {activeTab === 'jobs' && (
            <div className="space-y-4">
              {dbJobs.length === 0 ? (
                <div className="py-12 text-center bg-slate-950/40 border border-slate-800 rounded-2xl p-6">
                  <Briefcase className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-300">No Job Postings in Firestore</p>
                  <p className="text-xs text-slate-500 mt-1">When employers submit new opportunities, they will display live here.</p>
                </div>
              ) : (
                <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/50">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                      <tr>
                        <th className="p-3.5">Job Title</th>
                        <th className="p-3.5">Company</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5">Stipend / Pay</th>
                        <th className="p-3.5 text-right">Moderation Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {dbJobs.map((j) => (
                        <tr key={j.id} className="hover:bg-slate-900/60 transition-colors">
                          <td className="p-3.5 font-bold text-white">{j.title}</td>
                          <td className="p-3.5 text-slate-300">{j.company}</td>
                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              j.jobStatus === 'CLOSED' || j.jobStatus === 'SUSPENDED'
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}>
                              {j.jobStatus || 'OPEN'}
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-300 font-mono text-[11px]">{j.compensation || 'Paid'}</td>
                          <td className="p-3.5 text-right space-x-1.5">
                            <button
                              onClick={() => handleUpdateJobStatus(j.id, j.jobStatus === 'CLOSED' ? 'OPEN' : 'CLOSED')}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] rounded-lg"
                            >
                              {j.jobStatus === 'CLOSED' ? 'Reopen Job' : 'Close Job'}
                            </button>

                            <button
                              onClick={() => handleUpdateJobStatus(j.id, 'SUSPENDED')}
                              className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold text-[11px] rounded-lg"
                            >
                              Suspend
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB: USERS & SIGNUPS */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Filter Role:</span>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-xs text-white px-3 py-2 rounded-xl focus:outline-none focus:border-teal-500"
                  >
                    <option value="all">All Roles</option>
                    <option value="jobseeker">Job Seekers</option>
                    <option value="employer">Employers / Clients</option>
                    <option value="admin">Admins</option>
                  </select>
                </div>
              </div>

              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/50">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5">User Account</th>
                      <th className="p-3.5">Role</th>
                      <th className="p-3.5">Identity Verification (KYC)</th>
                      <th className="p-3.5">Subscription Plan</th>
                      <th className="p-3.5">Registered</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredUsers.map((u) => (
                      <tr key={u.uid} className="hover:bg-slate-900/60 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5">
                            {u.avatar ? (
                              <img src={u.avatar} alt={u.displayName} className="w-8 h-8 rounded-full object-cover border border-slate-700" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-teal-400 text-xs">
                                {(u.displayName || u.email)[0].toUpperCase()}
                              </div>
                            )}
                            <div>
                              <div className="font-bold text-white flex items-center gap-1.5">
                                {u.displayName || u.email.split('@')[0]}
                                {u.role === 'admin' && (
                                  <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[9px] px-1.5 py-0.2 rounded font-extrabold">
                                    ADMIN
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                <Mail className="w-3 h-3 text-slate-500" />
                                {u.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                            u.role === 'admin'
                              ? 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                              : u.role === 'employer' || u.role === 'client'
                              ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300'
                              : 'bg-teal-500/10 border-teal-500/20 text-teal-300'
                          }`}>
                            {u.role === 'client' ? 'Employer' : u.role}
                          </span>
                        </td>

                        <td className="p-3.5">
                          {u.isKycVerified || u.role === 'admin' ? (
                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] px-2 py-0.5 rounded font-bold flex items-center gap-1 w-fit">
                              <ShieldCheck className="w-3 h-3" /> Verified KYC
                            </span>
                          ) : (
                            <span className="bg-slate-800 text-slate-400 border border-slate-700 text-[10px] px-2 py-0.5 rounded font-medium">
                              Unverified
                            </span>
                          )}
                        </td>

                        <td className="p-3.5">
                          <span className="font-mono text-xs font-semibold text-slate-200">
                            {u.subscriptionPlan || 'Free Tier'}
                          </span>
                        </td>

                        <td className="p-3.5 text-slate-400">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Just now'}
                        </td>

                        <td className="p-3.5 text-right space-x-1.5">
                          <button
                            onClick={() => setInspectingUser(u)}
                            className="px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-300 border border-teal-500/30 hover:bg-teal-500/20 font-bold text-[11px]"
                          >
                            Inspect
                          </button>

                          <button
                            onClick={() => handleToggleAdmin(u)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-amber-300 hover:bg-slate-700 font-semibold text-[11px]"
                          >
                            {u.role === 'admin' ? 'Revoke Admin' : '+ Admin'}
                          </button>

                          <button
                            onClick={() => handleDeleteUser(u.uid)}
                            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: SUBSCRIPTIONS */}
          {activeTab === 'subscriptions' && (
            <div className="space-y-4">
              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/50">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5">Client Email</th>
                      <th className="p-3.5">Plan</th>
                      <th className="p-3.5">Amount</th>
                      <th className="p-3.5">Reference</th>
                      <th className="p-3.5">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {subscriptions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-900/60 transition-colors">
                        <td className="p-3.5 font-bold text-white">{sub.userEmail || 'Client'}</td>
                        <td className="p-3.5"><span className="bg-teal-500/10 text-teal-300 px-2 py-0.5 rounded font-extrabold">{sub.plan}</span></td>
                        <td className="p-3.5 font-mono font-bold text-emerald-400">₱{sub.amountPhp}</td>
                        <td className="p-3.5 font-mono text-slate-400">{sub.reference || 'N/A'}</td>
                        <td className="p-3.5 text-slate-400 text-[11px]">{sub.createdAt ? new Date(sub.createdAt).toLocaleString() : 'Recent'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: AUDIT LOGS */}
          {activeTab === 'logs' && (
            <div className="space-y-4">
              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/50">
                <div className="p-3.5 bg-slate-900 border-b border-slate-800 font-extrabold text-xs text-slate-300">
                  Live Admin Audit & Activity Stream
                </div>
                <div className="divide-y divide-slate-800/60 max-h-96 overflow-y-auto">
                  {logs.map((log) => (
                    <div key={log.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-900/40">
                      <div className="space-y-0.5">
                        <div className="font-bold text-white flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                          {log.action}
                        </div>
                        <p className="text-[11px] text-slate-400">{log.details || 'System event'}</p>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'Now'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>RemotoOps Protected Infrastructure</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors"
          >
            Close Dashboard
          </button>
        </div>

      </div>

      {/* INSPECT USER PROFILE OVERLAY MODAL */}
      {inspectingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full text-white overflow-hidden my-auto p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-lg text-white">{inspectingUser.displayName || inspectingUser.email}</h3>
              <button onClick={() => setInspectingUser(null)} className="p-1 rounded-lg bg-slate-800 text-slate-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-300">Email: {inspectingUser.email} • Role: {inspectingUser.role}</p>
            <p className="text-xs text-slate-400">Headline: {inspectingUser.headline || 'None'}</p>
            <div className="pt-2">
              <button onClick={() => setInspectingUser(null)} className="px-4 py-2 bg-slate-800 text-xs font-bold rounded-xl text-white">
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

