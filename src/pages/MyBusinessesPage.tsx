/**
 * My Businesses Page
 * Dashboard showing all user's businesses with management options
 *
 * A patch bay rather than a grid of cards: one strip per business, the lit
 * lamp marking which one is currently routed. Rows scale to fifty businesses;
 * a card grid does not.
 */

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Phone,
  Globe,
  Trash2,
  Settings,
  Link2,
  Check,
  Bot,
  ArrowRight,
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui';
import { Legend, Lamp, Tag } from '../components/system/primitives';
import { useUser } from '../stores/authStore';
import {
  useBusinessStore,
  useBusinesses,
  useActiveBusiness,
  useBusinessLoading,
} from '../stores/businessStore';
import { useConfigStore } from '../stores/configStore';
import { cn } from '../utils/cn';

export const MyBusinessesPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useUser();
  const businesses = useBusinesses();
  const activeBusiness = useActiveBusiness();
  const isLoading = useBusinessLoading();
  const { loadBusinesses, setActiveBusiness, deleteCurrentBusiness, getActiveBusinessConfig } =
    useBusinessStore();
  const { setBusinessConfig } = useConfigStore();

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Copy public URL to clipboard
  const copyPublicUrl = async (businessId: string, slug: string) => {
    const publicUrl = `${window.location.origin}/p/${slug}`;
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopiedId(businessId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  useEffect(() => {
    if (user) {
      loadBusinesses(user.id);
    }
  }, [user, loadBusinesses]);

  // Set active business and sync to localStorage (without navigation)
  const switchToBusinessOnly = async (businessId: string): Promise<void> => {
    if (!user) return;
    setIsSwitching(true);
    await setActiveBusiness(user.id, businessId);
    // Sync to localStorage for LandingPage compatibility
    const config = getActiveBusinessConfig();
    if (config) {
      setBusinessConfig(config);
    }
    setIsSwitching(false);
  };

  // Set active business and navigate based on product type
  const handleSelectBusiness = async (businessId: string, productType?: string) => {
    await switchToBusinessOnly(businessId);
    // Navigate based on product type
    if (productType === 'agent_only') {
      navigate('/agent-dashboard');
    } else {
      navigate('/site');
    }
  };

  // Set active business and navigate to settings
  const handleOpenSettings = async (businessId: string) => {
    await switchToBusinessOnly(businessId);
    navigate('/settings/agent');
  };

  const handleDeleteBusiness = async (businessId: string) => {
    if (!user) return;

    setIsDeleting(true);
    // First set this business as active to delete it
    await setActiveBusiness(user.id, businessId);
    await deleteCurrentBusiness(user.id);
    setDeleteConfirm(null);
    setIsDeleting(false);
  };

  return (
    <div className="min-h-screen bg-ink">
      <Header />

      <main className="mx-auto w-full max-w-[76rem] px-5 py-8 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-edge-soft pb-6">
          <div>
            <Legend as="div">Patch bay</Legend>
            <h1 className="display mt-3 text-[clamp(1.75rem,4vw,2.75rem)]">Your businesses</h1>
            <p className="mt-2 text-[14px] text-bone-dim">
              {businesses.length === 0
                ? 'Nothing patched in yet.'
                : `${businesses.length} patched in. The lit one is what the rest of the app is showing.`}
            </p>
          </div>
          <Link to="/setup">
            <Button size="md">
              <Plus size={14} /> Add a business
            </Button>
          </Link>
        </div>

        {/* Loading */}
        {isLoading && businesses.length === 0 && (
          <div className="flex items-center gap-3 py-20">
            <Lamp state="ready" pulse />
            <Legend>Reading the rack</Legend>
          </div>
        )}

        {/* Nothing here yet — an invitation, not an apology. */}
        {!isLoading && businesses.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg py-20"
          >
            <h2 className="display text-[clamp(1.5rem,3vw,2.25rem)]">
              The rack
              <br />
              is empty
            </h2>
            <p className="mt-4 text-[14.5px] leading-relaxed text-bone-dim">
              Set up your first business and you will have a live agent taking calls in about
              five minutes. You can add more later; there is no limit.
            </p>
            <Link to="/setup" className="mt-7 inline-block">
              <Button size="lg">
                Set up the first one <ArrowRight size={14} />
              </Button>
            </Link>
          </motion.div>
        )}

        {/* The bay */}
        {businesses.length > 0 && (
          <div className="mt-8">
            {/* Column legend — a real table header, so the rows read as data. */}
            <div className="hidden grid-cols-[auto_minmax(0,2fr)_minmax(0,1fr)_auto] items-center gap-4 border-b border-edge px-3 pb-2 lg:grid">
              <span className="w-2" />
              <Legend>Business</Legend>
              <Legend>Line</Legend>
              <Legend className="text-right">Controls</Legend>
            </div>

            <ul>
              {businesses.map((business, index) => {
                const on = business.id === activeBusiness?.id;
                const agentOnly = business.product_type === 'agent_only';

                return (
                  <motion.li
                    key={business.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.04, 0.3) }}
                    className={cn(
                      'relative border-b border-edge-soft transition-colors',
                      on ? 'bg-steel' : 'hover:bg-steel-lift'
                    )}
                  >
                    <div className="grid items-center gap-x-4 gap-y-3 px-3 py-4 lg:grid-cols-[auto_minmax(0,2fr)_minmax(0,1fr)_auto]">
                      <Lamp state={on ? 'live' : 'off'} />

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h3 className="display-lite truncate text-[15px] text-bone">
                            {business.name}
                          </h3>
                          {on && <Tag tone="live">Routed</Tag>}
                          <Tag>{agentOnly ? 'Agent only' : 'Site + agent'}</Tag>
                        </div>
                        <p className="legend mt-1.5">{business.industry}</p>
                      </div>

                      <div className="flex items-center gap-2 font-mono text-[12px] text-bone-dim">
                        {business.phone ? (
                          <>
                            <Phone size={12} className="text-bone-faint" />
                            {business.phone}
                          </>
                        ) : (
                          <span className="text-bone-faint">No number set</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 lg:justify-end">
                        <Button
                          size="sm"
                          variant={on ? 'primary' : 'outline'}
                          disabled={isSwitching}
                          onClick={() => handleSelectBusiness(business.id, business.product_type)}
                        >
                          {agentOnly ? <Bot size={12} /> : <Globe size={12} />}
                          {agentOnly ? 'Agent' : 'Site'}
                        </Button>

                        {business.slug && !agentOnly && (
                          <button
                            onClick={() => copyPublicUrl(business.id, business.slug)}
                            title="Copy the public link"
                            aria-label="Copy the public link"
                            className={cn(
                              'flex h-8 w-8 items-center justify-center border transition-colors',
                              copiedId === business.id
                                ? 'border-patina text-patina-glow'
                                : 'border-edge text-bone-dim hover:border-edge-bright hover:text-bone'
                            )}
                          >
                            {copiedId === business.id ? <Check size={13} /> : <Link2 size={13} />}
                          </button>
                        )}

                        <button
                          onClick={() => handleOpenSettings(business.id)}
                          disabled={isSwitching}
                          title="Settings"
                          aria-label={`Settings for ${business.name}`}
                          className="flex h-8 w-8 items-center justify-center border border-edge text-bone-dim transition-colors hover:border-edge-bright hover:text-bone disabled:opacity-40"
                        >
                          <Settings size={13} />
                        </button>

                        <button
                          onClick={() => setDeleteConfirm(business.id)}
                          title="Remove"
                          aria-label={`Remove ${business.name}`}
                          className="flex h-8 w-8 items-center justify-center border border-edge text-bone-dim transition-colors hover:border-clip hover:text-clip"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Removal is destructive and irreversible, so it says so
                        in the row it affects rather than in a floating dialog. */}
                    {deleteConfirm === business.id && (
                      <div className="border-t border-clip-deep bg-clip/[0.07] px-3 py-4">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <p className="max-w-lg text-[13.5px] leading-snug text-bone">
                            Removing <strong className="text-clip">{business.name}</strong> also
                            deletes its voice agent and its call history. This cannot be undone.
                          </p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={isDeleting}
                              onClick={() => setDeleteConfirm(null)}
                            >
                              Keep it
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              isLoading={isDeleting}
                              onClick={() => handleDeleteBusiness(business.id)}
                            >
                              <Trash2 size={12} /> Remove for good
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.li>
                );
              })}
            </ul>

            <Link
              to="/setup"
              className="group mt-4 flex items-center gap-3 border border-dashed border-edge px-3 py-4 transition-colors hover:border-amber"
            >
              <Plus size={14} className="text-bone-faint transition-colors group-hover:text-amber" />
              <span className="display-lite text-[14px] text-bone-dim transition-colors group-hover:text-bone">
                Add another business
              </span>
              <span aria-hidden className="h-px flex-1 bg-edge-soft" />
              <ArrowRight
                size={13}
                className="text-bone-faint transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyBusinessesPage;
