import fs from 'fs';
import path from 'path';
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.VITE_DATABASE_URL || process.env.DATABASE_URL;
const sql = neon(dbUrl);

async function main() {
  console.log("Creating services table...");
  await sql`
    CREATE TABLE IF NOT EXISTS services (
      id SERIAL PRIMARY KEY,
      slug VARCHAR(255) UNIQUE NOT NULL,
      ordering_rank INTEGER DEFAULT 999,
      icon VARCHAR(255),
      title VARCHAR(255) NOT NULL,
      subheadline VARCHAR(255),
      description TEXT,
      image TEXT,
      category VARCHAR(255),
      full_description TEXT,
      pain_points TEXT,
      approach TEXT,
      benefits JSONB,
      process JSONB,
      capabilities JSONB,
      tech_stack JSONB,
      case_study JSONB,
      testimonial JSONB,
      has_page BOOLEAN DEFAULT false
    );
  `;
  console.log("Table created.");

  const servicesJsonRaw = fs.readFileSync('src2/data/collections/services.json', 'utf8');
  const servicesJson = JSON.parse(servicesJsonRaw);
  const items = servicesJson.services || [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    let detailedData = {};
    
    if (item.has_page) {
      try {
        const detailPath = path.join('src2/data/collections/services', `${item.slug}.json`);
        if (fs.existsSync(detailPath)) {
          const detailRaw = fs.readFileSync(detailPath, 'utf8');
          detailedData = JSON.parse(detailRaw);
          console.log(`Loaded detailed data for ${item.slug}`);
        }
      } catch (err) {
        console.warn(`Could not load detailed data for ${item.slug}`, err);
      }
    }

    // Merge basic and detailed data
    const merged = { ...item, ...detailedData };

    console.log(`Inserting service ${merged.slug}...`);
    
    // Arrays and Objects to JSON strings for JSONB
    const benefitsJson = merged.benefits ? JSON.stringify(merged.benefits) : null;
    const processJson = merged.process ? JSON.stringify(merged.process) : null;
    const capabilitiesJson = merged.capabilities ? JSON.stringify(merged.capabilities) : null;
    const techStackJson = merged.techStack ? JSON.stringify(merged.techStack) : null;
    const caseStudyJson = merged.caseStudy ? JSON.stringify(merged.caseStudy) : null;
    const testimonialJson = merged.testimonial ? JSON.stringify(merged.testimonial) : null;

    try {
      await sql`
        INSERT INTO services (
          slug, ordering_rank, icon, title, subheadline, description, image, category,
          full_description, pain_points, approach, benefits, process, capabilities,
          tech_stack, case_study, testimonial, has_page
        ) VALUES (
          ${merged.slug}, ${merged.ordering_rank || 999}, ${merged.icon || null}, ${merged.title},
          ${merged.subheadline || null}, ${merged.description || null}, ${merged.image || null},
          ${merged.category || null}, ${merged.fullDescription || null}, ${merged.painPoints || null},
          ${merged.approach || null}, ${benefitsJson}, 
          ${processJson}, 
          ${capabilitiesJson}, 
          ${techStackJson}, 
          ${caseStudyJson}, 
          ${testimonialJson}, 
          ${merged.has_page ? true : false}
        )
        ON CONFLICT (slug) DO UPDATE SET
          ordering_rank = EXCLUDED.ordering_rank,
          icon = EXCLUDED.icon,
          title = EXCLUDED.title,
          subheadline = EXCLUDED.subheadline,
          description = EXCLUDED.description,
          image = EXCLUDED.image,
          category = EXCLUDED.category,
          full_description = EXCLUDED.full_description,
          pain_points = EXCLUDED.pain_points,
          approach = EXCLUDED.approach,
          benefits = EXCLUDED.benefits,
          process = EXCLUDED.process,
          capabilities = EXCLUDED.capabilities,
          tech_stack = EXCLUDED.tech_stack,
          case_study = EXCLUDED.case_study,
          testimonial = EXCLUDED.testimonial,
          has_page = EXCLUDED.has_page
      `;
    } catch(err) {
      console.error(`Failed to insert ${merged.slug}:`, err);
    }
  }

  try {
    await sql`GRANT SELECT ON services TO anonymous;`;
    await sql`GRANT SELECT ON services TO authenticated;`;
  } catch(e) {
    console.error("Failed to grant privileges", e);
  }

  console.log("Services seeded successfully.");
}

main().catch(console.error);
