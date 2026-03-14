const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getGeminiAnalysis(mode, question, aiResponse) {

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash"
  });

  const prompt = `
You are TrustGuard AI, a system designed to detect hallucinations in AI responses.

Analyze the following.

Mode: ${mode}

User Question:
${question}

AI Response:
${aiResponse}

Tasks:
1. Determine if the AI response correctly answers the question.
2. If the question is impossible (example: "Who is the president of the moon"), mark it as hallucination.
3. Do NOT introduce unrelated topics.
4. Stay strictly focused on the question.
5. Provide corrected information if the answer is wrong.

Return ONLY valid JSON in this format:

{
"status": "Verified or Hallucination",
"confidence": number between 0 and 100,
"explanation": "short explanation",
"correct_information": "correct answer if needed",
"sources": ["reliable source"]
}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    try {
      return JSON.parse(text);
    } catch {
      return {
        status: "Uncertain",
        confidence: 50,
        explanation: text,
        correct_information: "",
        sources: []
      };
    }

  } catch (error) {
    console.error("Gemini Error:", error);

    return {
      status: "Error",
      confidence: 0,
      explanation: "Gemini API failed",
      correct_information: "",
      sources: []
    };
  }
}

module.exports = { getGeminiAnalysis };