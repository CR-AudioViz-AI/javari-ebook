// lib/supabase.ts — javari-ebook — CR AudioViz AI — Created: 2026-03-15
import { createBrowserClient } from '@supabase/ssr'
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kteobfyferrukqeolofj.supabase.co'
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0ZW9iZnlmZXJydWtxZW9sb2ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxOTcyNjYsImV4cCI6MjA3NzU1NzI2Nn0.uy-jlF_z6qVb8qogsNyGDLHqT4HhmdRhLrW7zPv3qhY'
export const createSupabaseBrowserClient = () => createBrowserClient(URL, KEY)
export { URL as SUPABASE_URL, KEY as SUPABASE_ANON_KEY }