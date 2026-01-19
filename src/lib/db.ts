import { Pool, QueryResult, QueryResultRow } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false // Allow self-signed certs (needed for some cloud DBs)
  }
});

// Helper to mimic @vercel/postgres sql tag behavior using pg
async function sql<R extends QueryResultRow = any>(
  strings: TemplateStringsArray, 
  ...values: any[]
): Promise<QueryResult<R>> {
  let text = '';
  const params: any[] = [];
  
  strings.forEach((string, i) => {
    text += string;
    if (i < values.length) {
      text += `$${i + 1}`;
      params.push(values[i]);
    }
  });

  return await pool.query(text, params);
}

export { sql };
export default sql;
