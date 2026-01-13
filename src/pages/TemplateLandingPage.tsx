/**
 * Template Landing Page
 * Marketing page explaining what Voice Agent One does
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  Star,
  Shield,
  Clock,
  Globe,
  Cpu,
  MessageSquare,
  Users,
  TrendingUp,
  Palette,
  FileText,
  Bot,
} from 'lucide-react';
import { cn } from '../utils/cn';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export const TemplateLandingPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: '01',
      title: 'Select Your Industry',
      description: 'Choose from 14+ industries. The AI adapts terminology, colors, and content to match.',
      icon: Building2,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      number: '02',
      title: 'Enter Business Details',
      description: 'Add your business name, contact info, hours, and staff details.',
      icon: FileText,
      color: 'from-purple-500 to-pink-500',
    },
    {
      number: '03',
      title: 'AI Generates Everything',
      description: 'GPT-4 creates your website content, services, FAQs, and voice agent prompts.',
      icon: Sparkles,
      color: 'from-amber-500 to-orange-500',
    },
    {
      number: '04',
      title: 'Review & Customize',
      description: 'Edit anything you want. Add custom knowledge for your voice agent.',
      icon: Palette,
      color: 'from-green-500 to-emerald-500',
    },
    {
      number: '05',
      title: 'Go Live Instantly',
      description: 'Your AI-powered website with voice booking is ready. No coding needed.',
      icon: Zap,
      color: 'from-red-500 to-rose-500',
    },
  ];

  const features = [
    {
      icon: Bot,
      title: '24/7 AI Voice Agent',
      description: 'Never miss a call. Your AI assistant books appointments, answers questions, and handles inquiries around the clock.',
    },
    {
      icon: Sparkles,
      title: 'AI-Generated Content',
      description: 'GPT-4 creates your entire website - taglines, service descriptions, FAQs, testimonials, and voice prompts.',
    },
    {
      icon: Palette,
      title: 'Dynamic Branding',
      description: 'Colors, terminology, and style automatically adapt to your industry. Full customization available.',
    },
    {
      icon: Calendar,
      title: 'Smart Booking',
      description: 'Integrated with Cal.com for seamless appointment scheduling directly through the voice agent.',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Track calls, bookings, and customer engagement. See what\'s working and optimize.',
    },
    {
      icon: Shield,
      title: 'No Code Required',
      description: 'Setup takes 5 minutes. No technical knowledge needed. Just fill in your info and go.',
    },
  ];

  const industries = [
    { icon: Stethoscope, name: 'Healthcare', color: 'bg-blue-500' },
    { icon: Scissors, name: 'Salon & Spa', color: 'bg-pink-500' },
    { icon: Dumbbell, name: 'Fitness', color: 'bg-orange-500' },
    { icon: Home, name: 'Real Estate', color: 'bg-indigo-500' },
    { icon: UtensilsCrossed, name: 'Restaurant', color: 'bg-red-500' },
    { icon: Building2, name: '+ 9 More', color: 'bg-gray-500' },
  ];

  const stats = [
    { value: '5 min', label: 'Setup Time' },
    { value: '24/7', label: 'Availability' },
    { value: '14+', label: 'Industries' },
    { value: '100%', label: 'Customizable' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white overflow-hidden">
      {/* Gradient Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl">Voice Agent One</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">
                How It Works
              </a>
              <a href="#features" className="text-gray-400 hover:text-white transition-colors">
                Features
              </a>
              <a href="#industries" className="text-gray-400 hover:text-white transition-colors">
                Industries
              </a>
            </div>
            <Link to="/setup">
              <button className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
                Get Started
                <ArrowRight size={18} />
              </button>
            </Link>
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
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm">
                <Sparkles size={16} className="text-yellow-400" />
                AI-Powered Business Template
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              Your Business Website
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                + AI Voice Agent
              </span>
              <br />
              in 5 Minutes
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto"
            >
              Enter your business info. AI generates your entire website, content,
              and a 24/7 voice assistant that books appointments for you.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/setup">
                <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 w-full sm:w-auto">
                  Start Building Free
                  <ArrowRight size={20} />
                </button>
              </Link>
              <a href="#how-it-works">
                <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto">
                  <Play size={20} />
                  See How It Works
                </button>
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-white/10"
            >
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Visual - Browser Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-20 relative"
          >
            <div className="relative mx-auto max-w-5xl">
              {/* Browser Chrome */}
              <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-t-xl p-3 flex items-center gap-2 border border-white/10 border-b-0">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 bg-gray-700/50 rounded-lg text-sm text-gray-400 flex items-center gap-2">
                    <Globe size={14} />
                    yourbusiness.com
                  </div>
                </div>
              </div>
              {/* Browser Content */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-b-xl border border-white/10 border-t-0 p-8 min-h-[400px] relative overflow-hidden">
                {/* Placeholder Content */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <div className="h-4 w-32 bg-blue-500/30 rounded mb-4" />
                    <div className="h-8 w-64 bg-white/10 rounded mb-2" />
                    <div className="h-8 w-48 bg-white/10 rounded mb-4" />
                    <div className="h-4 w-full bg-white/5 rounded mb-2" />
                    <div className="h-4 w-3/4 bg-white/5 rounded mb-6" />
                    <div className="flex gap-3">
                      <div className="h-12 w-36 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg" />
                      <div className="h-12 w-36 bg-white/10 rounded-lg" />
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                      <Phone size={64} className="text-blue-400" />
                    </div>
                  </div>
                </div>

                {/* Floating Voice Agent Widget */}
                <div className="absolute bottom-4 right-4 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30 animate-pulse">
                  <MessageSquare size={28} className="text-white" />
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -left-20 top-1/2 w-40 h-40 bg-blue-500/30 rounded-full blur-[80px]" />
            <div className="absolute -right-20 top-1/4 w-40 h-40 bg-purple-500/30 rounded-full blur-[80px]" />
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
            className="text-center mb-16"
          >
            <motion.span
              variants={fadeInUp}
              className="text-blue-400 font-medium mb-4 block"
            >
              HOW IT WORKS
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              From Zero to Live in 5 Steps
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-400 max-w-2xl mx-auto"
            >
              No coding, no designers, no copywriters needed.
              AI does all the heavy lifting.
            </motion.p>
          </motion.div>

          {/* Steps */}
          <div className="grid lg:grid-cols-5 gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => setActiveStep(index)}
                className={cn(
                  'relative p-6 rounded-2xl border transition-all duration-300 cursor-pointer',
                  activeStep === index
                    ? 'bg-white/5 border-white/20 scale-105'
                    : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                )}
              >
                {/* Step Number */}
                <div
                  className={cn(
                    'text-5xl font-bold bg-gradient-to-r bg-clip-text text-transparent mb-4',
                    step.color
                  )}
                >
                  {step.number}
                </div>

                {/* Icon */}
                <div
                  className={cn(
                    'w-12 h-12 rounded-xl bg-gradient-to-r flex items-center justify-center mb-4',
                    step.color
                  )}
                >
                  <step.icon size={24} className="text-white" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-gray-400">{step.description}</p>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2 w-4 h-0.5 bg-gradient-to-r from-white/20 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 px-4 bg-white/[0.02]">
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
              className="text-purple-400 font-medium mb-4 block"
            >
              FEATURES
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Everything You Need to Succeed
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-400 max-w-2xl mx-auto"
            >
              A complete business-in-a-box with AI at its core.
            </motion.p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors group"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon size={28} className="text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
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
              className="text-green-400 font-medium mb-4 block"
            >
              INDUSTRIES
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Built for Any Service Business
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-400 max-w-2xl mx-auto"
            >
              Pre-configured for 14+ industries with smart defaults and terminology.
            </motion.p>
          </motion.div>

          {/* Industry Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {industries.map((industry, index) => (
              <motion.div
                key={industry.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all hover:scale-105 text-center cursor-pointer group"
              >
                <div
                  className={cn(
                    'w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3 transition-transform group-hover:scale-110',
                    industry.color
                  )}
                >
                  <industry.icon size={28} className="text-white" />
                </div>
                <span className="font-medium">{industry.name}</span>
              </motion.div>
            ))}
          </div>

          {/* Industry Examples */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 grid md:grid-cols-2 gap-8"
          >
            {/* Real Estate Example */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border border-indigo-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center">
                  <Home size={20} className="text-white" />
                </div>
                <div>
                  <div className="font-semibold">Real Estate</div>
                  <div className="text-sm text-gray-400">Premier Realty Group</div>
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                "Hello! Thank you for calling Premier Realty Group. I'm Taylor,
                your real estate assistant. Are you looking to schedule a showing
                or have questions about the Austin market?"
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-indigo-500/20 rounded-full text-xs text-indigo-300">
                  client
                </span>
                <span className="px-3 py-1 bg-indigo-500/20 rounded-full text-xs text-indigo-300">
                  showing
                </span>
                <span className="px-3 py-1 bg-indigo-500/20 rounded-full text-xs text-indigo-300">
                  listing
                </span>
              </div>
            </div>

            {/* Fitness Example */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center">
                  <Dumbbell size={20} className="text-white" />
                </div>
                <div>
                  <div className="font-semibold">Fitness</div>
                  <div className="text-sm text-gray-400">Iron Peak Fitness</div>
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                "Hey there! Welcome to Iron Peak Fitness! I'm Alex. Ready to crush
                your goals? I can help you book a free trial, sign up for classes,
                or answer any questions!"
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-orange-500/20 rounded-full text-xs text-orange-300">
                  member
                </span>
                <span className="px-3 py-1 bg-orange-500/20 rounded-full text-xs text-orange-300">
                  session
                </span>
                <span className="px-3 py-1 bg-orange-500/20 rounded-full text-xs text-orange-300">
                  class
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative p-12 md:p-16 rounded-3xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 border border-white/10 text-center overflow-hidden"
          >
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px]" />

            <div className="relative z-10">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-8">
                <Zap size={40} className="text-white" />
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Launch Your
                <br />
                AI-Powered Business?
              </h2>

              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                Join hundreds of businesses using Voice Agent One.
                Setup takes 5 minutes. No credit card required.
              </p>

              <Link to="/setup">
                <button className="px-10 py-5 bg-white text-gray-900 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-3">
                  Start Building Now
                  <ArrowRight size={24} />
                </button>
              </Link>

              <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-400">
                <span className="flex items-center gap-2">
                  <Check size={16} className="text-green-400" />
                  Free to start
                </span>
                <span className="flex items-center gap-2">
                  <Check size={16} className="text-green-400" />
                  No coding needed
                </span>
                <span className="flex items-center gap-2">
                  <Check size={16} className="text-green-400" />
                  5-minute setup
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl">Voice Agent One</span>
            </div>
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Voice Agent One. AI-Powered Business Template.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
