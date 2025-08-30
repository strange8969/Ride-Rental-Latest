// Environment Variable Checker
export const checkSupabaseEnv = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  console.log('Supabase URL:', supabaseUrl ? '✅ Present' : '❌ Missing');
  // Only log the first few characters of the key for security
  console.log('Supabase Anon Key:', supabaseAnonKey ? 
    `✅ Present (starts with: ${supabaseAnonKey.substring(0, 5)}...)` : 
    '❌ Missing');
  
  return {
    isValid: !!supabaseUrl && !!supabaseAnonKey,
    url: supabaseUrl,
    keyPrefix: supabaseAnonKey ? supabaseAnonKey.substring(0, 5) : null
  };
};
