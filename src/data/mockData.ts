import { JobPost, CandidateProfile, FeedPost, Application, MentorshipModule } from '../types';

export const INITIAL_JOBS: JobPost[] = [];

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
    authorTitle: 'Chief of Staff @ Horizon Scale | Verified Client & EA Mentor',
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

export const INITIAL_APPLICATIONS: Application[] = [];
