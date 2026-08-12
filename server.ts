import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { generateGeminiJson, GeminiParseError } from "./api/lib/gemini";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "RemotoOps API" });
});

// AI Endpoint 1: Enhance Client Job Listing for Mentorship-Driven Internships
app.post("/api/ai/enhance-job", async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const { title, company, roleType, rawDescription, mentorshipGoals } = req.body || {};

    const prompt = `You are a remote workplace expert and mentorship architect specializing in Executive Assistant, Administrative Operations, and Social Media Management roles.
Enhance and structure this job posting for a mentorship-driven remote internship for entry-level professionals.

Inputs:
- Role Title: ${title || "Remote Assistant"}
- Company/Client: ${company || "Global Client"}
- Role Category: ${roleType || "Executive Assistant"}
- Raw Overview: ${rawDescription || "Assisting daily operations and social channels"}
- Mentorship/Learning Focus: ${mentorshipGoals || "Hands-on experience with real tools and live tasks"}

Please return a detailed JSON response matching this schema:
{
  "enhancedTitle": "string",
  "summary": "string (2-3 engaging sentences)",
  "mentorshipHighlights": ["string", "string", "string"],
  "weeklyRoadmap": [
    { "week": "Week 1-2", "focus": "string", "deliverables": "string" },
    { "week": "Week 3-4", "focus": "string", "deliverables": "string" },
    { "week": "Month 2+", "focus": "string", "deliverables": "string" }
  ],
  "toolStack": ["string", "string"],
  "idealCandidateProfile": "string",
  "interviewTipForApplicants": "string"
}`;

    const data = await generateGeminiJson(prompt);
    res.json({ success: true, data });
  } catch (error: any) {
    console.error("Error in /api/ai/enhance-job:", error);

    if (error instanceof GeminiParseError || error?.name === 'GeminiParseError') {
      return res.status(502).json({
        success: false,
        error: "Gemini returned an invalid response.",
      });
    }

    res.status(500).json({
      success: false,
      error: "AI service is temporarily unavailable.",
    });
  }
});

// AI Endpoint 2: Pitch & Cover Letter Feedback for Entry-Level Applicants
app.post("/api/ai/analyze-pitch", async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const { targetRole, userBackground, userPitch, toolExperience } = req.body || {};

    const prompt = `You are an executive hiring manager and remote operations mentor evaluating a candidate's pitch/application for an entry-level/internship remote role.

Candidate Target Role: ${targetRole || "Executive Assistant"}
Candidate Background/Education: ${userBackground || "No prior formal work experience"}
Key Tool Familiarity: ${toolExperience || "Google Calendar, Notion, Slack, Canva"}
Candidate Draft Pitch: "${userPitch || ""}"

Analyze their pitch and provide constructive coaching to help them land a mentorship-driven remote role.
Return JSON matching this schema:
{
  "score": number (0 to 100 based on enthusiasm, clarity, and remote readiness),
  "strengths": ["string", "string"],
  "improvementAreas": ["string", "string"],
  "rewrittenPitch": "string (a compelling, professional, confident 3-paragraph application pitch showcasing eagerness to learn, accountability, and timezone flexibility)",
  "recommendedSkillBadge": "string"
}`;

    const data = await generateGeminiJson(prompt);
    res.json({ success: true, data });
  } catch (error: any) {
    console.error("Error in /api/ai/analyze-pitch:", error);

    if (error instanceof GeminiParseError || error?.name === 'GeminiParseError') {
      return res.status(502).json({
        success: false,
        error: "Gemini returned an invalid response.",
      });
    }

    res.status(500).json({
      success: false,
      error: "AI service is temporarily unavailable.",
    });
  }
});

// AI Endpoint 3: Interactive Interview Prep Simulation
app.post("/api/ai/interview-prep", async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const { roleType, experienceLevel } = req.body || {};

    const prompt = `Generate a set of 3 scenario-based interview questions and structured STAR answer frameworks specifically for a remote ${roleType || "Executive Assistant"} (${experienceLevel || "Entry-level/Mentorship Candidate"}).

Focus on real-world remote challenges:
- For EA/Admin Ops: Timezone overlaps, calendar conflicts, email triage, confidential document handling, async updates.
- For Social Media Manager: Content calendar execution, engagement strategies, dealing with viral comments, tool management (Canva, Buffer, Metricool).

Return JSON matching this schema:
{
  "role": "string",
  "questions": [
    {
      "id": "q1",
      "question": "string",
      "whatInterviewerIsLookingFor": "string",
      "starTemplate": {
        "situation": "string",
        "task": "string",
        "action": "string",
        "result": "string"
      },
      "proTip": "string"
    }
  ]
}`;

    const data = await generateGeminiJson(prompt);
    res.json({ success: true, data });
  } catch (error: any) {
    console.error("Error in /api/ai/interview-prep:", error);

    if (error instanceof GeminiParseError || error?.name === 'GeminiParseError') {
      return res.status(502).json({
        success: false,
        error: "Gemini returned an invalid response.",
      });
    }

    res.status(500).json({
      success: false,
      error: "AI service is temporarily unavailable.",
    });
  }
});

async function startServer() {
  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`RemotoOps server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
