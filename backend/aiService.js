const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getGeminiAnalysis(mode, question, aiResponse) {
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `Analyze if this AI response is a hallucination. 
    Question: ${question} 
    Response: ${aiResponse}
    Return JSON with: status, confidence (0-100), explanation, correct_information, sources.`;

    try {
        const result = await model.generateContent(prompt);
        return JSON.parse(result.response.text());
    } catch (error) {
        console.error("Gemini Error:", error);
        throw new Error("AI Analysis Failed");
    }
}

module.exports = { getGeminiAnalysis };