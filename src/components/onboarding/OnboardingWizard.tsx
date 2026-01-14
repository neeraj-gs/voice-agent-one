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
  Webhook,
  History,
  Calendar,
  CalendarCheck,
  Search,
  Heart,
  Baby,
  Eye,
  Brain,
  Smile,
  Flower2,
  Paintbrush,
  Music,
  GraduationCap,
  BookOpen,
  Languages,
  Plane,
  Bus,
  Truck,
  Wrench,
  Hammer,
  Thermometer,
  Droplets,
  Lightbulb,
  TreePine,
  Waves,
  Bug,
  Wine,
  Coffee,
  Cake,
  PartyPopper,
  Video,
  Printer,
  Package,
  Shirt,
  Watch,
  Footprints,
  Dog,
  Warehouse,
  HardHat,
  Anchor,
  Mountain,
  Gamepad2,
  Compass,
  Map,
  Utensils,
  Building,
  Factory,
  School,
  Syringe,
  Activity,
  HeartPulse,
  Bone,
  Hand,
  PersonStanding,
  Accessibility,
  Armchair,
  Sofa,
  Bed,
  PenTool,
  LineChart,
  Receipt,
  Banknote,
  Award,
  Trophy,
  Monitor,
  Megaphone,
  Stamp,
  Glasses,
  Users,
} from 'lucide-react';
import { Button, Input, Card, CardContent } from '../ui';
import { ConfigEditor } from './ConfigEditor';
import { useConfigStore } from '../../stores/configStore';
import { generateBusinessContent, validateOpenAIKey } from '../../services/openai';
import type { IndustryType, BusinessInfo, APIKeys, BusinessConfig, WebhookTool } from '../../types';
import { cn } from '../../utils/cn';

// Comprehensive industry options with icons
const INDUSTRIES: { value: IndustryType; label: string; icon: React.ReactNode; description: string; keywords: string[] }[] = [
  // Healthcare & Medical
  { value: 'healthcare', label: 'Healthcare', icon: <Stethoscope size={24} />, description: 'Medical clinics, practices', keywords: ['medical', 'doctor', 'clinic', 'hospital', 'health'] },
  { value: 'dental', label: 'Dental', icon: <Smile size={24} />, description: 'Dentists, orthodontists', keywords: ['dentist', 'teeth', 'oral', 'orthodontist'] },
  { value: 'healthcare', label: 'Cardiology', icon: <Heart size={24} />, description: 'Heart specialists', keywords: ['heart', 'cardiac', 'cardiologist'] },
  { value: 'healthcare', label: 'Pediatrics', icon: <Baby size={24} />, description: 'Child healthcare', keywords: ['children', 'kids', 'baby', 'pediatrician'] },
  { value: 'healthcare', label: 'Ophthalmology', icon: <Eye size={24} />, description: 'Eye care specialists', keywords: ['eye', 'vision', 'optometry', 'glasses'] },
  { value: 'healthcare', label: 'Mental Health', icon: <Brain size={24} />, description: 'Therapy, counseling', keywords: ['therapy', 'counseling', 'psychologist', 'psychiatrist', 'mental'] },
  { value: 'healthcare', label: 'Dermatology', icon: <Hand size={24} />, description: 'Skin specialists', keywords: ['skin', 'dermatologist', 'skincare'] },
  { value: 'healthcare', label: 'Orthopedics', icon: <Bone size={24} />, description: 'Bone & joint specialists', keywords: ['bone', 'joint', 'orthopedic', 'spine'] },
  { value: 'healthcare', label: 'Physical Therapy', icon: <PersonStanding size={24} />, description: 'Rehabilitation services', keywords: ['physio', 'rehabilitation', 'pt'] },
  { value: 'healthcare', label: 'Chiropractic', icon: <Activity size={24} />, description: 'Spine & alignment', keywords: ['chiropractor', 'spine', 'back pain'] },
  { value: 'healthcare', label: 'Pharmacy', icon: <Syringe size={24} />, description: 'Medications & prescriptions', keywords: ['pharmacy', 'medication', 'prescription', 'drug'] },
  { value: 'healthcare', label: 'Home Healthcare', icon: <HeartPulse size={24} />, description: 'In-home medical care', keywords: ['home care', 'nursing', 'elderly'] },

  // Beauty & Wellness
  { value: 'salon', label: 'Hair Salon', icon: <Scissors size={24} />, description: 'Hair styling, cuts', keywords: ['hair', 'haircut', 'stylist', 'barber'] },
  { value: 'spa', label: 'Spa', icon: <Sparkles size={24} />, description: 'Spas, wellness centers', keywords: ['spa', 'wellness', 'relaxation', 'massage'] },
  { value: 'salon', label: 'Nail Salon', icon: <Hand size={24} />, description: 'Manicures, pedicures', keywords: ['nails', 'manicure', 'pedicure'] },
  { value: 'spa', label: 'Massage Therapy', icon: <Accessibility size={24} />, description: 'Therapeutic massage', keywords: ['massage', 'therapy', 'bodywork'] },
  { value: 'salon', label: 'Med Spa', icon: <Sparkles size={24} />, description: 'Medical aesthetics', keywords: ['medspa', 'botox', 'aesthetics', 'cosmetic'] },
  { value: 'salon', label: 'Barbershop', icon: <Scissors size={24} />, description: 'Men\'s grooming', keywords: ['barber', 'men', 'grooming', 'shave'] },
  { value: 'salon', label: 'Tattoo Studio', icon: <PenTool size={24} />, description: 'Tattoos & piercings', keywords: ['tattoo', 'ink', 'piercing', 'body art'] },

  // Fitness & Sports
  { value: 'fitness', label: 'Gym', icon: <Dumbbell size={24} />, description: 'Fitness centers', keywords: ['gym', 'fitness', 'workout', 'exercise'] },
  { value: 'fitness', label: 'Yoga Studio', icon: <PersonStanding size={24} />, description: 'Yoga & meditation', keywords: ['yoga', 'meditation', 'mindfulness'] },
  { value: 'fitness', label: 'Pilates', icon: <Activity size={24} />, description: 'Pilates classes', keywords: ['pilates', 'core', 'flexibility'] },
  { value: 'fitness', label: 'CrossFit', icon: <Dumbbell size={24} />, description: 'CrossFit training', keywords: ['crossfit', 'hiit', 'functional'] },
  { value: 'fitness', label: 'Personal Training', icon: <Trophy size={24} />, description: 'One-on-one training', keywords: ['personal trainer', 'coaching', 'fitness coach'] },
  { value: 'fitness', label: 'Martial Arts', icon: <Award size={24} />, description: 'Martial arts schools', keywords: ['martial arts', 'karate', 'judo', 'mma', 'boxing'] },
  { value: 'fitness', label: 'Dance Studio', icon: <Music size={24} />, description: 'Dance classes', keywords: ['dance', 'ballet', 'hip hop', 'salsa'] },
  { value: 'fitness', label: 'Swimming', icon: <Waves size={24} />, description: 'Swimming lessons', keywords: ['swimming', 'pool', 'aquatics'] },
  { value: 'fitness', label: 'Golf', icon: <Mountain size={24} />, description: 'Golf courses & lessons', keywords: ['golf', 'course', 'driving range'] },
  { value: 'fitness', label: 'Tennis', icon: <Trophy size={24} />, description: 'Tennis clubs & lessons', keywords: ['tennis', 'court', 'racket'] },

  // Professional Services
  { value: 'legal', label: 'Law Firm', icon: <Scale size={24} />, description: 'Legal services', keywords: ['lawyer', 'attorney', 'legal', 'law'] },
  { value: 'accounting', label: 'Accounting', icon: <Calculator size={24} />, description: 'CPAs, bookkeeping', keywords: ['accountant', 'cpa', 'tax', 'bookkeeping'] },
  { value: 'consulting', label: 'Consulting', icon: <Briefcase size={24} />, description: 'Business consulting', keywords: ['consultant', 'advisory', 'strategy'] },
  { value: 'consulting', label: 'Financial Advisor', icon: <LineChart size={24} />, description: 'Investment planning', keywords: ['financial', 'investment', 'wealth', 'advisor'] },
  { value: 'consulting', label: 'Insurance', icon: <Receipt size={24} />, description: 'Insurance services', keywords: ['insurance', 'coverage', 'policy'] },
  { value: 'consulting', label: 'HR Services', icon: <Users size={24} />, description: 'Human resources', keywords: ['hr', 'hiring', 'recruitment', 'staffing'] },
  { value: 'consulting', label: 'Marketing Agency', icon: <Megaphone size={24} />, description: 'Marketing & advertising', keywords: ['marketing', 'advertising', 'digital', 'seo'] },
  { value: 'consulting', label: 'IT Services', icon: <Monitor size={24} />, description: 'Tech support & consulting', keywords: ['it', 'tech', 'computer', 'software'] },

  // Real Estate & Property
  { value: 'realestate', label: 'Real Estate', icon: <Home size={24} />, description: 'Agents, brokerages', keywords: ['real estate', 'realtor', 'property', 'homes'] },
  { value: 'realestate', label: 'Property Management', icon: <Building size={24} />, description: 'Property managers', keywords: ['property', 'management', 'landlord', 'rental'] },
  { value: 'realestate', label: 'Mortgage', icon: <Banknote size={24} />, description: 'Home loans', keywords: ['mortgage', 'loan', 'home loan', 'lending'] },
  { value: 'realestate', label: 'Home Staging', icon: <Sofa size={24} />, description: 'Home staging services', keywords: ['staging', 'interior', 'decor'] },

  // Home Services
  { value: 'other', label: 'HVAC', icon: <Thermometer size={24} />, description: 'Heating & cooling', keywords: ['hvac', 'heating', 'cooling', 'ac', 'air conditioning'] },
  { value: 'other', label: 'Plumbing', icon: <Droplets size={24} />, description: 'Plumbing services', keywords: ['plumber', 'pipes', 'drain', 'water'] },
  { value: 'other', label: 'Electrical', icon: <Lightbulb size={24} />, description: 'Electrical services', keywords: ['electrician', 'wiring', 'electrical'] },
  { value: 'other', label: 'Roofing', icon: <Home size={24} />, description: 'Roof repair & installation', keywords: ['roofing', 'roof', 'shingles'] },
  { value: 'other', label: 'Landscaping', icon: <TreePine size={24} />, description: 'Lawn & garden', keywords: ['landscaping', 'lawn', 'garden', 'yard'] },
  { value: 'other', label: 'Pool Service', icon: <Waves size={24} />, description: 'Pool maintenance', keywords: ['pool', 'swimming', 'cleaning'] },
  { value: 'other', label: 'Pest Control', icon: <Bug size={24} />, description: 'Pest extermination', keywords: ['pest', 'exterminator', 'bugs', 'insects'] },
  { value: 'other', label: 'Cleaning Service', icon: <Sparkles size={24} />, description: 'House cleaning', keywords: ['cleaning', 'maid', 'housekeeping', 'janitorial'] },
  { value: 'other', label: 'Handyman', icon: <Wrench size={24} />, description: 'General repairs', keywords: ['handyman', 'repair', 'fix', 'maintenance'] },
  { value: 'other', label: 'Construction', icon: <HardHat size={24} />, description: 'Contractors, builders', keywords: ['construction', 'contractor', 'builder', 'remodel'] },
  { value: 'other', label: 'Interior Design', icon: <Armchair size={24} />, description: 'Interior designers', keywords: ['interior design', 'decorator', 'home design'] },
  { value: 'other', label: 'Moving Service', icon: <Truck size={24} />, description: 'Moving companies', keywords: ['moving', 'movers', 'relocation', 'packing'] },
  { value: 'other', label: 'Storage', icon: <Warehouse size={24} />, description: 'Storage facilities', keywords: ['storage', 'warehouse', 'self storage'] },
  { value: 'other', label: 'Security', icon: <Award size={24} />, description: 'Security services', keywords: ['security', 'alarm', 'surveillance', 'protection'] },

  // Food & Beverage
  { value: 'restaurant', label: 'Restaurant', icon: <UtensilsCrossed size={24} />, description: 'Restaurants, cafes', keywords: ['restaurant', 'dining', 'food', 'eat'] },
  { value: 'restaurant', label: 'Catering', icon: <Utensils size={24} />, description: 'Catering services', keywords: ['catering', 'events', 'food service'] },
  { value: 'restaurant', label: 'Bakery', icon: <Cake size={24} />, description: 'Bakeries & pastries', keywords: ['bakery', 'cake', 'pastry', 'bread'] },
  { value: 'restaurant', label: 'Coffee Shop', icon: <Coffee size={24} />, description: 'Coffee & tea', keywords: ['coffee', 'cafe', 'espresso', 'tea'] },
  { value: 'restaurant', label: 'Bar/Winery', icon: <Wine size={24} />, description: 'Bars, wineries', keywords: ['bar', 'wine', 'brewery', 'pub'] },
  { value: 'restaurant', label: 'Food Truck', icon: <Truck size={24} />, description: 'Mobile food vendors', keywords: ['food truck', 'mobile', 'street food'] },

  // Automotive
  { value: 'automotive', label: 'Auto Repair', icon: <Car size={24} />, description: 'Car repair shops', keywords: ['auto repair', 'mechanic', 'car service'] },
  { value: 'automotive', label: 'Car Dealership', icon: <Car size={24} />, description: 'New & used cars', keywords: ['dealership', 'car sales', 'vehicles'] },
  { value: 'automotive', label: 'Auto Detailing', icon: <Sparkles size={24} />, description: 'Car detailing', keywords: ['detailing', 'car wash', 'auto spa'] },
  { value: 'automotive', label: 'Tire Shop', icon: <Car size={24} />, description: 'Tires & wheels', keywords: ['tires', 'wheels', 'alignment'] },
  { value: 'automotive', label: 'Body Shop', icon: <Wrench size={24} />, description: 'Collision repair', keywords: ['body shop', 'collision', 'dent repair'] },

  // Education & Tutoring
  { value: 'other', label: 'Tutoring', icon: <GraduationCap size={24} />, description: 'Academic tutoring', keywords: ['tutor', 'tutoring', 'teaching', 'education'] },
  { value: 'other', label: 'Music Lessons', icon: <Music size={24} />, description: 'Music instruction', keywords: ['music', 'lessons', 'piano', 'guitar'] },
  { value: 'other', label: 'Language School', icon: <Languages size={24} />, description: 'Language learning', keywords: ['language', 'esl', 'spanish', 'french'] },
  { value: 'other', label: 'Art Classes', icon: <Paintbrush size={24} />, description: 'Art instruction', keywords: ['art', 'painting', 'drawing', 'creative'] },
  { value: 'other', label: 'Driving School', icon: <Car size={24} />, description: 'Driving lessons', keywords: ['driving', 'lessons', 'license'] },
  { value: 'other', label: 'Test Prep', icon: <BookOpen size={24} />, description: 'Exam preparation', keywords: ['test prep', 'sat', 'act', 'gre'] },
  { value: 'other', label: 'Daycare', icon: <Baby size={24} />, description: 'Child care centers', keywords: ['daycare', 'childcare', 'preschool', 'nursery'] },

  // Pet Services
  { value: 'veterinary', label: 'Veterinary', icon: <PawPrint size={24} />, description: 'Vet clinics, animal care', keywords: ['vet', 'veterinary', 'animal', 'pet care'] },
  { value: 'veterinary', label: 'Pet Grooming', icon: <Dog size={24} />, description: 'Pet grooming services', keywords: ['grooming', 'pet spa', 'dog grooming'] },
  { value: 'veterinary', label: 'Pet Boarding', icon: <PawPrint size={24} />, description: 'Pet hotels, kennels', keywords: ['boarding', 'kennel', 'pet hotel'] },
  { value: 'veterinary', label: 'Dog Training', icon: <Dog size={24} />, description: 'Pet training services', keywords: ['dog training', 'obedience', 'pet training'] },
  { value: 'veterinary', label: 'Pet Store', icon: <PawPrint size={24} />, description: 'Pet supplies', keywords: ['pet store', 'pet supplies', 'pet shop'] },

  // Events & Entertainment
  { value: 'photography', label: 'Photography', icon: <Camera size={24} />, description: 'Studios, photographers', keywords: ['photography', 'photographer', 'photos', 'portraits'] },
  { value: 'photography', label: 'Videography', icon: <Video size={24} />, description: 'Video production', keywords: ['video', 'videographer', 'film', 'production'] },
  { value: 'other', label: 'Event Planning', icon: <PartyPopper size={24} />, description: 'Event coordinators', keywords: ['events', 'planning', 'wedding', 'party'] },
  { value: 'other', label: 'DJ Services', icon: <Music size={24} />, description: 'DJs & entertainment', keywords: ['dj', 'music', 'entertainment'] },
  { value: 'other', label: 'Florist', icon: <Flower2 size={24} />, description: 'Flower shops', keywords: ['florist', 'flowers', 'arrangements'] },
  { value: 'other', label: 'Printing', icon: <Printer size={24} />, description: 'Print shops', keywords: ['printing', 'print shop', 'copies'] },
  { value: 'other', label: 'Gaming', icon: <Gamepad2 size={24} />, description: 'Gaming centers', keywords: ['gaming', 'arcade', 'esports'] },

  // Travel & Transportation
  { value: 'other', label: 'Travel Agency', icon: <Plane size={24} />, description: 'Travel planning', keywords: ['travel', 'vacation', 'trips', 'tours'] },
  { value: 'other', label: 'Transportation', icon: <Bus size={24} />, description: 'Transport services', keywords: ['transportation', 'shuttle', 'limo', 'taxi'] },
  { value: 'other', label: 'Boat/Marina', icon: <Anchor size={24} />, description: 'Marine services', keywords: ['boat', 'marina', 'yacht', 'sailing'] },
  { value: 'other', label: 'Tour Guide', icon: <Compass size={24} />, description: 'Tour services', keywords: ['tours', 'guide', 'sightseeing'] },
  { value: 'other', label: 'Adventure Sports', icon: <Mountain size={24} />, description: 'Outdoor activities', keywords: ['adventure', 'outdoor', 'hiking', 'climbing'] },

  // Retail & Shopping
  { value: 'other', label: 'Retail Store', icon: <Store size={24} />, description: 'Retail shops', keywords: ['retail', 'store', 'shop', 'boutique'] },
  { value: 'other', label: 'Jewelry Store', icon: <Watch size={24} />, description: 'Jewelry & watches', keywords: ['jewelry', 'watches', 'gems', 'rings'] },
  { value: 'other', label: 'Clothing Store', icon: <Shirt size={24} />, description: 'Apparel retail', keywords: ['clothing', 'fashion', 'apparel', 'boutique'] },
  { value: 'other', label: 'Shoe Store', icon: <Footprints size={24} />, description: 'Footwear retail', keywords: ['shoes', 'footwear', 'sneakers'] },
  { value: 'other', label: 'Eyewear', icon: <Glasses size={24} />, description: 'Glasses & contacts', keywords: ['eyewear', 'glasses', 'optician', 'sunglasses'] },
  { value: 'other', label: 'Furniture Store', icon: <Bed size={24} />, description: 'Furniture retail', keywords: ['furniture', 'mattress', 'home furnishing'] },

  // Other Services
  { value: 'other', label: 'Notary', icon: <Stamp size={24} />, description: 'Notary services', keywords: ['notary', 'documents', 'signing'] },
  { value: 'other', label: 'Shipping', icon: <Package size={24} />, description: 'Shipping & logistics', keywords: ['shipping', 'courier', 'delivery', 'freight'] },
  { value: 'other', label: 'Manufacturing', icon: <Factory size={24} />, description: 'Manufacturing plants', keywords: ['manufacturing', 'factory', 'production'] },
  { value: 'other', label: 'Nonprofit', icon: <Heart size={24} />, description: 'Nonprofit organizations', keywords: ['nonprofit', 'charity', 'ngo', 'foundation'] },
  { value: 'other', label: 'Church/Religious', icon: <Building size={24} />, description: 'Religious organizations', keywords: ['church', 'religious', 'temple', 'mosque'] },
  { value: 'other', label: 'Government', icon: <Building2 size={24} />, description: 'Government services', keywords: ['government', 'municipal', 'public'] },
  { value: 'other', label: 'Other', icon: <Building2 size={24} />, description: 'Any service business', keywords: ['other', 'custom', 'general'] },
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
  const [selectedIndustryLabel, setSelectedIndustryLabel] = useState<string>('');
  const [industrySearch, setIndustrySearch] = useState('');
  const [businessInfo, setBusinessInfo] = useState<Partial<BusinessInfo>>({
    country: 'United States',
    weekdayHours: '9:00 AM - 6:00 PM',
    saturdayHours: '10:00 AM - 4:00 PM',
    sundayHours: 'Closed',
  });
  const [apiKeys, setApiKeysState] = useState<Partial<APIKeys>>({});
  const [useAutoCreate, setUseAutoCreate] = useState(false); // Toggle for ElevenLabs mode

  // Webhook tools for n8n integration
  const [webhookTools, setWebhookTools] = useState<WebhookTool[]>([
    {
      id: 'check_history',
      name: 'check_history',
      description: 'Check customer/patient history from database',
      url: '',
      enabled: false,
    },
    {
      id: 'check_availability',
      name: 'check_availability',
      description: 'Check available appointment slots',
      url: '',
      enabled: false,
    },
    {
      id: 'book_appointment',
      name: 'book_appointment',
      description: 'Book an appointment/session',
      url: '',
      enabled: false,
    },
  ]);
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
  const isStep3Valid = apiKeys.openaiKey && (
    useAutoCreate ? apiKeys.elevenLabsApiKey : apiKeys.elevenLabsAgentId
  );

  const handleBusinessInfoChange = (field: keyof BusinessInfo, value: string) => {
    setBusinessInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleAPIKeyChange = (field: keyof APIKeys, value: string) => {
    setApiKeysState((prev) => ({ ...prev, [field]: value }));
  };

  const handleWebhookToolChange = (toolId: string, field: 'url' | 'enabled', value: string | boolean) => {
    setWebhookTools((prev) =>
      prev.map((tool) =>
        tool.id === toolId
          ? { ...tool, [field]: value, enabled: field === 'url' ? !!value : (value as boolean) }
          : tool
      )
    );
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
        knowledgeBase: generated.knowledgeBase || [], // AI-generated knowledge base entries
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

    // Check if we need to create an agent (using auto-create mode with API key)
    const needsAgentCreation = useAutoCreate && apiKeys.elevenLabsApiKey;

    if (needsAgentCreation) {
      setIsCreatingAgent(true);
      setAgentCreationError(null);

      try {
        // Dynamically import to avoid bundling issues
        const { createAgent, addKnowledgeBase } = await import('../../services/elevenlabs');

        // Get enabled webhook tools (ones with URLs)
        const enabledTools = webhookTools.filter((t) => t.url);

        // Create the agent with tools
        const agentResponse = await createAgent({
          apiKey: apiKeys.elevenLabsApiKey!,
          config: generatedConfig,
          webhookTools: enabledTools,
        });

        // Try to add knowledge base (non-critical if it fails)
        try {
          await addKnowledgeBase(apiKeys.elevenLabsApiKey!, agentResponse.agent_id, generatedConfig);
        } catch (kbError) {
          console.warn('Failed to add knowledge base:', kbError);
        }

        // Save with the new agent ID and webhook tools
        setBusinessConfig(generatedConfig);
        setAPIKeys({
          openaiKey: apiKeys.openaiKey,
          elevenLabsAgentId: agentResponse.agent_id,
          elevenLabsApiKey: apiKeys.elevenLabsApiKey,
          supabaseUrl: apiKeys.supabaseUrl,
          supabaseAnonKey: apiKeys.supabaseAnonKey,
          calcomLink: apiKeys.calcomLink,
          webhookTools: enabledTools,
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
            {step === 1 && (() => {
              const searchLower = industrySearch.toLowerCase().trim();
              const filteredIndustries = searchLower
                ? INDUSTRIES.filter(
                    (ind) =>
                      ind.label.toLowerCase().includes(searchLower) ||
                      ind.description.toLowerCase().includes(searchLower) ||
                      ind.keywords.some((kw) => kw.toLowerCase().includes(searchLower))
                  )
                : INDUSTRIES;
              const displayIndustries = filteredIndustries.length > 0 ? filteredIndustries : INDUSTRIES;
              const showNoResultsMessage = filteredIndustries.length === 0 && searchLower;

              return (
                <div>
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      What type of business do you have?
                    </h2>
                    <p className="text-slate-400">
                      Search or select your industry to customize your AI assistant
                    </p>
                  </div>

                  {/* Search Input */}
                  <div className="relative mb-6 max-w-md mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search industries... (e.g., dental, yoga, plumbing)"
                      value={industrySearch}
                      onChange={(e) => setIndustrySearch(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {industrySearch && (
                      <button
                        onClick={() => setIndustrySearch('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xl"
                      >
                        ×
                      </button>
                    )}
                  </div>

                  {/* Selected Industry Badge */}
                  {selectedIndustryLabel && (
                    <div className="mb-4 text-center">
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-400 text-sm">
                        <Check size={16} />
                        Selected: {selectedIndustryLabel}
                      </span>
                    </div>
                  )}

                  {/* No Results Message */}
                  {showNoResultsMessage && (
                    <div className="text-center py-3 mb-4 bg-slate-800/50 rounded-xl border border-slate-700">
                      <p className="text-slate-400 text-sm">
                        No exact match for "{industrySearch}". Showing all industries.
                      </p>
                    </div>
                  )}

                  {/* Industry Grid - Single scrollable container */}
                  <div className="max-h-[45vh] overflow-y-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {displayIndustries.map((ind, index) => (
                        <Card
                          key={`${ind.label}-${index}`}
                          hover
                          onClick={() => {
                            setIndustry(ind.value);
                            setSelectedIndustryLabel(ind.label);
                          }}
                          className={cn(
                            'transition-all cursor-pointer',
                            selectedIndustryLabel === ind.label
                              ? 'ring-2 ring-blue-500 bg-blue-500/10 border-blue-500'
                              : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                          )}
                        >
                          <CardContent className="p-3 text-center">
                            <div
                              className={cn(
                                'w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center',
                                selectedIndustryLabel === ind.label
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-slate-700 text-slate-300'
                              )}
                            >
                              {ind.icon}
                            </div>
                            <h3 className="font-semibold text-white text-xs">{ind.label}</h3>
                            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{ind.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Industry count */}
                  <div className="text-center mt-4 text-slate-500 text-xs">
                    Showing {displayIndustries.length} of {INDUSTRIES.length} industries
                  </div>
                </div>
              );
            })()}

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
                          onClick={() => setUseAutoCreate(false)}
                          className={cn(
                            'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors',
                            !useAutoCreate
                              ? 'bg-purple-500 text-white'
                              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          )}
                        >
                          I have an Agent ID
                        </button>
                        <button
                          type="button"
                          onClick={() => setUseAutoCreate(true)}
                          className={cn(
                            'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors',
                            useAutoCreate
                              ? 'bg-purple-500 text-white'
                              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          )}
                        >
                          Auto-Create Agent
                        </button>
                      </div>

                      {!useAutoCreate ? (
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
                        <div className="space-y-4">
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
                            placeholder="sk_..."
                            hint="Your API key from elevenlabs.io → Profile → API Key"
                            value={apiKeys.elevenLabsApiKey || ''}
                            onChange={(e) => handleAPIKeyChange('elevenLabsApiKey', e.target.value)}
                            className="bg-slate-900 border-slate-600 text-white"
                          />

                          {/* n8n Webhook Tools */}
                          <div className="pt-4 border-t border-slate-700">
                            <div className="flex items-center gap-2 mb-3">
                              <Webhook size={16} className="text-orange-400" />
                              <h4 className="text-sm font-medium text-white">n8n Webhook Tools (Optional)</h4>
                            </div>
                            <p className="text-xs text-slate-400 mb-4">
                              Add your n8n webhook URLs to enable the agent to check availability and book appointments.
                            </p>

                            <div className="space-y-3">
                              {/* Check History Tool */}
                              <div className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg">
                                <History size={18} className="text-blue-400 mt-2 flex-shrink-0" />
                                <div className="flex-1">
                                  <label className="text-sm font-medium text-white block mb-1">
                                    Check History
                                  </label>
                                  <Input
                                    placeholder="https://your-n8n.com/webhook/check-history"
                                    value={webhookTools.find((t) => t.id === 'check_history')?.url || ''}
                                    onChange={(e) => handleWebhookToolChange('check_history', 'url', e.target.value)}
                                    className="bg-slate-800 border-slate-600 text-white text-sm"
                                  />
                                  <p className="text-xs text-slate-500 mt-1">
                                    Fetches customer/patient history from your database
                                  </p>
                                </div>
                              </div>

                              {/* Check Availability Tool */}
                              <div className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg">
                                <Calendar size={18} className="text-green-400 mt-2 flex-shrink-0" />
                                <div className="flex-1">
                                  <label className="text-sm font-medium text-white block mb-1">
                                    Check Availability
                                  </label>
                                  <Input
                                    placeholder="https://your-n8n.com/webhook/check-availability"
                                    value={webhookTools.find((t) => t.id === 'check_availability')?.url || ''}
                                    onChange={(e) => handleWebhookToolChange('check_availability', 'url', e.target.value)}
                                    className="bg-slate-800 border-slate-600 text-white text-sm"
                                  />
                                  <p className="text-xs text-slate-500 mt-1">
                                    Checks available appointment slots based on date/time
                                  </p>
                                </div>
                              </div>

                              {/* Book Appointment Tool */}
                              <div className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg">
                                <CalendarCheck size={18} className="text-purple-400 mt-2 flex-shrink-0" />
                                <div className="flex-1">
                                  <label className="text-sm font-medium text-white block mb-1">
                                    Book Appointment
                                  </label>
                                  <Input
                                    placeholder="https://your-n8n.com/webhook/book-appointment"
                                    value={webhookTools.find((t) => t.id === 'book_appointment')?.url || ''}
                                    onChange={(e) => handleWebhookToolChange('book_appointment', 'url', e.target.value)}
                                    className="bg-slate-800 border-slate-600 text-white text-sm"
                                  />
                                  <p className="text-xs text-slate-500 mt-1">
                                    Books an appointment with customer details
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
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
