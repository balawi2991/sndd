import { db } from '../client';
import { TrainingMaterial, Chunk } from '../../types';

export class MaterialsRepository {
  /**
   * Create a new training material
   */
  async create(data: {
    userId: string;
    type: 'file' | 'link' | 'text';
    title: string;
    content?: string;
    url?: string;
    filePath?: string;
    fileSize?: number;
    mimeType?: string;
  }): Promise<TrainingMaterial> {
    const query = `
      INSERT INTO training_materials 
        (user_id, type, title, content, url, file_path, file_size, mime_type)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const result = await db.query<any>(query, [
      data.userId,
      data.type,
      data.title,
      data.content,
      data.url,
      data.filePath,
      data.fileSize,
      data.mimeType
    ]);

    return this.mapRow(result.rows[0]);
  }

  /**
   * Get material by ID
   */
  async findById(id: string, userId: string): Promise<TrainingMaterial | null> {
    const query = `
      SELECT * FROM training_materials
      WHERE id = $1 AND user_id = $2
    `;

    const result = await db.query<any>(query, [id, userId]);
    return result.rows[0] ? this.mapRow(result.rows[0]) : null;
  }

  /**
   * List materials for a user
   */
  async list(userId: string): Promise<TrainingMaterial[]> {
    const query = `
      SELECT * FROM training_materials
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;

    const result = await db.query<any>(query, [userId]);
    return result.rows.map(row => this.mapRow(row));
  }

  /**
   * Update material
   */
  async update(
    id: string,
    userId: string,
    data: Partial<TrainingMaterial>
  ): Promise<TrainingMaterial | null> {
    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (data.title !== undefined) {
      updates.push(`title = $${paramIndex}`);
      params.push(data.title);
      paramIndex++;
    }

    if (data.content !== undefined) {
      updates.push(`content = $${paramIndex}`);
      params.push(data.content);
      paramIndex++;
    }

    if (data.url !== undefined) {
      updates.push(`url = $${paramIndex}`);
      params.push(data.url);
      paramIndex++;
    }

    if (updates.length === 0) {
      return this.findById(id, userId);
    }

    params.push(id, userId);

    const query = `
      UPDATE training_materials
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1}
      RETURNING *
    `;

    const result = await db.query<any>(query, params);
    return result.rows[0] ? this.mapRow(result.rows[0]) : null;
  }

  /**
   * Mark material as indexed
   */
  async markIndexed(id: string): Promise<void> {
    const query = `
      UPDATE training_materials
      SET indexed_at = NOW()
      WHERE id = $1
    `;

    await db.query(query, [id]);
  }

  /**
   * Delete material
   */
  async delete(id: string, userId: string): Promise<boolean> {
    const query = `
      DELETE FROM training_materials
      WHERE id = $1 AND user_id = $2
      RETURNING id
    `;

    const result = await db.query(query, [id, userId]);
    return result.rowCount > 0;
  }

  /**
   * Add chunk to material
   */
  async addChunk(data: {
    materialId: string;
    content: string;
    embedding: number[];
    metadata: any;
  }): Promise<void> {
    const query = `
      INSERT INTO chunks (material_id, content, embedding, metadata)
      VALUES ($1, $2, $3, $4)
    `;

    await db.query(query, [
      data.materialId,
      data.content,
      JSON.stringify(data.embedding),
      JSON.stringify(data.metadata)
    ]);
  }

  /**
   * Search similar chunks
   */
  async searchSimilarChunks(
    userId: string,
    queryEmbedding: number[],
    threshold: number = 0.7,
    limit: number = 10
  ): Promise<Array<{ chunk: Chunk; score: number }>> {
    const query = `
      SELECT * FROM search_similar_chunks(
        $1::vector,
        $2::uuid,
        $3::float,
        $4::integer
      )
    `;

    const result = await db.query<any>(query, [
      JSON.stringify(queryEmbedding),
      userId,
      threshold,
      limit
    ]);

    return result.rows.map(row => ({
      chunk: {
        id: row.chunk_id,
        materialId: row.material_id,
        content: row.content,
        embedding: [], // Don't return embedding (large)
        metadata: row.metadata,
        createdAt: new Date()
      },
      score: row.similarity
    }));
  }

  /**
   * Delete chunks for a material
   */
  async deleteChunks(materialId: string): Promise<void> {
    const query = `
      DELETE FROM chunks
      WHERE material_id = $1
    `;

    await db.query(query, [materialId]);
  }

  /**
   * Get chunk count for material
   */
  async getChunkCount(materialId: string): Promise<number> {
    const query = `
      SELECT COUNT(*) as count
      FROM chunks
      WHERE material_id = $1
    `;

    const result = await db.query<{ count: string }>(query, [materialId]);
    return parseInt(result.rows[0]?.count || '0');
  }

  /**
   * Map database row to TrainingMaterial
   */
  private mapRow(row: any): TrainingMaterial {
    return {
      id: row.id,
      userId: row.user_id,
      type: row.type,
      title: row.title,
      content: row.content,
      url: row.url,
      filePath: row.file_path,
      indexedAt: row.indexed_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}

export const materialsRepository = new MaterialsRepository();
