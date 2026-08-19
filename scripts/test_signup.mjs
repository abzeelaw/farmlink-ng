import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// Load .env manually
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
    const ts = Date.now();
    const email = `testfarmer+${ts}@example.com`;
    const password = 'Testpass1!';
    const full_name = 'Test Farmer';

    console.log('Signing up:', email);

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name, role: 'farmer' } },
    });

    console.log('signUpError:', signUpError);
    console.log('signUpData.user id:', signUpData?.user?.id);

    const userId = signUpData?.user?.id;

    if (userId) {
      console.log('Attempting profile upsert as anon/after signup...');
      const { data: upsertData, error: upsertError } = await supabase
        .from('profiles')
        .upsert({ id: userId, full_name, role: 'farmer', verification_status: 'verified' }, { returning: 'representation' });

      console.log('upsertError:', upsertError);
      console.log('upsertData:', upsertData);

      console.log('Attempting signInWithPassword...');
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      console.log('signInError:', signInError);
      console.log('signInData:', signInData);

      console.log('Querying profiles by id:');
      const { data: profileRow, error: profileError } = await supabase.from('profiles').select('id,email,role,verification_status,farm_name,farm_image,avatar_url').eq('id', userId).single();
      console.log('profileError:', profileError);
      console.log('profileRow:', profileRow);

      console.log('Querying public verified farmers list (as anon/auth):');
      const { data: verifiedList, error: listError } = await supabase.from('profiles').select('id,email,role,verification_status,farm_name,farm_image').eq('role','farmer').eq('verification_status','verified').order('created_at',{ascending:false}).limit(10);
      console.log('listError:', listError);
      console.log('verifiedList length:', verifiedList?.length);
      console.log(verifiedList);
    }
  } catch (err) {
    console.error('Test signup error:', err);
  }
};

run().then(() => process.exit(0));
