const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getGeminiAnalysis(mode, question, aiResponse) {
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `You are a strict Fact-Checker. 
Analyze the following for "Hallucinations" (false info).
User Question: "${question}"
AI Claim: "${aiResponse}"

RULES:
1. If the claim is scientifically or historically impossible (like a President of the Moon), the status MUST be "Hallucination" and confidence MUST be 0-10%.
2. Provide the "correct_information" based on real-world facts.
3. Return ONLY a JSON object:
{
  "status": "Hallucination" or "Verified",
  "confidence": number,
  "explanation": "why",
  "correct_information": "the truth",
  "sources": ["source1", "source2"]
}`;
    try {
        const result = await model.generateContent(prompt);
        return JSON.parse(result.response.text());
    } catch (error) {
        console.error("Gemini Error:", error);
        throw new Error("AI Analysis Failed");
    }
}

module.exports = { getGeminiAnalysis };