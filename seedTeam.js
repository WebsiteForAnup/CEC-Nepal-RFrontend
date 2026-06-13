import fs from 'fs';
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

// Ensure the DATABASE_URL is available
const dbUrl = process.env.VITE_DATABASE_URL || process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("Error: VITE_DATABASE_URL is not set in .env");
  process.exit(1);
}

const sql = neon(dbUrl);

async function main() {
  console.log("Creating team_members table in Neon Postgres...");
  await sql`
    CREATE TABLE IF NOT EXISTS team_members (
      id SERIAL PRIMARY KEY,
      slug VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      image_url TEXT,
      education TEXT,
      experience JSONB,
      bio TEXT,
      assignments JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  console.log("Schema created successfully.");

  // Read registry.json
  const registryPath = fs.existsSync('src2/data/collections/team/registry.json') 
    ? 'src2/data/collections/team/registry.json' 
    : 'src/data/collections/team/registry.json';
    
  console.log(`Reading data from ${registryPath}...`);
  const registryRaw = fs.readFileSync(registryPath, 'utf8');
  const registry = JSON.parse(registryRaw);
  const members = registry.members || [];

  console.log(`Found ${members.length} members to migrate.`);

  let successCount = 0;
  for (const member of members) {
    try {
      await sql`
        INSERT INTO team_members (
          slug, name, image_url, education, experience, bio, assignments
        ) VALUES (
          ${member.slug},
          ${member.name},
          ${member.image_url || null},
          ${member.education || null},
          ${JSON.stringify(member.experience || {})},
          ${member.bio || null},
          ${JSON.stringify(member.assignments || {})}
        )
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          image_url = EXCLUDED.image_url,
          education = EXCLUDED.education,
          experience = EXCLUDED.experience,
          bio = EXCLUDED.bio,
          assignments = EXCLUDED.assignments,
          updated_at = CURRENT_TIMESTAMP
      `;
      successCount++;
    } catch (err) {
      console.error(`Failed to insert ${member.name}:`, err.message);
    }
  }
  
  console.log(`\nSuccessfully migrated ${successCount} out of ${members.length} team members to Neon Database.`);
  
  // Also create a policy for public read access if needed
  try {
    await sql`GRANT SELECT ON team_members TO anonymous;`;
    console.log("Granted SELECT permission to anonymous role.");
  } catch (err) {
    console.log("Note: Could not grant permissions, they might already be set or not needed.", err.message);
  }
}

main().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});
