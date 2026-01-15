/**
 * My Businesses Page
 * Dashboard showing all user's businesses with management options
 */

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Building2,
  Phone,
  Globe,
  Trash2,
  Settings,
  Loader2,
  AlertTriangle,
  Link2,
  Check,
  Bot,
} from 'lucide-react';
import { Header } from '../components/layout/Header';
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
  const { loadBusinesses, setActiveBusiness, deleteCurrentBusiness, getActiveBusinessConfig } = useBusinessStore();
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Businesses</h1>
            <p className="text-slate-400">
              Manage your businesses and voice agents
            </p>
          </div>
          <Link
            to="/setup"
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-blue-500/25"
          >
            <Plus size={20} />
            Add Business
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && businesses.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && businesses.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-10 h-10 text-slate-600" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">No businesses yet</h2>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Create your first business to start using Voice Agent One. Set up takes just a few minutes.
            </p>
            <Link
              to="/setup"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              <Plus size={20} />
              Create Your First Business
            </Link>
          </motion.div>
        )}

        {/* Business Grid */}
        {businesses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business, index) => (
              <motion.div
                key={business.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  'relative bg-slate-800/50 border rounded-2xl overflow-hidden hover:border-slate-600 transition-all group',
                  business.id === activeBusiness?.id
                    ? 'border-blue-500 ring-1 ring-blue-500/50'
                    : 'border-slate-700'
                )}
              >
                {/* Active Badge */}
                {business.id === activeBusiness?.id && (
                  <div className="absolute top-4 right-4 px-2.5 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full">
                    Active
                  </div>
                )}

                <div className="p-6">
                  {/* Business Icon */}
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4">
                    <Building2 className="w-7 h-7 text-blue-400" />
                  </div>

                  {/* Business Info */}
                  <h3 className="text-xl font-semibold text-white mb-1 truncate">
                    {business.name}
                  </h3>
                  <p className="text-slate-400 text-sm capitalize mb-4">
                    {business.industry}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                    {business.phone && (
                      <span className="flex items-center gap-1">
                        <Phone size={14} />
                        {business.phone}
                      </span>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSelectBusiness(business.id, business.product_type)}
                      disabled={isSwitching}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-50",
                        business.product_type === 'agent_only'
                          ? 'bg-purple-500 hover:bg-purple-600'
                          : 'bg-blue-500 hover:bg-blue-600'
                      )}
                    >
                      {business.product_type === 'agent_only' ? (
                        <>
                          <Bot size={16} />
                          Agent Dashboard
                        </>
                      ) : (
                        <>
                          <Globe size={16} />
                          View Site
                        </>
                      )}
                    </button>
                    {/* Copy Public Link - only for website_and_agent */}
                    {business.slug && business.product_type !== 'agent_only' && (
                      <button
                        onClick={() => copyPublicUrl(business.id, business.slug)}
                        className={cn(
                          'p-2.5 rounded-lg transition-colors',
                          copiedId === business.id
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-slate-700 hover:bg-green-500/20 text-slate-300 hover:text-green-400'
                        )}
                        title="Copy public link"
                      >
                        {copiedId === business.id ? <Check size={18} /> : <Link2 size={18} />}
                      </button>
                    )}
                    <button
                      onClick={() => handleOpenSettings(business.id)}
                      disabled={isSwitching}
                      className="p-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 hover:text-white transition-colors disabled:opacity-50"
                      title="Settings"
                    >
                      <Settings size={18} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(business.id)}
                      className="p-2.5 bg-slate-700 hover:bg-red-500/20 rounded-lg text-slate-300 hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Delete Confirmation */}
                {deleteConfirm === business.id && (
                  <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-sm flex items-center justify-center p-6">
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-6 h-6 text-red-400" />
                      </div>
                      <h4 className="text-white font-semibold mb-2">Delete Business?</h4>
                      <p className="text-slate-400 text-sm mb-4">
                        This will also delete the voice agent. This action cannot be undone.
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm transition-colors"
                          disabled={isDeleting}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDeleteBusiness(business.id)}
                          disabled={isDeleting}
                          className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          {isDeleting ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <>
                              <Trash2 size={16} />
                              Delete
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            {/* Add New Business Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: businesses.length * 0.1 }}
            >
              <Link
                to="/setup"
                className="h-full min-h-[240px] flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-700 hover:border-blue-500/50 rounded-2xl transition-colors group"
              >
                <div className="w-14 h-14 rounded-xl bg-slate-800 group-hover:bg-blue-500/20 flex items-center justify-center mb-4 transition-colors">
                  <Plus className="w-7 h-7 text-slate-500 group-hover:text-blue-400 transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-slate-400 group-hover:text-white transition-colors">
                  Add New Business
                </h3>
                <p className="text-slate-500 text-sm text-center mt-1">
                  Create another voice agent
                </p>
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBusinessesPage;
