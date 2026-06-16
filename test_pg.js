import { Client } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
  connectionString: process.env.VITE_DATABASE_URL,
});

async function run() {
  await client.connect();
  console.log("Connected to database.");

  // Query schemas
  const schemasRes = await client.query(`
    SELECT schema_name FROM information_schema.schemata 
    WHERE schema_name NOT IN ('pg_catalog', 'information_schema')
  `);
  console.log("Schemas:", schemasRes.rows.map(r => r.schema_name));

  // Query tables
  const tablesRes = await client.query(`
    SELECT table_schema, table_name FROM information_schema.tables 
    WHERE table_schema IN ('public', 'neon_auth', 'better_auth')
  `);
  console.log("Tables:", tablesRes.rows);

  await client.end();
}

run().catch(console.error);
