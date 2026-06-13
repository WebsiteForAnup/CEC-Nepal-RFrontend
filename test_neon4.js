import { NeonPostgrestClient } from '@neondatabase/postgrest-js';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.VITE_NEON_DATA_API_URL || process.env.VITE_NEON_AUTH_URL || '';
console.log("url:", url);
const client = new NeonPostgrestClient({ dataApiUrl: url });

async function run() {
  console.log("querying...");
  const res = await client.from('news_events').select('*').limit(1);
  console.log(res);
}
run().catch(console.error);
