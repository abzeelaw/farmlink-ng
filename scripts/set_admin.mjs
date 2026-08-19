import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const env = fs.readFileSync('.env', 'utf8')
  .split(/\r?\n/)
  .filter(Boolean)
  .reduce((acc, line) => {
    const [k, ...rest] = line.split('=');
    acc[k] = rest.join('=');
    return acc;
  }, {});

const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SUPABASE_KEY = env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing Supabase config in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const email = 'habeeblawal2020@gmail.com';

const run = async () => {
  try {
    // find user by email
    const { data: rows, error: findErr } = await supabase.from('profiles').select('id, email, role').eq('email', email);
    if (findErr) {
      console.error('Find error:', findErr);
      process.exit(1);
    }

    if (!rows || rows.length === 0) {
      console.log('No profile found for', email);
      process.exit(0);
    }

    const id = rows[0].id;
    console.log('Found profile id', id, 'current role', rows[0].role);

    const { data, error } = await supabase.from('profiles').update({ role: 'admin' }).eq('id', id).select('*');
    if (error) {
      console.error('Update error:', error);
      process.exit(1);
    }

    console.log('Updated profile:', data);

    // verify by querying admins
    const { data: admins } = await supabase.from('profiles').select('id,email,role').eq('role','admin');
    console.log('Admins now:', admins);
  } catch (err) {
    console.error('Error:', err);
  }
};

run().then(() => process.exit(0));
