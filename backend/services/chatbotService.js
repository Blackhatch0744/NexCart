const { OpenAI } = require("openai");
const { GoogleGenAI } = require("@google/genai");
const Product = require("../Models/Product");



/**
 * Generates a chat response using either OpenAI or Gemini.
 * @param {Array} messages - Array of { role: 'user' | 'assistant', content: string }
 * @param {string} modelType - 'chatgpt' or 'gemini'
 * @returns {string} - The AI's response text
 */
exports.generateChatResponse = async (messages, modelType = "gemini") => {
  // 1. Fetch available products to inject into context
  const products = await Product.find({}).select("name description price slug").limit(50);
  const productContext = products
    .map((p) => `- ${p.name} ($${p.price}): ${p.description.substring(0, 100)}... (Link: /product/${p.slug})`)
    .join("\n");

  const systemPrompt = `You are a friendly, perceptive shopping assistant for "MiniX", an e-commerce platform.
Your goal is to get to know the user's personality through conversation and then suggest suitable products from our catalog.

Here is the current product catalog you have access to:
${productContext}

Guidelines:
1. Ask engaging, concise questions to understand their style, mood, and personality.
2. Recommend products that actually exist in the list above. Do NOT make up products.
3. Keep your answers brief and formatting beautiful (use markdown bold, italic, and bullet points where useful).
4. If you recommend a product, format it clearly and mention the price.`;

  // 2. Call the appropriate AI model
  if (modelType === "chatgpt") {
    if (!process.env.OPENAI_API_KEY) throw new Error("OpenAI API Key is not configured in environment variables.");
    return await handleOpenAI(systemPrompt, messages);
  } else if (modelType === "gemini") {
    if (!process.env.GEMINI_API_KEY) throw new Error("Gemini API Key is not configured in environment variables.");
    return await handleGemini(systemPrompt, messages);
  } else {
    throw new Error("Invalid model type. Choose 'chatgpt' or 'gemini'.");
  }
};

async function handleOpenAI(systemPrompt, messages) {
  const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const formattedMessages = [
    { role: "system", content: systemPrompt },
    ...messages.map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content,
    })),
  ];

  const response = await openaiClient.chat.completions.create({
    model: "gpt-3.5-turbo", // Or gpt-4o-mini
    messages: formattedMessages,
    temperature: 0.7,
  });

  return response.choices[0].message.content;
}

async function handleGemini(systemPrompt, messages) {
  const geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  // Gemini strictly requires the first message to be from a 'user'.
  // It also dislikes consecutive identical roles. 
  // Let's filter leading assistant messages and ensure valid flow.
  let validMessages = [...messages];
  while (validMessages.length > 0 && validMessages[0].role === "assistant") {
    validMessages.shift();
  }

  const formattedContents = validMessages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const response = await geminiClient.models.generateContent({
    model: "gemini-2.5-flash",
    contents: formattedContents,
    config: {
      systemInstruction: systemPrompt,
      temperature: 0.7,
    },
  });

  return response.text;
}
