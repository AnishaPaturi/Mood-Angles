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
  
  // Map attempt number to its dynamic depth instruction
  const attemptInstructions = {
    1: "Attempt 1 — Basic screening: Identify whether the person experiences each DSM-5 symptom at all. Focus on fundamental symptom identification. Use simple, direct questions. Do NOT explore frequency, severity, or background context yet.",
    2: "Attempt 2 — Intermediate depth: Explore how often each symptom appears and how long it lasts. Ask about triggers, patterns, and how it affects daily life. Do NOT simply rephrase attempt-1 questions — ask entirely new follow-ups.",
    3: "Attempt 3 — Functional & severity: Ask how symptoms impact specific areas of life (school/work/relationships/sleep) and how severe they feel. Include situational context. Do NOT reuse any question from attempts 1 or 2.",
    4: "Attempt 4 — Coping & history: Ask about self-awareness, coping strategies used, length of time symptoms have been present, and whether anyone has noticed changes. Use entirely new angles.",
    5: "Attempt 5 — Personality & interpersonal: Explore emotional regulation style, stress responses, self-perception, and how symptoms interact with personality traits. Focus on advanced diagnostic indicators."
  };
  
  // Build a concrete symptom item list from DSM-5 criteria when available,
  // so the LLM can assign one unique item per question instead of paraphrasing.
  let enumeratedSymptomsNote = "";
  
  if (dsmCriteria.length > 0) {
    const primary = dsmCriteria.find(d => d.id === category);
    const ref = primary || dsmCriteria[0];
    const cri = ref.diagnostic_criteria || {};
    
    // ADHD: use the 9 inattention + 9 hyperactivity items
    if (cri.inattention_items && cri.hyperactivity_items) {
      const allItems = [
        ...cri.inattention_items.map((s, i) => `[I${i+1}] ${s}`),
        ...cri.hyperactivity_items.map((s, i) => `[H${i+1}] ${s}`)
      ];
      enumeratedSymptomsNote = `\nADHD DSM-5 ACRONYM-CODED SYMPTOM LIST (use [I#] or [H#] label at start of every question, one unique item per question — NO repeats across or within attempts):\n${allItems.map(s => `  - ${s}`).join('\n')}`;
    }
    // Depression: use the 9 numbered MDD symptoms
    else if (ref.symptoms && ref.symptoms.length > 0 && ref.id === "mdd") {
      enumeratedSymptomsNote = `\nDSM-5 MDD SYMPTOM LIST (pick one item per question, labelled [S#] — NO repeats across or within attempts):\n${ref.symptoms.map(s => `  - [S${s.number}] ${s.name}: ${s.description}`).join('\n')}`;
    }
    // Anxiety / GAD: use the 6 numbered GAD symptoms
    else if (ref.symptoms && ref.symptoms.length > 0 && (ref.id === "gad" || ref.id === "gapd")) {
      enumeratedSymptomsNote = `\nDSM-5 GAD SYMPTOM LIST (pick one item per question, labelled [S#] — NO repeats across or within attempts):\n${ref.symptoms.map(s => `  - [S${s.number}] ${s.name}: ${s.description}`).join('\n')}`;
    }
    // Bipolar: use the 8 Bipolar I manic criteria
    else if (ref.symptoms && ref.symptoms.length > 0 && ref.id === "bipolar1") {
      enumeratedSymptomsNote = `\nDSM-5 BIPOLAR I MANIC SYMPTOM LIST (pick one item per question, labelled [S#] — NO repeats across or within attempts):\n${ref.symptoms.map(s => `  - [S${s.number}] ${s.name}: ${s.description}`).join('\n')}`;
    }
    // NPD / ASPD: use grandiosity / antisocial criteria arrays
    else if (cri.grandiosity_criteria) {
      enumeratedSymptomsNote = `\nDSM-5 NARCISSISTIC PERSONALITY DISORDER CRITERIA (pick one per question, labelled [S#] — NO repeats):\n${cri.grandiosity_criteria.map((s, i) => `  - [S${i+1}] ${s}`).join('\n')}`;
    }
  }
  
  const dsmContext = dsmCriteria.length > 0 
    ? `Reference DSM-5 criterion name: ${dsmCriteria.map(d => d.name).join(", ")}.${enumeratedSymptomsNote}`
    : "";
  
  const depthInstruction = attemptInstructions[attempt] || attemptInstructions[5];
  
  const previousQuestionsNote = previousQuestions.length > 0
    ? `\n\n=== FORBIDDEN — DO NOT USE THESE EXACT QUESTIONS OR PARAPHRASES ===\n${previousQuestions.slice(0, 30).map((q, i) => `${i + 1}. ${q}`).join("\n")}\n\nIMPORTANT RULES FOR NON-REPETITION:\n- Do NOT use any sentence with the same meaning, structure, or wording as the above questions — even if you paraphrase slightly.\n- Do NOT ask the same symptom twice.\n- If you have been instructed to focus on "symptom X" in a previous attempt, find a completely new symptom from the symptom list above.\n- Generate completely different questions targeting different specific DSM-5 checklist items.`
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
        content: `You are a mental health screening questionnaire generator for ${desc}. Generate exactly ${count} unique, self-assessment questions.

${depthInstruction}

${dsmContext}

=== CRITICAL QUESTION GENERATION RULES ===

1. UNIQUENESS — Each question must target ONE specific symptom item from the DSM-5 symptom list above.
   - If symptom items are listed (e.g. [I1], [H1], [S1] labels), prefix each question with the item label in brackets and ensure every question uses a DIFFERENT item label. Every item in the list must appear at least once before any item appears twice.
   - If no item list is given, each question must explore a distinct symptom dimension — two questions must never ask about the same symptom with only minor rephrasing.

2. PROGRESSION WITHIN THIS SET — Order the ${count} questions from simpler/more direct to more complex/contextual. Early questions = baseline / "do you experience this?" format. Later questions = "how often…", "how severely…", "in what situations…", "what do you do about it…" format.

3. FORMAT — Each question is a single, stand-alone sentence. No introductory text, no markdown, no numbering in the output — the JSON array index provides the number.

4. ANTI-REPETITION ACROSS CALLS —${previousQuestionsNote}

Return ONLY a valid JSON array of ${count} strings. No markdown code fences, no extra text before or after the array.`
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
