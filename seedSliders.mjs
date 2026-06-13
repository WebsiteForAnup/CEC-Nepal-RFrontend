import fs from 'fs';
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.VITE_DATABASE_URL || process.env.DATABASE_URL;
const sql = neon(dbUrl);

async function main() {
  console.log("Creating hero_sliders table...");
  await sql`
    CREATE TABLE IF NOT EXISTS hero_sliders (
      id SERIAL PRIMARY KEY,
      image TEXT,
      badge VARCHAR(255),
      title_highlight VARCHAR(255),
      title_suffix VARCHAR(255),
      description TEXT,
      link VARCHAR(255),
      ordering INTEGER DEFAULT 999
    );
  `;
  console.log("Table created.");

  const homeJsonRaw = fs.readFileSync('src2/data/pages/home.json', 'utf8');
  const homeJson = JSON.parse(homeJsonRaw);
  const slides = homeJson.hero?.slides || [];

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    console.log(`Inserting slide ${i + 1}`);
    await sql`
      INSERT INTO hero_sliders (image, badge, title_highlight, title_suffix, description, link, ordering)
      VALUES (${slide.image || null}, ${slide.badge || null}, ${slide.titleHighlight || null}, ${slide.titleSuffix || null}, ${slide.description || null}, ${slide.link || null}, ${i + 1})
    `;
  }

  try {
    await sql`GRANT SELECT ON hero_sliders TO anonymous;`;
    await sql`GRANT SELECT ON hero_sliders TO authenticated;`;
  } catch(e) {
    console.error("Failed to grant privileges", e);
  }

  console.log("Sliders seeded successfully.");
}

main().catch(console.error);
