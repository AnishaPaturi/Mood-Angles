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

async function generateDynamicQuestions(category, count = 20, attempt = 1) {
  if (!process.env.OPENROUTER_API_KEY) {
    return null;
  }
  
  const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
  });
  
  const desc = CATEGORY_DESCRIPTIONS[category] || "mental health symptoms";
  
  const attemptContext = {
    1: "basic screening questions to identify initial symptoms and surface-level concerns",
    2: "intermediate questions probing deeper into symptom patterns, triggers, and impact on daily life",
    3: "advanced questions exploring coping mechanisms, lifestyle factors, and detailed behavioral patterns",
    4: "comprehensive questions addressing personality traits, emotional regulation, and long-term patterns",
    5: "in-depth personality assessment covering all aspects including interpersonal dynamics and self-perception"
  };
  
  const depthInstruction = attemptContext[attempt] || attemptContext[5];

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
        content: `You are a mental health screening questionnaire generator. Generate ${count} clear, concise, self-assessment questions about ${desc}. These should be ${depthInstruction}. Each question must be a single sentence and a plain string. Return ONLY a valid JSON array of ${count} strings. Do NOT include markdown code blocks, explanations, or any text before or after the JSON array.`,
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
    const { dynamic, attempt = 1 } = req.query;
    
    if (dynamic === "true") {
      const questions = await generateDynamicQuestions(category, 20, parseInt(attempt));
      if (questions && questions.length > 0) {
        return res.json({ category, questions, count: questions.length, dynamic: true, attempt: parseInt(attempt) });
      }
    }
    
    const list = await Question.find({ category, active: true })
      .sort({ order: 1 })
      .lean();
    
    if (list.length > 0) {
      const questions = list.map((q) => q.text);
      return res.json({ category, questions, count: questions.length, dynamic: false });
    }
    
    const questions = await generateDynamicQuestions(category, 20, parseInt(attempt));
    if (questions && questions.length > 0) {
      return res.json({ category, questions, count: questions.length, dynamic: true, attempt: parseInt(attempt) });
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
    const { count = 20, attempt = 1 } = req.body;
    
    const questions = await generateDynamicQuestions(category, count, parseInt(attempt));
    if (questions && questions.length > 0) {
      return res.json({ category, questions, count: questions.length, dynamic: true, attempt: parseInt(attempt) });
    }
    
    res.status(500).json({ error: "generation_failed" });
  } catch (err) {
    console.error("Error generating questions:", err);
    res.status(500).json({ error: "internal_server_error", details: err.message });
  }
});

router.get("/:category/attempt-count", async (req, res) => {
  try {
    const { category } = req.params;
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: "userId required" });
    }
    
    const TestResult = (await import("../models/TestResult.js")).default;
    const count = await TestResult.countDocuments({ 
      user: userId, 
      testType: category.charAt(0).toUpperCase() + category.slice(1) 
    });
    
    return res.json({ category, userId, previousAttempts: count, nextAttempt: count + 1 });
  } catch (err) {
    console.error("Error counting attempts:", err);
    res.status(500).json({ error: "internal_server_error", details: err.message });
  }
});

export default router;
