// backend/routes/questions.js
import express from "express";
import Question from "../models/Question.js";
import { OpenAI } from "openai";
import dsm5Data from "../data/dsm5_knowledge.json" assert { type: "json" };

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

const CATEGORY_TO_DSM = {
  anxiety: ["gad"],
  depression: ["mdd"],
  adhd: ["adhd"],
  autism: ["asd"],
  bipolar: ["bipolar1", "bipolar2"],
  eq: ["mdd", "gad"],
  mentalhealth: ["mdd", "gad"],
  personality: ["npd", "aspd"],
  neuro: ["mdd", "gad"],
};

function getDSMCriteria(category) {
  const dsmIds = CATEGORY_TO_DSM[category] || [];
  return dsmData.filter(d => dsmIds.includes(d.id));
}

async function generateDynamicQuestions(category, count = 20, attempt = 1, previousQuestions = []) {
  if (!process.env.OPENROUTER_API_KEY) {
    return null;
  }
  
  const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
  });
  
  const desc = CATEGORY_DESCRIPTIONS[category] || "mental health symptoms";
  const dsmCriteria = getDSMCriteria(category);
  
  const attemptInstructions = {
    1: "Basic screening questions covering core DSM-5 diagnostic symptoms. Focus on fundamental symptom identification. Cover at least 3 different symptom domains from the DSM-5 criteria.",
    2: "Intermediate questions exploring symptom frequency, duration, and functional impairment. Ask about triggers and patterns. Focus on different symptoms than attempt 1.",
    3: "Advanced questions about coping mechanisms, symptom severity, and daily life impact. Include situational context. Avoid questions similar to attempts 1 and 2.",
    4: "Comprehensive questions addressing comorbid symptoms, personality factors, and long-term patterns. Ask about relationships and self-perception. Use entirely new symptom angles.",
    5: "In-depth personality and interpersonal assessment. Cover emotional regulation, stress responses, and nuanced behavioral patterns. Focus on advanced diagnostic indicators."
  };
  
  const dsmContext = dsmCriteria.length > 0 
    ? `Use these DSM-5 criteria as reference: ${JSON.stringify(dsmCriteria.map(d => ({ name: d.name, symptoms: d.symptoms })))}`
    : "";
  
  const depthInstruction = attemptInstructions[attempt] || attemptInstructions[5];
  
  const previousQuestionsNote = previousQuestions.length > 0
    ? `\n\nIMPORTANT: Do NOT generate questions similar to these previously asked questions:\n${previousQuestions.slice(0, 30).map((q, i) => `${i + 1}. ${q}`).join("\n")}\nGenerate completely different questions.`
    : "";

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
        content: `You are a mental health screening questionnaire generator. Generate ${count} clear, concise, self-assessment questions about ${desc}. 

${depthInstruction}

${dsmContext}

Each question must:
- Be a single sentence
- Focus on a different aspect than previous questions
- Progress from concrete to abstract concepts
- Be appropriate for attempt level ${attempt}
- Cover unique symptoms from the DSM-5 criteria${previousQuestionsNote}

Return ONLY a valid JSON array of ${count} strings. No markdown, no extra text.`
      }],
      max_tokens: 2000,
      temperature: 0.7,
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
    const { dynamic, attempt = 1, previousQuestions } = req.query;
    
    if (dynamic === "true") {
      const prevQs = previousQuestions ? JSON.parse(previousQuestions) : [];
      const questions = await generateDynamicQuestions(category, 20, parseInt(attempt), prevQs);
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
    
    const questions = await generateDynamicQuestions(category, 20, parseInt(attempt), []);
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
    const { count = 20, attempt = 1, previousQuestions = [] } = req.body;
    
    const questions = await generateDynamicQuestions(category, count, parseInt(attempt), previousQuestions);
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
    
    // Map category to actual test types stored in database
    const testTypeMap = {
      adhd: ["ADHD"],
      depression: ["Depression"],
      anxiety: ["Anxiety (GAD)"],
      bipolar: ["Bipolar Test"],
      autism: ["Autism"],
      eq: ["EQ"],
      personality: ["Personality"],
      neuro: ["Neuro"],
      mentalhealth: ["Mental Health Today"]
    };
    
    const validTestTypes = testTypeMap[category] || [category.charAt(0).toUpperCase() + category.slice(1)];
    
    const count = await TestResult.countDocuments({ 
      user: userId, 
      testType: { $in: validTestTypes }
    });
    
    return res.json({ category, userId, previousAttempts: count, nextAttempt: count + 1 });
  } catch (err) {
    console.error("Error counting attempts:", err);
    res.status(500).json({ error: "internal_server_error", details: err.message });
  }
});

export default router;
