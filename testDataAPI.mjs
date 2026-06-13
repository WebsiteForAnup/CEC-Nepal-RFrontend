import { createClient } from '@neondatabase/neon-js';
const neonClient = createClient({
  dataApi: { url: "https://ep-noisy-heart-apav3xv4.apirest.c-7.us-east-1.aws.neon.tech/neondb/rest/v1" }
});
neonClient.schema('public').from('team_categories').select('*').then(res => console.log(res)).catch(console.error);
