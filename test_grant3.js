import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.VITE_DATABASE_URL);

async function run() {
  console.log("Granting permissions to anonymous users...");
  try {
    await sql`GRANT USAGE ON SCHEMA public TO authenticated, anonymous;`;
    await sql`GRANT SELECT ON public.news_events TO authenticated, anonymous;`;
    console.log("Success! Checking data via Postgrest:");
  } catch (err) {
    console.error(err);
  }
}
run();
