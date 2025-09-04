import { NextRequest, NextResponse } from 'next/server';
import { withAuth, checkFeatureUsage } from '@/lib/api-helpers';
import { ExportFormat } from '@/types/templates';
import { DEFAULT_TEMPLATES } from '@/lib/default-templates';
import { renderTemplate } from '@/lib/template-renderer';
import { generatePDF } from '@/lib/pdf-generator';
import * as docx from 'docx';
import * as cheerio from 'cheerio';

export const maxDuration = 120;

export async function POST(request: NextRequest) {
  return withAuth(request, async ({ userId, isPro, supabase }) => {
    try {
      const { letterData, template_id, format, filename, options } = await request.json();

      if (!letterData || !template_id || !format) {
        return NextResponse.json(
          { error: 'letterData, template_id, and format are required' },
          { status: 400 }
        );
      }

      // Check export limit
      const usageCheck = await checkFeatureUsage(userId, 'exports', isPro, supabase);
      if (!usageCheck.allowed) {
        return NextResponse.json(
          { 
            error: 'Export Limit Reached',
            message: usageCheck.error,
            upgradeUrl: '/pricing'
          },
          { status: 403 }
        );
      }

      // Get template
      let template;
      const defaultTemplate = DEFAULT_TEMPLATES.find(t => t.id === template_id);
      
      if (defaultTemplate) {
        template = defaultTemplate;
      } else {
        // Check if template requires PRO
        const { data: dbTemplate, error } = await supabase
          .from('templates')
          .select('*')
          .eq('id', template_id)
          .single();
        
        if (error || !dbTemplate) {
          return NextResponse.json(
            { error: 'Template not found' },
            { status: 404 }
          );
        }
        
        // Check if premium template
        if (dbTemplate.is_premium && !isPro) {
          return NextResponse.json(
            { 
              error: 'Premium Template',
              message: 'This template requires a PRO subscription',
              upgradeUrl: '/pricing'
            },
            { status: 403 }
          );
        }
        
        template = dbTemplate;
      }

      const baseFilename = filename || `cover-letter-${new Date().toISOString().split('T')[0]}`;
      
      // Generate export based on format
      let exportData: Buffer;
      let mimeType: string;
      let exportFilename: string;

      switch (format as ExportFormat) {
        case 'pdf':
          const htmlContent = renderTemplate(template, letterData);
          exportData = await generatePDF(htmlContent, {
            timeout: options?.timeout || 60000
          });
          mimeType = 'application/pdf';
          exportFilename = `${baseFilename}.pdf`;
          break;

        case 'docx':
          exportData = await generateDOCX(letterData, template, isPro);
          mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          exportFilename = `${baseFilename}.docx`;
          break;

        case 'txt':
          exportData = generatePlainText(letterData);
          mimeType = 'text/plain';
          exportFilename = `${baseFilename}.txt`;
          break;

        default:
          return NextResponse.json(
            { error: 'Unsupported export format' },
            { status: 400 }
          );
      }

      // Log export (for analytics)
      await supabase.from('export_logs').insert({
        user_id: userId,
        format,
        template_id,
        is_pro: isPro,
        created_at: new Date().toISOString()
      });

      // FINAL FIX: Convert the Buffer to a Uint8Array before creating the Blob.
      // This ensures the data is in a format that the web-standard Blob constructor accepts.
      return new NextResponse(new Blob([new Uint8Array(exportData)]), {
        status: 200,
        headers: {
          'Content-Type': mimeType,
          'Content-Disposition': `attachment; filename="${exportFilename}"`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });

    } catch (error: any) {
      console.error('Export error:', error);
      return NextResponse.json(
        { error: 'Export failed', details: error.message },
        { status: 500 }
      );
    }
  });
}

// Helper functions
async function generateDOCX(letterData: any, template: any, isPro: boolean): Promise<Buffer> {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = docx;
  
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          children: [new TextRun({
            text: letterData.content,
            size: 24,
          })],
        }),
        // Add watermark for FREE users
        ...(!isPro ? [
          new Paragraph({
            children: [new TextRun({
              text: "Created with Resume Mate AI - Free Version",
              size: 16,
              color: "CCCCCC",
            })],
            alignment: AlignmentType.CENTER,
          })
        ] : [])
      ],
    }],
  });
  
  return Packer.toBuffer(doc);
}

function generatePlainText(letterData: any): Buffer {
  const text = `${letterData.jobTitle} - ${letterData.companyName}\n\n${letterData.content}`;
  return Buffer.from(text, 'utf-8');
}

