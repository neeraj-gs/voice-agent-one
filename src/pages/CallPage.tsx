/**
 * Call Page
 * Voice agent calling interface with ElevenLabs Conversational AI
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useConversation } from '@elevenlabs/react';
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  ArrowLeft,
  ArrowRight,
  MessageSquare,
  Clock,
  Volume2,
  Loader2,
  Info,
  AlertCircle,
  Code,
  X,
  Copy,
  Sparkles,
  Check,
  Globe,
  Zap,
  Shield,
} from 'lucide-react';
import { Button, Card, CardContent } from '../components/ui';
import { useBusiness, useBranding, useAPIKeys } from '../stores/configStore';
import { cn } from '../utils/cn';

export const CallPage: React.FC = () => {
  const business = useBusiness();
  const branding = useBranding();
  const apiKeys = useAPIKeys();

  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [embedModalStep, setEmbedModalStep] = useState<'info' | 'code'>('info');
  const [selectedPlatform, setSelectedPlatform] = useState<'html' | 'react' | 'nextjs' | 'shopify'>('html');
  const [embedCopied, setEmbedCopied] = useState(false);
  const [showEmbedBanner, setShowEmbedBanner] = useState(true);

  // ElevenLabs Conversation Hook
  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to ElevenLabs');
      setError(null);
    },
    onDisconnect: () => {
      console.log('Disconnected from ElevenLabs');
    },
    onError: (err) => {
      console.error('ElevenLabs error:', err);
      setError(err.message || 'Connection error occurred');
    },
    onMessage: (message) => {
      console.log('Message:', message);
    },
  });

  // Timer for call duration
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (conversation.status === 'connected') {
      interval = setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);
    } else {
      setDuration(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [conversation.status]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startConversation = useCallback(async () => {
    if (!apiKeys?.elevenLabsAgentId) {
      setError('ElevenLabs Agent ID not configured');
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
          setError('Microphone access denied. Please allow microphone access and try again.');
        } else {
          setError(err.message || 'Failed to start conversation');
        }
      } else {
        setError('Failed to start conversation');
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

  const toggleMute = useCallback(() => {
    if (conversation.isSpeaking) {
      // Can't mute while agent is speaking
      return;
    }
    // Toggle microphone mute (ElevenLabs SDK handles this internally)
  }, [conversation.isSpeaking]);

  // Get agent ID for embed code
  const agentId = apiKeys?.elevenLabsAgentId || 'your-agent-id';

  // Generate embed code based on platform
  const getEmbedCode = (platform: 'html' | 'react' | 'nextjs' | 'shopify'): string => {
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

  if (!business || !branding) {
    return null;
  }

  const isConnected = conversation.status === 'connected';
  const isConnecting = conversation.status === 'connecting';
  const isIdle = conversation.status === 'disconnected';

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(180deg, ${branding.primaryColor}15 0%, transparent 50%)`,
      }}
    >
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/site" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              <ArrowLeft size={20} />
              <span>Back to {business.name}</span>
            </Link>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEmbedModal(true)}
                className="text-purple-600 border-purple-200 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-800 dark:hover:bg-purple-900/20"
              >
                <Code size={16} className="mr-1.5" />
                Embed
              </Button>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Embed Banner - Admin Only */}
      <AnimatePresence>
        {showEmbedBanner && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ background: 'linear-gradient(to right, #7c3aed, #4f46e5)' }}
          >
            <div className="max-w-4xl mx-auto px-4 py-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className="hidden sm:flex w-8 h-8 rounded-lg items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                  >
                    <Sparkles size={16} style={{ color: '#ffffff' }} />
                  </div>
                  <div className="min-w-0">
                    <p style={{ color: '#ffffff', fontSize: '14px', fontWeight: 500 }} className="truncate">
                      Already have a website?
                    </p>
                    <p style={{ color: '#e9d5ff', fontSize: '12px' }} className="truncate">
                      Embed just the voice agent on your existing site - works with React, Next.js, Shopify & more
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setShowEmbedModal(true)}
                    style={{
                      backgroundColor: '#ffffff',
                      color: '#7c3aed',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Code size={14} />
                    <span className="hidden sm:inline">Get Embed Code</span>
                    <span className="sm:hidden">Embed</span>
                  </button>
                  <button
                    onClick={() => setShowEmbedBanner(false)}
                    style={{ padding: '6px', borderRadius: '8px' }}
                    className="hover:bg-white/10 transition-colors"
                    aria-label="Dismiss"
                  >
                    <X size={16} style={{ color: 'rgba(255,255,255,0.8)' }} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-6"
          >
            <div
              className={cn(
                'w-24 h-24 rounded-full flex items-center justify-center mx-auto',
                'transition-all duration-300',
                isConnected ? 'animate-pulse' : ''
              )}
              style={{
                backgroundColor:
                  isConnected
                    ? branding.accentColor || '#22c55e'
                    : isConnecting
                    ? branding.primaryColor
                    : `${branding.primaryColor}20`,
              }}
            >
              {isConnecting ? (
                <Loader2 size={40} className="text-white animate-spin" />
              ) : isConnected ? (
                <Volume2 size={40} className="text-white" />
              ) : (
                <MessageSquare size={40} style={{ color: branding.primaryColor }} />
              )}
            </div>
          </motion.div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {isConnected
              ? `Speaking with ${business.voiceAgent.name}`
              : isConnecting
              ? 'Connecting...'
              : `Talk to ${business.voiceAgent.name}`}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isConnected
              ? business.voiceAgent.personality
              : `Your ${business.voiceAgent.personality} AI assistant for ${business.name}`}
          </p>

          {/* Duration */}
          {isConnected && (
            <div className="flex items-center justify-center gap-2 mt-4 text-gray-500">
              <Clock size={16} />
              <span>{formatDuration(duration)}</span>
            </div>
          )}

          {/* Agent Speaking Indicator */}
          {isConnected && conversation.isSpeaking && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center justify-center gap-2 text-green-600"
            >
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-sm font-medium">{business.voiceAgent.name} is speaking...</span>
            </motion.div>
          )}
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 flex items-center gap-3"
            >
              <AlertCircle size={20} />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Call Controls */}
        <div className="flex justify-center gap-4 mb-12">
          {isIdle ? (
            <button
              onClick={startConversation}
              style={{
                backgroundColor: branding.primaryColor,
                color: '#ffffff',
                padding: '12px 32px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <Phone size={20} />
              Start Conversation
            </button>
          ) : (
            <>
              <Button
                variant="outline"
                size="lg"
                onClick={toggleMute}
                className="w-14 h-14 rounded-full p-0"
                disabled={conversation.isSpeaking}
              >
                <Mic size={24} />
              </Button>
              <Button
                size="lg"
                onClick={endConversation}
                className="w-14 h-14 rounded-full p-0 bg-red-500 hover:bg-red-600"
              >
                <PhoneOff size={24} />
              </Button>
            </>
          )}
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* What the agent can do */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${branding.primaryColor}15` }}
                >
                  <Info size={20} style={{ color: branding.primaryColor }} />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  What {business.voiceAgent.name} Can Help With
                </h3>
              </div>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: `${branding.accentColor || branding.primaryColor}20` }}
                  >
                    <span
                      className="text-xs"
                      style={{ color: branding.accentColor || branding.primaryColor }}
                    >
                      ✓
                    </span>
                  </div>
                  <span>Schedule {business.terms.appointment}s with {business.staff.name}</span>
                </li>
                <li className="flex items-start gap-2">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: `${branding.accentColor || branding.primaryColor}20` }}
                  >
                    <span
                      className="text-xs"
                      style={{ color: branding.accentColor || branding.primaryColor }}
                    >
                      ✓
                    </span>
                  </div>
                  <span>Answer questions about our {business.terms.service}s</span>
                </li>
                <li className="flex items-start gap-2">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: `${branding.accentColor || branding.primaryColor}20` }}
                  >
                    <span
                      className="text-xs"
                      style={{ color: branding.accentColor || branding.primaryColor }}
                    >
                      ✓
                    </span>
                  </div>
                  <span>Provide business hours and location info</span>
                </li>
                <li className="flex items-start gap-2">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: `${branding.accentColor || branding.primaryColor}20` }}
                  >
                    <span
                      className="text-xs"
                      style={{ color: branding.accentColor || branding.primaryColor }}
                    >
                      ✓
                    </span>
                  </div>
                  <span>Reschedule or cancel existing {business.terms.appointment}s</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Business Info */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: branding.primaryColor }}
                >
                  {business.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {business.staff.name}
                  </h3>
                  <p className="text-sm text-gray-500">{business.staff.title}</p>
                </div>
              </div>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  <span>{business.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>Mon-Fri: {business.hours.weekdays}</span>
                </div>
                <p className="pt-2 border-t border-gray-200 dark:border-slate-700">
                  {business.address.city}, {business.address.state}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Connection Status */}
        <div className="mt-8 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Agent ID: <code className="px-2 py-1 bg-gray-200 dark:bg-slate-700 rounded text-xs">{apiKeys?.elevenLabsAgentId || 'Not configured'}</code>
            <span className="mx-2">•</span>
            Status: <span className={cn(
              'font-medium',
              isConnected ? 'text-green-600' : isConnecting ? 'text-yellow-600' : 'text-gray-600'
            )}>
              {conversation.status}
            </span>
          </p>
        </div>
      </main>

      {/* Embed Modal */}
      <AnimatePresence>
        {showEmbedModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4"
            onClick={() => {
              setShowEmbedModal(false);
              setEmbedModalStep('info');
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: branding.primaryColor }}
                  >
                    <Code size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {embedModalStep === 'info' ? 'Voice Agent Embed' : 'Get Embed Code'}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      {embedModalStep === 'info'
                        ? 'Add AI voice to your existing website'
                        : `Add ${business.voiceAgent.name} to your website`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Step Indicator */}
                  <div className="hidden sm:flex items-center gap-1.5 mr-2">
                    <div
                      className="w-2 h-2 rounded-full transition-colors"
                      style={{ backgroundColor: embedModalStep === 'info' ? branding.primaryColor : '#d1d5db' }}
                    />
                    <div
                      className="w-2 h-2 rounded-full transition-colors"
                      style={{ backgroundColor: embedModalStep === 'code' ? branding.primaryColor : '#d1d5db' }}
                    />
                  </div>
                  <button
                    onClick={() => {
                      setShowEmbedModal(false);
                      setEmbedModalStep('info');
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <X size={20} className="text-gray-500 dark:text-slate-400" />
                  </button>
                </div>
              </div>

              {/* Page 1: Info Page */}
              {embedModalStep === 'info' && (
                <>
                  <div className="p-6 overflow-auto max-h-[60vh]">
                    {/* Hero Section */}
                    <div className="text-center mb-8">
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                        style={{ backgroundColor: `${branding.primaryColor}15` }}
                      >
                        <Globe size={32} style={{ color: branding.primaryColor }} />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Already have a website?
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                        No need for a new landing page. Just embed {business.voiceAgent.name} directly on your existing website with a few lines of code.
                      </p>
                    </div>

                    {/* Benefits */}
                    <div className="grid sm:grid-cols-2 gap-4 mb-8">
                      {[
                        {
                          icon: Zap,
                          title: '2-Minute Setup',
                          desc: 'Copy the code, paste it in your site, and your AI agent is live.',
                        },
                        {
                          icon: Globe,
                          title: 'Works Everywhere',
                          desc: 'React, Next.js, Shopify, WordPress, or any HTML website.',
                        },
                        {
                          icon: MessageSquare,
                          title: 'Same AI Agent',
                          desc: `${business.voiceAgent.name} with all your business knowledge built-in.`,
                        },
                        {
                          icon: Shield,
                          title: 'Fully Customizable',
                          desc: 'Control positioning, styling, and behavior to match your brand.',
                        },
                      ].map((benefit, index) => (
                        <div
                          key={index}
                          className="flex gap-3 p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700"
                        >
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${branding.primaryColor}15` }}
                          >
                            <benefit.icon size={20} style={{ color: branding.primaryColor }} />
                          </div>
                          <div>
                            <h5 className="font-semibold text-gray-900 dark:text-white text-sm">
                              {benefit.title}
                            </h5>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              {benefit.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* What You Get */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-800/50 rounded-xl p-5 border border-gray-200 dark:border-slate-700">
                      <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Check size={18} style={{ color: branding.primaryColor }} />
                        What's included
                      </h5>
                      <ul className="space-y-2">
                        {[
                          'Floating voice widget that appears on your site',
                          'Full conversation capabilities with your AI agent',
                          'Automatic booking and appointment scheduling',
                          'Works on mobile and desktop browsers',
                          'No additional hosting or maintenance required',
                        ].map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Check size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Footer - Info Page */}
                  <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      Step 1 of 2
                    </p>
                    <button
                      onClick={() => setEmbedModalStep('code')}
                      style={{
                        backgroundColor: branding.primaryColor,
                        color: '#ffffff',
                        padding: '10px 20px',
                        borderRadius: '10px',
                        fontSize: '14px',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      Get Embed Code
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </>
              )}

              {/* Page 2: Code Page */}
              {embedModalStep === 'code' && (
                <>
                  {/* Platform Tabs */}
                  <div className="flex gap-2 p-4 border-b border-gray-200 dark:border-slate-700 overflow-x-auto bg-gray-50 dark:bg-slate-800/50">
                    {[
                      { id: 'html' as const, label: 'HTML', desc: 'Any website' },
                      { id: 'react' as const, label: 'React', desc: 'React apps' },
                      { id: 'nextjs' as const, label: 'Next.js', desc: 'App Router' },
                      { id: 'shopify' as const, label: 'Shopify', desc: 'Themes' },
                    ].map((platform) => (
                      <button
                        key={platform.id}
                        onClick={() => setSelectedPlatform(platform.id)}
                        className={cn(
                          'flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                          selectedPlatform === platform.id
                            ? 'text-white'
                            : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-600 border border-gray-200 dark:border-slate-600'
                        )}
                        style={selectedPlatform === platform.id ? { backgroundColor: branding.primaryColor } : {}}
                      >
                        {platform.label}
                      </button>
                    ))}
                  </div>

                  {/* Code Display */}
                  <div className="p-4 max-h-[400px] overflow-auto">
                    <div className="bg-gray-900 dark:bg-slate-950 rounded-xl p-4 border border-gray-800 dark:border-slate-800">
                      <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap overflow-x-auto">
                        <code>{getEmbedCode(selectedPlatform)}</code>
                      </pre>
                    </div>
                  </div>

                  {/* Footer - Code Page */}
                  <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setEmbedModalStep('info')}
                        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
                      >
                        <ArrowLeft size={16} />
                        Back
                      </button>
                      <span className="text-xs text-gray-400">|</span>
                      <span className="text-xs text-gray-500 dark:text-slate-400">
                        Agent ID: <span className="font-mono" style={{ color: branding.primaryColor }}>{agentId}</span>
                      </span>
                    </div>
                    <button
                      onClick={copyEmbedCode}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors text-white',
                        embedCopied ? 'bg-green-500' : ''
                      )}
                      style={!embedCopied ? { backgroundColor: branding.primaryColor } : {}}
                    >
                      <Copy size={16} />
                      {embedCopied ? 'Copied!' : 'Copy Code'}
                    </button>
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
