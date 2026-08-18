/**
 * Voice Agent Settings Page
 * Edit voice agent configuration including prompts, services, and FAQs
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bot,
  Save,
  Loader2,
  MessageSquare,
  Sparkles,
  FileText,
  HelpCircle,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Check,
  AlertCircle,
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { useUser } from '../stores/authStore';
import {
  useBusinessStore,
  useActiveBusiness,
  useActiveVoiceAgent,
  useBusinessLoading,
} from '../stores/businessStore';
import { useBusiness, useAPIKeys } from '../stores/configStore';
import type { IndustryType } from '../types';
import { updateAgent as updateElevenLabsAgent, getAgent as getElevenLabsAgent } from '../services/elevenlabs';
import { cn } from '../utils/cn';

export const VoiceAgentSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  useUser(); // Used for auth check
  const activeBusiness = useActiveBusiness();
  const activeVoiceAgent = useActiveVoiceAgent();
  useBusinessLoading(); // Used for loading state
  const { updateCurrentBusiness, updateCurrentVoiceAgent, getActiveBusinessConfig, loadVoiceAgent } = useBusinessStore();

  // Fallback to localStorage data
  const localBusiness = useBusiness();
  const localApiKeys = useAPIKeys();

  // Form state
  const [agentName, setAgentName] = useState('');
  const [personality, setPersonality] = useState('');
  const [firstMessage, setFirstMessage] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [services, setServices] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>(['agent', 'greeting']);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isFetchingFromElevenLabs, setIsFetchingFromElevenLabs] = useState(false);

  // Get API key and agent ID from either Supabase or localStorage
  const elevenLabsApiKey = activeVoiceAgent?.elevenlabs_api_key || localApiKeys?.elevenLabsApiKey;
  const elevenLabsAgentId = activeVoiceAgent?.elevenlabs_agent_id || localApiKeys?.elevenLabsAgentId;

  // Load voice agent data when business changes
  useEffect(() => {
    if (activeBusiness && !activeVoiceAgent) {
      loadVoiceAgent(activeBusiness.id);
    }
  }, [activeBusiness, activeVoiceAgent, loadVoiceAgent]);

  // Fetch agent data from ElevenLabs API
  useEffect(() => {
    const fetchFromElevenLabs = async () => {
      if (!elevenLabsApiKey || !elevenLabsAgentId || isDataLoaded || isFetchingFromElevenLabs) {
        return;
      }

      setIsFetchingFromElevenLabs(true);
      try {
        console.log('Fetching agent from ElevenLabs:', elevenLabsAgentId);
        const agentData = await getElevenLabsAgent(elevenLabsApiKey, elevenLabsAgentId);
        console.log('ElevenLabs agent data:', JSON.stringify(agentData, null, 2));

        // Extract data from ElevenLabs response
        const conversationConfig = agentData.conversation_config;
        const agentConfig = conversationConfig?.agent;
        const promptConfig = agentConfig?.prompt;

        // Extract agent name from the full name (format: "Business Name - Agent Name")
        const fullName = agentData.name || '';
        let extractedAgentName = fullName;
        if (fullName.includes(' - ')) {
          const parts = fullName.split(' - ');
          extractedAgentName = parts[parts.length - 1] || fullName;
        }

        // Get the system prompt
        const fetchedSystemPrompt = promptConfig?.prompt || '';

        // Get first message - this is at agent.first_message
        const fetchedFirstMessage = agentConfig?.first_message || '';

        // Try to extract personality from the system prompt
        let extractedPersonality = '';
        const personalityMatch = fetchedSystemPrompt.match(/Your personality is ([^.]+)\./);
        if (personalityMatch && personalityMatch[1]) {
          extractedPersonality = personalityMatch[1].trim();
        }

        console.log('Extracted from ElevenLabs:', {
          agentName: extractedAgentName,
          firstMessage: fetchedFirstMessage,
          promptLength: fetchedSystemPrompt.length,
          personality: extractedPersonality,
        });

        // Set form values from ElevenLabs data
        setAgentName(extractedAgentName);
        setFirstMessage(fetchedFirstMessage);
        setSystemPrompt(fetchedSystemPrompt);
        setPersonality(extractedPersonality);

        setIsDataLoaded(true);

        // Save to database for future use if we have an active voice agent
        if (activeVoiceAgent) {
          await updateCurrentVoiceAgent({
            name: extractedAgentName,
            first_message: fetchedFirstMessage,
            system_prompt: fetchedSystemPrompt,
            personality: extractedPersonality,
          });
        }
      } catch (err) {
        console.error('Failed to fetch from ElevenLabs:', err);
        // Fall back to local data
        loadFromLocalData();
      } finally {
        setIsFetchingFromElevenLabs(false);
      }
    };

    // Fallback function to load from local data
    const loadFromLocalData = () => {
      if (activeVoiceAgent && activeVoiceAgent.name) {
        setAgentName(activeVoiceAgent.name || '');
        setPersonality(activeVoiceAgent.personality || '');
        setFirstMessage(activeVoiceAgent.first_message || '');
        setSystemPrompt(activeVoiceAgent.system_prompt || '');
        setIsDataLoaded(true);
      } else if (localBusiness?.voiceAgent) {
        setAgentName(localBusiness.voiceAgent.name || '');
        setPersonality(localBusiness.voiceAgent.personality || '');
        setFirstMessage(localBusiness.voiceAgent.firstMessage || '');
        setSystemPrompt(localBusiness.voiceAgent.systemPrompt || '');
        setIsDataLoaded(true);
      }
    };

    // Try ElevenLabs first, then fall back to local data
    if (!isDataLoaded) {
      if (elevenLabsApiKey && elevenLabsAgentId) {
        fetchFromElevenLabs();
      } else {
        loadFromLocalData();
      }
    }
  }, [elevenLabsApiKey, elevenLabsAgentId, isDataLoaded, isFetchingFromElevenLabs, activeVoiceAgent, localBusiness, updateCurrentVoiceAgent]);

  // Load services and FAQs from business data
  useEffect(() => {
    if (activeBusiness) {
      setServices(activeBusiness.services || []);
      setFaqs(activeBusiness.faqs || []);
    } else if (localBusiness) {
      setServices(localBusiness.services || []);
      setFaqs(localBusiness.faqs || []);
    }
  }, [activeBusiness, localBusiness]);

  // Reset isDataLoaded when business changes
  useEffect(() => {
    setIsDataLoaded(false);
    setIsFetchingFromElevenLabs(false);
  }, [activeBusiness?.id]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const handleSave = async () => {
    // Need at least a business or local business to save
    if (!activeBusiness && !localBusiness) {
      setError('No business selected');
      return;
    }

    // Need API key and agent ID to update ElevenLabs
    if (!elevenLabsApiKey || !elevenLabsAgentId) {
      setError('ElevenLabs API key or Agent ID not found');
      return;
    }

    setIsSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      // Update business in database (services, faqs) if we have an active business in Supabase
      if (activeBusiness) {
        const { error: businessError } = await updateCurrentBusiness({
          services,
          faqs,
        });
        if (businessError) {
          console.warn('Failed to update business in DB:', businessError);
        }
      }

      // Update voice agent in database if we have one
      if (activeVoiceAgent) {
        const { error: agentError } = await updateCurrentVoiceAgent({
          name: agentName,
          personality,
          first_message: firstMessage,
          system_prompt: systemPrompt,
        });
        if (agentError) {
          console.warn('Failed to update voice agent in DB:', agentError);
        }
      }

      // Build config for ElevenLabs update
      const config = getActiveBusinessConfig() || {
        name: localBusiness?.name || activeBusiness?.name || '',
        tagline: localBusiness?.tagline || activeBusiness?.tagline || '',
        description: localBusiness?.description || activeBusiness?.description || '',
        industry: (localBusiness?.industry || activeBusiness?.industry || 'other') as IndustryType,
        phone: localBusiness?.phone || activeBusiness?.phone || '',
        email: localBusiness?.email || activeBusiness?.email || '',
        address: localBusiness?.address || {
          street: activeBusiness?.address_street || '',
          city: activeBusiness?.address_city || '',
          state: activeBusiness?.address_state || '',
          zip: activeBusiness?.address_zip || '',
          country: activeBusiness?.address_country || 'United States',
        },
        hours: localBusiness?.hours || {
          weekdays: activeBusiness?.hours_weekdays || '9:00 AM - 6:00 PM',
          saturday: activeBusiness?.hours_saturday || '10:00 AM - 4:00 PM',
          sunday: activeBusiness?.hours_sunday || 'Closed',
        },
        staff: localBusiness?.staff || {
          name: activeBusiness?.staff_name || '',
          title: activeBusiness?.staff_title || '',
        },
        services: services,
        faqs: faqs,
        branding: localBusiness?.branding || {
          primaryColor: activeBusiness?.branding_primary || '#3B82F6',
          secondaryColor: activeBusiness?.branding_secondary || '#8B5CF6',
          accentColor: activeBusiness?.branding_accent || '#10B981',
        },
        voiceAgent: {
          name: agentName,
          personality,
          systemPrompt,
          firstMessage,
        },
        terms: localBusiness?.terms || {
          customer: activeBusiness?.term_customer || 'customer',
          appointment: activeBusiness?.term_appointment || 'appointment',
          service: activeBusiness?.term_service || 'service',
        },
        testimonials: localBusiness?.testimonials || activeBusiness?.testimonials || [],
        knowledgeBase: localBusiness?.knowledgeBase || activeBusiness?.knowledge_base || [],
      };

      // IMPORTANT: Always override voiceAgent with current form values
      // This ensures the form values are used even if getActiveBusinessConfig() returns stale data
      config.voiceAgent = {
        name: agentName,
        personality,
        systemPrompt,
        firstMessage,
      };

      console.log('Config voiceAgent being sent:', {
        name: config.voiceAgent.name,
        personality: config.voiceAgent.personality,
        firstMessage: config.voiceAgent.firstMessage,
        systemPromptLength: config.voiceAgent.systemPrompt?.length,
      });

      // Update ElevenLabs agent
      console.log('Updating ElevenLabs agent:', elevenLabsAgentId);
      await updateElevenLabsAgent(elevenLabsApiKey, elevenLabsAgentId, config);
      console.log('ElevenLabs agent updated successfully');

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Save failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  // Service management
  const addService = () => {
    setServices([
      ...services,
      {
        id: `service-${Date.now()}`,
        name: '',
        description: '',
        duration: '60',
        price: '',
        category: '',
      },
    ]);
  };

  const updateService = (index: number, field: string, value: string) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setServices(updated);
  };

  const removeService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  // FAQ management
  const addFaq = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [field]: value };
    setFaqs(updated);
  };

  const removeFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  if (!activeBusiness) {
    return (
      <div className="min-h-screen bg-ink">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-amber mx-auto mb-4" />
            <p className="text-bone">No business selected</p>
            <button
              onClick={() => navigate('/businesses')}
              className="mt-4 px-4 py-2 bg-amber rounded-panel text-ink"
            >
              Select a Business
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="display text-[clamp(1.75rem,4vw,2.5rem)] mb-3">Voice Agent Settings</h1>
            <p className="text-bone-dim">
              Customize your AI assistant for {activeBusiness.name}
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-panel font-semibold transition-all',
              isSaving
                ? 'bg-steel-high text-bone-dim cursor-not-allowed'
                : saveSuccess
                ? 'bg-patina text-ink'
                : 'bg-amber text-ink hover:bg-amber-glow'
            )}
          >
            {isSaving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : saveSuccess ? (
              <>
                <Check size={18} />
                Saved!
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>
        </div>

        {/* Loading from ElevenLabs */}
        {isFetchingFromElevenLabs && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-amber-shadow border border-amber/40 rounded-panel text-amber flex items-center gap-3"
          >
            <Loader2 size={20} className="animate-spin" />
            Loading agent data from ElevenLabs...
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-clip/10 border border-clip-deep rounded-panel text-clip flex items-center gap-3"
          >
            <AlertCircle size={20} />
            {error}
          </motion.div>
        )}

        {/* Settings Sections */}
        <div className="space-y-4">
          {/* Agent Identity */}
          <div className="bg-steel border border-edge-soft rounded-panel overflow-hidden">
            <button
              onClick={() => toggleSection('agent')}
              className="w-full flex items-center justify-between p-5 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center border border-edge bg-steel-lift">
                  <Bot size={20} className="text-amber" />
                </div>
                <div>
                  <h3 className="text-bone font-semibold">Agent Identity</h3>
                  <p className="text-sm text-bone-dim">Name and personality</p>
                </div>
              </div>
              {expandedSections.includes('agent') ? (
                <ChevronUp size={20} className="text-bone-dim" />
              ) : (
                <ChevronDown size={20} className="text-bone-dim" />
              )}
            </button>
            {expandedSections.includes('agent') && (
              <div className="px-5 pb-5 space-y-4">
                <div>
                  <label className="block text-sm text-bone-dim mb-2">Agent Name</label>
                  <input
                    type="text"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="e.g., Sarah, Alex, or your business name"
                    className="w-full px-4 py-3 bg-ink border border-edge rounded-panel text-bone placeholder:text-bone-faint focus:outline-none focus:ring-2 focus:ring-amber/40"
                  />
                </div>
                <div>
                  <label className="block text-sm text-bone-dim mb-2">Personality</label>
                  <input
                    type="text"
                    value={personality}
                    onChange={(e) => setPersonality(e.target.value)}
                    placeholder="e.g., professional, friendly, energetic"
                    className="w-full px-4 py-3 bg-ink border border-edge rounded-panel text-bone placeholder:text-bone-faint focus:outline-none focus:ring-2 focus:ring-amber/40"
                  />
                </div>
              </div>
            )}
          </div>

          {/* First Message */}
          <div className="bg-steel border border-edge-soft rounded-panel overflow-hidden">
            <button
              onClick={() => toggleSection('greeting')}
              className="w-full flex items-center justify-between p-5 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center border border-edge bg-steel-lift">
                  <MessageSquare size={20} className="text-patina-glow" />
                </div>
                <div>
                  <h3 className="text-bone font-semibold">Greeting Message</h3>
                  <p className="text-sm text-bone-dim">First thing the agent says</p>
                </div>
              </div>
              {expandedSections.includes('greeting') ? (
                <ChevronUp size={20} className="text-bone-dim" />
              ) : (
                <ChevronDown size={20} className="text-bone-dim" />
              )}
            </button>
            {expandedSections.includes('greeting') && (
              <div className="px-5 pb-5">
                <textarea
                  value={firstMessage}
                  onChange={(e) => setFirstMessage(e.target.value)}
                  rows={3}
                  placeholder="Hi! Thanks for calling..."
                  className="w-full px-4 py-3 bg-ink border border-edge rounded-panel text-bone placeholder:text-bone-faint focus:outline-none focus:ring-2 focus:ring-amber/40 resize-none"
                />
              </div>
            )}
          </div>

          {/* System Prompt */}
          <div className="bg-steel border border-edge-soft rounded-panel overflow-hidden">
            <button
              onClick={() => toggleSection('prompt')}
              className="w-full flex items-center justify-between p-5 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center border border-edge bg-steel-lift">
                  <Sparkles size={20} className="text-patina-glow" />
                </div>
                <div>
                  <h3 className="text-bone font-semibold">System Prompt</h3>
                  <p className="text-sm text-bone-dim">Agent behavior instructions</p>
                </div>
              </div>
              {expandedSections.includes('prompt') ? (
                <ChevronUp size={20} className="text-bone-dim" />
              ) : (
                <ChevronDown size={20} className="text-bone-dim" />
              )}
            </button>
            {expandedSections.includes('prompt') && (
              <div className="px-5 pb-5">
                <textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  rows={10}
                  placeholder="You are a helpful AI assistant..."
                  className="w-full px-4 py-3 bg-ink border border-edge rounded-panel text-bone placeholder:text-bone-faint focus:outline-none focus:ring-2 focus:ring-amber/40 resize-none font-mono text-sm"
                />
                <p className="text-xs text-bone-faint mt-2">
                  This prompt defines how your voice agent behaves and responds
                </p>
              </div>
            )}
          </div>

          {/* Services */}
          <div className="bg-steel border border-edge-soft rounded-panel overflow-hidden">
            <button
              onClick={() => toggleSection('services')}
              className="w-full flex items-center justify-between p-5 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center border border-edge bg-steel-lift">
                  <FileText size={20} className="text-amber" />
                </div>
                <div>
                  <h3 className="text-bone font-semibold">Services</h3>
                  <p className="text-sm text-bone-dim">{services.length} services</p>
                </div>
              </div>
              {expandedSections.includes('services') ? (
                <ChevronUp size={20} className="text-bone-dim" />
              ) : (
                <ChevronDown size={20} className="text-bone-dim" />
              )}
            </button>
            {expandedSections.includes('services') && (
              <div className="px-5 pb-5 space-y-3">
                {services.map((service, index) => (
                  <div
                    key={service.id || index}
                    className="p-4 bg-ink/50 rounded-panel border border-edge-soft"
                  >
                    <div className="flex gap-3 mb-3">
                      <input
                        type="text"
                        value={service.name}
                        onChange={(e) => updateService(index, 'name', e.target.value)}
                        placeholder="Service name"
                        className="flex-1 px-3 py-2 bg-steel border border-edge rounded-panel text-bone text-sm"
                      />
                      <input
                        type="text"
                        value={service.price}
                        onChange={(e) => updateService(index, 'price', e.target.value)}
                        placeholder="Price"
                        className="w-24 px-3 py-2 bg-steel border border-edge rounded-panel text-bone text-sm"
                      />
                      <button
                        onClick={() => removeService(index)}
                        className="p-2 text-bone-dim hover:text-clip hover:bg-clip/10 rounded-panel transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <textarea
                      value={service.description}
                      onChange={(e) => updateService(index, 'description', e.target.value)}
                      placeholder="Service description"
                      rows={2}
                      className="w-full px-3 py-2 bg-steel border border-edge rounded-panel text-bone text-sm resize-none"
                    />
                  </div>
                ))}
                <button
                  onClick={addService}
                  className="w-full py-3 border border-dashed border-edge rounded-panel text-bone-dim hover:text-bone hover:border-edge-bright transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Add Service
                </button>
              </div>
            )}
          </div>

          {/* FAQs */}
          <div className="bg-steel border border-edge-soft rounded-panel overflow-hidden">
            <button
              onClick={() => toggleSection('faqs')}
              className="w-full flex items-center justify-between p-5 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center border border-edge bg-steel-lift">
                  <HelpCircle size={20} className="text-patina-glow" />
                </div>
                <div>
                  <h3 className="text-bone font-semibold">FAQs</h3>
                  <p className="text-sm text-bone-dim">{faqs.length} questions</p>
                </div>
              </div>
              {expandedSections.includes('faqs') ? (
                <ChevronUp size={20} className="text-bone-dim" />
              ) : (
                <ChevronDown size={20} className="text-bone-dim" />
              )}
            </button>
            {expandedSections.includes('faqs') && (
              <div className="px-5 pb-5 space-y-3">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="p-4 bg-ink/50 rounded-panel border border-edge-soft"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => updateFaq(index, 'question', e.target.value)}
                        placeholder="Question"
                        className="flex-1 px-3 py-2 bg-steel border border-edge rounded-panel text-bone text-sm"
                      />
                      <button
                        onClick={() => removeFaq(index)}
                        className="p-2 text-bone-dim hover:text-clip hover:bg-clip/10 rounded-panel transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <textarea
                      value={faq.answer}
                      onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                      placeholder="Answer"
                      rows={2}
                      className="w-full px-3 py-2 bg-steel border border-edge rounded-panel text-bone text-sm resize-none"
                    />
                  </div>
                ))}
                <button
                  onClick={addFaq}
                  className="w-full py-3 border border-dashed border-edge rounded-panel text-bone-dim hover:text-bone hover:border-edge-bright transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Add FAQ
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAgentSettingsPage;
