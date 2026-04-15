import { query } from "../../common/config/db.js";

const USER_SELECT_FIELDS = `
  id,
  full_name,
  email,
  created_at,
  updated_at
`;

const initializeUserSchema = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      refresh_token TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

const findUserByEmail = async (email) => {
  const result = await query(
    `SELECT id, full_name, email, password_hash, refresh_token, created_at, updated_at
     FROM users
     WHERE email = $1
     LIMIT 1`,
    [email],
  );

  return result.rows[0] ?? null;
};

const findUserById = async (id) => {
  const result = await query(
    `SELECT ${USER_SELECT_FIELDS}
     FROM users
     WHERE id = $1
     LIMIT 1`,
    [id],
  );

  return result.rows[0] ?? null;
};

const createUser = async ({ fullName, email, passwordHash }) => {
  const result = await query(
    `INSERT INTO users (full_name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING ${USER_SELECT_FIELDS}`,
    [fullName, email, passwordHash],
  );

  return result.rows[0];
};

const updateUserRefreshToken = async (id, refreshToken) => {
  await query(
    `UPDATE users
     SET refresh_token = $2,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $1`,
    [id, refreshToken],
  );
};

export {
  initializeUserSchema,
  findUserByEmail,
  findUserById,
  createUser,
  updateUserRefreshToken,
};
