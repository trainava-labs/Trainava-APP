import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xhyxvewghynznpzjdbcc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoeXh2ZXdnaHluem5wempkYmNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NjQzMjAsImV4cCI6MjA2MzM0MDMyMH0.qivLjbE0D869AjrWU4oF2KzJf0yxjhAej2YgyKXBryA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);