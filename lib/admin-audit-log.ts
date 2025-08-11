
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

type AuditLog = {
  admin_id: string;
  action: string;
  entity_type?: string;
  entity_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
};

export async function createAuditLog(
  supabase: SupabaseClient<Database>,
  log: AuditLog
) {
  try {
    const { error } = await supabase.from('admin_audit_logs').insert(log);
    if (error) {
      console.error('Error creating audit log:', error);
    }
  } catch (err) {
    console.error('Failed to create audit log:', err);
  }
}

