import { createClient } from '@neondatabase/neon-js';
import dotenv from 'dotenv';
dotenv.config();
const client = createClient({ 
  auth: { url: process.env.VITE_NEON_AUTH_URL }, 
  dataApi: { url: process.env.VITE_NEON_AUTH_URL } 
});
async function run() {
  console.log("querying...");
  const res = await client.from('news_events').select('*').limit(1);
  console.log(res);
}
run().catch(console.error);
