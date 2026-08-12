import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Camera, 
  MapPin, 
  Globe, 
  Linkedin, 
  Briefcase, 
  GraduationCap, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Sparkles, 
  Building2, 
  ShieldCheck, 
  Save, 
  FileText,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import { db, doc, setDoc, addDoc, collection } from '../lib/firebase';
import { UserAccount, UserExperience, UserEducation } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onUpdateProfile: (updatedUser: UserAccount) => void;
  onOpenKycModal?: () => void;
}

const DEFAULT_COVER_IMAGES = [
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&auto=format&fit=crop&q=80'
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateProfile,
  onOpenKycModal
}) => {
  const [name, setName] = useState('');
  const [headline, setHeadline] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [location, setLocation] = useState('');
  const [avatar, setAvatar] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [about, setAbout] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState('');
  
  const [experiences, setExperiences] = useState<UserExperience[]>([]);
  const [education, setEducation] = useState<UserEducation[]>([]);

  // Form states for adding experience
  const [isAddingExp, setIsAddingExp] = useState(false);
  const [expTitle, setExpTitle] = useState('');
  const [expCompany, setExpCompany] = useState('');
  const [expPeriod, setExpPeriod] = useState('');
  const [expDesc, setExpDesc] = useState('');

  // Form states for adding education
  const [isAddingEdu, setIsAddingEdu] = useState(false);
  const [eduDegree, setEduDegree] = useState('');
  const [eduInstitution, setEduInstitution] = useState('');
  const [eduYear, setEduYear] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [professionalTitle, setProfessionalTitle] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<'incomplete' | 'pending' | 'verified' | 'rejected' | 'changes_required'>('incomplete');
  const [verificationNotes, setVerificationNotes] = useState('');
  const [isNoExperienceBeginner, setIsNoExperienceBeginner] = useState(false);

  // Employer state
  const [contactName, setContactName] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [businessLocation, setBusinessLocation] = useState('');

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setHeadline(currentUser.headline || '');
      setProfessionalTitle(currentUser.professionalTitle || currentUser.headline || '');
      setPhoneNumber(currentUser.phoneNumber || '');
      setCompanyName(currentUser.companyName || '');
      setLocation(currentUser.location || 'Worldwide Remote');
      setAvatar(currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');
      setCoverImage(currentUser.coverImage || DEFAULT_COVER_IMAGES[0]);
      setAbout(currentUser.about || currentUser.bio || '');
      setWebsiteUrl(currentUser.websiteUrl || '');
      setLinkedinUrl(currentUser.linkedinUrl || '');
      setPortfolioUrl(currentUser.portfolioUrl || '');
      setResumeUrl(currentUser.resumeUrl || '');
      setSkills(currentUser.skills || ['Remote Collaboration', 'Communication', 'Virtual Operations']);
      setExperiences(currentUser.experiences || []);
      setEducation(currentUser.education || []);
      setVerificationStatus(currentUser.verificationStatus || 'incomplete');
      setVerificationNotes(currentUser.verificationNotes || '');
      setIsNoExperienceBeginner(Boolean(currentUser.isNoExperienceBeginner));
      setContactName(currentUser.contactName || currentUser.name || '');
      setCompanyPhone(currentUser.companyPhone || currentUser.phoneNumber || '');
      setBusinessLocation(currentUser.businessLocation || currentUser.location || '');
    }
  }, [currentUser, isOpen]);

  if (!isOpen || !currentUser) return null;

  const handleAddSkill = () => {
    if (newSkillInput.trim() && !skills.includes(newSkillInput.trim())) {
      setSkills([...skills, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleAddExperience = () => {
    if (!expTitle || !expCompany) return;
    const newExp: UserExperience = {
      id: `exp-${Date.now()}`,
      title: expTitle,
      company: expCompany,
      period: expPeriod || '2023 - Present',
      description: expDesc || 'Managed operations, client communication, and team tasks.'
    };
    setExperiences([newExp, ...experiences]);
    setExpTitle('');
    setExpCompany('');
    setExpPeriod('');
    setExpDesc('');
    setIsAddingExp(false);
  };

  const handleRemoveExperience = (id: string) => {
    setExperiences(experiences.filter(e => e.id !== id));
  };

  const handleAddEducation = () => {
    if (!eduDegree || !eduInstitution) return;
    const newEdu: UserEducation = {
      id: `edu-${Date.now()}`,
      degree: eduDegree,
      institution: eduInstitution,
      year: eduYear || '2022'
    };
    setEducation([newEdu, ...education]);
    setEduDegree('');
    setEduInstitution('');
    setEduYear('');
    setIsAddingEdu(false);
  };

  const handleRemoveEducation = (id: string) => {
    setEducation(education.filter(e => e.id !== id));
  };

  // Beginner-Friendly Verification Check
  // Jobseeker require ONLY basic info: name, professionalTitle, location, phoneNumber, skills >= 1, about
  // Work experience, resume, portfolio, education, LinkedIn are strictly OPTIONAL!
  // Employer require: companyName, contactName/name, businessLocation/location, phoneNumber/companyPhone, about
  const isEmployer = currentUser.role === 'client' || currentUser.role === 'employer';

  const isProfileComplete = isEmployer
    ? Boolean(companyName?.trim() && (contactName || name)?.trim() && (businessLocation || location)?.trim() && (companyPhone || phoneNumber)?.trim() && about?.trim())
    : Boolean(name?.trim() && professionalTitle?.trim() && location?.trim() && phoneNumber?.trim() && about?.trim() && skills && skills.length >= 1);

  const handleSubmitForVerification = async () => {
    if (!isProfileComplete) return;

    setIsSaving(true);
    const now = new Date().toISOString();
    const updatedUser: UserAccount = {
      ...currentUser,
      name,
      headline: headline || professionalTitle,
      professionalTitle,
      phoneNumber,
      companyName: isEmployer ? companyName : undefined,
      contactName: isEmployer ? (contactName || name) : undefined,
      companyPhone: isEmployer ? (companyPhone || phoneNumber) : undefined,
      businessLocation: isEmployer ? (businessLocation || location) : undefined,
      location,
      avatar,
      coverImage,
      bio: about,
      about,
      websiteUrl,
      linkedinUrl,
      portfolioUrl,
      resumeUrl,
      skills,
      experiences,
      education,
      isNoExperienceBeginner,
      isProfileVerified: true,
      isEmployerVerified: isEmployer ? true : currentUser.isEmployerVerified,
      verificationStatus: 'verified',
      updatedAt: now
    };

    try {
      await setDoc(doc(db, 'users', currentUser.id), {
        uid: currentUser.id,
        displayName: name,
        email: currentUser.email,
        role: currentUser.role,
        headline: headline || professionalTitle,
        professionalTitle,
        phoneNumber,
        companyName: companyName || '',
        contactName: contactName || name,
        companyPhone: companyPhone || phoneNumber,
        businessLocation: businessLocation || location,
        location,
        avatar,
        coverImage,
        about,
        websiteUrl,
        linkedinUrl,
        portfolioUrl,
        resumeUrl,
        skills,
        experiences,
        education,
        isNoExperienceBeginner,
        isProfileVerified: true,
        isEmployerVerified: isEmployer ? true : Boolean(currentUser.isEmployerVerified),
        verificationStatus: 'verified',
        updatedAt: now
      }, { merge: true });

      await addDoc(collection(db, 'verification_requests'), {
        userId: currentUser.id,
        userEmail: currentUser.email,
        userName: name,
        role: currentUser.role,
        requestedAt: now,
        status: 'approved',
        notes: isEmployer ? 'Employer business profile completed and verified.' : 'Jobseeker basic profile completed. Verified without experience requirement.',
        isNoExperience: isNoExperienceBeginner
      });

      await addDoc(collection(db, 'activity_logs'), {
        userId: currentUser.id,
        userEmail: currentUser.email,
        action: 'Profile Verification Completed',
        details: `${name} (${currentUser.role}) completed basic profile and unlocked full access.`,
        timestamp: now
      });

      setVerificationStatus('verified');
      onUpdateProfile(updatedUser);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Verification submit error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    const now = new Date().toISOString();
    const updatedUser: UserAccount = {
      ...currentUser,
      name,
      headline,
      professionalTitle,
      phoneNumber,
      companyName: currentUser.role === 'client' ? companyName : undefined,
      location,
      avatar,
      coverImage,
      bio: about,
      about,
      websiteUrl,
      linkedinUrl,
      portfolioUrl,
      resumeUrl,
      skills,
      experiences,
      education,
      updatedAt: now
    };

    try {
      // 1. Sync directly with Firestore users collection
      await setDoc(doc(db, 'users', currentUser.id), {
        uid: currentUser.id,
        displayName: name,
        email: currentUser.email,
        role: currentUser.role,
        headline,
        professionalTitle,
        phoneNumber,
        companyName: companyName || '',
        location,
        avatar,
        coverImage,
        about,
        websiteUrl,
        linkedinUrl,
        portfolioUrl,
        resumeUrl,
        skills,
        experiences,
        education,
        updatedAt: now
      }, { merge: true });

      // 2. Add audit entry in activity logs
      await addDoc(collection(db, 'activity_logs'), {
        userId: currentUser.id,
        userEmail: currentUser.email,
        action: 'Profile Updated',
        details: `Updated avatar, banner, experience (${experiences.length}), education (${education.length})`,
        timestamp: now
      });

      onUpdateProfile(updatedUser);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving user profile to Firestore:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-3xl w-full text-white overflow-hidden my-8">
        
        {/* Header Bar */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                My Profile Setup & Settings
                {currentUser.isKycVerified && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Verified KYC
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-400">Manage your avatar, background header, experience & education</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSaveProfile} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* YOUR REMOTOOPS STATUS & WORKFLOW PROGRESS */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <h4 className="text-xs font-black text-teal-400 uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  YOUR REMOTOOPS STATUS
                </h4>
                
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-lg border flex items-center gap-1 ${
                    currentUser.emailVerified
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}>
                    {currentUser.emailVerified ? '✓ Email Verified' : '📧 Email Unverified'}
                  </span>

                  <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-lg border flex items-center gap-1 ${
                    isProfileComplete
                      ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {isProfileComplete ? '✓ Basic Profile Verified' : '👤 Basic Profile Incomplete'}
                  </span>

                  <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-lg border flex items-center gap-1 ${
                    currentUser.emailVerified && isProfileComplete
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {currentUser.emailVerified && isProfileComplete ? '✓ Profile Complete' : '☐ Profile Incomplete'}
                  </span>

                  {currentUser.isKycVerified && (
                    <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-lg border bg-purple-500/20 text-purple-300 border-purple-500/40 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" /> 🛡 Identity Verified
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 pt-1 font-medium">
                  {currentUser.emailVerified && isProfileComplete
                    ? '✓ You can now apply for jobs on RemotoOps.'
                    : 'Complete your basic profile to apply for jobs.'}
                </p>

                {isNoExperienceBeginner && !isEmployer && (
                  <div className="pt-1">
                    <span className="text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40 px-3 py-1 rounded-xl inline-flex items-center gap-1.5">
                      🌟 Entry-Level Jobseeker — No prior work experience
                    </span>
                  </div>
                )}
              </div>

              {!currentUser.isProfileVerified && isProfileComplete && (
                <button
                  type="button"
                  onClick={handleSubmitForVerification}
                  disabled={isSaving}
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Confirm Basic Profile Complete
                </button>
              )}
            </div>

            {/* Stepper Steps (Beginner Friendly) */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[10px]">
              {!isEmployer ? (
                <>
                  <div className="p-2 rounded-xl border bg-teal-500/10 border-teal-500/30 text-teal-300">
                    <div className="font-bold">1. REGISTERED</div>
                    <div className="text-[9px] opacity-80">Account Active</div>
                  </div>

                  <div className={`p-2 rounded-xl border ${
                    currentUser.emailVerified ? 'bg-teal-500/10 border-teal-500/30 text-teal-300' : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}>
                    <div className="font-bold">2. EMAIL VERIFIED</div>
                    <div className="text-[9px] opacity-80">{currentUser.emailVerified ? '✓ Verified' : 'Pending Link'}</div>
                  </div>

                  <div className={`p-2 rounded-xl border ${
                    isProfileComplete ? 'bg-teal-500/10 border-teal-500/30 text-teal-300' : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}>
                    <div className="font-bold">3. BASIC PROFILE</div>
                    <div className="text-[9px] opacity-80">{isProfileComplete ? '✓ Verified' : 'Incomplete'}</div>
                  </div>

                  <div className={`p-2 rounded-xl border ${
                    currentUser.emailVerified && isProfileComplete ? 'bg-teal-500/10 border-teal-500/30 text-teal-300' : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}>
                    <div className="font-bold">4. COMPLETE</div>
                    <div className="text-[9px] opacity-80">{currentUser.emailVerified && isProfileComplete ? '✓ Unlocked' : 'Pending'}</div>
                  </div>

                  <div className={`p-2 rounded-xl border ${
                    currentUser.emailVerified && isProfileComplete ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-extrabold' : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}>
                    <div className="font-bold">5. APPLY NOW</div>
                    <div className="text-[9px] opacity-80">{currentUser.emailVerified && isProfileComplete ? '✓ Ready' : 'Locked'}</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-2 rounded-xl border bg-indigo-500/10 border-indigo-500/30 text-indigo-300">
                    <div className="font-bold">1. EMPLOYER ACCOUNT</div>
                    <div className="text-[9px] opacity-80">Created</div>
                  </div>

                  <div className={`p-2 rounded-xl border ${
                    currentUser.emailVerified ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300' : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}>
                    <div className="font-bold">2. EMAIL VERIFIED</div>
                    <div className="text-[9px] opacity-80">{currentUser.emailVerified ? '✓ Verified' : 'Pending'}</div>
                  </div>

                  <div className={`p-2 rounded-xl border ${
                    isProfileComplete ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300' : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}>
                    <div className="font-bold">3. BUSINESS PROFILE</div>
                    <div className="text-[9px] opacity-80">{isProfileComplete ? '✓ Complete' : 'Incomplete'}</div>
                  </div>

                  <div className={`p-2 rounded-xl border ${
                    currentUser.isEmployerVerified ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300' : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}>
                    <div className="font-bold">4. VERIFICATION</div>
                    <div className="text-[9px] opacity-80">{currentUser.isEmployerVerified ? '✓ Verified' : 'In Progress'}</div>
                  </div>

                  <div className={`p-2 rounded-xl border ${
                    currentUser.emailVerified && isProfileComplete && currentUser.isEmployerVerified ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}>
                    <div className="font-bold">5. POST JOBS</div>
                    <div className="text-[9px] opacity-80">{currentUser.emailVerified && isProfileComplete && currentUser.isEmployerVerified ? '✓ Unlocked' : 'Locked'}</div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Requirements Checklist Box */}
            {!isProfileComplete && (
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
                <h5 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  Complete your basic profile to apply for jobs:
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-300 pt-1">
                  <div className="flex items-center gap-1.5">
                    {name?.trim() ? <span className="text-emerald-400 font-bold">✓</span> : <span className="text-slate-500">☐</span>} Full Name
                  </div>
                  <div className="flex items-center gap-1.5">
                    {professionalTitle?.trim() ? <span className="text-emerald-400 font-bold">✓</span> : <span className="text-slate-500">☐</span>} Professional Title
                  </div>
                  <div className="flex items-center gap-1.5">
                    {location?.trim() ? <span className="text-emerald-400 font-bold">✓</span> : <span className="text-slate-500">☐</span>} Location / Timezone
                  </div>
                  <div className="flex items-center gap-1.5">
                    {phoneNumber?.trim() ? <span className="text-emerald-400 font-bold">✓</span> : <span className="text-slate-500">☐</span>} Phone Number
                  </div>
                  <div className="flex items-center gap-1.5">
                    {about?.trim() ? <span className="text-emerald-400 font-bold">✓</span> : <span className="text-slate-500">☐</span>} About Me
                  </div>
                  <div className="flex items-center gap-1.5">
                    {skills && skills.length >= 1 ? <span className="text-emerald-400 font-bold">✓</span> : <span className="text-slate-500">☐</span>} Core Skills (At least 1)
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* COVER BANNER & AVATAR PICKER */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
            {/* Cover Image */}
            <div className="relative h-44 w-full bg-slate-800 overflow-hidden">
              <img src={coverImage} alt="Cover Banner" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>
              
              {/* Preset Cover Selector Overlay */}
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-slate-950/80 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/80">
                <span className="text-[10px] text-slate-300 font-bold px-1.5 flex items-center gap-1">
                  <ImageIcon className="w-3 h-3 text-teal-400" /> Cover:
                </span>
                {DEFAULT_COVER_IMAGES.map((img, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setCoverImage(img)}
                    className={`w-6 h-6 rounded-lg overflow-hidden border-2 transition-all ${
                      coverImage === img ? 'border-teal-400 scale-110' : 'border-slate-700 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Profile Picture Overlay */}
            <div className="px-6 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 relative z-10">
              <div className="flex items-end gap-4">
                <div className="relative group">
                  <img
                    src={avatar}
                    alt={name}
                    className="w-24 h-24 rounded-2xl object-cover border-4 border-slate-900 bg-slate-800 shadow-xl"
                  />
                  <div className="absolute inset-0 bg-slate-950/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer">
                    <Camera className="w-6 h-6 text-teal-400" />
                  </div>
                </div>

                <div className="pb-1">
                  <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                    {name || 'Your Name'}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                      currentUser.role === 'admin' 
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : isEmployer
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                    }`}>
                      {currentUser.role}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">{currentUser.email}</p>
                  
                  {/* VERIFICATION BADGES ROW */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    {currentUser.emailVerified ? (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                        ✓ Email Verified
                      </span>
                    ) : (
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                        Email Unverified
                      </span>
                    )}

                    {currentUser.isProfileVerified && (
                      <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-teal-400" /> Basic Profile Verified
                      </span>
                    )}

                    {currentUser.isEmployerVerified && (
                      <span
                        title="Employer verification indicates that this business has completed RemotoOps' employer verification process."
                        className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 cursor-help"
                      >
                        <Building2 className="w-3 h-3 text-indigo-400" /> ✓ Employer Verified
                      </span>
                    )}

                    {currentUser.isKycVerified && (
                      <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-purple-400" /> 🛡 Identity Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {!currentUser.isKycVerified && onOpenKycModal && (
                <div className="space-y-1">
                  <h6 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Enhanced Verification (Optional)</h6>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenKycModal();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" /> 🛡 Identity Verification (Optional)
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* BASIC INFORMATION FIELDS */}
          <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-teal-400" /> General Profile Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">Full Name / Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">Location / Timezone</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                    placeholder="e.g. Manila, Philippines (SGT/PHT)"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-300 mb-1 block">Headline / Professional Title *</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => {
                    setHeadline(e.target.value);
                    setProfessionalTitle(e.target.value);
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                  placeholder="e.g. Executive Assistant & Virtual Administrative Lead"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">Phone Number *</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                  placeholder="+63 912 345 6789"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block flex items-center justify-between">
                  <span>Resume URL / Link</span>
                  <span className="text-[10px] text-teal-400 font-semibold">(Optional)</span>
                </label>
                <input
                  type="url"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                  placeholder="https://drive.google.com/your-resume.pdf (Optional)"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block flex items-center justify-between">
                  <span>Portfolio URL / Drive Link</span>
                  <span className="text-[10px] text-teal-400 font-semibold">(Optional)</span>
                </label>
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                  placeholder="https://behance.net/portfolio or Drive link (Optional)"
                />
              </div>

              {!isEmployer && (
                <div className="sm:col-span-2 bg-teal-500/10 border border-teal-500/30 p-3 rounded-xl flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="noExpCheck"
                    checked={isNoExperienceBeginner}
                    onChange={(e) => setIsNoExperienceBeginner(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-teal-500 focus:ring-teal-500 bg-slate-900 border-slate-700"
                  />
                  <label htmlFor="noExpCheck" className="text-xs cursor-pointer">
                    <span className="font-bold text-teal-300 block">Entry-Level Jobseeker (No prior work experience)</span>
                    <span className="text-[11px] text-slate-300">
                      New to the remote workforce? That's okay! Check this box to highlight that you are looking for entry-level positions, internships, or guided mentorship opportunities.
                    </span>
                  </label>
                </div>
              )}

              {isEmployer && (
                <>
                  <div className="sm:col-span-2 bg-indigo-500/10 border border-indigo-500/30 p-4 rounded-xl space-y-3">
                    <h5 className="text-xs font-bold text-indigo-300 flex items-center gap-1.5 uppercase tracking-wider">
                      <Building2 className="w-4 h-4 text-indigo-400" /> Employer / Business Verification Details
                    </h5>
                    <p className="text-[11px] text-slate-300">
                      Provide basic details about your business or hiring operation to earn the "Employer Verified" badge.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-300 mb-1 block">Company / Business Name *</label>
                        <input
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                          placeholder="e.g. Acme Remote Services"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-300 mb-1 block">Contact Person Name *</label>
                        <input
                          type="text"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                          placeholder="e.g. Sarah Jenkins"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-300 mb-1 block">Business Location / Timezone *</label>
                        <input
                          type="text"
                          value={businessLocation}
                          onChange={(e) => setBusinessLocation(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                          placeholder="e.g. San Francisco, CA (PST)"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-300 mb-1 block">Business Phone / Contact *</label>
                        <input
                          type="tel"
                          value={companyPhone}
                          onChange={(e) => setCompanyPhone(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                          placeholder="+1 415 555 0199"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">Avatar Picture Image URL</label>
                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">Cover Header Image URL</label>
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">Website / Portfolio URL</label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                    placeholder="https://mycompany.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">LinkedIn Profile URL</label>
                <div className="relative">
                  <Linkedin className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* ABOUT / BIO SECTION */}
          <div className="space-y-2 bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-teal-400" /> About Me & Summary
            </h4>
            <textarea
              rows={4}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-teal-500"
              placeholder="Describe your career goals, background, business details or strengths..."
            />
          </div>

          {/* WORK EXPERIENCE SECTION */}
          <div className="space-y-3 bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-teal-400" /> Work Experience & Career History
                  <span className="text-[10px] text-teal-400 font-semibold lowercase bg-teal-500/10 border border-teal-500/30 px-2 py-0.5 rounded-full">(optional)</span>
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Beginner jobseekers and first-time employers with 0 background experience can skip this section completely!
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingExp(true)}
                className="px-2.5 py-1 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30 text-xs font-bold rounded-lg flex items-center gap-1 shrink-0 self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" /> Add Experience
              </button>
            </div>

            {/* Inline Add Experience Form */}
            {isAddingExp && (
              <div className="p-4 bg-slate-900 border border-teal-500/40 rounded-xl space-y-3">
                <h5 className="text-xs font-bold text-teal-300">New Experience Record</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Job Title / Role"
                    value={expTitle}
                    onChange={(e) => setExpTitle(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Company / Organization"
                    value={expCompany}
                    onChange={(e) => setExpCompany(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Period (e.g. 2021 - 2023)"
                    value={expPeriod}
                    onChange={(e) => setExpPeriod(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white sm:col-span-2"
                  />
                  <textarea
                    rows={2}
                    placeholder="Key responsibilities and achievements..."
                    value={expDesc}
                    onChange={(e) => setExpDesc(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white sm:col-span-2"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingExp(false)}
                    className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddExperience}
                    className="px-3 py-1 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-lg"
                  >
                    Save Experience
                  </button>
                </div>
              </div>
            )}

            {experiences.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No work experience entries added yet.</p>
            ) : (
              <div className="space-y-2">
                {experiences.map((exp) => (
                  <div key={exp.id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-start justify-between gap-3">
                    <div>
                      <h5 className="font-bold text-xs text-white">{exp.title}</h5>
                      <p className="text-[11px] text-teal-400 font-medium">{exp.company} • <span className="text-slate-400">{exp.period}</span></p>
                      <p className="text-[11px] text-slate-300 mt-1">{exp.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveExperience(exp.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* EDUCATION SECTION */}
          <div className="space-y-3 bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-teal-400" /> Education & Qualifications
                  <span className="text-[10px] text-teal-400 font-semibold lowercase bg-teal-500/10 border border-teal-500/30 px-2 py-0.5 rounded-full">(optional)</span>
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingEdu(true)}
                className="px-2.5 py-1 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30 text-xs font-bold rounded-lg flex items-center gap-1 shrink-0 self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" /> Add Education
              </button>
            </div>

            {isAddingEdu && (
              <div className="p-4 bg-slate-900 border border-teal-500/40 rounded-xl space-y-3">
                <h5 className="text-xs font-bold text-teal-300">New Education Record</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Degree / Course / Certificate"
                    value={eduDegree}
                    onChange={(e) => setEduDegree(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Institution / University"
                    value={eduInstitution}
                    onChange={(e) => setEduInstitution(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Graduation Year (e.g. 2022)"
                    value={eduYear}
                    onChange={(e) => setEduYear(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white sm:col-span-2"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingEdu(false)}
                    className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddEducation}
                    className="px-3 py-1 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-lg"
                  >
                    Save Education
                  </button>
                </div>
              </div>
            )}

            {education.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No education records added yet.</p>
            ) : (
              <div className="space-y-2">
                {education.map((edu) => (
                  <div key={edu.id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between gap-3">
                    <div>
                      <h5 className="font-bold text-xs text-white">{edu.degree}</h5>
                      <p className="text-[11px] text-teal-400 font-medium">{edu.institution} • <span className="text-slate-400">{edu.year}</span></p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveEducation(edu.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SKILLS & TOOLS BADGES */}
          <div className="space-y-3 bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" /> Core Skills & Tools
            </h4>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type skill name (e.g. Asana, Customer Support, React)..."
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl"
              >
                Add Tag
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-slate-900 text-teal-300 border border-slate-700 text-xs px-3 py-1 rounded-full flex items-center gap-1.5"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-rose-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* SUCCESS ALERT */}
          {saveSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Profile updated and saved to Firebase Firestore successfully!
            </div>
          )}

          {/* BOTTOM ACTIONS */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-teal-500/20"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving to Firestore...' : 'Save Profile Changes'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
