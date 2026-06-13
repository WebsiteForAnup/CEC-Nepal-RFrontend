import { createClient } from '@neondatabase/neon-js';
import dotenv from 'dotenv';
dotenv.config();

const client = createClient({
  auth: { url: process.env.VITE_NEON_AUTH_URL, allowAnonymous: true },
  dataApi: { url: process.env.VITE_NEON_DATA_API_URL }
});

console.log(client.schemaName);
