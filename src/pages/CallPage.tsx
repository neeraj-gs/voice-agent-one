/**
 * Call Page
 * Dedicated voice agent calling interface
 */

import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  ArrowLeft,
  MessageSquare,
  Clock,
  Volume2,
  Loader2,
  Info,
} from 'lucide-react';
import { Button, Card, CardContent } from '../components/ui';
import { useBusiness, useBranding, useAPIKeys } from '../stores/configStore';
import { cn } from '../utils/cn';

// ElevenLabs types (simplified for demo - in production use @elevenlabs/react)
type ConversationStatus = 'idle' | 'connecting' | 'connected' | 'disconnecting';

export const CallPage: React.FC = () => {
  const business = useBusiness();
  const branding = useBranding();
  const apiKeys = useAPIKeys();

  const [status, setStatus] = useState<ConversationStatus>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Timer for call duration
  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (status === 'connected') {
      interval = setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status]);

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

    setStatus('connecting');
    setError(null);
    setDuration(0);

    try {
      // In production, use the ElevenLabs React SDK
      // This is a simplified demo implementation

      // Simulate connection delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // For demo purposes, we'll show the connected state
      // In production, this would use the actual ElevenLabs widget/SDK
      setStatus('connected');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect');
      setStatus('idle');
    }
  }, [apiKeys]);

  const endConversation = useCallback(() => {
    setStatus('disconnecting');
    // Simulate disconnect
    setTimeout(() => {
      setStatus('idle');
    }, 500);
  }, []);

  const toggleMute = () => {
    setIsMuted((m) => !m);
  };

  if (!business || !branding) {
    return null;
  }

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
            <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              <ArrowLeft size={20} />
              <span>Back to {business.name}</span>
            </Link>
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
            </Link>
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
                status === 'connected' ? 'animate-pulse' : ''
              )}
              style={{
                backgroundColor:
                  status === 'connected'
                    ? branding.accentColor || '#22c55e'
                    : status === 'connecting'
                    ? branding.primaryColor
                    : `${branding.primaryColor}20`,
              }}
            >
              {status === 'connecting' ? (
                <Loader2 size={40} className="text-white animate-spin" />
              ) : status === 'connected' ? (
                <Volume2 size={40} className="text-white" />
              ) : (
                <MessageSquare size={40} style={{ color: branding.primaryColor }} />
              )}
            </div>
          </motion.div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {status === 'connected'
              ? `Speaking with ${business.voiceAgent.name}`
              : status === 'connecting'
              ? 'Connecting...'
              : `Talk to ${business.voiceAgent.name}`}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {status === 'connected'
              ? business.voiceAgent.personality
              : `Your ${business.voiceAgent.personality} AI assistant for ${business.name}`}
          </p>

          {/* Duration */}
          {status === 'connected' && (
            <div className="flex items-center justify-center gap-2 mt-4 text-gray-500">
              <Clock size={16} />
              <span>{formatDuration(duration)}</span>
            </div>
          )}
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-center"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Call Controls */}
        <div className="flex justify-center gap-4 mb-12">
          {status === 'idle' || status === 'disconnecting' ? (
            <Button
              size="lg"
              onClick={startConversation}
              disabled={status === 'disconnecting'}
              className="px-8"
            >
              <Phone size={20} className="mr-2" />
              Start Conversation
            </Button>
          ) : (
            <>
              <Button
                variant={isMuted ? 'secondary' : 'outline'}
                size="lg"
                onClick={toggleMute}
                className="w-14 h-14 rounded-full p-0"
              >
                {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
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
                    {business.name}
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

        {/* ElevenLabs Widget Note */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
          <p className="text-sm text-blue-600 dark:text-blue-400">
            <strong>Note:</strong> In production, this page integrates with ElevenLabs
            Conversational AI using Agent ID: <code className="px-2 py-1 bg-blue-100 dark:bg-blue-800 rounded">{apiKeys?.elevenLabsAgentId || 'Not configured'}</code>
          </p>
        </div>
      </main>
    </div>
  );
};
