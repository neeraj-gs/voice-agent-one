# Voice Agent One

AI-powered voice agent template that dynamically configures itself based on your business type. One-time setup, instant deployment.

## Features

- **One-Time Setup** - Enter your business info and API keys once, and the site configures itself
- **AI Content Generation** - OpenAI generates your website content, services, FAQs, and voice agent prompts
- **Auto-Create Voice Agent** - Automatically creates ElevenLabs agent from the frontend (no manual setup needed)
- **Multi-Industry Support** - Works for healthcare, dental, salon, fitness, real estate, restaurants, and more
- **Dynamic Branding** - Colors and styling automatically match your industry
- **Voice Agent Integration** - ElevenLabs Conversational AI for 24/7 customer interactions
- **Full Content Editing** - Edit all AI-generated content, add custom knowledge base entries
- **Analytics Dashboard** - Track calls, bookings, and customer engagement

## How It Works

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Setup Wizard  │────▶│  OpenAI GPT-4    │────▶│  Your Website   │
│  (Industry +    │     │  Generates all   │     │  Landing Page   │
│   Business Info)│     │  content         │     │  Call Page      │
└─────────────────┘     └──────────────────┘     │  Dashboard      │
                                                  └─────────────────┘
                                                          │
                                                          ▼
                                                  ┌─────────────────┐
                                                  │  ElevenLabs     │
                                                  │  Voice Agent    │
                                                  │  (Auto-Created) │
                                                  └─────────────────┘
```

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/YOUR_USERNAME/voice-agent-one.git
cd voice-agent-one
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

### 3. Complete Setup Wizard

Visit `http://localhost:5173` and complete the setup wizard.

**Step 1: Select Industry**
- Real Estate, Dental, Salon, Healthcare, Fitness, etc.

**Step 2: Enter Business Information**
- Business name, phone, email
- Address and location
- Staff/owner details
- Business hours

**Step 3: Enter API Keys**
- **OpenAI API Key** (required) - For AI content generation
- **ElevenLabs** - Choose one:
  - **Option A: Auto-Create Agent** - Enter your ElevenLabs API key and we'll create the agent for you
  - **Option B: Existing Agent** - Enter your pre-created Agent ID
- Supabase URL/Key (optional) - For data storage
- Cal.com link (optional) - For booking integration

**Step 4: Review & Edit**
- AI generates all content
- Edit services, FAQs, branding, voice agent prompts
- Add custom knowledge base entries
- Click "Complete Setup"

### 4. Your Site is Ready!

After setup:
- `/site` - Landing page with your business info
- `/call` - Voice agent calling interface
- `/dashboard` - Analytics and call logs

## Environment Variables

**No environment variables are required!**

All configuration is stored in browser localStorage. Users enter their API keys during the setup wizard.

However, if you want to pre-configure keys for development, you can create a `.env` file:

```env
# Optional - for development convenience only
VITE_OPENAI_API_KEY=sk-...
VITE_ELEVENLABS_API_KEY=xi-...
```

## API Keys Required

| Service | Purpose | Where to Get |
|---------|---------|--------------|
| **OpenAI** | AI content generation (GPT-4) | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| **ElevenLabs** | Voice AI agent | [elevenlabs.io/app/settings/api-keys](https://elevenlabs.io/app/settings/api-keys) |

### Getting Your OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Go to **API Keys** in the sidebar
4. Click **Create new secret key**
5. Copy the key (starts with `sk-`)

### Getting Your ElevenLabs API Key (for Auto-Create)

1. Go to [elevenlabs.io](https://elevenlabs.io)
2. Sign up or log in
3. Click your profile icon → **Profile + API key**
4. Copy your API key (starts with `xi-` or similar)

## ElevenLabs Agent Auto-Creation

When you choose "Auto-Create Agent" in the setup wizard, here's what happens:

```
┌──────────────────────────────────────────────────────────────────┐
│                    Voice Agent One                                │
│                                                                   │
│  1. User clicks "Complete Setup"                                 │
│                     │                                             │
│                     ▼                                             │
│  2. Build System Prompt from:                                     │
│     - Business name, address, hours                              │
│     - Services with pricing                                       │
│     - FAQs                                                        │
│     - Staff information                                           │
│     - Industry-specific terminology                               │
│                     │                                             │
│                     ▼                                             │
│  3. Call ElevenLabs API:                                         │
│     POST https://api.elevenlabs.io/v1/convai/agents              │
│     {                                                             │
│       name: "Business Name Assistant",                           │
│       conversation_config: {                                      │
│         agent: {                                                  │
│           prompt: { prompt: systemPrompt },                      │
│           first_message: "Hello! Thanks for calling...",         │
│           language: "en"                                          │
│         },                                                        │
│         tts: { voice_id: "EXAVITQu4vr4xnSDxMaL" }                │
│       }                                                           │
│     }                                                             │
│                     │                                             │
│                     ▼                                             │
│  4. Receive Agent ID → Store in localStorage                     │
│                     │                                             │
│                     ▼                                             │
│  5. Ready to use! Agent embedded in /call page                   │
└──────────────────────────────────────────────────────────────────┘
```

### What Gets Configured in the Agent

| Setting | Value |
|---------|-------|
| **Name** | `{Business Name} Assistant` |
| **Voice** | Sarah (professional female voice) |
| **Language** | English |
| **First Message** | Customized greeting with business name |
| **System Prompt** | Full business context including services, hours, FAQs |
| **LLM** | GPT-4 Turbo |

### System Prompt Includes

- Business name, phone, address
- Complete list of services with descriptions and pricing
- Business hours for each day
- All FAQs with answers
- Staff information
- Industry-appropriate terminology
- Booking/appointment instructions

## Project Structure

```
voice-agent-one/
├── src/
│   ├── components/
│   │   ├── ui/              # Button, Input, Card, Textarea
│   │   ├── layout/          # Header, Footer
│   │   ├── onboarding/      # OnboardingWizard, ConfigEditor
│   │   ├── voice/           # VoiceAgent widget
│   │   └── dashboard/       # Stats, charts, call logs
│   ├── pages/
│   │   ├── TemplateLandingPage  # Marketing page (/)
│   │   ├── LandingPage          # Business website (/site)
│   │   ├── CallPage             # Voice agent (/call)
│   │   ├── DashboardPage        # Analytics (/dashboard)
│   │   └── SetupPage            # Wizard (/setup)
│   ├── services/
│   │   ├── openai.ts        # AI content generation
│   │   └── elevenlabs.ts    # Agent creation API
│   ├── stores/
│   │   └── configStore.ts   # Zustand + localStorage
│   └── types/
│       └── index.ts         # TypeScript definitions
├── package.json
└── README.md
```

## Configuration Storage

All configuration is stored in browser localStorage under `voice-agent-config`:

```json
{
  "isSetupComplete": true,
  "business": {
    "name": "Premier Realty Group",
    "industry": "realestate",
    "tagline": "Your Dream Home Awaits",
    "services": [...],
    "faqs": [...],
    "branding": {
      "primaryColor": "#1e40af",
      "secondaryColor": "#3b82f6",
      "accentColor": "#f59e0b"
    },
    "voiceAgent": {
      "name": "Alex",
      "personality": "Professional and friendly",
      "systemPrompt": "...",
      "firstMessage": "..."
    },
    "knowledgeBase": [...]
  },
  "apiKeys": {
    "openaiKey": "sk-...",
    "elevenLabsAgentId": "agent_...",
    "elevenLabsApiKey": "xi-..."
  }
}
```

## Supported Industries

| Industry | Customer Term | Appointment Term |
|----------|--------------|------------------|
| Healthcare | patient | appointment |
| Dental | patient | appointment |
| Salon | client | appointment |
| Spa | guest | session |
| Fitness | member | session |
| Real Estate | client | showing |
| Restaurant | guest | reservation |
| Legal | client | consultation |
| Accounting | client | meeting |
| Automotive | customer | appointment |
| Veterinary | pet parent | appointment |
| Photography | client | session |
| Consulting | client | consultation |

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy (no configuration needed)

### Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

### Manual Build

```bash
npm run build
# Serve the dist/ folder with any static server
```

## Reset Setup

To start over:
1. Open browser DevTools
2. Go to Application → Local Storage
3. Delete `voice-agent-config`
4. Refresh the page

Or run in console:
```javascript
localStorage.removeItem('voice-agent-config')
location.reload()
```

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Framer Motion** - Animations
- **Recharts** - Dashboard charts
- **OpenAI SDK** - Content generation
- **ElevenLabs React SDK** - Voice agent widget

## Troubleshooting

### "Invalid OpenAI API key"
- Make sure the key starts with `sk-`
- Check that you have credits in your OpenAI account
- Verify the key hasn't been revoked

### "Failed to create voice agent"
- Verify your ElevenLabs API key is correct
- Check that you have available agent slots in your ElevenLabs plan
- Try using an existing Agent ID instead

### Voice agent not responding
- Ensure microphone permissions are granted
- Check that the Agent ID is correct
- Verify ElevenLabs service is operational

## License

MIT
