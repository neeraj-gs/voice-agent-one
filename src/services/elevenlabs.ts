/**
 * ElevenLabs Conversational AI Service
 * Creates agents programmatically using the template creator's API key
 */

import type { BusinessConfig } from '../types';

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
  webhookUrl?: string;
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
 * Create an ElevenLabs Conversational AI Agent
 */
export async function createAgent(params: CreateAgentParams): Promise<AgentResponse> {
  const { apiKey, config, webhookUrl } = params;

  // Build the agent configuration
  const agentConfig = {
    name: `${config.name} - ${config.voiceAgent.name}`,
    conversation_config: {
      agent: {
        prompt: {
          prompt: buildSystemPrompt(config),
        },
        first_message: config.voiceAgent.firstMessage,
        language: 'en',
      },
      asr: {
        quality: 'high',
        provider: 'elevenlabs',
      },
      tts: {
        voice_id: getVoiceIdForPersonality(config.voiceAgent.personality),
        model_id: 'eleven_turbo_v2_5',
        agent_output_audio_format: 'pcm_16000',
      },
      conversation: {
        max_duration_seconds: 600, // 10 minutes max
        client_events: ['audio', 'interruption'],
      },
    },
    platform_settings: {
      widget: {
        variant: 'compact',
        avatar: {
          type: 'orb',
        },
      },
    },
  };

  // Add webhook tools if URL provided
  if (webhookUrl) {
    (agentConfig.conversation_config.agent as any).tools = [
      {
        type: 'webhook',
        name: 'check_availability',
        description: `Check available time slots for scheduling ${config.terms.appointment}s`,
        webhook: {
          url: `${webhookUrl}/check-availability`,
          method: 'POST',
        },
        parameters: {
          type: 'object',
          properties: {
            date: {
              type: 'string',
              description: 'The date to check (YYYY-MM-DD format)',
            },
            service_type: {
              type: 'string',
              description: 'The type of service/appointment',
            },
          },
          required: ['date'],
        },
      },
      {
        type: 'webhook',
        name: 'book_appointment',
        description: `Book a ${config.terms.appointment} for the ${config.terms.customer}`,
        webhook: {
          url: `${webhookUrl}/book-appointment`,
          method: 'POST',
        },
        parameters: {
          type: 'object',
          properties: {
            customer_name: {
              type: 'string',
              description: `Full name of the ${config.terms.customer}`,
            },
            customer_email: {
              type: 'string',
              description: 'Email address',
            },
            customer_phone: {
              type: 'string',
              description: 'Phone number',
            },
            date: {
              type: 'string',
              description: 'Appointment date (YYYY-MM-DD)',
            },
            time: {
              type: 'string',
              description: 'Appointment time (HH:MM)',
            },
            service_type: {
              type: 'string',
              description: `Type of ${config.terms.service}`,
            },
            notes: {
              type: 'string',
              description: 'Additional notes',
            },
          },
          required: ['customer_name', 'customer_email', 'date', 'time', 'service_type'],
        },
      },
    ];
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
