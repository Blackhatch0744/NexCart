const express = require("express");
const router = express.Router();
const { generateChatResponse } = require("../services/chatbotService");

/**
 * @route   POST /api/chat/ask
 * @desc    Generate AI chatbot response
 * @access  Public (or could be private if we want to restrict)
 */
router.post("/ask", async (req, res) => {
  try {
    const { messages, modelType } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const aiResponse = await generateChatResponse(messages, modelType);

    res.status(200).json({ reply: aiResponse });
  } catch (error) {
    console.error("Chat API Error:", error.message);
    res.status(500).json({ error: error.message || "Something went wrong communicating with the AI server." });
  }
});

module.exports = router;
