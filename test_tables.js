import { createClient } from '@neondatabase/neon-js';
import dotenv from 'dotenv';
dotenv.config();

const client = createClient({
  auth: {
    url: process.env.VITE_NEON_AUTH_URL,
    allowAnonymous: true,
  },
  dataApi: {
    url: process.env.VITE_NEON_DATA_API_URL,
  },
});

async function run() {
  console.log("Checking neon_auth.user...");
  const res = await client
    .schema('neon_auth')
    .from('user')
    .select('*')
    .limit(5);
  console.log("neon_auth.user result:", JSON.stringify(res, null, 2));
}

run().catch(console.error);
