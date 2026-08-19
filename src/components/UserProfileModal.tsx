import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
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
  Loader2,
  CheckCircle2,
  Phone,
  Mail,
  Upload,
  ExternalLink,
  FileCheck,
  Camera,
  Image as ImageIcon
} from 'lucide-react';
import { auth, updateProfile, db, doc, setDoc } from '../lib/firebase';
import { uploadResumeFile, ResumeUploadResult } from '../lib/resumeUploader';
import { uploadUserImage } from '../lib/imageUploader';
import { UserAccount, UserExperience, UserEducation } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onUpdateProfile: (updatedUser: UserAccount) => void;
  onOpenKycModal?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateProfile,
  onOpenKycModal
}) => {
  const [name, setName] = useState('');
  const [headline, setHeadline] = useState('');
  const [professionalTitle, setProfessionalTitle] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');
  const [about, setAbout] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [avatar, setAvatar] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarUploadProgress, setAvatarUploadProgress] = useState(0);
  const [avatarUploadError, setAvatarUploadError] = useState<string | null>(null);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [coverUploadProgress, setCoverUploadProgress] = useState(0);
  const [coverUploadError, setCoverUploadError] = useState<string | null>(null);

  const [resumeUrl, setResumeUrl] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');
  const [resumeStoragePath, setResumeStoragePath] = useState('');
  const [resumeUploadedAt, setResumeUploadedAt] = useState('');
  const [resumeUploadProgress, setResumeUploadProgress] = useState(0);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState('');
  
  const [experiences, setExperiences] = useState<UserExperience[]>([]);
  const [education, setEducation] = useState<UserEducation[]>([]);

  // Employer specific fields
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [businessLocation, setBusinessLocation] = useState('');
  const [contactName, setContactName] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');

  // Experience addition form state
  const [isAddingExp, setIsAddingExp] = useState(false);
  const [expTitle, setExpTitle] = useState('');
  const [expCompany, setExpCompany] = useState('');
  const [expPeriod, setExpPeriod] = useState('');
  const [expDesc, setExpDesc] = useState('');

  // Education addition form state
  const [isAddingEdu, setIsAddingEdu] = useState(false);
  const [eduDegree, setEduDegree] = useState('');
  const [eduInstitution, setEduInstitution] = useState('');
  const [eduYear, setEduYear] = useState('');

  // Resume upload state
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [resumeUploadError, setResumeUploadError] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || currentUser.displayName || '');
      setHeadline(currentUser.headline || currentUser.professionalTitle || '');
      setProfessionalTitle(currentUser.professionalTitle || currentUser.headline || '');
      setPhoneNumber(currentUser.phoneNumber || '');
      setLocation(currentUser.location || '');
      setAbout(currentUser.about || currentUser.bio || '');
      setWebsiteUrl(currentUser.websiteUrl || '');
      setLinkedinUrl(currentUser.linkedinUrl || '');
      setPortfolioUrl(currentUser.portfolioUrl || '');
      setResumeUrl(currentUser.resumeUrl || '');
      setResumeFileName(currentUser.resumeFileName || '');
      setResumeStoragePath(currentUser.resumeStoragePath || '');
      setResumeUploadedAt(currentUser.resumeUploadedAt || '');
      setSkills(currentUser.skills || []);
      setExperiences(currentUser.experiences || []);
      setEducation(currentUser.education || []);
      setAvatar(currentUser.avatar || '');
      setCoverImage(currentUser.coverImage || '');

      // Employer
      setCompanyName(currentUser.companyName || '');
      setCompanyWebsite(currentUser.companyWebsite || '');
      setCompanyDescription(currentUser.companyDescription || '');
      setBusinessLocation(currentUser.businessLocation || '');
      setContactName(currentUser.contactName || '');
      setCompanyPhone(currentUser.companyPhone || '');
    }
  }, [currentUser, isOpen]);

  if (!isOpen || !currentUser) return null;

  const isEmployer = currentUser.role === 'client' || currentUser.role === 'employer';

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser?.id) return;

    setAvatarUploadError(null);
    setIsUploadingAvatar(true);
    setAvatarUploadProgress(0);

    try {
      const result = await uploadUserImage(currentUser.id, file, 'avatar', (prog) => {
        setAvatarUploadProgress(prog);
      });

      const now = new Date().toISOString();
      setAvatar(result.url);

      console.log("[UserProfileModal] Avatar upload succeeded, saving to Firestore:", {
        userId: currentUser.id,
        avatarUrl: result.url
      });

      // Direct Firestore sync
      await setDoc(doc(db, 'users', currentUser.id), {
        avatar: result.url,
        avatarUrl: result.url,
        photoURL: result.url,
        updatedAt: now
      }, { merge: true });

      // Update Firebase Auth profile
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { photoURL: result.url }).catch(() => {});
      }

      onUpdateProfile({
        ...currentUser,
        avatar: result.url,
        photoURL: result.url,
        updatedAt: now
      });
    } catch (err: any) {
      console.error("[UserProfileModal] Avatar upload failed:", err);
      setAvatarUploadError(err?.message || "Failed to upload profile picture.");
    } finally {
      setIsUploadingAvatar(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser?.id) return;

    setCoverUploadError(null);
    setIsUploadingCover(true);
    setCoverUploadProgress(0);

    try {
      const result = await uploadUserImage(currentUser.id, file, 'cover', (prog) => {
        setCoverUploadProgress(prog);
      });

      const now = new Date().toISOString();
      setCoverImage(result.url);

      console.log("[UserProfileModal] Cover upload succeeded, saving to Firestore:", {
        userId: currentUser.id,
        coverUrl: result.url
      });

      // Direct Firestore sync
      await setDoc(doc(db, 'users', currentUser.id), {
        coverImage: result.url,
        coverUrl: result.url,
        updatedAt: now
      }, { merge: true });

      onUpdateProfile({
        ...currentUser,
        coverImage: result.url,
        coverUrl: result.url,
        updatedAt: now
      });
    } catch (err: any) {
      console.error("[UserProfileModal] Cover image upload failed:", err);
      setCoverUploadError(err?.message || "Failed to upload cover banner.");
    } finally {
      setIsUploadingCover(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleRemoveAvatar = async () => {
    if (!currentUser?.id) return;
    setAvatar('');
    const now = new Date().toISOString();
    try {
      await setDoc(doc(db, 'users', currentUser.id), {
        avatar: '',
        photoURL: '',
        updatedAt: now
      }, { merge: true });
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { photoURL: '' }).catch(() => {});
      }
      onUpdateProfile({
        ...currentUser,
        avatar: '',
        updatedAt: now
      });
    } catch (err) {
      console.error("Failed to remove avatar:", err);
    }
  };

  const handleRemoveCover = async () => {
    if (!currentUser?.id) return;
    setCoverImage('');
    const now = new Date().toISOString();
    try {
      await setDoc(doc(db, 'users', currentUser.id), {
        coverImage: '',
        coverUrl: '',
        updatedAt: now
      }, { merge: true });
      onUpdateProfile({
        ...currentUser,
        coverImage: '',
        updatedAt: now
      });
    } catch (err) {
      console.error("Failed to remove cover:", err);
    }
  };

  const handleAddSkill = () => {
    const trimmed = newSkillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleAddExperience = () => {
    if (!expTitle.trim() || !expCompany.trim()) return;
    const newExp: UserExperience = {
      id: `exp-${Date.now()}`,
      title: expTitle.trim(),
      company: expCompany.trim(),
      period: expPeriod.trim() || 'Present',
      description: expDesc.trim()
    };
    setExperiences([...experiences, newExp]);
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
    if (!eduDegree.trim() || !eduInstitution.trim()) return;
    const newEdu: UserEducation = {
      id: `edu-${Date.now()}`,
      degree: eduDegree.trim(),
      institution: eduInstitution.trim(),
      year: eduYear.trim() || 'Completed'
    };
    setEducation([...education, newEdu]);
    setEduDegree('');
    setEduInstitution('');
    setEduYear('');
    setIsAddingEdu(false);
  };

  const handleRemoveEducation = (id: string) => {
    setEducation(education.filter(e => e.id !== id));
  };

  const handleResumeFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser?.id) return;

    setResumeUploadError(null);
    setIsUploadingResume(true);
    setResumeUploadProgress(0);

    let uploadResult: ResumeUploadResult | null = null;

    try {
      uploadResult = await uploadResumeFile(currentUser.id, file, (progress) => {
        setResumeUploadProgress(progress);
      });
    } catch (storageErr: any) {
      console.error("Firebase Storage resume upload error:", storageErr);
      setResumeUploadError(`Storage Upload Failed: ${storageErr?.message || storageErr}`);
      setIsUploadingResume(false);
      if (e.target) e.target.value = '';
      return;
    }

    // Storage succeeded -> Now persist to Firestore user profile
    const now = new Date().toISOString();
    setResumeUrl(uploadResult.url);
    setResumeFileName(uploadResult.fileName);
    setResumeStoragePath(uploadResult.storagePath);
    setResumeUploadedAt(now);

    try {
      await setDoc(doc(db, 'users', currentUser.id), {
        resumeUrl: uploadResult.url,
        resumeFileName: uploadResult.fileName,
        resumeStoragePath: uploadResult.storagePath,
        resumeUploadedAt: now,
        updatedAt: now
      }, { merge: true });

      onUpdateProfile({
        ...currentUser,
        resumeUrl: uploadResult.url,
        resumeFileName: uploadResult.fileName,
        resumeStoragePath: uploadResult.storagePath,
        resumeUploadedAt: now
      });
    } catch (firestoreErr: any) {
      console.error("Firestore user profile save error after storage upload:", firestoreErr);
      setResumeUploadError(`Resume uploaded to Storage, but saving to user profile in Firestore failed: ${firestoreErr?.message || firestoreErr}`);
    } finally {
      setIsUploadingResume(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.id) return;

    setIsSaving(true);
    setErrorMessage(null);
    const now = new Date().toISOString();

    const updatedUser: UserAccount = {
      ...currentUser,
      name,
      displayName: name,
      avatar: avatar || currentUser.avatar || '',
      coverImage: coverImage || currentUser.coverImage || '',
      headline: professionalTitle || headline,
      professionalTitle: professionalTitle || headline,
      phoneNumber,
      location,
      bio: about,
      about,
      websiteUrl,
      linkedinUrl,
      portfolioUrl,
      resumeUrl,
      resumeFileName,
      resumeStoragePath,
      resumeUploadedAt,
      skills,
      experiences,
      education,
      // Employer fields
      companyName: isEmployer ? companyName : currentUser.companyName,
      companyWebsite: isEmployer ? companyWebsite : currentUser.companyWebsite,
      companyDescription: isEmployer ? companyDescription : currentUser.companyDescription,
      businessLocation: isEmployer ? businessLocation : currentUser.businessLocation,
      contactName: isEmployer ? contactName : currentUser.contactName,
      companyPhone: isEmployer ? companyPhone : currentUser.companyPhone,
      updatedAt: now
    };

    try {
      await setDoc(doc(db, 'users', currentUser.id), {
        uid: currentUser.id,
        displayName: name,
        name,
        email: currentUser.email,
        role: currentUser.role,
        avatar: avatar || currentUser.avatar || '',
        photoURL: avatar || currentUser.avatar || '',
        coverImage: coverImage || currentUser.coverImage || '',
        coverUrl: coverImage || currentUser.coverImage || '',
        headline: professionalTitle || headline,
        professionalTitle: professionalTitle || headline,
        phoneNumber,
        location,
        about,
        bio: about,
        websiteUrl,
        linkedinUrl,
        portfolioUrl,
        resumeUrl,
        resumeFileName,
        resumeStoragePath,
        resumeUploadedAt,
        skills,
        experiences,
        education,
        companyName: isEmployer ? companyName : (currentUser.companyName || ''),
        companyWebsite: isEmployer ? companyWebsite : (currentUser.companyWebsite || ''),
        companyDescription: isEmployer ? companyDescription : (currentUser.companyDescription || ''),
        businessLocation: isEmployer ? businessLocation : (currentUser.businessLocation || ''),
        contactName: isEmployer ? contactName : (currentUser.contactName || ''),
        companyPhone: isEmployer ? companyPhone : (currentUser.companyPhone || ''),
        updatedAt: now
      }, { merge: true });

      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: name,
          photoURL: avatar || currentUser.avatar || ''
        }).catch(() => {});
      }

      onUpdateProfile(updatedUser);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error("Error updating account:", err);
      setErrorMessage("Unable to save account settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-3xl w-full text-slate-900 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header Bar */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                Account & Application Settings
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                  currentUser.role === 'admin' 
                    ? 'bg-purple-100 text-purple-800' 
                    : isEmployer 
                    ? 'bg-indigo-100 text-indigo-800' 
                    : 'bg-teal-100 text-teal-800'
                }`}>
                  {isEmployer ? 'Employer' : 'Job Seeker'}
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Manage contact info, photos, resume, and skills automatically pre-filled when applying to jobs
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSaveProfile} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Notifications */}
          {saveSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-2xl flex items-center gap-2.5 text-xs font-bold shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Account information saved successfully. Your job applications will now use these details.</span>
            </div>
          )}

          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-900 px-4 py-3 rounded-2xl flex items-center gap-2.5 text-xs font-bold shadow-sm">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* PROFILE MEDIA: COVER BANNER & AVATAR */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 shadow-xs">
            {/* Cover Banner Area */}
            <div className="relative h-28 sm:h-36 bg-slate-900 w-full overflow-hidden">
              {coverImage ? (
                <img 
                  src={coverImage} 
                  alt="Profile Cover" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 flex items-center justify-center text-slate-400 text-xs">
                  <div className="flex items-center gap-1.5 opacity-75 font-medium">
                    <ImageIcon className="w-4 h-4 text-teal-400" />
                    <span>No cover image uploaded</span>
                  </div>
                </div>
              )}

              {/* Cover Upload Button Overlay */}
              <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
                {coverImage && (
                  <button
                    type="button"
                    onClick={handleRemoveCover}
                    className="bg-black/60 hover:bg-black/80 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg backdrop-blur-sm transition-all"
                  >
                    Remove Cover
                  </button>
                )}
                <label className="cursor-pointer bg-black/60 hover:bg-black/80 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg backdrop-blur-sm flex items-center gap-1.5 transition-all">
                  {isUploadingCover ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-400" />
                      <span>{coverUploadProgress}%</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-3.5 h-3.5" />
                      <span>{coverImage ? 'Change Cover' : 'Upload Cover'}</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    disabled={isUploadingCover}
                    onChange={handleCoverUpload}
                  />
                </label>
              </div>

              {coverUploadError && (
                <div className="absolute bottom-2 left-2 right-2 bg-rose-900/90 text-white text-[11px] px-2.5 py-1 rounded-md z-10">
                  {coverUploadError}
                </div>
              )}
            </div>

            {/* Avatar & Identity Row */}
            <div className="px-5 pb-4 pt-0 flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-9 sm:-mt-11">
              <div className="flex items-end gap-3.5">
                {/* Avatar with upload badge */}
                <div className="relative group shrink-0">
                  {avatar ? (
                    <img 
                      src={avatar} 
                      alt={name || 'Avatar'} 
                      referrerPolicy="no-referrer"
                      className="w-18 h-18 sm:w-22 sm:h-22 rounded-2xl object-cover border-4 border-white shadow-md bg-white" 
                    />
                  ) : (
                    <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-2xl bg-teal-600 text-white font-black text-2xl sm:text-3xl flex items-center justify-center border-4 border-white shadow-md">
                      {name ? name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}

                  <label className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity">
                    <Camera className="w-4 h-4 mb-0.5" />
                    <span className="text-[9px] font-bold">Change</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                      disabled={isUploadingAvatar}
                      onChange={handleAvatarUpload}
                    />
                  </label>
                </div>

                <div className="pb-1">
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs transition-all">
                      {isUploadingAvatar ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" />
                          <span>Uploading {avatarUploadProgress}%...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5 text-teal-600" />
                          <span>{avatar ? 'Update Photo' : 'Upload Photo'}</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        disabled={isUploadingAvatar}
                        onChange={handleAvatarUpload}
                      />
                    </label>

                    {avatar && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  {avatarUploadError && (
                    <p className="text-[11px] text-rose-600 mt-1 font-medium">{avatarUploadError}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* BASIC CONTACT & APPLICANT INFORMATION */}
          <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-teal-600" /> Personal & Contact Details
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                  placeholder="e.g. Alex Rivers"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">Email Address (Read-only)</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={currentUser.email}
                    disabled
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-600 font-mono font-medium cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">Phone Number *</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                    placeholder="e.g. +1 555-0199 or +63 912 345 6789"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">Location / Timezone *</label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                    placeholder="e.g. Manila, Philippines (UTC+8) or Remote Worldwide"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">Professional Title / Target Role</label>
                <input
                  type="text"
                  value={professionalTitle}
                  onChange={(e) => setProfessionalTitle(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                  placeholder="e.g. Virtual Assistant | Customer Care Specialist | Social Media Lead"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">Brief Professional Summary / Pitch</label>
                <textarea
                  rows={3}
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Briefly describe your strengths, experience, and remote work readiness..."
                />
              </div>
            </div>
          </div>

          {/* RESUME / CV SECTION */}
          <div className="space-y-4 bg-teal-50/50 p-5 rounded-2xl border border-teal-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-extrabold text-teal-950 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-teal-600" /> Resume / CV Management
                </h4>
                <p className="text-[11px] text-teal-800">
                  Upload a PDF/DOCX or link your online resume. This will be automatically attached when you click Apply on jobs.
                </p>
              </div>
            </div>

            {/* Current Resume Display */}
            {resumeUrl ? (
              <div className="bg-white p-4 rounded-xl border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                    <FileCheck className="w-5 h-5 text-teal-700" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      {resumeFileName || 'Saved Resume Document'}
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded-full font-semibold">
                        Ready for Applications
                      </span>
                    </p>
                    <p className="text-[11px] text-slate-500 truncate max-w-xs sm:max-w-md">{resumeUrl}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> View
                  </a>

                  <label className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors flex items-center gap-1">
                    {isUploadingResume ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    <span>Replace</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleResumeFileUpload}
                      disabled={isUploadingResume}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-xl border-2 border-dashed border-teal-300 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 mx-auto flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Upload your Resume / CV</p>
                  <p className="text-[11px] text-slate-500">Supports PDF, DOC, DOCX up to 15MB</p>
                </div>

                <label className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer shadow transition-all">
                  {isUploadingResume ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  <span>{isUploadingResume ? `Uploading to Secure Storage (${resumeUploadProgress}%)...` : 'Select Resume File'}</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleResumeFileUpload}
                    disabled={isUploadingResume}
                    className="hidden"
                  />
                </label>

                {isUploadingResume && (
                  <div className="max-w-xs mx-auto w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-2">
                    <div
                      className="bg-teal-600 h-full transition-all duration-200"
                      style={{ width: `${resumeUploadProgress}%` }}
                    />
                  </div>
                )}
              </div>
            )}

            {isUploadingResume && resumeUrl && (
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-teal-600 h-full transition-all duration-200"
                  style={{ width: `${resumeUploadProgress}%` }}
                />
              </div>
            )}

            {resumeUploadError && (
              <p className="text-xs text-rose-600 font-semibold">{resumeUploadError}</p>
            )}

            {/* Direct URL input option */}
            <div className="pt-1">
              <label className="text-xs font-bold text-slate-700 mb-1 block">Or provide direct Resume URL (Google Drive, Dropbox, Notion):</label>
              <input
                type="url"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/.../view"
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              />
            </div>
          </div>

          {/* PORTFOLIO & PROFESSIONAL LINKS */}
          <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-teal-600" /> Links & Portfolios (Optional)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">Portfolio / Showcase URL</label>
                <div className="relative">
                  <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="url"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="https://behance.net/... or Drive link"
                    className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">LinkedIn Profile URL</label>
                <div className="relative">
                  <Linkedin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/yourname"
                    className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SKILLS SECTION */}
          <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600" /> Skills & Tools
              </h4>
              <span className="text-[11px] text-slate-500 font-medium">{skills.length} skills listed</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="Type a skill (e.g. Google Workspace, Slack, Canva, Notion) and press Add"
                className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
              >
                Add Skill
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-white border border-slate-300 text-slate-800 text-xs font-semibold px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
              {skills.length === 0 && (
                <p className="text-xs text-slate-400 italic">No skills added yet. Add relevant tools to help match with opportunities.</p>
              )}
            </div>
          </div>

          {/* WORK EXPERIENCE SECTION */}
          <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-teal-600" /> Work Experience (Optional)
              </h4>
              {!isAddingExp && (
                <button
                  type="button"
                  onClick={() => setIsAddingExp(true)}
                  className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Experience
                </button>
              )}
            </div>

            {isAddingExp && (
              <div className="bg-white p-4 rounded-xl border border-teal-300 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Job Title *</label>
                    <input
                      type="text"
                      value={expTitle}
                      onChange={(e) => setExpTitle(e.target.value)}
                      placeholder="e.g. Administrative Assistant"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Company / Client *</label>
                    <input
                      type="text"
                      value={expCompany}
                      onChange={(e) => setExpCompany(e.target.value)}
                      placeholder="e.g. Freelance / Tech Corp"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Time Period</label>
                    <input
                      type="text"
                      value={expPeriod}
                      onChange={(e) => setExpPeriod(e.target.value)}
                      placeholder="e.g. 2023 - 2024"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Key Responsibilities</label>
                    <input
                      type="text"
                      value={expDesc}
                      onChange={(e) => setExpDesc(e.target.value)}
                      placeholder="e.g. Handled inbox management and customer requests"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingExp(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddExperience}
                    className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg"
                  >
                    Save Experience
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {experiences.map((exp) => (
                <div key={exp.id} className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-start justify-between">
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">{exp.title}</h5>
                    <p className="text-[11px] text-slate-600">{exp.company} • {exp.period}</p>
                    {exp.description && <p className="text-[11px] text-slate-500 mt-1">{exp.description}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveExperience(exp.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* EDUCATION SECTION */}
          <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-teal-600" /> Education & Training (Optional)
              </h4>
              {!isAddingEdu && (
                <button
                  type="button"
                  onClick={() => setIsAddingEdu(true)}
                  className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Education
                </button>
              )}
            </div>

            {isAddingEdu && (
              <div className="bg-white p-4 rounded-xl border border-teal-300 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Degree / Course *</label>
                    <input
                      type="text"
                      value={eduDegree}
                      onChange={(e) => setEduDegree(e.target.value)}
                      placeholder="e.g. BS Information Tech"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">School / Institution *</label>
                    <input
                      type="text"
                      value={eduInstitution}
                      onChange={(e) => setEduInstitution(e.target.value)}
                      placeholder="e.g. University / Online Academy"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Year</label>
                    <input
                      type="text"
                      value={eduYear}
                      onChange={(e) => setEduYear(e.target.value)}
                      placeholder="e.g. 2024"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingEdu(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddEducation}
                    className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg"
                  >
                    Save Education
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id} className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-start justify-between">
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">{edu.degree}</h5>
                    <p className="text-[11px] text-slate-600">{edu.institution} • {edu.year}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveEducation(edu.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* EMPLOYER BUSINESS DETAILS (IF EMPLOYER) */}
          {isEmployer && (
            <div className="space-y-4 bg-indigo-50/60 p-5 rounded-2xl border border-indigo-200">
              <h4 className="text-xs font-extrabold text-indigo-950 uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-600" /> Employer & Organization Information
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">Company / Business Name *</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Acme Remote Operations"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">Company Website</label>
                  <input
                    type="url"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                    placeholder="https://yourcompany.com"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">Hiring Contact Person</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins (Hiring Lead)"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">Business Phone / WhatsApp</label>
                  <input
                    type="tel"
                    value={companyPhone}
                    onChange={(e) => setCompanyPhone(e.target.value)}
                    placeholder="+1 555-0188"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">Company Description</label>
                  <textarea
                    rows={2}
                    value={companyDescription}
                    onChange={(e) => setCompanyDescription(e.target.value)}
                    placeholder="Briefly describe your company, mission, and remote culture..."
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs rounded-xl shadow-md shadow-teal-600/20 transition-all flex items-center gap-2"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{isSaving ? 'Saving Account...' : 'Save Account Settings'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
