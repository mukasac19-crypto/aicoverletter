
// app/api/oslo/auth/change-password/route.ts - FIXED VERSION
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/server-side-client';

const TEMP_ADMIN_EMAIL = 'jennifernanyombi1@gmail.com';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if user is admin
    if (user.email !== TEMP_ADMIN_EMAIL) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();
      
      if (!profile?.is_admin) {
        return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
      }
    }
    
    const { currentPassword, newPassword } = await request.json();
    
    // Validate inputs
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Only validate NEW password requirements
    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 });
    }
    
    // Check if NEW password contains at least one letter and one number
    if (!/(?=.*[0-9])(?=.*[a-zA-Z])/.test(newPassword)) {
      return NextResponse.json({ error: 'New password must contain at least one letter and one number' }, { status: 400 });
    }
    
    // First verify the current password by attempting to sign in
    // This will work regardless of the current password format
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword,
    });
    
    if (signInError) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    }
    
    // Update the password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }
    
    // Log the password change in admin audit logs
    await supabase.from('admin_audit_logs').insert({
      admin_id: user.id,
      action: 'password_changed',
      entity_type: 'admin_user',
      entity_id: user.id,
      details: {
        email: user.email,
        timestamp: new Date().toISOString(),
        note: 'Password updated from legacy format to new secure format'
      },
    });
    
    return NextResponse.json({ 
      message: 'Password updated successfully',
      note: 'Your password has been updated to meet the new security requirements'
    });
  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}