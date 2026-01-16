# Voice Agent One

**Your AI-Powered Business, Live in Minutes**

---

## Overview

Small businesses lose 30-50% of their inbound leads because calls go unanswered, responses come too late, or bookings require manual follow-up. Hiring a receptionist is expensive. Building a website takes weeks. Setting up AI feels overwhelming.

**Voice Agent One eliminates all of that.**

Pick your industry. Enter your business details. Click generate. That's it.

Our AI instantly creates everything—a professional website, an intelligent voice agent, service listings, FAQs, branding, and booking integration—all tailored to your specific industry. No templates to configure. No prompts to write. No developers to hire. You review it, customize if you'd like, and go live.

**Already have a website?** Even simpler. Copy one snippet of embed code, paste it onto your Shopify, WordPress, or any platform, and your AI voice agent is live—answering calls, qualifying leads, and booking appointments 24/7.

---

## What Makes It Plug-and-Play

| Feature | Description |
|---------|-------------|
| **100+ Industries** | Healthcare, salons, fitness, legal, restaurants, real estate, and more. AI adapts terminology, services, and tone automatically. |
| **One-Click Upgrade** | Start with just a voice agent. Click "Upgrade to Website" and your complete branded site is live instantly. |
| **Unlimited Businesses** | Manage multiple locations or clients from a single dashboard, completely free. |
| **Real-Time Analytics** | Track every conversation, view call summaries, and monitor performance. |
| **Fully Editable** | Services, pricing, colors, voice personality, system prompts—change anything, anytime. |
| **Instant Sharing** | Copy your public link, share it anywhere, and start receiving calls immediately. |

---

## Quick Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [OpenAI API Key](https://platform.openai.com/api-keys)
- [ElevenLabs API Key](https://elevenlabs.io/app/settings/api-keys)

### Step 1: Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/voice-agent-one.git
cd voice-agent-one
npm install
```

### Step 2: Start Development Server

```bash
npm run dev
```

### Step 3: Complete the Setup Wizard

Navigate to `http://localhost:5173` and follow the four-step wizard:

| Step | Action |
|------|--------|
| **1. Select Industry** | Choose from 100+ supported industries |
| **2. Business Information** | Enter name, phone, email, address, staff details, and hours |
| **3. API Keys** | Add your OpenAI key and ElevenLabs key (or existing Agent ID) |
| **4. Review & Customize** | AI generates all content—edit services, FAQs, branding, and prompts as needed |

### Step 4: Go Live

Click **Complete Setup** and your business is ready:

| Route | Description |
|-------|-------------|
| `/site` | Your professional business website |
| `/call` | Voice agent interface for testing |
| `/dashboard` | Analytics, call logs, and performance metrics |

---

## Embed on Your Existing Website

Already have a website? Get just the voice agent and embed it anywhere.

**React / Next.js:**
```jsx
import { VoiceAgent } from './components/VoiceAgent';
<VoiceAgent agentId="your-agent-id" />
```

**Shopify / HTML:**
```html
<script src="https://your-deployment-url/embed.js"></script>
<div id="voice-agent" data-agent-id="your-agent-id"></div>
```

Copy the embed code from the dashboard and paste it onto your site. Done.

---

## API Keys

| Service | Purpose | Get Your Key |
|---------|---------|--------------|
| **OpenAI** | AI content generation (GPT-4) | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| **ElevenLabs** | Voice AI agent | [elevenlabs.io/app/settings/api-keys](https://elevenlabs.io/app/settings/api-keys) |

### OpenAI Setup
1. Visit [platform.openai.com](https://platform.openai.com)
2. Navigate to **API Keys** in the sidebar
3. Click **Create new secret key**
4. Copy the key (starts with `sk-`)

### ElevenLabs Setup
1. Visit [elevenlabs.io](https://elevenlabs.io)
2. Click your profile icon → **Profile + API key**
3. Copy your API key

---

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repository at [vercel.com](https://vercel.com) for automatic deployments.

### Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

### Manual Build

```bash
npm run build
# Serve the dist/ folder with any static file server
```

---

## Project Structure

```
voice-agent-one/
├── src/
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   ├── layout/             # Header, Footer
│   │   ├── onboarding/         # Setup wizard, Config editor
│   │   ├── voice/              # Voice agent widget
│   │   └── dashboard/          # Analytics components
│   ├── pages/
│   │   ├── TemplateLandingPage # Marketing landing page
│   │   ├── SetupPage           # Onboarding wizard
│   │   ├── LandingPage         # Business website
│   │   ├── CallPage            # Voice agent interface
│   │   ├── DashboardPage       # Analytics dashboard
│   │   └── PublicLandingPage   # Shareable public site
│   ├── services/
│   │   ├── openai.ts           # Content generation
│   │   ├── elevenlabs.ts       # Agent management
│   │   └── analytics.ts        # Call data fetching
│   ├── stores/
│   │   ├── configStore.ts      # Local state (Zustand)
│   │   ├── businessStore.ts    # Database sync
│   │   └── authStore.ts        # Authentication
│   └── types/
│       └── index.ts            # TypeScript definitions
├── package.json
└── README.md
```

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| TypeScript | Type Safety |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| Zustand | State Management |
| Framer Motion | Animations |
| Recharts | Dashboard Charts |
| OpenAI SDK | Content Generation |
| ElevenLabs SDK | Voice Agent |
| Supabase | Database & Auth (Optional) |

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **Invalid OpenAI API key** | Verify key starts with `sk-` and has available credits |
| **Failed to create voice agent** | Check ElevenLabs API key and available agent slots |
| **Voice agent not responding** | Grant microphone permissions and verify Agent ID |
| **Content not generating** | Ensure OpenAI API key has GPT-4 access enabled |

### Reset Configuration

```javascript
localStorage.removeItem('voice-agent-config')
location.reload()
```

---

## License

MIT

---

**Voice Agent One — Your AI receptionist, live in minutes. Not months.**
