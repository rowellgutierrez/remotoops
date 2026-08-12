import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateGeminiJson, GeminiParseError } from '../lib/gemini.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const body = req.body || {};
    const { targetRole, userBackground, userPitch, toolExperience } = body;

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
    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    console.error("Error in /api/ai/analyze-pitch:", error);

    if (error instanceof GeminiParseError || error?.name === 'GeminiParseError') {
      return res.status(502).json({
        success: false,
        error: "Gemini returned an invalid response.",
      });
    }

    return res.status(500).json({
      success: false,
      error: "AI service is temporarily unavailable.",
    });
  }
}

