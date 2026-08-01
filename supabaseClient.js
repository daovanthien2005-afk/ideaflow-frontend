import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://owiqgevrauwsrmnyqufi.supabase.co'
const supabaseAnonKey = 'sb_publishable_zW1l7essvD2GahV819V-mA_XkjZQhh2' 
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
