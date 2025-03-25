const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config(); // Load env variables

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Gemini API Route
app.post("/generate-text", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro-002:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );

    // Checking if response exists
    if (!response.data || !response.data.candidates || response.data.candidates.length === 0) {
      return res.status(500).json({ error: "No response from Gemini API" });
    }

    res.json({ text: response.data.candidates[0].content.parts[0].text });
  } catch (error) {
    console.error("Error:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Internal Server Error", details: error.response?.data || error.message });
  }
});

// Server Listen
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
