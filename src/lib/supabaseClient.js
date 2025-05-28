import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xhyxvewghynznpzjdbcc.supabase.co';
const supabaseAnonKey = 'fillyourtoken';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
