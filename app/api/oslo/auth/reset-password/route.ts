import { NextResponse } from 'next/server';
import { createClient } from '@/utils/server-side-client';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const supabase = await createClient();
    
    // Check if the email belongs to an admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('email', email)
      .single();
    
    // Only send reset email if user is admin or has the special email
    if (!profile?.is_admin && email !== 'jennifernanyombi1@gmail.com') {
      // Don't reveal whether the email exists
      return NextResponse.json({ 
        message: 'If this email belongs to an admin account, a reset link has been sent.' 
      });
    }
    
    // Send password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/oslo/auth/reset-password/confirm`,
    });
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({ 
      message: 'If this email belongs to an admin account, a reset link has been sent.' 
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}