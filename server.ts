import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Google Genius AI
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required. Please set it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Decision Endpoint
app.post("/api/decide", async (req, res) => {
  try {
    const { question, context, options, importance } = req.body;

    if (!question || typeof question !== "string" || !question.trim()) {
      return res.status(400).json({ error: "Please provide a valid decision question." });
    }

    const ai = getAi();
    const hasOptions = options && Array.isArray(options) && options.length >= 2;
    const optionsInstruction = hasOptions
      ? `Compare these specific pre-defined options: ${options.join(', ')}`
      : `Compare the logical options. Since no list of options was provided, you MUST identify and extract exactly 2 to 5 logical, concise options/candidates to compare directly from the user's main question and context (e.g. if the question is "Should I buy a cargo e-bike or a second compact car?", the options to compare should be ["Cargo E-Bike", "Compact Car"]).`;

    const prompt = `
      Analyze this tough decision using multiple strategic frameworks: Pros & Cons, active Comparison Matrix, SWOT Analysis, and provide an absolute wise 'Tiebreaker Verdict'.
      
      Main Question: ${question}
      Importance: ${importance || '3'}/5 (where 5 is life-altering, 1 is trivial)
      Context details: ${context || 'None provided'}
      
      ${optionsInstruction}
      
      Requirements for the output structure:
      1. Define the 'options' field at the JSON root, which contains the list of 2 to 5 compared options (whether provided as-is or dynamically extracted by you).
      2. For all nested properties that require an 'optionName' (e.g., prosCons, comparisonMatrix ratings, verdict's winningOption), the optionName values MUST match EXACTLY with string entries defined in the root 'options' array.
      3. For comparisonMatrix ratings, provide ratings out of 10 for ALL options defined in your 'options' array.
      
      Please return a highly structured objective analysis in JSON format aligning with the schema. Be direct, balanced, insightful, and act as a wise objective decision consultant.
    `;

    // Prompt Gemini 3.5 Flash
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "The list of 2 to 5 compared options, either provided or extracted from the user's dilemma."
            },
            prosCons: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  optionName: { type: Type.STRING },
                  type: { type: Type.STRING, description: "Must be 'pro' or 'con'" },
                  factor: { type: Type.STRING, description: "Short heading of the pro/con" },
                  weight: { type: Type.STRING, description: "Must be 'High', 'Medium', or 'Low'" },
                  explanation: { type: Type.STRING, description: "Brief explanation of this pro/con" }
                },
                required: ["optionName", "type", "factor", "weight", "explanation"]
              }
            },
            comparisonMatrix: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  criterion: { type: Type.STRING, description: "Comparing aspect, e.g., 'Cost', 'Worry Factor', 'Long-term Benefit'" },
                  ratings: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        optionName: { type: Type.STRING },
                        rating: { type: Type.INTEGER, description: "Grade score from 1 (terrible) to 10 (perfect)" },
                        comment: { type: Type.STRING, description: "Brief justifying feedback for this rating" }
                      },
                      required: ["optionName", "rating", "comment"]
                    }
                  }
                },
                required: ["criterion", "ratings"]
              }
            },
            swotAnalysis: {
              type: Type.OBJECT,
              properties: {
                strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Internal strengths of making this decision or going with the winning option" },
                weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Internal weaknesses or limitations" },
                opportunities: { type: Type.ARRAY, items: { type: Type.STRING }, description: "External growth or opportunities unlocked" },
                threats: { type: Type.ARRAY, items: { type: Type.STRING }, description: "External risks or threats" }
              },
              required: ["strengths", "weaknesses", "opportunities", "threats"]
            },
            verdict: {
              type: Type.OBJECT,
              properties: {
                winningOption: { type: Type.STRING, description: "The recommended option from the listed options" },
                confidenceScore: { type: Type.INTEGER, description: "Confidence score from 0 to 100" },
                rationale: { type: Type.STRING, description: "A detailed but highly compelling reason for selecting this option as the tiebreaker champion" },
                nextSteps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 immediate action items the user can take right now" }
              },
              required: ["winningOption", "confidenceScore", "rationale", "nextSteps"]
            }
          },
          required: ["title", "summary", "options", "prosCons", "comparisonMatrix", "swotAnalysis", "verdict"]
        }
      }
    });

    const outputText = response.text || "{}";
    const data = JSON.parse(outputText);
    return res.json(data);
  } catch (error: any) {
    console.error("Error analyzing decision:", error);
    return res.status(500).json({ error: error.message || "An unexpected error occurred while analyzing the decision." });
  }
});

// Configure Vite or Static Assets
async function startServer() {
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
    console.log(`The Tiebreaker server is active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
