import React, { useState, useEffect } from 'react';
import logoImg from './assets/images/remotoops_logo_1786167434166.jpg';
import { JobPost, CandidateProfile, FeedPost, Application, DirectMessage, UserAccount, ScamReport } from './types';
import { 
  INITIAL_JOBS, 
  INITIAL_CANDIDATES, 
  INITIAL_FEED, 
  INITIAL_APPLICATIONS 
} from './data/mockData';
import { auth, db, setDoc, doc, getDoc, getDocs, collection, onAuthStateChanged, signOut, where, query, deleteDoc } from './lib/firebase';
import { Header } from './components/Header';
import { FeedSection } from './components/FeedSection';
import { JobsSection } from './components/JobsSection';
import { TalentSection } from './components/TalentSection';
import { MentorshipHub } from './components/MentorshipHub';
import { PortalSection } from './components/PortalSection';
import { PostJobModal } from './components/PostJobModal';
import { AuthModal } from './components/AuthModal';
import { AntiScamHub } from './components/AntiScamHub';
import { ReportScamModal } from './components/ReportScamModal';
import { ATSResumeSection } from './components/ATSResumeSection';
import { InterviewGuideSection } from './components/InterviewGuideSection';
import { EmployerPricingModal } from './components/EmployerPricingModal';
import { AdminDashboard } from './components/AdminDashboard';
import { KYCVerificationModal } from './components/KYCVerificationModal';
import { UserProfileModal } from './components/UserProfileModal';
import { ExternalLinkWarningModal } from './components/ExternalLinkWarningModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<'jobs' | 'ats_resume' | 'interview_prep' | 'anti_scam' | 'mentorship' | 'talent' | 'portal' | 'feed'>('jobs');
  const [searchQuery, setSearchQuery] = useState('');

  // Auth User State - Starts as null for public guest experience
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [isEmployerPricingOpen, setIsEmployerPricingOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [externalLinkTarget, setExternalLinkTarget] = useState<{ url: string; jobTitle?: string; company?: string } | null>(null);

  // Scam Report Modal State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportJobData, setReportJobData] = useState<{ id?: string; title?: string; company?: string }>({});
  const [scamReports, setScamReports] = useState<ScamReport[]>([]);

  // Application Data State
  const [jobs, setJobs] = useState<JobPost[]>(INITIAL_JOBS);
  const [candidates] = useState<CandidateProfile[]>(INITIAL_CANDIDATES);
  const [posts, setPosts] = useState<FeedPost[]>(INITIAL_FEED);
  const [applications, setApplications] = useState<Application[]>(INITIAL_APPLICATIONS);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [messages, setMessages] = useState<DirectMessage[]>([
    {
      id: 'msg-1',
      conversationId: 'conv-1',
      senderId: 'client-1',
      receiverId: 'cand-1',
      senderName: 'Sarah Jenkins (Apex Global)',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      text: 'Hi Alex! We reviewed your application and love your Google Calendar SOP. Let’s schedule a remote intro chat!',
      timestamp: '2 hours ago'
    }
  ]);

  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);

  // Auth State Listener using Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const idTokenResult = await firebaseUser.getIdTokenResult().catch(() => null);
          const isAdminClaim = idTokenResult?.claims?.admin === true;

          // Call reload to ensure we have fresh user properties from Firebase Auth
          await firebaseUser.reload().catch((rErr) => console.warn("[App] User reload notice:", rErr));

          console.log(`[App] Auth state changed. User: ${firebaseUser.email} | emailVerified: ${firebaseUser.emailVerified}`);

          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userDocRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            const isAdmin = isAdminClaim || userData.role === 'admin';
            const isVerified = firebaseUser.emailVerified || isAdmin;

            setCurrentUser({
              id: firebaseUser.uid,
              name: userData.displayName || userData.name || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Member',
              email: firebaseUser.email || '',
              role: isAdmin ? 'admin' : (userData.role === 'employer' || userData.role === 'client' ? 'client' : 'candidate'),
              avatar: userData.avatar || firebaseUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
              headline: isAdmin ? 'RemotoOps Super Admin' : (userData.headline || 'Member'),
              location: userData.location || 'Remote Worldwide',
              phoneNumber: userData.phoneNumber,
              professionalTitle: userData.professionalTitle,
              companyName: userData.companyName,
              companyWebsite: userData.companyWebsite,
              companyDescription: userData.companyDescription,
              about: userData.about || userData.bio,
              emailVerified: isVerified,
              verificationStatus: userData.verificationStatus || 'incomplete',
              verificationNotes: userData.verificationNotes,
              isEmployerVerified: userData.isEmployerVerified,
              isProfileVerified: userData.isProfileVerified,
              isKycVerified: userData.isKycVerified,
              isNoExperienceBeginner: userData.isNoExperienceBeginner,
              portfolioUrl: userData.portfolioUrl,
              resumeUrl: userData.resumeUrl,
              workExperience: userData.workExperience,
              skills: userData.skills || [],
              status: userData.status || 'active',
              createdAt: userData.createdAt,
              lastLoginAt: new Date().toISOString()
            });
          } else {
            // Document doesn't exist yet, construct basic fallback
            const isAdmin = isAdminClaim;
            const isVerified = firebaseUser.emailVerified || isAdmin;

            const fallbackUser: UserAccount = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Member',
              email: firebaseUser.email || '',
              role: isAdmin ? 'admin' : 'candidate',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
              headline: isAdmin ? 'RemotoOps Super Admin' : 'Jobseeker',
              location: 'Remote Worldwide',
              emailVerified: isVerified,
              verificationStatus: 'incomplete',
              status: 'active'
            };
            setCurrentUser(fallbackUser);
          }
        } catch (err) {
          console.error("Error fetching user profile from Firestore:", err);
        }
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Sign out error:", err);
    }
    setCurrentUser(null);
  };
  useEffect(() => {
    const seedFirestore = async () => {
      if (!auth.currentUser) return;
      const idTokenResult = await auth.currentUser.getIdTokenResult().catch(() => null);
      const isAdminUser = idTokenResult?.claims?.admin === true;
      if (!isAdminUser) {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        const userSnap = await getDoc(userDocRef).catch(() => null);
        if (userSnap?.data()?.role !== 'admin') return;
      }

      try {
        const snap = await getDocs(collection(db, 'users'));
        if (snap.empty) {
          const initialUsers = [
            {
              id: auth.currentUser.uid,
              email: auth.currentUser.email || '',
              displayName: auth.currentUser.displayName || 'Super Admin',
              role: 'admin',
              createdAt: new Date().toISOString(),
              lastLoginAt: new Date().toISOString(),
              subscriptionPlan: 'Super Admin',
              companyName: 'RemotoOps Platform',
              status: 'active',
              isKycVerified: true
            }
          ];

          for (const u of initialUsers) {
            await setDoc(doc(db, 'users', u.id), u, { merge: true });
          }
        }
      } catch (err) {
        // Suppress initial seed permission logs for non-admin or unauthenticated states
      }
    };

    seedFirestore();
  }, []);

  // API Call Helpers targeting server/serverless endpoints
  const handleEnhanceJobWithAI = async (jobData: any) => {
    try {
      const res = await fetch('/api/ai/enhance-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData)
      });
      const json = await res.json();
      if (res.ok && json.success) return json;
      return {
        success: false,
        error: json.error || 'AI service is temporarily unavailable. Please try again.'
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'AI service is temporarily unavailable. Please try again.'
      };
    }
  };

  const handleAnalyzePitchWithAI = async (targetRole: string, draftPitch: string, background?: string) => {
    try {
      const res = await fetch('/api/ai/analyze-pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole,
          userPitch: draftPitch,
          userBackground: background || 'Career starter looking for remote mentorship'
        })
      });
      const json = await res.json();
      if (res.ok && json.success) return json;
      return {
        success: false,
        error: json.error || 'AI service is temporarily unavailable. Please try again.'
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'AI service is temporarily unavailable. Please try again.'
      };
    }
  };

  const handleGenerateInterviewPrep = async (roleType: string, experienceLevel: string) => {
    try {
      const res = await fetch('/api/ai/interview-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleType, experienceLevel })
      });
      const json = await res.json();
      if (res.ok && json.success) return json;
      return {
        success: false,
        error: json.error || 'AI service is temporarily unavailable. Please try again.'
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'AI service is temporarily unavailable. Please try again.'
      };
    }
  };

  // Handlers
  const handleAddJob = (newJob: JobPost) => {
    setJobs([newJob, ...jobs]);
  };

  // Sync user's saved jobs and applications from Firestore
  useEffect(() => {
    if (!currentUser?.id) return;

    const fetchUserData = async () => {
      try {
        // Fetch saved jobs
        const savedQ = query(collection(db, 'saved_jobs'), where('userId', '==', currentUser.id));
        const savedSnap = await getDocs(savedQ);
        const ids: string[] = [];
        savedSnap.forEach(d => {
          const data = d.data() as { jobId?: string };
          if (data && data.jobId) ids.push(data.jobId);
        });
        if (ids.length > 0) {
          setSavedJobIds(prev => Array.from(new Set([...prev, ...ids])));
        }

        // Fetch applications
        const appsQ = query(collection(db, 'applications'), where('candidateId', '==', currentUser.id));
        const appsSnap = await getDocs(appsQ);
        const userApps: Application[] = [];
        appsSnap.forEach(d => {
          const data = d.data() || {};
          userApps.push({ id: d.id, ...data } as Application);
        });
        if (userApps.length > 0) {
          setApplications(prev => {
            const combined = [...userApps, ...prev];
            const uniqueMap = new Map();
            combined.forEach(a => uniqueMap.set(a.id, a));
            return Array.from(uniqueMap.values());
          });
        }
      } catch (err) {
        console.warn("[App] Notice fetching user data:", err);
      }
    };

    fetchUserData();
  }, [currentUser?.id]);

  const handleToggleSaveJob = async (job: JobPost) => {
    if (savedJobIds.includes(job.id)) {
      setSavedJobIds(prev => prev.filter(id => id !== job.id));
      if (currentUser?.id) {
        try {
          await deleteDoc(doc(db, 'saved_jobs', `${currentUser.id}_${job.id}`));
        } catch (err) {
          console.error("Unsave job error:", err);
        }
      }
    } else {
      setSavedJobIds(prev => [...prev, job.id]);
      if (currentUser?.id) {
        try {
          await setDoc(doc(db, 'saved_jobs', `${currentUser.id}_${job.id}`), {
            userId: currentUser.id,
            userEmail: currentUser.email,
            jobId: job.id,
            jobTitle: job.title,
            company: job.company,
            companyLogo: job.companyLogo,
            compensation: job.compensation,
            location: job.clientLocation,
            jobStatus: job.jobStatus || 'OPEN',
            savedAt: new Date().toISOString()
          }, { merge: true });
        } catch (err) {
          console.error("Save job error:", err);
        }
      }
    }
  };

  const handleApplyToJob = async (job: JobPost, pitch: string, tools: string[]) => {
    const isExternal = job.applicationMethod === 'external';
    const now = new Date().toISOString();
    const candidateId = currentUser ? currentUser.id : 'user-me';

    // Prevent duplicate application
    const existing = applications.find(
      a => a.jobId === job.id && (a.candidateId === candidateId || a.candidateEmail === currentUser?.email)
    );
    if (existing) {
      console.warn("User already applied to job:", job.id);
      return;
    }

    const appId = `${candidateId}_${job.id}`;
    const newApp: Application = {
      id: appId,
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      candidateId: candidateId,
      candidateName: currentUser ? (currentUser.name || currentUser.displayName || 'Member') : 'Alex Rivers',
      candidateAvatar: currentUser ? currentUser.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      candidateEmail: currentUser ? currentUser.email : 'alex.rivers@remotoops.dev',
      coverPitch: pitch,
      toolExperience: tools,
      status: 'applied',
      appliedAt: 'Just now',
      applicationType: isExternal ? 'external_click' : 'direct',
      externalUrl: isExternal ? job.externalApplyUrl : undefined
    };

    setApplications(prev => {
      if (prev.some(a => a.id === appId || (a.jobId === job.id && a.candidateId === candidateId))) {
        return prev;
      }
      return [newApp, ...prev];
    });

    if (currentUser?.id) {
      try {
        await setDoc(doc(db, 'applications', appId), {
          ...newApp,
          appliedAt: now
        });
      } catch (err) {
        console.error("Firestore application submission error:", err);
      }
    }
  };

  const handleUpdateAppStatus = (appId: string, status: Application['status'], notes?: string) => {
    setApplications(prev =>
      prev.map(app => (app.id === appId ? { ...app, status, mentorNotes: notes || app.mentorNotes } : app))
    );
  };

  const handleSendDirectMessage = (text: string, receiverName: string) => {
    const newMsg: DirectMessage = {
      id: `msg-${Date.now()}`,
      conversationId: `conv-${Date.now()}`,
      senderId: currentUser ? currentUser.id : 'user-me',
      receiverId: 'receiver-1',
      senderName: currentUser ? currentUser.name : 'Alex Rivers',
      senderAvatar: currentUser ? currentUser.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      text,
      timestamp: 'Just now'
    };
    setMessages([...messages, newMsg]);
  };

  const handleOpenReportModal = (jobId?: string, jobTitle?: string, company?: string) => {
    setReportJobData({ id: jobId, title: jobTitle, company });
    setIsReportModalOpen(true);
  };

  const handleSubmitReport = (report: ScamReport) => {
    setScamReports([report, ...scamReports]);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuthModal={(mode) => {
          setAuthModalMode(mode || 'login');
          setIsAuthModalOpen(true);
        }}
        onLogout={handleLogout}
        onOpenPostJob={() => setIsPostJobModalOpen(true)}
        onOpenPricingModal={() => setIsEmployerPricingOpen(true)}
        onOpenAdminConsole={() => setIsAdminDashboardOpen(true)}
        onOpenKycModal={() => setIsKycModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        applicationCount={applications.length}
      />

      {/* Main Content Body */}
      <main className="flex-1 pb-16">
        
        {activeTab === 'jobs' && (
          <JobsSection
            jobs={jobs}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            currentUser={currentUser}
            onOpenAuthModal={(mode) => {
              setAuthModalMode(mode || 'login');
              setIsAuthModalOpen(true);
            }}
            onApply={handleApplyToJob}
            onOpenPostJob={() => setIsPostJobModalOpen(true)}
            onAnalyzePitchWithAI={handleAnalyzePitchWithAI}
            onOpenReportModal={handleOpenReportModal}
            onOpenSafetyHub={() => setActiveTab('anti_scam')}
            savedJobIds={savedJobIds}
            onToggleSaveJob={handleToggleSaveJob}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
            onExternalApply={(job) => {
              setExternalLinkTarget({
                url: job.externalApplyUrl || '#',
                jobTitle: job.title,
                company: job.company
              });
            }}
          />
        )}

        {activeTab === 'ats_resume' && (
          <ATSResumeSection />
        )}

        {activeTab === 'interview_prep' && (
          <InterviewGuideSection />
        )}

        {activeTab === 'anti_scam' && (
          <AntiScamHub onOpenReportModal={handleOpenReportModal} />
        )}

        {activeTab === 'feed' && (
          <FeedSection
            posts={posts}
            setPosts={setPosts}
            jobs={jobs}
            candidates={candidates}
            onSelectJob={(job) => {
              setActiveTab('jobs');
            }}
            onNavigateToMentorship={() => setActiveTab('mentorship')}
          />
        )}

        {activeTab === 'talent' && (
          <TalentSection
            candidates={candidates}
            onSendMessage={(candidateName) => {
              setActiveTab('portal');
            }}
            onOpenEmployerPricing={() => setIsEmployerPricingOpen(true)}
          />
        )}

        {activeTab === 'mentorship' && (
          <MentorshipHub
            onAnalyzePitch={handleAnalyzePitchWithAI}
            onGenerateInterviewPrep={handleGenerateInterviewPrep}
          />
        )}

        {activeTab === 'portal' && (
          <PortalSection
            applications={applications}
            onUpdateStatus={handleUpdateAppStatus}
            userType={currentUser ? currentUser.role : 'candidate'}
            messages={messages}
            onSendDirectMessage={handleSendDirectMessage}
          />
        )}
      </main>

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => setCurrentUser(user)}
        initialMode={authModalMode}
      />

      <ReportScamModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        jobId={reportJobData.id}
        jobTitle={reportJobData.title}
        company={reportJobData.company}
        onSubmitReport={handleSubmitReport}
      />

      <PostJobModal
        isOpen={isPostJobModalOpen}
        onClose={() => setIsPostJobModalOpen(false)}
        onAddJob={handleAddJob}
        onEnhanceJobWithAI={handleEnhanceJobWithAI}
      />

      <EmployerPricingModal
        isOpen={isEmployerPricingOpen}
        onClose={() => setIsEmployerPricingOpen(false)}
      />

      <AdminDashboard
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        currentUserEmail={currentUser?.email || ''}
      />

      <KYCVerificationModal
        isOpen={isKycModalOpen}
        onClose={() => setIsKycModalOpen(false)}
        currentUser={currentUser}
        onVerificationComplete={(updatedUser) => {
          setCurrentUser(updatedUser);
        }}
      />

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        onUpdateProfile={(updatedUser) => {
          setCurrentUser(updatedUser);
        }}
        onOpenKycModal={() => setIsKycModalOpen(true)}
      />

      <ExternalLinkWarningModal
        isOpen={!!externalLinkTarget}
        onClose={() => setExternalLinkTarget(null)}
        targetUrl={externalLinkTarget?.url || ''}
        jobTitle={externalLinkTarget?.jobTitle}
        companyName={externalLinkTarget?.company}
        onConfirmProceed={(url) => {
          window.open(url, '_blank', 'noopener,noreferrer');
        }}
      />

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <img 
              src={logoImg} 
              alt="RemotoOps Logo" 
              referrerPolicy="no-referrer"
              className="w-6 h-6 rounded-full border border-teal-500/30 object-cover" 
            />
            <p className="font-medium text-slate-300">
              RemotoOps • Safe Global Remote Job Platform for Aspiring Beginners & Verified Clients
            </p>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => setActiveTab('anti_scam')} className="hover:text-teal-400">
              Anti-Scam Protection
            </button>
            <span>•</span>
            <button onClick={() => setActiveTab('ats_resume')} className="hover:text-teal-400">
              ATS Resume Builder
            </button>
            <span>•</span>
            <button onClick={() => setActiveTab('interview_prep')} className="hover:text-teal-400">
              Interview Guide
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
