/**
 * Onboarding Wizard
 * Multi-step setup with AI content generation
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Legend } from '../system/primitives';
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
  X,
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
  Utensils,
  Building,
  Factory,
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
import { useBusinessStore } from '../../stores/businessStore';
import { useAuthStore } from '../../stores/authStore';
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
  { id: 1, title: 'Product', icon: Zap },
  { id: 2, title: 'Industry', icon: Store },
  { id: 3, title: 'Business Info', icon: Building2 },
  { id: 4, title: 'API Keys', icon: Key },
  { id: 5, title: 'Review & Edit', icon: Sparkles },
];

export const OnboardingWizard: React.FC = () => {
  const navigate = useNavigate();
  const { setBusinessConfig, setAPIKeys, completeSetup } = useConfigStore();
  const { addBusiness, saveVoiceAgent } = useBusinessStore();
  const { user } = useAuthStore();

  const [step, setStep] = useState(1);
  const [productType, setProductType] = useState<'website_and_agent' | 'agent_only' | null>(null);
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
  const [showOpenAIHelp, setShowOpenAIHelp] = useState(false);
  const [showElevenLabsHelp, setShowElevenLabsHelp] = useState(false);

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
  const isStep1Valid = productType !== null;
  const isStep2Valid = industry !== null;
  const isStep3Valid =
    businessInfo.name &&
    businessInfo.phone &&
    businessInfo.email &&
    businessInfo.city &&
    businessInfo.state &&
    businessInfo.staffName &&
    businessInfo.staffTitle;
  // Step 4 valid if: OpenAI key AND ElevenLabs API key
  const isStep4Valid = apiKeys.openaiKey && apiKeys.elevenLabsApiKey;

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
        productType: productType || 'website_and_agent',
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
    if (!generatedConfig || !apiKeys.openaiKey || !apiKeys.elevenLabsApiKey || !user) return;

    // Always create agent with API key (auto-create mode)
    const needsAgentCreation = true;

    setIsCreatingAgent(true);
    setAgentCreationError(null);

    let agentId = '';
    const enabledTools = webhookTools.filter((t) => t.url);

    if (needsAgentCreation) {
      try {
        // Dynamically import to avoid bundling issues
        const { createAgent, addKnowledgeBase } = await import('../../services/elevenlabs');

        // Create the agent with tools
        const agentResponse = await createAgent({
          apiKey: apiKeys.elevenLabsApiKey!,
          config: generatedConfig,
          webhookTools: enabledTools,
        });

        agentId = agentResponse.agent_id;

        // Try to add knowledge base (non-critical if it fails)
        try {
          await addKnowledgeBase(apiKeys.elevenLabsApiKey!, agentId, generatedConfig);
        } catch (kbError) {
          console.warn('Failed to add knowledge base:', kbError);
        }
      } catch (err) {
        console.error('Failed to create agent:', err);
        setAgentCreationError(
          err instanceof Error ? err.message : 'Failed to create voice agent. Please try again.'
        );
        setIsCreatingAgent(false);
        return;
      }
    }

    // Verify agent was created successfully
    if (!agentId) {
      setAgentCreationError('Failed to create voice agent. Please check your ElevenLabs API key and try again.');
      setIsCreatingAgent(false);
      return;
    }

    try {
      // Save business to Supabase
      const { businessId, error: businessError } = await addBusiness(user.id, generatedConfig);

      if (businessError || !businessId) {
        throw new Error(businessError || 'Failed to create business');
      }

      // Save voice agent to Supabase (use camelCase to match database service)
      const voiceAgentData = {
        elevenlabsAgentId: agentId,
        name: generatedConfig.voiceAgent?.name || `${generatedConfig.name} Assistant`,
        personality: generatedConfig.voiceAgent?.personality || '',
        systemPrompt: generatedConfig.voiceAgent?.systemPrompt || '',
        firstMessage: generatedConfig.voiceAgent?.firstMessage || '',
        openaiKey: apiKeys.openaiKey,
        elevenlabsApiKey: apiKeys.elevenLabsApiKey || undefined,
        supabaseUrl: apiKeys.supabaseUrl || undefined,
        supabaseAnonKey: apiKeys.supabaseAnonKey || undefined,
        bookingLink: apiKeys.bookingLink || undefined,
        webhookTools: enabledTools.length > 0 ? enabledTools : [],
      };

      const { error: agentError } = await saveVoiceAgent(businessId, voiceAgentData);

      if (agentError) {
        console.warn('Failed to save voice agent to database:', agentError);
        // Continue anyway - the business was created
      }

      // Also save to localStorage for backward compatibility
      setBusinessConfig(generatedConfig);
      setAPIKeys({
        openaiKey: apiKeys.openaiKey,
        elevenLabsAgentId: agentId,
        elevenLabsApiKey: apiKeys.elevenLabsApiKey,
        supabaseUrl: apiKeys.supabaseUrl,
        supabaseAnonKey: apiKeys.supabaseAnonKey,
        bookingLink: apiKeys.bookingLink,
        webhookTools: enabledTools,
      });
      completeSetup();

      // Navigate based on product type
      if (productType === 'agent_only') {
        navigate('/agent-dashboard');
      } else {
        navigate('/site');
      }
    } catch (err) {
      console.error('Failed to save business:', err);
      setAgentCreationError(
        err instanceof Error ? err.message : 'Failed to save business. Please try again.'
      );
      setIsCreatingAgent(false);
    }
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 5));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className="min-h-screen bg-ink">
      {/* Top plate */}
      <div className="sticky top-0 z-40 border-b border-edge-soft bg-ink/92 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4">
          <Link to="/businesses" className="flex items-baseline gap-2 outline-offset-4">
            <span className="display-lite text-[14px] text-bone">Voice Agent</span>
            <span className="readout text-[14px] text-amber">One</span>
          </Link>
          <span aria-hidden className="hidden h-4 w-px bg-edge sm:block" />
          <Legend className="hidden sm:block">Setting up a business</Legend>
          <span aria-hidden className="h-px flex-1 bg-edge-soft" />
          <span className="readout text-[10px] text-bone-faint">
            Step {step} of {STEPS.length}
          </span>
        </div>
      </div>

      {/* Transport: a tape counter, not a row of circles. These numbers are a
          real position in a real sequence, which is the only case where
          numbering earns its place. */}
      <div className="mx-auto max-w-5xl px-4 py-8">
        <ol className="mb-10 grid grid-cols-5 gap-px bg-edge-soft">
          {STEPS.map((s) => {
            const done = step > s.id;
            const here = step === s.id;
            return (
              <li key={s.id} className="relative bg-ink">
                <span
                  aria-hidden
                  className={cn(
                    'absolute inset-x-0 top-0 h-px transition-colors duration-300',
                    here ? 'bg-amber' : done ? 'bg-patina' : 'bg-edge'
                  )}
                />
                <div className="flex items-center gap-2 px-2 py-3.5 sm:px-3">
                  <span
                    className={cn(
                      'readout text-[11px] transition-colors',
                      here ? 'text-amber' : done ? 'text-patina-glow' : 'text-bone-faint'
                    )}
                  >
                    {String(s.id).padStart(2, '0')}
                  </span>
                  {done && <Check size={11} className="shrink-0 text-patina" />}
                  <span
                    className={cn(
                      'hidden truncate font-mono text-[10px] uppercase tracking-[0.14em] transition-colors sm:block',
                      here ? 'text-bone' : 'text-bone-faint'
                    )}
                  >
                    {s.title}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Step 1: Product Type Selection */}
            {step === 1 && (
              <div>
                <div className="mb-8 max-w-2xl border-b border-edge-soft pb-5">
                  <h2 className="display text-[clamp(1.5rem,3.2vw,2.25rem)] mb-3">
                    What are we building?
                  </h2>
                  <p className="text-bone-dim">
                    Both give you a working voice agent. The only question is whether you also need a website to put it on.
                  </p>
                </div>

                {/* Two positions on a routing switch. Left-aligned like every
                    other choice in the app; the lit lamp is the selection. */}
                <div
                  role="radiogroup"
                  aria-label="What to create"
                  className="grid gap-px bg-edge-soft md:grid-cols-2"
                >
                  {[
                    {
                      id: 'website_and_agent' as const,
                      title: 'Site and agent',
                      body: 'You do not have a website yet. We generate one and put the agent inside it.',
                      points: [
                        'A generated business site',
                        'The voice agent built in',
                        'A public link you can share',
                        'Reads well on a phone',
                      ],
                    },
                    {
                      id: 'agent_only' as const,
                      title: 'Agent only',
                      body: 'You already have a website. Take the embed code and paste it in.',
                      points: [
                        'The voice agent on its own',
                        'A dashboard to test and edit it',
                        'Embed code for any site',
                        'React, Next.js, Shopify',
                      ],
                    },
                  ].map((opt) => {
                    const on = productType === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => setProductType(opt.id)}
                        className={cn(
                          'flex flex-col items-start p-6 text-left transition-colors',
                          on ? 'bg-steel ring-1 ring-inset ring-amber/40' : 'bg-ink hover:bg-steel-lift'
                        )}
                      >
                        <span className="flex items-center gap-2.5">
                          <span
                            className={cn('lamp', on && 'lamp-on')}
                            aria-hidden
                          />
                          <span className="display-lite text-[15px] text-bone">{opt.title}</span>
                        </span>

                        <span className="mt-3 max-w-sm text-[14px] leading-relaxed text-bone-dim">
                          {opt.body}
                        </span>

                        <span className="mt-5 w-full space-y-2 border-t border-edge-soft pt-4">
                          {opt.points.map((p) => (
                            <span key={p} className="flex items-start gap-2.5 text-[13.5px] text-bone-dim">
                              <Check size={13} className="mt-1 shrink-0 text-patina" />
                              {p}
                            </span>
                          ))}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Industry Selection */}
            {step === 2 && (() => {
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
                  <div className="mb-8 max-w-2xl border-b border-edge-soft pb-5">
                    <h2 className="display text-[clamp(1.5rem,3.2vw,2.25rem)] mb-3">
                      What trade are you in?
                    </h2>
                    <p className="text-bone-dim">
                      This sets the vocabulary the agent uses &mdash; patients, guests, clients, jobs &mdash;
                      along with the services and tone it starts from.
                    </p>
                  </div>

                  {/* Search */}
                  <div className="relative mb-6 max-w-md">
                    <Search
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-bone-faint"
                      size={15}
                    />
                    <input
                      type="text"
                      aria-label="Search trades"
                      placeholder="Search — dental, yoga, plumbing…"
                      value={industrySearch}
                      onChange={(e) => setIndustrySearch(e.target.value)}
                      className="w-full rounded-panel border border-edge bg-ink py-2.5 pl-10 pr-9 text-[15px] text-bone shadow-recess placeholder:text-bone-faint caret-amber transition-colors focus:border-amber focus:outline-none"
                    />
                    {industrySearch && (
                      <button
                        onClick={() => setIndustrySearch('')}
                        aria-label="Clear search"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-bone-faint transition-colors hover:text-amber"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {/* Result count and current selection sit on one status line
                      rather than as a floating pill. */}
                  <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-edge-soft pb-2">
                    <Legend>
                      {showNoResultsMessage
                        ? `Nothing matches “${industrySearch}” — showing everything`
                        : `${displayIndustries.length} of ${INDUSTRIES.length} trades`}
                    </Legend>
                    <span aria-hidden className="hidden h-px flex-1 bg-edge-soft sm:block" />
                    {selectedIndustryLabel && (
                      <span className="flex items-center gap-2">
                        <span className="lamp lamp-on" aria-hidden />
                        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-amber">
                          {selectedIndustryLabel}
                        </span>
                      </span>
                    )}
                  </div>

                  {/* A typeset index, not a grid of icon tiles. A hundred
                      trades scan far faster as a list than as boxes. */}
                  <div className="max-h-[46vh] overflow-y-auto">
                    <ul
                      role="listbox"
                      aria-label="Trades"
                      className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3"
                    >
                      {displayIndustries.map((ind, index) => {
                        const on = selectedIndustryLabel === ind.label;
                        return (
                          <li key={`${ind.label}-${index}`}>
                            <button
                              type="button"
                              role="option"
                              aria-selected={on}
                              onClick={() => {
                                setIndustry(ind.value);
                                setSelectedIndustryLabel(ind.label);
                              }}
                              className={cn(
                                'flex w-full items-baseline gap-3 border-b border-edge-soft py-2.5 pr-2 text-left transition-colors',
                                on ? 'text-amber' : 'text-bone-dim hover:text-bone'
                              )}
                            >
                              <span
                                aria-hidden
                                className={cn(
                                  'mt-1.5 h-1.5 w-1.5 shrink-0 rounded-jack transition-colors',
                                  on ? 'bg-amber' : 'bg-edge-bright'
                                )}
                              />
                              <span className="min-w-0 flex-1 truncate text-[14px]">{ind.label}</span>
                              <span className="hidden truncate font-mono text-[10px] text-bone-faint xl:block xl:max-w-[11rem]">
                                {ind.description}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              );
            })()}

            {/* Step 3: Business Info */}
            {step === 3 && (
              <div>
                <div className="mb-8 max-w-2xl border-b border-edge-soft pb-5">
                  <h2 className="display text-[clamp(1.5rem,3.2vw,2.25rem)] mb-3">
                    Your business details
                  </h2>
                  <p className="text-bone-dim">
                    The agent answers as your business, so it needs to know who it is answering for. About two minutes of typing.
                  </p>
                </div>

                <Card className="bg-steel border-edge-soft">
                  <CardContent className="p-6 space-y-6">
                    {/* Business Details */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Building2 size={18} className="text-amber" />
                        <h3 className="font-semibold text-bone">Business Details</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Business Name *"
                          placeholder="Premier Realty Group"
                          value={businessInfo.name || ''}
                          onChange={(e) => handleBusinessInfoChange('name', e.target.value)}
                          className="bg-ink border-edge text-bone"
                        />
                        <Input
                          label="Website"
                          placeholder="https://example.com"
                          value={businessInfo.website || ''}
                          onChange={(e) => handleBusinessInfoChange('website', e.target.value)}
                          className="bg-ink border-edge text-bone"
                        />
                        <Input
                          label="Phone *"
                          placeholder="+1 (555) 123-4567"
                          value={businessInfo.phone || ''}
                          onChange={(e) => handleBusinessInfoChange('phone', e.target.value)}
                          className="bg-ink border-edge text-bone"
                        />
                        <Input
                          label="Email *"
                          type="email"
                          placeholder="contact@example.com"
                          value={businessInfo.email || ''}
                          onChange={(e) => handleBusinessInfoChange('email', e.target.value)}
                          className="bg-ink border-edge text-bone"
                        />
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <MapPin size={18} className="text-amber" />
                        <h3 className="font-semibold text-bone">Location</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Street Address"
                          placeholder="123 Main Street"
                          value={businessInfo.street || ''}
                          onChange={(e) => handleBusinessInfoChange('street', e.target.value)}
                          className="bg-ink border-edge text-bone"
                        />
                        <Input
                          label="City *"
                          placeholder="Austin"
                          value={businessInfo.city || ''}
                          onChange={(e) => handleBusinessInfoChange('city', e.target.value)}
                          className="bg-ink border-edge text-bone"
                        />
                        <Input
                          label="State *"
                          placeholder="TX"
                          value={businessInfo.state || ''}
                          onChange={(e) => handleBusinessInfoChange('state', e.target.value)}
                          className="bg-ink border-edge text-bone"
                        />
                        <Input
                          label="ZIP Code"
                          placeholder="78701"
                          value={businessInfo.zip || ''}
                          onChange={(e) => handleBusinessInfoChange('zip', e.target.value)}
                          className="bg-ink border-edge text-bone"
                        />
                      </div>
                    </div>

                    {/* Staff */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <User size={18} className="text-amber" />
                        <h3 className="font-semibold text-bone">Primary Contact</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Name *"
                          placeholder="Jennifer Hayes"
                          value={businessInfo.staffName || ''}
                          onChange={(e) => handleBusinessInfoChange('staffName', e.target.value)}
                          className="bg-ink border-edge text-bone"
                        />
                        <Input
                          label="Title *"
                          placeholder="Lead Broker & Owner"
                          value={businessInfo.staffTitle || ''}
                          onChange={(e) => handleBusinessInfoChange('staffTitle', e.target.value)}
                          className="bg-ink border-edge text-bone"
                        />
                      </div>
                    </div>

                    {/* Hours */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Clock size={18} className="text-amber" />
                        <h3 className="font-semibold text-bone">Business Hours</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                          label="Weekdays"
                          placeholder="9:00 AM - 6:00 PM"
                          value={businessInfo.weekdayHours || ''}
                          onChange={(e) => handleBusinessInfoChange('weekdayHours', e.target.value)}
                          className="bg-ink border-edge text-bone"
                        />
                        <Input
                          label="Saturday"
                          placeholder="10:00 AM - 4:00 PM"
                          value={businessInfo.saturdayHours || ''}
                          onChange={(e) => handleBusinessInfoChange('saturdayHours', e.target.value)}
                          className="bg-ink border-edge text-bone"
                        />
                        <Input
                          label="Sunday"
                          placeholder="Closed"
                          value={businessInfo.sundayHours || ''}
                          onChange={(e) => handleBusinessInfoChange('sundayHours', e.target.value)}
                          className="bg-ink border-edge text-bone"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 4: API Keys */}
            {step === 4 && (
              <div>
                <div className="mb-8 max-w-2xl border-b border-edge-soft pb-5">
                  <h2 className="display text-[clamp(1.5rem,3.2vw,2.25rem)] mb-3">
                    Your API keys
                  </h2>
                  <p className="text-bone-dim">
                    OpenAI writes the content, ElevenLabs supplies the voice. Both keys stay in this browser and never reach our servers.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* OpenAI - Required */}
                  <Card className="bg-steel border-edge-soft">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Key size={18} className="text-amber" />
                          <h3 className="font-semibold text-bone">AI Content Generation</h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowOpenAIHelp(!showOpenAIHelp)}
                          className="flex items-center gap-1 text-xs text-amber hover:text-amber transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                            <path d="M12 17h.01"></path>
                          </svg>
                          How to get API Key
                        </button>
                      </div>

                      {/* OpenAI Help Guide */}
                      {showOpenAIHelp && (
                        <div className="mb-4 p-4 bg-amber-shadow border border-amber/40 rounded-panel">
                          <h4 className="text-sm font-semibold text-amber mb-2">How to get your OpenAI API Key:</h4>
                          <ol className="text-sm text-bone-dim space-y-2 list-decimal list-inside">
                            <li>Go to <a href="https://platform.openai.com" target="_blank" rel="noopener noreferrer" className="text-amber hover:underline">platform.openai.com</a></li>
                            <li>Sign in or create an account</li>
                            <li>Click on your profile icon (top right) → "View API keys"</li>
                            <li>Click "Create new secret key"</li>
                            <li>Copy the key (starts with <code className="bg-steel px-1 rounded-panel">sk-</code>)</li>
                            <li>Add billing details if you haven't already</li>
                          </ol>
                          <p className="text-xs text-bone-dim mt-3">
                            Note: You need to add payment method and have credits to use the API.
                          </p>
                        </div>
                      )}

                      <Input
                        label="OpenAI API Key *"
                        type="password"
                        placeholder="sk-..."
                        hint="Used for AI content generation"
                        value={apiKeys.openaiKey || ''}
                        onChange={(e) => handleAPIKeyChange('openaiKey', e.target.value)}
                        className="bg-ink border-edge text-bone"
                      />
                    </CardContent>
                  </Card>

                  {/* ElevenLabs */}
                  <Card className="bg-steel border-edge-soft">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Sparkles size={18} className="text-patina-glow" />
                          <h3 className="font-semibold text-bone">Voice Agent Setup</h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowElevenLabsHelp(!showElevenLabsHelp)}
                          className="flex items-center gap-1 text-xs text-amber hover:text-amber transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                            <path d="M12 17h.01"></path>
                          </svg>
                          How to get API Key
                        </button>
                      </div>

                      {/* ElevenLabs Help Guide */}
                      {showElevenLabsHelp && (
                        <div className="mb-4 p-4 bg-patina-shadow border border-patina/40 rounded-panel">
                          <h4 className="text-sm font-semibold text-patina-glow mb-2">How to get your ElevenLabs API Key:</h4>
                          <ol className="text-sm text-bone-dim space-y-2 list-decimal list-inside">
                            <li>Go to <a href="https://elevenlabs.io" target="_blank" rel="noopener noreferrer" className="text-patina-glow hover:underline">elevenlabs.io</a></li>
                            <li>Sign in or create an account</li>
                            <li>Click on your profile icon (bottom left)</li>
                            <li>Select "Profile + API key"</li>
                            <li>Copy your API key (starts with <code className="bg-steel px-1 rounded-panel">sk_</code>)</li>
                          </ol>
                          <p className="text-xs text-bone-dim mt-3">
                            Note: Free tier has limited usage. Upgrade for more minutes.
                          </p>
                        </div>
                      )}

                      <div className="p-3 bg-patina-shadow border border-patina/40 rounded-panel mb-4">
                        <p className="text-sm text-bone-dim">
                          We'll automatically create a voice agent configured with your business info and prompts.
                        </p>
                      </div>

                      <Input
                        label="ElevenLabs API Key *"
                        type="password"
                        placeholder="sk_..."
                        hint="Your API key from elevenlabs.io"
                        value={apiKeys.elevenLabsApiKey || ''}
                        onChange={(e) => handleAPIKeyChange('elevenLabsApiKey', e.target.value)}
                        className="bg-ink border-edge text-bone"
                      />

                      {/* n8n Webhook Tools */}
                      <div className="mt-6 pt-4 border-t border-edge-soft">
                        <div className="flex items-center gap-2 mb-3">
                          <Webhook size={16} className="text-orange-400" />
                          <h4 className="text-sm font-medium text-bone">n8n Webhook Tools (Optional)</h4>
                        </div>
                        <p className="text-xs text-bone-dim mb-4">
                          Add your n8n webhook URLs to enable the agent to check availability and book appointments.
                        </p>

                        <div className="space-y-3">
                          {/* Check History Tool */}
                          <div className="flex items-start gap-3 p-3 bg-ink/50 rounded-panel">
                            <History size={18} className="text-amber mt-2 flex-shrink-0" />
                            <div className="flex-1">
                              <label className="text-sm font-medium text-bone block mb-1">
                                Check History
                              </label>
                              <Input
                                placeholder="https://your-n8n.com/webhook/check-history"
                                value={webhookTools.find((t) => t.id === 'check_history')?.url || ''}
                                onChange={(e) => handleWebhookToolChange('check_history', 'url', e.target.value)}
                                className="bg-steel border-edge text-bone text-sm"
                              />
                              <p className="text-xs text-bone-faint mt-1">
                                Fetches customer/patient history from your database
                              </p>
                            </div>
                          </div>

                          {/* Check Availability Tool */}
                          <div className="flex items-start gap-3 p-3 bg-ink/50 rounded-panel">
                            <Calendar size={18} className="text-patina-glow mt-2 flex-shrink-0" />
                            <div className="flex-1">
                              <label className="text-sm font-medium text-bone block mb-1">
                                Check Availability
                              </label>
                              <Input
                                placeholder="https://your-n8n.com/webhook/check-availability"
                                value={webhookTools.find((t) => t.id === 'check_availability')?.url || ''}
                                onChange={(e) => handleWebhookToolChange('check_availability', 'url', e.target.value)}
                                className="bg-steel border-edge text-bone text-sm"
                              />
                              <p className="text-xs text-bone-faint mt-1">
                                Checks available appointment slots based on date/time
                              </p>
                            </div>
                          </div>

                          {/* Book Appointment Tool */}
                          <div className="flex items-start gap-3 p-3 bg-ink/50 rounded-panel">
                            <CalendarCheck size={18} className="text-patina-glow mt-2 flex-shrink-0" />
                            <div className="flex-1">
                              <label className="text-sm font-medium text-bone block mb-1">
                                Book Appointment
                              </label>
                              <Input
                                placeholder="https://your-n8n.com/webhook/book-appointment"
                                value={webhookTools.find((t) => t.id === 'book_appointment')?.url || ''}
                                onChange={(e) => handleWebhookToolChange('book_appointment', 'url', e.target.value)}
                                className="bg-steel border-edge text-bone text-sm"
                              />
                              <p className="text-xs text-bone-faint mt-1">
                                Books an appointment with customer details
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Step 5: Generate & Review */}
            {step === 5 && (
              <div>
                <div className="mb-8 max-w-2xl border-b border-edge-soft pb-5">
                  <h2 className="display text-[clamp(1.5rem,3.2vw,2.25rem)] mb-3">
                    {generatedConfig ? 'Check it over' : 'Generate your AI content'}
                  </h2>
                  <p className="text-bone-dim">
                    {generatedConfig
                      ? 'Everything below is editable, including what the agent says and what it refuses to promise.'
                      : 'Our AI will create personalized content for your business'}
                  </p>
                </div>

                {!generatedConfig && !isGenerating && (
                  <Card className="bg-steel border-edge-soft">
                    <CardContent className="p-12 text-center">
                      <div className="w-20 h-20 rounded-full bg-amber text-ink flex items-center justify-center mx-auto mb-6">
                        <Sparkles className="w-10 h-10 text-bone" />
                      </div>
                      <h3 className="text-xl font-semibold text-bone mb-2">
                        Ready to generate?
                      </h3>
                      <p className="text-bone-dim mb-6 max-w-md mx-auto">
                        We'll use AI to create a customized website, voice agent prompts,
                        services, FAQs, and branding for {businessInfo.name}.
                      </p>
                      {error && (
                        <div className="mb-6 p-4 bg-clip/10 border border-clip-deep rounded-panel text-clip text-sm">
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
                  <Card className="bg-steel border-edge-soft">
                    <CardContent className="p-12 text-center">
                      <Loader2 className="w-16 h-16 text-amber animate-spin mx-auto mb-6" />
                      <h3 className="text-xl font-semibold text-bone mb-2">
                        Generating your content...
                      </h3>
                      <p className="text-bone-dim">
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
            className="text-bone-dim hover:text-bone"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back
          </Button>

          {step < 5 && (
            <Button
              onClick={nextStep}
              disabled={
                (step === 1 && !isStep1Valid) ||
                (step === 2 && !isStep2Valid) ||
                (step === 3 && !isStep3Valid) ||
                (step === 4 && !isStep4Valid)
              }
            >
              Continue
              <ArrowRight size={18} className="ml-2" />
            </Button>
          )}

          {step === 5 && generatedConfig && (
            <div className="flex flex-col items-end gap-2">
              {agentCreationError && (
                <div className="text-sm text-clip bg-clip/10 border border-clip-deep rounded-panel px-4 py-2">
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
