/**
 * Supabase Client Configuration
 * Initialize and export Supabase client for auth and database operations
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase credentials not found. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);

// Type definitions for database tables
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export type ProductType = 'website_and_agent' | 'agent_only';

export interface Business {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  product_type: ProductType;          // 'website_and_agent' or 'agent_only'
  tagline: string | null;
  description: string | null;
  industry: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  address_street: string | null;
  address_city: string | null;
  address_state: string | null;
  address_zip: string | null;
  address_country: string;
  hours_weekdays: string;
  hours_saturday: string;
  hours_sunday: string;
  staff_name: string | null;
  staff_title: string | null;
  staff_bio: string | null;
  branding_primary: string | null;
  branding_secondary: string | null;
  branding_accent: string | null;
  term_customer: string | null;
  term_appointment: string | null;
  term_service: string | null;
  services: any[];
  faqs: any[];
  testimonials: any[];
  knowledge_base: any[];
  created_at: string;
  updated_at: string;
}

export interface VoiceAgent {
  id: string;
  business_id: string;
  elevenlabs_agent_id: string;
  name: string;
  personality: string | null;
  system_prompt: string | null;
  first_message: string | null;
  openai_key: string | null;
  elevenlabs_api_key: string | null;
  supabase_url: string | null;
  supabase_anon_key: string | null;
  booking_link: string | null;        // Generic booking link (Calendly, Cal.com, TidyCal, etc.)
  calcom_link: string | null;         // Deprecated: kept for backwards compatibility
  webhook_tools: any[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  user_id: string;
  active_business_id: string | null;
  updated_at: string;
}
