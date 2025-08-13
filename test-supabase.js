const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://jptjpblrtgfbsfblxacn.supabase.co/'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwdGpwYmxydGdmYnNmYmx4YWNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MTA0MTgsImV4cCI6MjA3MDQ4NjQxOH0.tZAs4lOHVpmIln5Yy9iwhXxIWDmiIGydJfjZbkdcxzk'

async function testSupabase() {
  try {
    console.log('Testing Supabase connection...')
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    const { data, error } = await supabase.auth.getSession()
    console.log('Session data:', data)
    console.log('Session error:', error)
    
    console.log('Supabase connection test completed')
  } catch (error) {
    console.error('Supabase connection failed:', error)
  }
}

testSupabase()