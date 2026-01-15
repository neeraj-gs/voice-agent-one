/**
 * Database Service
 * CRUD operations for businesses and voice agents using Supabase
 */

import { supabase, Business, VoiceAgent, UserPreferences } from '../lib/supabase';
import type { BusinessConfig } from '../types';

// ============================================
// HELPER: SLUG GENERATION
// ============================================

/**
 * Generate a URL-friendly slug from a business name
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Replace multiple hyphens with single
    .substring(0, 50);        // Limit length
}

/**
 * Generate a unique slug by appending a number if needed
 */
export async function generateUniqueSlug(name: string): Promise<string> {
  const baseSlug = generateSlug(name);
  let slug = baseSlug;
  let counter = 1;

  // Check if slug exists, append number if it does
  while (true) {
    const { data } = await supabase
      .from('businesses')
      .select('id')
      .eq('slug', slug)
      .single();

    if (!data) break; // Slug is unique

    slug = `${baseSlug}-${counter}`;
    counter++;

    if (counter > 100) {
      // Fallback: append random string
      slug = `${baseSlug}-${Date.now().toString(36)}`;
      break;
    }
  }

  return slug;
}

// ============================================
// BUSINESS OPERATIONS
// ============================================

/**
 * Create a new business for a user
 */
export async function createBusiness(
  userId: string,
  config: BusinessConfig
): Promise<{ data: Business | null; error: string | null }> {
  try {
    // Generate unique slug from business name
    const slug = await generateUniqueSlug(config.name);

    const { data, error } = await supabase
      .from('businesses')
      .insert({
        user_id: userId,
        name: config.name,
        slug,
        product_type: config.productType || 'website_and_agent',
        tagline: config.tagline,
        description: config.description,
        industry: config.industry,
        phone: config.phone,
        email: config.email,
        website: config.website,
        address_street: config.address?.street,
        address_city: config.address?.city,
        address_state: config.address?.state,
        address_zip: config.address?.zip,
        address_country: config.address?.country || 'United States',
        hours_weekdays: config.hours?.weekdays || '9:00 AM - 6:00 PM',
        hours_saturday: config.hours?.saturday || '10:00 AM - 4:00 PM',
        hours_sunday: config.hours?.sunday || 'Closed',
        staff_name: config.staff?.name,
        staff_title: config.staff?.title,
        staff_bio: config.staff?.bio,
        branding_primary: config.branding?.primaryColor,
        branding_secondary: config.branding?.secondaryColor,
        branding_accent: config.branding?.accentColor,
        term_customer: config.terms?.customer,
        term_appointment: config.terms?.appointment,
        term_service: config.terms?.service,
        services: config.services || [],
        faqs: config.faqs || [],
        testimonials: config.testimonials || [],
        knowledge_base: config.knowledgeBase || [],
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating business:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Failed to create business' };
  }
}

/**
 * Get all businesses for a user
 */
export async function getBusinesses(
  userId: string
): Promise<{ data: Business[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching businesses:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Failed to fetch businesses' };
  }
}

/**
 * Get a single business by ID
 */
export async function getBusiness(
  businessId: string
): Promise<{ data: Business | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching business:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Failed to fetch business' };
  }
}

/**
 * Get a business by slug (PUBLIC - no auth required)
 * Used for public landing pages
 */
export async function getBusinessBySlug(
  slug: string
): Promise<{ data: Business | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching business by slug:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Business not found' };
  }
}

/**
 * Get public business data by slug (includes voice agent info)
 * This is the main function for public landing pages
 */
export async function getPublicBusinessData(
  slug: string
): Promise<{
  data: { business: Business; voiceAgent: VoiceAgent | null } | null;
  error: string | null;
}> {
  try {
    console.log('getPublicBusinessData: Fetching business with slug:', slug);

    // Get business by slug
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('*')
      .eq('slug', slug)
      .single();

    console.log('getPublicBusinessData: Business result:', {
      found: !!business,
      businessId: business?.id,
      error: businessError,
    });

    if (businessError) throw businessError;
    if (!business) throw new Error('Business not found');

    // Get associated voice agent - use maybeSingle to avoid error if not found
    const { data: voiceAgent, error: voiceAgentError } = await supabase
      .from('voice_agents')
      .select('*')
      .eq('business_id', business.id)
      .eq('is_active', true)
      .maybeSingle();

    console.log('getPublicBusinessData: Voice agent result:', {
      found: !!voiceAgent,
      agentId: voiceAgent?.elevenlabs_agent_id,
      voiceAgentData: voiceAgent,
      error: voiceAgentError,
    });

    // If still no voice agent, try without is_active filter (in case it's not set)
    if (!voiceAgent && !voiceAgentError) {
      console.log('getPublicBusinessData: Trying without is_active filter...');
      const { data: voiceAgentAny } = await supabase
        .from('voice_agents')
        .select('*')
        .eq('business_id', business.id)
        .maybeSingle();

      if (voiceAgentAny) {
        console.log('getPublicBusinessData: Found voice agent without is_active filter:', voiceAgentAny.elevenlabs_agent_id);
        return {
          data: {
            business,
            voiceAgent: voiceAgentAny,
          },
          error: null,
        };
      }
    }

    return {
      data: {
        business,
        voiceAgent: voiceAgent || null,
      },
      error: null,
    };
  } catch (error) {
    console.error('Error fetching public business data:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Business not found' };
  }
}

/**
 * Update a business
 */
export async function updateBusiness(
  businessId: string,
  updates: Partial<BusinessConfig>
): Promise<{ error: string | null }> {
  try {
    const updateData: any = {};

    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.tagline !== undefined) updateData.tagline = updates.tagline;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.industry !== undefined) updateData.industry = updates.industry;
    if (updates.phone !== undefined) updateData.phone = updates.phone;
    if (updates.email !== undefined) updateData.email = updates.email;
    if (updates.website !== undefined) updateData.website = updates.website;
    if (updates.address) {
      updateData.address_street = updates.address.street;
      updateData.address_city = updates.address.city;
      updateData.address_state = updates.address.state;
      updateData.address_zip = updates.address.zip;
      updateData.address_country = updates.address.country;
    }
    if (updates.hours) {
      updateData.hours_weekdays = updates.hours.weekdays;
      updateData.hours_saturday = updates.hours.saturday;
      updateData.hours_sunday = updates.hours.sunday;
    }
    if (updates.staff) {
      updateData.staff_name = updates.staff.name;
      updateData.staff_title = updates.staff.title;
      updateData.staff_bio = updates.staff.bio;
    }
    if (updates.branding) {
      updateData.branding_primary = updates.branding.primaryColor;
      updateData.branding_secondary = updates.branding.secondaryColor;
      updateData.branding_accent = updates.branding.accentColor;
    }
    if (updates.terms) {
      updateData.term_customer = updates.terms.customer;
      updateData.term_appointment = updates.terms.appointment;
      updateData.term_service = updates.terms.service;
    }
    if (updates.services !== undefined) updateData.services = updates.services;
    if (updates.faqs !== undefined) updateData.faqs = updates.faqs;
    if (updates.testimonials !== undefined) updateData.testimonials = updates.testimonials;
    if (updates.knowledgeBase !== undefined) updateData.knowledge_base = updates.knowledgeBase;

    const { error } = await supabase
      .from('businesses')
      .update(updateData)
      .eq('id', businessId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error updating business:', error);
    return { error: error instanceof Error ? error.message : 'Failed to update business' };
  }
}

/**
 * Delete a business
 */
export async function deleteBusiness(
  businessId: string
): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('businesses')
      .delete()
      .eq('id', businessId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting business:', error);
    return { error: error instanceof Error ? error.message : 'Failed to delete business' };
  }
}

// ============================================
// VOICE AGENT OPERATIONS
// ============================================

/**
 * Create a voice agent for a business
 */
export async function createVoiceAgent(
  businessId: string,
  agentData: {
    elevenlabsAgentId: string;
    name: string;
    personality?: string;
    systemPrompt?: string;
    firstMessage?: string;
    openaiKey?: string;
    elevenlabsApiKey?: string;
    supabaseUrl?: string;
    supabaseAnonKey?: string;
    bookingLink?: string;              // Generic booking link (Calendly, Cal.com, TidyCal, etc.)
    webhookTools?: any[];
  }
): Promise<{ data: VoiceAgent | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('voice_agents')
      .insert({
        business_id: businessId,
        elevenlabs_agent_id: agentData.elevenlabsAgentId,
        name: agentData.name,
        personality: agentData.personality,
        system_prompt: agentData.systemPrompt,
        first_message: agentData.firstMessage,
        openai_key: agentData.openaiKey,
        elevenlabs_api_key: agentData.elevenlabsApiKey,
        supabase_url: agentData.supabaseUrl,
        supabase_anon_key: agentData.supabaseAnonKey,
        booking_link: agentData.bookingLink,
        webhook_tools: agentData.webhookTools || [],
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating voice agent:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Failed to create voice agent' };
  }
}

/**
 * Get voice agent for a business
 */
export async function getVoiceAgent(
  businessId: string
): Promise<{ data: VoiceAgent | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('voice_agents')
      .select('*')
      .eq('business_id', businessId)
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
    return { data: data || null, error: null };
  } catch (error) {
    console.error('Error fetching voice agent:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Failed to fetch voice agent' };
  }
}

/**
 * Update a voice agent
 */
export async function updateVoiceAgent(
  agentId: string,
  updates: Partial<{
    name: string;
    personality: string;
    systemPrompt: string;
    firstMessage: string;
    webhookTools: any[];
    isActive: boolean;
  }>
): Promise<{ error: string | null }> {
  try {
    const updateData: any = {};

    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.personality !== undefined) updateData.personality = updates.personality;
    if (updates.systemPrompt !== undefined) updateData.system_prompt = updates.systemPrompt;
    if (updates.firstMessage !== undefined) updateData.first_message = updates.firstMessage;
    if (updates.webhookTools !== undefined) updateData.webhook_tools = updates.webhookTools;
    if (updates.isActive !== undefined) updateData.is_active = updates.isActive;

    const { error } = await supabase
      .from('voice_agents')
      .update(updateData)
      .eq('id', agentId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error updating voice agent:', error);
    return { error: error instanceof Error ? error.message : 'Failed to update voice agent' };
  }
}

/**
 * Delete a voice agent
 */
export async function deleteVoiceAgent(
  agentId: string
): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('voice_agents')
      .delete()
      .eq('id', agentId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting voice agent:', error);
    return { error: error instanceof Error ? error.message : 'Failed to delete voice agent' };
  }
}

// ============================================
// USER PREFERENCES OPERATIONS
// ============================================

/**
 * Get user's active business
 */
export async function getUserPreferences(
  userId: string
): Promise<{ data: UserPreferences | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return { data: data || null, error: null };
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Failed to fetch preferences' };
  }
}

/**
 * Set user's active business
 */
export async function setActiveBusiness(
  userId: string,
  businessId: string | null
): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        active_business_id: businessId,
      });

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error setting active business:', error);
    return { error: error instanceof Error ? error.message : 'Failed to set active business' };
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Convert database Business to BusinessConfig type
 */
export function businessToConfig(business: Business): BusinessConfig {
  return {
    productType: business.product_type || 'website_and_agent',
    name: business.name,
    tagline: business.tagline || '',
    description: business.description || '',
    industry: business.industry as any,
    phone: business.phone || '',
    email: business.email || '',
    website: business.website,
    address: {
      street: business.address_street || '',
      city: business.address_city || '',
      state: business.address_state || '',
      zip: business.address_zip || '',
      country: business.address_country,
    },
    hours: {
      weekdays: business.hours_weekdays,
      saturday: business.hours_saturday,
      sunday: business.hours_sunday,
    },
    staff: {
      name: business.staff_name || '',
      title: business.staff_title || '',
      bio: business.staff_bio,
    },
    branding: {
      primaryColor: business.branding_primary || '#3B82F6',
      secondaryColor: business.branding_secondary || '#8B5CF6',
      accentColor: business.branding_accent || '#10B981',
    },
    terms: {
      customer: business.term_customer || 'customer',
      appointment: business.term_appointment || 'appointment',
      service: business.term_service || 'service',
    },
    services: business.services || [],
    faqs: business.faqs || [],
    testimonials: business.testimonials || [],
    knowledgeBase: business.knowledge_base || [],
    voiceAgent: {
      name: '',
      personality: '',
      systemPrompt: '',
      firstMessage: '',
    },
  };
}
