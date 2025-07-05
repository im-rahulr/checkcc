
import { Pool, PoolClient } from 'pg';
import { toast } from '@/components/ui/use-toast';

// TiDB Cloud connection configuration
const dbConfig = {
  host: import.meta.env.VITE_TIDB_HOST || 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
  port: parseInt(import.meta.env.VITE_TIDB_PORT || '4000'),
  user: import.meta.env.VITE_TIDB_USER || 'GptQL1z9qkGCUim.root',
  password: import.meta.env.VITE_TIDB_PASSWORD || '',
  database: import.meta.env.VITE_TIDB_DATABASE || 'test',
  ssl: {
    rejectUnauthorized: true,
    ca: import.meta.env.VITE_TIDB_CA_CERT || ''
  },
  // Connection pool settings
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
};

// Create the connection pool
const pool = new Pool(dbConfig);

// Set up error handling for the pool
pool.on('error', (err: Error) => {
  console.error('Unexpected error on idle client', err);
  toast({
    title: 'Database Error',
    description: 'An unexpected database error occurred. Please try again later.',
    variant: 'destructive',
  });
});

/**
 * Executes a database query using the connection pool
 */
export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (err) {
    console.error('Error executing query', err);
    throw err;
  }
}

/**
 * Gets a client from the pool for transactions
 */
export async function getClient(): Promise<PoolClient> {
  const client = await pool.connect();
  const originalQuery = client.query;
  const originalRelease = client.release;

  // Override client.query to log queries
  (client as any).query = (...args: any[]) => {
    (client as any).lastQuery = args;
    return originalQuery.apply(client, args);
  };

  // Override client.release to restore original methods
  client.release = () => {
    client.query = originalQuery;
    client.release = originalRelease;
    return originalRelease.apply(client);
  };

  return client;
}

/**
 * Executes a transaction
 */
export async function transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

export default pool;
