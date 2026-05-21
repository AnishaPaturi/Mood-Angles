// backend/rag/ingest.js
// Chunk text, call OpenAI embeddings, and persist vectors via vectorStore.js

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { upsertChunks, deleteByFilename } from "./vectorStore.js";

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 800,
  chunkOverlap: 150,
});

const embeddings = new OpenAIEmbeddings({
  modelName: "text-embedding-ada-002",
});

/**
 * Ingest a piece of text for a user.
 * @param {string} userId
 * @param {string} text          – raw document text
 * @param {object} metadata      – e.g. { filename, filePath, category }
 * @param {string} conversationId – optional, ties chunks to a chat conversation
 * @returns {Promise<number>}    – number of chunks stored
 */
export async function ingestText(userId, text, metadata, conversationId) {
  if (!text || !userId) return 0;

  const docs = await splitter.splitText(text);
  if (docs.length > 200) docs.length = 200;

  // Batch-embed (OpenAI supports up to 2048 per call)
  const BATCH = 20;
  const allEmbeddings = [];
  for (let i = 0; i < docs.length; i += BATCH) {
    const batch = docs.slice(i, i + BATCH);
    allEmbeddings.push(...(await embeddings.embedDocuments(batch)));
  }

  const chunks = docs.map((content, idx) => ({
    content,
    embedding: allEmbeddings[idx] || [],
    metadata: metadata || {},
  }));

  await upsertChunks({ userId, conversationId, chunks });
  return chunks.length;
}

/**
 * Safe wrapper that never throws – useful in routes where ingestion is
 * best-effort (e.g. file upload succeeded even if RAG indexing failed).
 * @returns {{ stored: number, error: string|null }}
 */
export async function ingestTextSafe(userId, text, metadata, conversationId) {
  try {
    const n = await ingestText(userId, text, metadata, conversationId);
    return { stored: n, error: null };
  } catch (err) {
    console.error("[RAG ingest] error:", err?.message || err);
    return { stored: 0, error: err?.message ?? "unknown" };
  }
}

// Re-export delete helper so uploadRoute can import it from here
export { deleteByFilename };
