/**
 * Landing Page
 * Dynamic business website powered by stored configuration
 *
 * The owner's view of their own generated site. The site itself is the shared
 * `BusinessSite` — identical to what the public sees — with an operator bar
 * bolted on top. The bar deliberately stays in the product's own material
 * (graphite, amber, mono) so it never reads as part of the customer's site.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Building2,
  Check,
  Code,
  Copy,
  ExternalLink,
  Settings,
  Share2,
  X,
} from 'lucide-react';
import { BusinessSite } from '../components/site/BusinessSite';
import { Button } from '../components/ui';
import { Legend, Lamp } from '../components/system/primitives';
import { useBusiness } from '../stores/configStore';
import { useActiveBusiness, useBusinessStore } from '../stores/businessStore';
import { cn } from '../utils/cn';

type Platform = 'html' | 'react' | 'nextjs' | 'shopify';

export const LandingPage: React.FC = () => {
  const business = useBusiness();
  const activeBusiness = useActiveBusiness();
  const { activeVoiceAgent } = useBusinessStore();

  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [embedModalStep, setEmbedModalStep] = useState<'info' | 'code'>('info');
  const [copied, setCopied] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('html');
  const shareMenuRef = useRef<HTMLDivElement>(null);

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Escape closes whichever overlay is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setShowShareMenu(false);
      setShowEmbedModal(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Get the public URL using the business slug
  const publicUrl = activeBusiness?.slug
    ? `${window.location.origin}/p/${activeBusiness.slug}`
    : null;

  const copyToClipboard = async () => {
    if (publicUrl) {
      try {
        await navigator.clipboard.writeText(publicUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const openPublicPage = () => {
    if (publicUrl) {
      window.open(publicUrl, '_blank');
    }
  };

  // Get agent ID for embed code
  const agentId = activeVoiceAgent?.elevenlabs_agent_id || 'your-agent-id';

  // Generate embed code based on platform
  const getEmbedCode = (platform: Platform): string => {
    switch (platform) {
      case 'html':
        return `<!-- Add this to your HTML -->
<script src="https://elevenlabs.io/convai-widget/index.js" async type="text/javascript"></script>
<elevenlabs-convai agent-id="${agentId}"></elevenlabs-convai>`;
      case 'react':
        return `// Install: npm install @11labs/react
import { useConversation } from '@11labs/react';

function VoiceAgent() {
  const conversation = useConversation({
    agentId: '${agentId}',
    onConnect: () => console.log('Connected'),
    onDisconnect: () => console.log('Disconnected'),
    onMessage: (message) => console.log('Message:', message),
    onError: (error) => console.error('Error:', error),
  });

  return (
    <button onClick={() => conversation.startSession()}>
      Talk to AI
    </button>
  );
}`;
      case 'nextjs':
        return `// app/components/VoiceAgent.tsx
'use client';

import { useConversation } from '@11labs/react';

export function VoiceAgent() {
  const conversation = useConversation({
    agentId: '${agentId}',
    onConnect: () => console.log('Connected'),
    onDisconnect: () => console.log('Disconnected'),
  });

  return (
    <button onClick={() => conversation.startSession()}>
      Talk to AI
    </button>
  );
}`;
      case 'shopify':
        return `<!-- Add to theme.liquid before </body> -->
<script src="https://elevenlabs.io/convai-widget/index.js" async type="text/javascript"></script>
<elevenlabs-convai agent-id="${agentId}"></elevenlabs-convai>

<!-- Optional: Custom positioning -->
<style>
  elevenlabs-convai {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
  }
</style>`;
      default:
        return '';
    }
  };

  const copyEmbedCode = async () => {
    try {
      await navigator.clipboard.writeText(getEmbedCode(selectedPlatform));
      setEmbedCopied(true);
      setTimeout(() => setEmbedCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!business) return null;

  /* ── OPERATOR BAR ──
     The product looking in on the customer's site. Kept in graphite so the
     boundary between "your tools" and "your site" is never ambiguous. */
  const adminBar = (
    <div className="sticky top-0 z-50 border-b border-edge-soft bg-ink">
      <div className="mx-auto flex w-full max-w-[80rem] flex-wrap items-center gap-x-4 gap-y-2 px-5 py-2 sm:px-8">
        <span className="flex items-center gap-2">
          <Lamp state="live" />
          <Legend className="text-amber">Owner view</Legend>
        </span>
        <span aria-hidden className="hidden h-3 w-px bg-edge sm:block" />
        <span className="hidden truncate font-mono text-[11px] text-bone-faint sm:block">
          {publicUrl || 'Not published yet'}
        </span>

        <span aria-hidden className="hidden h-px flex-1 bg-edge-soft md:block" />

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          {publicUrl && (
            <div className="relative" ref={shareMenuRef}>
              <button
                onClick={() => setShowShareMenu((v) => !v)}
                aria-expanded={showShareMenu}
                className="flex items-center gap-1.5 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-bone-dim transition-colors hover:text-amber"
              >
                <Share2 size={12} />
                <span className="hidden sm:inline">Share</span>
              </button>

              <AnimatePresence>
                {showShareMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="panel-lift absolute right-0 top-full z-50 mt-1.5 w-80 overflow-hidden"
                  >
                    <div className="border-b border-edge-soft px-3 py-2.5">
                      <Legend>Public address</Legend>
                      <input
                        type="text"
                        readOnly
                        value={publicUrl}
                        onFocus={(e) => e.currentTarget.select()}
                        aria-label="Public address"
                        className="mt-2 w-full rounded-panel bg-ink px-2.5 py-2 font-mono text-[11px] text-bone shadow-recess outline-none"
                      />
                    </div>
                    <div className="flex gap-2 p-2">
                      <Button size="sm" className="flex-1" onClick={copyToClipboard}>
                        {copied ? <Check size={12} /> : <Copy size={12} />}
                        {copied ? 'Copied' : 'Copy link'}
                      </Button>
                      <Button size="sm" variant="secondary" onClick={openPublicPage}>
                        <ExternalLink size={12} /> Open
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <button
            onClick={() => setShowEmbedModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-bone-dim transition-colors hover:text-amber"
          >
            <Code size={12} />
            <span className="hidden sm:inline">Embed</span>
          </button>

          {[
            { to: '/businesses', icon: Building2, label: 'Businesses' },
            { to: '/dashboard', icon: BarChart3, label: 'Calls' },
            { to: '/settings/agent', icon: Settings, label: 'Settings' },
          ].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="flex items-center gap-1.5 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-bone-dim transition-colors hover:text-amber"
            >
              <l.icon size={12} />
              <span className="hidden sm:inline">{l.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );

  const embedModal = (
    <AnimatePresence>
      {showEmbedModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/85 p-4 backdrop-blur-sm"
          onClick={() => {
            setShowEmbedModal(false);
            setEmbedModalStep('info');
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Embed the voice agent"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            onClick={(e) => e.stopPropagation()}
            className="panel-lift flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden font-sans text-bone"
          >
            <div className="flex items-center gap-3 border-b border-edge-soft px-5 py-3.5">
              <Legend>
                {embedModalStep === 'info' ? 'Embed · what you get' : 'Embed · the code'}
              </Legend>
              <span aria-hidden className="h-px flex-1 bg-edge-soft" />
              <span className="readout text-[10px] text-bone-faint">
                {embedModalStep === 'info' ? '1 / 2' : '2 / 2'}
              </span>
              <button
                onClick={() => {
                  setShowEmbedModal(false);
                  setEmbedModalStep('info');
                }}
                aria-label="Close"
                className="text-bone-faint transition-colors hover:text-amber"
              >
                <X size={16} />
              </button>
            </div>

            {embedModalStep === 'info' ? (
              <>
                <div className="overflow-y-auto p-6">
                  <h2 className="display text-[clamp(1.5rem,3vw,2rem)]">
                    Put {business.voiceAgent.name}
                    <br />
                    on another site
                  </h2>
                  <p className="mt-4 max-w-lg text-[14.5px] leading-relaxed text-bone-dim">
                    This page is not the only place the agent can live. Paste two lines into any
                    other site you run and it answers there too, with the same knowledge of{' '}
                    {business.name}.
                  </p>

                  <div className="mt-8 grid gap-px bg-edge-soft sm:grid-cols-2">
                    {[
                      ['Two minutes', 'Copy the snippet, paste it, publish.'],
                      ['Any platform', 'React, Next.js, Shopify, WordPress, plain HTML.'],
                      ['Same agent', 'Same voice, same knowledge base, same booking tools.'],
                      ['Your styling', 'Position and style the widget in your own layout.'],
                    ].map(([t, d]) => (
                      <div key={t} className="bg-steel p-4">
                        <div className="display-lite text-[13px] text-bone">{t}</div>
                        <p className="mt-1.5 text-[13px] leading-snug text-bone-dim">{d}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end border-t border-edge-soft bg-ink-lift px-5 py-3.5">
                  <Button size="md" onClick={() => setEmbedModalStep('code')}>
                    Show the code <ArrowRight size={13} />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex gap-px overflow-x-auto border-b border-edge-soft bg-edge-soft">
                  {(
                    [
                      ['html', 'HTML'],
                      ['react', 'React'],
                      ['nextjs', 'Next.js'],
                      ['shopify', 'Shopify'],
                    ] as [Platform, string][]
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      onClick={() => setSelectedPlatform(id)}
                      aria-pressed={selectedPlatform === id}
                      className={cn(
                        'shrink-0 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors',
                        selectedPlatform === id
                          ? 'bg-amber text-ink'
                          : 'bg-steel text-bone-dim hover:text-bone'
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="flex-1 overflow-auto bg-ink p-5">
                  <pre className="whitespace-pre-wrap font-mono text-[12.5px] leading-relaxed text-bone-dim">
                    <code>{getEmbedCode(selectedPlatform)}</code>
                  </pre>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-edge-soft bg-ink-lift px-5 py-3.5">
                  <div className="flex min-w-0 items-center gap-3">
                    <button
                      onClick={() => setEmbedModalStep('info')}
                      className="legend transition-colors hover:text-amber"
                    >
                      <ArrowLeft size={11} className="mr-1 inline" /> Back
                    </button>
                    <span aria-hidden className="h-3 w-px bg-edge" />
                    <span className="truncate font-mono text-[11px] text-bone-faint">
                      Agent {agentId}
                    </span>
                  </div>
                  <Button size="sm" onClick={copyEmbedCode}>
                    {embedCopied ? <Check size={12} /> : <Copy size={12} />}
                    {embedCopied ? 'Copied' : 'Copy code'}
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <BusinessSite config={business} callHref="/call" admin={adminBar}>
      {embedModal}
    </BusinessSite>
  );
};

export default LandingPage;
