import { createClient } from '@neondatabase/neon-js';
const client = createClient({ auth: { url: 'http://test' }, dataApi: { url: 'http://test' } });
console.log('from' in client);
console.log(typeof client.from);
