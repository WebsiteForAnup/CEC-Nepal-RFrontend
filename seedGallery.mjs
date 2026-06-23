import fs from 'fs';
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.VITE_DATABASE_URL || process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("Error: VITE_DATABASE_URL/DATABASE_URL is not set in .env");
  process.exit(1);
}

const sql = neon(dbUrl);

async function main() {
  console.log("Creating gallery table in Neon Postgres...");
  await sql`
    CREATE TABLE IF NOT EXISTS gallery (
      id SERIAL PRIMARY KEY,
      slug VARCHAR(255) UNIQUE NOT NULL,
      title VARCHAR(255) NOT NULL,
      category VARCHAR(255) NOT NULL,
      image TEXT,
      description TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  console.log("Schema created successfully.");

  const galleryPath = 'src2/data/collections/gallery.json';
  console.log(`Reading data from ${galleryPath}...`);
  const galleryRaw = fs.readFileSync(galleryPath, 'utf8');
  const galleryData = JSON.parse(galleryRaw);
  const images = galleryData.gallery || [];

  console.log(`Found ${images.length} images to migrate/seed.`);

  let successCount = 0;
  for (const item of images) {
    try {
      await sql`
        INSERT INTO gallery (
          slug, title, category, image, description
        ) VALUES (
          ${item.slug},
          ${item.title},
          ${item.category},
          ${item.image || null},
          ${item.description || null}
        )
        ON CONFLICT (slug) DO UPDATE SET
          title = EXCLUDED.title,
          category = EXCLUDED.category,
          image = EXCLUDED.image,
          description = EXCLUDED.description,
          updated_at = CURRENT_TIMESTAMP
      `;
      successCount++;
    } catch (err) {
      console.error(`Failed to insert/update ${item.title}:`, err.message);
    }
  }

  console.log(`\nSuccessfully migrated/seeded ${successCount} out of ${images.length} gallery images.`);

  try {
    await sql`GRANT SELECT ON gallery TO anonymous;`;
    await sql`GRANT SELECT ON gallery TO authenticated;`;
    console.log("Granted SELECT permission to anonymous and authenticated roles.");
  } catch (err) {
    console.log("Note: Could not grant permissions, they might already be set or not needed.", err.message);
  }
}

main().catch(err => {
  console.error("Migration/Seeding failed:", err);
  process.exit(1);
});
