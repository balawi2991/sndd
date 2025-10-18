import { db } from '../client';

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  email: string;
  name: string;
  passwordHash: string;
}

export class UsersRepository {
  /**
   * Create a new user
   */
  async create(data: CreateUserData): Promise<User> {
    const query = `
      INSERT INTO users (email, name, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, email, name, created_at, updated_at
    `;

    const result = await db.query<any>(query, [
      data.email,
      data.name,
      data.passwordHash
    ]);

    return this.mapRow(result.rows[0]);
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    const query = `
      SELECT id, email, name, password_hash, created_at, updated_at
      FROM users
      WHERE email = $1
    `;

    const result = await db.query<any>(query, [email]);
    
    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowWithPassword(result.rows[0]);
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    const query = `
      SELECT id, email, name, created_at, updated_at
      FROM users
      WHERE id = $1
    `;

    const result = await db.query<any>(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRow(result.rows[0]);
  }

  /**
   * Update user
   */
  async update(id: string, data: Partial<{ name: string; email: string }>): Promise<User | null> {
    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (data.name !== undefined) {
      updates.push(`name = $${paramIndex}`);
      params.push(data.name);
      paramIndex++;
    }

    if (data.email !== undefined) {
      updates.push(`email = $${paramIndex}`);
      params.push(data.email);
      paramIndex++;
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    params.push(id);

    const query = `
      UPDATE users
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, email, name, created_at, updated_at
    `;

    const result = await db.query<any>(query, params);
    return result.rows[0] ? this.mapRow(result.rows[0]) : null;
  }

  /**
   * Update password
   */
  async updatePassword(id: string, passwordHash: string): Promise<void> {
    const query = `
      UPDATE users
      SET password_hash = $1
      WHERE id = $2
    `;

    await db.query(query, [passwordHash, id]);
  }

  /**
   * Delete user
   */
  async delete(id: string): Promise<boolean> {
    const query = `
      DELETE FROM users
      WHERE id = $1
      RETURNING id
    `;

    const result = await db.query(query, [id]);
    return (result.rowCount || 0) > 0;
  }

  /**
   * Check if email exists
   */
  async emailExists(email: string): Promise<boolean> {
    const query = `
      SELECT 1 FROM users WHERE email = $1
    `;

    const result = await db.query(query, [email]);
    return result.rows.length > 0;
  }

  /**
   * Map database row to User (without password)
   */
  private mapRow(row: any): User {
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  /**
   * Map database row to User (with password hash)
   */
  private mapRowWithPassword(row: any): User {
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      passwordHash: row.password_hash,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}

export const usersRepository = new UsersRepository();
