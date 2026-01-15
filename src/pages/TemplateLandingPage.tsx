/**
 * Template Landing Page
 * Professional marketing page for Voice Agent One
 * Features: Hero, Features, Pricing, Testimonials, Roadmap, FAQ, Integrations
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Phone,
  Calendar,
  BarChart3,
  Sparkles,
  Check,
  ArrowRight,
  Play,
  Building2,
  Stethoscope,
  Scissors,
  Dumbbell,
  Home,
  UtensilsCrossed,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Star,
  Shield,
  Clock,
  Globe,
  MessageSquare,
  Users,
  Palette,
  FileText,
  Bot,
  Mic,
  Headphones,
  Workflow,
  Database,
  Lock,
  Rocket,
  Gift,
  Crown,
  Gem,
  Layers,
  Settings,
  RefreshCw,
  PhoneCall,
  Mail,
  Github,
  Twitter,
  Linkedin,
  CheckCircle2,
  Circle,
  Quote,
  PawPrint,
  Scale,
  Calculator,
  Car,
  Camera,
  Briefcase,
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
  Key,
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
  Search,
  Monitor,
  Megaphone,
  Stamp,
  Glasses,
  Plus,
  Code,
  Terminal,
} from 'lucide-react';
import { cn } from '../utils/cn';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7 } },
};

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7 } },
};

export const TemplateLandingPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showAllIndustries, setShowAllIndustries] = useState(false);

  const steps = [
    {
      number: '01',
      title: 'Pick Your Industry',
      description: 'Choose from 14+ pre-configured industries with smart defaults, terminology, and color schemes.',
      icon: Building2,
      color: 'from-blue-500 to-cyan-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      number: '02',
      title: 'Add Business Info',
      description: 'Enter your name, contact, hours, and team details. Takes about 2 minutes.',
      icon: FileText,
      color: 'from-violet-500 to-purple-400',
      bgColor: 'bg-violet-500/10',
    },
    {
      number: '03',
      title: 'AI Creates Everything',
      description: 'GPT-4 generates website content, services, FAQs, voice prompts, and knowledge base.',
      icon: Sparkles,
      color: 'from-amber-500 to-yellow-400',
      bgColor: 'bg-amber-500/10',
    },
    {
      number: '04',
      title: 'Review & Customize',
      description: 'Fine-tune anything. Add custom knowledge, edit branding, adjust voice personality.',
      icon: Palette,
      color: 'from-emerald-500 to-green-400',
      bgColor: 'bg-emerald-500/10',
    },
    {
      number: '05',
      title: 'Launch & Go Live',
      description: 'Your AI-powered website with voice booking is ready. Deploy anywhere instantly.',
      icon: Rocket,
      color: 'from-rose-500 to-pink-400',
      bgColor: 'bg-rose-500/10',
    },
  ];

  const features = [
    {
      icon: Bot,
      title: '24/7 AI Voice Agent',
      description: 'Never miss a call. Your AI assistant handles inquiries, books appointments, and answers questions around the clock.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Sparkles,
      title: 'AI-Generated Content',
      description: 'GPT-4 creates your entire website - taglines, services, FAQs, testimonials, and detailed voice agent prompts.',
      gradient: 'from-violet-500 to-purple-500',
    },
    {
      icon: Palette,
      title: 'Dynamic Branding',
      description: 'Colors, typography, and style automatically adapt to your industry. Full customization control available.',
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      icon: Calendar,
      title: 'Smart Booking System',
      description: 'Integrated calendar with Google Calendar sync. Voice agent checks availability and books in real-time.',
      gradient: 'from-emerald-500 to-green-500',
    },
    {
      icon: Database,
      title: 'Customer Database',
      description: 'Track customer history, preferences, and past appointments. Voice agent remembers returning customers.',
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Track calls, bookings, and engagement metrics. Understand what\'s working and optimize performance.',
      gradient: 'from-cyan-500 to-blue-500',
    },
    {
      icon: Workflow,
      title: 'n8n Integration',
      description: 'Connect to your existing tools via webhooks. Automate workflows with powerful n8n integration.',
      gradient: 'from-red-500 to-rose-500',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Your data is safe with enterprise-grade security. API keys stored locally, no data sent to third parties.',
      gradient: 'from-slate-500 to-gray-500',
    },
  ];

  // Comprehensive list of 50+ industries
  const allIndustries = [
    // Healthcare & Medical (12)
    { icon: Stethoscope, name: 'Healthcare', color: 'bg-blue-500', description: 'Medical Clinics', category: 'Healthcare' },
    { icon: Smile, name: 'Dental', color: 'bg-cyan-500', description: 'Dentists & Orthodontics', category: 'Healthcare' },
    { icon: Bone, name: 'Chiropractic', color: 'bg-teal-500', description: 'Spine & Joint Care', category: 'Healthcare' },
    { icon: Activity, name: 'Physical Therapy', color: 'bg-green-500', description: 'Rehabilitation', category: 'Healthcare' },
    { icon: Brain, name: 'Mental Health', color: 'bg-purple-500', description: 'Therapy & Counseling', category: 'Healthcare' },
    { icon: Eye, name: 'Optometry', color: 'bg-indigo-500', description: 'Eye Care & Vision', category: 'Healthcare' },
    { icon: Baby, name: 'Pediatrics', color: 'bg-pink-400', description: 'Child Healthcare', category: 'Healthcare' },
    { icon: Heart, name: 'Cardiology', color: 'bg-red-500', description: 'Heart Specialists', category: 'Healthcare' },
    { icon: Flower2, name: 'Dermatology', color: 'bg-rose-400', description: 'Skin Care', category: 'Healthcare' },
    { icon: HeartPulse, name: 'Urgent Care', color: 'bg-red-600', description: 'Walk-in Clinics', category: 'Healthcare' },
    { icon: Syringe, name: 'Med Spa', color: 'bg-fuchsia-500', description: 'Medical Aesthetics', category: 'Healthcare' },
    { icon: HeartPulse, name: 'Home Healthcare', color: 'bg-sky-500', description: 'In-Home Care', category: 'Healthcare' },

    // Beauty & Wellness (8)
    { icon: Scissors, name: 'Salon & Spa', color: 'bg-pink-500', description: 'Beauty Services', category: 'Beauty' },
    { icon: Scissors, name: 'Hair Salon', color: 'bg-amber-500', description: 'Hair Styling', category: 'Beauty' },
    { icon: Hand, name: 'Nail Salon', color: 'bg-rose-500', description: 'Manicure & Pedicure', category: 'Beauty' },
    { icon: Scissors, name: 'Barbershop', color: 'bg-slate-600', description: 'Men\'s Grooming', category: 'Beauty' },
    { icon: Flower2, name: 'Massage Therapy', color: 'bg-emerald-500', description: 'Relaxation & Healing', category: 'Beauty' },
    { icon: PenTool, name: 'Tattoo & Piercing', color: 'bg-gray-700', description: 'Body Art', category: 'Beauty' },
    { icon: Sparkles, name: 'Skincare', color: 'bg-pink-400', description: 'Facials & Esthetics', category: 'Beauty' },
    { icon: Palette, name: 'Makeup Artist', color: 'bg-fuchsia-500', description: 'Beauty Styling', category: 'Beauty' },

    // Fitness & Sports (8)
    { icon: Dumbbell, name: 'Fitness', color: 'bg-orange-500', description: 'Gyms & Training', category: 'Fitness' },
    { icon: PersonStanding, name: 'Personal Training', color: 'bg-orange-600', description: 'One-on-One Fitness', category: 'Fitness' },
    { icon: Accessibility, name: 'Yoga Studio', color: 'bg-violet-500', description: 'Mind & Body', category: 'Fitness' },
    { icon: Activity, name: 'Pilates', color: 'bg-teal-500', description: 'Core Training', category: 'Fitness' },
    { icon: Award, name: 'Martial Arts', color: 'bg-red-600', description: 'Combat Training', category: 'Fitness' },
    { icon: Music, name: 'Dance Studio', color: 'bg-pink-500', description: 'Dance Classes', category: 'Fitness' },
    { icon: Trophy, name: 'Sports Coaching', color: 'bg-amber-500', description: 'Athletic Training', category: 'Fitness' },
    { icon: Mountain, name: 'Outdoor Adventures', color: 'bg-green-600', description: 'Hiking & Climbing', category: 'Fitness' },

    // Professional Services (10)
    { icon: Scale, name: 'Legal', color: 'bg-slate-600', description: 'Law Firms', category: 'Professional' },
    { icon: Calculator, name: 'Accounting', color: 'bg-emerald-600', description: 'CPA & Bookkeeping', category: 'Professional' },
    { icon: Briefcase, name: 'Consulting', color: 'bg-blue-600', description: 'Business Advisory', category: 'Professional' },
    { icon: LineChart, name: 'Financial Advisor', color: 'bg-green-600', description: 'Wealth Management', category: 'Professional' },
    { icon: Shield, name: 'Insurance', color: 'bg-indigo-600', description: 'Insurance Agency', category: 'Professional' },
    { icon: Receipt, name: 'Tax Preparation', color: 'bg-emerald-500', description: 'Tax Services', category: 'Professional' },
    { icon: Stamp, name: 'Notary', color: 'bg-amber-600', description: 'Document Services', category: 'Professional' },
    { icon: Languages, name: 'Translation', color: 'bg-cyan-600', description: 'Language Services', category: 'Professional' },
    { icon: Users, name: 'HR Consulting', color: 'bg-purple-600', description: 'Human Resources', category: 'Professional' },
    { icon: Users, name: 'Recruiting', color: 'bg-blue-500', description: 'Talent Acquisition', category: 'Professional' },

    // Real Estate & Property (6)
    { icon: Home, name: 'Real Estate', color: 'bg-indigo-500', description: 'Agents & Brokers', category: 'Real Estate' },
    { icon: Building, name: 'Property Management', color: 'bg-slate-500', description: 'Rental Management', category: 'Real Estate' },
    { icon: Search, name: 'Home Inspection', color: 'bg-yellow-600', description: 'Property Inspection', category: 'Real Estate' },
    { icon: Banknote, name: 'Mortgage Broker', color: 'bg-green-500', description: 'Home Loans', category: 'Real Estate' },
    { icon: Armchair, name: 'Interior Design', color: 'bg-rose-500', description: 'Home Styling', category: 'Real Estate' },
    { icon: Sofa, name: 'Home Staging', color: 'bg-amber-500', description: 'Property Staging', category: 'Real Estate' },

    // Automotive (6)
    { icon: Car, name: 'Auto Repair', color: 'bg-yellow-500', description: 'Mechanic Services', category: 'Automotive' },
    { icon: Sparkles, name: 'Car Detailing', color: 'bg-blue-500', description: 'Auto Detailing', category: 'Automotive' },
    { icon: Wrench, name: 'Auto Body Shop', color: 'bg-orange-600', description: 'Collision Repair', category: 'Automotive' },
    { icon: Circle, name: 'Tire Shop', color: 'bg-gray-600', description: 'Tires & Wheels', category: 'Automotive' },
    { icon: Droplets, name: 'Oil Change', color: 'bg-amber-600', description: 'Quick Lube', category: 'Automotive' },
    { icon: Waves, name: 'Car Wash', color: 'bg-cyan-500', description: 'Auto Cleaning', category: 'Automotive' },

    // Home Services (14)
    { icon: Thermometer, name: 'HVAC', color: 'bg-blue-600', description: 'Heating & Cooling', category: 'Home Services' },
    { icon: Droplets, name: 'Plumbing', color: 'bg-blue-500', description: 'Plumber Services', category: 'Home Services' },
    { icon: Lightbulb, name: 'Electrical', color: 'bg-yellow-500', description: 'Electrician', category: 'Home Services' },
    { icon: Home, name: 'Roofing', color: 'bg-orange-600', description: 'Roof Repair', category: 'Home Services' },
    { icon: TreePine, name: 'Landscaping', color: 'bg-green-600', description: 'Lawn & Garden', category: 'Home Services' },
    { icon: Waves, name: 'Pool Service', color: 'bg-cyan-500', description: 'Pool Maintenance', category: 'Home Services' },
    { icon: Bug, name: 'Pest Control', color: 'bg-red-600', description: 'Exterminator', category: 'Home Services' },
    { icon: Sparkles, name: 'Cleaning Services', color: 'bg-teal-500', description: 'House Cleaning', category: 'Home Services' },
    { icon: Hammer, name: 'Handyman', color: 'bg-amber-600', description: 'Home Repairs', category: 'Home Services' },
    { icon: Paintbrush, name: 'Painting', color: 'bg-purple-500', description: 'House Painting', category: 'Home Services' },
    { icon: Layers, name: 'Flooring', color: 'bg-amber-700', description: 'Floor Installation', category: 'Home Services' },
    { icon: Glasses, name: 'Window Cleaning', color: 'bg-sky-500', description: 'Glass Cleaning', category: 'Home Services' },
    { icon: Key, name: 'Locksmith', color: 'bg-slate-600', description: 'Lock Services', category: 'Home Services' },
    { icon: Home, name: 'Garage Door', color: 'bg-gray-600', description: 'Door Repair', category: 'Home Services' },

    // Pet Services (6)
    { icon: PawPrint, name: 'Veterinary', color: 'bg-green-500', description: 'Animal Hospital', category: 'Pet Services' },
    { icon: Dog, name: 'Pet Grooming', color: 'bg-pink-500', description: 'Dog & Cat Grooming', category: 'Pet Services' },
    { icon: Award, name: 'Dog Training', color: 'bg-amber-500', description: 'Pet Training', category: 'Pet Services' },
    { icon: Home, name: 'Pet Boarding', color: 'bg-green-600', description: 'Kennels & Daycare', category: 'Pet Services' },
    { icon: Heart, name: 'Pet Sitting', color: 'bg-rose-500', description: 'In-Home Pet Care', category: 'Pet Services' },
    { icon: Footprints, name: 'Dog Walking', color: 'bg-orange-500', description: 'Pet Walking', category: 'Pet Services' },

    // Food & Hospitality (8)
    { icon: UtensilsCrossed, name: 'Restaurant', color: 'bg-red-500', description: 'Dining & Takeout', category: 'Food' },
    { icon: Utensils, name: 'Catering', color: 'bg-orange-500', description: 'Event Catering', category: 'Food' },
    { icon: Cake, name: 'Bakery', color: 'bg-pink-400', description: 'Baked Goods', category: 'Food' },
    { icon: Truck, name: 'Food Truck', color: 'bg-yellow-500', description: 'Mobile Dining', category: 'Food' },
    { icon: Coffee, name: 'Coffee Shop', color: 'bg-amber-700', description: 'Cafe & Coffee', category: 'Food' },
    { icon: Wine, name: 'Bar & Lounge', color: 'bg-purple-600', description: 'Nightlife', category: 'Food' },
    { icon: PartyPopper, name: 'Event Venue', color: 'bg-fuchsia-500', description: 'Party Venues', category: 'Food' },
    { icon: Bed, name: 'Hotel & B&B', color: 'bg-indigo-500', description: 'Accommodation', category: 'Food' },

    // Education & Tutoring (8)
    { icon: GraduationCap, name: 'Tutoring', color: 'bg-blue-500', description: 'Academic Help', category: 'Education' },
    { icon: Music, name: 'Music Lessons', color: 'bg-purple-500', description: 'Instrument Training', category: 'Education' },
    { icon: Palette, name: 'Art Classes', color: 'bg-pink-500', description: 'Creative Learning', category: 'Education' },
    { icon: Languages, name: 'Language School', color: 'bg-cyan-500', description: 'Language Learning', category: 'Education' },
    { icon: Car, name: 'Driving School', color: 'bg-yellow-500', description: 'Driver Education', category: 'Education' },
    { icon: BookOpen, name: 'Test Prep', color: 'bg-indigo-500', description: 'Exam Preparation', category: 'Education' },
    { icon: Baby, name: 'Daycare', color: 'bg-pink-400', description: 'Childcare Center', category: 'Education' },
    { icon: School, name: 'After School', color: 'bg-green-500', description: 'Youth Programs', category: 'Education' },

    // Events & Entertainment (8)
    { icon: Camera, name: 'Photography', color: 'bg-purple-500', description: 'Photo Studios', category: 'Events' },
    { icon: Video, name: 'Videography', color: 'bg-red-500', description: 'Video Production', category: 'Events' },
    { icon: Music, name: 'DJ Services', color: 'bg-fuchsia-500', description: 'Event DJs', category: 'Events' },
    { icon: PartyPopper, name: 'Event Planning', color: 'bg-pink-500', description: 'Event Coordinators', category: 'Events' },
    { icon: Heart, name: 'Wedding Planner', color: 'bg-rose-500', description: 'Wedding Services', category: 'Events' },
    { icon: Gift, name: 'Party Rentals', color: 'bg-amber-500', description: 'Equipment Rental', category: 'Events' },
    { icon: Flower2, name: 'Florist', color: 'bg-green-500', description: 'Floral Design', category: 'Events' },
    { icon: Star, name: 'Entertainment', color: 'bg-purple-600', description: 'Performers & Acts', category: 'Events' },

    // Tech & Creative (6)
    { icon: Monitor, name: 'IT Support', color: 'bg-blue-600', description: 'Tech Services', category: 'Tech' },
    { icon: Globe, name: 'Web Design', color: 'bg-indigo-500', description: 'Website Development', category: 'Tech' },
    { icon: Palette, name: 'Graphic Design', color: 'bg-pink-500', description: 'Visual Design', category: 'Tech' },
    { icon: Megaphone, name: 'Marketing Agency', color: 'bg-orange-500', description: 'Digital Marketing', category: 'Tech' },
    { icon: Printer, name: 'Print Shop', color: 'bg-gray-600', description: 'Printing Services', category: 'Tech' },
    { icon: Mic, name: 'Recording Studio', color: 'bg-purple-600', description: 'Audio Production', category: 'Tech' },

    // Personal Services (8)
    { icon: Compass, name: 'Life Coaching', color: 'bg-teal-500', description: 'Personal Growth', category: 'Personal' },
    { icon: Briefcase, name: 'Career Coaching', color: 'bg-blue-500', description: 'Job Coaching', category: 'Personal' },
    { icon: Shirt, name: 'Personal Styling', color: 'bg-pink-500', description: 'Fashion Consulting', category: 'Personal' },
    { icon: Scissors, name: 'Tailor', color: 'bg-indigo-500', description: 'Alterations', category: 'Personal' },
    { icon: Watch, name: 'Watch Repair', color: 'bg-amber-600', description: 'Timepiece Service', category: 'Personal' },
    { icon: Gem, name: 'Jewelry Repair', color: 'bg-yellow-500', description: 'Jewelry Service', category: 'Personal' },
    { icon: Footprints, name: 'Shoe Repair', color: 'bg-amber-700', description: 'Cobbler Services', category: 'Personal' },
    { icon: Sparkles, name: 'Dry Cleaning', color: 'bg-cyan-500', description: 'Laundry Services', category: 'Personal' },

    // Travel & Transportation (6)
    { icon: Plane, name: 'Travel Agency', color: 'bg-sky-500', description: 'Travel Planning', category: 'Travel' },
    { icon: Map, name: 'Tour Guide', color: 'bg-green-500', description: 'Guided Tours', category: 'Travel' },
    { icon: Car, name: 'Limo Service', color: 'bg-slate-700', description: 'Luxury Transport', category: 'Travel' },
    { icon: Bus, name: 'Airport Shuttle', color: 'bg-blue-500', description: 'Transportation', category: 'Travel' },
    { icon: Truck, name: 'Moving Services', color: 'bg-orange-600', description: 'Relocation', category: 'Travel' },
    { icon: Package, name: 'Courier Service', color: 'bg-amber-500', description: 'Delivery Services', category: 'Travel' },

    // Other Services (6)
    { icon: Heart, name: 'Funeral Services', color: 'bg-gray-700', description: 'Memorial Services', category: 'Other' },
    { icon: Warehouse, name: 'Storage Facility', color: 'bg-slate-500', description: 'Self Storage', category: 'Other' },
    { icon: HardHat, name: 'Construction', color: 'bg-yellow-600', description: 'General Contractor', category: 'Other' },
    { icon: Factory, name: 'Manufacturing', color: 'bg-gray-600', description: 'Custom Manufacturing', category: 'Other' },
    { icon: Anchor, name: 'Marine Services', color: 'bg-blue-600', description: 'Boat Repair', category: 'Other' },
    { icon: Gamepad2, name: 'Gaming Lounge', color: 'bg-purple-500', description: 'Entertainment', category: 'Other' },
  ];

  // Show first 12 industries when collapsed, all when expanded
  const visibleIndustries = showAllIndustries ? allIndustries : allIndustries.slice(0, 11);
  const remainingCount = allIndustries.length - 11;

  const stats = [
    { value: '5', suffix: 'min', label: 'Setup Time', icon: Clock },
    { value: '24', suffix: '/7', label: 'Availability', icon: Headphones },
    { value: '100', suffix: '+', label: 'Industries', icon: Building2 },
    { value: '100', suffix: '%', label: 'Customizable', icon: Settings },
  ];

  const pricingPlans = [
    {
      name: 'Voice Agent Only',
      description: 'Embed AI voice agent on your existing website',
      price: { monthly: 500, yearly: 400 },
      features: [
        '1 AI Voice Agent',
        'Embed code for any website',
        'React, Next.js, Shopify support',
        '500 calls/month',
        'Test & edit dashboard',
        'Basic analytics',
        'Email support',
        'Standard voice models',
      ],
      cta: 'Get Voice Agent',
      highlighted: false,
      icon: Bot,
      gradient: 'from-purple-500 to-violet-500',
      badge: 'New',
    },
    {
      name: 'Website + Agent',
      description: 'Complete AI-powered website with voice assistant',
      price: { monthly: 1500, yearly: 1200 },
      features: [
        'AI-generated landing page',
        '1 Voice Agent included',
        'Public shareable URL',
        'Unlimited calls',
        'Unlimited knowledge base',
        'n8n webhook integration',
        'Priority support (24h)',
        'Premium voice models',
      ],
      cta: 'Start Free Trial',
      highlighted: true,
      badge: 'Most Popular',
      icon: Crown,
      gradient: 'from-blue-500 to-purple-500',
    },
    {
      name: 'Enterprise',
      description: 'For large organizations with custom needs',
      price: { monthly: 4000, yearly: 3200 },
      features: [
        'Everything in Website + Agent',
        'Multiple voice agents',
        'Multi-location support',
        'Custom API integrations',
        'Dedicated account manager',
        '99.9% SLA guarantee',
        'White-label solution',
        'Custom AI training',
      ],
      cta: 'Contact Sales',
      highlighted: false,
      icon: Gem,
      gradient: 'from-amber-500 to-orange-500',
    },
  ];

  const testimonials = [
    {
      content: "Voice Agent One transformed our clinic. We went from missing 40% of calls to booking 95% of appointment requests. The AI sounds incredibly natural - patients often don't realize they're talking to AI!",
      author: 'Dr. Sarah Chen',
      role: 'Owner, Wellness Medical Center',
      avatar: 'SC',
      rating: 5,
      industry: 'Healthcare',
    },
    {
      content: "Setup was unbelievably fast. I had my real estate voice agent live in under 10 minutes. It handles showing requests, answers questions about listings, and even follows up with leads automatically.",
      author: 'Michael Rodriguez',
      role: 'Broker, Premier Realty',
      avatar: 'MR',
      rating: 5,
      industry: 'Real Estate',
    },
    {
      content: "As a solo practitioner, I couldn't afford a receptionist. Now my AI assistant handles everything - appointment booking, rescheduling, even answering common questions about our services.",
      author: 'Jennifer Park',
      role: 'Owner, Zen Wellness Spa',
      avatar: 'JP',
      rating: 5,
      industry: 'Spa & Wellness',
    },
  ];

  const roadmapItems = [
    {
      quarter: 'Q1 2025',
      status: 'completed',
      title: 'Foundation Release',
      items: ['14+ industry templates', 'AI content generation', 'ElevenLabs voice integration', 'Basic analytics dashboard'],
    },
    {
      quarter: 'Q2 2025',
      status: 'in-progress',
      title: 'Integration Expansion',
      items: ['n8n webhook support', 'Google Calendar sync', 'Customer database', 'Multi-language support'],
    },
    {
      quarter: 'Q3 2025',
      status: 'planned',
      title: 'Advanced Features',
      items: ['SMS notifications', 'Payment processing', 'Multi-location support', 'Team collaboration'],
    },
    {
      quarter: 'Q4 2025',
      status: 'planned',
      title: 'Enterprise & Scale',
      items: ['White-label solution', 'Custom AI training', 'API access', 'Enterprise SSO'],
    },
  ];

  const integrations = [
    { name: 'ElevenLabs', description: 'Voice AI', icon: Mic, color: 'bg-purple-500' },
    { name: 'OpenAI', description: 'GPT-4', icon: Sparkles, color: 'bg-green-500' },
    { name: 'Google Calendar', description: 'Scheduling', icon: Calendar, color: 'bg-blue-500' },
    { name: 'n8n', description: 'Automation', icon: Workflow, color: 'bg-orange-500' },
    { name: 'Supabase', description: 'Database', icon: Database, color: 'bg-emerald-500' },
    { name: 'Vercel', description: 'Hosting', icon: Globe, color: 'bg-slate-500' },
  ];

  const faqs = [
    {
      question: 'How does the AI voice agent work?',
      answer: 'The voice agent uses ElevenLabs\' conversational AI technology. When a customer calls or clicks to talk, they\'re connected to an AI that sounds natural and human-like. The AI is trained on your business information, services, and FAQs to provide accurate, helpful responses and can book appointments directly into your calendar.',
    },
    {
      question: 'Do I need technical skills to set this up?',
      answer: 'Not at all! Voice Agent One is designed for non-technical users. The setup wizard guides you through each step - just enter your business info and the AI generates everything else. No coding, no design skills, no technical knowledge required.',
    },
    {
      question: 'What happens after the free trial?',
      answer: 'The Starter plan is always free with 100 calls per month. If you need unlimited calls, webhook integrations, or advanced features, you can upgrade to Professional. There\'s no obligation to upgrade, and you can downgrade anytime.',
    },
    {
      question: 'Can I customize the voice agent\'s personality?',
      answer: 'Absolutely! You can adjust the voice agent\'s name, personality traits, speaking style, and even specific phrases it uses. The AI-generated prompts are fully editable, and you can add custom knowledge base entries for specific questions.',
    },
    {
      question: 'How do I integrate with my existing calendar?',
      answer: 'Voice Agent One integrates directly with Google Calendar through our n8n webhook system. When the voice agent books an appointment, it automatically checks availability and creates the event in your calendar, sending confirmation emails to both you and your customer.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, security is a top priority. API keys are stored locally in your browser (never on our servers). Customer data is encrypted at rest and in transit. We don\'t sell or share your data with third parties. Enterprise customers get additional security features like SSO and audit logs.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#030014] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '100px 100px',
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/5 backdrop-blur-xl bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-lg opacity-50" />
                <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
              <span className="font-bold text-xl tracking-tight">Voice Agent One</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#demo" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                Demo
              </a>
              <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                How It Works
              </a>
              <a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                Features
              </a>
              <a href="#pricing" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                Pricing
              </a>
              <a href="#book" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                Book a Call
              </a>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/setup" className="hidden sm:block text-gray-400 hover:text-white transition-colors text-sm font-medium">
                Sign In
              </Link>
              <Link to="/setup">
                <button className="group relative px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-medium text-sm hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center gap-2 overflow-hidden">
                  <span className="relative z-10">Get Started</span>
                  <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="text-center max-w-5xl mx-auto"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp} className="mb-8">
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 text-sm font-medium backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Powered by ElevenLabs + GPT-4
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeInUp}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[0.95] tracking-tight"
            >
              <span className="block">Build Your</span>
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                AI-Powered
              </span>
              <span className="block">Business in Minutes</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Get a complete AI-powered website OR just the voice agent to embed on your existing site.
              Books appointments, answers questions, and works 24/7.
              <span className="text-white font-medium"> Setup in 5 minutes. No coding required.</span>
            </motion.p>

            {/* Two Options */}
            <motion.div variants={fadeInUp} className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
              <Link to="/setup" className="group">
                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10 hover:border-blue-500/50 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Globe size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Website + Agent</h3>
                      <p className="text-xs text-gray-500">Full landing page included</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">Complete AI-powered website with voice booking. Perfect for new businesses.</p>
                  <div className="flex items-center gap-2 text-blue-400 font-medium text-sm group-hover:gap-3 transition-all">
                    Get Started <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
              <Link to="/setup" className="group">
                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-violet-500/10 border border-white/10 hover:border-purple-500/50 transition-all">
                  <div className="absolute top-3 right-3 px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs font-medium rounded-full">
                    New
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                      <Bot size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Voice Agent Only</h3>
                      <p className="text-xs text-gray-500">Embed on any website</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">Get embed code for React, Next.js, Shopify, or any HTML site. 2-minute setup.</p>
                  <div className="flex items-center gap-2 text-purple-400 font-medium text-sm group-hover:gap-3 transition-all">
                    Get Voice Agent <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Demo Button */}
            <motion.div variants={fadeInUp} className="flex justify-center mb-8">
              <a href="#demo">
                <button className="group px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-medium hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-3 backdrop-blur-sm">
                  <Play size={20} className="text-red-400" />
                  Watch Demo
                </button>
              </a>
            </motion.div>

            {/* Trust Badges */}
            <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-green-500" />
                No credit card required
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-green-500" />
                5-minute setup
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-green-500" />
                Cancel anytime
              </span>
            </motion.div>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="max-w-4xl mx-auto mt-20"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="relative group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all hover:bg-white/[0.04] text-center"
                >
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-1">
                    {stat.value}<span className="text-blue-400">{stat.suffix}</span>
                  </div>
                  <div className="text-gray-500 text-sm font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-20 relative"
          >
            <div className="relative mx-auto max-w-6xl">
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-3xl opacity-50" />

              {/* Browser Chrome */}
              <div className="relative bg-gradient-to-b from-gray-800/90 to-gray-900/90 rounded-t-2xl p-4 flex items-center gap-3 border border-white/10 border-b-0 backdrop-blur-xl">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors cursor-pointer" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors cursor-pointer" />
                  <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors cursor-pointer" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-6 py-2 bg-gray-800/80 rounded-lg text-sm text-gray-400 flex items-center gap-2 border border-white/5">
                    <Lock size={12} className="text-green-500" />
                    <Globe size={14} />
                    yourbusiness.com
                  </div>
                </div>
                <div className="w-20" />
              </div>

              {/* Browser Content */}
              <div className="relative bg-gradient-to-br from-gray-900/95 to-[#0a0a0f]/95 rounded-b-2xl border border-white/10 border-t-0 p-8 md:p-12 min-h-[500px] overflow-hidden backdrop-blur-xl">
                {/* Simulated Website Content */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 rounded-full">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      <span className="text-xs text-blue-400 font-medium">AI Assistant Online</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-10 w-72 bg-gradient-to-r from-white/20 to-white/5 rounded-lg" />
                      <div className="h-10 w-56 bg-gradient-to-r from-white/15 to-white/5 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-white/5 rounded" />
                      <div className="h-4 w-5/6 bg-white/5 rounded" />
                      <div className="h-4 w-4/6 bg-white/5 rounded" />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <div className="h-14 w-44 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                        <Phone size={20} className="text-white mr-2" />
                        <span className="text-white font-medium">Talk to AI</span>
                      </div>
                      <div className="h-14 w-36 bg-white/10 rounded-xl border border-white/10" />
                    </div>
                  </div>

                  {/* Voice Agent Card */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl" />
                    <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-3xl p-8 border border-white/10">
                      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Mic size={32} className="text-white" />
                      </div>
                      <div className="text-center mb-6">
                        <h3 className="text-xl font-semibold mb-2">Speak with Maya</h3>
                        <p className="text-gray-400 text-sm">Your AI assistant is ready to help</p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                          <Check size={16} className="text-green-500" />
                          Book appointments instantly
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                          <Check size={16} className="text-green-500" />
                          Get answers to questions
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                          <Check size={16} className="text-green-500" />
                          Available 24/7, no wait
                        </div>
                      </div>
                      <button className="w-full mt-6 py-4 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                        <PhoneCall size={20} />
                        Start Conversation
                      </button>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-2xl" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* VSL Section - Video Sales Letter */}
      <section id="demo" className="relative py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.span
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-400 text-sm font-medium mb-6"
            >
              <Play size={16} />
              WATCH THE DEMO
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            >
              See Voice Agent One
              <span className="block bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                In Action
              </span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-gray-400 max-w-2xl mx-auto"
            >
              Watch how easy it is to create your AI-powered business in under 5 minutes
            </motion.p>
          </motion.div>

          {/* Video Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            {/* Glow Effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20 rounded-3xl blur-3xl opacity-50" />

            {/* Video Container */}
            <div className="relative bg-gradient-to-br from-gray-900/95 to-[#0a0a0f]/95 rounded-3xl border border-white/10 overflow-hidden aspect-video">
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/30 transition-colors cursor-pointer group">
                <div className="relative">
                  {/* Animated Rings */}
                  <div className="absolute inset-0 -m-8 rounded-full border-2 border-white/20 animate-ping" />
                  <div className="absolute inset-0 -m-4 rounded-full border border-white/10 animate-pulse" />

                  {/* Play Button */}
                  <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl shadow-red-500/30">
                    <Play size={40} className="text-white ml-2" fill="white" />
                  </div>
                </div>
              </div>

              {/* Video Placeholder Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                <div className="absolute top-6 left-6 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs text-gray-400 font-medium">VIDEO COMING SOON</span>
                </div>

                {/* Placeholder Thumbnail Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20" />
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)'
                }} />

                {/* Duration Badge */}
                <div className="absolute bottom-6 right-6 px-3 py-1.5 bg-black/60 rounded-lg text-sm text-white font-medium backdrop-blur-sm">
                  5:32
                </div>
              </div>
            </div>

            {/* Video Info */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg font-bold">
                  N
                </div>
                <div>
                  <h4 className="font-semibold">Complete Walkthrough</h4>
                  <p className="text-sm text-gray-500">From zero to live AI business</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <span className="flex items-center gap-2">
                  <Clock size={16} />
                  5 min watch
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-500" />
                  No experience needed
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Calendly Booking Section */}
      <section id="book" className="relative py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent" />
        <div className="max-w-6xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Info */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-400 text-sm font-medium mb-6">
                <Calendar size={16} />
                FREE STRATEGY CALL
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Let's Build Your
                <span className="block bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  AI Business Together
                </span>
              </h2>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                Book a free 30-minute strategy call to discuss how Voice Agent One can transform your business.
                We'll walk through your specific use case and help you get started.
              </p>

              {/* Benefits */}
              <div className="space-y-4 mb-8">
                {[
                  { icon: CheckCircle2, text: 'Personalized demo for your industry' },
                  { icon: CheckCircle2, text: 'Custom implementation roadmap' },
                  { icon: CheckCircle2, text: 'Integration & automation guidance' },
                  { icon: CheckCircle2, text: 'Exclusive launch pricing discussion' },
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <benefit.icon size={20} className="text-green-500 flex-shrink-0" />
                    <span className="text-gray-300">{benefit.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-4 p-4 bg-white/[0.02] rounded-xl border border-white/5">
                <div className="flex -space-x-3">
                  {['JD', 'MK', 'SC', 'AR'].map((initials, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold border-2 border-[#030014]"
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-medium">50+ calls booked this week</p>
                  <p className="text-xs text-gray-500">Join business owners like you</p>
                </div>
              </div>
            </motion.div>

            {/* Right - Calendly Embed */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur-3xl opacity-40" />

              <div className="relative bg-gradient-to-br from-gray-900/95 to-[#0a0a0f]/95 rounded-3xl border border-white/10 overflow-hidden min-h-[600px]">
                {/* Calendly Embed */}
                <iframe
                  src="https://calendly.com/neeraj_gs/30min?hide_gdpr_banner=1&background_color=0a0a0f&text_color=ffffff&primary_color=22c55e"
                  style={{
                    width: '100%',
                    height: '100%',
                    minHeight: '600px',
                    border: 'none',
                  }}
                  title="Book a strategy call"
                  loading="lazy"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Logos / Trust Section */}
      <section className="relative py-16 px-4 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-gray-500 text-sm font-medium mb-8">POWERED BY INDUSTRY-LEADING TECHNOLOGY</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
              {integrations.map((integration, index) => (
                <motion.div
                  key={integration.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group"
                >
                  <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', integration.color)}>
                    <integration.icon size={20} className="text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm group-hover:text-white transition-colors">{integration.name}</div>
                    <div className="text-xs text-gray-500">{integration.description}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-20"
          >
            <motion.span
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-6"
            >
              <Workflow size={16} />
              HOW IT WORKS
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              From Zero to Live in
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Five Simple Steps
              </span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-400 max-w-2xl mx-auto"
            >
              No coding, no designers, no copywriters. AI handles everything.
              Just add your business info and go.
            </motion.p>
          </motion.div>

          {/* Steps - Horizontal Timeline */}
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="grid lg:grid-cols-5 gap-6">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  onMouseEnter={() => setActiveStep(index)}
                  className={cn(
                    'relative p-6 rounded-2xl border transition-all duration-500 cursor-pointer group',
                    activeStep === index
                      ? 'bg-white/[0.05] border-white/20 scale-[1.02] shadow-xl shadow-white/5'
                      : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.03]'
                  )}
                >
                  {/* Step Number */}
                  <div className={cn(
                    'absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all',
                    activeStep === index
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 border-white/20 text-white'
                      : 'bg-gray-900 border-white/10 text-gray-500'
                  )}>
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className={cn(
                    'w-14 h-14 rounded-xl bg-gradient-to-r flex items-center justify-center mb-5 transition-transform group-hover:scale-110',
                    step.color
                  )}>
                    <step.icon size={26} className="text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent" />
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-20"
          >
            <motion.span
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-400 text-sm font-medium mb-6"
            >
              <Sparkles size={16} />
              FEATURES
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              Everything You Need to
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Grow Your Business
              </span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-400 max-w-2xl mx-auto"
            >
              A complete business-in-a-box with cutting-edge AI at its core.
            </motion.p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="group relative p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all duration-300 hover:bg-white/[0.04]"
              >
                {/* Gradient Hover Effect */}
                <div className={cn(
                  'absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300',
                  feature.gradient
                )} />

                <div className={cn(
                  'w-12 h-12 rounded-xl bg-gradient-to-r flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg',
                  feature.gradient
                )}>
                  <feature.icon size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Embed Showcase Section */}
      <section id="embed" className="relative py-32 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.span
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-400 text-sm font-medium mb-6"
            >
              <Code size={16} />
              EMBED ANYWHERE
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              Add Voice AI to
              <span className="block bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                Your Existing Website
              </span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-400 max-w-2xl mx-auto"
            >
              Already have a website? Just grab the embed code and add AI voice support in minutes.
            </motion.p>
          </motion.div>

          {/* Platform Showcase */}
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left - Code Preview */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-3xl blur-3xl opacity-50" />
              <div className="relative bg-gray-900/90 rounded-2xl border border-white/10 overflow-hidden">
                {/* Terminal Header */}
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-800/50 border-b border-white/5">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-gray-700/50 rounded text-xs text-gray-400">
                    <Terminal size={12} />
                    HTML Embed
                  </div>
                </div>
                {/* Code Content */}
                <div className="p-6 overflow-x-auto">
                  <pre className="text-sm font-mono">
                    <code>
                      <span className="text-gray-500">{'<!-- Add this to your HTML -->'}</span>{'\n'}
                      <span className="text-pink-400">{'<script'}</span>{' '}
                      <span className="text-cyan-400">src</span>
                      <span className="text-white">=</span>
                      <span className="text-green-400">"https://elevenlabs.io/convai-widget/index.js"</span>{'\n'}
                      {'  '}<span className="text-cyan-400">async</span>{' '}
                      <span className="text-cyan-400">type</span>
                      <span className="text-white">=</span>
                      <span className="text-green-400">"text/javascript"</span>
                      <span className="text-pink-400">{'>'}</span>
                      <span className="text-pink-400">{'</script>'}</span>{'\n\n'}
                      <span className="text-pink-400">{'<elevenlabs-convai'}</span>{' '}
                      <span className="text-cyan-400">agent-id</span>
                      <span className="text-white">=</span>
                      <span className="text-green-400">"your-agent-id"</span>
                      <span className="text-pink-400">{'>'}</span>{'\n'}
                      <span className="text-pink-400">{'</elevenlabs-convai>'}</span>
                    </code>
                  </pre>
                </div>
              </div>
            </motion.div>

            {/* Right - Platform Cards */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="space-y-4"
            >
              {[
                { name: 'HTML / Vanilla JS', desc: 'Add to any website with 2 lines of code', icon: Code, color: 'from-orange-500 to-red-500' },
                { name: 'React', desc: 'Use the useConversation hook for full control', icon: Bot, color: 'from-cyan-500 to-blue-500' },
                { name: 'Next.js', desc: 'Client component ready for App Router', icon: Globe, color: 'from-slate-500 to-gray-500' },
                { name: 'Shopify', desc: 'Add to theme.liquid in minutes', icon: Package, color: 'from-green-500 to-emerald-500' },
              ].map((platform, index) => (
                <motion.div
                  key={platform.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all group"
                >
                  <div className={cn(
                    'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center transition-transform group-hover:scale-110',
                    platform.color
                  )}>
                    <platform.icon size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{platform.name}</h4>
                    <p className="text-sm text-gray-500">{platform.desc}</p>
                  </div>
                  <Check size={20} className="text-green-500" />
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/setup">
              <button className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center gap-3 mx-auto">
                Get Your Embed Code
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <p className="text-sm text-gray-500 mt-4">Setup takes less than 5 minutes</p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.span
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-6"
            >
              <Crown size={16} />
              PRICING
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              Simple, Transparent
              <span className="block bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Pricing
              </span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-400 max-w-2xl mx-auto mb-10"
            >
              Start free, upgrade when you need more. No hidden fees.
            </motion.p>

            {/* Billing Toggle */}
            <motion.div variants={fadeInUp} className="flex items-center justify-center gap-4">
              <span className={cn('text-sm font-medium transition-colors', billingCycle === 'monthly' ? 'text-white' : 'text-gray-500')}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="relative w-14 h-7 bg-white/10 rounded-full p-1 transition-colors hover:bg-white/15"
              >
                <div className={cn(
                  'w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-transform duration-300',
                  billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-0'
                )} />
              </button>
              <span className={cn('text-sm font-medium transition-colors', billingCycle === 'yearly' ? 'text-white' : 'text-gray-500')}>
                Yearly
                <span className="ml-2 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-xs">Save 20%</span>
              </span>
            </motion.div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  'relative p-8 rounded-3xl border transition-all duration-300',
                  plan.highlighted
                    ? 'bg-gradient-to-b from-blue-500/10 to-purple-500/10 border-blue-500/30 scale-105 shadow-2xl shadow-blue-500/10'
                    : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                )}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-sm font-semibold">
                    {plan.badge}
                  </div>
                )}

                <div className={cn('w-14 h-14 rounded-2xl bg-gradient-to-r flex items-center justify-center mb-6', plan.gradient)}>
                  <plan.icon size={28} className="text-white" />
                </div>

                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-6">{plan.description}</p>

                <div className="mb-8">
                  <span className="text-5xl font-bold">
                    ${billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly}
                  </span>
                  {plan.price.monthly > 0 && (
                    <span className="text-gray-500 ml-2">/month</span>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <Check size={18} className={cn(
                        'flex-shrink-0 mt-0.5',
                        plan.highlighted ? 'text-blue-400' : 'text-emerald-500'
                      )} />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/setup">
                  <button className={cn(
                    'w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2',
                    plan.highlighted
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-purple-500/25'
                      : 'bg-white/10 text-white hover:bg-white/15 border border-white/10'
                  )}>
                    {plan.cta}
                    <ArrowRight size={18} />
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-32 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.span
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-6"
            >
              <Star size={16} />
              TESTIMONIALS
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              Loved by Businesses
              <span className="block bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Everywhere
              </span>
            </motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all"
              >
                <Quote size={32} className="text-white/10 mb-4" />
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">{testimonial.content}</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
                <div className="absolute top-4 right-4 px-3 py-1 bg-white/5 rounded-full text-xs text-gray-400">
                  {testimonial.industry}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section id="industries" className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.span
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-medium mb-6"
            >
              <Building2 size={16} />
              {allIndustries.length}+ INDUSTRIES
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              Built for Every
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Service Business
              </span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-400 max-w-2xl mx-auto"
            >
              Pre-configured templates with industry-specific terminology, colors, and content.
            </motion.p>
          </motion.div>

          {/* Industry Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {visibleIndustries.map((industry) => (
              <div
                key={industry.name}
                className="group p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all duration-200 hover:bg-white/[0.04] text-center cursor-pointer"
              >
                <div className={cn(
                  'w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3 transition-transform duration-200 group-hover:scale-105',
                  industry.color
                )}>
                  <industry.icon size={26} className="text-white" />
                </div>
                <div className="font-medium text-sm mb-1">{industry.name}</div>
                <div className="text-xs text-gray-500">{industry.description}</div>
              </div>
            ))}

            {/* Show More / Show Less Button */}
            <div
              onClick={() => setShowAllIndustries(!showAllIndustries)}
              className="group p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-200 hover:bg-blue-500/20 text-center cursor-pointer flex flex-col items-center justify-center"
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3 bg-gradient-to-br from-blue-500 to-purple-600 transition-transform duration-200 group-hover:scale-105">
                {showAllIndustries ? (
                  <ChevronUp size={26} className="text-white" />
                ) : (
                  <Plus size={26} className="text-white" />
                )}
              </div>
              <div className="font-medium text-sm mb-1">
                {showAllIndustries ? 'Show Less' : `+ ${remainingCount} More`}
              </div>
              <div className="text-xs text-blue-400">
                {showAllIndustries ? 'Collapse list' : 'Click to expand'}
              </div>
            </div>
          </div>

          {/* Category Pills when expanded */}
          {showAllIndustries && (
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {['Healthcare', 'Beauty', 'Fitness', 'Professional', 'Real Estate', 'Automotive', 'Home Services', 'Pet Services', 'Food', 'Education', 'Events', 'Tech', 'Personal', 'Travel', 'Other'].map((category) => (
                <span
                  key={category}
                  className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                >
                  {category}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="relative py-32 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent" />
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.span
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 text-rose-400 text-sm font-medium mb-6"
            >
              <Rocket size={16} />
              ROADMAP
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              What's Coming
              <span className="block bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
                Next
              </span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-400 max-w-2xl mx-auto"
            >
              We're constantly improving Voice Agent One. Here's what's on our horizon.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roadmapItems.map((item, index) => (
              <motion.div
                key={item.quarter}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  'relative p-6 rounded-2xl border transition-all',
                  item.status === 'completed'
                    ? 'bg-emerald-500/5 border-emerald-500/20'
                    : item.status === 'in-progress'
                    ? 'bg-blue-500/5 border-blue-500/20'
                    : 'bg-white/[0.02] border-white/10'
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium',
                    item.status === 'completed'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : item.status === 'in-progress'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-white/10 text-gray-400'
                  )}>
                    {item.status === 'completed' ? 'Completed' : item.status === 'in-progress' ? 'In Progress' : 'Planned'}
                  </span>
                  <span className="text-sm text-gray-500">{item.quarter}</span>
                </div>
                <h3 className="text-lg font-semibold mb-4">{item.title}</h3>
                <ul className="space-y-2">
                  {item.items.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-400">
                      {item.status === 'completed' ? (
                        <CheckCircle2 size={14} className="text-emerald-500" />
                      ) : item.status === 'in-progress' ? (
                        <RefreshCw size={14} className="text-blue-500 animate-spin" />
                      ) : (
                        <Circle size={14} className="text-gray-600" />
                      )}
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-32 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.span
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 text-violet-400 text-sm font-medium mb-6"
            >
              <MessageSquare size={16} />
              FAQ
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              Frequently Asked
              <span className="block bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                Questions
              </span>
            </motion.h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="border border-white/10 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-white/[0.02] transition-colors"
                >
                  <span className="font-semibold pr-8">{faq.question}</span>
                  <ChevronDown
                    size={20}
                    className={cn(
                      'flex-shrink-0 transition-transform duration-300 text-gray-500',
                      openFaq === index ? 'rotate-180' : ''
                    )}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-gray-400 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-32 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative p-12 md:p-20 rounded-[2.5rem] overflow-hidden"
          >
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20" />
            <div className="absolute inset-0 backdrop-blur-3xl" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px]" />
            <div className="absolute inset-0 border border-white/10 rounded-[2.5rem]" />

            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-3 mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-50" />
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Zap size={32} className="text-white" />
                  </div>
                </div>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Ready to Transform
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Your Business?
                </span>
              </h2>

              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                Join thousands of businesses using AI to automate appointments
                and never miss a customer call again.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                <Link to="/setup">
                  <button className="group px-10 py-5 bg-white text-gray-900 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition-all inline-flex items-center gap-3 shadow-2xl shadow-white/20">
                    Start Building Now
                    <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400">
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  Free forever plan
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  Setup in 5 minutes
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  No credit card required
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl">Voice Agent One</span>
              </div>
              <p className="text-gray-400 text-sm max-w-sm mb-6">
                The complete AI-powered business template. Build your website and voice agent in minutes, not months.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <Twitter size={18} className="text-gray-400" />
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <Github size={18} className="text-gray-400" />
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <Linkedin size={18} className="text-gray-400" />
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#industries" className="hover:text-white transition-colors">Industries</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Voice Agent One. Built for the ElevenLabs + Lovable Bounty.
            </p>
            <div className="flex gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
