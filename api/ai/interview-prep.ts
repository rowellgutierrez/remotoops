import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getGeminiClient } from '../lib/gemini';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const { roleType, experienceLevel } = req.body || {};
    const ai = getGeminiClient();

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
    console.error("Error in /api/ai/interview-prep:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "AI service is temporarily unavailable. Please try again.",
    });
  }
}
