/**
 * Public Landing Page
 * Public-facing business website accessible via unique slug URL
 * No authentication required - no admin bar
 */

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BusinessSite } from '../components/site/BusinessSite';
import { getPublicBusinessData, businessToConfig } from '../services/database';
import type { Business, VoiceAgent } from '../lib/supabase';
import type { BusinessConfig } from '../types';

export const PublicLandingPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [business, setBusiness] = useState<Business | null>(null);
  const [, setVoiceAgent] = useState<VoiceAgent | null>(null);
  const [config, setConfig] = useState<BusinessConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBusinessData = async () => {
      if (!slug) {
        setError('That link is missing a business name.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const { data, error: fetchError } = await getPublicBusinessData(slug);

      if (fetchError || !data) {
        setError(fetchError || 'No business is published at this address.');
        setIsLoading(false);
        return;
      }

      setBusiness(data.business);
      setVoiceAgent(data.voiceAgent);

      // Convert to config format
      const businessConfig = businessToConfig(data.business);
      // Add voice agent info to config
      if (data.voiceAgent) {
        businessConfig.voiceAgent = {
          name: data.voiceAgent.name,
          personality: data.voiceAgent.personality || '',
          systemPrompt: data.voiceAgent.system_prompt || '',
          firstMessage: data.voiceAgent.first_message || '',
        };
      }
      setConfig(businessConfig);
      setIsLoading(false);
    };

    loadBusinessData();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-graphite-faint">
          Opening the page
          <span className="ml-1 inline-block animate-lamp-flicker">·</span>
        </p>
      </div>
    );
  }

  if (error || !config || !business) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper px-6 font-site">
        <div className="max-w-md">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-graphite-faint">
            404
          </span>
          <h1 className="mt-4 font-serif text-[2.5rem] font-semibold leading-[1.05] text-graphite">
            Nothing at this address
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-graphite-soft">
            {error} Check the link, or ask whoever sent it to you for the current one.
          </p>
          <Link
            to="/"
            className="mt-7 inline-flex items-center gap-2 border-b border-graphite py-1.5 text-[14px] text-graphite"
          >
            Go to Voice Agent One
          </Link>
        </div>
      </div>
    );
  }

  return <BusinessSite config={config} callHref={`/p/${slug}/call`} />;
};

export default PublicLandingPage;
