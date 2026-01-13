/**
 * Onboarding Wizard
 * Multi-step setup with AI content generation
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Stethoscope,
  Scissors,
  Dumbbell,
  Home,
  UtensilsCrossed,
  Scale,
  Calculator,
  Car,
  PawPrint,
  Camera,
  Briefcase,
  Sparkles,
  Check,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Key,
  Store,
  User,
  MapPin,
  Clock,
  Zap,
} from 'lucide-react';
import { Button, Input, Card, CardContent } from '../ui';
import { ConfigEditor } from './ConfigEditor';
import { useConfigStore } from '../../stores/configStore';
import { generateBusinessContent, validateOpenAIKey } from '../../services/openai';
import type { IndustryType, BusinessInfo, APIKeys, BusinessConfig } from '../../types';
import { cn } from '../../utils/cn';

// Industry options with icons
const INDUSTRIES: { value: IndustryType; label: string; icon: React.ReactNode; description: string }[] = [
  { value: 'healthcare', label: 'Healthcare', icon: <Stethoscope size={24} />, description: 'Medical clinics, practices' },
  { value: 'dental', label: 'Dental', icon: <Sparkles size={24} />, description: 'Dentists, orthodontists' },
  { value: 'salon', label: 'Salon', icon: <Scissors size={24} />, description: 'Hair salons, beauty' },
  { value: 'spa', label: 'Spa', icon: <Sparkles size={24} />, description: 'Spas, wellness centers' },
  { value: 'fitness', label: 'Fitness', icon: <Dumbbell size={24} />, description: 'Gyms, personal training' },
  { value: 'realestate', label: 'Real Estate', icon: <Home size={24} />, description: 'Agents, brokerages' },
  { value: 'restaurant', label: 'Restaurant', icon: <UtensilsCrossed size={24} />, description: 'Restaurants, cafes' },
  { value: 'legal', label: 'Legal', icon: <Scale size={24} />, description: 'Law firms, attorneys' },
  { value: 'accounting', label: 'Accounting', icon: <Calculator size={24} />, description: 'CPAs, bookkeeping' },
  { value: 'automotive', label: 'Automotive', icon: <Car size={24} />, description: 'Auto repair, dealers' },
  { value: 'veterinary', label: 'Veterinary', icon: <PawPrint size={24} />, description: 'Vet clinics, animal care' },
  { value: 'photography', label: 'Photography', icon: <Camera size={24} />, description: 'Studios, photographers' },
  { value: 'consulting', label: 'Consulting', icon: <Briefcase size={24} />, description: 'Business consulting' },
  { value: 'other', label: 'Other', icon: <Building2 size={24} />, description: 'Any service business' },
];

const STEPS = [
  { id: 1, title: 'Industry', icon: Store },
  { id: 2, title: 'Business Info', icon: Building2 },
  { id: 3, title: 'API Keys', icon: Key },
  { id: 4, title: 'Review & Edit', icon: Zap },
];

export const OnboardingWizard: React.FC = () => {
  const navigate = useNavigate();
  const { setBusinessConfig, setAPIKeys, completeSetup } = useConfigStore();

  const [step, setStep] = useState(1);
  const [industry, setIndustry] = useState<IndustryType | null>(null);
  const [businessInfo, setBusinessInfo] = useState<Partial<BusinessInfo>>({
    country: 'United States',
    weekdayHours: '9:00 AM - 6:00 PM',
    saturdayHours: '10:00 AM - 4:00 PM',
    sundayHours: 'Closed',
  });
  const [apiKeys, setApiKeysState] = useState<Partial<APIKeys>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedConfig, setGeneratedConfig] = useState<BusinessConfig | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Validation
  const isStep1Valid = industry !== null;
  const isStep2Valid =
    businessInfo.name &&
    businessInfo.phone &&
    businessInfo.email &&
    businessInfo.city &&
    businessInfo.state &&
    businessInfo.staffName &&
    businessInfo.staffTitle;
  // Step 3 valid if: OpenAI key AND (existing agent ID OR ElevenLabs API key for auto-create)
  const isStep3Valid = apiKeys.openaiKey && (apiKeys.elevenLabsAgentId || apiKeys.elevenLabsApiKey);

  const handleBusinessInfoChange = (field: keyof BusinessInfo, value: string) => {
    setBusinessInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleAPIKeyChange = (field: keyof APIKeys, value: string) => {
    setApiKeysState((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    if (!industry || !businessInfo.name || !apiKeys.openaiKey) return;

    setIsGenerating(true);
    setError(null);

    try {
      // Validate OpenAI key first
      const isValidKey = await validateOpenAIKey(apiKeys.openaiKey);
      if (!isValidKey) {
        throw new Error('Invalid OpenAI API key. Please check and try again.');
      }

      // Generate content
      const generated = await generateBusinessContent(apiKeys.openaiKey, {
        industry,
        businessName: businessInfo.name,
        location: `${businessInfo.city}, ${businessInfo.state}`,
        staffName: businessInfo.staffName || 'Owner',
        staffTitle: businessInfo.staffTitle || 'Owner',
      });

      // Combine into full config
      const fullConfig: BusinessConfig = {
        name: businessInfo.name,
        tagline: generated.tagline,
        description: generated.description,
        industry,
        phone: businessInfo.phone || '',
        email: businessInfo.email || '',
        website: businessInfo.website,
        address: {
          street: businessInfo.street || '',
          city: businessInfo.city || '',
          state: businessInfo.state || '',
          zip: businessInfo.zip || '',
          country: businessInfo.country || 'United States',
        },
        hours: {
          weekdays: businessInfo.weekdayHours || '9:00 AM - 6:00 PM',
          saturday: businessInfo.saturdayHours || '10:00 AM - 4:00 PM',
          sunday: businessInfo.sundayHours || 'Closed',
        },
        staff: {
          name: businessInfo.staffName || '',
          title: businessInfo.staffTitle || '',
        },
        services: generated.services,
        faqs: generated.faqs,
        branding: generated.branding,
        voiceAgent: generated.voiceAgent,
        testimonials: generated.testimonials,
        terms: generated.terms,
        knowledgeBase: [], // Start empty, user can add custom entries
      };

      setGeneratedConfig(fullConfig);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
  };

  const [isCreatingAgent, setIsCreatingAgent] = useState(false);
  const [agentCreationError, setAgentCreationError] = useState<string | null>(null);

  const handleComplete = async () => {
    if (!generatedConfig || !apiKeys.openaiKey) return;

    // Check if we need to create an agent
    const needsAgentCreation = apiKeys.elevenLabsApiKey && !apiKeys.elevenLabsAgentId;

    if (needsAgentCreation) {
      setIsCreatingAgent(true);
      setAgentCreationError(null);

      try {
        // Dynamically import to avoid bundling issues
        const { createAgent, addKnowledgeBase } = await import('../../services/elevenlabs');

        // Create the agent
        const agentResponse = await createAgent({
          apiKey: apiKeys.elevenLabsApiKey!,
          config: generatedConfig,
          webhookUrl: apiKeys.webhookBaseUrl,
        });

        // Try to add knowledge base (non-critical if it fails)
        try {
          await addKnowledgeBase(apiKeys.elevenLabsApiKey!, agentResponse.agent_id, generatedConfig);
        } catch (kbError) {
          console.warn('Failed to add knowledge base:', kbError);
        }

        // Save with the new agent ID
        setBusinessConfig(generatedConfig);
        setAPIKeys({
          openaiKey: apiKeys.openaiKey,
          elevenLabsAgentId: agentResponse.agent_id,
          elevenLabsApiKey: apiKeys.elevenLabsApiKey,
          supabaseUrl: apiKeys.supabaseUrl,
          supabaseAnonKey: apiKeys.supabaseAnonKey,
          calcomLink: apiKeys.calcomLink,
          webhookBaseUrl: apiKeys.webhookBaseUrl,
        });
        completeSetup();
        navigate('/site');
      } catch (err) {
        console.error('Failed to create agent:', err);
        setAgentCreationError(
          err instanceof Error ? err.message : 'Failed to create voice agent. Please try again.'
        );
        setIsCreatingAgent(false);
        return;
      }
    } else {
      // Using existing agent ID
      if (!apiKeys.elevenLabsAgentId) return;

      setBusinessConfig(generatedConfig);
      setAPIKeys({
        openaiKey: apiKeys.openaiKey,
        elevenLabsAgentId: apiKeys.elevenLabsAgentId,
        supabaseUrl: apiKeys.supabaseUrl,
        supabaseAnonKey: apiKeys.supabaseAnonKey,
        calcomLink: apiKeys.calcomLink,
      });
      completeSetup();
      navigate('/site');
    }
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Voice Agent Setup</h1>
              <p className="text-sm text-slate-400">Configure your AI assistant in minutes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((s, index) => (
            <React.Fragment key={s.id}>
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center transition-all',
                    step > s.id
                      ? 'bg-green-500 text-white'
                      : step === s.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-700 text-slate-400'
                  )}
                >
                  {step > s.id ? <Check size={20} /> : <s.icon size={20} />}
                </div>
                <span
                  className={cn(
                    'mt-2 text-xs font-medium',
                    step >= s.id ? 'text-white' : 'text-slate-500'
                  )}
                >
                  {s.title}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-2',
                    step > s.id ? 'bg-green-500' : 'bg-slate-700'
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Step 1: Industry Selection */}
            {step === 1 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    What type of business do you have?
                  </h2>
                  <p className="text-slate-400">
                    Select your industry to customize your AI assistant
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {INDUSTRIES.map((ind) => (
                    <Card
                      key={ind.value}
                      hover
                      onClick={() => setIndustry(ind.value)}
                      className={cn(
                        'transition-all cursor-pointer',
                        industry === ind.value
                          ? 'ring-2 ring-blue-500 bg-blue-500/10 border-blue-500'
                          : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                      )}
                    >
                      <CardContent className="p-4 text-center">
                        <div
                          className={cn(
                            'w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center',
                            industry === ind.value
                              ? 'bg-blue-500 text-white'
                              : 'bg-slate-700 text-slate-300'
                          )}
                        >
                          {ind.icon}
                        </div>
                        <h3 className="font-semibold text-white text-sm">{ind.label}</h3>
                        <p className="text-xs text-slate-400 mt-1">{ind.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Business Info */}
            {step === 2 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Tell us about your business
                  </h2>
                  <p className="text-slate-400">
                    This information will be used to personalize your AI assistant
                  </p>
                </div>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6 space-y-6">
                    {/* Business Details */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Building2 size={18} className="text-blue-400" />
                        <h3 className="font-semibold text-white">Business Details</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Business Name *"
                          placeholder="Premier Realty Group"
                          value={businessInfo.name || ''}
                          onChange={(e) => handleBusinessInfoChange('name', e.target.value)}
                          className="bg-slate-900 border-slate-600 text-white"
                        />
                        <Input
                          label="Website"
                          placeholder="https://example.com"
                          value={businessInfo.website || ''}
                          onChange={(e) => handleBusinessInfoChange('website', e.target.value)}
                          className="bg-slate-900 border-slate-600 text-white"
                        />
                        <Input
                          label="Phone *"
                          placeholder="+1 (555) 123-4567"
                          value={businessInfo.phone || ''}
                          onChange={(e) => handleBusinessInfoChange('phone', e.target.value)}
                          className="bg-slate-900 border-slate-600 text-white"
                        />
                        <Input
                          label="Email *"
                          type="email"
                          placeholder="contact@example.com"
                          value={businessInfo.email || ''}
                          onChange={(e) => handleBusinessInfoChange('email', e.target.value)}
                          className="bg-slate-900 border-slate-600 text-white"
                        />
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <MapPin size={18} className="text-blue-400" />
                        <h3 className="font-semibold text-white">Location</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Street Address"
                          placeholder="123 Main Street"
                          value={businessInfo.street || ''}
                          onChange={(e) => handleBusinessInfoChange('street', e.target.value)}
                          className="bg-slate-900 border-slate-600 text-white"
                        />
                        <Input
                          label="City *"
                          placeholder="Austin"
                          value={businessInfo.city || ''}
                          onChange={(e) => handleBusinessInfoChange('city', e.target.value)}
                          className="bg-slate-900 border-slate-600 text-white"
                        />
                        <Input
                          label="State *"
                          placeholder="TX"
                          value={businessInfo.state || ''}
                          onChange={(e) => handleBusinessInfoChange('state', e.target.value)}
                          className="bg-slate-900 border-slate-600 text-white"
                        />
                        <Input
                          label="ZIP Code"
                          placeholder="78701"
                          value={businessInfo.zip || ''}
                          onChange={(e) => handleBusinessInfoChange('zip', e.target.value)}
                          className="bg-slate-900 border-slate-600 text-white"
                        />
                      </div>
                    </div>

                    {/* Staff */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <User size={18} className="text-blue-400" />
                        <h3 className="font-semibold text-white">Primary Contact</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Name *"
                          placeholder="Jennifer Hayes"
                          value={businessInfo.staffName || ''}
                          onChange={(e) => handleBusinessInfoChange('staffName', e.target.value)}
                          className="bg-slate-900 border-slate-600 text-white"
                        />
                        <Input
                          label="Title *"
                          placeholder="Lead Broker & Owner"
                          value={businessInfo.staffTitle || ''}
                          onChange={(e) => handleBusinessInfoChange('staffTitle', e.target.value)}
                          className="bg-slate-900 border-slate-600 text-white"
                        />
                      </div>
                    </div>

                    {/* Hours */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Clock size={18} className="text-blue-400" />
                        <h3 className="font-semibold text-white">Business Hours</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                          label="Weekdays"
                          placeholder="9:00 AM - 6:00 PM"
                          value={businessInfo.weekdayHours || ''}
                          onChange={(e) => handleBusinessInfoChange('weekdayHours', e.target.value)}
                          className="bg-slate-900 border-slate-600 text-white"
                        />
                        <Input
                          label="Saturday"
                          placeholder="10:00 AM - 4:00 PM"
                          value={businessInfo.saturdayHours || ''}
                          onChange={(e) => handleBusinessInfoChange('saturdayHours', e.target.value)}
                          className="bg-slate-900 border-slate-600 text-white"
                        />
                        <Input
                          label="Sunday"
                          placeholder="Closed"
                          value={businessInfo.sundayHours || ''}
                          onChange={(e) => handleBusinessInfoChange('sundayHours', e.target.value)}
                          className="bg-slate-900 border-slate-600 text-white"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 3: API Keys */}
            {step === 3 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Connect your services
                  </h2>
                  <p className="text-slate-400">
                    Enter your API keys to enable AI features
                  </p>
                </div>

                <div className="space-y-6">
                  {/* OpenAI - Required */}
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Key size={18} className="text-amber-400" />
                        <h3 className="font-semibold text-white">AI Content Generation</h3>
                      </div>
                      <Input
                        label="OpenAI API Key *"
                        type="password"
                        placeholder="sk-..."
                        hint="Used for AI content generation. Get yours at platform.openai.com"
                        value={apiKeys.openaiKey || ''}
                        onChange={(e) => handleAPIKeyChange('openaiKey', e.target.value)}
                        className="bg-slate-900 border-slate-600 text-white"
                      />
                    </CardContent>
                  </Card>

                  {/* ElevenLabs - Two Options */}
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Sparkles size={18} className="text-purple-400" />
                        <h3 className="font-semibold text-white">Voice Agent Setup</h3>
                      </div>

                      {/* Toggle between modes */}
                      <div className="flex gap-2 mb-4">
                        <button
                          type="button"
                          onClick={() => handleAPIKeyChange('elevenLabsApiKey', '')}
                          className={cn(
                            'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors',
                            !apiKeys.elevenLabsApiKey
                              ? 'bg-purple-500 text-white'
                              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          )}
                        >
                          I have an Agent ID
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAPIKeyChange('elevenLabsAgentId', '')}
                          className={cn(
                            'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors',
                            apiKeys.elevenLabsApiKey
                              ? 'bg-purple-500 text-white'
                              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          )}
                        >
                          Auto-Create Agent
                        </button>
                      </div>

                      {!apiKeys.elevenLabsApiKey ? (
                        <div className="space-y-3">
                          <Input
                            label="ElevenLabs Agent ID *"
                            placeholder="agent_xxxxx"
                            hint="Enter your existing agent ID from elevenlabs.io/conversational-ai"
                            value={apiKeys.elevenLabsAgentId || ''}
                            onChange={(e) => handleAPIKeyChange('elevenLabsAgentId', e.target.value)}
                            className="bg-slate-900 border-slate-600 text-white"
                          />
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                            <p className="text-sm text-purple-300">
                              <strong>Auto-Create Mode:</strong> We'll create a voice agent for you
                              using your ElevenLabs API key. The agent will be configured with your
                              business info and prompts automatically.
                            </p>
                          </div>
                          <Input
                            label="ElevenLabs API Key *"
                            type="password"
                            placeholder="xi-..."
                            hint="Your API key from elevenlabs.io/app/settings/api-keys"
                            value={apiKeys.elevenLabsApiKey || ''}
                            onChange={(e) => handleAPIKeyChange('elevenLabsApiKey', e.target.value)}
                            className="bg-slate-900 border-slate-600 text-white"
                          />
                          <Input
                            label="Webhook Base URL (Optional)"
                            placeholder="https://your-n8n.com/webhook"
                            hint="If you have n8n webhooks for booking, enter the base URL"
                            value={apiKeys.webhookBaseUrl || ''}
                            onChange={(e) => handleAPIKeyChange('webhookBaseUrl', e.target.value)}
                            className="bg-slate-900 border-slate-600 text-white"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Optional Keys */}
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Sparkles size={18} className="text-slate-400" />
                        <h3 className="font-semibold text-white">Optional Integrations</h3>
                      </div>
                      <div className="space-y-4">
                        <Input
                          label="Supabase URL"
                          placeholder="https://xxxxx.supabase.co"
                          hint="For storing appointments and call logs"
                          value={apiKeys.supabaseUrl || ''}
                          onChange={(e) => handleAPIKeyChange('supabaseUrl', e.target.value)}
                          className="bg-slate-900 border-slate-600 text-white"
                        />
                        <Input
                          label="Supabase Anon Key"
                          type="password"
                          placeholder="eyJhbGci..."
                          value={apiKeys.supabaseAnonKey || ''}
                          onChange={(e) => handleAPIKeyChange('supabaseAnonKey', e.target.value)}
                          className="bg-slate-900 border-slate-600 text-white"
                        />
                        <Input
                          label="Cal.com Booking Link"
                          placeholder="https://cal.com/yourname/meeting"
                          hint="For embedded booking calendar"
                          value={apiKeys.calcomLink || ''}
                          onChange={(e) => handleAPIKeyChange('calcomLink', e.target.value)}
                          className="bg-slate-900 border-slate-600 text-white"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Step 4: Generate & Review */}
            {step === 4 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {generatedConfig ? 'Review your configuration' : 'Generate your AI content'}
                  </h2>
                  <p className="text-slate-400">
                    {generatedConfig
                      ? 'Review and customize the generated content'
                      : 'Our AI will create personalized content for your business'}
                  </p>
                </div>

                {!generatedConfig && !isGenerating && (
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-12 text-center">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-6">
                        <Sparkles className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Ready to generate?
                      </h3>
                      <p className="text-slate-400 mb-6 max-w-md mx-auto">
                        We'll use AI to create a customized website, voice agent prompts,
                        services, FAQs, and branding for {businessInfo.name}.
                      </p>
                      {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                          {error}
                        </div>
                      )}
                      <Button size="lg" onClick={handleGenerate}>
                        <Zap className="w-5 h-5 mr-2" />
                        Generate with AI
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {isGenerating && (
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-12 text-center">
                      <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-6" />
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Generating your content...
                      </h3>
                      <p className="text-slate-400">
                        This may take 10-20 seconds
                      </p>
                    </CardContent>
                  </Card>
                )}

                {generatedConfig && (
                  <div className="max-h-[60vh] overflow-y-auto pr-2">
                    <ConfigEditor
                      config={generatedConfig}
                      onChange={(updated) => setGeneratedConfig(updated)}
                    />
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={step === 1}
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back
          </Button>

          {step < 4 && (
            <Button
              onClick={nextStep}
              disabled={
                (step === 1 && !isStep1Valid) ||
                (step === 2 && !isStep2Valid) ||
                (step === 3 && !isStep3Valid)
              }
            >
              Continue
              <ArrowRight size={18} className="ml-2" />
            </Button>
          )}

          {step === 4 && generatedConfig && (
            <div className="flex flex-col items-end gap-2">
              {agentCreationError && (
                <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
                  {agentCreationError}
                </div>
              )}
              <Button onClick={handleComplete} disabled={isCreatingAgent}>
                {isCreatingAgent ? (
                  <>
                    <Loader2 size={18} className="mr-2 animate-spin" />
                    Creating Voice Agent...
                  </>
                ) : (
                  <>
                    <Check size={18} className="mr-2" />
                    Complete Setup
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
