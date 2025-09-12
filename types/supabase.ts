export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string | null
          event_type: string
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          event_type: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          event_type?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_data_sources"
            referencedColumns: ["user_id"]
          },
        ]
      }
      admin_audit_logs: {
        Row: {
          action: string
          admin_id: string
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string | null
          id: string
          ip_address: string | null
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_audit_logs_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "user_data_sources"
            referencedColumns: ["user_id"]
          },
        ]
      }
      admin_settings: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          updated_by?: string | null
          value: Json
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "admin_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "user_data_sources"
            referencedColumns: ["user_id"]
          },
        ]
      }
      blogs: {
        Row: {
          author_id: string | null
          content: string
          created_at: string | null
          header_image_url: string | null
          id: string
          published_at: string | null
          related_articles: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string | null
          header_image_url?: string | null
          id?: string
          published_at?: string | null
          related_articles?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string | null
          header_image_url?: string | null
          id?: string
          published_at?: string | null
          related_articles?: Json | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blogs_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "user_data_sources"
            referencedColumns: ["user_id"]
          },
        ]
      }
      cover_letters: {
        Row: {
          company_name: string | null
          content: string | null
          created_at: string | null
          data_source: string | null
          error_message: string | null
          id: string
          job_description: string
          job_title: string | null
          metadata: Json | null
          queue_job_id: string | null
          recipient: Json | null
          resume_id: string | null
          sender: Json | null
          status: string | null
          template_id: string | null
          tone: string
          updated_at: string | null
          user_id: string
          webhook_token: string | null
        }
        Insert: {
          company_name?: string | null
          content?: string | null
          created_at?: string | null
          data_source?: string | null
          error_message?: string | null
          id?: string
          job_description: string
          job_title?: string | null
          metadata?: Json | null
          queue_job_id?: string | null
          recipient?: Json | null
          resume_id?: string | null
          sender?: Json | null
          status?: string | null
          template_id?: string | null
          tone: string
          updated_at?: string | null
          user_id: string
          webhook_token?: string | null
        }
        Update: {
          company_name?: string | null
          content?: string | null
          created_at?: string | null
          data_source?: string | null
          error_message?: string | null
          id?: string
          job_description?: string
          job_title?: string | null
          metadata?: Json | null
          queue_job_id?: string | null
          recipient?: Json | null
          resume_id?: string | null
          sender?: Json | null
          status?: string | null
          template_id?: string | null
          tone?: string
          updated_at?: string | null
          user_id?: string
          webhook_token?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cover_letters_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resumes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cover_letters_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cover_letters_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_data_sources"
            referencedColumns: ["user_id"]
          },
        ]
      }
      exports: {
        Row: {
          created_at: string | null
          format: string
          id: string
          template_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          format: string
          id?: string
          template_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          format?: string
          id?: string
          template_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_data_sources"
            referencedColumns: ["user_id"]
          },
        ]
      }
      follow_up_emails: {
        Row: {
          application_date: string
          body: string
          company_name: string
          contact_name: string | null
          created_at: string
          greeting: string
          id: string
          job_title: string
          related_cover_letter_id: string | null
          response_received: boolean | null
          sent_at: string | null
          sent_to: string | null
          signature: string
          style: string
          subject: string
          tone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          application_date: string
          body: string
          company_name: string
          contact_name?: string | null
          created_at?: string
          greeting: string
          id?: string
          job_title: string
          related_cover_letter_id?: string | null
          response_received?: boolean | null
          sent_at?: string | null
          sent_to?: string | null
          signature: string
          style: string
          subject: string
          tone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          application_date?: string
          body?: string
          company_name?: string
          contact_name?: string | null
          created_at?: string
          greeting?: string
          id?: string
          job_title?: string
          related_cover_letter_id?: string | null
          response_received?: boolean | null
          sent_at?: string | null
          sent_to?: string | null
          signature?: string
          style?: string
          subject?: string
          tone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follow_up_emails_related_cover_letter_id_fkey"
            columns: ["related_cover_letter_id"]
            isOneToOne: false
            referencedRelation: "cover_letters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follow_up_emails_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_data_sources"
            referencedColumns: ["user_id"]
          },
        ]
      }
      impersonation_tokens: {
        Row: {
          created_at: string
          email: string | null
          expires_at: string
          id: string
          token: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          expires_at: string
          id?: string
          token: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          expires_at?: string
          id?: string
          token?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "impersonation_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_data_sources"
            referencedColumns: ["user_id"]
          },
        ]
      }
      interview_sessions: {
        Row: {
          created_at: string
          difficulty: string
          id: string
          interview_type: string
          job_description: string | null
          job_title: string
          notes: string | null
          questions_answers: Json
          resume_id: string
          tags: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          difficulty: string
          id?: string
          interview_type: string
          job_description?: string | null
          job_title: string
          notes?: string | null
          questions_answers: Json
          resume_id: string
          tags?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          difficulty?: string
          id?: string
          interview_type?: string
          job_description?: string | null
          job_title?: string
          notes?: string | null
          questions_answers?: Json
          resume_id?: string
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "interview_sessions_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resumes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interview_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_data_sources"
            referencedColumns: ["user_id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          created_at: string
          currency: string
          description: string | null
          id: string
          invoice_pdf: string | null
          metadata: Json | null
          period_end: string | null
          period_start: string | null
          status: string
          stripe_invoice_id: string
          stripe_subscription_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at: string
          currency: string
          description?: string | null
          id?: string
          invoice_pdf?: string | null
          metadata?: Json | null
          period_end?: string | null
          period_start?: string | null
          status: string
          stripe_invoice_id: string
          stripe_subscription_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          invoice_pdf?: string | null
          metadata?: Json | null
          period_end?: string | null
          period_start?: string | null
          status?: string
          stripe_invoice_id?: string
          stripe_subscription_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_data_sources"
            referencedColumns: ["user_id"]
          },
        ]
      }
      job_analyses: {
        Row: {
          analysis: string
          content: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          analysis: string
          content: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          analysis?: string
          content?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_analyses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_data_sources"
            referencedColumns: ["user_id"]
          },
        ]
      }
      linkedin_profiles: {
        Row: {
          access_token: string | null
          certifications_json: Json | null
          company: string | null
          education_json: Json | null
          email: string | null
          experience_json: Json | null
          headline: string | null
          id: string
          languages_json: Json | null
          last_synced: string
          linkedin_id: string | null
          location: string | null
          name: string | null
          position: string | null
          profile_data: Json | null
          profile_picture_url: string | null
          profile_url: string
          projects_json: Json | null
          refresh_token: string | null
          skills_json: Json | null
          status: string
          summary: string | null
          token_expires_at: string | null
          user_id: string
        }
        Insert: {
          access_token?: string | null
          certifications_json?: Json | null
          company?: string | null
          education_json?: Json | null
          email?: string | null
          experience_json?: Json | null
          headline?: string | null
          id?: string
          languages_json?: Json | null
          last_synced?: string
          linkedin_id?: string | null
          location?: string | null
          name?: string | null
          position?: string | null
          profile_data?: Json | null
          profile_picture_url?: string | null
          profile_url: string
          projects_json?: Json | null
          refresh_token?: string | null
          skills_json?: Json | null
          status?: string
          summary?: string | null
          token_expires_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string | null
          certifications_json?: Json | null
          company?: string | null
          education_json?: Json | null
          email?: string | null
          experience_json?: Json | null
          headline?: string | null
          id?: string
          languages_json?: Json | null
          last_synced?: string
          linkedin_id?: string | null
          location?: string | null
          name?: string | null
          position?: string | null
          profile_data?: Json | null
          profile_picture_url?: string | null
          profile_url?: string
          projects_json?: Json | null
          refresh_token?: string | null
          skills_json?: Json | null
          status?: string
          summary?: string | null
          token_expires_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "linkedin_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_data_sources"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          career_priorities: string[] | null
          created_at: string | null
          current_role: string | null
          desired_industries: string[] | null
          desired_role: string | null
          email: string | null
          experience_level: string | null
          first_name: string | null
          full_name: string | null
          id: string
          industry: string | null
          is_admin: boolean | null
          job_location_preference: string | null
          job_search_status: string | null
          job_title: string | null
          job_types: string[] | null
          last_name: string | null
          location: string | null
          onboarding_completed: boolean | null
          onboarding_completed_at: string | null
          phone: string | null
          preferred_industries: string[] | null
          professional_summary: string | null
          remote_preference: boolean | null
          status: string | null
          stripe_customer_id: string | null
          stripe_customer_id_test: string | null
          updated_at: string | null
        }
        Insert: {
          career_priorities?: string[] | null
          created_at?: string | null
          current_role?: string | null
          desired_industries?: string[] | null
          desired_role?: string | null
          email?: string | null
          experience_level?: string | null
          first_name?: string | null
          full_name?: string | null
          id: string
          industry?: string | null
          is_admin?: boolean | null
          job_location_preference?: string | null
          job_search_status?: string | null
          job_title?: string | null
          job_types?: string[] | null
          last_name?: string | null
          location?: string | null
          onboarding_completed?: boolean | null
          onboarding_completed_at?: string | null
          phone?: string | null
          preferred_industries?: string[] | null
          professional_summary?: string | null
          remote_preference?: boolean | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_customer_id_test?: string | null
          updated_at?: string | null
        }
        Update: {
          career_priorities?: string[] | null
          created_at?: string | null
          current_role?: string | null
          desired_industries?: string[] | null
          desired_role?: string | null
          email?: string | null
          experience_level?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          industry?: string | null
          is_admin?: boolean | null
          job_location_preference?: string | null
          job_search_status?: string | null
          job_title?: string | null
          job_types?: string[] | null
          last_name?: string | null
          location?: string | null
          onboarding_completed?: boolean | null
          onboarding_completed_at?: string | null
          phone?: string | null
          preferred_industries?: string[] | null
          professional_summary?: string | null
          remote_preference?: boolean | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_customer_id_test?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "user_data_sources"
            referencedColumns: ["user_id"]
          },
        ]
      }
      resume_ats_analyses: {
        Row: {
          analysis_result: Json
          created_at: string | null
          id: string
          job_description: string
          resume_id: string
          user_id: string
        }
        Insert: {
          analysis_result: Json
          created_at?: string | null
          id?: string
          job_description: string
          resume_id: string
          user_id: string
        }
        Update: {
          analysis_result?: Json
          created_at?: string | null
          id?: string
          job_description?: string
          resume_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resume_ats_analyses_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resumes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resume_ats_analyses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_data_sources"
            referencedColumns: ["user_id"]
          },
        ]
      }
      resume_exports: {
        Row: {
          created_at: string | null
          format: string
          id: string
          resume_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          format: string
          id?: string
          resume_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          format?: string
          id?: string
          resume_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resume_exports_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resumes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resume_exports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_data_sources"
            referencedColumns: ["user_id"]
          },
        ]
      }
      resume_extractions: {
        Row: {
          created_at: string | null
          extracted_data: Json
          file_type: string
          filename: string
          id: string
          source_cv: string | null
          source_type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          extracted_data: Json
          file_type: string
          filename: string
          id?: string
          source_cv?: string | null
          source_type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          extracted_data?: Json
          file_type?: string
          filename?: string
          id?: string
          source_cv?: string | null
          source_type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resume_extractions_source_cv_fkey"
            columns: ["source_cv"]
            isOneToOne: false
            referencedRelation: "user_cvs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resume_extractions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_data_sources"
            referencedColumns: ["user_id"]
          },
        ]
      }
      resume_shares: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          resume_id: string
          share_code: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          resume_id: string
          share_code: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          resume_id?: string
          share_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "resume_shares_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resumes"
            referencedColumns: ["id"]
          },
        ]
      }
      resume_tailoring_logs: {
        Row: {
          created_at: string
          feedback: string | null
          id: string
          is_successful: boolean
          job_description_length: number
          keyword_matches: number
          resume_id: string | null
          sections_changed: string[]
          user_id: string | null
        }
        Insert: {
          created_at: string
          feedback?: string | null
          id?: string
          is_successful?: boolean
          job_description_length: number
          keyword_matches: number
          resume_id?: string | null
          sections_changed: string[]
          user_id?: string | null
        }
        Update: {
          created_at?: string
          feedback?: string | null
          id?: string
          is_successful?: boolean
          job_description_length?: number
          keyword_matches?: number
          resume_id?: string | null
          sections_changed?: string[]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resume_tailoring_logs_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resumes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resume_tailoring_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_data_sources"
            referencedColumns: ["user_id"]
          },
        ]
      }
      resume_templates: {
        Row: {
          category: string | null
          created_at: string | null
          css_content: string
          description: string | null
          html_content: string
          id: string
          is_public: boolean | null
          name: string
          thumbnail: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          css_content: string
          description?: string | null
          html_content: string
          id?: string
          is_public?: boolean | null
          name: string
          thumbnail?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          css_content?: string
          description?: string | null
          html_content?: string
          id?: string
          is_public?: boolean | null
          name?: string
          thumbnail?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resume_templates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_data_sources"
            referencedColumns: ["user_id"]
          },
        ]
      }
      resumes: {
        Row: {
          certifications: Json | null
          created_at: string | null
          custom_sections: Json | null
          education: Json
          id: string
          imported_at: string | null
          interests: string[] | null
          internships: Json | null
          is_imported: boolean | null
          is_pro: boolean | null
          is_public: boolean | null
          languages: Json | null
          personal_info: Json
          projects: Json | null
          reference_text: string | null
          references: Json | null
          skills: Json
          source: string | null
          source_cv: string | null
          source_file_name: string | null
          source_file_type: string | null
          template_id: string | null
          title: string
          updated_at: string | null
          user_id: string
          work_experience: Json
        }
        Insert: {
          certifications?: Json | null
          created_at?: string | null
          custom_sections?: Json | null
          education: Json
          id?: string
          imported_at?: string | null
          interests?: string[] | null
          internships?: Json | null
          is_imported?: boolean | null
          is_pro?: boolean | null
          is_public?: boolean | null
          languages?: Json | null
          personal_info: Json
          projects?: Json | null
          reference_text?: string | null
          references?: Json | null
          skills: Json
          source?: string | null
          source_cv?: string | null
          source_file_name?: string | null
          source_file_type?: string | null
          template_id?: string | null
          title: string
          updated_at?: string | null
          user_id: string
          work_experience: Json
        }
        Update: {
          certifications?: Json | null
          created_at?: string | null
          custom_sections?: Json | null
          education?: Json
          id?: string
          imported_at?: string | null
          interests?: string[] | null
          internships?: Json | null
          is_imported?: boolean | null
          is_pro?: boolean | null
          is_public?: boolean | null
          languages?: Json | null
          personal_info?: Json
          projects?: Json | null
          reference_text?: string | null
          references?: Json | null
          skills?: Json
          source?: string | null
          source_cv?: string | null
          source_file_name?: string | null
          source_file_type?: string | null
          template_id?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
          work_experience?: Json
        }
        Relationships: [
          {
            foreignKeyName: "resumes_source_cv_fkey"
            columns: ["source_cv"]
            isOneToOne: false
            referencedRelation: "user_cvs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resumes_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "resume_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resumes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_data_sources"
            referencedColumns: ["user_id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean
          created_at: string
          current_period_end: string
          current_period_start: string
          id: string
          interval: string
          is_in_trial: boolean | null
          metadata: Json | null
          plan_id: string
          status: string
          stripe_customer_id: string
          stripe_subscription_id: string
          trial_end: string | null
          trial_start: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end: string
          current_period_start: string
          id?: string
          interval: string
          is_in_trial?: boolean | null
          metadata?: Json | null
          plan_id: string
          status: string
          stripe_customer_id: string
          stripe_subscription_id: string
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string
          current_period_start?: string
          id?: string
          interval?: string
          is_in_trial?: boolean | null
          metadata?: Json | null
          plan_id?: string
          status?: string
          stripe_customer_id?: string
          stripe_subscription_id?: string
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_data_sources"
            referencedColumns: ["user_id"]
          },
        ]
      }
      templates: {
        Row: {
          category: string | null
          created_at: string
          css_content: string
          description: string | null
          html_content: string
          id: string
          is_public: boolean
          name: string
          tags: string[] | null
          thumbnail_url: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          css_content: string
          description?: string | null
          html_content: string
          id?: string
          is_public?: boolean
          name: string
          tags?: string[] | null
          thumbnail_url?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          css_content?: string
          description?: string | null
          html_content?: string
          id?: string
          is_public?: boolean
          name?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "templates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_data_sources"
            referencedColumns: ["user_id"]
          },
        ]
      }
      usage_limits: {
        Row: {
          created_at: string
          feature: string
          id: string
          limit_count: number
          period_end: string
          period_start: string
          updated_at: string
          used_count: number
          user_id: string
        }
        Insert: {
          created_at?: string
          feature: string
          id?: string
          limit_count: number
          period_end: string
          period_start: string
          updated_at?: string
          used_count?: number
          user_id: string
        }
        Update: {
          created_at?: string
          feature?: string
          id?: string
          limit_count?: number
          period_end?: string
          period_start?: string
          updated_at?: string
          used_count?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usage_limits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_data_sources"
            referencedColumns: ["user_id"]
          },
        ]
      }
      usage_stats: {
        Row: {
          count: number
          created_at: string
          feature: string
          id: string
          period_month: number
          period_year: number
          updated_at: string
          user_id: string
        }
        Insert: {
          count?: number
          created_at?: string
          feature: string
          id?: string
          period_month: number
          period_year: number
          updated_at?: string
          user_id: string
        }
        Update: {
          count?: number
          created_at?: string
          feature?: string
          id?: string
          period_month?: number
          period_year?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usage_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_data_sources"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_cvs: {
        Row: {
          cv_text: string | null
          file_url: string
          filename: string
          filepath: string
          filesize: number
          filetype: string
          id: string
          is_selected: boolean | null
          resume_id: string | null
          uploaded_at: string
          user_id: string
        }
        Insert: {
          cv_text?: string | null
          file_url: string
          filename: string
          filepath: string
          filesize: number
          filetype: string
          id?: string
          is_selected?: boolean | null
          resume_id?: string | null
          uploaded_at?: string
          user_id: string
        }
        Update: {
          cv_text?: string | null
          file_url?: string
          filename?: string
          filepath?: string
          filesize?: number
          filetype?: string
          id?: string
          is_selected?: boolean | null
          resume_id?: string | null
          uploaded_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_cvs_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resumes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_cvs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_data_sources"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      user_data_sources: {
        Row: {
          cv_count: number | null
          email: string | null
          linkedin_status: string | null
          selected_cv_id: string | null
          selected_cv_name: string | null
          user_id: string | null
        }
        Insert: {
          cv_count?: never
          email?: string | null
          linkedin_status?: never
          selected_cv_id?: never
          selected_cv_name?: never
          user_id?: string | null
        }
        Update: {
          cv_count?: never
          email?: string | null
          linkedin_status?: never
          selected_cv_id?: never
          selected_cv_name?: never
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_and_increment_usage: {
        Args: { p_feature: string; p_limit: number; p_user_id: string }
        Returns: Json
      }
      cleanup_old_usage_limits: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      disable_activity_log_triggers: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      fn_create_initial_admin: {
        Args: {
          admin_email: string
          admin_first_name: string
          admin_last_name: string
          admin_password: string
        }
        Returns: string
      }
      fn_get_admin_users: {
        Args: Record<PropertyKey, never>
        Returns: {
          career_priorities: string[] | null
          created_at: string | null
          current_role: string | null
          desired_industries: string[] | null
          desired_role: string | null
          email: string | null
          experience_level: string | null
          first_name: string | null
          full_name: string | null
          id: string
          industry: string | null
          is_admin: boolean | null
          job_location_preference: string | null
          job_search_status: string | null
          job_title: string | null
          job_types: string[] | null
          last_name: string | null
          location: string | null
          onboarding_completed: boolean | null
          onboarding_completed_at: string | null
          phone: string | null
          preferred_industries: string[] | null
          professional_summary: string | null
          remote_preference: boolean | null
          status: string | null
          stripe_customer_id: string | null
          stripe_customer_id_test: string | null
          updated_at: string | null
        }[]
      }
      fn_is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      fn_log_admin_action: {
        Args: {
          action: string
          details: Json
          entity_id: string
          entity_type: string
        }
        Returns: string
      }
      get_cover_letter_stats: {
        Args: { p_user_id: string }
        Returns: {
          average_length: number
          this_month_letters: number
          total_letters: number
        }[]
      }
      get_user_usage: {
        Args: { p_user_id: string }
        Returns: {
          feature: string
          month: number
          used: number
          year: number
        }[]
      }
      update_cover_letter_without_logs: {
        Args: { p_cover_letter_id: string; p_update_data: Json }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
