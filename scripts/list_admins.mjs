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

const run = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, created_at')
      .eq('role', 'admin')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Query error:', error);
      process.exit(1);
    }

    console.log('admins:', JSON.stringify(data || [], null, 2));
  } catch (err) {
    console.error(err);
  }
};

run().then(() => process.exit(0));
