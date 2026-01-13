/**
 * Landing Page
 * Dynamic business website powered by stored configuration
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { Button, Card, CardContent } from '../components/ui';
import { useBusiness, useBranding } from '../stores/configStore';

export const LandingPage: React.FC = () => {
  const business = useBusiness();
  const branding = useBranding();

  if (!business || !branding) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-slate-700">
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
      <section className="pt-32 pb-20 px-4">
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
