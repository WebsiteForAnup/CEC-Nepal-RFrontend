import fs from 'fs';
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.VITE_DATABASE_URL || process.env.DATABASE_URL;
const sql = neon(dbUrl);

async function main() {
  console.log("Creating team_categories table...");
  await sql`
    CREATE TABLE IF NOT EXISTS team_categories (
      id SERIAL PRIMARY KEY,
      slug VARCHAR(255) UNIQUE NOT NULL,
      label VARCHAR(255) NOT NULL,
      tab_group VARCHAR(255)
    );
  `;
  console.log("Table created.");

  const registryRaw = fs.readFileSync('src2/data/collections/team/registry.json', 'utf8');
  const registry = JSON.parse(registryRaw);
  const tabs = registry.tabs || [];

  for (const tab of tabs) {
    const tabLabel = tab.label;
    for (const cat of tab.categories) {
      // make a friendly label from slug: 'expert_staff' -> 'Expert Staff'
      const friendlyLabel = cat.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      
      console.log(`Inserting category: ${cat}`);
      await sql`
        INSERT INTO team_categories (slug, label, tab_group)
        VALUES (${cat}, ${friendlyLabel}, ${tabLabel})
        ON CONFLICT (slug) DO UPDATE SET 
          tab_group = EXCLUDED.tab_group,
          label = EXCLUDED.label
      `;
    }
  }
  
  try {
    await sql`GRANT SELECT ON team_categories TO anonymous;`;
  } catch(e) {}
  
  console.log("Categories seeded successfully.");
}

main().catch(console.error);
