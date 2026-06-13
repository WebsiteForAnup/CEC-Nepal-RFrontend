import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.VITE_DATABASE_URL);

async function run() {
  try {
    const roles = await sql`SELECT rolname FROM pg_roles;`;
    console.log("Roles:", roles.map(r => r.rolname));
  } catch (err) {
    console.error(err);
  }
}
run();
