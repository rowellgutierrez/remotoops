import React, { useState } from 'react';
import { UserAccount, RoleCategory, ROLE_CATEGORY_LABELS } from '../types';
import logoImg from '../assets/images/remotoops_logo_1786167434166.jpg';
import { 
  auth, 
  db, 
  doc, 
  setDoc, 
  getDoc,
  addDoc, 
  collection, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  sendEmailVerification, 
  sendPasswordResetEmail,
  updateProfile 
} from '../lib/firebase';
import { 
  X, 
  UserCheck, 
  ShieldCheck, 
  Sparkles, 
  Mail, 
  Lock, 
  User, 
  MapPin, 
  Building2, 
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  RefreshCw,
  Phone
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
  initialMode?: 'login' | 'signup';
  initialRole?: 'candidate' | 'client' | 'jobseeker' | 'employer';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'login',
  initialRole = 'jobseeker'
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot_password' | 'verification_sent'>(initialMode);
  const [role, setRole] = useState<'jobseeker' | 'employer'>(
    initialRole === 'client' || initialRole === 'employer' ? 'employer' : 'jobseeker'
  );

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [professionalTitle, setProfessionalTitle] = useState('');
  const [location, setLocation] = useState('Manila, Philippines');
  const [companyName, setCompany] = useState('');
  const [targetCategory, setTargetCategory] = useState<RoleCategory>('executive_assistant');

  // UI States
  const [createdUid, setCreatedUid] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  // Firebase Email Verification Action Code Settings
  const ACTION_CODE_SETTINGS = {
    url: 'https://remotoops.ai.studio',
    handleCodeInApp: false
  };

  // Helper to parse Firebase Auth error codes into human-readable messages
  const getFirebaseErrorMessage = (err: any): string => {
    if (!err) return 'An unexpected error occurred.';
    const code = err.code || '';
    switch (code) {
      case 'auth/invalid-email':
        return 'Invalid email address format. Please enter a valid email.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use at least 6 characters.';
      case 'auth/email-already-in-use':
        return 'An account with this email address already exists. Please switch to Log In.';
      case 'auth/user-not-found':
        return 'No account found with this email address. Please sign up first.';
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please verify your credentials or sign up.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      case 'auth/too-many-requests':
        return 'Too many requests or failed attempts. Please wait a few minutes before trying again.';
      case 'auth/unauthorized-domain':
        return 'Domain authentication configuration is in progress. Please contact support or try again shortly.';
      case 'auth/operation-not-allowed':
        return 'Sign-in method is temporarily unavailable. Please try again later.';
      default:
        return err.message || 'Authentication error occurred. Please check your details and try again.';
    }
  };

  // Helper function to send email verification using Firebase Auth
  const sendRealVerificationEmail = async (user: any): Promise<{ success: boolean; error?: any }> => {
    try {
      console.log(`[Auth] Attempting sendEmailVerification for ${user.email} with URL ${ACTION_CODE_SETTINGS.url}`);
      await sendEmailVerification(user, ACTION_CODE_SETTINGS);
      console.log(`[Auth] Verification email sending succeeded for: ${user.email}`);
      return { success: true };
    } catch (err: any) {
      console.error(`[Auth] sendEmailVerification with custom URL failed:`, err);
      // Fallback: try sending with default action settings if custom URL fails (e.g. domain authorization pending)
      try {
        console.log(`[Auth] Retrying sendEmailVerification with standard configuration for: ${user.email}`);
        await sendEmailVerification(user);
        console.log(`[Auth] Standard verification email sending succeeded for: ${user.email}`);
        return { success: true };
      } catch (fallbackErr: any) {
        console.error(`[Auth] Verification email sending failed:`, fallbackErr);
        return { success: false, error: fallbackErr };
      }
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!name.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please check again.');
      return;
    }

    setLoading(true);

    try {
      console.log(`[Auth] Creating Firebase Auth account for: ${email}`);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const uid = firebaseUser.uid;

      console.log(`[Auth] Account creation succeeded for: ${email} (UID: ${uid})`);

      // Update Firebase Auth Display Name
      await updateProfile(firebaseUser, { displayName: name }).catch((err) => {
        console.warn("[Auth] Update profile notice:", err);
      });

      // Send REAL Firebase email verification
      const evResult = await sendRealVerificationEmail(firebaseUser);

      if (!evResult.success) {
        console.error(`[Auth] Verification email sending failed for ${email}:`, evResult.error);
        const failMessage = getFirebaseErrorMessage(evResult.error);
        setErrorMessage(`Account created, but verification email could not be sent: ${failMessage}`);
        setLoading(false);
        return;
      }

      console.log(`[Auth] Verification email sending succeeded for: ${email}`);

      // Save initial Firestore user record with emailVerified: false
      const now = new Date().toISOString();
      const userDocData: UserAccount = {
        id: uid,
        name,
        email,
        role: role === 'jobseeker' ? 'candidate' : 'client',
        avatar: role === 'jobseeker'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        headline: professionalTitle || (role === 'jobseeker' ? `Aspiring ${ROLE_CATEGORY_LABELS[targetCategory]} | Verified Trainee` : `Hiring Manager @ ${companyName || 'Global Business'}`),
        professionalTitle: professionalTitle || (role === 'jobseeker' ? ROLE_CATEGORY_LABELS[targetCategory] : 'Hiring Executive'),
        location: location || 'Remote Worldwide',
        phoneNumber,
        companyName: role === 'employer' ? companyName : undefined,
        emailVerified: false,
        verificationStatus: 'incomplete',
        targetCategory: role === 'jobseeker' ? targetCategory : undefined,
        status: 'active',
        createdAt: now,
        updatedAt: now,
        lastLoginAt: now
      };

      try {
        await setDoc(doc(db, 'users', uid), userDocData, { merge: true });
        await addDoc(collection(db, 'activity_logs'), {
          userId: uid,
          userEmail: email,
          action: `User Registered (${role})`,
          details: `${name} registered. Firebase verification email sent to ${email}.`,
          timestamp: now
        });
      } catch (dbErr) {
        console.warn("Firestore record save notice:", dbErr);
      }

      setCreatedUid(uid);
      setMode('verification_sent');
      setSuccessMessage(`Account created successfully! We sent a verification link to ${email}.`);
    } catch (err: any) {
      console.error("[Auth] Account creation failed:", err);
      setErrorMessage(getFirebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      console.log(`[Auth] Attempting Firebase login for: ${email}`);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Reload user to get fresh emailVerified state from Firebase Auth
      await firebaseUser.reload().catch((rErr) => console.warn("[Auth] User reload notice:", rErr));

      const idTokenResult = await firebaseUser.getIdTokenResult().catch(() => null);
      const isAdminClaim = idTokenResult?.claims?.admin === true;

      const uid = firebaseUser.uid;
      const firebaseUserEmail = firebaseUser.email || email;

      let storedUserData: UserAccount | undefined;
      try {
        const userDocSnap = await getDoc(doc(db, 'users', uid));
        if (userDocSnap.exists()) {
          storedUserData = userDocSnap.data() as UserAccount;
        }
      } catch (dbErr) {
        console.warn("Firestore get user record notice:", dbErr);
      }

      const isAdmin = isAdminClaim || storedUserData?.role === 'admin';
      const isVerified = firebaseUser.emailVerified || isAdmin;

      console.log(`[Auth] Login user: ${firebaseUser.email} | UID: ${firebaseUser.uid} | emailVerified: ${firebaseUser.emailVerified}`);

      if (!isVerified) {
        console.warn(`[Auth] Login blocked for ${firebaseUser.email} because email is not verified.`);
        // Immediately sign out to block access to dashboard
        await signOut(auth).catch(() => {});
        
        setErrorMessage('Please verify your email before logging in. Check your inbox (or spam/junk folder) and click the verification link.');
        setLoading(false);
        return;
      }

      console.log(`[Auth] emailVerified status is true for: ${firebaseUser.email}`);

      const now = new Date().toISOString();

      const userObj: UserAccount = {
        id: uid,
        name: storedUserData?.name || firebaseUser.displayName || email.split('@')[0],
        email: firebaseUserEmail,
        role: storedUserData?.role || (isAdmin ? 'admin' : (role === 'employer' ? 'client' : 'candidate')),
        avatar: storedUserData?.avatar || firebaseUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        coverImage: storedUserData?.coverImage || '',
        headline: storedUserData?.headline || (isAdmin ? 'RemotoOps Platform Founder & Super Admin' : 'Verified Member'),
        location: storedUserData?.location || 'Remote Worldwide',
        phoneNumber: storedUserData?.phoneNumber,
        professionalTitle: storedUserData?.professionalTitle,
        companyName: storedUserData?.companyName,
        companyWebsite: storedUserData?.companyWebsite,
        companyDescription: storedUserData?.companyDescription,
        businessLocation: storedUserData?.businessLocation,
        contactName: storedUserData?.contactName,
        companyPhone: storedUserData?.companyPhone,
        bio: storedUserData?.bio || storedUserData?.about,
        about: storedUserData?.about || storedUserData?.bio,
        websiteUrl: storedUserData?.websiteUrl,
        linkedinUrl: storedUserData?.linkedinUrl,
        portfolioUrl: storedUserData?.portfolioUrl,
        resumeUrl: storedUserData?.resumeUrl,
        workExperience: storedUserData?.workExperience,
        skills: storedUserData?.skills || [],
        experiences: storedUserData?.experiences || [],
        education: storedUserData?.education || [],
        emailVerified: true,
        verificationStatus: storedUserData?.verificationStatus || 'incomplete',
        verificationNotes: storedUserData?.verificationNotes,
        isEmployerVerified: storedUserData?.isEmployerVerified,
        isProfileVerified: storedUserData?.isProfileVerified,
        isKycVerified: storedUserData?.isKycVerified,
        isNoExperienceBeginner: storedUserData?.isNoExperienceBeginner,
        targetCategory: storedUserData?.targetCategory,
        status: storedUserData?.status || 'active',
        createdAt: storedUserData?.createdAt || now,
        lastLoginAt: now
      };

      try {
        await setDoc(doc(db, 'users', uid), {
          lastLoginAt: now,
          emailVerified: true
        }, { merge: true });
      } catch (dbErr) {
        console.warn("Firestore login timestamp update notice:", dbErr);
      }

      console.log(`[Auth] Login succeeded for: ${firebaseUser.email}`);
      onLoginSuccess(userObj);
      onClose();
    } catch (err: any) {
      console.error("[Auth] Login error:", err);
      setErrorMessage(getFirebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCheckEmailVerified = async () => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (auth.currentUser) {
        console.log(`[Auth] Checking email verification status for: ${auth.currentUser.email}`);
        await auth.currentUser.reload();
        
        console.log(`[Auth] Reload completed. emailVerified: ${auth.currentUser.emailVerified}`);

        if (auth.currentUser.emailVerified) {
          console.log(`[Auth] emailVerified changed to true for: ${auth.currentUser.email}`);
          
          // Update Firestore user document
          await setDoc(doc(db, 'users', auth.currentUser.uid), {
            emailVerified: true,
            verificationStatus: 'verified',
            updatedAt: new Date().toISOString()
          }, { merge: true });

          setSuccessMessage("Your email is verified! Loading your dashboard...");

          let storedUserData: UserAccount | undefined;
          try {
            const userSnap = await getDoc(doc(db, 'users', auth.currentUser.uid));
            if (userSnap.exists()) {
              storedUserData = userSnap.data() as UserAccount;
            }
          } catch (dbErr) {
            console.warn("Firestore get user notice:", dbErr);
          }

          const userObj: UserAccount = {
            id: auth.currentUser.uid,
            name: storedUserData?.name || auth.currentUser.displayName || auth.currentUser.email?.split('@')[0] || 'Member',
            email: auth.currentUser.email || '',
            role: storedUserData?.role || 'candidate',
            avatar: storedUserData?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            headline: storedUserData?.headline || 'Verified Member',
            location: storedUserData?.location || 'Remote Worldwide',
            emailVerified: true,
            verificationStatus: storedUserData?.verificationStatus || 'incomplete',
            status: 'active'
          };

          setTimeout(() => {
            onLoginSuccess(userObj);
            onClose();
          }, 1000);
        } else {
          setErrorMessage("Your email has not been verified yet. Please check your inbox, spam, or promotions folder and click the link.");
        }
      } else {
        setErrorMessage("Please log in with your email and password to check your verification status.");
        setTimeout(() => {
          setMode('login');
          setErrorMessage('');
        }, 1500);
      }
    } catch (err: any) {
      console.error("[Auth] Check email verification error:", err);
      setErrorMessage(getFirebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (auth.currentUser) {
        const res = await sendRealVerificationEmail(auth.currentUser);
        if (res.success) {
          setSuccessMessage(`Verification email re-sent to ${auth.currentUser.email}! Please check your Inbox, Spam/Junk, and Promotions folder.`);
        } else {
          setErrorMessage(`Failed to resend verification email: ${getFirebaseErrorMessage(res.error)}`);
        }
      } else if (email && password) {
        try {
          const cred = await signInWithEmailAndPassword(auth, email, password);
          const res = await sendRealVerificationEmail(cred.user);
          await signOut(auth);
          if (res.success) {
            setSuccessMessage(`Verification email re-sent to ${email}! Please check your Inbox, Spam/Junk, and Promotions folder.`);
          } else {
            setErrorMessage(`Failed to resend: ${getFirebaseErrorMessage(res.error)}`);
          }
        } catch (loginErr: any) {
          setErrorMessage(`Could not resend email: ${getFirebaseErrorMessage(loginErr)}`);
        }
      } else {
        setErrorMessage("Please enter your registered email and password in the login form, then click Resend Verification.");
      }
    } catch (err: any) {
      console.error("[Auth] Resend error:", err);
      setErrorMessage(getFirebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email) {
      setErrorMessage('Please enter your account email address.');
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage(`Password reset link sent to ${email}! Please check your inbox and spam folder.`);
    } catch (err: any) {
      console.error("Password reset error:", err);
      setErrorMessage('Failed to send password reset email. Make sure the email is registered.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-6">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <img 
              src={logoImg} 
              alt="RemotoOps Logo" 
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full border border-teal-400 object-cover shadow-md" 
            />
            <span className="font-extrabold text-lg text-white">RemotoOps Portal</span>
          </div>

          <h2 className="text-xl font-extrabold">
            {mode === 'login' && 'Welcome Back to RemotoOps'}
            {mode === 'signup' && 'Create Your Free Account'}
            {mode === 'forgot_password' && 'Reset Your Password'}
            {mode === 'verification_sent' && 'Verify Your Email Address'}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            {mode === 'signup' 
              ? 'Connect eager beginners with verified clients & safe remote opportunities.'
              : mode === 'forgot_password'
              ? 'Enter your registered email to receive a password reset link.'
              : mode === 'verification_sent'
              ? 'We sent a verification link to your email inbox. Please verify before applying.'
              : 'Welcome back. Log in to continue.'}
          </p>

          {/* Mode Tabs */}
          {mode !== 'verification_sent' && (
            <div className="flex bg-slate-800/80 p-1 rounded-xl mt-4 border border-slate-700/80">
              <button
                onClick={() => { setMode('login'); setErrorMessage(''); setSuccessMessage(''); }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  mode === 'login' ? 'bg-teal-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
              >
                Log In
              </button>
              <button
                onClick={() => { setMode('signup'); setErrorMessage(''); setSuccessMessage(''); }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  mode === 'signup' ? 'bg-teal-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl text-xs font-medium flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Message Alert */}
          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl text-xs font-medium flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* VERIFICATION SENT VIEW */}
          {mode === 'verification_sent' && (
            <div className="text-center space-y-4 py-2">
              <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-700 border border-teal-300 flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-teal-600" />
              </div>

              <div className="space-y-1">
                <h3 className="font-extrabold text-base text-slate-900">Check Your Email Inbox!</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  We automatically sent a verification link to <strong className="text-slate-900">{email}</strong>. Please check your inbox or spam folder to complete verification.
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-left text-xs space-y-2">
                <p className="font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" /> Important Verification Steps:
                </p>
                <p className="text-amber-800 text-[11px] leading-relaxed">
                  1. Check your <strong>Inbox</strong>, <strong>Spam / Junk</strong>, and <strong>Promotions</strong> folder for the verification email.<br />
                  2. Click the verification link inside the email.<br />
                  3. After clicking the link, return here and click <strong>"I've Verified My Email"</strong> below to enter your dashboard.
                </p>
              </div>

              <div className="pt-2 space-y-2.5">
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleCheckEmailVerified}
                  className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  {loading ? 'Checking Verification Status...' : "I've Verified My Email"}
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={handleResendVerification}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
                  Resend Verification Email
                </button>

                <button
                  type="button"
                  onClick={() => window.open('https://mail.google.com', '_blank')}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl shadow transition-all flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4 text-teal-400" />
                  Open Gmail Inbox
                </button>

                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrorMessage(''); setSuccessMessage(''); }}
                  className="w-full text-center text-xs text-slate-500 hover:text-slate-800 font-medium py-1"
                >
                  ← Back to Log In
                </button>
              </div>
            </div>
          )}

          {/* FORGOT PASSWORD VIEW */}
          {mode === 'forgot_password' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">Your Account Email:</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <KeyRound className="w-4 h-4 text-teal-400" />
                {loading ? 'Sending Reset Email...' : 'Send Password Reset Email'}
              </button>

              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMessage(''); setSuccessMessage(''); }}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-900 font-medium py-1"
              >
                ← Back to Log In
              </button>
            </form>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">Email Address:</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">Password:</label>
                  <button
                    type="button"
                    onClick={() => { setMode('forgot_password'); setErrorMessage(''); setSuccessMessage(''); }}
                    className="text-[11px] font-semibold text-teal-700 hover:text-teal-900"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <UserCheck className="w-4 h-4 text-teal-400" />
                {loading ? 'Logging in...' : 'Log In to Account'}
              </button>
            </form>
          )}

          {/* SIGNUP FORM */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              
              {/* Account Type Selector */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">Account Type *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('jobseeker')}
                    className={`p-3 rounded-xl border text-left flex flex-col transition-all ${
                      role === 'jobseeker'
                        ? 'border-teal-500 bg-teal-50/60 ring-2 ring-teal-500/20 text-slate-900'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs">Jobseeker</span>
                      {role === 'jobseeker' && <CheckCircle2 className="w-4 h-4 text-teal-600" />}
                    </div>
                    <span className="text-[10px] text-slate-500 mt-0.5">Apply for remote positions & mentorship</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('employer')}
                    className={`p-3 rounded-xl border text-left flex flex-col transition-all ${
                      role === 'employer'
                        ? 'border-indigo-500 bg-indigo-50/60 ring-2 ring-indigo-500/20 text-slate-900'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs">Employer</span>
                      {role === 'employer' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                    </div>
                    <span className="text-[10px] text-slate-500 mt-0.5">Post jobs & hire remote talent</span>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Nics Cuajao"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+63 912 345 6789"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 chars"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">Confirm Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>

              {/* Role specific inputs */}
              {role === 'jobseeker' && (
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">Target Role Specialty</label>
                    <select
                      value={targetCategory}
                      onChange={(e) => setTargetCategory(e.target.value as RoleCategory)}
                      className="w-full bg-slate-50 border border-slate-300 text-xs rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      {Object.entries(ROLE_CATEGORY_LABELS).map(([catKey, label]) => (
                        <option key={catKey} value={catKey}>{label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">Location / City & Country</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Manila, Philippines"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 pl-9 pr-3 py-2 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {role === 'employer' && (
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">Company Name *</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g. Apex Global Solutions"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 pl-9 pr-3 py-2 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                <UserCheck className="w-4 h-4 text-teal-400" />
                {loading ? 'Registering account...' : 'Register & Send Email Verification'}
              </button>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};

