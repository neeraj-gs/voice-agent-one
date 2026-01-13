/**
 * Config Editor
 * Allows users to edit all AI-generated content and add custom information
 */

import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  Sparkles,
  MessageSquare,
  FileText,
  Palette,
  Users,
  HelpCircle,
  BookOpen,
  Settings,
  AlertCircle,
} from 'lucide-react';
import { Button, Input, Textarea, Card, CardContent } from '../ui';
import type { BusinessConfig, Service, FAQ, Testimonial } from '../../types';
import { cn } from '../../utils/cn';

interface ConfigEditorProps {
  config: BusinessConfig;
  onChange: (config: BusinessConfig) => void;
}

// Collapsible Section Component
const Section: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: string;
}> = ({ title, icon, children, defaultOpen = false, badge }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="text-blue-400">{icon}</div>
          <span className="font-semibold text-white">{title}</span>
          {badge && (
            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
              {badge}
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp size={20} className="text-slate-400" />
        ) : (
          <ChevronDown size={20} className="text-slate-400" />
        )}
      </button>
      {isOpen && (
        <CardContent className="px-6 pb-6 pt-2 border-t border-slate-700">
          {children}
        </CardContent>
      )}
    </Card>
  );
};

export const ConfigEditor: React.FC<ConfigEditorProps> = ({ config, onChange }) => {
  // Update helper
  const updateConfig = (updates: Partial<BusinessConfig>) => {
    onChange({ ...config, ...updates });
  };

  // Service management
  const addService = () => {
    const newService: Service = {
      id: `service-${Date.now()}`,
      name: '',
      description: '',
      duration: 30,
      price: 0,
      category: 'General',
    };
    updateConfig({ services: [...config.services, newService] });
  };

  const updateService = (index: number, updates: Partial<Service>) => {
    const newServices = [...config.services];
    newServices[index] = { ...newServices[index], ...updates };
    updateConfig({ services: newServices });
  };

  const removeService = (index: number) => {
    updateConfig({ services: config.services.filter((_, i) => i !== index) });
  };

  // FAQ management
  const addFAQ = () => {
    updateConfig({ faqs: [...config.faqs, { question: '', answer: '' }] });
  };

  const updateFAQ = (index: number, updates: Partial<FAQ>) => {
    const newFaqs = [...config.faqs];
    newFaqs[index] = { ...newFaqs[index], ...updates };
    updateConfig({ faqs: newFaqs });
  };

  const removeFAQ = (index: number) => {
    updateConfig({ faqs: config.faqs.filter((_, i) => i !== index) });
  };

  // Testimonial management
  const addTestimonial = () => {
    updateConfig({
      testimonials: [
        ...config.testimonials,
        { name: '', role: '', content: '', rating: 5 },
      ],
    });
  };

  const updateTestimonial = (index: number, updates: Partial<Testimonial>) => {
    const newTestimonials = [...config.testimonials];
    newTestimonials[index] = { ...newTestimonials[index], ...updates };
    updateConfig({ testimonials: newTestimonials });
  };

  const removeTestimonial = (index: number) => {
    updateConfig({ testimonials: config.testimonials.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      {/* Info Banner */}
      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
        <AlertCircle size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-200">
          <strong>Review & Customize:</strong> Edit any AI-generated content below.
          Add your own services, FAQs, and knowledge base entries.
          Customize the voice agent prompts to match your business needs.
        </div>
      </div>

      {/* Business Info Section */}
      <Section title="Business Information" icon={<Edit3 size={20} />} defaultOpen>
        <div className="space-y-4">
          <Input
            label="Business Name"
            value={config.name}
            onChange={(e) => updateConfig({ name: e.target.value })}
            className="bg-slate-900 border-slate-600 text-white"
          />
          <Input
            label="Tagline"
            value={config.tagline}
            onChange={(e) => updateConfig({ tagline: e.target.value })}
            placeholder="A catchy phrase that describes your business"
            className="bg-slate-900 border-slate-600 text-white"
          />
          <Textarea
            label="Description"
            value={config.description}
            onChange={(e) => updateConfig({ description: e.target.value })}
            rows={3}
            placeholder="Describe your business in 2-3 sentences"
            className="bg-slate-900 border-slate-600 text-white"
          />
        </div>
      </Section>

      {/* Branding Section */}
      <Section title="Branding & Colors" icon={<Palette size={20} />}>
        <div className="space-y-4">
          <p className="text-sm text-slate-400 mb-4">
            Customize the color scheme for your website
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Primary Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={config.branding.primaryColor}
                  onChange={(e) =>
                    updateConfig({
                      branding: { ...config.branding, primaryColor: e.target.value },
                    })
                  }
                  className="w-12 h-12 rounded-lg cursor-pointer border-2 border-slate-600"
                />
                <Input
                  value={config.branding.primaryColor}
                  onChange={(e) =>
                    updateConfig({
                      branding: { ...config.branding, primaryColor: e.target.value },
                    })
                  }
                  className="bg-slate-900 border-slate-600 text-white flex-1"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Secondary Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={config.branding.secondaryColor}
                  onChange={(e) =>
                    updateConfig({
                      branding: { ...config.branding, secondaryColor: e.target.value },
                    })
                  }
                  className="w-12 h-12 rounded-lg cursor-pointer border-2 border-slate-600"
                />
                <Input
                  value={config.branding.secondaryColor}
                  onChange={(e) =>
                    updateConfig({
                      branding: { ...config.branding, secondaryColor: e.target.value },
                    })
                  }
                  className="bg-slate-900 border-slate-600 text-white flex-1"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Accent Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={config.branding.accentColor}
                  onChange={(e) =>
                    updateConfig({
                      branding: { ...config.branding, accentColor: e.target.value },
                    })
                  }
                  className="w-12 h-12 rounded-lg cursor-pointer border-2 border-slate-600"
                />
                <Input
                  value={config.branding.accentColor}
                  onChange={(e) =>
                    updateConfig({
                      branding: { ...config.branding, accentColor: e.target.value },
                    })
                  }
                  className="bg-slate-900 border-slate-600 text-white flex-1"
                />
              </div>
            </div>
          </div>
          {/* Color Preview */}
          <div className="mt-4 p-4 rounded-lg bg-slate-900/50">
            <p className="text-sm text-slate-400 mb-2">Preview:</p>
            <div className="flex items-center gap-2">
              <div
                className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                style={{ backgroundColor: config.branding.primaryColor }}
              >
                Primary Button
              </div>
              <div
                className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                style={{ backgroundColor: config.branding.secondaryColor }}
              >
                Secondary
              </div>
              <div
                className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                style={{ backgroundColor: config.branding.accentColor }}
              >
                Accent
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Services Section */}
      <Section
        title="Services"
        icon={<FileText size={20} />}
        badge={`${config.services.length} services`}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-400">
            Add or edit the services your business offers. These will be displayed on your website
            and used by the voice agent.
          </p>

          {config.services.map((service, index) => (
            <Card key={service.id} className="bg-slate-900/50 border-slate-600">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs text-slate-500">Service {index + 1}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeService(index)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 -mt-1 -mr-1"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Service Name"
                    value={service.name}
                    onChange={(e) => updateService(index, { name: e.target.value })}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                  <Input
                    placeholder="Category"
                    value={service.category}
                    onChange={(e) => updateService(index, { category: e.target.value })}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                  <div className="col-span-2">
                    <Textarea
                      placeholder="Description"
                      value={service.description}
                      onChange={(e) => updateService(index, { description: e.target.value })}
                      rows={2}
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                  <Input
                    type="number"
                    placeholder="Duration (min)"
                    value={service.duration}
                    onChange={(e) => updateService(index, { duration: parseInt(e.target.value) || 0 })}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                  <Input
                    type="number"
                    placeholder="Price ($)"
                    value={service.price}
                    onChange={(e) => updateService(index, { price: parseInt(e.target.value) || 0 })}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          <Button variant="outline" onClick={addService} className="w-full">
            <Plus size={18} className="mr-2" />
            Add Service
          </Button>
        </div>
      </Section>

      {/* FAQs Section */}
      <Section
        title="Frequently Asked Questions"
        icon={<HelpCircle size={20} />}
        badge={`${config.faqs.length} FAQs`}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-400">
            Add common questions and answers. The voice agent will use these to answer customer inquiries.
          </p>

          {config.faqs.map((faq, index) => (
            <Card key={index} className="bg-slate-900/50 border-slate-600">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs text-slate-500">FAQ {index + 1}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFAQ(index)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 -mt-1 -mr-1"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
                <div className="space-y-3">
                  <Input
                    placeholder="Question"
                    value={faq.question}
                    onChange={(e) => updateFAQ(index, { question: e.target.value })}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                  <Textarea
                    placeholder="Answer"
                    value={faq.answer}
                    onChange={(e) => updateFAQ(index, { answer: e.target.value })}
                    rows={2}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          <Button variant="outline" onClick={addFAQ} className="w-full">
            <Plus size={18} className="mr-2" />
            Add FAQ
          </Button>
        </div>
      </Section>

      {/* Testimonials Section */}
      <Section
        title="Testimonials"
        icon={<Users size={20} />}
        badge={`${config.testimonials.length} reviews`}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-400">
            Add customer testimonials to build trust. These will be displayed on your website.
          </p>

          {config.testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-slate-900/50 border-slate-600">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs text-slate-500">Testimonial {index + 1}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTestimonial(index)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 -mt-1 -mr-1"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Name (e.g., Sarah M.)"
                      value={testimonial.name}
                      onChange={(e) => updateTestimonial(index, { name: e.target.value })}
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                    <Input
                      placeholder="Role (e.g., New Client)"
                      value={testimonial.role}
                      onChange={(e) => updateTestimonial(index, { role: e.target.value })}
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                  <Textarea
                    placeholder="Review content"
                    value={testimonial.content}
                    onChange={(e) => updateTestimonial(index, { content: e.target.value })}
                    rows={2}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => updateTestimonial(index, { rating: star })}
                          className={cn(
                            'w-8 h-8 rounded-lg transition-colors',
                            star <= testimonial.rating
                              ? 'bg-yellow-400 text-yellow-900'
                              : 'bg-slate-700 text-slate-400'
                          )}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button variant="outline" onClick={addTestimonial} className="w-full">
            <Plus size={18} className="mr-2" />
            Add Testimonial
          </Button>
        </div>
      </Section>

      {/* Voice Agent Section - CRITICAL */}
      <Section
        title="Voice Agent Configuration"
        icon={<MessageSquare size={20} />}
        defaultOpen
        badge="Important"
      >
        <div className="space-y-4">
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-sm text-blue-300">
              <strong>This is what ElevenLabs uses.</strong> Customize the voice agent's personality,
              system prompt, and greeting message. The system prompt tells the AI how to behave.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Agent Name"
              value={config.voiceAgent.name}
              onChange={(e) =>
                updateConfig({
                  voiceAgent: { ...config.voiceAgent, name: e.target.value },
                })
              }
              placeholder="e.g., Sarah, Alex, Taylor"
              className="bg-slate-900 border-slate-600 text-white"
            />
            <Input
              label="Personality"
              value={config.voiceAgent.personality}
              onChange={(e) =>
                updateConfig({
                  voiceAgent: { ...config.voiceAgent, personality: e.target.value },
                })
              }
              placeholder="e.g., friendly and professional"
              className="bg-slate-900 border-slate-600 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              First Message (Greeting)
            </label>
            <p className="text-xs text-slate-400 mb-2">
              This is the first thing the AI says when a customer calls.
            </p>
            <Textarea
              value={config.voiceAgent.firstMessage}
              onChange={(e) =>
                updateConfig({
                  voiceAgent: { ...config.voiceAgent, firstMessage: e.target.value },
                })
              }
              rows={3}
              placeholder="Hello! Thank you for calling [Business Name]. How can I help you today?"
              className="bg-slate-900 border-slate-600 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              System Prompt
            </label>
            <p className="text-xs text-slate-400 mb-2">
              This is the main instruction set for the AI. It defines behavior, knowledge, and capabilities.
              <strong className="text-amber-400"> Be detailed!</strong>
            </p>
            <Textarea
              value={config.voiceAgent.systemPrompt}
              onChange={(e) =>
                updateConfig({
                  voiceAgent: { ...config.voiceAgent, systemPrompt: e.target.value },
                })
              }
              rows={12}
              className="bg-slate-900 border-slate-600 text-white font-mono text-sm"
            />
          </div>
        </div>
      </Section>

      {/* Knowledge Base Section - NEW */}
      <Section
        title="Knowledge Base"
        icon={<BookOpen size={20} />}
        badge="Custom Info"
      >
        <KnowledgeBaseEditor config={config} onChange={updateConfig} />
      </Section>
    </div>
  );
};

// Knowledge Base Editor Component
const KnowledgeBaseEditor: React.FC<{
  config: BusinessConfig;
  onChange: (updates: Partial<BusinessConfig>) => void;
}> = ({ config, onChange }) => {
  // Add knowledgeBase to config if it doesn't exist
  const knowledgeBase = (config as any).knowledgeBase || [];

  const addEntry = () => {
    onChange({
      ...config,
      knowledgeBase: [...knowledgeBase, { title: '', content: '' }],
    } as any);
  };

  const updateEntry = (index: number, updates: { title?: string; content?: string }) => {
    const newKB = [...knowledgeBase];
    newKB[index] = { ...newKB[index], ...updates };
    onChange({ ...config, knowledgeBase: newKB } as any);
  };

  const removeEntry = (index: number) => {
    onChange({
      ...config,
      knowledgeBase: knowledgeBase.filter((_: any, i: number) => i !== index),
    } as any);
  };

  return (
    <div className="space-y-4">
      <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
        <p className="text-sm text-purple-300">
          Add custom information that the voice agent should know about your business.
          This could include policies, special instructions, product details, or anything else
          that would help the AI assist your customers better.
        </p>
      </div>

      {/* Auto-generated Knowledge Preview */}
      <Card className="bg-slate-900/30 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-green-400" />
            <span className="text-sm font-medium text-green-400">Auto-Included Knowledge</span>
          </div>
          <p className="text-xs text-slate-400 mb-2">
            The following is automatically included in the voice agent's knowledge:
          </p>
          <ul className="text-xs text-slate-500 space-y-1">
            <li>• Business name, address, phone, and hours</li>
            <li>• All services with descriptions and pricing</li>
            <li>• All FAQs and their answers</li>
            <li>• Staff information</li>
          </ul>
        </CardContent>
      </Card>

      {/* Custom Knowledge Entries */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-slate-300">Custom Knowledge Entries</h4>

        {knowledgeBase.length === 0 ? (
          <p className="text-sm text-slate-500 italic">
            No custom knowledge entries yet. Add information about policies, special offers, or anything else.
          </p>
        ) : (
          knowledgeBase.map((entry: any, index: number) => (
            <Card key={index} className="bg-slate-900/50 border-slate-600">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs text-slate-500">Entry {index + 1}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEntry(index)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 -mt-1 -mr-1"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
                <div className="space-y-3">
                  <Input
                    placeholder="Title (e.g., Cancellation Policy, Parking Info)"
                    value={entry.title}
                    onChange={(e) => updateEntry(index, { title: e.target.value })}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                  <Textarea
                    placeholder="Content - Detailed information the AI should know..."
                    value={entry.content}
                    onChange={(e) => updateEntry(index, { content: e.target.value })}
                    rows={4}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>
              </CardContent>
            </Card>
          ))
        )}

        <Button variant="outline" onClick={addEntry} className="w-full">
          <Plus size={18} className="mr-2" />
          Add Custom Knowledge
        </Button>
      </div>

      {/* Example Knowledge Entries */}
      <div className="mt-6 p-4 bg-slate-900/30 rounded-lg">
        <h4 className="text-sm font-medium text-slate-400 mb-2">Example Entries:</h4>
        <ul className="text-xs text-slate-500 space-y-2">
          <li><strong>Cancellation Policy:</strong> "We require 24 hours notice for cancellations. Late cancellations are subject to a $50 fee."</li>
          <li><strong>Insurance:</strong> "We accept most major insurance providers including Aetna, Blue Cross, and United Healthcare."</li>
          <li><strong>Parking:</strong> "Free parking is available in the lot behind our building. Street parking is also available."</li>
          <li><strong>Special Offers:</strong> "New customers get 20% off their first visit. We also offer a referral program."</li>
        </ul>
      </div>
    </div>
  );
};

export default ConfigEditor;
