import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://wmladalukfcihmqqnzms.supabase.co";
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_6EUVMxUW3sQLWbJKpLsA-A_QGiH3AWq";

export const supabase = createClient(supabaseUrl, supabasePublishableKey);
