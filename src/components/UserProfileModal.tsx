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
import { auth, updateProfile, db, doc, setDoc, addDoc, collection, storage, ref, uploadBytes, getDownloadURL } from '../lib/firebase';
import { compressAndResizeImage } from '../lib/imageCompressor';
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

  // Media File Upload States
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleAvatarFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser?.id || isUploadingAvatar) return;

    // File validation
    if (!file.type.startsWith('image/')) {
      setUploadError("Please select a valid image file (JPG, PNG, or WebP).");
      if (e.target) e.target.value = '';
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setUploadError("Profile image must be smaller than 15MB.");
      if (e.target) e.target.value = '';
      return;
    }

    setUploadError(null);
    setIsUploadingAvatar(true);

    try {
      // 1. Fast browser-side image compression & resizing (max 800px)
      const { blob } = await compressAndResizeImage(file, 800, 0.82);

      // 2. Upload to Firebase Storage under authenticated user path
      const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '').slice(0, 30);
      const storageRef = ref(storage, `users/${currentUser.id}/profile/avatar_${Date.now()}_${cleanName}.jpg`);
      await uploadBytes(storageRef, blob, { contentType: 'image/jpeg' });

      // 3. Obtain permanent download URL
      const permanentUrl = await getDownloadURL(storageRef);
      
      // Update local state with permanent HTTPS URL only (never blob:)
      setAvatar(permanentUrl);

      // 4. Immediately persist permanent URL to Firestore user document
      const now = new Date().toISOString();
      await setDoc(doc(db, 'users', currentUser.id), {
        avatar: permanentUrl,
        updatedAt: now
      }, { merge: true });

      // 5. Update Firebase Auth user photo
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { photoURL: permanentUrl }).catch(() => {});
      }

      // 6. Update global profile state
      onUpdateProfile({
        ...currentUser,
        avatar: permanentUrl
      });
    } catch (err) {
      console.error("Avatar upload error:", err);
      setUploadError("Unable to upload profile photo. Please try again.");
    } finally {
      setIsUploadingAvatar(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleCoverFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser?.id || isUploadingCover) return;

    // File validation
    if (!file.type.startsWith('image/')) {
      setUploadError("Please select a valid image file (JPG, PNG, or WebP).");
      if (e.target) e.target.value = '';
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setUploadError("Cover banner must be smaller than 20MB.");
      if (e.target) e.target.value = '';
      return;
    }

    setUploadError(null);
    setIsUploadingCover(true);

    try {
      // 1. Fast browser-side image compression & resizing (max 1600px)
      const { blob } = await compressAndResizeImage(file, 1600, 0.82);

      // 2. Upload to Firebase Storage under authenticated user path
      const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '').slice(0, 30);
      const storageRef = ref(storage, `users/${currentUser.id}/profile/cover_${Date.now()}_${cleanName}.jpg`);
      await uploadBytes(storageRef, blob, { contentType: 'image/jpeg' });

      // 3. Obtain permanent download URL
      const permanentUrl = await getDownloadURL(storageRef);
      
      // Update local state with permanent HTTPS URL only
      setCoverImage(permanentUrl);

      // 4. Immediately persist permanent URL to Firestore user document
      const now = new Date().toISOString();
      await setDoc(doc(db, 'users', currentUser.id), {
        coverImage: permanentUrl,
        updatedAt: now
      }, { merge: true });

      // 5. Update global profile state
      onUpdateProfile({
        ...currentUser,
        coverImage: permanentUrl
      });
    } catch (err) {
      console.error("Cover upload error:", err);
      setUploadError("Unable to upload cover banner. Please try again.");
    } finally {
      setIsUploadingCover(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleSelectPresetCover = async (imgUrl: string) => {
    setCoverImage(imgUrl);
    if (!currentUser?.id) return;
    try {
      const now = new Date().toISOString();
      await setDoc(doc(db, 'users', currentUser.id), {
        coverImage: imgUrl,
        updatedAt: now
      }, { merge: true });
      onUpdateProfile({
        ...currentUser,
        coverImage: imgUrl
      });
    } catch (err) {
      console.warn("Preset cover update notice:", err);
    }
  };

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
    const safeAvatar = avatar && !avatar.startsWith('blob:') ? avatar : (currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');
    const safeCoverImage = coverImage && !coverImage.startsWith('blob:') ? coverImage : (currentUser.coverImage || DEFAULT_COVER_IMAGES[0]);

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
      avatar: safeAvatar,
      coverImage: safeCoverImage,
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
        avatar: safeAvatar,
        coverImage: safeCoverImage,
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
    const safeAvatar = avatar && !avatar.startsWith('blob:') ? avatar : (currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');
    const safeCoverImage = coverImage && !coverImage.startsWith('blob:') ? coverImage : (currentUser.coverImage || DEFAULT_COVER_IMAGES[0]);

    const updatedUser: UserAccount = {
      ...currentUser,
      name,
      headline,
      professionalTitle,
      phoneNumber,
      companyName: currentUser.role === 'client' ? companyName : undefined,
      location,
      avatar: safeAvatar,
      coverImage: safeCoverImage,
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
        avatar: safeAvatar,
        coverImage: safeCoverImage,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-3xl w-full text-slate-900 overflow-hidden my-8">
        
        {/* Header Bar */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                My Profile Setup & Settings
                {currentUser.isKycVerified && (
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Verified KYC
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-500">Manage your avatar, background header, experience & education</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200/60">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSaveProfile} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* YOUR REMOTOOPS STATUS & WORKFLOW PROGRESS */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div className="space-y-1">
                <h4 className="text-xs font-black text-teal-800 uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  YOUR REMOTOOPS STATUS
                </h4>
                
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-lg border flex items-center gap-1 ${
                    currentUser.emailVerified
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {currentUser.emailVerified ? '✓ Email Verified' : '📧 Email Unverified'}
                  </span>

                  <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-lg border flex items-center gap-1 ${
                    isProfileComplete
                      ? 'bg-teal-50 text-teal-800 border-teal-200'
                      : 'bg-slate-100 text-slate-700 border-slate-300'
                  }`}>
                    {isProfileComplete ? '✓ Basic Profile Verified' : '👤 Basic Profile Incomplete'}
                  </span>

                  <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-lg border flex items-center gap-1 ${
                    currentUser.emailVerified && isProfileComplete
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-slate-100 text-slate-700 border-slate-300'
                  }`}>
                    {currentUser.emailVerified && isProfileComplete ? '✓ Profile Complete' : '☐ Profile Incomplete'}
                  </span>

                  {currentUser.isKycVerified && (
                    <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-lg border bg-purple-50 text-purple-800 border-purple-200 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" /> 🛡 Identity Verified
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-700 pt-1 font-medium">
                  {currentUser.emailVerified && isProfileComplete
                    ? '✓ You can now apply for jobs on RemotoOps.'
                    : 'Complete your basic profile to apply for jobs.'}
                </p>

                {isNoExperienceBeginner && !isEmployer && (
                  <div className="pt-1">
                    <span className="text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200 px-3 py-1 rounded-xl inline-flex items-center gap-1.5">
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
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-600/20 transition-all flex items-center gap-1.5 shrink-0"
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
                  <div className="p-2 rounded-xl border bg-teal-50 border-teal-200 text-teal-800">
                    <div className="font-bold">1. REGISTERED</div>
                    <div className="text-[9px] text-teal-700">Account Active</div>
                  </div>

                  <div className={`p-2 rounded-xl border ${
                    currentUser.emailVerified ? 'bg-teal-50 border-teal-200 text-teal-800' : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}>
                    <div className="font-bold">2. EMAIL VERIFIED</div>
                    <div className="text-[9px]">{currentUser.emailVerified ? '✓ Verified' : 'Pending Link'}</div>
                  </div>

                  <div className={`p-2 rounded-xl border ${
                    isProfileComplete ? 'bg-teal-50 border-teal-200 text-teal-800' : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}>
                    <div className="font-bold">3. BASIC PROFILE</div>
                    <div className="text-[9px]">{isProfileComplete ? '✓ Verified' : 'Incomplete'}</div>
                  </div>

                  <div className={`p-2 rounded-xl border ${
                    currentUser.emailVerified && isProfileComplete ? 'bg-teal-50 border-teal-200 text-teal-800' : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}>
                    <div className="font-bold">4. COMPLETE</div>
                    <div className="text-[9px]">{currentUser.emailVerified && isProfileComplete ? '✓ Unlocked' : 'Pending'}</div>
                  </div>

                  <div className={`p-2 rounded-xl border ${
                    currentUser.emailVerified && isProfileComplete ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-extrabold' : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}>
                    <div className="font-bold">5. APPLY NOW</div>
                    <div className="text-[9px]">{currentUser.emailVerified && isProfileComplete ? '✓ Ready' : 'Locked'}</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-2 rounded-xl border bg-indigo-50 border-indigo-200 text-indigo-800">
                    <div className="font-bold">1. EMPLOYER ACCOUNT</div>
                    <div className="text-[9px] text-indigo-700">Created</div>
                  </div>

                  <div className={`p-2 rounded-xl border ${
                    currentUser.emailVerified ? 'bg-indigo-50 border-indigo-200 text-indigo-800' : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}>
                    <div className="font-bold">2. EMAIL VERIFIED</div>
                    <div className="text-[9px]">{currentUser.emailVerified ? '✓ Verified' : 'Pending'}</div>
                  </div>

                  <div className={`p-2 rounded-xl border ${
                    isProfileComplete ? 'bg-indigo-50 border-indigo-200 text-indigo-800' : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}>
                    <div className="font-bold">3. BUSINESS PROFILE</div>
                    <div className="text-[9px]">{isProfileComplete ? '✓ Complete' : 'Incomplete'}</div>
                  </div>

                  <div className={`p-2 rounded-xl border ${
                    currentUser.isEmployerVerified ? 'bg-indigo-50 border-indigo-200 text-indigo-800' : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}>
                    <div className="font-bold">4. VERIFICATION</div>
                    <div className="text-[9px]">{currentUser.isEmployerVerified ? '✓ Verified' : 'In Progress'}</div>
                  </div>

                  <div className={`p-2 rounded-xl border ${
                    currentUser.emailVerified && isProfileComplete && currentUser.isEmployerVerified ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-extrabold' : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}>
                    <div className="font-bold">5. POST JOBS</div>
                    <div className="text-[9px]">{currentUser.emailVerified && isProfileComplete && currentUser.isEmployerVerified ? '✓ Unlocked' : 'Locked'}</div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Requirements Checklist Box */}
            {!isProfileComplete && (
              <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-xl space-y-2">
                <h5 className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  Complete your basic profile to apply for jobs:
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-700 pt-1">
                  <div className="flex items-center gap-1.5">
                    {name?.trim() ? <span className="text-emerald-600 font-bold">✓</span> : <span className="text-slate-400">☐</span>} Full Name
                  </div>
                  <div className="flex items-center gap-1.5">
                    {professionalTitle?.trim() ? <span className="text-emerald-600 font-bold">✓</span> : <span className="text-slate-400">☐</span>} Professional Title
                  </div>
                  <div className="flex items-center gap-1.5">
                    {location?.trim() ? <span className="text-emerald-600 font-bold">✓</span> : <span className="text-slate-400">☐</span>} Location / Timezone
                  </div>
                  <div className="flex items-center gap-1.5">
                    {phoneNumber?.trim() ? <span className="text-emerald-600 font-bold">✓</span> : <span className="text-slate-400">☐</span>} Phone Number
                  </div>
                  <div className="flex items-center gap-1.5">
                    {about?.trim() ? <span className="text-emerald-600 font-bold">✓</span> : <span className="text-slate-400">☐</span>} About Me
                  </div>
                  <div className="flex items-center gap-1.5">
                    {skills && skills.length >= 1 ? <span className="text-emerald-600 font-bold">✓</span> : <span className="text-slate-400">☐</span>} Core Skills (At least 1)
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* COVER BANNER & AVATAR PICKER */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
            {/* Cover Image */}
            <div className="relative h-44 w-full bg-slate-200 overflow-hidden group">
              <img src={coverImage} alt="Cover Banner" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <label className="bg-white/95 hover:bg-white text-slate-900 text-xs font-bold px-3.5 py-2 rounded-xl shadow-lg cursor-pointer flex items-center gap-1.5 transition-all">
                  <Camera className="w-4 h-4 text-teal-600" />
                  {isUploadingCover ? 'Uploading Cover...' : 'Upload Cover Image'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverFileUpload}
                    disabled={isUploadingCover}
                    className="hidden"
                  />
                </label>
              </div>
              
              {/* Preset Cover Selector Overlay */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-xl border border-slate-200 shadow-md">
                <span className="text-[10px] text-slate-700 font-bold px-1.5 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-teal-600" /> Presets:
                </span>
                {DEFAULT_COVER_IMAGES.map((img, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => handleSelectPresetCover(img)}
                    className={`w-7 h-7 rounded-lg overflow-hidden border-2 transition-all ${
                      coverImage === img ? 'border-teal-600 scale-110 shadow-sm' : 'border-slate-300 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Profile Picture Overlay */}
            <div className="px-6 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 relative z-10">
              <div className="flex items-end gap-4">
                <div className="relative group">
                  <img
                    src={avatar}
                    alt={name}
                    className="w-24 h-24 rounded-2xl object-cover border-4 border-white bg-slate-100 shadow-xl"
                  />
                  <label className="absolute inset-0 bg-slate-950/75 rounded-2xl opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center cursor-pointer text-white text-[10px] font-bold p-1 text-center">
                    <Camera className="w-5 h-5 text-teal-300 mb-0.5" />
                    {isUploadingAvatar ? 'Uploading...' : 'Upload Photo'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarFileUpload}
                      disabled={isUploadingAvatar}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="pb-1 space-y-1">
                  <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    {name || 'Your Name'}
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider ${
                      currentUser.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800 border border-purple-200'
                        : isEmployer
                        ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                        : 'bg-teal-100 text-teal-800 border border-teal-200'
                    }`}>
                      {currentUser.role}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-600 font-mono font-medium">{currentUser.email}</p>
                  
                  {/* VERIFICATION BADGES ROW */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {currentUser.emailVerified ? (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                        ✓ Email Verified
                      </span>
                    ) : (
                      <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full font-bold">
                        Email Unverified
                      </span>
                    )}

                    {currentUser.isProfileVerified && (
                      <span className="text-[10px] bg-teal-100 text-teal-800 border border-teal-300 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-teal-600" /> Basic Profile Verified
                      </span>
                    )}

                    {currentUser.isEmployerVerified && (
                      <span
                        title="Employer verification indicates that this business has completed RemotoOps' employer verification process."
                        className="text-[10px] bg-indigo-100 text-indigo-800 border border-indigo-300 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 cursor-help"
                      >
                        <Building2 className="w-3 h-3 text-indigo-600" /> ✓ Employer Verified
                      </span>
                    )}

                    {currentUser.isKycVerified && (
                      <span className="text-[10px] bg-purple-100 text-purple-800 border border-purple-300 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-purple-600" /> 🛡 Identity Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {!currentUser.isKycVerified && onOpenKycModal && (
                <div className="space-y-1">
                  <h6 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Enhanced Verification (Optional)</h6>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenKycModal();
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto transition-all shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" /> 🛡 Identity Verification (Optional)
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* BASIC INFORMATION FIELDS */}
          <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-teal-600" /> General Profile Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">Full Name / Display Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-medium"
                  placeholder="Your full name"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">Location / Timezone *</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-medium"
                    placeholder="e.g. Manila, Philippines (GMT+8)"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">Headline / Professional Title *</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => {
                    setHeadline(e.target.value);
                    setProfessionalTitle(e.target.value);
                  }}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-medium"
                  placeholder="e.g. Executive Assistant & Virtual Operations Lead"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">Phone Number *</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-medium"
                  placeholder="+63 912 345 6789"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Resume URL / Link</span>
                  <span className="text-[11px] text-slate-500 font-semibold bg-slate-200/70 border border-slate-300 px-2 py-0.5 rounded-md">(Optional)</span>
                </label>
                <input
                  type="url"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-medium"
                  placeholder="https://drive.google.com/your-resume.pdf"
                />
                <p className="text-[11px] text-slate-600 mt-1 font-normal leading-relaxed">
                  Direct link to your Google Drive, Dropbox, or online CV document.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Portfolio URL / Drive Link</span>
                  <span className="text-[11px] text-slate-500 font-semibold bg-slate-200/70 border border-slate-300 px-2 py-0.5 rounded-md">(Optional)</span>
                </label>
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-medium"
                  placeholder="https://behance.net/portfolio or Drive folder"
                />
                <p className="text-[11px] text-slate-600 mt-1 font-normal leading-relaxed">
                  Direct link to Behance, GitHub, Google Drive folder, or Notion showcase.
                </p>
              </div>

              {!isEmployer && (
                <div className="sm:col-span-2 bg-teal-50/90 border border-teal-200 p-4 rounded-xl flex items-start gap-3 shadow-sm">
                  <input
                    type="checkbox"
                    id="noExpCheck"
                    checked={isNoExperienceBeginner}
                    onChange={(e) => setIsNoExperienceBeginner(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-teal-600 focus:ring-teal-500 bg-white border-slate-300"
                  />
                  <label htmlFor="noExpCheck" className="text-xs cursor-pointer">
                    <span className="font-bold text-teal-950 text-xs block mb-0.5">Entry-Level Jobseeker (No prior work experience)</span>
                    <span className="text-xs text-slate-700 font-normal leading-relaxed block">
                      New to the remote workforce? That's okay! Check this box to highlight that you are looking for entry-level positions, internships, or guided mentorship opportunities.
                    </span>
                  </label>
                </div>
              )}

              {isEmployer && (
                <>
                  <div className="sm:col-span-2 bg-indigo-50/90 border border-indigo-200 p-4 rounded-xl space-y-3 shadow-sm">
                    <h5 className="text-xs font-bold text-indigo-950 flex items-center gap-1.5 uppercase tracking-wider">
                      <Building2 className="w-4 h-4 text-indigo-600" /> Employer / Business Verification Details
                    </h5>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Provide basic details about your business or hiring operation to earn the "Employer Verified" badge.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 mb-1 block">Company / Business Name *</label>
                        <input
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                          placeholder="e.g. Acme Remote Services"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 mb-1 block">Contact Person Name *</label>
                        <input
                          type="text"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                          placeholder="e.g. Sarah Jenkins"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 mb-1 block">Business Location / Timezone *</label>
                        <input
                          type="text"
                          value={businessLocation}
                          onChange={(e) => setBusinessLocation(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                          placeholder="e.g. San Francisco, CA (PST)"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 mb-1 block">Business Phone / Contact *</label>
                        <input
                          type="tel"
                          value={companyPhone}
                          onChange={(e) => setCompanyPhone(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                          placeholder="+1 415 555 0199"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Avatar Picture Image URL</span>
                  <span className="text-[11px] text-slate-500 font-semibold bg-slate-200/70 border border-slate-300 px-2 py-0.5 rounded-md">(Hosted URL)</span>
                </label>
                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-[11px]"
                />
                <p className="text-[11px] text-slate-600 mt-1 font-normal leading-relaxed">
                  Permanent HTTPS download URL saved in Firebase Storage or external host.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Cover Header Image URL</span>
                  <span className="text-[11px] text-slate-500 font-semibold bg-slate-200/70 border border-slate-300 px-2 py-0.5 rounded-md">(Hosted URL)</span>
                </label>
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-[11px]"
                />
                <p className="text-[11px] text-slate-600 mt-1 font-normal leading-relaxed">
                  Permanent banner image URL or select from preset banners above.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Website / Portfolio URL</span>
                  <span className="text-[11px] text-slate-500 font-semibold bg-slate-200/70 border border-slate-300 px-2 py-0.5 rounded-md">(Optional)</span>
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                    placeholder="https://mywebsite.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>LinkedIn Profile URL</span>
                  <span className="text-[11px] text-slate-500 font-semibold bg-slate-200/70 border border-slate-300 px-2 py-0.5 rounded-md">(Optional)</span>
                </label>
                <div className="relative">
                  <Linkedin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* ABOUT / BIO SECTION */}
          <div className="space-y-3 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-teal-600" /> About Me & Summary
            </h4>
            <textarea
              rows={4}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl p-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-medium leading-relaxed"
              placeholder="Describe your career background, professional strengths, or hiring goals..."
            />
          </div>

          {/* WORK EXPERIENCE SECTION */}
          <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-teal-600" /> Work Experience & Career History
                  <span className="text-[11px] text-slate-500 font-semibold bg-slate-200/70 border border-slate-300 px-2 py-0.5 rounded-md">(Optional)</span>
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  Beginner jobseekers and first-time applicants with 0 prior experience can skip this section completely.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingExp(true)}
                className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold rounded-xl flex items-center gap-1.5 shrink-0 self-start sm:self-auto transition-all shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" /> Add Experience
              </button>
            </div>

            {/* Inline Add Experience Form */}
            {isAddingExp && (
              <div className="p-4 bg-white border border-slate-300 rounded-xl space-y-3 shadow-sm">
                <h5 className="text-xs font-bold text-slate-900">New Experience Record</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Job Title / Role (e.g. Administrative Assistant)"
                    value={expTitle}
                    onChange={(e) => setExpTitle(e.target.value)}
                    className="bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <input
                    type="text"
                    placeholder="Company / Organization Name"
                    value={expCompany}
                    onChange={(e) => setExpCompany(e.target.value)}
                    className="bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <input
                    type="text"
                    placeholder="Period (e.g. 2022 - 2024)"
                    value={expPeriod}
                    onChange={(e) => setExpPeriod(e.target.value)}
                    className="bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 sm:col-span-2"
                  />
                  <textarea
                    rows={2}
                    placeholder="Key responsibilities and achievements..."
                    value={expDesc}
                    onChange={(e) => setExpDesc(e.target.value)}
                    className="bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 sm:col-span-2"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingExp(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddExperience}
                    className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-lg shadow-sm"
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
                  <div key={exp.id} className="p-3.5 bg-white border border-slate-200 rounded-xl flex items-start justify-between gap-3 shadow-sm">
                    <div>
                      <h5 className="font-bold text-xs text-slate-900">{exp.title}</h5>
                      <p className="text-[11px] text-teal-700 font-semibold">{exp.company} • <span className="text-slate-500 font-normal">{exp.period}</span></p>
                      <p className="text-xs text-slate-700 mt-1 leading-relaxed">{exp.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveExperience(exp.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                      title="Remove experience"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* EDUCATION SECTION */}
          <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-teal-600" /> Education & Qualifications
                  <span className="text-[11px] text-slate-500 font-semibold bg-slate-200/70 border border-slate-300 px-2 py-0.5 rounded-md">(Optional)</span>
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingEdu(true)}
                className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold rounded-xl flex items-center gap-1.5 shrink-0 self-start sm:self-auto transition-all shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" /> Add Education
              </button>
            </div>

            {isAddingEdu && (
              <div className="p-4 bg-white border border-slate-300 rounded-xl space-y-3 shadow-sm">
                <h5 className="text-xs font-bold text-slate-900">New Education Record</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Degree / Course / Certificate (e.g. BS Information Technology)"
                    value={eduDegree}
                    onChange={(e) => setEduDegree(e.target.value)}
                    className="bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <input
                    type="text"
                    placeholder="Institution / School / University"
                    value={eduInstitution}
                    onChange={(e) => setEduInstitution(e.target.value)}
                    className="bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <input
                    type="text"
                    placeholder="Graduation Year (e.g. 2023)"
                    value={eduYear}
                    onChange={(e) => setEduYear(e.target.value)}
                    className="bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 sm:col-span-2"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingEdu(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddEducation}
                    className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-lg shadow-sm"
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
                  <div key={edu.id} className="p-3.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 shadow-sm">
                    <div>
                      <h5 className="font-bold text-xs text-slate-900">{edu.degree}</h5>
                      <p className="text-[11px] text-teal-700 font-semibold">{edu.institution} • <span className="text-slate-500 font-normal">{edu.year}</span></p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveEducation(edu.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                      title="Remove education"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SKILLS & TOOLS BADGES */}
          <div className="space-y-3 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" /> Core Skills & Tools
            </h4>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type skill name (e.g. Asana, Customer Support, React, Excel)..."
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
              >
                Add Tag
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-teal-50 text-teal-800 border border-teal-200 text-xs px-3 py-1 rounded-full flex items-center gap-1.5 font-medium shadow-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-teal-600 hover:text-rose-600 font-bold"
                    title="Remove skill"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* ERROR ALERT */}
          {uploadError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              {uploadError}
            </div>
          )}

          {/* SUCCESS ALERT */}
          {saveSuccess && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              Profile updated and saved successfully!
            </div>
          )}

          {/* BOTTOM ACTIONS */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 border border-slate-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-teal-600/20 transition-all"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving Profile...' : 'Save Profile Changes'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
