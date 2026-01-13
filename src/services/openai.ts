/**
 * OpenAI Service
 * Generates business content based on industry and business info
 */

import OpenAI from 'openai';
import type {
  IndustryType,
  AIGenerationRequest,
  AIGenerationResponse,
  Service,
  FAQ,
  Testimonial,
} from '../types';

// Industry-specific context for better AI generation
const INDUSTRY_CONTEXT: Record<IndustryType, {
  description: string;
  serviceTypes: string[];
  customerTerm: string;
  appointmentTerm: string;
  serviceTerm: string;
  colorSuggestions: string[];
}> = {
  healthcare: {
    description: 'Medical clinic or healthcare practice',
    serviceTypes: ['consultations', 'checkups', 'treatments', 'screenings', 'follow-ups'],
    customerTerm: 'patient',
    appointmentTerm: 'appointment',
    serviceTerm: 'treatment',
    colorSuggestions: ['blue', 'teal', 'green'],
  },
  dental: {
    description: 'Dental practice or orthodontics',
    serviceTypes: ['cleanings', 'fillings', 'whitening', 'extractions', 'orthodontics'],
    customerTerm: 'patient',
    appointmentTerm: 'appointment',
    serviceTerm: 'treatment',
    colorSuggestions: ['blue', 'cyan', 'white'],
  },
  salon: {
    description: 'Hair salon or beauty parlor',
    serviceTypes: ['haircuts', 'coloring', 'styling', 'treatments', 'extensions'],
    customerTerm: 'client',
    appointmentTerm: 'appointment',
    serviceTerm: 'service',
    colorSuggestions: ['pink', 'purple', 'rose'],
  },
  spa: {
    description: 'Spa or wellness center',
    serviceTypes: ['massages', 'facials', 'body treatments', 'manicures', 'pedicures'],
    customerTerm: 'guest',
    appointmentTerm: 'appointment',
    serviceTerm: 'treatment',
    colorSuggestions: ['teal', 'sage', 'lavender'],
  },
  fitness: {
    description: 'Gym, fitness center, or personal training',
    serviceTypes: ['personal training', 'classes', 'assessments', 'consultations', 'programs'],
    customerTerm: 'member',
    appointmentTerm: 'session',
    serviceTerm: 'class',
    colorSuggestions: ['orange', 'red', 'black'],
  },
  realestate: {
    description: 'Real estate agency or property management',
    serviceTypes: ['showings', 'consultations', 'valuations', 'listings', 'buyer meetings'],
    customerTerm: 'client',
    appointmentTerm: 'showing',
    serviceTerm: 'service',
    colorSuggestions: ['navy', 'gold', 'burgundy'],
  },
  restaurant: {
    description: 'Restaurant or dining establishment',
    serviceTypes: ['reservations', 'private dining', 'catering', 'events', 'tastings'],
    customerTerm: 'guest',
    appointmentTerm: 'reservation',
    serviceTerm: 'experience',
    colorSuggestions: ['red', 'gold', 'burgundy'],
  },
  legal: {
    description: 'Law firm or legal practice',
    serviceTypes: ['consultations', 'case reviews', 'document preparation', 'representation'],
    customerTerm: 'client',
    appointmentTerm: 'consultation',
    serviceTerm: 'service',
    colorSuggestions: ['navy', 'burgundy', 'gold'],
  },
  accounting: {
    description: 'Accounting firm or financial services',
    serviceTypes: ['tax preparation', 'bookkeeping', 'audits', 'consulting', 'planning'],
    customerTerm: 'client',
    appointmentTerm: 'meeting',
    serviceTerm: 'service',
    colorSuggestions: ['green', 'navy', 'gray'],
  },
  automotive: {
    description: 'Auto repair shop or car dealership',
    serviceTypes: ['oil changes', 'repairs', 'inspections', 'detailing', 'test drives'],
    customerTerm: 'customer',
    appointmentTerm: 'appointment',
    serviceTerm: 'service',
    colorSuggestions: ['red', 'blue', 'black'],
  },
  veterinary: {
    description: 'Veterinary clinic or animal hospital',
    serviceTypes: ['checkups', 'vaccinations', 'surgeries', 'dental care', 'grooming'],
    customerTerm: 'pet parent',
    appointmentTerm: 'appointment',
    serviceTerm: 'service',
    colorSuggestions: ['green', 'blue', 'orange'],
  },
  photography: {
    description: 'Photography studio or creative services',
    serviceTypes: ['portraits', 'events', 'commercial', 'editing', 'prints'],
    customerTerm: 'client',
    appointmentTerm: 'session',
    serviceTerm: 'package',
    colorSuggestions: ['black', 'white', 'gold'],
  },
  consulting: {
    description: 'Business consulting or professional services',
    serviceTypes: ['strategy sessions', 'audits', 'workshops', 'coaching', 'reviews'],
    customerTerm: 'client',
    appointmentTerm: 'meeting',
    serviceTerm: 'engagement',
    colorSuggestions: ['blue', 'gray', 'navy'],
  },
  other: {
    description: 'General service business',
    serviceTypes: ['consultations', 'services', 'appointments', 'sessions'],
    customerTerm: 'customer',
    appointmentTerm: 'appointment',
    serviceTerm: 'service',
    colorSuggestions: ['blue', 'green', 'purple'],
  },
};

/**
 * Generate all business content using OpenAI
 */
export async function generateBusinessContent(
  apiKey: string,
  request: AIGenerationRequest
): Promise<AIGenerationResponse> {
  const openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true, // Required for client-side usage
  });

  const context = INDUSTRY_CONTEXT[request.industry];

  const prompt = `You are a business content generator. Generate comprehensive content for a ${context.description} business.

Business Details:
- Name: ${request.businessName}
- Industry: ${request.industry}
- Location: ${request.location}
- Owner/Lead: ${request.staffName}, ${request.staffTitle}

Generate the following in JSON format:

1. **tagline**: A catchy 5-10 word tagline for the business
2. **description**: A 2-3 sentence business description (professional, welcoming)
3. **services**: Array of 5-6 services with:
   - id (kebab-case)
   - name
   - description (1-2 sentences)
   - duration (in minutes, realistic for industry)
   - price (realistic USD, can be 0 for consultations)
   - category (group similar services)

4. **faqs**: Array of 5-6 common questions and answers for this industry
5. **branding**: Color scheme with:
   - primaryColor (hex, professional for ${request.industry})
   - secondaryColor (hex, complementary)
   - accentColor (hex, for highlights/CTAs)

6. **voiceAgent**: AI assistant configuration:
   - name (friendly first name)
   - personality (2-3 word description like "friendly and professional")
   - systemPrompt (detailed prompt for voice AI, include business info, services, guidelines)
   - firstMessage (greeting when customer calls, mention business name)

7. **testimonials**: Array of 3 realistic testimonials with:
   - name (realistic first name + last initial)
   - role (like "New Patient" or "Long-time Client")
   - content (2-3 sentence positive review)
   - rating (4 or 5)

8. **terms**: Industry terminology:
   - customer: "${context.customerTerm}"
   - appointment: "${context.appointmentTerm}"
   - service: "${context.serviceTerm}"

IMPORTANT:
- Make content specific to ${request.businessName} in ${request.location}
- Use realistic pricing for the ${request.industry} industry
- The voice agent system prompt should be comprehensive (200+ words)
- All content should be professional and ready to use

Respond ONLY with valid JSON, no markdown or explanation.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'You are a business content generator that outputs only valid JSON. Never include markdown formatting or explanations.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 4000,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No content generated from OpenAI');
  }

  // Parse the JSON response
  try {
    // Remove any markdown code blocks if present
    const cleanedContent = content
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const parsed = JSON.parse(cleanedContent) as AIGenerationResponse;

    // Validate and ensure all required fields exist
    return {
      tagline: parsed.tagline || `Welcome to ${request.businessName}`,
      description: parsed.description || `${request.businessName} provides excellent ${request.industry} services in ${request.location}.`,
      services: parsed.services || generateDefaultServices(request.industry),
      faqs: parsed.faqs || generateDefaultFAQs(request.industry),
      branding: {
        primaryColor: parsed.branding?.primaryColor || '#3B82F6',
        secondaryColor: parsed.branding?.secondaryColor || '#1E40AF',
        accentColor: parsed.branding?.accentColor || '#10B981',
      },
      voiceAgent: {
        name: parsed.voiceAgent?.name || 'Alex',
        personality: parsed.voiceAgent?.personality || 'friendly and helpful',
        systemPrompt: parsed.voiceAgent?.systemPrompt || generateDefaultSystemPrompt(request),
        firstMessage: parsed.voiceAgent?.firstMessage || `Hello! Thank you for calling ${request.businessName}. How can I help you today?`,
      },
      testimonials: parsed.testimonials || [],
      terms: {
        customer: parsed.terms?.customer || context.customerTerm,
        appointment: parsed.terms?.appointment || context.appointmentTerm,
        service: parsed.terms?.service || context.serviceTerm,
      },
    };
  } catch (parseError) {
    console.error('Failed to parse OpenAI response:', content);
    throw new Error('Failed to parse AI-generated content. Please try again.');
  }
}

// Fallback generators
function generateDefaultServices(industry: IndustryType): Service[] {
  const context = INDUSTRY_CONTEXT[industry];
  return context.serviceTypes.slice(0, 5).map((type, index) => ({
    id: type.toLowerCase().replace(/\s+/g, '-'),
    name: type.charAt(0).toUpperCase() + type.slice(1),
    description: `Professional ${type} service tailored to your needs.`,
    duration: [30, 45, 60, 30, 45][index] || 30,
    price: [50, 75, 100, 50, 75][index] || 50,
    category: 'General',
  }));
}

function generateDefaultFAQs(industry: IndustryType): FAQ[] {
  return [
    {
      question: 'What are your hours of operation?',
      answer: 'We are open Monday through Friday from 9 AM to 6 PM, and Saturday from 10 AM to 4 PM.',
    },
    {
      question: 'How do I schedule an appointment?',
      answer: 'You can schedule an appointment by calling us, using our online booking system, or speaking with our AI assistant.',
    },
    {
      question: 'Do you accept insurance?',
      answer: 'Please contact us directly to discuss insurance and payment options.',
    },
    {
      question: 'What is your cancellation policy?',
      answer: 'We require 24 hours notice for cancellations to avoid any fees.',
    },
    {
      question: 'Do you offer consultations?',
      answer: 'Yes, we offer complimentary consultations for new clients.',
    },
  ];
}

function generateDefaultSystemPrompt(request: AIGenerationRequest): string {
  const context = INDUSTRY_CONTEXT[request.industry];
  return `You are an AI assistant for ${request.businessName}, a ${context.description} located in ${request.location}.

Your role is to help ${context.customerTerm}s schedule ${context.appointmentTerm}s with ${request.staffName}, ${request.staffTitle}.

Be professional, friendly, and helpful. Collect the ${context.customerTerm}'s name, email, phone number, and preferred date/time for their ${context.appointmentTerm}.

Available ${context.serviceTerm}s include: ${context.serviceTypes.join(', ')}.

Always confirm the details before booking and thank the ${context.customerTerm} for choosing ${request.businessName}.`;
}

/**
 * Validate OpenAI API key
 */
export async function validateOpenAIKey(apiKey: string): Promise<boolean> {
  try {
    const openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true,
    });

    // Make a minimal API call to validate the key
    await openai.models.list();
    return true;
  } catch (error) {
    return false;
  }
}
