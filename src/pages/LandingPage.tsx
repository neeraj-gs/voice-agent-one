/**
 * Landing Page
 * Dynamic business website powered by stored configuration
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  ChevronRight,
  MessageSquare,
  Calendar,
  Check,
  ArrowRight,
  ArrowLeft,
  LayoutDashboard,
  Settings,
  Building2,
  BarChart3,
  Share2,
  Copy,
  ExternalLink,
  Code,
  X,
  Globe,
  Zap,
  Shield,
} from 'lucide-react';
import { Button, Card, CardContent } from '../components/ui';
import { useBusiness, useBranding } from '../stores/configStore';
import { useIsAuthenticated } from '../stores/authStore';
import { useActiveBusiness, useBusinessStore } from '../stores/businessStore';

export const LandingPage: React.FC = () => {
  const business = useBusiness();
  const branding = useBranding();
  const isAuthenticated = useIsAuthenticated();
  const activeBusiness = useActiveBusiness();
  const { activeVoiceAgent } = useBusinessStore();

  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [embedModalStep, setEmbedModalStep] = useState<'info' | 'code'>('info');
  const [copied, setCopied] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<'html' | 'react' | 'nextjs' | 'shopify'>('html');
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

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Admin Bar - Only visible to logged-in users */}
      {isAuthenticated && (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-slate-900 border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-10">
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <span>Admin:</span>
                <span className="text-white font-medium">{business.name}</span>
              </div>
              <div className="flex items-center gap-1">
                {/* Share Button */}
                {publicUrl && (
                  <div className="relative" ref={shareMenuRef}>
                    <button
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-green-400 hover:text-green-300 hover:bg-slate-800 rounded-md transition-colors"
                    >
                      <Share2 size={14} />
                      <span className="hidden sm:inline">Share</span>
                    </button>

                    {/* Share Dropdown */}
                    <AnimatePresence>
                      {showShareMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 top-full mt-2 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50"
                        >
                          <div className="p-3 border-b border-slate-700">
                            <p className="text-xs text-slate-400 mb-2">Public URL</p>
                            <div className="flex items-center gap-2 p-2 bg-slate-900 rounded-lg">
                              <input
                                type="text"
                                readOnly
                                value={publicUrl}
                                className="flex-1 bg-transparent text-xs text-white outline-none"
                              />
                            </div>
                          </div>
                          <div className="p-2 flex gap-2">
                            <button
                              onClick={copyToClipboard}
                              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-xs font-medium transition-colors"
                            >
                              <Copy size={14} />
                              {copied ? 'Copied!' : 'Copy Link'}
                            </button>
                            <button
                              onClick={openPublicPage}
                              className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-xs font-medium transition-colors"
                            >
                              <ExternalLink size={14} />
                              Open
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
                {/* Embed Button */}
                <button
                  onClick={() => setShowEmbedModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-purple-400 hover:text-purple-300 hover:bg-slate-800 rounded-md transition-colors"
                >
                  <Code size={14} />
                  <span className="hidden sm:inline">Embed</span>
                </button>
                <Link
                  to="/businesses"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                >
                  <Building2 size={14} />
                  <span className="hidden sm:inline">My Businesses</span>
                </Link>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                >
                  <BarChart3 size={14} />
                  <span className="hidden sm:inline">Analytics</span>
                </Link>
                <Link
                  to="/settings/agent"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                >
                  <Settings size={14} />
                  <span className="hidden sm:inline">Settings</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Embed Modal - Two Page Design */}
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
                        className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedPlatform === platform.id
                            ? 'text-white'
                            : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-600 border border-gray-200 dark:border-slate-600'
                        }`}
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
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors text-white ${
                        embedCopied ? 'bg-green-500' : ''
                      }`}
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

      {/* Navigation */}
      <nav className={`fixed left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-slate-700 ${isAuthenticated ? 'top-10' : 'top-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: branding.primaryColor }}
              >
                {business.name.charAt(0)}
              </div>
              <span className="font-bold text-gray-900 dark:text-white">
                {business.name}
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Services
              </a>
              <a href="#about" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                About
              </a>
              <a href="#testimonials" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Reviews
              </a>
              <a href="#faq" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                FAQ
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/call">
                <Button size="sm">
                  <Phone size={16} className="mr-2" />
                  Talk to AI
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={`pb-20 px-4 ${isAuthenticated ? 'pt-40' : 'pt-32'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
                style={{
                  backgroundColor: `${branding.primaryColor}15`,
                  color: branding.primaryColor,
                }}
              >
                <MessageSquare size={16} />
                24/7 AI Assistant Available
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                {business.tagline}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                {business.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/call">
                  <Button size="lg" className="w-full sm:w-auto">
                    <Phone size={20} className="mr-2" />
                    Talk to Our AI Assistant
                  </Button>
                </Link>
                <a href="#services">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    View Services
                    <ChevronRight size={20} className="ml-2" />
                  </Button>
                </a>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-200 dark:border-slate-700">
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">24/7</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Always Available</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">5.0</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Star Rating</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">500+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Happy {business.terms.customer}s</div>
                </div>
              </div>
            </motion.div>

            {/* Hero Image/Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div
                className="rounded-3xl p-8 text-white"
                style={{
                  background: `linear-gradient(135deg, ${branding.primaryColor} 0%, ${branding.secondaryColor} 100%)`,
                }}
              >
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone size={40} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Speak with {business.voiceAgent.name}</h3>
                  <p className="text-white/80">
                    Our AI assistant is ready to help you schedule your {business.terms.appointment}
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5" />
                    <span>Book {business.terms.appointment}s instantly</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5" />
                    <span>Get answers to your questions</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5" />
                    <span>Available 24/7, no wait time</span>
                  </div>
                </div>

                <Link to="/call">
                  <button className="w-full py-4 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                    <Phone size={20} />
                    Start Conversation
                    <ArrowRight size={20} />
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 bg-gray-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Services
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Professional {business.terms.service}s tailored to your needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {business.services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="h-full">
                  <CardContent className="p-6">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${branding.primaryColor}15` }}
                    >
                      <Calendar size={24} style={{ color: branding.primaryColor }} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {service.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700">
                      <span className="text-sm text-gray-500">{service.duration} min</span>
                      <span className="font-semibold" style={{ color: branding.primaryColor }}>
                        {service.price === 0 ? 'Free' : `$${service.price}`}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                About {business.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {business.description}
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${branding.primaryColor}15` }}
                  >
                    <MapPin size={20} style={{ color: branding.primaryColor }} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Location</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {business.address.street && `${business.address.street}, `}
                      {business.address.city}, {business.address.state} {business.address.zip}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${branding.primaryColor}15` }}
                  >
                    <Clock size={20} style={{ color: branding.primaryColor }} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Hours</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Mon-Fri: {business.hours.weekdays}<br />
                      Sat: {business.hours.saturday}<br />
                      Sun: {business.hours.sunday}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${branding.primaryColor}15` }}
                  >
                    <Mail size={20} style={{ color: branding.primaryColor }} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Contact</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {business.phone}<br />
                      {business.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Staff Card */}
            <Card className="overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                    style={{ backgroundColor: branding.primaryColor }}
                  >
                    {business.staff.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {business.staff.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">{business.staff.title}</p>
                  </div>
                </div>
                {business.staff.bio && (
                  <p className="text-gray-600 dark:text-gray-400">{business.staff.bio}</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {business.testimonials.length > 0 && (
        <section id="testimonials" className="py-20 px-4 bg-gray-50 dark:bg-slate-800/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                What Our {business.terms.customer.charAt(0).toUpperCase() + business.terms.customer.slice(1)}s Say
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {business.testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="flex gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            size={20}
                            className="fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        "{testimonial.content}"
                      </p>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                          style={{ backgroundColor: branding.primaryColor }}
                        >
                          {testimonial.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {testimonial.name}
                          </p>
                          <p className="text-sm text-gray-500">{testimonial.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {business.faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-3xl p-12 text-center text-white"
            style={{
              background: `linear-gradient(135deg, ${branding.primaryColor} 0%, ${branding.secondaryColor} 100%)`,
            }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              Speak with our AI assistant now to schedule your {business.terms.appointment}
              or get answers to your questions.
            </p>
            <Link to="/call">
              <button className="px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2">
                <Phone size={20} />
                Talk to {business.voiceAgent.name}
                <ArrowRight size={20} />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: branding.primaryColor }}
              >
                {business.name.charAt(0)}
              </div>
              <span className="font-bold text-gray-900 dark:text-white">
                {business.name}
              </span>
            </div>
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} {business.name}. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm"
              >
                Dashboard
              </Link>
              <Link
                to="/setup"
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm"
              >
                Settings
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
