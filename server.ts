/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of Gemini client to prevent crash on startup if key is missing
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (aiClient) return aiClient;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    console.warn("WARN: GEMINI_API_KEY is not configured or holds a placeholder. Falling back to rule-based responses.");
    return null;
  }
  try {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    return aiClient;
  } catch (error) {
    console.error("Error creating GoogleGenAI client:", error);
    return null;
  }
}

// ============== API ENDPOINTS ==============

// 1. AI Chatbot endpoint
app.post("/api/chat", async (req, res) => {
  const { messages, selectedProductContext } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required." });
  }

  const ai = getGeminiClient();
  const lastUserMessage = messages[messages.length - 1]?.text || "";

  // Elegant fallback response when Gemini is not configured
  if (!ai) {
    let fallbackText = "Our master jeweler is delighted. How else can we assist you with materials or custom ring sizing today?";
    const msgLower = lastUserMessage.toLowerCase();
    
    if (msgLower.includes("emerald") || msgLower.includes("ring")) {
      fallbackText = "Emeralds are symbolic of hope and renewal. Elena and Aurelius use only untreated natural green emeralds from ethical mines. They are paired marvelously with 18k premium gold on Solid sterling silver.";
    } else if (msgLower.includes("sapphire") || msgLower.includes("necklace")) {
      fallbackText = "Our pear-cut Ceylon Sapphire droplet necklace represents deep wisdom and royalty. It hangs beautifully on our hand-twisted sterling silver chain.";
    } else if (msgLower.includes("price") || msgLower.includes("shipping") || msgLower.includes("return")) {
      fallbackText = "We offer complimentary artisan-packaged shipping worldwide (takes 2-4 business days once crafted) and hassle-free returns within 30 days of arrival.";
    } else if (msgLower.includes("gold") || msgLower.includes("silver") || msgLower.includes("plat")) {
      fallbackText = "ArtisanGems features only standard 925 Sterling Silver, 14k/18k Yellow and Rose Gold Plating, and conflict-free natural gemstones. Custom alloys are available on direct request!";
    }
    return res.json({ text: fallbackText, isAIFallback: true });
  }

  try {
    // Format system instruction and chat prompt
    let systemPrompt = "You are a highly sophisticated, polite, and refined Tiffany-grade senior concierge stylist at 'ArtisanGems'. " +
      "You guide users with style advisory, gemology knowledge, ring sizing tips, and jewelry care instructions. " +
      "Keep answers clean, aesthetic, helpful, and luxury focused. Avoid bullet spam, keep paragraphs elegant and well-formatted. " +
      "Refer to mock precious metals (925 sterling silver, 18k gold plate) and ethical gems (emerald, sapphire, amethyst, rose quartz, turquoise).";

    if (selectedProductContext) {
      systemPrompt += ` The customer is currently viewing the item: ${JSON.stringify(selectedProductContext)}`;
    }

    // Format chat history into Gemini contents
    const promptContents = messages.map(m => {
      return {
        role: m.sender === "user" ? "user" as const : "model" as const,
        parts: [{ text: m.text }]
      };
    });

    // Make sure we have a user prompt
    if (promptContents.length === 0) {
      promptContents.push({
        role: "user" as const,
        parts: [{ text: "Hello!" }]
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptContents.map(c => ({ role: c.role, parts: c.parts })),
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text || "Thank you for visiting ArtisanGems. Your search for exquisite design starts here." });
  } catch (error: any) {
    console.error("Gemini API Error in /api/chat:", error);
    res.status(500).json({ error: "Failed to generate AI response: " + error.message });
  }
});

// 2. AI Recommendation Optimizer (matching earrings, custom advice)
app.post("/api/ai-recommend", async (req, res) => {
  const { purchaseHistory, selectedProduct, budget } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    // Elegant fallback recommendations
    return res.json({
      recommendationText: `Based on your luxury selection, we highly recommend purchasing coordinating Emerald / Sapphire earrings that accentuate the vibrant green or deep blue tones.`,
      matchingPointers: [
        "Aurelia Celestial Emerald Ring couples beautifully with Petal Filigree Rose Quartz Earrings.",
        "Ceylon Sapphire Necklace couples gorgeously with Monarch Amethyst Crown Pendant."
      ]
    });
  }

  try {
    const prompt = `Classify this user request and return matching artisan style recommendations.
    Product being viewed: ${JSON.stringify(selectedProduct || "None")}
    User purchase history: ${JSON.stringify(purchaseHistory || "None")}
    Budget limit if specified: ${budget || "Unlimited"}
    Provide a luxurious recommendation summary in 2 sentences. Then list three specific suggestions of coordinating styling principles (e.g. 'Match cooler silver chains with deep sapphire tones', 'Stack gold rings to create a bento-style statement').`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert Tiffany-grade style curator. Keep responses brief, luxury-toned, and directly focused on gemstone and metallic coordination.",
        temperature: 0.5,
      }
    });

    res.json({ recommendationText: response.text });
  } catch (err: any) {
    console.error("AI recommendation error:", err);
    res.json({ recommendationText: "Pair emeralds with soft gold lines, and highlight sapphires with shimmering silver frames." });
  }
});

// 3. AI Smart autocomplete search concepts
app.get("/api/ai-suggest-search", async (req, res) => {
  const q = req.query.q || "";
  const ai = getGeminiClient();

  if (!ai || !q) {
    // Default smart tags
    return res.json({
      suggestions: [
        "Handcrafted emerald engagement rings",
        "18k Gold filigree vintage earrings",
        "Ceylon sapphire teardrop necklaces",
        "Hammered sterling silver unisex bands"
      ]
    });
  }

  try {
    const prompt = `The customer is typing: '${q}' in the jewelry search. Generate exactly 4 luxury-level artisan search suggestions or tags (e.g. 'Ethical green emerald cuffs', 'Boho turquoise beach anklets'). Format them as a simple JSON string array. Do not include markdown code block syntax. Just a raw JSON string.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.3,
      }
    });

    const text = response.text ? response.text.trim() : "[]";
    const suggestions = JSON.parse(text);
    res.json({ suggestions });
  } catch (err) {
    console.error("Search suggestion error:", err);
    res.json({
      suggestions: [
        `${q} emerald rings`,
        `${q} custom necklaces`,
        `${q} gold-plated jewelry`,
        `${q} silver artisan masterpieces`
      ]
    });
  }
});

// ============== VITE FRONTEND SERVICE SETUP ==============

async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ArtisanGems Application Server is operating perfectly at http://localhost:${PORT}`);
  });
}

start();
