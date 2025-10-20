import TrainingMaterial from '../models/TrainingMaterial.model.js';
import axios from 'axios';

interface Source {
  title: string;
  url?: string;
  materialId: string;
  chunk: string;
}

interface Embedding {
  chunk: string;
  embedding: number[];
  metadata: {
    materialId: string;
    title: string;
  };
}

// Improved text chunking with overlap
const chunkText = (text: string, chunkSize = 800, overlap = 200): string[] => {
  const chunks: string[] = [];
  
  // Split by sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  
  let currentChunk = '';
  let previousChunk = '';
  
  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();
    
    if ((currentChunk + trimmedSentence).length > chunkSize && currentChunk) {
      chunks.push(currentChunk.trim());
      
      // Add overlap from previous chunk
      const words = currentChunk.split(' ');
      const overlapWords = words.slice(-Math.floor(overlap / 5)); // ~5 chars per word
      previousChunk = overlapWords.join(' ');
      
      currentChunk = previousChunk + ' ' + trimmedSentence;
    } else {
      currentChunk += ' ' + trimmedSentence;
    }
  }
  
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks.filter(c => c.length > 50); // Filter very short chunks
};

// Get embeddings from OpenAI (or fallback to simple)
const getEmbedding = async (text: string): Promise<number[]> => {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      // Fallback: simple word frequency vector
      return simpleEmbedding(text);
    }

    const response = await axios.post(
      'https://api.openai.com/v1/embeddings',
      {
        model: 'text-embedding-3-small',
        input: text,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        timeout: 10000,
      }
    );

    return response.data.data[0].embedding;
  } catch (error) {
    console.warn('OpenAI embedding failed, using fallback:', error);
    return simpleEmbedding(text);
  }
};

// Simple embedding fallback (TF-IDF-like)
const simpleEmbedding = (text: string): number[] => {
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  const wordFreq: Record<string, number> = {};
  
  // Count word frequencies
  for (const word of words) {
    if (word.length > 3) { // Skip short words
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  }
  
  // Create a simple 100-dim vector
  const vector = new Array(100).fill(0);
  const entries = Object.entries(wordFreq);
  
  for (let i = 0; i < Math.min(entries.length, 100); i++) {
    const hash = entries[i][0].split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = hash % 100;
    vector[index] += entries[i][1];
  }
  
  // Normalize
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return magnitude > 0 ? vector.map(v => v / magnitude) : vector;
};

// Cosine similarity
const cosineSimilarity = (a: number[], b: number[]): number => {
  if (a.length !== b.length) return 0;
  
  let dotProduct = 0;
  let magA = 0;
  let magB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  
  const magnitude = Math.sqrt(magA) * Math.sqrt(magB);
  return magnitude > 0 ? dotProduct / magnitude : 0;
};

// Semantic retrieval with embeddings
const semanticRetrieval = async (
  query: string,
  materials: any[]
): Promise<Source[]> => {
  try {
    // Get query embedding
    const queryEmbedding = await getEmbedding(query);
    
    const results: Array<{ source: Source; score: number }> = [];
    
    for (const material of materials) {
      // Get all embeddings for this material
      const embeddings = material.embeddings || [];
      
      if (embeddings.length === 0) {
        // Fallback: chunk and embed on-the-fly
        const chunks = chunkText(material.content);
        for (const chunk of chunks.slice(0, 5)) { // Limit to 5 chunks
          const chunkEmbedding = await getEmbedding(chunk);
          const similarity = cosineSimilarity(queryEmbedding, chunkEmbedding);
          
          if (similarity > 0.3) { // Threshold
            results.push({
              source: {
                title: material.title,
                url: material.metadata?.url || material.source,
                materialId: material._id.toString(),
                chunk: chunk,
              },
              score: similarity,
            });
          }
        }
      } else {
        // Use pre-computed embeddings
        for (const emb of embeddings) {
          const similarity = cosineSimilarity(queryEmbedding, emb.embedding);
          
          if (similarity > 0.3) {
            results.push({
              source: {
                title: material.title,
                url: material.metadata?.url || material.source,
                materialId: material._id.toString(),
                chunk: emb.chunk,
              },
              score: similarity,
            });
          }
        }
      }
    }
    
    // Sort by score and return top 3
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(r => r.source);
  } catch (error) {
    console.error('Semantic retrieval error:', error);
    // Fallback to keyword-based
    return keywordRetrieval(query, materials);
  }
};

// Keyword-based retrieval (fallback)
const keywordRetrieval = (query: string, materials: any[]): Source[] => {
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

    // Retrieve relevant sources using semantic search
    const sources = await semanticRetrieval(query, materials);

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

    console.log(`🔄 Indexing material: ${material.title}`);

    // Chunk the content with overlap
    const chunks = chunkText(material.content, 800, 200);
    console.log(`📄 Created ${chunks.length} chunks`);

    // Generate embeddings for each chunk
    const embeddings: Embedding[] = [];
    
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      console.log(`🔢 Generating embedding ${i + 1}/${chunks.length}`);
      
      const embedding = await getEmbedding(chunk);
      
      embeddings.push({
        chunk,
        embedding,
        metadata: {
          materialId: material._id.toString(),
          title: material.title,
        },
      });
      
      // Small delay to avoid rate limits
      if (i < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // Store embeddings
    material.embeddings = embeddings;
    material.status = 'trained';
    material.lastTrained = new Date();
    await material.save();

    console.log(`✅ Indexed material: ${material.title} (${embeddings.length} embeddings)`);
  } catch (error) {
    console.error('Indexing error:', error);
    
    // Mark as failed
    await TrainingMaterial.findByIdAndUpdate(materialId, {
      status: 'untrained',
    });
  }
};
