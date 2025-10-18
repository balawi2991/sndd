import { db } from '../client';
import { Conversation, Message } from '../../types';

export class ConversationsRepository {
  /**
   * Create a new conversation
   */
  async create(userId: string, title: string): Promise<Conversation> {
    const query = `
      INSERT INTO conversations (user_id, title)
      VALUES ($1, $2)
      RETURNING *
    `;

    const result = await db.query<Conversation>(query, [userId, title]);
    return result.rows[0];
  }

  /**
   * Get conversation by ID
   */
  async findById(id: string, userId: string): Promise<Conversation | null> {
    const query = `
      SELECT * FROM get_conversation_with_messages($1)
      WHERE user_id = $2
    `;

    const result = await db.query<any>(query, [id, userId]);
    
    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.conversation_id,
      userId: row.user_id,
      title: row.title,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      isRead: row.is_read,
      messages: row.messages || []
    };
  }

  /**
   * List conversations for a user
   */
  async list(
    userId: string,
    limit: number = 50,
    offset: number = 0,
    search?: string
  ): Promise<{ conversations: Conversation[]; total: number }> {
    let query = `
      SELECT c.*, 
             COUNT(*) OVER() as total_count
      FROM conversations c
      WHERE c.user_id = $1
    `;

    const params: any[] = [userId];
    let paramIndex = 2;

    if (search) {
      query += ` AND c.title ILIKE $${paramIndex}`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    query += ` ORDER BY c.updated_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await db.query<any>(query, params);

    const conversations = result.rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      title: row.title,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      isRead: row.is_read
    }));

    const total = result.rows.length > 0 ? parseInt(result.rows[0].total_count) : 0;

    return { conversations, total };
  }

  /**
   * Update conversation
   */
  async update(
    id: string,
    userId: string,
    data: { title?: string; isRead?: boolean }
  ): Promise<Conversation | null> {
    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (data.title !== undefined) {
      updates.push(`title = $${paramIndex}`);
      params.push(data.title);
      paramIndex++;
    }

    if (data.isRead !== undefined) {
      updates.push(`is_read = $${paramIndex}`);
      params.push(data.isRead);
      paramIndex++;
    }

    if (updates.length === 0) {
      return this.findById(id, userId);
    }

    params.push(id, userId);

    const query = `
      UPDATE conversations
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1}
      RETURNING *
    `;

    const result = await db.query<Conversation>(query, params);
    return result.rows[0] || null;
  }

  /**
   * Delete conversation
   */
  async delete(id: string, userId: string): Promise<boolean> {
    const query = `
      DELETE FROM conversations
      WHERE id = $1 AND user_id = $2
      RETURNING id
    `;

    const result = await db.query(query, [id, userId]);
    return result.rowCount > 0;
  }

  /**
   * Add message to conversation
   */
  async addMessage(
    conversationId: string,
    role: 'user' | 'assistant',
    content: string,
    sources?: any[]
  ): Promise<Message> {
    const query = `
      INSERT INTO messages (conversation_id, role, content, sources)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const result = await db.query<any>(query, [
      conversationId,
      role,
      content,
      sources ? JSON.stringify(sources) : null
    ]);

    const row = result.rows[0];
    return {
      id: row.id,
      conversationId: row.conversation_id,
      role: row.role,
      content: row.content,
      sources: row.sources,
      createdAt: row.created_at
    };
  }

  /**
   * Update conversation's updated_at timestamp
   */
  async touch(id: string): Promise<void> {
    const query = `
      UPDATE conversations
      SET updated_at = NOW()
      WHERE id = $1
    `;

    await db.query(query, [id]);
  }

  /**
   * Get or create conversation
   */
  async getOrCreate(
    userId: string,
    conversationId?: string,
    title?: string
  ): Promise<Conversation> {
    if (conversationId) {
      const existing = await this.findById(conversationId, userId);
      if (existing) {
        return existing;
      }
    }

    // Create new conversation
    const defaultTitle = title || `Conversation ${new Date().toLocaleDateString()}`;
    return this.create(userId, defaultTitle);
  }
}

export const conversationsRepository = new ConversationsRepository();
