export type RoleCategory = 
  | 'executive_assistant' 
  | 'admin_ops' 
  | 'social_media_manager'
  | 'customer_support'
  | 'data_lead_gen'
  | 'creative_design'
  | 'tech_web_ops'
  | 'content_writing'
  | 'ecom_bookkeeping'
  | 'community_mod'
  | 'general';

export type ExperienceRequirement = 'no_experience' | 'some_experience' | 'experienced';

export type CompensationType = 'paid_stipend' | 'hourly_rate' | 'performance_bonus' | 'unpaid_mentorship';

export type ApplicationMethod = 'direct' | 'external';

export type JobStatus = 'OPEN' | 'CLOSING_SOON' | 'CLOSED' | 'FILLED' | 'EXPIRED';

export type ExperienceLevel = 'no_experience' | 'beginner' | '1_2_years' | '3_5_years' | '5_plus_years';

export type TimezoneOverlap = 
  | 'EST (UTC-5)' 
  | 'PST (UTC-8)' 
  | 'GMT/BST (UTC+0)' 
  | 'CET (UTC+1)' 
  | 'SGT/PHT (UTC+8)' 
  | 'Flexible / Async';

export interface UserExperience {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
}

export interface UserEducation {
  id: string;
  degree: string;
  institution: string;
  year: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'candidate' | 'client' | 'admin' | 'jobseeker' | 'employer';
  avatar: string;
  coverImage?: string;
  headline: string;
  location: string;
  phoneNumber?: string;
  professionalTitle?: string;
  emailVerified?: boolean;
  verificationStatus?: 'incomplete' | 'pending' | 'verified' | 'rejected' | 'changes_required';
  verificationNotes?: string;
  isVerifiedSafe?: boolean;
  isEmployerVerified?: boolean;
  isProfileVerified?: boolean;
  isKycVerified?: boolean;
  kycDocType?: string;
  kycFacialMatchScore?: number;
  kycVerifiedAt?: string;
  idDocumentUrl?: string;
  selfiePhotoUrl?: string;
  companyName?: string;
  companyWebsite?: string;
  companyDescription?: string;
  businessLocation?: string;
  contactName?: string;
  companyPhone?: string;
  isNoExperienceBeginner?: boolean;
  targetCategory?: RoleCategory;
  bio?: string;
  about?: string;
  websiteUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  resumeFileName?: string;
  resumeStoragePath?: string;
  resumeUploadedAt?: string;
  workExperience?: string;
  skills?: string[];
  experiences?: UserExperience[];
  education?: UserEducation[];
  status?: 'active' | 'suspended';
  updatedAt?: string;
  createdAt?: string;
  lastLoginAt?: string;
}

export interface JobPost {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  clientName: string;
  clientTitle: string;
  clientAvatar: string;
  clientLocation: string;
  roleCategory: RoleCategory;
  compensation: string;
  compensationType: CompensationType;
  hoursPerWeek: string;
  timezone: TimezoneOverlap;
  mentorName: string;
  mentorRole: string;
  isMentorshipGuaranteed: boolean;
  isOpenToZeroExperience: boolean;
  isVerifiedSafeClient: boolean;
  description: string;
  responsibilities: string[];
  learningOutcomes: string[];
  requiredTools: string[];
  postedDate: string;
  applicantCount: number;
  featured?: boolean;

  // Application Method & Status
  applicationMethod?: ApplicationMethod;
  externalApplyUrl?: string;
  jobStatus?: JobStatus;
  experienceLevelNum?: ExperienceLevel;
  viewsCount?: number;
  savesCount?: number;
  applicationsCount?: number;
  postedBy?: string;

  // Extended filter fields
  department?: string;
  applyProcess?: 'direct_pitch' | 'easy_apply' | 'external_portal';
  experienceLevel?: 'entry' | 'mid' | 'senior';
  commitment?: 'full_time' | 'part_time' | 'flexible';
  benefits?: string[];
  educationLevel?: string;
  certifications?: string[];
  securityClearance?: 'kyc_verified' | 'background_checked' | 'none';
  languages?: string[];
  encouragedToApply?: string[];
  shiftSchedule?: 'day_shift' | 'night_shift' | 'flexible_async';
  travelRequirement?: 'no_travel' | 'occasional' | 'onsite_optional';
  industry?: string;
  companySize?: string;
  foundingYear?: string;
  activityOutcome?: 'active_today' | 'high_response' | 'interviewing_now';
}

export interface CandidateTool {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface CandidateProfile {
  id: string;
  name: string;
  avatar: string;
  headline: string;
  targetCategory: RoleCategory;
  location: string;
  timezone: TimezoneOverlap;
  bio: string;
  tools: CandidateTool[];
  badges: string[];
  videoPitchUrl?: string;
  isEntryLevel: boolean;
  mentorshipTrack: { module: string; completed: boolean; score?: number }[];
  portfolioLinks: { title: string; url: string; category: string }[];
  openToOpportunities: boolean;
  rating?: number;
}

export interface FeedPost {
  id: string;
  authorName: string;
  authorTitle: string;
  authorAvatar: string;
  authorRoleType: 'client' | 'candidate' | 'mentor';
  roleCategory: RoleCategory | 'general';
  content: string;
  timestamp: string;
  likes: number;
  commentsCount: number;
  tags: string[];
  isMentorshipStory?: boolean;
  likedByMe?: boolean;
  comments?: { id: string; authorName: string; authorAvatar: string; text: string; time: string }[];
}

export interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  query: string;
  category?: string;
  timezone?: string;
  compensationType?: string;
  filters?: any;
  notificationFrequency?: string;
  createdAt: string;
}

export interface SavedJob {
  id: string;
  userId: string;
  userEmail?: string;
  jobId: string;
  jobTitle: string;
  company: string;
  companyLogo?: string;
  location: string;
  compensation: string;
  experienceLevel?: string;
  jobStatus: JobStatus;
  savedAt: string;
  applicationMethod?: ApplicationMethod;
  externalApplyUrl?: string;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  candidateName: string;
  candidateAvatar?: string;
  candidateEmail: string;
  candidatePhone?: string;
  candidateLocation?: string;
  resumeUrl?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  coverPitch: string;
  toolExperience: string[];
  status: 'applied' | 'under_review' | 'intro_chat' | 'shortlisted' | 'interview' | 'accepted' | 'declined' | 'hired';
  appliedAt: string;
  mentorNotes?: string;
  candidateId?: string;
  applicationType?: 'direct' | 'external_click';
  externalUrl?: string;
}

export interface DirectMessage {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
}

export interface MentorshipModule {
  id: string;
  title: string;
  roleCategory: RoleCategory;
  duration: string;
  description: string;
  skillsLearned: string[];
  steps: {
    stepNumber: number;
    title: string;
    details: string;
    practicalTask: string;
    recommendedTools: string[];
  }[];
}

export interface ScamReport {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  reporterName: string;
  reason: 'upfront_payment_requested' | 'check_equipment_scam' | 'telegram_whatsapp_only' | 'unrealistic_pay' | 'fake_company_identity' | 'other';
  details: string;
  reportedAt: string;
}

export const ROLE_CATEGORY_LABELS: Record<RoleCategory, string> = {
  executive_assistant: 'Executive Assistant (EA)',
  admin_ops: 'Admin & Virtual Operations',
  social_media_manager: 'Social Media & Reels',
  customer_support: 'Customer Support & Chat',
  data_lead_gen: 'Lead Gen & Data Research',
  creative_design: 'Graphic Design & Video',
  tech_web_ops: 'Tech, Web & Automation',
  content_writing: 'Content & Copywriting',
  ecom_bookkeeping: 'E-commerce & Bookkeeping',
  community_mod: 'Community & Discord Mod',
  general: 'General Entry-Level'
};
