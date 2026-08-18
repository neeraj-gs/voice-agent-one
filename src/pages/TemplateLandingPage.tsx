/**
 * VA-1 — the product page.
 *
 * Built as a rack of units rather than a stack of cards. The channel numbers
 * down the left are the page's actual signal path: input, monitor, chain,
 * modules, patch, and so on. The hero's thesis is the instrument itself —
 * a live spectrogram you can speak into — because the fastest way to argue
 * that something listens is to let it listen.
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Copy,
  Play,
  Plus,
  Minus,
} from 'lucide-react';
import { cn } from '../utils/cn';
import { Rack, RackUnit } from '../components/system/Rack';
import { Legend, Lamp, Tag } from '../components/system/primitives';
import { SignalDisplay } from '../components/three/SignalDisplay';
import { Button } from '../components/ui';

/* Motion is used once per unit, on entry, and nowhere else. A rack does not
   shimmer. */
const rise = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
};
const stagger = { visible: { transition: { staggerChildren: 0.07 } } };

const inView = {
  initial: 'hidden' as const,
  whileInView: 'visible' as const,
  viewport: { once: true, margin: '-80px' },
  variants: stagger,
};

/* ── UNIT HEADING ──────────────────────────────────────────────────────────*/

const Heading: React.FC<{
  children: React.ReactNode;
  sub?: React.ReactNode;
  className?: string;
}> = ({ children, sub, className }) => (
  <div className={cn('max-w-3xl pt-6', className)}>
    <motion.h2
      variants={rise}
      className="display text-[clamp(2rem,5.2vw,4.25rem)]"
    >
      {children}
    </motion.h2>
    {sub && (
      <motion.p variants={rise} className="mt-5 max-w-xl text-[15px] leading-relaxed text-bone-dim">
        {sub}
      </motion.p>
    )}
  </div>
);

/* ── MASTHEAD ──────────────────────────────────────────────────────────────
   Not a nav bar with a gradient logo tile. The top plate of the unit: model
   designation, a power lamp that is on because the service is up, and the
   controls set in panel legend type. */

const Masthead: React.FC = () => {
  const [open, setOpen] = useState(false);
  const links = [
    ['Demo', '#monitor'],
    ['How it works', '#path'],
    ['Features', '#rack'],
    ['Pricing', '#levels'],
    ['Manual', '#manual'],
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-edge-soft bg-ink/92 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-[92rem] items-center gap-4 px-5 sm:px-8 lg:pl-[calc(3rem+var(--rail-w))] lg:pr-12">
        <Link to="/" className="group flex shrink-0 items-baseline gap-2 outline-offset-4">
          <span className="display-lite whitespace-nowrap text-[15px] tracking-[0.06em] text-bone">
            Voice Agent
          </span>
          <span className="readout text-[15px] text-amber">One</span>
          <span aria-hidden className="hidden h-3 w-px bg-edge lg:block" />
          <span className="readout hidden text-[10px] text-bone-faint lg:block">VA-1</span>
        </Link>

        <span aria-hidden className="hidden h-px flex-1 bg-edge-soft md:block" />

        <nav className="hidden items-center gap-7 md:flex">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="legend transition-colors hover:text-amber">
              {label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 md:ml-0">
          <span className="hidden items-center gap-2 lg:flex">
            <Lamp state="ready" />
            <Legend>All systems up</Legend>
          </span>
          <span aria-hidden className="hidden h-3 w-px bg-edge lg:block" />
          <Link to="/login" className="legend hidden transition-colors hover:text-amber sm:block">
            Sign in
          </Link>
          <Link to="/setup" className="shrink-0">
            <Button size="sm" className="whitespace-nowrap">
              <span className="hidden sm:inline">Start setup</span>
              <span className="sm:hidden">Set up</span>
              <ArrowRight size={13} />
            </Button>
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Menu"
            className="flex h-8 w-8 shrink-0 items-center justify-center border border-edge text-bone-dim md:hidden"
          >
            {open ? <Minus size={14} /> : <Plus size={14} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-edge-soft bg-steel px-5 py-3 md:hidden">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block border-b border-edge-soft py-3 legend last:border-0"
            >
              {label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
};

/* ── DATA ──────────────────────────────────────────────────────────────────*/

const STATUS = [
  { label: 'Setup time', value: '5', unit: 'min' },
  { label: 'On duty', value: '24/7', unit: '' },
  { label: 'Trades covered', value: '100', unit: '+' },
  { label: 'Editable', value: '100', unit: '%' },
];

/* This is a genuine sequence — each stage consumes the previous one's output —
   so it is the one place on the page where numbering carries information. */
const CHAIN = [
  {
    n: '01',
    title: 'Pick your trade',
    body: 'A hundred-odd trades, each with its own vocabulary. A clinic books patients; a salon books guests. The agent inherits the right words.',
    out: 'Industry profile',
  },
  {
    n: '02',
    title: 'Enter your details',
    body: 'Name, number, address, hours, who works there. Two minutes of typing, and it is the only typing you do.',
    out: 'Business record',
  },
  {
    n: '03',
    title: 'GPT-4 writes the rest',
    body: 'Services, prices, FAQs, page copy, the knowledge base, and the agent’s system prompt — drafted from your record, not from a template.',
    out: 'Draft configuration',
  },
  {
    n: '04',
    title: 'Change anything',
    body: 'Every generated field is editable: what it charges, how it greets people, what it refuses to promise. Nothing is locked.',
    out: 'Approved configuration',
  },
  {
    n: '05',
    title: 'Go live',
    body: 'The agent is created on ElevenLabs and your page is published. Share the link, or paste the embed onto the site you already have.',
    out: 'Live line',
  },
];

const MODULES = [
  {
    slot: 'A1',
    title: 'It answers at 3am',
    body: 'The agent takes the call whenever it comes: after hours, mid-haircut, on a bank holiday. There is no queue and no hold music.',
    meta: 'ElevenLabs Conversational AI',
  },
  {
    slot: 'A2',
    title: 'It writes your page for you',
    body: 'GPT-4 drafts the tagline, service list, FAQs, testimonials and voice prompts from your business record. You edit rather than start.',
    meta: 'GPT-4',
  },
  {
    slot: 'A3',
    title: 'It books into your calendar',
    body: 'The agent checks real availability, holds the slot, and writes the appointment to Google Calendar while the caller is still on the line.',
    meta: 'Google Calendar',
  },
  {
    slot: 'A4',
    title: 'It remembers who called',
    body: 'Returning callers are recognised by number. The agent knows what they booked last time and asks whether they want the same again.',
    meta: 'Customer records',
  },
  {
    slot: 'B1',
    title: 'It shows you the numbers',
    body: 'Calls taken, appointments made, the share that converted, and a written summary of every conversation. Nothing you have to ask for.',
    meta: 'Analytics',
  },
  {
    slot: 'B2',
    title: 'It plugs into your workflow',
    body: 'Webhook tools let n8n take over any step — check stock, run a deposit, ping the shop floor — before the agent answers the caller.',
    meta: 'n8n webhooks',
  },
  {
    slot: 'B3',
    title: 'Your colours, not ours',
    body: 'The generated site takes its palette and tone from the trade you picked, and every part of it stays editable afterwards.',
    meta: 'Branding',
  },
  {
    slot: 'B4',
    title: 'Your keys stay yours',
    body: 'API keys live in your browser, never on our servers. Call data is encrypted in transit and at rest, and is never sold on.',
    meta: 'Security',
  },
];

const PLATFORMS = [
  ['HTML / vanilla JS', 'Two lines in the page you already have'],
  ['React', 'useConversation hook, full control of the UI'],
  ['Next.js', 'Client component, App Router ready'],
  ['Shopify', 'Drop it into theme.liquid'],
];

const TRADES: [string, string[]][] = [
  [
    'Health',
    ['Medical clinics', 'Dental', 'Chiropractic', 'Physical therapy', 'Mental health', 'Optometry', 'Pediatrics', 'Cardiology', 'Dermatology', 'Urgent care', 'Med spa', 'Home healthcare'],
  ],
  [
    'Beauty & wellness',
    ['Salon & spa', 'Barbershop', 'Nail salon', 'Massage therapy', 'Tattoo studio', 'Waxing', 'Lash & brow', 'Wellness centre'],
  ],
  [
    'Fitness',
    ['Gyms', 'Yoga studios', 'Pilates', 'Martial arts', 'Personal training', 'Dance studios', 'Climbing gyms', 'Swim schools'],
  ],
  [
    'Home & trade',
    ['Plumbing', 'Electrical', 'HVAC', 'Roofing', 'Landscaping', 'Pest control', 'Cleaning services', 'Locksmiths', 'Pool service', 'Handyman', 'Painting', 'Flooring'],
  ],
  [
    'Professional',
    ['Legal', 'Accounting', 'Financial advice', 'Insurance', 'Real estate', 'Property management', 'Consulting', 'Notary'],
  ],
  [
    'Food & events',
    ['Restaurants', 'Cafés', 'Bakeries', 'Catering', 'Wine bars', 'Event planning', 'Photography', 'Videography'],
  ],
  [
    'Automotive & pets',
    ['Auto repair', 'Detailing', 'Tyre shops', 'Driving schools', 'Veterinary', 'Grooming', 'Boarding', 'Dog training'],
  ],
  [
    'Education & tech',
    ['Tutoring', 'Music lessons', 'Language schools', 'Test prep', 'IT support', 'Web design', 'Marketing agencies', 'Recording studios'],
  ],
];

const PLANS = [
  {
    slot: '01',
    name: 'Agent only',
    body: 'The voice agent on the website you already run.',
    price: { monthly: 500, yearly: 400 },
    features: [
      'One voice agent',
      'Embed code for any site',
      'React, Next.js, Shopify',
      '500 calls a month',
      'Test and edit dashboard',
      'Basic analytics',
      'Email support',
      'Standard voice models',
    ],
    cta: 'Get the agent',
    live: false,
  },
  {
    slot: '02',
    name: 'Site + agent',
    body: 'A generated business site with the agent built into it.',
    price: { monthly: 1500, yearly: 1200 },
    features: [
      'AI-generated landing page',
      'Voice agent included',
      'Public shareable URL',
      'Unlimited calls',
      'Unlimited knowledge base',
      'n8n webhook tools',
      'Priority support, 24h',
      'Premium voice models',
    ],
    cta: 'Start free trial',
    live: true,
  },
  {
    slot: '03',
    name: 'Multi-site',
    body: 'Several locations or several clients, one rack.',
    price: { monthly: 4000, yearly: 3200 },
    features: [
      'Everything in Site + agent',
      'Multiple voice agents',
      'Multi-location support',
      'Custom API integrations',
      'Named account manager',
      '99.9% uptime commitment',
      'White-label option',
      'Custom AI training',
    ],
    cta: 'Contact sales',
    live: false,
  },
];

const LOG = [
  {
    id: '0341',
    duration: '04:12',
    outcome: 'Booked',
    quote:
      'We were missing four calls in ten. Now nearly every request that comes in ends up in the diary. Patients regularly get off the phone without realising it was not a person.',
    who: 'Dr. Sarah Chen',
    org: 'Wellness Medical Center',
    trade: 'Healthcare',
  },
  {
    id: '0512',
    duration: '02:48',
    outcome: 'Booked',
    quote:
      'Live in under ten minutes. It handles showing requests, answers questions about listings, and follows up with the leads I would otherwise have lost by Thursday.',
    who: 'Michael Rodriguez',
    org: 'Premier Realty',
    trade: 'Real estate',
  },
  {
    id: '0788',
    duration: '03:05',
    outcome: 'Rescheduled',
    quote:
      'On my own, a receptionist was never going to happen. This books, reschedules, and answers the same six questions I used to answer between clients.',
    who: 'Jennifer Park',
    org: 'Zen Wellness Spa',
    trade: 'Spa & wellness',
  },
];

const SCHEDULE = [
  {
    when: 'Q1 2025',
    state: 'shipped' as const,
    title: 'Foundation',
    items: ['Industry templates', 'AI content generation', 'ElevenLabs voice', 'Analytics dashboard'],
  },
  {
    when: 'Q2 2025',
    state: 'running' as const,
    title: 'Integrations',
    items: ['n8n webhooks', 'Google Calendar sync', 'Customer records', 'Multi-language'],
  },
  {
    when: 'Q3 2025',
    state: 'queued' as const,
    title: 'Depth',
    items: ['SMS notifications', 'Payments', 'Multi-location', 'Team accounts'],
  },
  {
    when: 'Q4 2025',
    state: 'queued' as const,
    title: 'Scale',
    items: ['White-label', 'Custom AI training', 'Public API', 'Enterprise SSO'],
  },
];

const MANUAL = [
  {
    q: 'What is actually answering the call?',
    a: 'ElevenLabs’ conversational voice model, running against a system prompt and knowledge base built from your business record. When someone calls the number or presses the talk button on your page, they reach that agent directly. It can read your availability and write an appointment while the caller is still on the line.',
  },
  {
    q: 'Do I need to know how to code?',
    a: 'No. The setup wizard asks for your business details in plain fields and generates everything else. If you do want to go further, every generated field is editable and there is an embed snippet for developers — but nothing about the standard path requires it.',
  },
  {
    q: 'What happens when the trial ends?',
    a: 'You keep a free tier of 100 calls a month. Unlimited calls, webhook tools and the premium voice models sit on the paid plans. You can move up or down between plans at any point, and nothing is deleted if you move down.',
  },
  {
    q: 'Can I change how it speaks?',
    a: 'Yes — its name, its personality, how formal it is, the phrases it opens and closes with, and the full system prompt. You can also add knowledge base entries for the questions only your business gets asked.',
  },
  {
    q: 'How does it reach my calendar?',
    a: 'Through n8n webhook tools. The agent calls out to check availability before it offers a time, then writes the event to Google Calendar and sends confirmations to you and the caller. The same mechanism can hit any other system you can reach over HTTP.',
  },
  {
    q: 'Where does my data live?',
    a: 'API keys are held in your own browser and never reach our servers. Call records and customer details are encrypted in transit and at rest. We do not sell or share any of it. Enterprise plans add SSO and audit logging.',
  },
];

/* ── PAGE ──────────────────────────────────────────────────────────────────*/

export const TemplateLandingPage: React.FC = () => {
  const [yearly, setYearly] = useState(false);
  const [openManual, setOpenManual] = useState<number | null>(0);
  const [allTrades, setAllTrades] = useState(false);
  const [copied, setCopied] = useState(false);

  const embed = `<script src="https://elevenlabs.io/convai-widget/index.js" async></script>

<elevenlabs-convai agent-id="your-agent-id"></elevenlabs-convai>`;

  const copyEmbed = async () => {
    await navigator.clipboard.writeText(embed);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const trades = allTrades ? TRADES : TRADES.slice(0, 4);

  return (
    <div className="min-h-screen bg-ink">
      <Masthead />

      <Rack>
        {/* ══ 01 INPUT ═══════════════════════════════════════════════════ */}
        <RackUnit id="input" n="01" label="Input" seam={false}>
          <div className="grid gap-10 pb-8 pt-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center lg:gap-14 lg:pt-14">
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.h1
                variants={rise}
                className="display text-[clamp(2.5rem,5.6vw,4.75rem)]"
              >
                The line is
                <br />
                never busy
              </motion.h1>

              <motion.p
                variants={rise}
                className="mt-6 max-w-lg text-[16.5px] leading-relaxed text-bone-dim text-pretty"
              >
                Small businesses lose 30&ndash;50% of their leads to calls nobody picked up.
                Voice Agent One answers, handles the question, books the appointment, and
                leaves you the transcript.
              </motion.p>

              {/* Route selector. Two positions, one signal path each — not two
                  cards competing for the same click. */}
              <motion.div variants={rise} className="mt-9">
                <Legend as="div" className="mb-2.5">
                  Route
                </Legend>
                <div className="panel divide-y divide-edge-soft sm:grid sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                  <Link
                    to="/setup"
                    className="group flex items-start gap-3.5 p-4 transition-colors hover:bg-steel-lift"
                  >
                    <Lamp state="ready" className="mt-1.5" />
                    <span className="min-w-0">
                      <span className="display-lite block text-[13px] text-bone">
                        Site + agent
                      </span>
                      <span className="mt-1 block text-[13px] leading-snug text-bone-dim">
                        You have no site yet. We generate one with the agent in it.
                      </span>
                      <span className="legend mt-2.5 inline-flex items-center gap-1.5 text-amber opacity-0 transition-opacity group-hover:opacity-100">
                        Build it <ArrowRight size={11} />
                      </span>
                    </span>
                  </Link>

                  <Link
                    to="/setup"
                    className="group flex items-start gap-3.5 p-4 transition-colors hover:bg-steel-lift"
                  >
                    <Lamp state="ready" className="mt-1.5" />
                    <span className="min-w-0">
                      <span className="display-lite block text-[13px] text-bone">
                        Agent only
                      </span>
                      <span className="mt-1 block text-[13px] leading-snug text-bone-dim">
                        You already have a site. Take the embed and paste it in.
                      </span>
                      <span className="legend mt-2.5 inline-flex items-center gap-1.5 text-amber opacity-0 transition-opacity group-hover:opacity-100">
                        Get the code <ArrowRight size={11} />
                      </span>
                    </span>
                  </Link>
                </div>
              </motion.div>

              <motion.p variants={rise} className="mt-4 font-mono text-[11px] text-bone-faint">
                No card required &nbsp;·&nbsp; Five-minute setup &nbsp;·&nbsp; Cancel whenever
              </motion.p>
            </motion.div>

            {/* The instrument. This is the argument the page is making, so it
                sits beside the headline rather than below the fold. */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <SignalDisplay
                className="h-[clamp(24rem,52vh,34rem)] w-full"
                caption="Frequency up, time across, energy as height — the agent speaking."
              />
            </motion.div>
          </div>

          {/* Status strip — the numbers a spec sheet would carry, set as
              readouts rather than four glowing boxes. */}
          <motion.dl
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="mb-14 grid grid-cols-2 border border-edge-soft sm:grid-cols-4"
          >
            {STATUS.map((s, i) => (
              <motion.div
                key={s.label}
                variants={rise}
                className={cn(
                  'p-4 sm:p-5',
                  i % 2 === 1 && 'border-l border-edge-soft',
                  i >= 2 && 'border-t border-edge-soft sm:border-t-0',
                  i === 2 && 'sm:border-l',
                  i === 3 && 'sm:border-l'
                )}
              >
                <dt className="legend">{s.label}</dt>
                <dd className="readout mt-2 text-2xl leading-none text-bone">
                  {s.value}
                  {s.unit && <span className="text-sm text-amber">{s.unit}</span>}
                </dd>
              </motion.div>
            ))}
          </motion.dl>
        </RackUnit>

        {/* ══ 02 MONITOR ═════════════════════════════════════════════════ */}
        <RackUnit id="monitor" n="02" label="Monitor">
          <motion.div {...inView} className="pb-16">
            <Heading sub="Three minutes, start to finish: a trade picked, details typed, and a live agent taking a booking at the end of it.">
              Watch it get
              <br />
              built
            </Heading>

            <motion.div variants={rise} className="recess mt-9 overflow-hidden">
              <div className="flex items-center gap-3 border-b border-edge-soft bg-steel px-4 py-2.5">
                <Lamp state="live" pulse />
                <Legend className="text-amber">Recording</Legend>
                <span aria-hidden className="h-px flex-1 bg-edge-soft" />
                <Play size={12} className="text-bone-faint" />
                <span className="readout text-[10px] text-bone-faint">Screen capture</span>
              </div>
              <div className="relative aspect-video w-full bg-ink">
                <iframe
                  src="https://www.loom.com/embed/de74a69d46084de6944eaf6cfc8bce2f?sid=de74a69d-4608-4de6-944e-af6cfc8bce2f"
                  title="Voice Agent One walkthrough"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            </motion.div>
          </motion.div>
        </RackUnit>

        {/* ══ 03 SIGNAL PATH ═════════════════════════════════════════════ */}
        <RackUnit id="path" n="03" label="Signal path">
          <motion.div {...inView} className="pb-16">
            <Heading sub="Five stages, each one consuming what the last produced. You do the first two.">
              The signal path
            </Heading>

            <ol className="mt-10 grid gap-px bg-edge-soft lg:grid-cols-5">
              {CHAIN.map((s, i) => (
                <motion.li
                  key={s.n}
                  variants={rise}
                  className="group relative flex flex-col bg-ink p-5 transition-colors hover:bg-steel"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="readout text-xs text-amber">{s.n}</span>
                    <span aria-hidden className="h-px flex-1 bg-edge" />
                    {i < CHAIN.length - 1 && (
                      <ArrowRight size={12} className="hidden text-bone-faint lg:block" />
                    )}
                  </div>

                  <h3 className="display-lite mt-4 text-[15px] text-bone">{s.title}</h3>
                  <p className="mt-2.5 flex-1 pb-5 text-[13px] leading-relaxed text-bone-dim">
                    {s.body}
                  </p>

                  <div className="flex items-center gap-2 border-t border-edge-soft pt-3">
                    <Legend>Out</Legend>
                    <span className="font-mono text-[10px] text-patina-glow">{s.out}</span>
                  </div>
                </motion.li>
              ))}
            </ol>
          </motion.div>
        </RackUnit>

        {/* ══ 04 RACK ════════════════════════════════════════════════════ */}
        <RackUnit id="rack" n="04" label="Modules">
          <motion.div {...inView} className="pb-16">
            <Heading sub="Eight modules, all fitted as standard. Nothing here is an upsell in disguise.">
              What&rsquo;s in
              <br />
              the rack
            </Heading>

            <div className="mt-10 grid gap-px bg-edge-soft sm:grid-cols-2">
              {MODULES.map((m) => (
                <motion.article
                  key={m.slot}
                  variants={rise}
                  className="group relative bg-ink p-6 transition-colors hover:bg-steel"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="readout text-[10px] text-bone-faint">{m.slot}</span>
                    <span aria-hidden className="h-px flex-1 bg-edge-soft" />
                    <Legend className="transition-colors group-hover:text-patina-glow">
                      {m.meta}
                    </Legend>
                  </div>

                  <h3 className="display-lite mt-4 text-[clamp(1.05rem,2vw,1.4rem)] text-bone">
                    {m.title}
                  </h3>
                  <p className="mt-3 max-w-md text-[14px] leading-relaxed text-bone-dim">
                    {m.body}
                  </p>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </RackUnit>

        {/* ══ 05 PATCH ═══════════════════════════════════════════════════ */}
        <RackUnit id="patch" n="05" label="Patch">
          <motion.div {...inView} className="pb-16">
            <Heading sub="You do not have to move your website. Two lines and the agent is answering on the site you already run.">
              Patch it into
              <br />
              what you have
            </Heading>

            <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
              <motion.div variants={rise} className="panel overflow-hidden">
                <div className="flex items-center gap-3 border-b border-edge-soft px-4 py-2.5">
                  <Legend>index.html</Legend>
                  <span aria-hidden className="h-px flex-1 bg-edge-soft" />
                  <button
                    type="button"
                    onClick={copyEmbed}
                    className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-bone-dim transition-colors hover:text-amber"
                  >
                    {copied ? <Check size={11} /> : <Copy size={11} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre className="overflow-x-auto bg-ink p-5 font-mono text-[12.5px] leading-relaxed text-bone-dim">
                  <code>
                    <span className="text-bone-faint">
                      {'<!-- anywhere in your page -->'}
                    </span>
                    {'\n'}
                    <span className="text-patina-glow">{'<script'}</span>{' '}
                    <span className="text-bone">src</span>=
                    <span className="text-amber">
                      &quot;https://elevenlabs.io/convai-widget/index.js&quot;
                    </span>{' '}
                    <span className="text-bone">async</span>
                    <span className="text-patina-glow">{'></script>'}</span>
                    {'\n\n'}
                    <span className="text-patina-glow">{'<elevenlabs-convai'}</span>{' '}
                    <span className="text-bone">agent-id</span>=
                    <span className="text-amber">&quot;your-agent-id&quot;</span>
                    <span className="text-patina-glow">{'>'}</span>
                    <span className="text-patina-glow">{'</elevenlabs-convai>'}</span>
                  </code>
                </pre>
              </motion.div>

              <motion.ul variants={rise} className="divide-y divide-edge-soft border-y border-edge-soft">
                {PLATFORMS.map(([name, desc]) => (
                  <li key={name} className="flex items-center gap-4 py-4">
                    <Check size={14} className="shrink-0 text-patina" />
                    <span className="min-w-0 flex-1">
                      <span className="display-lite block text-[13px] text-bone">{name}</span>
                      <span className="mt-0.5 block text-[13px] text-bone-dim">{desc}</span>
                    </span>
                  </li>
                ))}
                <li className="pt-6">
                  <Link to="/setup">
                    <Button size="md">
                      Get your embed code <ArrowRight size={13} />
                    </Button>
                  </Link>
                </li>
              </motion.ul>
            </div>
          </motion.div>
        </RackUnit>

        {/* ══ 06 TRADES ══════════════════════════════════════════════════ */}
        <RackUnit id="trades" n="06" label="Vocabulary">
          <motion.div {...inView} className="pb-16">
            <Heading sub="A clinic books patients, a salon books guests, a garage books jobs. The agent takes the vocabulary, the services and the tone of the trade you pick.">
              It speaks
              <br />
              your trade
            </Heading>

            <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
              {trades.map(([group, names]) => (
                <motion.div key={group} variants={rise}>
                  <div className="flex items-baseline gap-2.5 border-b border-edge pb-2">
                    <Legend className="text-bone-dim">{group}</Legend>
                    <span aria-hidden className="h-px flex-1 bg-edge-soft" />
                    <span className="readout text-[10px] text-bone-faint">
                      {String(names.length).padStart(2, '0')}
                    </span>
                  </div>
                  <ul className="mt-3 space-y-1.5">
                    {names.map((n) => (
                      <li key={n} className="text-[13.5px] leading-snug text-bone-dim">
                        {n}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            <motion.div variants={rise} className="mt-9 flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => setAllTrades((v) => !v)}>
                {allTrades ? 'Show fewer' : `Show all ${TRADES.length} groups`}
                <ChevronDown
                  size={13}
                  className={cn('transition-transform', allTrades && 'rotate-180')}
                />
              </Button>
              <span aria-hidden className="h-px flex-1 bg-edge-soft" />
              <span className="font-mono text-[11px] text-bone-faint">
                Not listed? It still works &mdash; describe the trade and the agent adapts.
              </span>
            </motion.div>
          </motion.div>
        </RackUnit>

        {/* ══ 07 LEVELS ══════════════════════════════════════════════════ */}
        <RackUnit id="levels" n="07" label="Levels">
          <motion.div {...inView} className="pb-16">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <Heading sub="Three positions. Move between them whenever; nothing is deleted when you move down.">
                Levels
              </Heading>

              <motion.div variants={rise} className="panel flex items-stretch">
                {(['monthly', 'yearly'] as const).map((c) => {
                  const on = (c === 'yearly') === yearly;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setYearly(c === 'yearly')}
                      aria-pressed={on}
                      className={cn(
                        'px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors',
                        on ? 'bg-amber text-ink' : 'text-bone-dim hover:text-bone'
                      )}
                    >
                      {c === 'yearly' ? 'Yearly · −20%' : 'Monthly'}
                    </button>
                  );
                })}
              </motion.div>
            </div>

            <div className="mt-10 grid gap-px bg-edge-soft lg:grid-cols-3">
              {PLANS.map((p) => (
                <motion.div
                  key={p.slot}
                  variants={rise}
                  className={cn(
                    'flex flex-col bg-ink p-6',
                    p.live && 'bg-steel ring-1 ring-inset ring-amber/25'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Lamp state={p.live ? 'live' : 'off'} />
                    <span className="readout text-[10px] text-bone-faint">{p.slot}</span>
                    <span aria-hidden className="h-px flex-1 bg-edge-soft" />
                    {p.live && <Tag tone="live">Most chosen</Tag>}
                  </div>

                  <h3 className="display-lite mt-5 text-xl text-bone">{p.name}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-bone-dim">{p.body}</p>

                  <div className="mt-7 flex items-baseline gap-1.5">
                    <span className="readout text-4xl leading-none text-bone">
                      ${(yearly ? p.price.yearly : p.price.monthly).toLocaleString('en-US')}
                    </span>
                    <span className="legend">/ month</span>
                  </div>
                  {yearly && (
                    <p className="mt-1.5 font-mono text-[10px] text-patina-glow">
                      Billed yearly · saves $
                      {((p.price.monthly - p.price.yearly) * 12).toLocaleString('en-US')}
                    </p>
                  )}

                  <ul className="mt-7 flex-1 space-y-2.5 border-t border-edge-soft pt-6">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-[13.5px] text-bone-dim">
                        <Check size={13} className="mt-1 shrink-0 text-patina" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link to="/setup" className="mt-7 block">
                    <Button
                      variant={p.live ? 'primary' : 'outline'}
                      size="md"
                      className="w-full"
                    >
                      {p.cta}
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </RackUnit>

        {/* ══ 08 CALL LOG ════════════════════════════════════════════════ */}
        <RackUnit id="log" n="08" label="Call log">
          <motion.div {...inView} className="pb-16">
            <Heading sub="Three businesses, logged the way the dashboard logs any other call.">
              The call log
            </Heading>

            <div className="mt-10 grid gap-px bg-edge-soft lg:grid-cols-3">
              {LOG.map((e) => (
                <motion.figure key={e.id} variants={rise} className="flex flex-col bg-ink p-6">
                  <div className="flex items-center gap-2.5">
                    <Legend>Call</Legend>
                    <span className="readout text-[11px] text-bone">{e.id}</span>
                    <span aria-hidden className="h-px flex-1 bg-edge-soft" />
                    <span className="readout text-[11px] text-bone-faint">{e.duration}</span>
                    <Tag tone={e.outcome === 'Booked' ? 'ready' : 'neutral'}>{e.outcome}</Tag>
                  </div>

                  <blockquote className="mt-6 flex-1 text-[15px] leading-relaxed text-bone">
                    {e.quote}
                  </blockquote>

                  <figcaption className="mt-6 border-t border-edge-soft pt-4">
                    <div className="display-lite text-[13px] text-bone">{e.who}</div>
                    <div className="mt-1 font-mono text-[11px] text-bone-faint">
                      {e.org} · {e.trade}
                    </div>
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          </motion.div>
        </RackUnit>

        {/* ══ 09 SCHEDULE ════════════════════════════════════════════════ */}
        <RackUnit id="schedule" n="09" label="Schedule">
          <motion.div {...inView} className="pb-16">
            <Heading sub="What is built, what is being built, and what is queued behind it.">
              On the schedule
            </Heading>

            <div className="mt-10 grid gap-px bg-edge-soft sm:grid-cols-2 lg:grid-cols-4">
              {SCHEDULE.map((s) => (
                <motion.div key={s.when} variants={rise} className="bg-ink p-5">
                  <div className="flex items-center gap-2.5">
                    <Lamp
                      state={s.state === 'shipped' ? 'ready' : s.state === 'running' ? 'live' : 'off'}
                      pulse={s.state === 'running'}
                    />
                    <span className="readout text-[11px] text-bone">{s.when}</span>
                    <span aria-hidden className="h-px flex-1 bg-edge-soft" />
                  </div>

                  <h3 className="display-lite mt-4 text-base text-bone">{s.title}</h3>
                  <Legend as="div" className="mt-1.5">
                    {s.state === 'shipped'
                      ? 'Shipped'
                      : s.state === 'running'
                      ? 'In progress'
                      : 'Queued'}
                  </Legend>

                  <ul className="mt-4 space-y-1.5 border-t border-edge-soft pt-4">
                    {s.items.map((i) => (
                      <li key={i} className="text-[13px] leading-snug text-bone-dim">
                        {i}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </RackUnit>

        {/* ══ 10 MANUAL ══════════════════════════════════════════════════ */}
        <RackUnit id="manual" n="10" label="Manual">
          <motion.div {...inView} className="pb-16">
            <Heading sub="The six things people ask before they start.">The manual</Heading>

            <div className="mt-10 max-w-3xl border-t border-edge-soft">
              {MANUAL.map((m, i) => {
                const open = openManual === i;
                return (
                  <motion.div key={m.q} variants={rise} className="border-b border-edge-soft">
                    <h3>
                      <button
                        type="button"
                        onClick={() => setOpenManual(open ? null : i)}
                        aria-expanded={open}
                        className="group flex w-full items-baseline gap-4 py-5 text-left"
                      >
                        <span className="readout shrink-0 text-[11px] text-bone-faint">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span
                          className={cn(
                            'display-lite flex-1 text-[15px] transition-colors',
                            open ? 'text-amber' : 'text-bone group-hover:text-amber'
                          )}
                        >
                          {m.q}
                        </span>
                        <span
                          aria-hidden
                          className={cn(
                            'mt-1 shrink-0 transition-transform duration-300 ease-attack',
                            open && 'rotate-45'
                          )}
                        >
                          <Plus size={14} className="text-bone-faint" />
                        </span>
                      </button>
                    </h3>
                    <div
                      className={cn(
                        'grid transition-all duration-300 ease-attack',
                        open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="max-w-2xl pb-6 pl-9 text-[14.5px] leading-relaxed text-bone-dim">
                          {m.a}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </RackUnit>

        {/* ══ 11 TALK TO A HUMAN ═════════════════════════════════════════ */}
        <RackUnit id="book" n="11" label="Operator">
          <motion.div {...inView} className="pb-16">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
              <div>
                <Heading sub="Thirty minutes, a real person, no slides. Bring the trade you are in and we will tell you honestly whether this fits it.">
                  Talk to
                  <br />
                  a human
                </Heading>

                <motion.div variants={rise} className="mt-8 space-y-3">
                  {[
                    'A walkthrough on your own business, not a demo account',
                    'What it can and cannot do for your trade',
                    'What it costs once you are past the trial',
                  ].map((l) => (
                    <div key={l} className="flex items-start gap-3">
                      <span className="mt-1.5 h-px w-4 shrink-0 bg-amber" />
                      <span className="text-[14px] leading-snug text-bone-dim">{l}</span>
                    </div>
                  ))}
                </motion.div>
              </div>

              <motion.div variants={rise} className="recess overflow-hidden">
                <div className="flex items-center gap-3 border-b border-edge-soft bg-steel px-4 py-2.5">
                  <Lamp state="ready" />
                  <Legend>Operator · 30 min</Legend>
                </div>
                <iframe
                  src="https://calendly.com/neeraj_gs/30min?hide_gdpr_banner=1&background_color=0a0b0d&text_color=e7e1d4&primary_color=ff9d2e"
                  title="Book a call"
                  className="h-[620px] w-full border-0 bg-ink"
                />
              </motion.div>
            </div>
          </motion.div>
        </RackUnit>

        {/* ══ CLOSE ══════════════════════════════════════════════════════ */}
        <RackUnit id="output" n="12" label="Output">
          <div className="flex flex-col items-start gap-8 py-20 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="display max-w-2xl text-[clamp(2.25rem,6.5vw,5.5rem)]">
              Your next caller
              <br />
              is about to hang up
            </h2>
            <div className="flex shrink-0 flex-col gap-3">
              <Link to="/setup">
                <Button size="lg" className="w-full sm:w-auto">
                  Start setup <ArrowRight size={14} />
                </Button>
              </Link>
              <span className="font-mono text-[11px] text-bone-faint">
                Five minutes. No card.
              </span>
            </div>
          </div>
        </RackUnit>
      </Rack>

      <Footer />
    </div>
  );
};

/* ── FOOTER ────────────────────────────────────────────────────────────────
   The back panel: what it is built from, and the plate with the model number
   on it. */

const Footer: React.FC = () => (
  <footer className="seam bg-ink">
    <div className="mx-auto w-full max-w-[92rem] px-5 py-12 sm:px-8 lg:pl-[calc(3rem+var(--rail-w))] lg:pr-12">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-baseline gap-2.5">
            <span className="display-lite text-[15px] text-bone">Voice Agent</span>
            <span className="readout text-[15px] text-amber">One</span>
          </div>
          <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-bone-dim">
            An AI receptionist for businesses too small to hire one.
          </p>
          <div className="mt-5 flex items-center gap-2">
            <Lamp state="ready" />
            <Legend>Operational</Legend>
          </div>
        </div>

        {[
          ['Product', [['Demo', '#monitor'], ['How it works', '#path'], ['Features', '#rack'], ['Pricing', '#levels']]],
          ['Start', [['Set up a business', '/setup'], ['Sign in', '/login'], ['Create account', '/signup']]],
          ['Built on', [['ElevenLabs', 'https://elevenlabs.io'], ['OpenAI GPT-4', 'https://openai.com'], ['Supabase', 'https://supabase.com'], ['n8n', 'https://n8n.io']]],
        ].map(([title, links]) => (
          <div key={title as string}>
            <Legend as="div" className="border-b border-edge-soft pb-2">
              {title as string}
            </Legend>
            <ul className="mt-3 space-y-2">
              {(links as string[][]).map(([label, href]) => (
                <li key={label}>
                  {href.startsWith('http') ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="link-underline text-[13px] text-bone-dim"
                    >
                      {label}
                    </a>
                  ) : href.startsWith('#') ? (
                    <a href={href} className="link-underline text-[13px] text-bone-dim">
                      {label}
                    </a>
                  ) : (
                    <Link to={href} className="link-underline text-[13px] text-bone-dim">
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Serial plate. */}
      <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-edge-soft pt-6">
        <span className="readout text-[10px] text-bone-faint">MODEL VA-1</span>
        <span className="readout text-[10px] text-bone-faint">REV 1.0.0</span>
        <span className="readout text-[10px] text-bone-faint">MIT LICENCE</span>
        <span aria-hidden className="hidden h-px flex-1 bg-edge-soft sm:block" />
        <span className="readout text-[10px] text-bone-faint">
          &copy; {new Date().getFullYear()} Voice Agent One
        </span>
      </div>
    </div>
    <div aria-hidden className="vents h-6 border-t border-edge-soft opacity-30" />
  </footer>
);
