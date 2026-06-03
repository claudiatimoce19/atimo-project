import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://swniytutvkqbeerokguf.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_QqIyBMecSXHxAnVZ8j1pTQ_SM13BMwB';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
