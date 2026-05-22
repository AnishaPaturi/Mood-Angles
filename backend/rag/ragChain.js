// backend/rag/ragChain.js
import { OpenAIEmbeddings } from "@langchain/openai";
import { similaritySearch } from "./vectorStore.js";

const embeddings = new OpenAIEmbeddings({
  modelName: "text-embedding-ada-002",
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
    },
  },
});

const SYSTEM_PROMPT = `You are Luna, a compassionate mental health assistant trained in evidence-based support techniques. You provide emotional support, coping strategies, and mental health resources. You are NOT a licensed therapist, but you can offer guidance and encouragement. Always respond with empathy and validate the user's feelings.

CONTEXT FROM USER'S DOCUMENTS:
{context}

Guidelines:
- Be empathetic and non-judgmental
- Validate emotions without dismissing them
- Suggest breathing exercises, grounding techniques, or self-care when appropriate
- Encourage professional help for serious concerns
- Never give medical advice or diagnose conditions
- If test results are provided in context, interpret the score and level accurately:
  * Explain what the score indicates in plain terms
  * Mention which symptoms from the DSM-5 criteria are likely present
  * Discuss severity level and what it means for daily life
  * Suggest next steps without prescribing treatment
- Keep responses concise (2-3 sentences max for general chat, longer for diagnosis interpretation)
- If the context above is relevant, lightly reference it naturally without sounding robotic. Otherwise, ignore it and respond normally.`;

/**
 * Retrieve top-k context chunks for this user's latest question.
 * Falls back gracefully if embedding lookup fails.
 */
async function getContext({ userId, question }) {
  try {
    if (!userId || !question) return [];
    const qEmb = await embeddings.embedQuery(question);
    return await similaritySearch({ userId, queryEmbedding: qEmb, topK: 4 });
  } catch (err) {
    console.warn("[RAG] retrieval failed:", err?.message);
    return [];
  }
}

/** Format retrieved documents into the {context} placeholder string. */
function formatContext(results) {
  if (!results.length) return "(no relevant documents found)";
  return results.map((r, i) => `[${i + 1}] ${r.pageContent.trim()}`).join("\n\n");
}

/** Build the messages array passed to OpenRouter. */
function buildMessages(question, history, context, systemPrompt) {
  const effectiveSystem = systemPrompt.replace("{context}", formatContext(context));
  return [
    { role: "system", content: effectiveSystem },
    ...history.map(function (h) {
      return {
        role:   h.sender === "user"      ? "user"   :
                h.sender === "assistant"  ? "assistant" : "system",
        content: h.text,
      };
    }),
    { role: "user", content: question },
  ];
}

export { getContext, formatContext, buildMessages, SYSTEM_PROMPT };
