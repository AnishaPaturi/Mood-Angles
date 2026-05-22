// backend/rag/vectorStore.js
// Thin wrapper that lets the rest of the RAG code talk to "a vector store"
// without caring whether it's in-memory or MongoDB-backed.
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import DocumentChunk from "../models/DocumentChunk.js";

/* ─────────────────────────── helpers ─────────────────────────── */

/** Cosine similarity between two vectors */
function cosineSim(a, b) {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot    += a[i] * b[i];
    magA   += a[i] * a[i];
    magB   += b[i] * b[i];
  }
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

/* ────────────────────── public interface ────────────────────── */

/**
 * Upsert a batch of {content, embedding, metadata} records for a given userId.
 * Best-effort: succeeds if at least one record is inserted.
 */
export async function upsertChunks({ userId, conversationId, chunks }) {
  if (!chunks?.length) return;
  const records = chunks.map((c, i) => ({
    userId: String(userId),
    conversationId: conversationId ?? null,
    chunkIndex: i,
    content: c.content,
    embedding: c.embedding ?? [],
    metadata: c.metadata ?? {},
    createdAt: new Date(),
  }));

  const results = await Promise.allSettled(records.map(r => DocumentChunk.create(r)));
  const ok     = results.filter(r => r.status === "fulfilled").length;
  if (ok === 0) throw new Error("No document chunks could be saved");
}

/**
 * Delete all chunks belonging to a particular file (identified by its filename).
 */
export async function deleteByFilename(userId, filename) {
  await DocumentChunk.deleteMany({ userId, "metadata.filename": filename });
}

/**
 * Delete all chunks for a given conversation.
 */
export async function deleteByConversationId(userId, conversationId) {
  await DocumentChunk.deleteMany({ userId, conversationId });
}

/**
 * Find the most similar chunks to a query embedding among this user's
 * documents. Returns up to `topK` documents sorted by similarity desc.
 */
export async function similaritySearch({ userId, queryEmbedding, topK = 4 }) {
  if (!queryEmbedding?.length) return [];

  const docs = await DocumentChunk.find({ userId }).lean();

  const scored = docs
    .filter(d => Array.isArray(d.embedding) && d.embedding.length > 0)
    .map(d => ({ doc: d, score: cosineSim(queryEmbedding, d.embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(s => ({ pageContent: s.doc.content, metadata: s.doc.metadata, score: s.score }));

  return scored;
}
