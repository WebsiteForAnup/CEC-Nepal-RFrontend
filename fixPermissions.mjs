import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.VITE_DATABASE_URL || process.env.DATABASE_URL);

async function main() {
  await sql`GRANT SELECT ON team_categories TO authenticated;`;
  await sql`GRANT SELECT ON team_categories TO anonymous;`;
  console.log("Granted SELECT to authenticated and anonymous on team_categories");
}
main().catch(console.error);
