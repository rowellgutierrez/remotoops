import { JobPost, CandidateProfile, FeedPost, Application, MentorshipModule } from '../types';

export const INITIAL_JOBS: JobPost[] = [];

/* Removed legacy seed jobs */
const _LEGACY_JOBS_REMOVED: JobPost[] = [
  {
    id: 'job-1',
    title: 'Junior Remote Executive Assistant (Mentorship Program)',
    company: 'Apex Global Ventures',
    companyLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&auto=format&fit=crop&q=80',
    clientName: 'Sarah Jenkins',
    clientTitle: 'Chief of Staff @ Apex Global',
    clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    clientLocation: 'San Francisco, USA (Distributed Team)',
    roleCategory: 'executive_assistant',
    compensation: '$800 - $1,200 / month Stipend',
    compensationType: 'paid_stipend',
    hoursPerWeek: '20-25 hrs/week',
    timezone: 'PST (UTC-8)',
    mentorName: 'Sarah Jenkins',
    mentorRole: '1-on-1 Executive Mentorship with 10+ yr EA VP',
    isMentorshipGuaranteed: true,
    isOpenToZeroExperience: true,
    isVerifiedSafeClient: true,
    description: 'Perfect for eager newcomers with zero corporate EA experience! We will train you step-by-step in executive calendar coordination, Inbox Zero triage, C-suite travel arrangements, and Notion knowledge management.',
    responsibilities: [
      'Manage multi-time zone calendar invites on Google Calendar',
      'Draft crisp email responses and daily executive briefings',
      'Organize async team updates on Slack and Loom',
      'Document meeting key takeaways and track follow-up action items'
    ],
    learningOutcomes: [
      'Master Executive Calendar Optimization & Conflict Resolution',
      'Learn C-Level Confidential Communication Standards',
      'Build Automated Notion Command Centers & Workflows'
    ],
    requiredTools: ['Google Workspace', 'Notion', 'Slack', 'Loom', 'Calendly'],
    postedDate: '2 hours ago',
    applicantCount: 14,
    featured: true,
  },
  {
    id: 'job-2',
    title: 'Social Media & TikTok Content Trainee (No Experience Required)',
    company: 'Bloom Digital Studio',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    clientName: 'Mateo Rossi',
    clientTitle: 'Founder & Brand Strategist',
    clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    clientLocation: 'Milan, Italy (Remote Worldwide)',
    roleCategory: 'social_media_manager',
    compensation: '$600 - $900 / month Stipend + Growth Bonus',
    compensationType: 'paid_stipend',
    hoursPerWeek: '15-20 hrs/week',
    timezone: 'CET (UTC+1)',
    mentorName: 'Mateo Rossi',
    mentorRole: 'Direct Mentorship by Senior Content Producer',
    isMentorshipGuaranteed: true,
    isOpenToZeroExperience: true,
    isVerifiedSafeClient: true,
    description: 'Are you passionate about social media trends, Reels, and Canva design but lack official client experience? This 3-month paid internship gives you hands-on training with actual client accounts.',
    responsibilities: [
      'Curate monthly Instagram & TikTok content calendars',
      'Design clean graphics & carousels using Canva templates',
      'Schedule posts using Metricool/Buffer and track engagement metrics',
      'Engage with community comments and direct messages daily'
    ],
    learningOutcomes: [
      'Short-Form Video Editing & Viral Hook Copywriting',
      'Social Media Analytics Reporting & Trend Spotting',
      'Client Brand Voice Adaptation & Campaign Planning'
    ],
    requiredTools: ['Canva', 'Metricool', 'CapCut', 'Instagram Studio', 'Slack'],
    postedDate: '1 day ago',
    applicantCount: 28,
    featured: true,
  },
  {
    id: 'job-3',
    title: 'Remote Customer Support & Live Chat Specialist (Trainee)',
    company: 'SupportSphere Global',
    companyLogo: 'https://images.unsplash.com/photo-1556742049-0a670f4a4591?w=120&auto=format&fit=crop&q=80',
    clientName: 'Elena Rostova',
    clientTitle: 'Head of Customer Experience',
    clientAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    clientLocation: 'Berlin, Germany (Worldwide Remote)',
    roleCategory: 'customer_support',
    compensation: '$12 - $16 / hr Paid Training',
    compensationType: 'hourly_rate',
    hoursPerWeek: '20-30 hrs/week',
    timezone: 'Flexible / Async',
    mentorName: 'Elena Rostova',
    mentorRole: 'Customer Success Coach',
    isMentorshipGuaranteed: true,
    isOpenToZeroExperience: true,
    isVerifiedSafeClient: true,
    description: 'Zero experience needed! We hire candidates with great empathy, strong written English, and a willingness to help users resolve issues via live chat and email ticketing systems like Zendesk.',
    responsibilities: [
      'Respond to inbound customer queries on live web chat',
      'Categorize support tickets in Zendesk & Intercom',
      'Follow macro macros and help guide articles',
      'Escalate technical bugs to the software dev team'
    ],
    learningOutcomes: [
      'Empathic Customer Communication & Crisis Resolution',
      'Zendesk Ticketing Mastery & Help Center Management',
      'Remote Async Customer Service SLA Compliance'
    ],
    requiredTools: ['Zendesk', 'Intercom', 'Slack', 'Loom', 'Google Docs'],
    postedDate: '3 hours ago',
    applicantCount: 19,
    featured: true,
  },
  {
    id: 'job-4',
    title: 'Lead Generation & Market Research Assistant (Beginner)',
    company: 'Vanguard Growth Partners',
    companyLogo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=120&auto=format&fit=crop&q=80',
    clientName: 'Marcus Vance',
    clientTitle: 'VP of Sales Operations',
    clientAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    clientLocation: 'Austin, TX, USA (Remote)',
    roleCategory: 'data_lead_gen',
    compensation: '$700 - $1,000 / month Stipend + Lead Bonus',
    compensationType: 'paid_stipend',
    hoursPerWeek: '20 hrs/week',
    timezone: 'EST (UTC-5)',
    mentorName: 'Marcus Vance',
    mentorRole: 'Sales Operations Mentor',
    isMentorshipGuaranteed: true,
    isOpenToZeroExperience: true,
    isVerifiedSafeClient: true,
    description: 'Learn B2B lead generation, LinkedIn Sales Navigator research, and web data enrichment from scratch. Ideal for structured individuals who enjoy web research and data organization.',
    responsibilities: [
      'Research target companies & decision makers on LinkedIn',
      'Verify contact emails using Hunter.io & NeverBounce',
      'Organize prospect records into Google Sheets and Apollo.io',
      'Track response metrics in Notion'
    ],
    learningOutcomes: [
      'B2B Market Intelligence & Prospect Prospecting',
      'Data Scraping & CRM Enrichment Workflows',
      'Data Hygiene & Spreadsheets Analytics'
    ],
    requiredTools: ['LinkedIn Sales Navigator', 'Google Sheets', 'Apollo.io', 'Hunter.io'],
    postedDate: '5 hours ago',
    applicantCount: 22,
    featured: false,
  },
  {
    id: 'job-5',
    title: 'Junior Graphic Design & Canva Brand Assistant',
    company: 'PixelCraft Creative Agency',
    companyLogo: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=120&auto=format&fit=crop&q=80',
    clientName: 'Maya Lin',
    clientTitle: 'Creative Director',
    clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    clientLocation: 'Toronto, Canada (Remote)',
    roleCategory: 'creative_design',
    compensation: '$800 / month Stipend',
    compensationType: 'paid_stipend',
    hoursPerWeek: '15-20 hrs/week',
    timezone: 'Flexible / Async',
    mentorName: 'Maya Lin',
    mentorRole: '1-on-1 Design Feedback & Portfolio Coaching',
    isMentorshipGuaranteed: true,
    isOpenToZeroExperience: true,
    isVerifiedSafeClient: true,
    description: 'Have a knack for aesthetics but no client portfolio yet? We provide complete training in social media banners, slide pitch design, brand kits, and Figma layout fundamentals.',
    responsibilities: [
      'Adapt client brand templates in Canva & Figma',
      'Design slide decks, e-books, and social media banners',
      'Resize assets for Instagram, LinkedIn, and YouTube',
      'Organize digital design assets in Google Drive'
    ],
    learningOutcomes: [
      'Brand Identity Guidelines & Typography Hierarchy',
      'Figma & Canva Pro Speed Workflows',
      'Client Revision Management & Portfolio Building'
    ],
    requiredTools: ['Canva Pro', 'Figma', 'Photoshop Basics', 'Google Drive'],
    postedDate: '1 day ago',
    applicantCount: 35,
    featured: false,
  },
  {
    id: 'job-6',
    title: 'Remote Web Operations & AI Automation Trainee',
    company: 'AutomateOps Agency',
    companyLogo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=120&auto=format&fit=crop&q=80',
    clientName: 'David Kalu',
    clientTitle: 'Founder & Automation Architect',
    clientAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    clientLocation: 'London, UK (Global Remote)',
    roleCategory: 'tech_web_ops',
    compensation: '$15 / hr Paid Mentorship',
    compensationType: 'hourly_rate',
    hoursPerWeek: '20 hrs/week',
    timezone: 'GMT/BST (UTC+0)',
    mentorName: 'David Kalu',
    mentorRole: 'Automation & Web Systems Mentor',
    isMentorshipGuaranteed: true,
    isOpenToZeroExperience: true,
    isVerifiedSafeClient: true,
    description: 'Curious about no-code, Zapier, Make.com, WordPress, or AI workflows? Learn how modern tech agencies automate business processes without needing complex software engineering experience.',
    responsibilities: [
      'Test web contact forms and verify Zapier zaps',
      'Update WordPress blog posts and Notion knowledge bases',
      'Perform quality checks on AI-generated content workflows',
      'Document workflow diagrams in Miro'
    ],
    learningOutcomes: [
      'Zapier & Make.com No-Code Automation Architecture',
      'WordPress CMS Content Publishing & SEO Basics',
      'AI Prompting & Automation Quality Control'
    ],
    requiredTools: ['Zapier', 'WordPress', 'Notion', 'Make.com', 'Miro'],
    postedDate: '2 days ago',
    applicantCount: 17,
    featured: false,
  },
  {
    id: 'job-7',
    title: 'Content & Newsletter Copywriting Apprentice',
    company: 'Ink & Insight Publishing',
    companyLogo: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=120&auto=format&fit=crop&q=80',
    clientName: 'Chloe Bennett',
    clientTitle: 'Editorial Lead',
    clientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    clientLocation: 'Sydney, Australia (Remote)',
    roleCategory: 'content_writing',
    compensation: '$700 - $950 / month Stipend',
    compensationType: 'paid_stipend',
    hoursPerWeek: '15 hrs/week',
    timezone: 'SGT/PHT (UTC+8)',
    mentorName: 'Chloe Bennett',
    mentorRole: 'Senior Copywriter & Editor',
    isMentorshipGuaranteed: true,
    isOpenToZeroExperience: true,
    isVerifiedSafeClient: true,
    description: 'Love writing essays, stories, or blog posts? Turn your writing passion into a remote copywriting career. We teach email newsletters, blog outline research, and Substack/Klaviyo publishing.',
    responsibilities: [
      'Draft newsletter blurbs and catchy subject lines',
      'Proofread and edit blog posts for grammar and flow',
      'Format newsletters in Substack or Mailchimp',
      'Conduct topic research for upcoming podcast episodes'
    ],
    learningOutcomes: [
      'Email Marketing Copywriting & Subject Line Testing',
      'Substack & Mailchimp Newsletter Publishing',
      'SEO Keyword Research & Headline Optimization'
    ],
    requiredTools: ['Google Docs', 'Substack', 'Grammarly', 'Mailchimp', 'Notion'],
    postedDate: '2 days ago',
    applicantCount: 24,
    featured: false,
  },
  {
    id: 'job-8',
    title: 'Virtual Bookkeeping & E-commerce Assistant (Trainee)',
    company: 'Summit E-Commerce Ops',
    companyLogo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=120&auto=format&fit=crop&q=80',
    clientName: 'Aisha Patel',
    clientTitle: 'Finance & Ops Director',
    clientAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    clientLocation: 'Singapore (Global Remote)',
    roleCategory: 'ecom_bookkeeping',
    compensation: '$800 - $1,100 / month Stipend',
    compensationType: 'paid_stipend',
    hoursPerWeek: '20 hrs/week',
    timezone: 'SGT/PHT (UTC+8)',
    mentorName: 'Aisha Patel',
    mentorRole: 'Chartered Accountant & E-com Mentor',
    isMentorshipGuaranteed: true,
    isOpenToZeroExperience: true,
    isVerifiedSafeClient: true,
    description: 'Great with spreadsheets and numbers? Learn QuickBooks Online, Shopify inventory reconciliation, and virtual bookkeeping from experienced financial professionals.',
    responsibilities: [
      'Categorize income and expense receipts in QuickBooks',
      'Reconcile monthly Shopify inventory logs',
      'Organize invoice receipts in Google Drive',
      'Prepare basic monthly expense reports for clients'
    ],
    learningOutcomes: [
      'QuickBooks Online & Wave Financial Management',
      'E-commerce Inventory Reconciliation & Shopify Back-office',
      'Financial Document Organization & Audit Readiness'
    ],
    requiredTools: ['QuickBooks Online', 'Excel / Google Sheets', 'Shopify', 'Dext'],
    postedDate: '3 days ago',
    applicantCount: 16,
    featured: false,
  },
  {
    id: 'job-9',
    title: 'Discord & Community Moderator (No Experience Needed)',
    company: 'MetaVerse & Gaming Hub',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    clientName: 'Liam O\'Connor',
    clientTitle: 'Community Manager',
    clientAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    clientLocation: 'Dublin, Ireland (Remote)',
    roleCategory: 'community_mod',
    compensation: '$600 - $850 / month Stipend',
    compensationType: 'paid_stipend',
    hoursPerWeek: '15-20 hrs/week',
    timezone: 'Flexible / Async',
    mentorName: 'Liam O\'Connor',
    mentorRole: 'Lead Community Strategist',
    isMentorshipGuaranteed: true,
    isOpenToZeroExperience: true,
    isVerifiedSafeClient: true,
    description: 'Active on Discord, Slack, or online gaming communities? We train beginners on how to moderate global online communities, host virtual trivia nights, and enforce community guidelines.',
    responsibilities: [
      'Welcome new community members in Discord & Slack',
      'Enforce server rules and filter spam or hostile messages',
      'Organize community games, AMA sessions, and giveaways',
      'Summarize community feedback for community managers'
    ],
    learningOutcomes: [
      'Discord Server Bot Management & Role Setup',
      'Community Engagement & Crisis De-escalation',
      'Online Event Planning & Async Communication'
    ],
    requiredTools: ['Discord', 'Slack', 'Carl-bot / MEE6', 'Notion'],
    postedDate: '4 days ago',
    applicantCount: 31,
    featured: false,
  }
];

export const INITIAL_CANDIDATES: CandidateProfile[] = [
  {
    id: 'cand-1',
    name: 'Ananya Sharma',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    headline: 'Aspiring Executive Assistant | Google Workspace & Notion Certified',
    targetCategory: 'executive_assistant',
    location: 'Manila, Philippines',
    timezone: 'SGT/PHT (UTC+8)',
    bio: 'Dedicated, highly organized career-changer looking to launch my remote Executive Assistant career. Trained in Inbox Zero, complex Google Calendar coordination, and Notion workflow creation through RemotoOps modules.',
    tools: [
      { name: 'Google Workspace', level: 'Advanced' },
      { name: 'Notion', level: 'Intermediate' },
      { name: 'Slack & Loom', level: 'Advanced' },
      { name: 'Calendly', level: 'Intermediate' }
    ],
    badges: ['RemotoOps EA Track Certified', 'Inbox Zero Master', 'Timezone Pro'],
    isEntryLevel: true,
    mentorshipTrack: [
      { module: 'Executive Calendar & Time Management', completed: true, score: 98 },
      { module: 'Email Triage & Inbox Zero', completed: true, score: 95 },
      { module: 'C-Suite Document Preparation', completed: true, score: 92 },
      { module: 'Async Video & Loom Updates', completed: true, score: 100 }
    ],
    portfolioLinks: [
      { title: 'Sample Executive Travel Itinerary & Calendar SOP', url: '#', category: 'Notion Workspace' },
      { title: 'C-Suite Daily Briefing Email Template', url: '#', category: 'Google Doc' }
    ],
    openToOpportunities: true,
    rating: 4.9
  },
  {
    id: 'cand-2',
    name: 'Carlos Mendoza',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    headline: 'Creative Social Media & TikTok Specialist | Canva & CapCut Creator',
    targetCategory: 'social_media_manager',
    location: 'Bogotá, Colombia',
    timezone: 'EST (UTC-5)',
    bio: 'Self-taught content creator seeking a mentorship-driven internship to manage social presence for remote tech or lifestyle brands. Great eye for aesthetic typography, reel hooks, and visual storytelling.',
    tools: [
      { name: 'Canva Pro', level: 'Advanced' },
      { name: 'CapCut Video', level: 'Advanced' },
      { name: 'Metricool', level: 'Intermediate' },
      { name: 'Instagram & TikTok', level: 'Advanced' }
    ],
    badges: ['Canva Certified Specialist', 'Social Media Reel Strategist'],
    isEntryLevel: true,
    mentorshipTrack: [
      { module: 'Short-Form Video Hook Creation', completed: true, score: 96 },
      { module: 'Social Media Content Calendar Architecture', completed: true, score: 94 },
      { module: 'Community Engagement & DM Strategy', completed: false }
    ],
    portfolioLinks: [
      { title: 'Sample 30-Day Aesthetic Brand Content Calendar', url: '#', category: 'Figma / Canva' },
      { title: 'Concept Reels Portfolio for SaaS Brand', url: '#', category: 'Video Drive' }
    ],
    openToOpportunities: true,
    rating: 4.8
  },
  {
    id: 'cand-3',
    name: 'Priya Patel',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    headline: 'Remote Customer Support & Lead Gen Trainee',
    targetCategory: 'customer_support',
    location: 'Bangalore, India',
    timezone: 'SGT/PHT (UTC+8)',
    bio: 'Detail-oriented graduate with strong empathetic English writing skills. Certified in Zendesk customer chat support and LinkedIn lead generation techniques.',
    tools: [
      { name: 'Zendesk', level: 'Intermediate' },
      { name: 'LinkedIn Sales Navigator', level: 'Intermediate' },
      { name: 'Google Docs & Sheets', level: 'Advanced' }
    ],
    badges: ['Zendesk Support Certified', 'Anti-Scam Verified Candidate'],
    isEntryLevel: true,
    mentorshipTrack: [
      { module: 'Customer Chat & SLA Triage', completed: true, score: 95 },
      { module: 'B2B Lead Generation Research', completed: true, score: 92 }
    ],
    portfolioLinks: [
      { title: 'Mock Zendesk Ticket Resolution Guide', url: '#', category: 'Google Doc' }
    ],
    openToOpportunities: true,
    rating: 4.9
  }
];

export const INITIAL_FEED: FeedPost[] = [
  {
    id: 'post-1',
    authorName: 'Sarah Jenkins',
    authorTitle: 'Chief of Staff @ Apex Global | Verified Client & EA Mentor',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    authorRoleType: 'mentor',
    roleCategory: 'executive_assistant',
    content: '💡 Quick tip for all newbie Executive Assistants applying to global remote roles:\n\nWhen managing calendars across EST, PST, and GMT, never just send a meeting invite without checking the executive\'s focus block times. Always include time zone conversions directly in the calendar invite header! \n\nWe just opened a new Junior Remote EA Mentorship opportunity here on RemotoOps for talent with 0 prior corporate experience. Check out our job board to apply! 🚀',
    timestamp: '2 hours ago',
    likes: 42,
    commentsCount: 9,
    tags: ['EATips', 'RemoteWork', 'Mentorship', 'ExecutiveAssistant'],
    isMentorshipStory: true,
    likedByMe: false,
    comments: [
      {
        id: 'c1',
        authorName: 'Ananya Sharma',
        authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        text: 'This is such gold advice! Just applied for the Junior EA role. Super excited about the Google Calendar optimization track!',
        time: '1 hour ago'
      }
    ]
  },
  {
    id: 'post-2',
    authorName: 'Carlos Mendoza',
    authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    authorTitle: 'Entry-Level Social Media Specialist',
    authorRoleType: 'candidate',
    roleCategory: 'social_media_manager',
    content: '🎉 Milestone unlocked! I completed the RemotoOps "Short-Form Video & Reel Hook Architecture" mentorship track! \n\nI built a complete 30-day concept calendar for a remote tech brand using Canva Pro and Metricool. Eager to take on my first internship or junior SMM opportunity. Clients looking for an enthusiastic junior creator, let’s connect!',
    timestamp: '5 hours ago',
    likes: 38,
    commentsCount: 5,
    tags: ['SocialMediaManager', 'CanvaPro', 'RemoteInternship', 'NewbieTalent'],
    isMentorshipStory: true,
    likedByMe: true,
    comments: [
      {
        id: 'c2',
        authorName: 'Mateo Rossi',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        text: 'Great work Carlos! Check out our TikTok Growth internship post at Bloom Digital Studio. Your concept portfolio looks promising!',
        time: '3 hours ago'
      }
    ]
  },
  {
    id: 'post-3',
    authorName: 'David Kalu',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    authorTitle: 'Head of Operations @ AutomateOps | Verified Recruiter',
    authorRoleType: 'client',
    roleCategory: 'admin_ops',
    content: 'Why we hire entry-level remote talent on RemotoOps: Newbies bring fresh energy, zero bad habits, and an incredible appetite to learn. When paired with structured SOPs and 1-on-1 weekly mentorship, they become rockstar Remote Operations Coordinators within 60 days.',
    timestamp: '1 day ago',
    likes: 67,
    commentsCount: 12,
    tags: ['RemoteOperations', 'HiringNewbies', 'DistributedTeams', 'AdminOps'],
    isMentorshipStory: false,
    likedByMe: false
  }
];

export const MENTORSHIP_MODULES: MentorshipModule[] = [
  {
    id: 'mod-ea-1',
    title: 'Executive Calendar & Inbox Zero Optimization',
    roleCategory: 'executive_assistant',
    duration: '2 Weeks Self-Paced',
    description: 'Learn the exact systems used by elite Executive Assistants to manage C-suite calendars across multiple timezones and keep email inboxes at zero.',
    skillsLearned: ['Google Calendar Multi-Timezone Management', 'Email Priority Triage', 'Meeting Conflict Resolution', 'Calendly Integration'],
    steps: [
      {
        stepNumber: 1,
        title: 'Time Zone Mapping & Calendar Focus Blocks',
        details: 'Setting up secondary time zones, buffer times between meetings, and protective executive focus blocks.',
        practicalTask: 'Create a multi-timezone dummy calendar in Google Calendar with 5 overlapping executive meeting scenarios.',
        recommendedTools: ['Google Calendar', 'World Time Buddy', 'Clockify']
      },
      {
        stepNumber: 2,
        title: 'Inbox Triage & Color-Coded VIP Labeling',
        details: 'Categorizing inbound emails into Immediate Action, Waiting On, Read Later, and Archiving.',
        practicalTask: 'Filter 20 mock executive emails and draft clean 3-sentence summary briefings.',
        recommendedTools: ['Gmail', 'Superhuman Basics']
      }
    ]
  },
  {
    id: 'mod-smm-1',
    title: 'Short-Form Video Hooks & Canva Content Planning',
    roleCategory: 'social_media_manager',
    duration: '2 Weeks Self-Paced',
    description: 'Master short-form video scriptwriting, reel cover design, and 30-day content calendar execution for global clients.',
    skillsLearned: ['Canva Brand Kit Setup', 'Hook Copywriting', 'Metricool Post Scheduling', 'Hashtag & Analytics Tracking'],
    steps: [
      {
        stepNumber: 1,
        title: 'Designing Carousel Posts & Brand Aesthetic',
        details: 'Using visual contrast, clear typography, and brand templates to craft high-engagement carousels.',
        practicalTask: 'Design a 5-slide educational carousel for an EA/Admin Ops topic using Canva.',
        recommendedTools: ['Canva Pro', 'Unsplash']
      },
      {
        stepNumber: 2,
        title: 'Content Scheduling & Analytics Reporting',
        details: 'Setting optimal posting times for US/Europe/Asia audiences and tracking reach metrics.',
        practicalTask: 'Schedule 7 sample posts in Metricool or Buffer and write a 1-page client performance report.',
        recommendedTools: ['Metricool', 'Buffer', 'Google Sheets']
      }
    ]
  },
  {
    id: 'mod-cs-1',
    title: 'Customer Ticket Triage & Live Chat Empathy',
    roleCategory: 'customer_support',
    duration: '1 Week Self-Paced',
    description: 'Master Zendesk ticket handling, de-escalating unhappy customers, writing concise help articles, and maintaining 98%+ CSAT.',
    skillsLearned: ['Zendesk SLA Management', 'Macro Writing', 'Customer Empathy & De-escalation', 'Live Chat Support'],
    steps: [
      {
        stepNumber: 1,
        title: 'Zendesk Ticket Lifecycle & Macro Writing',
        details: 'Categorizing tickets by urgency and using customized template responses for frequent questions.',
        practicalTask: 'Draft 5 Zendesk response macros for common refund, password reset, and shipping delay queries.',
        recommendedTools: ['Zendesk', 'Intercom', 'Grammarly']
      }
    ]
  },
  {
    id: 'mod-admin-1',
    title: 'Asana Project Tracking & Notion SOP Architecture',
    roleCategory: 'admin_ops',
    duration: '2 Weeks Self-Paced',
    description: 'Learn how to build company operating hubs, write clear standard operating procedures (SOPs), and organize cross-functional sprint boards.',
    skillsLearned: ['Notion Knowledge Base Setup', 'Asana Board Workflows', 'SOP Documentation', 'Loom Video Walkthroughs'],
    steps: [
      {
        stepNumber: 1,
        title: 'Drafting Standard Operating Procedures (SOPs)',
        details: 'Writing step-by-step guides with screenshots and conditional rules so anyone can execute standard business processes.',
        practicalTask: 'Write a 1-page SOP document for client onboarding and create a 2-minute Loom walkthrough.',
        recommendedTools: ['Notion', 'Loom', 'Google Docs']
      }
    ]
  },
  {
    id: 'mod-data-1',
    title: 'B2B Lead List Building & LinkedIn Research',
    roleCategory: 'data_lead_gen',
    duration: '1 Week Self-Paced',
    description: 'Master prospect research, Boolean search strings, contact enrichment, and clean CRM database entry.',
    skillsLearned: ['LinkedIn Boolean Search', 'Lead Scraping & Verification', 'Google Sheets Data Cleansing', 'CRM Data Hygiene'],
    steps: [
      {
        stepNumber: 1,
        title: 'Prospect Discovery & Data Verification',
        details: 'Finding verified decision-makers using targeted industry filters and validating business email domains.',
        practicalTask: 'Build a spreadsheet of 25 verified tech founders with verified LinkedIn URLs and email addresses.',
        recommendedTools: ['LinkedIn Sales Navigator', 'Hunter.io', 'Google Sheets']
      }
    ]
  },
  {
    id: 'mod-creative-1',
    title: 'Brand Visual Assets & Figma Design Basics',
    roleCategory: 'creative_design',
    duration: '2 Weeks Self-Paced',
    description: 'Create high-converting social graphics, pitch deck slides, and marketing banners using modern visual hierarchy rules.',
    skillsLearned: ['Figma Layout Grids', 'Typography & Color Theory', 'Marketing Banner Design', 'Asset Export Optimization'],
    steps: [
      {
        stepNumber: 1,
        title: 'Social Ad Creative Production',
        details: 'Designing responsive banners for Facebook, LinkedIn, and Instagram adhering to brand guidelines.',
        practicalTask: 'Create a cohesive 3-size ad visual set in Figma for a remote SaaS product.',
        recommendedTools: ['Figma', 'Canva Pro', 'Unsplash']
      }
    ]
  },
  {
    id: 'mod-tech-1',
    title: 'WordPress, Webflow & CMS Operations',
    roleCategory: 'tech_web_ops',
    duration: '2 Weeks Self-Paced',
    description: 'Learn basic CMS website updates, publishing SEO blog posts, domain management, and form routing.',
    skillsLearned: ['WordPress Gutenberg Editor', 'Webflow CMS Management', 'Basic On-Page SEO', 'Zapier Automation'],
    steps: [
      {
        stepNumber: 1,
        title: 'Content Publishing & On-Page SEO Checklist',
        details: 'Formatting articles, setting alt tags, crafting meta descriptions, and configuring internal links.',
        practicalTask: 'Format and publish a sample 1,000-word article on a demo WordPress or Webflow site.',
        recommendedTools: ['WordPress', 'Webflow', 'Yoast SEO']
      }
    ]
  },
  {
    id: 'mod-content-1',
    title: 'SEO Article Writing & Email Newsletter Craft',
    roleCategory: 'content_writing',
    duration: '2 Weeks Self-Paced',
    description: 'Write engaging blog posts, B2B thought leadership articles, and weekly subscriber newsletters that retain readers.',
    skillsLearned: ['Headline Copywriting', 'SEO Keyword Integration', 'Email Newsletter Structure', 'Substack/Beehiiv Setup'],
    steps: [
      {
        stepNumber: 1,
        title: 'Crafting High-Converting Email Newsletters',
        details: 'Structuring engaging intros, value-packed body sections, and clear call-to-action buttons.',
        practicalTask: 'Write a 400-word industry roundup newsletter with 3 curated links and a strong opening hook.',
        recommendedTools: ['Substack', 'Grammarly', 'Hemingway App']
      }
    ]
  },
  {
    id: 'mod-ecom-1',
    title: 'Shopify Product Management & Basic Bookkeeping',
    roleCategory: 'ecom_bookkeeping',
    duration: '2 Weeks Self-Paced',
    description: 'Master Shopify catalog management, inventory level tracking, customer order fulfillment, and QuickBooks receipt sorting.',
    skillsLearned: ['Shopify Store Admin', 'Order Fulfillment Workflows', 'Receipt Reconciliation', 'Excel Pivot Tables'],
    steps: [
      {
        stepNumber: 1,
        title: 'Catalog Upload & Variant Configuration',
        details: 'Adding SKUs, uploading product photos, writing descriptions, and setting inventory alerts.',
        practicalTask: 'Set up 5 mock products with 3 variant options each on a Shopify development store.',
        recommendedTools: ['Shopify Admin', 'Excel', 'QuickBooks Online']
      }
    ]
  },
  {
    id: 'mod-comm-1',
    title: 'Discord & Community Moderation Best Practices',
    roleCategory: 'community_mod',
    duration: '1 Week Self-Paced',
    description: 'Learn community rule enforcement, onboarding new members, running engagement events, and handling spam.',
    skillsLearned: ['Discord Server Management', 'Automod Configuration', 'Member Onboarding', 'Conflict De-escalation'],
    steps: [
      {
        stepNumber: 1,
        title: 'Server Moderation & Safety Bots',
        details: 'Configuring bot rules, spam filters, role permissions, and welcoming channels.',
        practicalTask: 'Set up role verification and welcome automation in a sandbox Discord server.',
        recommendedTools: ['Discord', 'MEE6 Bot', 'Carl-bot']
      }
    ]
  },
  {
    id: 'mod-general-1',
    title: 'Universal Remote Work Foundations & Async Etiquette',
    roleCategory: 'general',
    duration: '1 Week Self-Paced',
    description: 'Master asynchronous communication, Slack etiquette, Loom updates, time tracking, and remote security practices.',
    skillsLearned: ['Async Communication Protocols', 'Slack Etiquette', 'Password Managers (1Password/Bitwarden)', 'Time Blocking'],
    steps: [
      {
        stepNumber: 1,
        title: 'Effective Asynchronous Status Updates',
        details: 'Writing daily standups, blocking distractions, and recording concise screen recordings.',
        practicalTask: 'Draft a daily 3-bullet async update and a 60-second video demo for a team lead.',
        recommendedTools: ['Slack', 'Loom', 'Toggl Track']
      }
    ]
  }
];

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app-101',
    jobId: 'job-1',
    jobTitle: 'Junior Remote Executive Assistant (Mentorship Program)',
    company: 'Apex Global Ventures',
    candidateName: 'Ananya Sharma',
    candidateAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    candidateEmail: 'ananya.sharma@example.com',
    coverPitch: 'Hi Sarah! I have completed the RemotoOps Executive Assistant Track and built a multi-timezone calendar SOP. I am eager to contribute 20+ hours/week to Apex Global while learning under your 10+ year executive mentorship!',
    toolExperience: ['Google Workspace', 'Notion', 'Slack', 'Loom'],
    status: 'intro_chat',
    appliedAt: 'Yesterday',
    mentorNotes: 'Excellent pitch and great score on calendar triage module! Intro chat scheduled for Friday.',
    candidateId: 'cand-1'
  }
];
