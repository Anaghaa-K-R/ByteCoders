const express = require("express");
const cors = require("cors");
require("dotenv").config();

const verificationService = require("./verificationService");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/verify", async (req, res) => {
  try {
    const result = await verificationService.processVerification(req.body);
    res.json(result);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({
      status: "Error",
      confidence: 0,
      explanation: "Verification failed",
      correct_information: "",
      sources: []
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 TrustGuard Backend running at http://localhost:${PORT}`);
});