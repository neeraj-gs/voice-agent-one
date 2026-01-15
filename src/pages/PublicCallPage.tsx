/**
 * Public Call Page
 * Voice agent calling interface accessible via public URL
 * No authentication required
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useConversation } from '@elevenlabs/react';
import {
  Phone,
  PhoneOff,
  Mic,
  ArrowLeft,
  MessageSquare,
  Clock,
  Volume2,
  Loader2,
  Info,
  AlertCircle,
} from 'lucide-react';
import { Button, Card, CardContent } from '../components/ui';
import { getPublicBusinessData, businessToConfig } from '../services/database';
import type { Business, VoiceAgent } from '../lib/supabase';
import type { BusinessConfig } from '../types';
import { cn } from '../utils/cn';

export const PublicCallPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  // Data state
  const [business, setBusiness] = useState<Business | null>(null);
  const [voiceAgent, setVoiceAgent] = useState<VoiceAgent | null>(null);
  const [config, setConfig] = useState<BusinessConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  // Call state
  const [duration, setDuration] = useState(0);
  const [callError, setCallError] = useState<string | null>(null);

  // Load business data
  useEffect(() => {
    const loadBusinessData = async () => {
      if (!slug) {
        setPageError('Invalid URL');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      console.log('Loading public business data for slug:', slug);

      const { data, error: fetchError } = await getPublicBusinessData(slug);

      console.log('Public business data result:', {
        hasData: !!data,
        hasBusiness: !!data?.business,
        hasVoiceAgent: !!data?.voiceAgent,
        voiceAgentId: data?.voiceAgent?.elevenlabs_agent_id,
        error: fetchError,
      });

      if (fetchError || !data) {
        setPageError(fetchError || 'Business not found');
        setIsLoading(false);
        return;
      }

      setBusiness(data.business);
      setVoiceAgent(data.voiceAgent);

      // Convert to config format
      const businessConfig = businessToConfig(data.business);
      if (data.voiceAgent) {
        businessConfig.voiceAgent = {
          name: data.voiceAgent.name,
          personality: data.voiceAgent.personality || '',
          systemPrompt: data.voiceAgent.system_prompt || '',
          firstMessage: data.voiceAgent.first_message || '',
        };
      }
      setConfig(businessConfig);
      setIsLoading(false);
    };

    loadBusinessData();
  }, [slug]);

  // ElevenLabs Conversation Hook
  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to ElevenLabs');
      setCallError(null);
    },
    onDisconnect: () => {
      console.log('Disconnected from ElevenLabs');
    },
    onError: (err) => {
      console.error('ElevenLabs error:', err);
      setCallError(err.message || 'Connection error occurred');
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
    if (!voiceAgent) {
      setCallError('Voice agent data not available. The database may need to be configured for public access.');
      console.error('Voice agent is null - RLS policy may be blocking access');
      return;
    }

    if (!voiceAgent.elevenlabs_agent_id) {
      setCallError('Voice agent not properly configured. Please contact the business owner.');
      console.error('Voice agent exists but elevenlabs_agent_id is missing:', voiceAgent);
      return;
    }

    setCallError(null);

    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Start the conversation with the agent using WebRTC for audio
      await conversation.startSession({
        agentId: voiceAgent.elevenlabs_agent_id,
        connectionType: 'webrtc',
      });
    } catch (err) {
      console.error('Failed to start conversation:', err);
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setCallError('Microphone access denied. Please allow microphone access and try again.');
        } else {
          setCallError(err.message || 'Failed to start conversation');
        }
      } else {
        setCallError('Failed to start conversation');
      }
    }
  }, [voiceAgent, conversation]);

  const endConversation = useCallback(async () => {
    try {
      await conversation.endSession();
    } catch (err) {
      console.error('Failed to end conversation:', err);
    }
  }, [conversation]);

  const toggleMute = useCallback(() => {
    if (conversation.isSpeaking) {
      return;
    }
  }, [conversation.isSpeaking]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (pageError || !config || !business) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Business Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {pageError || 'The business you are looking for does not exist.'}
          </p>
          <Link to="/">
            <Button>Go to Homepage</Button>
          </Link>
        </div>
      </div>
    );
  }

  const branding = config.branding;
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
            <Link
              to={`/p/${slug}`}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <ArrowLeft size={20} />
              <span>Back to {config.name}</span>
            </Link>
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: branding.primaryColor }}
              >
                {config.name.charAt(0)}
              </div>
              <span className="font-medium text-gray-900 dark:text-white text-sm hidden sm:block">
                {config.name}
              </span>
            </div>
          </div>
        </div>
      </header>

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
              ? `Speaking with ${config.voiceAgent.name || 'AI Assistant'}`
              : isConnecting
              ? 'Connecting...'
              : `Talk to ${config.voiceAgent.name || 'AI Assistant'}`}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isConnected
              ? config.voiceAgent.personality
              : `Your ${config.voiceAgent.personality || 'AI'} assistant for ${config.name}`}
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
              <span className="text-sm font-medium">{config.voiceAgent.name || 'AI'} is speaking...</span>
            </motion.div>
          )}
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {callError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 flex items-center gap-3"
            >
              <AlertCircle size={20} />
              <span>{callError}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Call Controls */}
        <div className="flex justify-center gap-4 mb-12">
          {isIdle ? (
            <Button
              size="lg"
              onClick={startConversation}
              className="px-8"
              style={{ backgroundColor: branding.primaryColor }}
            >
              <Phone size={20} className="mr-2" />
              Start Conversation
            </Button>
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
                  What {config.voiceAgent.name || 'AI'} Can Help With
                </h3>
              </div>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: `${branding.accentColor || branding.primaryColor}20` }}
                  >
                    <span className="text-xs" style={{ color: branding.accentColor || branding.primaryColor }}>
                      ✓
                    </span>
                  </div>
                  <span>Schedule {config.terms.appointment}s with {config.staff.name}</span>
                </li>
                <li className="flex items-start gap-2">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: `${branding.accentColor || branding.primaryColor}20` }}
                  >
                    <span className="text-xs" style={{ color: branding.accentColor || branding.primaryColor }}>
                      ✓
                    </span>
                  </div>
                  <span>Answer questions about our {config.terms.service}s</span>
                </li>
                <li className="flex items-start gap-2">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: `${branding.accentColor || branding.primaryColor}20` }}
                  >
                    <span className="text-xs" style={{ color: branding.accentColor || branding.primaryColor }}>
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
                    <span className="text-xs" style={{ color: branding.accentColor || branding.primaryColor }}>
                      ✓
                    </span>
                  </div>
                  <span>Reschedule or cancel existing {config.terms.appointment}s</span>
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
                  {config.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {config.staff.name}
                  </h3>
                  <p className="text-sm text-gray-500">{config.staff.title}</p>
                </div>
              </div>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  <span>{config.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>Mon-Fri: {config.hours.weekdays}</span>
                </div>
                <p className="pt-2 border-t border-gray-200 dark:border-slate-700">
                  {config.address.city}, {config.address.state}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PublicCallPage;
