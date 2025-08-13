import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface User {
  id: string
  email: string
  name: string
  created_at: string
}

export interface AIChat {
  id: string
  user_id: string
  role: 'user' | 'assistant'
  message: string
  created_at: string
}

export interface AITextGen {
  id: string
  user_id: string
  prompt: string
  result: string
  created_at: string
}

export interface FileAnalysis {
  id: string
  user_id: string
  file_name: string
  file_url: string
  summary: string
  metadata: { size?: number; type?: string } | null
  created_at: string
}

export interface Todo {
  id: string
  user_id: string
  task: string
  ai_recommended: boolean
  is_done: boolean
  due_date: string | null
  created_at: string
}

export interface CSVAnalysis {
  id: string
  user_id: string
  csv_url: string
  analysis_text: string
  chart_data: Record<string, unknown> | null
  created_at: string
}