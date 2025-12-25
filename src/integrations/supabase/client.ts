import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ibliyrfsakhktwbhclas.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlibGl5cmZzYWtoa3R3YmhjbGFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2NzExNjUsImV4cCI6MjA4MjI0NzE2NX0.iuGZSBu-GN_0mKu5Ea7MNZVdlUkKxAA1oGWQp0Mc5S0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Import the supabase client like this:
// For React:
// import { supabase } from "@/integrations/supabase/client";
// For React Native:
// import { supabase } from "@/src/integrations/supabase/client";
