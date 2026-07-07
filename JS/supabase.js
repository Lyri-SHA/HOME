// Supabaseライブラリから接続用クライアントを作成

const SUPABASE_URL = 
"https://yjwtjtjfshibgqgjgfkv.supabase.co";


const SUPABASE_ANON_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlqd3RqdGpmc2hpYmdxZ2pnZmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0MzIyNTIsImV4cCI6MjA5OTAwODI1Mn0.epu734TBeh8BPG2vh8M6EC_x8oq8eH0Z8sMLZiYL2S4";


// Supabase接続
const db = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);