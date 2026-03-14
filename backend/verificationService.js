const aiService = require('./aiService');

async function processVerification(data) {
    const { mode, question, aiResponse } = data;
    if (!question || !aiResponse) throw new Error("Missing fields");
    return await aiService.getGeminiAnalysis(mode, question, aiResponse);
}

module.exports = { processVerification };