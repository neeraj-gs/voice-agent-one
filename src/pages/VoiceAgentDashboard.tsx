/**
 * Voice Agent Dashboard
 * Dashboard for users who chose "Agent Only" - no website
 * Provides testing, editing, and embed/download options
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useConversation } from '@elevenlabs/react';
import {
  Bot,
  Play,
  Square,
  Settings,
  Code,
  Download,
  Copy,
  Check,
  ExternalLink,
  Mic,
  Volume2,
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
  const [isTestingAgent, setIsTestingAgent] = useState(false);
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

  if (!activeBusiness || !activeVoiceAgent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Voice Agent Dashboard</h1>
          <p className="text-slate-400">
            Test, edit, and integrate your AI voice agent
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Agent Info & Test */}
          <div className="lg:col-span-2 space-y-6">
            {/* Agent Card */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Bot size={32} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {activeVoiceAgent.name}
                      </h2>
                      <p className="text-slate-400">
                        {activeVoiceAgent.personality || 'AI Voice Assistant'}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <span className="text-xs text-green-400">Active</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/settings/agent')}
                    className="border-slate-600 text-slate-300 hover:text-white"
                  >
                    <Settings size={16} className="mr-2" />
                    Edit Agent
                  </Button>
                </div>

                {/* First Message Preview */}
                <div className="bg-slate-900/50 rounded-xl p-4 mb-6">
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">First Message</p>
                  <p className="text-slate-300 italic">
                    "{activeVoiceAgent.first_message || 'Hello! How can I help you today?'}"
                  </p>
                </div>

                {/* Test Agent Section */}
                <div className="border-t border-slate-700 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Sparkles size={20} className="text-yellow-400" />
                    Test Your Agent
                  </h3>

                  {isConnected || isConnecting ? (
                    <div className="text-center py-8">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className={cn(
                          'w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center',
                          isConnected ? 'bg-green-500' : 'bg-blue-500'
                        )}
                      >
                        {isConnecting ? (
                          <Loader2 size={40} className="text-white animate-spin" />
                        ) : (
                          <Volume2 size={40} className="text-white" />
                        )}
                      </motion.div>
                      <p className="text-white font-medium mb-2">
                        {isConnecting ? 'Connecting...' : 'Agent is listening...'}
                      </p>
                      {conversation.isSpeaking && (
                        <p className="text-green-400 text-sm">Agent is speaking</p>
                      )}
                      <Button
                        onClick={stopTestConversation}
                        className="mt-4 bg-red-500 hover:bg-red-600"
                      >
                        <Square size={16} className="mr-2" />
                        End Test
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-24 h-24 rounded-full bg-slate-700 mx-auto mb-4 flex items-center justify-center">
                        <Mic size={40} className="text-slate-400" />
                      </div>
                      <p className="text-slate-400 mb-4">
                        Click to start a test conversation with your agent
                      </p>
                      <Button
                        onClick={startTestConversation}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      >
                        <Play size={16} className="mr-2" />
                        Start Test Call
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Agent ID Info */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Agent Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                    <span className="text-slate-400">Agent ID</span>
                    <code className="text-sm text-blue-400 font-mono">{agentId}</code>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                    <span className="text-slate-400">Business</span>
                    <span className="text-white">{activeBusiness.name}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                    <span className="text-slate-400">Industry</span>
                    <span className="text-white capitalize">{activeBusiness.industry}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            {/* Upgrade to Website Card - Only for agent_only users */}
            {activeBusiness.product_type === 'agent_only' && !showUpgradeSuccess && (
              <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30 overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                      <Rocket size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Want a Website?</h3>
                      <p className="text-sm text-purple-200">Get a professional landing page</p>
                    </div>
                  </div>

                  <p className="text-slate-300 text-sm mb-4">
                    Upgrade to get a beautiful, SEO-optimized landing page with your voice agent built-in.
                  </p>

                  <div className="space-y-2 mb-5">
                    {[
                      { icon: Globe, text: 'Professional landing page' },
                      { icon: Search, text: 'SEO optimized for search' },
                      { icon: Users, text: 'Build customer trust' },
                      { icon: Share2, text: 'Shareable public URL' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-slate-300">
                        <item.icon size={14} className="text-purple-400" />
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleUpgradeToWebsite}
                    disabled={isUpgrading}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium rounded-xl transition-all disabled:opacity-50"
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
              <Card className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-500/30 overflow-hidden">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
                    <Check size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Website Unlocked!</h3>
                  <p className="text-green-200 text-sm mb-5">
                    Your professional landing page is ready. Your voice agent is automatically integrated.
                  </p>
                  <button
                    onClick={() => navigate('/site')}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-all"
                  >
                    <Globe size={18} />
                    View Your Website
                    <ArrowRight size={18} />
                  </button>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowEmbedModal(true)}
                    className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 border border-blue-500/20 rounded-xl transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <Code size={20} className="text-blue-400" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-white">Get Embed Code</p>
                        <p className="text-xs text-slate-400">Add to your website</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-slate-400 group-hover:text-white transition-colors" />
                  </button>

                  <button
                    onClick={() => navigate('/settings/agent')}
                    className="w-full flex items-center justify-between p-4 bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/30 rounded-xl transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-600/50 flex items-center justify-center">
                        <Settings size={20} className="text-slate-300" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-white">Edit Agent</p>
                        <p className="text-xs text-slate-400">Customize behavior</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-slate-400 group-hover:text-white transition-colors" />
                  </button>

                  {activeBusiness.product_type === 'website_and_agent' && (
                    <button
                      onClick={() => navigate('/site')}
                      className="w-full flex items-center justify-between p-4 bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/30 rounded-xl transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-600/50 flex items-center justify-center">
                          <Globe size={20} className="text-slate-300" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-white">View Website</p>
                          <p className="text-xs text-slate-400">Your landing page</p>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-slate-400 group-hover:text-white transition-colors" />
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* ElevenLabs Link */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">ElevenLabs Console</h3>
                <p className="text-slate-400 text-sm mb-4">
                  Access advanced settings and analytics in ElevenLabs dashboard.
                </p>
                <a
                  href={`https://elevenlabs.io/app/conversational-ai/${agentId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowEmbedModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-700">
                <div>
                  <h2 className="text-xl font-bold text-white">Embed Your Voice Agent</h2>
                  <p className="text-slate-400 text-sm mt-1">Choose your platform and copy the code</p>
                </div>
                <button
                  onClick={() => setShowEmbedModal(false)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <div className="flex h-[500px]">
                {/* Platform Selector */}
                <div className="w-64 border-r border-slate-700 p-4 overflow-y-auto">
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">Select Platform</p>
                  <div className="space-y-2">
                    {platforms.map((platform) => (
                      <button
                        key={platform.id}
                        onClick={() => setSelectedPlatform(platform.id)}
                        className={cn(
                          'w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left',
                          selectedPlatform === platform.id
                            ? 'bg-blue-500/20 border border-blue-500/30'
                            : 'hover:bg-slate-800 border border-transparent'
                        )}
                      >
                        <platform.icon
                          size={20}
                          className={selectedPlatform === platform.id ? 'text-blue-400' : 'text-slate-400'}
                        />
                        <div>
                          <p className={cn(
                            'font-medium',
                            selectedPlatform === platform.id ? 'text-white' : 'text-slate-300'
                          )}>
                            {platform.name}
                          </p>
                          <p className="text-xs text-slate-500">{platform.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Code Display */}
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center justify-between p-4 border-b border-slate-700">
                    <p className="text-sm text-slate-400">
                      {platforms.find(p => p.id === selectedPlatform)?.name} Integration
                    </p>
                    <Button
                      size="sm"
                      onClick={copyCode}
                      className={cn(
                        'transition-all',
                        copiedCode ? 'bg-green-500 hover:bg-green-600' : ''
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
                  <div className="flex-1 overflow-auto p-4 bg-slate-950">
                    <pre className="text-sm text-slate-300 font-mono whitespace-pre-wrap">
                      {getEmbedCode(selectedPlatform)}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-700 bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Sparkles size={16} className="text-blue-400" />
                  </div>
                  <p className="text-sm text-slate-400">
                    <span className="text-white font-medium">Pro tip:</span> The widget will appear as a floating button in the corner of your website.
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
