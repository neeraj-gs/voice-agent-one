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

## Design

The app runs **two separate design systems**, because it has two audiences.

### The product — "The Signal Room"

Every surface you own as an operator (marketing page, auth, setup wizard, dashboards,
the call console) is built to read as a piece of professional broadcast equipment:
anodised graphite panels, machined hairlines, silkscreened legends, and lamps that
light only when a real state is true.

| Token | Value | Means |
|-------|-------|-------|
| `ink` | `#0A0B0D` | the room the rack sits in |
| `steel` | `#14181C` | the equipment face |
| `bone` | `#E7E1D4` | silkscreened legend type |
| `amber` | `#FF9D2E` | signal present · live · primary action |
| `patina` | `#3E8E7E` | aged copper — structure, ready states |
| `clip` | `#E5484D` | over level. errors only, never decoration |

Type is **Archivo** (variable, pushed to expanded width and set in caps, the way a
panel legend is stretched to fill a face), **IBM Plex Sans** for prose, and **IBM Plex
Mono** for anything a machine printed.

**The signature is a live 3D spectrogram.** The hero renders a real mel-spaced
waterfall — frequency across, time receding, energy extruded into a terrain — driven
by a formant-based speech model at rest. Press the key and it switches to your own
microphone. The call pages render a condenser **diaphragm** whose membrane rides
standing-wave modes taken from the ElevenLabs SDK's own analyser, so what moves on
screen is what is actually being said.

### Generated customer sites — "The Docket"

A dentist's website should not look like a rack of audio gear, so generated business
sites are a separate identity: printed matter. Paper ground, a ruled tariff instead of
service cards, a stamped seal, a tear-off stub. Display is **Petrona**, body is
**Instrument Sans**, and the accent is the business's own `branding.primaryColor` —
pulled into a legible range by luminance so any generated hex stays readable. Only the
mono readout is shared between the two systems.

### Ground rules

- Responsive to 390px; visible keyboard focus; `prefers-reduced-motion` respected
  (the spectrogram holds one composed frame rather than freezing mid-animation).
- No WebGL, or a device that can't afford it, still gets a composed layout.
- Routes and the renderer are code-split: the marketing page ships ~79 kB gzip before
  three.js loads on demand.

---

## Project Structure

```
voice-agent-one/
├── src/
│   ├── components/
│   │   ├── system/             # Signal Room primitives (Rack, Panel, Lamp, Meter)
│   │   ├── three/              # Spectrogram, Diaphragm, lazy Canvas host
│   │   ├── site/               # The Docket — generated customer site system
│   │   ├── ui/                 # Buttons, fields, panels
│   │   ├── layout/             # Header, Footer
│   │   ├── onboarding/         # Setup wizard, Config editor
│   │   └── auth/               # Auth shell, login, signup, guard
│   ├── pages/
│   │   ├── TemplateLandingPage # Marketing landing page
│   │   ├── SetupPage           # Onboarding wizard
│   │   ├── LandingPage         # Business website
│   │   ├── CallPage            # Voice agent interface
│   │   ├── DashboardPage       # Analytics dashboard
│   │   └── PublicLandingPage   # Shareable public site
│   ├── lib/
│   │   └── audio.ts            # Speech model + mic analysis feeding the 3D
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
| Tailwind CSS | Styling (two token systems, see Design) |
| three.js + React Three Fiber | Spectrogram and diaphragm, lazily loaded |
| Web Audio API | Mel-band analysis driving the 3D |
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
