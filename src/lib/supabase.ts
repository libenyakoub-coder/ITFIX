import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://lcbvdhvfbydbyfbbdciq.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjYnZkaHZmYnlkYnlmYmJkY2lxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3NjI0ODUsImV4cCI6MjA5MzMzODQ4NX0.9cS7WQw9DViOE5Q1_VgRKpBfrRwMBwwHIbDQ7w7ft-I";

export const supabase = createClient(supabaseUrl, supabaseKey);