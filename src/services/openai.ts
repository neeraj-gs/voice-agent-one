/**
 * OpenAI Service
 * Generates comprehensive business content based on industry and business info
 * Creates detailed system prompts, knowledge base, and all content for voice agents
 */

import OpenAI from 'openai';
import type {
  IndustryType,
  AIGenerationRequest,
  AIGenerationResponse,
  Service,
  FAQ,
  Testimonial,
  KnowledgeBaseEntry,
} from '../types';

// Industry-specific context for better AI generation
const INDUSTRY_CONTEXT: Record<IndustryType, {
  description: string;
  serviceTypes: string[];
  customerTerm: string;
  appointmentTerm: string;
  serviceTerm: string;
  colorSuggestions: string[];
  typicalConcerns: string[];
  voicePersonality: string;
}> = {
  healthcare: {
    description: 'Medical clinic or healthcare practice',
    serviceTypes: ['consultations', 'checkups', 'treatments', 'screenings', 'follow-ups', 'vaccinations'],
    customerTerm: 'patient',
    appointmentTerm: 'appointment',
    serviceTerm: 'treatment',
    colorSuggestions: ['blue', 'teal', 'green'],
    typicalConcerns: ['health anxiety', 'wait times', 'insurance coverage', 'treatment costs'],
    voicePersonality: 'warm, caring, and reassuring',
  },
  dental: {
    description: 'Dental practice or orthodontics',
    serviceTypes: ['cleanings', 'fillings', 'whitening', 'extractions', 'orthodontics', 'implants'],
    customerTerm: 'patient',
    appointmentTerm: 'appointment',
    serviceTerm: 'treatment',
    colorSuggestions: ['blue', 'cyan', 'white'],
    typicalConcerns: ['dental anxiety', 'pain management', 'costs', 'insurance'],
    voicePersonality: 'gentle, reassuring, and professional',
  },
  salon: {
    description: 'Hair salon or beauty parlor',
    serviceTypes: ['haircuts', 'coloring', 'styling', 'treatments', 'extensions', 'blowouts'],
    customerTerm: 'client',
    appointmentTerm: 'appointment',
    serviceTerm: 'service',
    colorSuggestions: ['pink', 'purple', 'rose'],
    typicalConcerns: ['style preferences', 'hair damage', 'appointment availability'],
    voicePersonality: 'friendly, trendy, and enthusiastic',
  },
  spa: {
    description: 'Spa or wellness center',
    serviceTypes: ['massages', 'facials', 'body treatments', 'manicures', 'pedicures', 'wraps'],
    customerTerm: 'guest',
    appointmentTerm: 'appointment',
    serviceTerm: 'treatment',
    colorSuggestions: ['teal', 'sage', 'lavender'],
    typicalConcerns: ['relaxation needs', 'skin concerns', 'gift certificates'],
    voicePersonality: 'calm, soothing, and serene',
  },
  fitness: {
    description: 'Gym, fitness center, or personal training',
    serviceTypes: ['personal training', 'group classes', 'fitness assessments', 'nutrition coaching', 'yoga', 'pilates'],
    customerTerm: 'member',
    appointmentTerm: 'session',
    serviceTerm: 'class',
    colorSuggestions: ['orange', 'red', 'black'],
    typicalConcerns: ['fitness goals', 'class schedules', 'membership options'],
    voicePersonality: 'energetic, motivating, and supportive',
  },
  realestate: {
    description: 'Real estate agency or property management',
    serviceTypes: ['property showings', 'consultations', 'market valuations', 'listing services', 'buyer representation'],
    customerTerm: 'client',
    appointmentTerm: 'showing',
    serviceTerm: 'service',
    colorSuggestions: ['navy', 'gold', 'burgundy'],
    typicalConcerns: ['market conditions', 'pricing', 'timing', 'financing'],
    voicePersonality: 'professional, knowledgeable, and trustworthy',
  },
  restaurant: {
    description: 'Restaurant or dining establishment',
    serviceTypes: ['reservations', 'private dining', 'catering', 'events', 'tastings', 'takeout'],
    customerTerm: 'guest',
    appointmentTerm: 'reservation',
    serviceTerm: 'experience',
    colorSuggestions: ['red', 'gold', 'burgundy'],
    typicalConcerns: ['availability', 'dietary restrictions', 'special occasions'],
    voicePersonality: 'warm, hospitable, and attentive',
  },
  legal: {
    description: 'Law firm or legal practice',
    serviceTypes: ['consultations', 'case reviews', 'document preparation', 'representation', 'mediation'],
    customerTerm: 'client',
    appointmentTerm: 'consultation',
    serviceTerm: 'service',
    colorSuggestions: ['navy', 'burgundy', 'gold'],
    typicalConcerns: ['confidentiality', 'costs', 'case outcomes', 'timelines'],
    voicePersonality: 'professional, discreet, and reassuring',
  },
  accounting: {
    description: 'Accounting firm or financial services',
    serviceTypes: ['tax preparation', 'bookkeeping', 'audits', 'financial planning', 'payroll services'],
    customerTerm: 'client',
    appointmentTerm: 'meeting',
    serviceTerm: 'service',
    colorSuggestions: ['green', 'navy', 'gray'],
    typicalConcerns: ['tax deadlines', 'compliance', 'cost savings'],
    voicePersonality: 'professional, detail-oriented, and trustworthy',
  },
  automotive: {
    description: 'Auto repair shop or car dealership',
    serviceTypes: ['oil changes', 'repairs', 'inspections', 'detailing', 'maintenance', 'diagnostics'],
    customerTerm: 'customer',
    appointmentTerm: 'appointment',
    serviceTerm: 'service',
    colorSuggestions: ['red', 'blue', 'black'],
    typicalConcerns: ['repair costs', 'wait times', 'warranty coverage'],
    voicePersonality: 'straightforward, helpful, and knowledgeable',
  },
  veterinary: {
    description: 'Veterinary clinic or animal hospital',
    serviceTypes: ['wellness exams', 'vaccinations', 'surgeries', 'dental care', 'grooming', 'emergency care'],
    customerTerm: 'pet parent',
    appointmentTerm: 'appointment',
    serviceTerm: 'service',
    colorSuggestions: ['green', 'blue', 'orange'],
    typicalConcerns: ['pet health', 'costs', 'emergency situations'],
    voicePersonality: 'compassionate, caring, and reassuring',
  },
  photography: {
    description: 'Photography studio or creative services',
    serviceTypes: ['portraits', 'events', 'commercial shoots', 'editing', 'prints', 'albums'],
    customerTerm: 'client',
    appointmentTerm: 'session',
    serviceTerm: 'package',
    colorSuggestions: ['black', 'white', 'gold'],
    typicalConcerns: ['style preferences', 'pricing', 'turnaround time'],
    voicePersonality: 'creative, personable, and professional',
  },
  consulting: {
    description: 'Business consulting or professional services',
    serviceTypes: ['strategy sessions', 'audits', 'workshops', 'coaching', 'assessments'],
    customerTerm: 'client',
    appointmentTerm: 'meeting',
    serviceTerm: 'engagement',
    colorSuggestions: ['blue', 'gray', 'navy'],
    typicalConcerns: ['ROI', 'timelines', 'implementation', 'confidentiality'],
    voicePersonality: 'professional, insightful, and confident',
  },
  other: {
    description: 'General service business',
    serviceTypes: ['consultations', 'services', 'appointments', 'sessions'],
    customerTerm: 'customer',
    appointmentTerm: 'appointment',
    serviceTerm: 'service',
    colorSuggestions: ['blue', 'green', 'purple'],
    typicalConcerns: ['pricing', 'availability', 'quality'],
    voicePersonality: 'friendly, helpful, and professional',
  },
};

/**
 * Generate all business content using OpenAI
 * Creates comprehensive system prompts, detailed services, and rich knowledge base
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

  // COMPREHENSIVE PROMPT FOR DETAILED CONTENT GENERATION
  const prompt = `You are an expert business content generator specializing in creating comprehensive, production-ready content for AI voice agents.

Generate EXTREMELY DETAILED content for a ${context.description} business.

## BUSINESS DETAILS
- Business Name: ${request.businessName}
- Industry: ${request.industry}
- Location: ${request.location}
- Lead Professional: ${request.staffName}, ${request.staffTitle}
- Industry Terms: ${context.customerTerm}s, ${context.appointmentTerm}s, ${context.serviceTerm}s
- Voice Personality: ${context.voicePersonality}
- Typical Customer Concerns: ${context.typicalConcerns.join(', ')}

## REQUIRED OUTPUT (JSON FORMAT)

Generate the following comprehensive content:

### 1. tagline
A memorable 5-10 word tagline that captures the essence of ${request.businessName}.

### 2. description
A compelling 3-4 sentence business description highlighting unique value propositions, expertise of ${request.staffName}, and commitment to ${context.customerTerm} care.

### 3. services (Array of 6-8 detailed services)
For each service include:
- id: kebab-case identifier
- name: Service name
- description: Detailed 2-3 sentence description explaining what the service includes, who it's for, and what benefits the ${context.customerTerm} receives
- duration: Realistic minutes (15-120 depending on service)
- price: Realistic USD pricing for ${request.location} market (can be 0 for consultations)
- category: Group name (e.g., "Preventive Care", "Treatments", "Specialty Services")

### 4. faqs (Array of 8-10 comprehensive Q&As)
Include questions about:
- Scheduling and availability
- Pricing and payment options
- Insurance/coverage (if applicable)
- Cancellation policy
- What to expect during first visit
- Preparation requirements
- Service-specific questions
- ${context.customerTerm} concerns specific to ${request.industry}

### 5. branding
- primaryColor: Professional hex color for ${request.industry}
- secondaryColor: Complementary hex color
- accentColor: Vibrant hex color for CTAs

### 6. voiceAgent (MOST IMPORTANT - EXTREMELY DETAILED)
Create a comprehensive voice agent configuration:

- name: A friendly, professional first name appropriate for the industry
- personality: 3-4 word description (e.g., "warm, professional, and caring")
- firstMessage: A welcoming 2-sentence greeting that mentions ${request.businessName} and offers to help

- systemPrompt: THIS IS CRITICAL - Generate a VERY DETAILED system prompt (500+ words) structured as follows:

\`\`\`
## Your Identity
You are [Name], the ${context.voicePersonality} voice receptionist for ${request.businessName}, working with ${request.staffName}. [2-3 sentences about the AI's role and purpose]

## Personality Traits
- Warm & Empathetic: [Specific guidance on showing empathy]
- Professional Yet Friendly: [How to balance professionalism with approachability]
- Patient & Attentive: [Never rush callers, give them time]
- Solution-Oriented: [Always find ways to help]
- Natural Conversationalist: [Speak like a real human, not a robot]

## Voice Guidelines
- Pace: [Specific guidance on speaking speed]
- Tone: [Specific guidance on voice tone]
- Pauses: [When and how to pause naturally]
- Empathy Phrases: [List 5-6 specific phrases to use, like "I understand how concerning that must be" or "You're in excellent hands with ${request.staffName}"]

## Conversation Flow
1. Warm Greeting: [How to start]
2. Understanding Needs: [Questions to ask]
3. Information Gathering: [What details to collect - name, phone, email, preferred times]
4. Service Matching: [How to recommend appropriate services]
5. Scheduling: [How to offer and confirm ${context.appointmentTerm}s]
6. Closing: [How to end calls professionally]

## Services You Can Book
[List each service with brief description and typical duration/price]

## Business Information
- Location: [Full address]
- Hours: [Business hours]
- Contact: [Phone and email]

## Important Guidelines
- Always collect: ${context.customerTerm}'s full name, phone number, email, and preferred date/time
- Confirm all details before finalizing any booking
- If unsure about something, offer to connect them with ${request.staffName} directly
- Never provide medical/legal/financial advice - only scheduling and general information
- Handle ${context.typicalConcerns.join(', ')} with extra care and empathy

## Sample Responses
[Include 3-4 example exchanges showing ideal responses to common scenarios]
\`\`\`

### 7. testimonials (Array of 3-4 realistic reviews)
Each with:
- name: Realistic name + last initial
- role: Like "First-time ${context.customerTerm}" or "Regular ${context.customerTerm}"
- content: 2-3 sentence authentic-sounding review mentioning specific positive experiences
- rating: 4 or 5

### 8. terms
- customer: "${context.customerTerm}"
- appointment: "${context.appointmentTerm}"
- service: "${context.serviceTerm}"

### 9. knowledgeBase (Array of 6-8 COMPREHENSIVE entries)
Generate DETAILED knowledge base entries covering:

1. **About ${request.businessName}**
   - Company history/background
   - Mission and values
   - What makes them unique
   - ${request.staffName}'s qualifications and expertise

2. **Complete Service Guide**
   - Detailed description of EACH service
   - Who each service is ideal for
   - What to expect during each service
   - Pre-service preparation (if any)
   - Post-service care/follow-up

3. **${context.customerTerm.charAt(0).toUpperCase() + context.customerTerm.slice(1)} Experience**
   - What to expect on first visit
   - How to prepare for ${context.appointmentTerm}s
   - Parking/accessibility information
   - What to bring

4. **Pricing & Payment**
   - Price ranges for services
   - Payment methods accepted
   - Insurance information (if applicable)
   - Package deals or memberships

5. **Policies & Procedures**
   - Cancellation/rescheduling policy
   - Late arrival policy
   - Health/safety protocols
   - Privacy policy highlights

6. **Common Concerns & Solutions**
   - Address ${context.typicalConcerns.join(', ')}
   - FAQs with detailed answers
   - How to handle special requests

7. **Contact & Hours**
   - Full address with directions
   - Business hours by day
   - Best times to call/visit
   - Emergency contact info

8. **Why Choose ${request.businessName}**
   - Key differentiators
   - ${request.staffName}'s approach to ${context.customerTerm} care
   - Commitment to quality
   - Community involvement (if relevant)

Each knowledge base entry should be 200-400 words of detailed, helpful content.

## OUTPUT REQUIREMENTS
- Respond ONLY with valid JSON
- NO markdown formatting or code blocks
- All content must be specific to ${request.businessName} in ${request.location}
- Use realistic pricing for the ${request.industry} industry in that market
- The system prompt MUST be at least 500 words with all sections
- Knowledge base entries must be comprehensive and detailed
- Make everything sound natural and professional`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'You are an expert business content generator. Output ONLY valid JSON with no markdown formatting, code blocks, or explanations. Generate extremely detailed, production-ready content for AI voice agents.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 8000, // Increased for more detailed content
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

    // Validate and ensure all required fields exist with fallbacks
    return {
      tagline: parsed.tagline || `Welcome to ${request.businessName}`,
      description: parsed.description || `${request.businessName} provides excellent ${request.industry} services in ${request.location}.`,
      services: parsed.services || generateDefaultServices(request.industry),
      faqs: parsed.faqs || generateDefaultFAQs(request.industry, request.businessName),
      branding: {
        primaryColor: parsed.branding?.primaryColor || '#3B82F6',
        secondaryColor: parsed.branding?.secondaryColor || '#1E40AF',
        accentColor: parsed.branding?.accentColor || '#10B981',
      },
      voiceAgent: {
        name: parsed.voiceAgent?.name || 'Alex',
        personality: parsed.voiceAgent?.personality || 'friendly, professional, and helpful',
        systemPrompt: parsed.voiceAgent?.systemPrompt || generateDefaultSystemPrompt(request, context),
        firstMessage: parsed.voiceAgent?.firstMessage || `Hello and welcome to ${request.businessName}! This is ${parsed.voiceAgent?.name || 'Alex'} speaking. How may I help you today?`,
      },
      testimonials: parsed.testimonials || generateDefaultTestimonials(request.businessName, context),
      terms: {
        customer: parsed.terms?.customer || context.customerTerm,
        appointment: parsed.terms?.appointment || context.appointmentTerm,
        service: parsed.terms?.service || context.serviceTerm,
      },
      knowledgeBase: parsed.knowledgeBase || generateDefaultKnowledgeBase(request, context),
    };
  } catch (parseError) {
    console.error('Failed to parse OpenAI response:', content);
    throw new Error('Failed to parse AI-generated content. Please try again.');
  }
}

// Fallback generators for when AI fails

function generateDefaultServices(industry: IndustryType): Service[] {
  const context = INDUSTRY_CONTEXT[industry];
  return context.serviceTypes.slice(0, 6).map((type, index) => ({
    id: type.toLowerCase().replace(/\s+/g, '-'),
    name: type.charAt(0).toUpperCase() + type.slice(1),
    description: `Professional ${type} service tailored to your individual needs. Our expert team ensures a comfortable, thorough experience with attention to detail and personalized care.`,
    duration: [30, 45, 60, 30, 45, 60][index] || 45,
    price: [75, 100, 150, 50, 125, 200][index] || 100,
    category: index < 3 ? 'Core Services' : 'Specialty Services',
  }));
}

function generateDefaultFAQs(industry: IndustryType, businessName: string): FAQ[] {
  const context = INDUSTRY_CONTEXT[industry];
  return [
    {
      question: 'What are your hours of operation?',
      answer: `${businessName} is open Monday through Friday from 9:00 AM to 6:00 PM, and Saturday from 10:00 AM to 4:00 PM. We are closed on Sundays. For urgent matters, please leave a message and we'll return your call promptly.`,
    },
    {
      question: `How do I schedule a ${context.appointmentTerm}?`,
      answer: `You can schedule a ${context.appointmentTerm} by calling our office, using our online booking system, or speaking with our AI assistant. We recommend booking at least 48 hours in advance for your preferred time slot.`,
    },
    {
      question: 'What should I expect during my first visit?',
      answer: `During your first visit, we'll take time to understand your needs and goals. Please arrive 10-15 minutes early to complete any necessary paperwork. Our team will ensure you feel comfortable and informed throughout your ${context.appointmentTerm}.`,
    },
    {
      question: 'What is your cancellation policy?',
      answer: `We require at least 24 hours notice for cancellations or rescheduling. Late cancellations or no-shows may be subject to a fee. We understand emergencies happen - please contact us as soon as possible if you need to change your ${context.appointmentTerm}.`,
    },
    {
      question: 'What payment methods do you accept?',
      answer: `We accept all major credit cards, debit cards, and cash. Payment is due at the time of ${context.serviceTerm}. We also offer payment plans for larger ${context.serviceTerm}s - please ask about options.`,
    },
    {
      question: 'Do you offer consultations?',
      answer: `Yes, we offer complimentary consultations for new ${context.customerTerm}s. This allows us to understand your needs and recommend the best ${context.serviceTerm}s for you before committing to any ${context.appointmentTerm}.`,
    },
    {
      question: `How long does a typical ${context.appointmentTerm} take?`,
      answer: `${context.appointmentTerm.charAt(0).toUpperCase() + context.appointmentTerm.slice(1)} times vary depending on the ${context.serviceTerm}. Most ${context.appointmentTerm}s range from 30 minutes to 90 minutes. We'll provide an accurate time estimate when you schedule.`,
    },
    {
      question: 'What makes your business different from others?',
      answer: `At ${businessName}, we pride ourselves on personalized attention, expertise, and a genuine commitment to each ${context.customerTerm}'s success. Our team takes the time to understand your unique needs and provides solutions tailored specifically to you.`,
    },
  ];
}

function generateDefaultSystemPrompt(
  request: AIGenerationRequest,
  context: typeof INDUSTRY_CONTEXT[IndustryType]
): string {
  return `## Your Identity
You are Aria, the ${context.voicePersonality} voice receptionist for ${request.businessName}, working alongside ${request.staffName}, ${request.staffTitle}. Your role is to warmly welcome callers, answer their questions about our ${context.serviceTerm}s, and help schedule ${context.appointmentTerm}s. You represent ${request.businessName} and should embody our commitment to exceptional ${context.customerTerm} care.

## Personality Traits
- Warm & Empathetic: You genuinely care about each caller's concerns. Listen actively and acknowledge their feelings before jumping into solutions. Show understanding for their situation.
- Professional Yet Friendly: Balance professionalism with approachability. Like a trusted friend who happens to be an expert. Use professional language but keep it conversational.
- Patient & Attentive: Never rush callers. Give them time to think and respond. If they seem confused, gently clarify without making them feel embarrassed.
- Solution-Oriented: Always find ways to help. If you can't directly solve something, offer alternatives or escalate to ${request.staffName}.
- Natural Conversationalist: Speak like a real human, not a robot. Use natural language, contractions, and occasional conversational phrases.

## Voice Guidelines
- Pace: Moderate speed with clear pronunciation. Slow down slightly when explaining important details or collecting information.
- Tone: Warm with a smile in your voice. Professional but not stiff. Enthusiastic but not over-the-top.
- Pauses: Use natural pauses after questions to give callers time to respond. Pause briefly before important information.
- Empathy Phrases:
  - "I completely understand how that must feel."
  - "You're absolutely right to be concerned about that."
  - "I appreciate you sharing that with me."
  - "You're in excellent hands with ${request.staffName}."
  - "Let me make sure we take care of that for you."
  - "That's a great question - I'm happy to help."

## Conversation Flow
1. Warm Greeting: "Hello and welcome to ${request.businessName}! This is Aria speaking. Thank you for calling us today. How may I assist you?"

2. Understanding Needs: Listen carefully to what they need. Ask clarifying questions like:
   - "What ${context.serviceTerm} are you interested in today?"
   - "Is this your first time with us, or are you a returning ${context.customerTerm}?"
   - "What would be most helpful for you today?"

3. Information Gathering: Collect necessary details naturally:
   - Full name (first and last)
   - Phone number (read back to confirm)
   - Email address (for confirmation)
   - Preferred date and time
   - Any special requests or concerns

4. Service Matching: Based on their needs, recommend appropriate ${context.serviceTerm}s:
   - Explain briefly what the ${context.serviceTerm} includes
   - Mention approximate duration and pricing
   - Offer alternatives if their first choice isn't available

5. Scheduling: When booking:
   - Offer 2-3 available time slots
   - Confirm all details before finalizing
   - Mention any preparation needed
   - Provide a confirmation summary

6. Closing: End calls warmly:
   - "Is there anything else I can help you with today?"
   - Confirm their ${context.appointmentTerm} details one more time
   - "We look forward to seeing you! Thank you for choosing ${request.businessName}."

## Business Information
- Location: ${request.location}
- ${request.staffName}: ${request.staffTitle}
- Business Hours: Typically Monday-Friday 9AM-6PM, Saturday 10AM-4PM

## Important Guidelines
- Always collect: ${context.customerTerm}'s full name, phone number, email, and preferred date/time before booking
- Confirm ALL details before finalizing any ${context.appointmentTerm}
- If asked questions you cannot answer, offer to have ${request.staffName} call them back
- Never provide medical, legal, or financial advice - only scheduling and general information
- Handle concerns about ${context.typicalConcerns.join(', ')} with extra care and empathy
- If someone seems distressed, acknowledge their feelings first, then offer solutions

## Sample Responses
Caller: "I'd like to schedule an appointment."
You: "I'd be happy to help you schedule that! Is this your first time visiting ${request.businessName}, or are you a returning ${context.customerTerm}?"

Caller: "How much do your services cost?"
You: "Great question! Our ${context.serviceTerm} pricing varies depending on what you're looking for. Could you tell me a bit about what you're hoping to accomplish? That way I can give you the most accurate information."

Caller: "I need to reschedule my appointment."
You: "Absolutely, I can help you with that. May I have your name so I can pull up your ${context.appointmentTerm} details?"

Remember: You represent ${request.businessName}. Make every caller feel valued, heard, and confident in their decision to choose us.`;
}

function generateDefaultTestimonials(
  businessName: string,
  context: typeof INDUSTRY_CONTEXT[IndustryType]
): Testimonial[] {
  return [
    {
      name: 'Sarah M.',
      role: `First-time ${context.customerTerm}`,
      content: `From my very first call, I knew ${businessName} was different. The staff was incredibly welcoming and took the time to understand exactly what I needed. I couldn't be happier with my experience!`,
      rating: 5,
    },
    {
      name: 'Michael R.',
      role: `Regular ${context.customerTerm}`,
      content: `I've been coming to ${businessName} for over two years now, and the quality and care never wavers. They truly go above and beyond for every ${context.appointmentTerm}.`,
      rating: 5,
    },
    {
      name: 'Jennifer L.',
      role: `Long-time ${context.customerTerm}`,
      content: `What sets ${businessName} apart is their genuine attention to detail and commitment to excellence. Every visit exceeds my expectations. Highly recommend!`,
      rating: 5,
    },
  ];
}

function generateDefaultKnowledgeBase(
  request: AIGenerationRequest,
  context: typeof INDUSTRY_CONTEXT[IndustryType]
): KnowledgeBaseEntry[] {
  return [
    {
      title: `About ${request.businessName}`,
      content: `${request.businessName} is a premier ${context.description.toLowerCase()} located in ${request.location}. Led by ${request.staffName}, ${request.staffTitle}, we are dedicated to providing exceptional ${context.serviceTerm}s tailored to each ${context.customerTerm}'s unique needs.

Our mission is to deliver outstanding results while ensuring every ${context.customerTerm} feels valued, comfortable, and confident. We believe in building lasting relationships based on trust, expertise, and genuine care.

What sets us apart:
- Personalized attention for every ${context.customerTerm}
- Experienced and knowledgeable team led by ${request.staffName}
- Commitment to using the latest techniques and best practices
- Warm, welcoming environment designed for your comfort
- Flexible scheduling to accommodate your busy lifestyle

At ${request.businessName}, we don't just provide ${context.serviceTerm}s - we create positive experiences that our ${context.customerTerm}s remember and recommend to others.`,
    },
    {
      title: 'Services & Treatments',
      content: `${request.businessName} offers a comprehensive range of ${context.serviceTerm}s designed to meet the diverse needs of our ${context.customerTerm}s.

Our services include: ${context.serviceTypes.join(', ')}.

Each ${context.serviceTerm} begins with a thorough consultation to understand your specific needs and goals. ${request.staffName} and our team take pride in providing detailed explanations of every procedure, ensuring you feel informed and comfortable throughout your experience.

We customize our approach for each ${context.customerTerm}, recognizing that everyone's needs are unique. Whether you're visiting us for the first time or are a long-time ${context.customerTerm}, you can expect the same high level of care and attention to detail.

Pricing varies based on the specific ${context.serviceTerm} and your individual needs. We're happy to provide detailed estimates during your consultation. Ask about our package options for potential savings on multiple ${context.serviceTerm}s.`,
    },
    {
      title: `${context.customerTerm.charAt(0).toUpperCase() + context.customerTerm.slice(1)} Experience`,
      content: `What to Expect at ${request.businessName}:

First Visit:
When you arrive for your first ${context.appointmentTerm}, please come 10-15 minutes early to complete any necessary paperwork. Our friendly team will greet you and make you feel at home. You'll have an initial consultation where we discuss your needs, answer your questions, and develop a personalized plan.

During Your ${context.appointmentTerm.charAt(0).toUpperCase() + context.appointmentTerm.slice(1)}:
You can expect a comfortable, professional environment where your needs come first. ${request.staffName} and our team will explain each step of your ${context.serviceTerm}, check in regularly to ensure your comfort, and address any concerns promptly.

After Your Visit:
We'll provide any necessary aftercare instructions and recommendations. Our team is available to answer questions that may come up after you leave. We'll also help you schedule any follow-up ${context.appointmentTerm}s if needed.

What to Bring:
- Valid photo ID
- Any relevant documentation or records
- List of questions or concerns you'd like to address
- Payment method`,
    },
    {
      title: 'Pricing & Payment Information',
      content: `${request.businessName} is committed to transparent, fair pricing for all our ${context.serviceTerm}s.

Payment Methods:
We accept all major credit cards (Visa, MasterCard, American Express, Discover), debit cards, and cash. Payment is due at the time of ${context.serviceTerm}.

Pricing:
Our ${context.serviceTerm} prices vary based on complexity and duration. During your consultation, we'll provide a detailed estimate so you know exactly what to expect. We believe in transparent pricing with no hidden fees.

Package Options:
Ask about our package deals and membership options, which can provide significant savings for multiple ${context.serviceTerm}s or regular visits.

Consultations:
Initial consultations for new ${context.customerTerm}s are often complimentary. This allows us to understand your needs fully before recommending any ${context.serviceTerm}s.

Questions about pricing? Don't hesitate to ask - we're happy to discuss options that work for your budget.`,
    },
    {
      title: 'Policies & Procedures',
      content: `Scheduling Policy:
We recommend booking ${context.appointmentTerm}s at least 48 hours in advance to ensure availability. Same-day ${context.appointmentTerm}s may be available - please call to check.

Cancellation Policy:
We require at least 24 hours notice for cancellations or rescheduling. Late cancellations (less than 24 hours) or no-shows may be subject to a fee of up to 50% of the scheduled ${context.serviceTerm} price. We understand emergencies happen - please contact us as soon as possible.

Late Arrival Policy:
If you arrive more than 15 minutes late, we may need to reschedule your ${context.appointmentTerm} to avoid delays for other ${context.customerTerm}s. Please call if you're running late so we can accommodate you if possible.

Health & Safety:
We maintain the highest standards of cleanliness and safety. Our facility is regularly sanitized, and we follow all recommended health protocols.

Privacy:
Your privacy is important to us. All ${context.customerTerm} information is kept confidential and secure in accordance with applicable privacy regulations.`,
    },
    {
      title: 'Contact Information & Hours',
      content: `${request.businessName}
Location: ${request.location}

Business Hours:
Monday - Friday: 9:00 AM - 6:00 PM
Saturday: 10:00 AM - 4:00 PM
Sunday: Closed

Best Times to Call:
- Morning (9-11 AM): Usually less busy, great for detailed questions
- Early Afternoon (2-4 PM): Good availability for same-week ${context.appointmentTerm}s
- Avoid lunch hour (12-1 PM) for faster response

Getting Here:
${request.businessName} is conveniently located in ${request.location}. Free parking is typically available nearby. We're accessible by public transportation.

After-Hours:
If you call outside business hours, please leave a message and we'll return your call on the next business day. For true emergencies, please seek appropriate emergency services.

Online Booking:
You can also schedule ${context.appointmentTerm}s through our website or by speaking with our AI assistant, available during business hours.`,
    },
    {
      title: `Why Choose ${request.businessName}`,
      content: `Why ${context.customerTerm}s Choose ${request.businessName}:

Expert Leadership:
${request.staffName}, ${request.staffTitle}, brings extensive experience and a genuine passion for helping ${context.customerTerm}s achieve their goals. Under their leadership, our team is committed to excellence in every interaction.

Personalized Care:
We don't believe in one-size-fits-all solutions. Every ${context.customerTerm} receives individualized attention and ${context.serviceTerm}s tailored to their specific needs and preferences.

Quality First:
We never compromise on quality. From our facilities to our techniques, we invest in providing the best possible experience for our ${context.customerTerm}s.

Welcoming Environment:
We've created a space where every ${context.customerTerm} feels comfortable, respected, and valued. Our friendly team goes the extra mile to ensure positive experiences.

Community Trust:
${request.businessName} has earned the trust of the ${request.location} community through consistent quality, integrity, and genuine care for our ${context.customerTerm}s.

Convenience:
With flexible scheduling, easy booking options, and accommodating policies, we make it simple to fit exceptional ${context.serviceTerm} into your busy life.

Ready to experience the ${request.businessName} difference? Contact us today to schedule your ${context.appointmentTerm}!`,
    },
  ];
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
