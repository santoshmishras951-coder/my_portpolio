import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wmladalukfcihmqqnzms.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_6EUVMxUW3sQLWbJKpLsA-A_QGiH3AWq';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function saveContactMessageToSupabase(data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
}) {
  try {
    const { data: result, error } = await supabase
      .from('contact_messages')
      .insert([
        {
          name: data.name.trim(),
          email: data.email.trim().toLowerCase(),
          phone: data.phone ? data.phone.trim() : '',
          company: data.company ? data.company.trim() : '',
          subject: data.subject ? data.subject.trim() : 'Portfolio Contact Inquiry',
          message: data.message.trim(),
          created_at: new Date().toISOString()
        }
      ]);

    if (error) {
      console.error('[Supabase Error] Insert failed:', error.message);
      // Fallback: try inserting into table 'contacts' if 'contact_messages' doesn't exist
      const { error: fallbackError } = await supabase
        .from('contacts')
        .insert([
          {
            name: data.name.trim(),
            email: data.email.trim().toLowerCase(),
            phone: data.phone ? data.phone.trim() : '',
            college_name: data.company ? data.company.trim() : '',
            subject: data.subject ? data.subject.trim() : 'Portfolio Contact Inquiry',
            message: data.message.trim(),
            created_at: new Date().toISOString()
          }
        ]);
      if (fallbackError) {
        throw new Error(error.message || fallbackError.message);
      }
    }

    console.log('[Supabase] Contact message stored successfully');
    return { success: true };
  } catch (err) {
    console.error('[Supabase Exception]:', err);
    throw err;
  }
}
