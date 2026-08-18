/**
 * Call Page
 * Voice agent calling interface with ElevenLabs Conversational AI
 *
 * The console for one agent: the capsule on the left with the transport under
 * it, the agent's brief and the business record on the right. The membrane is
 * driven by the real frequency data coming out of the SDK, so what you see
 * moving is what is actually being said.
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useConversation } from '@elevenlabs/react';
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  ArrowLeft,
  ArrowRight,
  Clock,
  Code,
  X,
  Copy,
  Check,
} from 'lucide-react';
import { Button } from '../components/ui';
import { Header } from '../components/layout/Header';
import { Legend, Lamp, Tag } from '../components/system/primitives';
import { CapsuleDisplay } from '../components/three/CapsuleDisplay';
import type { DiaphragmMode } from '../components/three/Diaphragm';
import { useBusiness, useBranding, useAPIKeys } from '../stores/configStore';
import { cn } from '../utils/cn';

type Platform = 'html' | 'react' | 'nextjs' | 'shopify';

export const CallPage: React.FC = () => {
  const business = useBusiness();
  const branding = useBranding();
  const apiKeys = useAPIKeys();

  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [micMuted, setMicMuted] = useState(false);
  const [showEmbed, setShowEmbed] = useState(false);
  const [embedStep, setEmbedStep] = useState<'info' | 'code'>('info');
  const [platform, setPlatform] = useState<Platform>('html');
  const [copied, setCopied] = useState(false);

  const levelRef = useRef(0);

  // ElevenLabs Conversation Hook
  const conversation = useConversation({
    micMuted,
    onConnect: () => {
      setError(null);
    },
    onDisconnect: () => {
      levelRef.current = 0;
    },
    onError: (err: Error | string) => {
      console.error('ElevenLabs error:', err);
      setError(typeof err === 'string' ? err : err.message || 'The line dropped. Try again.');
    },
  });

  const isConnected = conversation.status === 'connected';
  const isConnecting = conversation.status === 'connecting';
  const isIdle = conversation.status === 'disconnected';

  // Timer for call duration
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isConnected) {
      interval = setInterval(() => setDuration((d) => d + 1), 1000);
    } else {
      setDuration(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isConnected]);

  // Drive the membrane from the SDK's own analyser. Output data while the
  // agent talks, input data while the caller does.
  useEffect(() => {
    if (!isConnected) {
      levelRef.current = 0;
      return;
    }
    let raf = 0;
    const read = (data: Uint8Array | undefined) => {
      if (!data || data.length === 0) return null;
      let sum = 0;
      for (let i = 0; i < data.length; i++) sum += data[i];
      return sum / data.length / 255;
    };
    const tick = () => {
      let v: number | null = null;
      try {
        v = conversation.isSpeaking
          ? read(conversation.getOutputByteFrequencyData())
          : read(conversation.getInputByteFrequencyData());
      } catch {
        v = null;
      }
      levelRef.current = Math.min(1, (v ?? 0) * 2.4);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isConnected, conversation]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startConversation = useCallback(async () => {
    if (!apiKeys?.elevenLabsAgentId) {
      setError('No agent is attached to this business yet. Add an Agent ID in Settings.');
      return;
    }

    setError(null);

    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Start the conversation with the agent using WebRTC for audio
      await conversation.startSession({
        agentId: apiKeys.elevenLabsAgentId,
        connectionType: 'webrtc', // Required for voice audio streaming
      });
    } catch (err) {
      console.error('Failed to start conversation:', err);
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError('The browser blocked the microphone. Allow it for this site, then start again.');
        } else {
          setError(err.message || 'Could not open the line.');
        }
      } else {
        setError('Could not open the line.');
      }
    }
  }, [apiKeys, conversation]);

  const endConversation = useCallback(async () => {
    try {
      await conversation.endSession();
    } catch (err) {
      console.error('Failed to end conversation:', err);
    }
  }, [conversation]);

  // Get agent ID for embed code
  const agentId = apiKeys?.elevenLabsAgentId || 'your-agent-id';

  // Generate embed code based on platform
  const getEmbedCode = (p: Platform): string => {
    switch (p) {
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
      await navigator.clipboard.writeText(getEmbedCode(platform));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Escape closes the embed panel.
  useEffect(() => {
    if (!showEmbed) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setShowEmbed(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [showEmbed]);

  if (!business || !branding) {
    return null;
  }

  const mode: DiaphragmMode = isConnecting
    ? 'connecting'
    : !isConnected
    ? 'idle'
    : conversation.isSpeaking
    ? 'speaking'
    : 'listening';

  const agent = business.voiceAgent.name;

  const canDo = [
    `Book ${business.terms.appointment}s with ${business.staff.name}`,
    `Answer questions about your ${business.terms.service}s`,
    'Give out hours, address and directions',
    `Move or cancel an existing ${business.terms.appointment}`,
  ];

  return (
    <div className="min-h-screen bg-ink">
      <Header />

      <main className="mx-auto w-full max-w-[80rem] px-5 py-8 sm:px-8">
        {/* Page plate */}
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-edge-soft pb-6">
          <div>
            <div className="flex items-center gap-2">
              <Legend>Voice agent</Legend>
              <span aria-hidden className="h-px w-6 bg-edge" />
              <Tag tone={isConnected ? 'live' : 'neutral'}>{conversation.status}</Tag>
            </div>
            <h1 className="display mt-3 text-[clamp(1.75rem,4vw,2.75rem)]">{agent}</h1>
            <p className="mt-2 max-w-md text-[14px] text-bone-dim">
              {business.voiceAgent.personality} &middot; answering for {business.name}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowEmbed(true)}>
              <Code size={13} /> Embed
            </Button>
            <Link to="/site">
              <Button variant="ghost" size="sm">
                <ArrowLeft size={13} /> Your site
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-14">
          {/* ── CAPSULE + TRANSPORT ── */}
          <div className="flex flex-col items-center">
            <CapsuleDisplay
              mode={mode}
              levelRef={levelRef}
              name={agent}
              elapsed={isConnected ? formatDuration(duration) : null}
              className="w-full"
            />

            <div className="mt-8 flex w-full max-w-[22rem] flex-col gap-3">
              {isIdle ? (
                <Button size="lg" onClick={startConversation} className="w-full">
                  <Phone size={15} /> Start the call
                </Button>
              ) : (
                <div className="grid grid-cols-[1fr_auto] gap-3">
                  <Button variant="danger" size="lg" onClick={endConversation}>
                    <PhoneOff size={15} /> End call
                  </Button>
                  <Button
                    variant={micMuted ? 'primary' : 'secondary'}
                    size="lg"
                    onClick={() => setMicMuted((m) => !m)}
                    aria-pressed={micMuted}
                    title={micMuted ? 'Unmute your microphone' : 'Mute your microphone'}
                  >
                    {micMuted ? <MicOff size={15} /> : <Mic size={15} />}
                    <span className="sr-only">
                      {micMuted ? 'Unmute microphone' : 'Mute microphone'}
                    </span>
                  </Button>
                </div>
              )}

              <AnimatePresence>
                {error && (
                  <motion.p
                    role="alert"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="border border-clip-deep bg-clip/10 px-3.5 py-2.5 font-mono text-[12px] leading-snug text-clip"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {micMuted && isConnected && (
                <p className="text-center font-mono text-[11px] text-amber">
                  Your microphone is muted. {agent} cannot hear you.
                </p>
              )}
            </div>
          </div>

          {/* ── BRIEF + RECORD ── */}
          <div className="space-y-px bg-edge-soft">
            <section className="bg-ink py-6">
              <div className="flex items-center gap-3">
                <Legend>What it handles</Legend>
                <span aria-hidden className="h-px flex-1 bg-edge-soft" />
              </div>
              <ul className="mt-4 space-y-2.5">
                {canDo.map((c) => (
                  <li key={c} className="flex items-start gap-3 text-[14px] text-bone-dim">
                    <Check size={13} className="mt-1 shrink-0 text-patina" />
                    {c}
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-ink py-6">
              <div className="flex items-center gap-3">
                <Legend>Business record</Legend>
                <span aria-hidden className="h-px flex-1 bg-edge-soft" />
              </div>
              <dl className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {[
                  ['Trading as', business.name],
                  ['Who', `${business.staff.name} · ${business.staff.title}`],
                  ['Phone', business.phone],
                  ['Weekdays', business.hours.weekdays],
                  ['Where', `${business.address.city}, ${business.address.state}`],
                  ['Calls it takes', business.terms.customer],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="legend">{k}</dt>
                    <dd className="mt-1 text-[14px] text-bone">{v}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="bg-ink py-6">
              <div className="flex items-center gap-3">
                <Legend>Connection</Legend>
                <span aria-hidden className="h-px flex-1 bg-edge-soft" />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
                <span className="flex items-center gap-2">
                  <Lamp state={isConnected ? 'live' : isConnecting ? 'ready' : 'off'} />
                  <span className="readout text-[11px] text-bone-dim">{conversation.status}</span>
                </span>
                <span className="flex min-w-0 items-center gap-2">
                  <Legend>Agent ID</Legend>
                  <code className="truncate rounded-panel bg-steel px-2 py-1 font-mono text-[11px] text-bone-dim">
                    {apiKeys?.elevenLabsAgentId || 'not set'}
                  </code>
                </span>
                {isConnected && (
                  <span className="flex items-center gap-2">
                    <Clock size={12} className="text-bone-faint" />
                    <span className="readout text-[11px] text-bone-dim">
                      {formatDuration(duration)}
                    </span>
                  </span>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* ── EMBED PANEL ── */}
      <AnimatePresence>
        {showEmbed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/85 p-4 backdrop-blur-sm"
            onClick={() => {
              setShowEmbed(false);
              setEmbedStep('info');
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
              className="panel-lift flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden"
            >
              <div className="flex items-center gap-3 border-b border-edge-soft px-5 py-3.5">
                <Legend>{embedStep === 'info' ? 'Embed · what you get' : 'Embed · the code'}</Legend>
                <span aria-hidden className="h-px flex-1 bg-edge-soft" />
                <span className="readout text-[10px] text-bone-faint">
                  {embedStep === 'info' ? '1 / 2' : '2 / 2'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setShowEmbed(false);
                    setEmbedStep('info');
                  }}
                  aria-label="Close"
                  className="text-bone-faint transition-colors hover:text-amber"
                >
                  <X size={16} />
                </button>
              </div>

              {embedStep === 'info' ? (
                <>
                  <div className="overflow-y-auto p-6">
                    <h2 className="display text-[clamp(1.5rem,3vw,2rem)]">
                      Keep the site
                      <br />
                      you already have
                    </h2>
                    <p className="mt-4 max-w-lg text-[14.5px] leading-relaxed text-bone-dim">
                      {agent} does not need a new page to live on. Paste two lines into the site
                      you run today and it starts answering there, with everything it already
                      knows about {business.name}.
                    </p>

                    <div className="mt-8 grid gap-px bg-edge-soft sm:grid-cols-2">
                      {[
                        ['Two minutes', 'Copy the snippet, paste it, publish. That is the whole job.'],
                        ['Any platform', 'React, Next.js, Shopify, WordPress, or plain HTML.'],
                        ['Same agent', `${agent}, with the same knowledge base and the same voice.`],
                        ['Your styling', 'Position and style the widget to sit in your own layout.'],
                      ].map(([t, d]) => (
                        <div key={t} className="bg-steel p-4">
                          <div className="display-lite text-[13px] text-bone">{t}</div>
                          <p className="mt-1.5 text-[13px] leading-snug text-bone-dim">{d}</p>
                        </div>
                      ))}
                    </div>

                    <ul className="mt-8 space-y-2 border-t border-edge-soft pt-5">
                      {[
                        'A floating talk button on every page you add it to',
                        'Full conversations, not a chat box',
                        'Booking and rescheduling through the same webhooks',
                        'Works on mobile and desktop browsers',
                        'Nothing extra to host or maintain',
                      ].map((i) => (
                        <li key={i} className="flex items-start gap-2.5 text-[13.5px] text-bone-dim">
                          <Check size={13} className="mt-1 shrink-0 text-patina" />
                          {i}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-end gap-3 border-t border-edge-soft bg-ink-lift px-5 py-3.5">
                    <Button size="md" onClick={() => setEmbedStep('code')}>
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
                        onClick={() => setPlatform(id)}
                        aria-pressed={platform === id}
                        className={cn(
                          'shrink-0 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors',
                          platform === id
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
                      <code>{getEmbedCode(platform)}</code>
                    </pre>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-edge-soft bg-ink-lift px-5 py-3.5">
                    <div className="flex min-w-0 items-center gap-3">
                      <button
                        onClick={() => setEmbedStep('info')}
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
                      {copied ? <Check size={12} /> : <Copy size={12} />}
                      {copied ? 'Copied' : 'Copy code'}
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CallPage;
