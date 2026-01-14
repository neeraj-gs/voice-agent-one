/**
 * ElevenLabs Conversational AI Service
 * Creates agents programmatically using the template creator's API key
 */

import type { BusinessConfig, WebhookTool } from '../types';

// ElevenLabs API Configuration
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

// Voice IDs for different personalities
export const VOICE_OPTIONS = {
  professional_female: 'EXAVITQu4vr4xnSDxMaL', // Sarah
  professional_male: 'VR6AewLTigWG4xSOukaG', // Arnold
  friendly_female: 'jBpfuIE2acCO8z3wKNLl', // Gigi
  friendly_male: 'TxGEqnHWrfWFTfGW9XjX', // Josh
  energetic_female: 'jsCqWAovK2LkecY7zXl4', // Freya
  energetic_male: 'ODq5zmih8GrVes37Dizd', // Patrick
};

export interface CreateAgentParams {
  apiKey: string;
  config: BusinessConfig;
  webhookTools?: WebhookTool[];
}

export interface AgentResponse {
  agent_id: string;
  name: string;
  status: string;
}

/**
 * Build the system prompt from business config
 */
export function buildSystemPrompt(config: BusinessConfig): string {
  // Start with the user-customized prompt if it exists
  if (config.voiceAgent.systemPrompt) {
    return config.voiceAgent.systemPrompt;
  }

  // Otherwise build from config
  const services = config.services
    .map((s) => `- ${s.name} (${s.duration} min, $${s.price}): ${s.description}`)
    .join('\n');

  const faqs = config.faqs
    .map((f) => `Q: ${f.question}\nA: ${f.answer}`)
    .join('\n\n');

  const knowledgeBase = config.knowledgeBase
    ?.map((k) => `## ${k.title}\n${k.content}`)
    .join('\n\n') || '';

  return `You are ${config.voiceAgent.name}, the AI assistant for ${config.name}. Your personality is ${config.voiceAgent.personality}.

## Business Information
- Business Name: ${config.name}
- Tagline: ${config.tagline}
- Description: ${config.description}
- Phone: ${config.phone}
- Email: ${config.email}
- Address: ${config.address.street}, ${config.address.city}, ${config.address.state} ${config.address.zip}

## Business Hours
- Weekdays: ${config.hours.weekdays}
- Saturday: ${config.hours.saturday}
- Sunday: ${config.hours.sunday}

## Staff
- ${config.staff.name}, ${config.staff.title}

## Services Offered
${services}

## Frequently Asked Questions
${faqs}

${knowledgeBase ? `## Additional Information\n${knowledgeBase}` : ''}

## Your Role
You help ${config.terms.customer}s with:
1. Scheduling ${config.terms.appointment}s with ${config.staff.name}
2. Answering questions about our ${config.terms.service}s
3. Providing business information (hours, location, contact)
4. Rescheduling or canceling existing ${config.terms.appointment}s

## Guidelines
- Be ${config.voiceAgent.personality}
- Always collect the ${config.terms.customer}'s name, email, and phone number before booking
- Confirm the ${config.terms.appointment} details before finalizing
- If you cannot help with something, offer to connect them with ${config.staff.name} directly
- Keep responses concise and helpful

Remember: You represent ${config.name}. Be professional, helpful, and make every caller feel valued.`;
}

/**
 * Build knowledge base text from config
 */
export function buildKnowledgeBase(config: BusinessConfig): string {
  const sections: string[] = [];

  // Business info
  sections.push(`# ${config.name}
${config.description}

Contact: ${config.phone} | ${config.email}
Address: ${config.address.street}, ${config.address.city}, ${config.address.state} ${config.address.zip}

Hours:
- Weekdays: ${config.hours.weekdays}
- Saturday: ${config.hours.saturday}
- Sunday: ${config.hours.sunday}`);

  // Services
  sections.push(`# Services

${config.services.map((s) => `## ${s.name}
${s.description}
- Duration: ${s.duration} minutes
- Price: ${s.price === 0 ? 'Free' : `$${s.price}`}
- Category: ${s.category}`).join('\n\n')}`);

  // FAQs
  sections.push(`# Frequently Asked Questions

${config.faqs.map((f) => `**Q: ${f.question}**
A: ${f.answer}`).join('\n\n')}`);

  // Custom knowledge
  if (config.knowledgeBase && config.knowledgeBase.length > 0) {
    sections.push(`# Additional Information

${config.knowledgeBase.map((k) => `## ${k.title}
${k.content}`).join('\n\n')}`);
  }

  return sections.join('\n\n---\n\n');
}

/**
 * Build webhook tools configuration for ElevenLabs agent
 * Based on ElevenLabs API: api_schema is at tool level with url, method, request_body_schema
 * Reference: https://elevenlabs.io/docs/agents-platform/api-reference/agents/create
 *
 * IMPORTANT: Field names must match exactly what n8n workflow expects!
 */
function buildWebhookTools(webhookTools: WebhookTool[], config: BusinessConfig): any[] {
  const tools: any[] = [];

  for (const tool of webhookTools) {
    if (!tool.url || !tool.enabled) continue;

    if (tool.id === 'check_history') {
      tools.push({
        type: 'webhook',
        name: 'check_history',
        description: `Check ${config.terms.customer} history and past ${config.terms.appointment}s from the database. Use this when the ${config.terms.customer} mentions they've visited before or to look up their records. Call this BEFORE booking to check if they're a returning ${config.terms.customer}.`,
        api_schema: {
          url: tool.url,
          method: 'POST',
          request_body_schema: {
            type: 'object',
            properties: {
              email_address: {
                type: 'string',
                description: `Email address of the ${config.terms.customer}. Always ask for email to look up their history.`,
              },
              phone_number: {
                type: 'string',
                description: `Phone number of the ${config.terms.customer} (optional, can also be used for lookup)`,
              },
              patient_name: {
                type: 'string',
                description: `Full name of the ${config.terms.customer} (optional)`,
              },
            },
            required: ['email_address'],
          },
        },
      });
    }

    if (tool.id === 'check_availability') {
      tools.push({
        type: 'webhook',
        name: 'check_availability',
        description: `Check available time slots for scheduling ${config.terms.appointment}s. Use this when the ${config.terms.customer} wants to book and you need to find available times. Returns available dates and times.`,
        api_schema: {
          url: tool.url,
          method: 'POST',
          request_body_schema: {
            type: 'object',
            properties: {
              preferred_date: {
                type: 'string',
                description: 'The date the customer wants to book (YYYY-MM-DD format, e.g., 2025-01-20)',
              },
              preferred_time: {
                type: 'string',
                description: 'The time the customer prefers (HH:MM in 24-hour format, e.g., 14:00 for 2 PM)',
              },
              service_type: {
                type: 'string',
                description: `Type of ${config.terms.service} the ${config.terms.customer} wants`,
              },
            },
            required: ['preferred_date', 'preferred_time'],
          },
        },
      });
    }

    if (tool.id === 'book_appointment') {
      tools.push({
        type: 'webhook',
        name: 'book_appointment',
        description: `Book, reschedule, or cancel a ${config.terms.appointment}. Use action_type to specify: "Book" for new ${config.terms.appointment}s, "Reschedule" to change existing ${config.terms.appointment}, "Cancel" to cancel. Always collect all required information before calling.`,
        api_schema: {
          url: tool.url,
          method: 'POST',
          request_body_schema: {
            type: 'object',
            properties: {
              action_type: {
                type: 'string',
                description: 'The action to perform: "Book" for new appointment, "Reschedule" to change existing, "Cancel" to cancel. Default is "Book".',
              },
              patient_name: {
                type: 'string',
                description: `Full name of the ${config.terms.customer}`,
              },
              email_address: {
                type: 'string',
                description: `Email address of the ${config.terms.customer} for confirmation`,
              },
              phone_number: {
                type: 'string',
                description: `Phone number of the ${config.terms.customer}`,
              },
              appointment_date: {
                type: 'string',
                description: `${config.terms.appointment} date (YYYY-MM-DD format, e.g., 2025-01-20)`,
              },
              appointment_time: {
                type: 'string',
                description: `${config.terms.appointment} time (HH:MM in 24-hour format, e.g., 14:00)`,
              },
              primary_concern: {
                type: 'string',
                description: `The main reason for the ${config.terms.appointment} or ${config.terms.service} type requested`,
              },
              is_first_visit: {
                type: 'boolean',
                description: `Whether this is the ${config.terms.customer}'s first visit (true/false)`,
              },
              call_summary: {
                type: 'string',
                description: 'Brief summary of the conversation and any special requests or notes',
              },
            },
            required: ['action_type', 'patient_name', 'email_address', 'appointment_date', 'appointment_time'],
          },
        },
      });
    }
  }

  return tools;
}

/**
 * Create an ElevenLabs Conversational AI Agent
 * API Reference: https://elevenlabs.io/docs/agents-platform/api-reference/agents/create
 */
export async function createAgent(params: CreateAgentParams): Promise<AgentResponse> {
  const { apiKey, config, webhookTools } = params;

  // Build webhook tools if provided
  const tools = webhookTools && webhookTools.length > 0
    ? buildWebhookTools(webhookTools, config)
    : [];

  // Build the agent configuration (workflow is optional)
  const agentConfig: any = {
    name: `${config.name} - ${config.voiceAgent.name}`,
    conversation_config: {
      agent: {
        prompt: {
          prompt: buildSystemPrompt(config),
          llm: 'gpt-4o-mini', // Valid model for English agents
          temperature: 0.7,
        },
        first_message: config.voiceAgent.firstMessage,
        language: 'en',
      },
      tts: {
        voice_id: getVoiceIdForPersonality(config.voiceAgent.personality),
        model_id: 'eleven_turbo_v2', // Must be turbo or flash v2 for English
      },
      conversation: {
        max_duration_seconds: 600, // 10 minutes max
      },
    },
  };

  // Add tools to prompt if any are configured
  if (tools.length > 0) {
    agentConfig.conversation_config.agent.prompt.tools = tools;
  }

  // Make the API call
  const response = await fetch(`${ELEVENLABS_API_URL}/convai/agents/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
    },
    body: JSON.stringify(agentConfig),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('ElevenLabs API Error:', error);
    throw new Error(`Failed to create agent: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  return {
    agent_id: data.agent_id,
    name: data.name,
    status: 'created',
  };
}

/**
 * Update an existing agent
 */
export async function updateAgent(
  apiKey: string,
  agentId: string,
  config: BusinessConfig
): Promise<AgentResponse> {
  const response = await fetch(`${ELEVENLABS_API_URL}/convai/agents/${agentId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
    },
    body: JSON.stringify({
      name: `${config.name} - ${config.voiceAgent.name}`,
      conversation_config: {
        agent: {
          prompt: {
            prompt: buildSystemPrompt(config),
          },
          first_message: config.voiceAgent.firstMessage,
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update agent: ${response.status}`);
  }

  const data = await response.json();

  return {
    agent_id: data.agent_id,
    name: data.name,
    status: 'updated',
  };
}

/**
 * Delete an agent
 */
export async function deleteAgent(apiKey: string, agentId: string): Promise<void> {
  const response = await fetch(`${ELEVENLABS_API_URL}/convai/agents/${agentId}`, {
    method: 'DELETE',
    headers: {
      'xi-api-key': apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete agent: ${response.status}`);
  }
}

/**
 * Get agent details
 */
export async function getAgent(apiKey: string, agentId: string): Promise<any> {
  const response = await fetch(`${ELEVENLABS_API_URL}/convai/agents/${agentId}`, {
    method: 'GET',
    headers: {
      'xi-api-key': apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get agent: ${response.status}`);
  }

  return response.json();
}

/**
 * Add knowledge base to agent
 */
export async function addKnowledgeBase(
  apiKey: string,
  agentId: string,
  config: BusinessConfig
): Promise<void> {
  const knowledgeText = buildKnowledgeBase(config);

  // Create a text document for the knowledge base
  const formData = new FormData();
  const blob = new Blob([knowledgeText], { type: 'text/plain' });
  formData.append('file', blob, 'knowledge-base.txt');

  const response = await fetch(
    `${ELEVENLABS_API_URL}/convai/agents/${agentId}/add-to-knowledge-base`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    console.warn('Failed to add knowledge base:', response.status);
  }
}

/**
 * Get voice ID based on personality description
 */
function getVoiceIdForPersonality(personality: string): string {
  const lower = personality.toLowerCase();

  if (lower.includes('energetic') || lower.includes('enthusiastic')) {
    return lower.includes('female') ? VOICE_OPTIONS.energetic_female : VOICE_OPTIONS.energetic_male;
  }

  if (lower.includes('friendly') || lower.includes('warm') || lower.includes('casual')) {
    return lower.includes('male') ? VOICE_OPTIONS.friendly_male : VOICE_OPTIONS.friendly_female;
  }

  // Default to professional
  return lower.includes('male') ? VOICE_OPTIONS.professional_male : VOICE_OPTIONS.professional_female;
}

/**
 * Validate ElevenLabs API key
 */
export async function validateElevenLabsKey(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch(`${ELEVENLABS_API_URL}/user`, {
      headers: {
        'xi-api-key': apiKey,
      },
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Get widget embed code for an agent
 */
export function getWidgetEmbedCode(agentId: string): string {
  return `<elevenlabs-convai agent-id="${agentId}"></elevenlabs-convai>
<script src="https://elevenlabs.io/convai-widget/index.js" async type="text/javascript"></script>`;
}

/**
 * Get signed URL for conversation (for secure embedding)
 */
export async function getSignedUrl(apiKey: string, agentId: string): Promise<string> {
  const response = await fetch(
    `${ELEVENLABS_API_URL}/convai/conversation/get_signed_url?agent_id=${agentId}`,
    {
      headers: {
        'xi-api-key': apiKey,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to get signed URL');
  }

  const data = await response.json();
  return data.signed_url;
}
