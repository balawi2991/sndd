/**
 * Index Materials Script
 * Indexes all unindexed training materials
 */

const { Client } = require('pg');
const OpenAI = require('openai');
require('dotenv').config();

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// RAG Configuration
const CHUNK_SIZE = parseInt(process.env.RAG_CHUNK_SIZE) || 750;
const CHUNK_OVERLAP = parseInt(process.env.RAG_CHUNK_OVERLAP) || 100;

/**
 * Normalize text
 */
function normalizeText(text) {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Chunk text
 */
function chunkText(text) {
  const normalized = normalizeText(text);
  const chunks = [];
  let start = 0;
  let index = 0;

  while (start < normalized.length) {
    const end = Math.min(start + CHUNK_SIZE, normalized.length);
    const chunk = normalized.slice(start, end);
    
    chunks.push({
      text: chunk,
      index: index++
    });

    start += CHUNK_SIZE - CHUNK_OVERLAP;
  }

  return chunks;
}

/**
 * Generate embedding
 */
async function generateEmbedding(text, openai) {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
      encoding_format: 'float'
    });

    return response.data[0].embedding;
  } catch (error) {
    throw new Error(`Embedding generation failed: ${error.message}`);
  }
}

/**
 * Index a material
 */
async function indexMaterial(client, openai, material) {
  log(`\n📄 Indexing: ${material.title}`, 'cyan');

  if (!material.content) {
    log('   ⚠️  No content to index', 'yellow');
    return;
  }

  // Delete existing chunks
  await client.query(
    'DELETE FROM chunks WHERE material_id = $1',
    [material.id]
  );

  // Chunk the content
  const chunks = chunkText(material.content);
  log(`   📦 Created ${chunks.length} chunks`, 'blue');

  // Generate embeddings and store
  for (const chunk of chunks) {
    try {
      const embedding = await generateEmbedding(chunk.text, openai);

      await client.query(`
        INSERT INTO chunks (material_id, content, embedding, metadata)
        VALUES ($1, $2, $3, $4)
      `, [
        material.id,
        chunk.text,
        JSON.stringify(embedding),
        JSON.stringify({
          source: material.title,
          url: material.url,
          position: chunk.index
        })
      ]);

      log(`   ✅ Indexed chunk ${chunk.index + 1}/${chunks.length}`, 'green');
    } catch (error) {
      log(`   ❌ Failed chunk ${chunk.index + 1}: ${error.message}`, 'red');
    }
  }

  // Mark as indexed
  await client.query(
    'UPDATE training_materials SET indexed_at = NOW() WHERE id = $1',
    [material.id]
  );

  log(`   🎉 Material indexed successfully!`, 'green');
}

async function indexAllMaterials() {
  log('\n🔍 Starting Material Indexing...', 'cyan');

  // Check environment variables
  const dbUrl = process.env.DATABASE_URL;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!dbUrl) {
    log('❌ DATABASE_URL not found', 'red');
    process.exit(1);
  }

  if (!openaiKey) {
    log('❌ OPENAI_API_KEY not found', 'red');
    log('   Add it to server/.env file', 'yellow');
    process.exit(1);
  }

  const client = new Client({ connectionString: dbUrl });
  const openai = new OpenAI({ apiKey: openaiKey });

  try {
    await client.connect();
    log('✅ Connected to database', 'green');

    // Get unindexed materials
    const result = await client.query(`
      SELECT id, type, title, content, url
      FROM training_materials
      WHERE indexed_at IS NULL OR content IS NOT NULL
      ORDER BY created_at DESC
    `);

    const materials = result.rows;

    if (materials.length === 0) {
      log('\n✅ No materials to index', 'green');
      await client.end();
      return;
    }

    log(`\n📚 Found ${materials.length} material(s) to index`, 'blue');

    // Index each material
    for (let i = 0; i < materials.length; i++) {
      const material = materials[i];
      log(`\n[${i + 1}/${materials.length}]`, 'cyan');
      
      try {
        await indexMaterial(client, openai, material);
      } catch (error) {
        log(`   ❌ Error: ${error.message}`, 'red');
      }
    }

    // Summary
    const stats = await client.query(`
      SELECT 
        COUNT(*) as total_materials,
        COUNT(*) FILTER (WHERE indexed_at IS NOT NULL) as indexed_materials,
        (SELECT COUNT(*) FROM chunks) as total_chunks
      FROM training_materials
    `);

    const { total_materials, indexed_materials, total_chunks } = stats.rows[0];

    log('\n📊 Indexing Summary:', 'cyan');
    log(`   Total Materials: ${total_materials}`, 'blue');
    log(`   Indexed: ${indexed_materials}`, 'green');
    log(`   Total Chunks: ${total_chunks}`, 'blue');

    await client.end();

    log('\n🎉 Indexing completed successfully!', 'green');
    log('\n📝 Next steps:', 'cyan');
    log('   1. Start the server: npm run dev');
    log('   2. Test the chat widget');
    log('');

  } catch (error) {
    log(`\n❌ Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

indexAllMaterials();
