import { Client } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
  connectionString: process.env.VITE_DATABASE_URL,
});

async function run() {
  await client.connect();
  console.log("Connected to database.");

  // Create queue table
  console.log("Creating user_roles_queue table...");
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.user_roles_queue (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Enable RLS on user_roles_queue
  console.log("Enabling RLS on user_roles_queue...");
  await client.query(`
    ALTER TABLE public.user_roles_queue ENABLE ROW LEVEL SECURITY;
  `);

  // Drop existing policy if it exists and create new ones
  console.log("Creating RLS policies for user_roles_queue...");
  await client.query(`
    DROP POLICY IF EXISTS "Allow authenticated insert to queue" ON public.user_roles_queue;
    CREATE POLICY "Allow authenticated insert to queue" 
    ON public.user_roles_queue 
    FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow authenticated select from queue" ON public.user_roles_queue;
    CREATE POLICY "Allow authenticated select from queue" 
    ON public.user_roles_queue 
    FOR SELECT 
    TO authenticated 
    USING (true);
  `);

  // Create SECURITY DEFINER function to update neon_auth.user role
  console.log("Creating trigger function...");
  await client.query(`
    CREATE OR REPLACE FUNCTION public.process_role_update()
    RETURNS TRIGGER AS $$
    BEGIN
      UPDATE neon_auth.user 
      SET role = NEW.role 
      WHERE email = NEW.email;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  `);

  // Create trigger
  console.log("Creating trigger...");
  await client.query(`
    DROP TRIGGER IF EXISTS trigger_update_role ON public.user_roles_queue;
    CREATE TRIGGER trigger_update_role
    AFTER INSERT ON public.user_roles_queue
    FOR EACH ROW
    EXECUTE FUNCTION public.process_role_update();
  `);

  console.log("Database migration completed successfully.");
  await client.end();
}

run().catch(console.error);
