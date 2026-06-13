import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.VITE_DATABASE_URL);

async function run() {
  console.log("Granting permissions to anonymous users...");
  try {
    await sql`GRANT USAGE ON SCHEMA public TO authenticated, anon;`;
    await sql`GRANT SELECT ON public.news_events TO authenticated, anon;`;
    console.log("Success! Checking data:");
    const res = await sql`SELECT * FROM public.news_events LIMIT 1;`;
    console.log(res);
  } catch (err) {
    console.error(err);
  }
}
run();
