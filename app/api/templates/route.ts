// app/api/templates/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/api-helpers';
import { DEFAULT_TEMPLATES } from '@/lib/default-templates';

export async function GET(request: NextRequest) {
  return withAuth(request, async ({ userId, isPro, supabase }) => {
    try {
      // Get all templates from database
      const { data: dbTemplates, error } = await supabase
        .from('templates')
        .select('*')
        .or(`is_public.eq.true,user_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching templates:', error);
      }

      // Combine default templates with database templates
      let allTemplates = [...DEFAULT_TEMPLATES];
      
      if (dbTemplates) {
        allTemplates = [...allTemplates, ...dbTemplates];
      }

      // Filter templates based on user tier
      const accessibleTemplates = allTemplates.map(template => {
        const isPremium = false; // No is_premium or tier property exists on the Template type
        const canAccess = true; // All templates are accessible for now
        
        return {
          ...template,
          is_premium: isPremium,
          is_locked: !canAccess,
          access_message: !canAccess ? 'PRO subscription required' : null
        };
      });

      return NextResponse.json({ 
        data: accessibleTemplates,
        userTier: isPro ? 'PRO' : 'FREE'
      });
      
    } catch (error: any) {
      console.error('Error in templates route:', error);
      return NextResponse.json(
        { error: 'Failed to fetch templates' },
        { status: 500 }
      );
    }
  });
}

export async function POST(request: NextRequest) {
  return withAuth(request, async ({ userId, isPro, supabase }) => {
    try {
      const templateData = await request.json();
      
      // Only PRO users can create custom templates
      if (!isPro && !templateData.is_public) {
        return NextResponse.json(
          { 
            error: 'PRO subscription required',
            message: 'Creating private templates requires a PRO subscription. You can still use our free templates!',
            upgradeUrl: '/pricing'
          },
          { status: 403 }
        );
      }

      // Create template
      const { data, error } = await supabase
        .from('templates')
        .insert({
          ...templateData,
          user_id: userId,
          created_at: new Date().toISOString(),
          is_premium: false, // User-created templates are not premium
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return NextResponse.json({ 
        success: true,
        data,
        message: 'Template created successfully'
      });
      
    } catch (error: any) {
      console.error('Error creating template:', error);
      return NextResponse.json(
        { error: 'Failed to create template', details: error.message },
        { status: 500 }
      );
    }
  });
}