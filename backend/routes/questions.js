// backend/routes/questions.js
import express from "express";
import Question from "../models/Question.js";
import { OpenAI } from "openai";

const router = express.Router();

const CATEGORY_DESCRIPTIONS = {
  anxiety: "anxiety symptoms and experiences",
  depression: "depressive symptoms and feelings",
  adhd: "ADHD traits and behaviors",
  autism: "autism spectrum traits and experiences",
  bipolar: "bipolar disorder symptoms and mood patterns",
  eq: "emotional intelligence and regulation",
  mentalhealth: "general mental health and wellbeing",
  personality: "personality traits and behavioral patterns",
  neuro: "neuroticism and emotional stability",
};

async function generateDynamicQuestions(category, count = 20) {
  if (!process.env.OPENROUTER_API_KEY) {
    return null;
  }
  
  const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
  });
  
  const desc = CATEGORY_DESCRIPTIONS[category] || "mental health symptoms";

  function cleanJsonResponse(raw) {
    let text = String(raw).trim();
    if (text.startsWith("```")) {
      const fence = text.match(/```(?:json)?\s*\n([\s\S]*?)```/);
      text = fence ? fence[1].trim() : text.replace(/^```\w*\s?\n/, "").replace(/\n```$/, "").trim();
    }
    return text;
  }

  try {
    const response = await client.chat.completions.create({
      model: process.env.LLM_MODEL || "openrouter/free",
      messages: [{
        role: "system",
        content: `You are a mental health screening questionnaire generator. Generate ${count} clear, concise, self-assessment questions about ${desc}. Each question must be a single sentence and a plain string. Return ONLY a valid JSON array of ${count} strings. Do NOT include markdown code blocks, explanations, or any text before or after the JSON array.`,
      }],
      max_tokens: 2000,
      temperature: 0.3,
    });

    const rawContent = response.choices[0].message.content || "[]";
    const cleaned = cleanJsonResponse(rawContent);
    const questions = JSON.parse(cleaned);
    return Array.isArray(questions) ? questions : [];
  } catch (e) {
    console.error("Dynamic question generation failed:", e.message);
    return null;
  }
}

router.get("/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const { dynamic } = req.query;
    
    if (dynamic === "true") {
      const questions = await generateDynamicQuestions(category);
      if (questions && questions.length > 0) {
        return res.json({ category, questions, count: questions.length, dynamic: true });
      }
    }
    
    const list = await Question.find({ category, active: true })
      .sort({ order: 1 })
      .lean();
    
    if (list.length > 0) {
      const questions = list.map((q) => q.text);
      return res.json({ category, questions, count: questions.length, dynamic: false });
    }
    
    const questions = await generateDynamicQuestions(category);
    if (questions && questions.length > 0) {
      return res.json({ category, questions, count: questions.length, dynamic: true });
    }
    
    res.status(404).json({ error: "no_questions_found", category });
  } catch (err) {
    console.error("Error fetching questions:", err);
    res.status(500).json({ error: "internal_server_error", details: err.message });
  }
});

router.post("/:category/generate", async (req, res) => {
  try {
    const { category } = req.params;
    const { count = 20 } = req.body;
    
    const questions = await generateDynamicQuestions(category, count);
    if (questions && questions.length > 0) {
      return res.json({ category, questions, count: questions.length, dynamic: true });
    }
    
    res.status(500).json({ error: "generation_failed" });
  } catch (err) {
    console.error("Error generating questions:", err);
    res.status(500).json({ error: "internal_server_error", details: err.message });
  }
});

export default router;
