import { db } from '../client';
import { randomBytes } from 'crypto';

export interface Agent {
  id: string;
  userId: string;
  name: string;
  apiKey: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class AgentsRepository {
  /**
   * Generate unique API key
   */
  private generateApiKey(): string {
    const randomPart = randomBytes(32).toString('hex');
    return `agent_${randomPart}`;
  }

  /**
   * Create a new agent with API key
   */
  async create(userId: string, name: string): Promise<Agent> {
    const apiKey = this.generateApiKey();

    const query = `
      INSERT INTO agents (user_id, name, api_key)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const result = await db.query<any>(query, [userId, name, apiKey]);
    return this.mapRow(result.rows[0]);
  }

  /**
   * Find agent by API key
   */
  async findByApiKey(apiKey: string): Promise<Agent | null> {
    const query = `
      SELECT * FROM agents
      WHERE api_key = $1 AND is_active = true
    `;

    const result = await db.query<any>(query, [apiKey]);
    return result.rows[0] ? this.mapRow(result.rows[0]) : null;
  }

  /**
   * Find agent by ID
   */
  async findById(id: string, userId: string): Promise<Agent | null> {
    const query = `
      SELECT * FROM agents
      WHERE id = $1 AND user_id = $2
    `;

    const result = await db.query<any>(query, [id, userId]);
    return result.rows[0] ? this.mapRow(result.rows[0]) : null;
  }

  /**
   * List user's agents
   */
  async list(userId: string): Promise<Agent[]> {
    const query = `
      SELECT * FROM agents
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;

    const result = await db.query<any>(query, [userId]);
    return result.rows.map(row => this.mapRow(row));
  }

  /**
   * Update agent
   */
  async update(
    id: string,
    userId: string,
    data: { name?: string; isActive?: boolean }
  ): Promise<Agent | null> {
    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (data.name !== undefined) {
      updates.push(`name = $${paramIndex}`);
      params.push(data.name);
      paramIndex++;
    }

    if (data.isActive !== undefined) {
      updates.push(`is_active = $${paramIndex}`);
      params.push(data.isActive);
      paramIndex++;
    }

    if (updates.length === 0) {
      return this.findById(id, userId);
    }

    params.push(id, userId);

    const query = `
      UPDATE agents
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1}
      RETURNING *
    `;

    const result = await db.query<any>(query, params);
    return result.rows[0] ? this.mapRow(result.rows[0]) : null;
  }

  /**
   * Delete agent
   */
  async delete(id: string, userId: string): Promise<boolean> {
    const query = `
      DELETE FROM agents
      WHERE id = $1 AND user_id = $2
      RETURNING id
    `;

    const result = await db.query(query, [id, userId]);
    return (result.rowCount ?? 0) > 0;
  }

  /**
   * Regenerate API key
   */
  async regenerateApiKey(id: string, userId: string): Promise<Agent | null> {
    const newApiKey = this.generateApiKey();

    const query = `
      UPDATE agents
      SET api_key = $1
      WHERE id = $2 AND user_id = $3
      RETURNING *
    `;

    const result = await db.query<any>(query, [newApiKey, id, userId]);
    return result.rows[0] ? this.mapRow(result.rows[0]) : null;
  }

  /**
   * Map database row to Agent
   */
  private mapRow(row: any): Agent {
    return {
      id: row.id,
      userId: row.user_id,
      name: row.name,
      apiKey: row.api_key,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}

export const agentsRepository = new AgentsRepository();
