const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function test() {
  const { data, error } = await supabase.from('University').select('name, \"university-logo\"').limit(3);
  console.log(JSON.stringify(data, null, 2));
  console.log('Error:', error);
}
test();
