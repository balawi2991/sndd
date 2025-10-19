import TrainingMaterial from '../models/TrainingMaterial.model';

interface Source {
  title: string;
  url?: string;
  materialId: string;
  chunk: string;
}

// Simple text chunking
const chunkText = (text: string, chunkSize = 500): string[] => {
  const chunks: string[] = [];
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  
  let currentChunk = '';
  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > chunkSize && currentChunk) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += sentence;
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
};

// Simple keyword-based retrieval (placeholder for vector search)
const simpleRetrieval = (query: string, materials: any[]): Source[] => {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 3);
  
  const results: Array<{ source: Source; score: number }> = [];
  
  for (const material of materials) {
    const contentLower = material.content.toLowerCase();
    let score = 0;
    
    // Score based on keyword matches
    for (const word of queryWords) {
      const matches = (contentLower.match(new RegExp(word, 'g')) || []).length;
      score += matches;
    }
    
    if (score > 0) {
      // Get relevant chunk
      const chunks = chunkText(material.content);
      let bestChunk = chunks[0];
      let bestChunkScore = 0;
      
      for (const chunk of chunks) {
        const chunkLower = chunk.toLowerCase();
        let chunkScore = 0;
        for (const word of queryWords) {
          if (chunkLower.includes(word)) chunkScore++;
        }
        if (chunkScore > bestChunkScore) {
          bestChunkScore = chunkScore;
          bestChunk = chunk;
        }
      }
      
      results.push({
        source: {
          title: material.title,
          url: material.metadata?.url || material.source,
          materialId: material._id.toString(),
          chunk: bestChunk,
        },
        score,
      });
    }
  }
  
  // Sort by score and return top 3
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(r => r.source);
};

export const retrieveContext = async (
  userId: string,
  query: string
): Promise<{ context: string; sources: Source[] }> => {
  try {
    // Get all trained materials for user
    const materials = await TrainingMaterial.find({
      userId,
      status: 'trained',
    }).lean();

    if (materials.length === 0) {
      return {
        context: '',
        sources: [],
      };
    }

    // Retrieve relevant sources
    const sources = simpleRetrieval(query, materials);

    // Build context from sources
    const context = sources
      .map((s, i) => `[Source ${i + 1}: ${s.title}]\n${s.chunk}`)
      .join('\n\n');

    return { context, sources };
  } catch (error) {
    console.error('RAG retrieval error:', error);
    return { context: '', sources: [] };
  }
};

export const indexMaterial = async (materialId: string): Promise<void> => {
  try {
    const material = await TrainingMaterial.findById(materialId);
    if (!material) return;

    material.status = 'training';
    await material.save();

    // Chunk the content
    const chunks = chunkText(material.content);

    // Store chunks (in real implementation, generate embeddings here)
    material.embeddings = chunks.map((chunk) => ({
      chunk,
      embedding: [], // Placeholder - would use OpenAI embeddings API
      metadata: {
        materialId: material._id,
        title: material.title,
      },
    }));

    material.status = 'trained';
    material.lastTrained = new Date();
    await material.save();

    console.log(`✅ Indexed material: ${material.title}`);
  } catch (error) {
    console.error('Indexing error:', error);
    
    // Mark as failed
    await TrainingMaterial.findByIdAndUpdate(materialId, {
      status: 'untrained',
    });
  }
};
