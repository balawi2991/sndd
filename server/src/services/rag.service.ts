import { prisma } from '../lib/prisma.js';
import { generateEmbedding } from '../lib/openai.js';

interface RetrievalResult {
  content: string;
  source: {
    title: string;
    url?: string;
  };
  similarity: number;
}

/**
 * Split text into chunks for embedding
 */
export function chunkText(text: string, chunkSize = 500, overlap = 50): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    start = end - overlap;
  }

  return chunks.filter(c => c.trim().length > 0);
}

/**
 * Index a training material (create embeddings for chunks)
 */
export async function indexMaterial(materialId: string): Promise<void> {
  try {
    const material = await prisma.trainingMaterial.findUnique({
      where: { id: materialId },
    });

    if (!material) {
      throw new Error('Material not found');
    }

    // Update status to processing
    await prisma.trainingMaterial.update({
      where: { id: materialId },
      data: { status: 'PROCESSING' },
    });

    // Delete existing chunks
    await prisma.chunk.deleteMany({
      where: { materialId },
    });

    // Split content into chunks
    const chunks = chunkText(material.content);

    // Generate embeddings for each chunk
    for (const chunkContent of chunks) {
      const embedding = await generateEmbedding(chunkContent);

      // Store chunk with embedding
      await prisma.$executeRaw`
        INSERT INTO chunks (id, "materialId", content, embedding, metadata, "createdAt")
        VALUES (
          gen_random_uuid()::text,
          ${materialId},
          ${chunkContent},
          ${JSON.stringify(embedding)}::vector,
          '{}'::jsonb,
          NOW()
        )
      `;
    }

    // Update material status
    await prisma.trainingMaterial.update({
      where: { id: materialId },
      data: {
        status: 'TRAINED',
        lastTrained: new Date(),
      },
    });

    console.log(`✅ Indexed material ${materialId} with ${chunks.length} chunks`);
  } catch (error) {
    console.error('Error indexing material:', error);
    
    await prisma.trainingMaterial.update({
      where: { id: materialId },
      data: { status: 'FAILED' },
    });

    throw error;
  }
}

/**
 * Retrieve relevant chunks for a query
 */
export async function retrieveContext(
  query: string,
  botId: string,
  topK = 5
): Promise<RetrievalResult[]> {
  try {
    // Generate embedding for query
    const queryEmbedding = await generateEmbedding(query);

    // Find similar chunks using cosine similarity
    const results = await prisma.$queryRaw<Array<{
      content: string;
      title: string;
      source: string | null;
      similarity: number;
    }>>`
      SELECT 
        c.content,
        tm.title,
        tm.source,
        1 - (c.embedding <=> ${JSON.stringify(queryEmbedding)}::vector) as similarity
      FROM chunks c
      JOIN training_materials tm ON c."materialId" = tm.id
      WHERE tm."botId" = ${botId}
        AND tm.status = 'TRAINED'
      ORDER BY c.embedding <=> ${JSON.stringify(queryEmbedding)}::vector
      LIMIT ${topK}
    `;

    return results.map(r => ({
      content: r.content,
      source: {
        title: r.title,
        url: r.source || undefined,
      },
      similarity: r.similarity,
    }));
  } catch (error) {
    console.error('Error retrieving context:', error);
    return [];
  }
}

/**
 * Format retrieved context for LLM
 */
export function formatContext(results: RetrievalResult[]): string {
  if (results.length === 0) {
    return '';
  }

  const contextParts = results.map((r, i) => 
    `[${i + 1}] ${r.content}\nSource: ${r.source.title}`
  );

  return `Context from knowledge base:\n\n${contextParts.join('\n\n')}`;
}

/**
 * Extract unique sources from retrieval results
 */
export function extractSources(results: RetrievalResult[]): Array<{ title: string; url?: string }> {
  const uniqueSources = new Map<string, { title: string; url?: string }>();

  for (const result of results) {
    const key = result.source.title;
    if (!uniqueSources.has(key)) {
      uniqueSources.set(key, result.source);
    }
  }

  return Array.from(uniqueSources.values());
}
