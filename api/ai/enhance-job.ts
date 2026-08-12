import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getGeminiClient } from '../lib/gemini';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const { title, company, roleType, rawDescription, mentorshipGoals } = req.body || {};
    const ai = getGeminiClient();

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

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.status(200).json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("Error in /api/ai/enhance-job:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "AI service is temporarily unavailable. Please try again.",
    });
  }
}
