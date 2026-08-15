import React, { useState, useEffect } from 'react';
import logoImg from './assets/images/remotoops_logo_1786167434166.jpg';
import { JobPost, Application, DirectMessage, UserAccount, ScamReport, SavedSearch } from './types';
import { INITIAL_JOBS } from './data/mockData';
import { 
  auth, 
  db, 
  setDoc, 
  doc, 
  getDocs, 
  onSnapshot, 
  collection, 
  onAuthStateChanged, 
  signOut, 
  where, 
  query, 
  deleteDoc 
} from './lib/firebase';

import { Sidebar } from './components/Sidebar';
import { Header, AppTab } from './components/Header';
import { JobsSection } from './components/JobsSection';
import { SavedJobsSection } from './components/SavedJobsSection';
import { SavedSearchesSection } from './components/SavedSearchesSection';
import { MyApplicationsSection } from './components/MyApplicationsSection';
import { EmployerSection } from './components/EmployerSection';
import { MessagesSection } from './components/MessagesSection';
import { ATSResumeSection } from './components/ATSResumeSection';
import { InterviewGuideSection } from './components/InterviewGuideSection';
import { AntiScamHub } from './components/AntiScamHub';
import { PostJobModal } from './components/PostJobModal';
import { AuthModal } from './components/AuthModal';
import { ReportScamModal } from './components/ReportScamModal';
import { EmployerPricingModal } from './components/EmployerPricingModal';
import { AdminDashboard } from './components/AdminDashboard';
import { KYCVerificationModal } from './components/KYCVerificationModal';
import { UserProfileModal } from './components/UserProfileModal';
import { ExternalLinkWarningModal } from './components/ExternalLinkWarningModal';
import { X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('find_jobs');
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Auth User State - Starts as null for public guest experience
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  // Global Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [isEmployerPricingOpen, setIsEmployerPricingOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [externalLinkTarget, setExternalLinkTarget] = useState<{ url: string; jobTitle?: string; company?: string } | null>(null);

  // Scam Report Modal State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportJobData, setReportJobData] = useState<{ id?: string; title?: string; company?: string }>({});

  // Core Collections State
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [messages, setMessages] = useState<DirectMessage[]>([
    {
      id: 'msg-welcome',
      conversationId: 'conv-1',
      senderId: 'client-1',
      receiverId: 'user-me',
      senderName: 'Apex Global Hiring Team',
      senderAvatar: '',
      text: 'Hello! Thank you for applying through RemotoOps. We review remote applications within 24-48 hours.',
      timestamp: 'Today at 10:00 AM'
    }
  ]);

  // Auth State Listener with real-time Firestore profile sync
  useEffect(() => {
    let unsubscribeDoc: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (unsubscribeDoc) {
        unsubscribeDoc();
        unsubscribeDoc = null;
      }

      if (firebaseUser) {
        try {
          const idTokenResult = await firebaseUser.getIdTokenResult().catch(() => null);
          const isAdminClaim = idTokenResult?.claims?.admin === true;

          await firebaseUser.reload().catch((rErr) => console.warn("[App] User reload notice:", rErr));

          const userDocRef = doc(db, 'users', firebaseUser.uid);

          unsubscribeDoc = onSnapshot(userDocRef, (userSnap) => {
            if (userSnap.exists()) {
              const userData = userSnap.data();
              const isAdmin = isAdminClaim || userData.role === 'admin';
              const isVerified = firebaseUser.emailVerified || isAdmin;

              setCurrentUser({
                id: firebaseUser.uid,
                name: userData.displayName || userData.name || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Member',
                email: firebaseUser.email || '',
                role: isAdmin ? 'admin' : (userData.role === 'employer' || userData.role === 'client' ? 'client' : 'candidate'),
                avatar: userData.avatar || '',
                headline: isAdmin ? 'RemotoOps Super Admin' : (userData.headline || 'Member'),
                location: userData.location || 'Remote Worldwide',
                phoneNumber: userData.phoneNumber,
                professionalTitle: userData.professionalTitle,
                companyName: userData.companyName,
                companyWebsite: userData.companyWebsite,
                companyDescription: userData.companyDescription,
                businessLocation: userData.businessLocation,
                contactName: userData.contactName,
                companyPhone: userData.companyPhone,
                bio: userData.bio || userData.about,
                about: userData.about || userData.bio,
                websiteUrl: userData.websiteUrl,
                linkedinUrl: userData.linkedinUrl,
                portfolioUrl: userData.portfolioUrl,
                resumeUrl: userData.resumeUrl,
                workExperience: userData.workExperience,
                skills: userData.skills || [],
                experiences: userData.experiences || [],
                education: userData.education || [],
                emailVerified: isVerified,
                verificationStatus: userData.verificationStatus || 'incomplete',
                verificationNotes: userData.verificationNotes,
                isEmployerVerified: userData.isEmployerVerified,
                isProfileVerified: userData.isProfileVerified,
                isKycVerified: userData.isKycVerified,
                isNoExperienceBeginner: userData.isNoExperienceBeginner,
                status: userData.status || 'active',
                createdAt: userData.createdAt,
                updatedAt: userData.updatedAt,
                lastLoginAt: userData.lastLoginAt || new Date().toISOString()
              });
            } else {
              const isAdmin = isAdminClaim;
              const isVerified = firebaseUser.emailVerified || isAdmin;

              setCurrentUser({
                id: firebaseUser.uid,
                name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Member',
                email: firebaseUser.email || '',
                role: isAdmin ? 'admin' : 'candidate',
                headline: isAdmin ? 'RemotoOps Super Admin' : 'Jobseeker',
                location: 'Remote Worldwide',
                emailVerified: isVerified,
                verificationStatus: 'incomplete',
                status: 'active'
              });
            }
          }, (err) => {
            console.error("Firestore user doc listener notice:", err);
          });
        } catch (err) {
          console.error("Error fetching user profile from Firestore:", err);
        }
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Sign out error:", err);
    }
    setCurrentUser(null);
  };

  // Fetch and synchronize job posts from Firestore in real-time
  useEffect(() => {
    const unsubJobs = onSnapshot(collection(db, 'job_posts'), async (snap) => {
      if (snap.empty) {
        // Initialize Firestore with verified jobs if database collection is empty
        try {
          for (const job of INITIAL_JOBS) {
            await setDoc(doc(db, 'job_posts', job.id), {
              ...job,
              postedBy: 'system',
              createdAt: new Date().toISOString()
            }, { merge: true });
          }
        } catch (seedErr) {
          console.warn("[App] Initial job seed note:", seedErr);
        }
      } else {
        const firestoreJobs: JobPost[] = [];
        snap.forEach(d => {
          firestoreJobs.push({ id: d.id, ...d.data() } as JobPost);
        });
        if (firestoreJobs.length > 0) {
          setJobs(firestoreJobs);
        }
      }
    }, (err) => {
      console.warn("[App] Notice listening to Firestore jobs:", err);
    });

    return () => unsubJobs();
  }, []);

  // Sync user's saved jobs, saved searches, applications, and conversations in real-time
  useEffect(() => {
    if (!currentUser?.id) {
      setSavedJobIds([]);
      setSavedSearches([]);
      setApplications([]);
      return;
    }

    // 1. Real-time saved jobs
    const savedQ = query(collection(db, 'saved_jobs'), where('userId', '==', currentUser.id));
    const unsubSaved = onSnapshot(savedQ, (savedSnap) => {
      const ids: string[] = [];
      savedSnap.forEach(d => {
        const data = d.data() as { jobId?: string };
        if (data && data.jobId) ids.push(data.jobId);
      });
      setSavedJobIds(Array.from(new Set(ids)));
    }, (err) => {
      console.warn("[App] Saved jobs listener error:", err);
    });

    // 2. Real-time saved searches
    const searchQ = query(collection(db, 'saved_searches'), where('userId', '==', currentUser.id));
    const unsubSearches = onSnapshot(searchQ, (searchSnap) => {
      const searchesList: SavedSearch[] = [];
      searchSnap.forEach(d => {
        searchesList.push({ id: d.id, ...d.data() } as SavedSearch);
      });
      setSavedSearches(searchesList);
    }, (err) => {
      console.warn("[App] Saved searches listener error:", err);
    });

    // 3. Real-time applications (applicant & employer view)
    const isEmployerRole = currentUser.role === 'client' || currentUser.role === 'employer' || currentUser.role === 'admin';
    const appsQ = isEmployerRole
      ? collection(db, 'applications')
      : query(collection(db, 'applications'), where('candidateId', '==', currentUser.id));

    const unsubApps = onSnapshot(appsQ, (appsSnap) => {
      const userApps: Application[] = [];
      appsSnap.forEach(d => {
        userApps.push({ id: d.id, ...d.data() } as Application);
      });
      setApplications(userApps);
    }, (err) => {
      console.warn("[App] Applications listener error:", err);
    });

    return () => {
      unsubSaved();
      unsubSearches();
      unsubApps();
    };
  }, [currentUser?.id, currentUser?.role]);

  // AI helper functions
  const safeParseJsonResponse = async (res: Response) => {
    try {
      const text = await res.text();
      return JSON.parse(text);
    } catch {
      return { success: false, error: 'AI service is temporarily unavailable.' };
    }
  };

  const handleAnalyzePitchWithAI = async (targetRole: string, draftPitch: string) => {
    try {
      const res = await fetch('/api/ai/analyze-pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole,
          userPitch: draftPitch,
          userBackground: 'Remote candidate applying via RemotoOps'
        })
      });
      const json = await safeParseJsonResponse(res);
      if (res.ok && json.success) return json;
      return { success: false, error: json.error || 'AI service is temporarily unavailable.' };
    } catch {
      return { success: false, error: 'AI service is temporarily unavailable.' };
    }
  };

  const handleEnhanceJobWithAI = async (jobData: any) => {
    try {
      const res = await fetch('/api/ai/enhance-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData)
      });
      const json = await safeParseJsonResponse(res);
      if (res.ok && json.success) return json;
      return { success: false, error: json.error || 'AI service is temporarily unavailable.' };
    } catch {
      return { success: false, error: 'AI service is temporarily unavailable.' };
    }
  };

  // Job actions
  const handleAddJob = async (newJob: JobPost) => {
    setJobs(prev => [newJob, ...prev]);
    try {
      await setDoc(doc(db, 'job_posts', newJob.id), {
        ...newJob,
        postedBy: currentUser?.id || 'anonymous',
        createdAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.error("Firestore job creation error:", err);
    }
  };

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
            companyLogo: job.companyLogo || '',
            compensation: job.compensation,
            location: job.clientLocation || '100% Remote',
            jobStatus: job.jobStatus || 'OPEN',
            savedAt: new Date().toISOString()
          }, { merge: true });
        } catch (err) {
          console.error("Save job error:", err);
        }
      }
    }
  };

  const handleSaveSearch = async (searchName: string, queryText: string, filters: any) => {
    if (!currentUser?.id) {
      setIsAuthModalOpen(true);
      return;
    }

    const searchId = `search_${Date.now()}`;
    const newSearch: SavedSearch = {
      id: searchId,
      userId: currentUser.id,
      name: searchName,
      query: queryText,
      filters: filters || {},
      notificationFrequency: 'daily',
      createdAt: new Date().toISOString()
    };

    setSavedSearches(prev => [newSearch, ...prev]);

    try {
      await setDoc(doc(db, 'saved_searches', searchId), newSearch);
    } catch (err) {
      console.error("Save search error:", err);
    }
  };

  const handleDeleteSavedSearch = async (searchId: string) => {
    setSavedSearches(prev => prev.filter(s => s.id !== searchId));
    try {
      await deleteDoc(doc(db, 'saved_searches', searchId));
    } catch (err) {
      console.error("Delete saved search error:", err);
    }
  };

  const handleApplyToJob = async (job: JobPost, pitch: string, tools: string[], candidateDetails?: any) => {
    const isExternal = job.applicationMethod === 'external';
    const now = new Date().toISOString();
    const candidateId = currentUser ? currentUser.id : `guest_${Date.now()}`;

    const appId = `${candidateId}_${job.id}`;
    const newApp: Application = {
      id: appId,
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      candidateId: candidateId,
      candidateName: candidateDetails?.name || currentUser?.name || 'Applicant',
      candidateEmail: candidateDetails?.email || currentUser?.email || 'applicant@remotoops.dev',
      candidatePhone: candidateDetails?.phone || currentUser?.phoneNumber,
      candidateLocation: candidateDetails?.location || currentUser?.location,
      resumeUrl: candidateDetails?.resumeUrl || currentUser?.resumeUrl,
      portfolioUrl: candidateDetails?.portfolioUrl || currentUser?.portfolioUrl,
      linkedinUrl: candidateDetails?.linkedinUrl || currentUser?.linkedinUrl,
      coverPitch: pitch,
      toolExperience: tools,
      status: 'applied',
      appliedAt: 'Just now',
      applicationType: isExternal ? 'external_click' : 'direct',
      externalUrl: isExternal ? job.externalApplyUrl : undefined
    };

    setApplications(prev => [newApp, ...prev.filter(a => a.id !== appId)]);

    try {
      await setDoc(doc(db, 'applications', appId), {
        ...newApp,
        employerId: job.postedBy || 'employer',
        appliedAt: now,
        updatedAt: now
      }, { merge: true });

      // Auto-save resume URL to user profile if user is logged in
      if (currentUser?.id && candidateDetails?.resumeUrl) {
        await setDoc(doc(db, 'users', currentUser.id), {
          resumeUrl: candidateDetails.resumeUrl,
          resumeFileName: candidateDetails.resumeFileName || 'Resume Document',
          updatedAt: now
        }, { merge: true });
      }
    } catch (err) {
      console.error("Firestore application submission error:", err);
    }
  };

  const handleSendMessage = async (text: string, receiverId: string, receiverName: string, conversationId = 'conv-1') => {
    const senderId = currentUser ? currentUser.id : 'user-me';
    const senderName = currentUser ? currentUser.name : 'Applicant';
    const now = new Date().toISOString();
    const msgId = `msg-${Date.now()}`;

    const newMsg: DirectMessage = {
      id: msgId,
      conversationId,
      senderId,
      receiverId,
      senderName,
      senderAvatar: currentUser?.avatarUrl || '',
      text,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, newMsg]);

    if (currentUser?.id) {
      try {
        // Ensure conversation document
        await setDoc(doc(db, 'conversations', conversationId), {
          id: conversationId,
          participants: [currentUser.id, receiverId],
          lastMessage: text,
          lastMessageSenderName: senderName,
          lastMessageAt: now,
          updatedAt: now
        }, { merge: true });

        // Add to subcollection
        await setDoc(doc(db, 'conversations', conversationId, 'messages', msgId), {
          id: msgId,
          conversationId,
          senderId,
          receiverId,
          senderName,
          senderAvatar: currentUser?.avatarUrl || '',
          text,
          createdAt: now,
          read: false
        });
      } catch (err) {
        console.error("Firestore message send error:", err);
      }
    }
  };

  const handleUpdateApplicationStatus = async (appId: string, status: Application['status'], notes?: string) => {
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status, mentorNotes: notes || a.mentorNotes } : a));
    try {
      await setDoc(doc(db, 'applications', appId), {
        status,
        mentorNotes: notes,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.error("Error updating application status:", err);
    }
  };

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`min-h-screen flex font-sans transition-colors ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:block">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setIsMobileSidebarOpen(false);
          }}
          currentUser={currentUser}
          savedJobsCount={savedJobIds.length}
          savedSearchesCount={savedSearches.length}
          applicationCount={applications.length}
          unreadMessagesCount={messages.length > 1 ? 1 : 0}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onOpenAccountModal={() => setIsAccountModalOpen(true)}
          onOpenAuthModal={(mode) => {
            setAuthModalMode(mode || 'login');
            setIsAuthModalOpen(true);
          }}
          onLogout={handleLogout}
          onOpenAdminConsole={() => setIsAdminDashboardOpen(true)}
          onOpenCareersModal={() => setActiveTab('find_jobs')}
        />
      </div>

      {/* MOBILE DRAWER SIDEBAR */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" 
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative flex-1 max-w-xs w-full bg-white z-50 flex flex-col shadow-2xl">
            <div className="flex items-center justify-end p-2 border-b border-slate-100">
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-1.5 rounded-xl text-slate-500 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <Sidebar
                activeTab={activeTab}
                setActiveTab={(tab) => {
                  setActiveTab(tab);
                  setIsMobileSidebarOpen(false);
                }}
                currentUser={currentUser}
                savedJobsCount={savedJobIds.length}
                savedSearchesCount={savedSearches.length}
                applicationCount={applications.length}
                unreadMessagesCount={messages.length > 1 ? 1 : 0}
                theme={theme}
                onToggleTheme={handleToggleTheme}
                onOpenAccountModal={() => {
                  setIsAccountModalOpen(true);
                  setIsMobileSidebarOpen(false);
                }}
                onOpenAuthModal={(mode) => {
                  setAuthModalMode(mode || 'login');
                  setIsAuthModalOpen(true);
                  setIsMobileSidebarOpen(false);
                }}
                onLogout={handleLogout}
                onOpenAdminConsole={() => {
                  setIsAdminDashboardOpen(true);
                  setIsMobileSidebarOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* MAIN LAYOUT WRAPPER (Top Header + Tab View) */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
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
          onOpenAccountModal={() => setIsAccountModalOpen(true)}
          onOpenPricingModal={() => setIsEmployerPricingOpen(true)}
          onOpenAdminConsole={() => setIsAdminDashboardOpen(true)}
          savedJobsCount={savedJobIds.length}
          applicationCount={applications.length}
          unreadMessagesCount={messages.length > 1 ? 1 : 0}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        {/* Main Content View */}
        <main className="flex-1 pb-16">
          
          {/* FIND JOBS TAB */}
          {activeTab === 'find_jobs' && (
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
              onOpenReportModal={(id, title, company) => {
                setReportJobData({ id, title, company });
                setIsReportModalOpen(true);
              }}
              onOpenSafetyHub={() => setActiveTab('anti_scam')}
              onOpenAccountModal={() => setIsAccountModalOpen(true)}
              onOpenAtsResume={() => setActiveTab('ats_resume')}
              onOpenInterviewGuide={() => setActiveTab('interview_prep')}
              savedJobIds={savedJobIds}
              onToggleSaveJob={handleToggleSaveJob}
              onSaveSearch={handleSaveSearch}
              onExternalApply={(job) => {
                setExternalLinkTarget({
                  url: job.externalApplyUrl || '#',
                  jobTitle: job.title,
                  company: job.company
                });
              }}
            />
          )}

          {/* SAVED JOBS TAB (Fixed & Rock Solid) */}
          {activeTab === 'saved_jobs' && (
            <SavedJobsSection
              savedJobIds={savedJobIds}
              jobs={jobs}
              allJobs={jobs}
              onToggleSaveJob={handleToggleSaveJob}
              onUnsaveJob={(jobId) => {
                const match = jobs.find(j => j.id === jobId);
                if (match) handleToggleSaveJob(match);
                else handleToggleSaveJob({ id: jobId } as JobPost);
              }}
              onApplyJob={(job) => {
                setActiveTab('find_jobs');
              }}
              onExploreJobs={() => setActiveTab('find_jobs')}
              onFindJobs={() => setActiveTab('find_jobs')}
              currentUser={currentUser}
              onOpenAuthModal={(mode) => {
                setAuthModalMode(mode || 'login');
                setIsAuthModalOpen(true);
              }}
              isLoggedIn={!!currentUser}
            />
          )}

          {/* SAVED SEARCHES TAB */}
          {activeTab === 'saved_searches' && (
            <SavedSearchesSection
              savedSearches={savedSearches}
              onDeleteSearch={handleDeleteSavedSearch}
              onRunSearch={(queryText) => {
                setSearchQuery(queryText);
                setActiveTab('find_jobs');
              }}
              onOpenAuthModal={() => {
                setAuthModalMode('login');
                setIsAuthModalOpen(true);
              }}
              isLoggedIn={!!currentUser}
            />
          )}

          {/* MY APPLICATIONS TAB */}
          {activeTab === 'my_applications' && (
            <MyApplicationsSection
              applications={applications}
              onOpenAuthModal={() => {
                setAuthModalMode('login');
                setIsAuthModalOpen(true);
              }}
              isLoggedIn={!!currentUser}
              onFindJobs={() => setActiveTab('find_jobs')}
            />
          )}

          {/* MESSAGES TAB */}
          {activeTab === 'messages' && (
            <MessagesSection
              currentUser={currentUser}
              messages={messages}
              onSendMessage={handleSendMessage}
              onOpenAuthModal={() => {
                setAuthModalMode('login');
                setIsAuthModalOpen(true);
              }}
            />
          )}

          {/* EMPLOYERS TAB */}
          {activeTab === 'employers' && (
            <EmployerSection
              currentUser={currentUser}
              jobs={jobs}
              applications={applications}
              onOpenPostJob={() => setIsPostJobModalOpen(true)}
              onOpenEmployerPricing={() => setIsEmployerPricingOpen(true)}
              onOpenAccountModal={() => setIsAccountModalOpen(true)}
              onOpenAuthModal={() => {
                setAuthModalMode('login');
                setIsAuthModalOpen(true);
              }}
              onUpdateApplicationStatus={handleUpdateApplicationStatus}
            />
          )}

          {/* ATS RESUME BUILDER */}
          {activeTab === 'ats_resume' && (
            <ATSResumeSection />
          )}

          {/* INTERVIEW GUIDE */}
          {activeTab === 'interview_prep' && (
            <InterviewGuideSection />
          )}

          {/* ANTI-SCAM HUB */}
          {activeTab === 'anti_scam' && (
            <AntiScamHub
              onOpenReportModal={(id, title, company) => {
                setReportJobData({ id, title, company });
                setIsReportModalOpen(true);
              }}
            />
          )}

        </main>

        {/* Simplified Clean Footer */}
        <footer className="bg-white border-t border-slate-200 text-slate-500 py-6 text-xs mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <img 
                src={logoImg} 
                alt="RemotoOps" 
                referrerPolicy="no-referrer"
                className="w-6 h-6 rounded-lg border border-teal-500/30 object-cover" 
              />
              <p className="font-semibold text-slate-700">
                RemotoOps • Verified Remote Jobs & Direct Applications
              </p>
            </div>
            
            <div className="flex items-center gap-4 text-slate-500">
              <button onClick={() => setActiveTab('anti_scam')} className="hover:text-teal-700 font-medium">
                Anti-Scam Protection
              </button>
              <span>•</span>
              <button onClick={() => setActiveTab('ats_resume')} className="hover:text-teal-700 font-medium">
                ATS Resume Tool
              </button>
              <span>•</span>
              <button onClick={() => setActiveTab('interview_prep')} className="hover:text-teal-700 font-medium">
                Interview Prep
              </button>
            </div>
          </div>
        </footer>

      </div>

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
        onSubmitReport={(report) => {
          console.log("Scam report submitted:", report);
        }}
      />

      <PostJobModal
        isOpen={isPostJobModalOpen}
        onClose={() => setIsPostJobModalOpen(false)}
        onAddJob={handleAddJob}
        onEnhanceJobWithAI={handleEnhanceJobWithAI}
        currentUser={currentUser}
        onOpenAuthModal={(mode) => {
          setAuthModalMode(mode || 'login');
          setIsAuthModalOpen(true);
        }}
        onOpenPricingModal={() => setIsEmployerPricingOpen(true)}
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
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
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

    </div>
  );
}
