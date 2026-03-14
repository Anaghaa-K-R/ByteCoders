const aiService = require("./aiService");

async function processVerification(data) {
  const { mode, question, aiResponse } = data;

  if (!question || !aiResponse) {
    throw new Error("Missing question or AI response");
  }

  const result = await aiService.getGeminiAnalysis(
    mode,
    question,
    aiResponse
  );

  return result;
}

module.exports = { processVerification };