import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const { Pool } = pg;

const normalizeEnvValue = (value, fallback = undefined) => {
  if (value === undefined || value === null) {
    return fallback;
  }

  const normalizedValue = String(value).trim();
  return normalizedValue.length > 0 ? normalizedValue : fallback;
};

const dbConfig = {
  connectionString: normalizeEnvValue(process.env.DATABASE_URL),
  host: normalizeEnvValue(process.env.DB_HOST, "localhost"),
  port: Number(normalizeEnvValue(process.env.DB_PORT, 5432)),
  user: normalizeEnvValue(process.env.DB_USER, "postgres"),
  password: normalizeEnvValue(process.env.DB_PASSWORD, "postgres"),
  database: normalizeEnvValue(process.env.DB_NAME, "postgres"),
  max: Number(normalizeEnvValue(process.env.DB_POOL_MAX, 10)),
  idleTimeoutMillis: Number(
    normalizeEnvValue(process.env.DB_IDLE_TIMEOUT_MS, 10000),
  ),
  connectionTimeoutMillis: Number(
    normalizeEnvValue(process.env.DB_CONNECTION_TIMEOUT_MS, 5000),
  ),
};

if (dbConfig.connectionString) {
  delete dbConfig.host;
  delete dbConfig.port;
  delete dbConfig.user;
  delete dbConfig.password;
  delete dbConfig.database;
}

const pool = new Pool(dbConfig);

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error:", error);
});

const query = (text, params = []) => pool.query(text, params);

const getClient = () => pool.connect();

const withTransaction = async (callback) => {
  const client = await getClient();

  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const checkDatabaseConnection = async () => {
  await query("SELECT 1");
};

const closeDatabaseConnection = async () => {
  await pool.end();
};

export {
  pool,
  query,
  getClient,
  withTransaction,
  checkDatabaseConnection,
  closeDatabaseConnection,
};

export default pool;
