
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eshfkmayeeuvxqhwcogu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzaGZrbWF5ZWV1dnhxaHdjb2d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4ODAwMzUsImV4cCI6MjA1OTQ1NjAzNX0.fcKdBVtbOl8pS91f6b89yai1_mO7U-i_JWQXriNgM_g';

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true
    }
  }
);
