/**
 * Voice Agent Dashboard
 * Dashboard for users who chose "Agent Only" - no website
 * Provides testing, editing, and embed/download options
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useConversation } from '@elevenlabs/react';
import {
  Bot,
  Play,
  Square,
  Settings,
  Code,
  Copy,
  Check,
  ExternalLink,
  Globe,
  Smartphone,
  Monitor,
  ChevronRight,
  X,
  Loader2,
  Sparkles,
  Rocket,
  Users,
  Search,
  Share2,
  ArrowRight,
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Button, Card, CardContent } from '../components/ui';
import { Legend, Lamp } from '../components/system/primitives';
import { CapsuleDisplay } from '../components/three/CapsuleDisplay';
import { useAuthStore } from '../stores/authStore';
import {
  useBusinessStore,
  useActiveBusiness,
  useActiveVoiceAgent,
} from '../stores/businessStore';
import { cn } from '../utils/cn';

type Platform = 'html' | 'react' | 'nextjs' | 'shopify';

interface PlatformInfo {
  id: Platform;
  name: string;
  icon: React.ElementType;
  description: string;
}

const platforms: PlatformInfo[] = [
  {
    id: 'html',
    name: 'HTML / JavaScript',
    icon: Globe,
    description: 'Any website with HTML',
  },
  {
    id: 'react',
    name: 'React',
    icon: Monitor,
    description: 'React applications',
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    icon: Monitor,
    description: 'Next.js applications',
  },
  {
    id: 'shopify',
    name: 'Shopify',
    icon: Smartphone,
    description: 'Shopify stores',
  },
];

export const VoiceAgentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const activeBusiness = useActiveBusiness();
  const activeVoiceAgent = useActiveVoiceAgent();
  const { loadActiveBusiness, loadBusinesses } = useBusinessStore();

  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('html');
  const [copiedCode, setCopiedCode] = useState(false);
  const [, setIsTestingAgent] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [showUpgradeSuccess, setShowUpgradeSuccess] = useState(false);

  const { upgradeToWebsite } = useBusinessStore();

  // ElevenLabs conversation hook for testing
  const conversation = useConversation({
    onConnect: () => console.log('Test: Connected to ElevenLabs'),
    onDisconnect: () => console.log('Test: Disconnected from ElevenLabs'),
    onError: (err) => console.error('Test: ElevenLabs error:', err),
  });

  useEffect(() => {
    if (user) {
      loadBusinesses(user.id);
      loadActiveBusiness(user.id);
    }
  }, [user, loadBusinesses, loadActiveBusiness]);

  const agentId = activeVoiceAgent?.elevenlabs_agent_id || '';

  const startTestConversation = useCallback(async () => {
    if (!agentId) return;

    setIsTestingAgent(true);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await conversation.startSession({
        agentId,
        connectionType: 'webrtc',
      });
    } catch (err) {
      console.error('Failed to start test conversation:', err);
      setIsTestingAgent(false);
    }
  }, [agentId, conversation]);

  const stopTestConversation = useCallback(async () => {
    try {
      await conversation.endSession();
    } catch (err) {
      console.error('Failed to end test conversation:', err);
    }
    setIsTestingAgent(false);
  }, [conversation]);

  const getEmbedCode = (platform: Platform): string => {
    switch (platform) {
      case 'html':
        return `<!-- Add this to your HTML -->
<script src="https://elevenlabs.io/convai-widget/index.js" async type="text/javascript"></script>
<elevenlabs-convai agent-id="${agentId}"></elevenlabs-convai>`;

      case 'react':
        return `// 1. Install the package
npm install @elevenlabs/react

// 2. Add to your component
import { useConversation } from '@elevenlabs/react';

function VoiceAgent() {
  const conversation = useConversation({
    onConnect: () => console.log('Connected'),
    onDisconnect: () => console.log('Disconnected'),
    onError: (error) => console.error('Error:', error),
  });

  const startConversation = async () => {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    await conversation.startSession({
      agentId: '${agentId}',
    });
  };

  const stopConversation = async () => {
    await conversation.endSession();
  };

  return (
    <div>
      <button onClick={startConversation}>Start Call</button>
      <button onClick={stopConversation}>End Call</button>
      <p>Status: {conversation.status}</p>
    </div>
  );
}`;

      case 'nextjs':
        return `// 1. Install the package
npm install @elevenlabs/react

// 2. Create a client component (app/components/VoiceAgent.tsx)
'use client';

import { useConversation } from '@elevenlabs/react';

export function VoiceAgent() {
  const conversation = useConversation({
    onConnect: () => console.log('Connected'),
    onDisconnect: () => console.log('Disconnected'),
    onError: (error) => console.error('Error:', error),
  });

  const startConversation = async () => {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    await conversation.startSession({
      agentId: '${agentId}',
    });
  };

  const stopConversation = async () => {
    await conversation.endSession();
  };

  return (
    <div>
      <button onClick={startConversation}>Start Call</button>
      <button onClick={stopConversation}>End Call</button>
      <p>Status: {conversation.status}</p>
    </div>
  );
}

// 3. Use in your page
import { VoiceAgent } from './components/VoiceAgent';

export default function Page() {
  return <VoiceAgent />;
}`;

      case 'shopify':
        return `<!-- Add this to your Shopify theme -->
<!-- Go to: Online Store > Themes > Edit code > theme.liquid -->
<!-- Add before </body> tag: -->

<script src="https://elevenlabs.io/convai-widget/index.js" async type="text/javascript"></script>
<elevenlabs-convai agent-id="${agentId}"></elevenlabs-convai>

<!-- Optional: Style the widget position -->
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

  const copyCode = () => {
    navigator.clipboard.writeText(getEmbedCode(selectedPlatform));
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleUpgradeToWebsite = async () => {
    setIsUpgrading(true);
    const { error } = await upgradeToWebsite();
    setIsUpgrading(false);

    if (!error) {
      setShowUpgradeSuccess(true);
    }
  };

  const isConnected = conversation.status === 'connected';
  const isConnecting = conversation.status === 'connecting';

  // Drives the capsule membrane from the SDK's own analyser, read per frame so
  // it never costs a React render.
  const levelRef = useRef(0);
  useEffect(() => {
    if (!isConnected) {
      levelRef.current = 0;
      return;
    }
    let raf = 0;
    const mean = (d: Uint8Array | undefined) => {
      if (!d?.length) return 0;
      let sum = 0;
      for (let i = 0; i < d.length; i++) sum += d[i];
      return sum / d.length / 255;
    };
    const tick = () => {
      let v = 0;
      try {
        v = conversation.isSpeaking
          ? mean(conversation.getOutputByteFrequencyData())
          : mean(conversation.getInputByteFrequencyData());
      } catch {
        v = 0;
      }
      levelRef.current = Math.min(1, v * 2.4);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isConnected, conversation]);

  if (!activeBusiness || !activeVoiceAgent) {
    return (
      <div className="min-h-screen bg-ink">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-amber animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="display text-[clamp(1.75rem,4vw,2.5rem)] mb-3">Voice Agent Dashboard</h1>
          <p className="text-bone-dim">
            Test, edit, and integrate your AI voice agent
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Agent Info & Test */}
          <div className="lg:col-span-2 space-y-6">
            {/* Agent Card */}
            <Card className="bg-steel border-edge-soft">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center border border-amber-deep bg-amber-shadow">
                      <Bot size={32} className="text-bone" />
                    </div>
                    <div>
                      <h2 className="display-lite text-lg text-bone">
                        {activeVoiceAgent.name}
                      </h2>
                      <p className="text-bone-dim">
                        {activeVoiceAgent.personality || 'AI Voice Assistant'}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="w-2 h-2 rounded-full bg-patina"></span>
                        <span className="text-xs text-patina-glow">Active</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/settings/agent')}
                    className="border-edge text-bone-dim hover:text-bone"
                  >
                    <Settings size={16} className="mr-2" />
                    Edit Agent
                  </Button>
                </div>

                {/* First Message Preview */}
                <div className="bg-ink/50 rounded-panel p-4 mb-6">
                  <p className="text-xs text-bone-faint uppercase tracking-wide mb-2">First Message</p>
                  <p className="text-bone-dim italic">
                    "{activeVoiceAgent.first_message || 'Hello! How can I help you today?'}"
                  </p>
                </div>

                {/* Test the agent — the same capsule the call page uses, so
                    the owner and the caller watch the same instrument. */}
                <div className="border-t border-edge-soft pt-6">
                  <div className="mb-5 flex items-center gap-3">
                    <Legend>Test the line</Legend>
                    <span aria-hidden className="h-px flex-1 bg-edge-soft" />
                    <Lamp state={isConnected ? 'live' : isConnecting ? 'ready' : 'off'} pulse={isConnecting} />
                  </div>

                  <div className="flex flex-col items-center">
                    <CapsuleDisplay
                      mode={
                        isConnecting
                          ? 'connecting'
                          : !isConnected
                          ? 'idle'
                          : conversation.isSpeaking
                          ? 'speaking'
                          : 'listening'
                      }
                      levelRef={levelRef}
                      name={activeVoiceAgent.name}
                      className="w-full"
                    />

                    <div className="mt-6 w-full max-w-[22rem]">
                      {isConnected || isConnecting ? (
                        <Button variant="danger" size="lg" onClick={stopTestConversation} className="w-full">
                          <Square size={14} /> End test
                        </Button>
                      ) : (
                        <>
                          <Button size="lg" onClick={startTestConversation} className="w-full">
                            <Play size={14} /> Start a test call
                          </Button>
                          <p className="mt-3 text-center text-[13px] text-bone-dim">
                            You will be asked for the microphone. Nothing is recorded here.
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Agent ID Info */}
            <Card className="bg-steel border-edge-soft">
              <CardContent className="p-6">
                <h3 className="display-lite text-[15px] text-bone mb-4">Agent Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-ink/50 rounded-panel">
                    <span className="text-bone-dim">Agent ID</span>
                    <code className="text-sm text-amber font-mono">{agentId}</code>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-ink/50 rounded-panel">
                    <span className="text-bone-dim">Business</span>
                    <span className="text-bone">{activeBusiness.name}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-ink/50 rounded-panel">
                    <span className="text-bone-dim">Industry</span>
                    <span className="text-bone capitalize">{activeBusiness.industry}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            {/* Upgrade to Website Card - Only for agent_only users */}
            {activeBusiness.product_type === 'agent_only' && !showUpgradeSuccess && (
              <Card className="bg-steel border-patina/40 overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center border border-edge-bright bg-steel-high">
                      <Rocket size={24} className="text-bone" />
                    </div>
                    <div>
                      <h3 className="display-lite text-[15px] text-bone">Want a Website?</h3>
                      <p className="text-sm text-bone-dim">Get a professional landing page</p>
                    </div>
                  </div>

                  <p className="text-bone-dim text-sm mb-4">
                    Upgrade to get a beautiful, SEO-optimized landing page with your voice agent built-in.
                  </p>

                  <div className="space-y-2 mb-5">
                    {[
                      { icon: Globe, text: 'Professional landing page' },
                      { icon: Search, text: 'SEO optimized for search' },
                      { icon: Users, text: 'Build customer trust' },
                      { icon: Share2, text: 'Shareable public URL' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-bone-dim">
                        <item.icon size={14} className="text-patina-glow" />
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleUpgradeToWebsite}
                    disabled={isUpgrading}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-amber text-ink hover:bg-amber-glow text-ink font-medium rounded-panel transition-all disabled:opacity-50"
                  >
                    {isUpgrading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Upgrading...
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        Upgrade to Website
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </CardContent>
              </Card>
            )}

            {/* Upgrade Success Card */}
            {showUpgradeSuccess && (
              <Card className="bg-steel border-patina/40 overflow-hidden">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-patina flex items-center justify-center mx-auto mb-4">
                    <Check size={32} className="text-bone" />
                  </div>
                  <h3 className="display-lite text-lg text-bone mb-2">Website Unlocked!</h3>
                  <p className="text-green-200 text-sm mb-5">
                    Your professional landing page is ready. Your voice agent is automatically integrated.
                  </p>
                  <button
                    onClick={() => navigate('/site')}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-patina hover:bg-patina-glow text-bone font-medium rounded-panel transition-all"
                  >
                    <Globe size={18} />
                    View Your Website
                    <ArrowRight size={18} />
                  </button>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="bg-steel border-edge-soft">
              <CardContent className="p-6">
                <h3 className="display-lite text-[15px] text-bone mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowEmbedModal(true)}
                    className="w-full flex items-center justify-between p-4 bg-steel hover:bg-steel-high border border-amber/40 rounded-panel transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center border border-edge bg-steel-lift">
                        <Code size={20} className="text-amber" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-bone">Get Embed Code</p>
                        <p className="text-xs text-bone-dim">Add to your website</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-bone-dim group-hover:text-bone transition-colors" />
                  </button>

                  <button
                    onClick={() => navigate('/settings/agent')}
                    className="w-full flex items-center justify-between p-4 bg-steel-lift hover:bg-steel-high border border-edge/30 rounded-panel transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-panel bg-steel-high/50 flex items-center justify-center">
                        <Settings size={20} className="text-bone-dim" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-bone">Edit Agent</p>
                        <p className="text-xs text-bone-dim">Customize behavior</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-bone-dim group-hover:text-bone transition-colors" />
                  </button>

                  {activeBusiness.product_type === 'website_and_agent' && (
                    <button
                      onClick={() => navigate('/site')}
                      className="w-full flex items-center justify-between p-4 bg-steel-lift hover:bg-steel-high border border-edge/30 rounded-panel transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-panel bg-steel-high/50 flex items-center justify-center">
                          <Globe size={20} className="text-bone-dim" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-bone">View Website</p>
                          <p className="text-xs text-bone-dim">Your landing page</p>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-bone-dim group-hover:text-bone transition-colors" />
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* ElevenLabs Link */}
            <Card className="bg-steel border-edge-soft">
              <CardContent className="p-6">
                <h3 className="display-lite text-[15px] text-bone mb-4">ElevenLabs Console</h3>
                <p className="text-bone-dim text-sm mb-4">
                  Access advanced settings and analytics in ElevenLabs dashboard.
                </p>
                <a
                  href={`https://elevenlabs.io/app/conversational-ai/${agentId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-amber hover:text-amber text-sm"
                >
                  Open in ElevenLabs
                  <ExternalLink size={14} />
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Embed Modal */}
      <AnimatePresence>
        {showEmbedModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={() => setShowEmbedModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-ink border border-edge-soft rounded-panel max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-edge-soft">
                <div>
                  <h2 className="display-lite text-lg text-bone">Embed Your Voice Agent</h2>
                  <p className="text-bone-dim text-sm mt-1">Choose your platform and copy the code</p>
                </div>
                <button
                  onClick={() => setShowEmbedModal(false)}
                  className="p-2 hover:bg-steel rounded-panel transition-colors"
                >
                  <X size={20} className="text-bone-dim" />
                </button>
              </div>

              <div className="flex h-[500px]">
                {/* Platform Selector */}
                <div className="w-64 border-r border-edge-soft p-4 overflow-y-auto">
                  <p className="text-xs text-bone-faint uppercase tracking-wide mb-3">Select Platform</p>
                  <div className="space-y-2">
                    {platforms.map((platform) => (
                      <button
                        key={platform.id}
                        onClick={() => setSelectedPlatform(platform.id)}
                        className={cn(
                          'w-full flex items-center gap-3 p-3 rounded-panel transition-all text-left',
                          selectedPlatform === platform.id
                            ? 'bg-amber-shadow border border-amber/40'
                            : 'hover:bg-steel border border-transparent'
                        )}
                      >
                        <platform.icon
                          size={20}
                          className={selectedPlatform === platform.id ? 'text-amber' : 'text-bone-dim'}
                        />
                        <div>
                          <p className={cn(
                            'font-medium',
                            selectedPlatform === platform.id ? 'text-bone' : 'text-bone-dim'
                          )}>
                            {platform.name}
                          </p>
                          <p className="text-xs text-bone-faint">{platform.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Code Display */}
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center justify-between p-4 border-b border-edge-soft">
                    <p className="text-sm text-bone-dim">
                      {platforms.find(p => p.id === selectedPlatform)?.name} Integration
                    </p>
                    <Button
                      size="sm"
                      onClick={copyCode}
                      className={cn(
                        'transition-all',
                        copiedCode ? 'bg-patina hover:bg-patina-glow' : ''
                      )}
                    >
                      {copiedCode ? (
                        <>
                          <Check size={14} className="mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={14} className="mr-2" />
                          Copy Code
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="flex-1 overflow-auto p-4 bg-ink">
                    <pre className="text-sm text-bone-dim font-mono whitespace-pre-wrap">
                      {getEmbedCode(selectedPlatform)}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-edge-soft bg-steel">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-shadow flex items-center justify-center">
                    <Sparkles size={16} className="text-amber" />
                  </div>
                  <p className="text-sm text-bone-dim">
                    <span className="text-bone font-medium">Pro tip:</span> The widget will appear as a floating button in the corner of your website.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceAgentDashboard;
