import { Client } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
  connectionString: process.env.VITE_DATABASE_URL,
});

async function run() {
  await client.connect();
  console.log("Connected to database.");

  // Query users
  const usersRes = await client.query(`
    SELECT id, name, email, role, "createdAt" FROM neon_auth.user
  `);
  console.log("Users in neon_auth.user:", usersRes.rows);

  await client.end();
}

run().catch(console.error);
