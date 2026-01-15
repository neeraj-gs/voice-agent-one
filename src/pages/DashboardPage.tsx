/**
 * Dashboard Page
 * Professional analytics dashboard with real ElevenLabs data
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Phone,
  Calendar,
  TrendingUp,
  Clock,
  RefreshCw,
  MessageSquare,
  CheckCircle,
  XCircle,
  Star,
  Loader2,
  ExternalLink,
  Play,
  AlertCircle,
  Settings,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Header } from '../components/layout/Header';
import { Button, Card, CardContent } from '../components/ui';
import { useAuthStore } from '../stores/authStore';
import {
  useBusinessStore,
  useActiveBusiness,
  useActiveVoiceAgent,
} from '../stores/businessStore';
import {
  fetchAgentAnalytics,
  formatDuration,
  formatRelativeTime,
  type AnalyticsData,
} from '../services/analytics';
import { cn } from '../utils/cn';

// Chart colors
const COLORS = {
  primary: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6',
  cyan: '#06B6D4',
};

const PIE_COLORS = [COLORS.success, COLORS.danger, '#64748B'];

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const activeBusiness = useActiveBusiness();
  const activeVoiceAgent = useActiveVoiceAgent();
  const { loadActiveBusiness, loadBusinesses } = useBusinessStore();

  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Get API key from voice agent
  const apiKey = activeVoiceAgent?.elevenlabs_api_key || '';
  const agentId = activeVoiceAgent?.elevenlabs_agent_id || '';

  useEffect(() => {
    if (user) {
      loadBusinesses(user.id);
      loadActiveBusiness(user.id);
    }
  }, [user, loadBusinesses, loadActiveBusiness]);

  const fetchData = useCallback(async () => {
    if (!apiKey || !agentId) {
      setError('Missing API key or Agent ID');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchAgentAnalytics(apiKey, agentId);
      setAnalytics(data);
      setLastRefresh(new Date());
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, agentId]);

  useEffect(() => {
    if (apiKey && agentId) {
      fetchData();
    }
  }, [apiKey, agentId, fetchData]);

  // Auto-refresh every 30 seconds if enabled
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchData();
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, fetchData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-400 bg-green-400/10';
      case 'failure':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  // Prepare pie chart data
  const pieData = analytics
    ? [
        { name: 'Successful', value: analytics.successfulCalls },
        { name: 'Failed', value: analytics.failedCalls },
        { name: 'Unknown', value: analytics.totalConversations - analytics.successfulCalls - analytics.failedCalls },
      ].filter(d => d.value > 0)
    : [];

  if (!activeBusiness || !activeVoiceAgent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
            <p className="text-slate-400">
              Real-time insights for {activeVoiceAgent.name}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-400">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500"
              />
              Auto-refresh
            </label>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchData}
              disabled={isLoading}
              className="border-slate-600 text-slate-300 hover:text-white hover:border-slate-500"
            >
              <RefreshCw size={16} className={cn('mr-2', isLoading && 'animate-spin')} />
              Refresh
            </Button>
            <a
              href={`https://elevenlabs.io/app/conversational-ai/${agentId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              <ExternalLink size={16} />
              ElevenLabs
            </a>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3"
          >
            <AlertCircle className="text-red-400" size={20} />
            <p className="text-red-400">{error}</p>
          </motion.div>
        )}

        {/* Last Refresh */}
        {lastRefresh && (
          <p className="text-xs text-slate-500 mb-6">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </p>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            {
              label: 'Total Calls',
              value: analytics?.totalConversations || 0,
              icon: Phone,
              color: COLORS.primary,
              subtext: 'Last 30 days',
            },
            {
              label: 'Successful',
              value: analytics?.successfulCalls || 0,
              icon: CheckCircle,
              color: COLORS.success,
              subtext: `${analytics?.successRate || 0}% success rate`,
            },
            {
              label: 'Today',
              value: analytics?.todaysCalls || 0,
              icon: Calendar,
              color: COLORS.purple,
              subtext: 'Calls today',
            },
            {
              label: 'This Week',
              value: analytics?.thisWeekCalls || 0,
              icon: TrendingUp,
              color: COLORS.cyan,
              subtext: 'Last 7 days',
            },
            {
              label: 'Avg Duration',
              value: formatDuration(analytics?.avgDurationSecs || 0),
              icon: Clock,
              color: COLORS.warning,
              subtext: 'Per call',
            },
            {
              label: 'Avg Rating',
              value: analytics?.avgRating ? `${analytics.avgRating}/5` : 'N/A',
              icon: Star,
              color: '#F59E0B',
              subtext: `${analytics?.ratedConversations || 0} rated`,
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${stat.color}15` }}
                    >
                      <stat.icon size={20} style={{ color: stat.color }} />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {isLoading ? (
                      <span className="inline-block w-12 h-6 bg-slate-700 rounded animate-pulse" />
                    ) : (
                      stat.value
                    )}
                  </div>
                  <div className="text-xs text-slate-500">{stat.label}</div>
                  <div className="text-xs text-slate-600 mt-1">{stat.subtext}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Calls Over Time - Area Chart */}
          <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white">Calls This Week</h3>
                  <p className="text-sm text-slate-400">Daily conversation volume</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.primary }} />
                    <span className="text-slate-400">Calls</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.success }} />
                    <span className="text-slate-400">Duration (min)</span>
                  </div>
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics?.conversationsByDay || []}>
                    <defs>
                      <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.success} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={COLORS.success} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#64748B" fontSize={12} />
                    <YAxis stroke="#64748B" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1E293B',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: '#F8FAFC' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      name="Calls"
                      stroke={COLORS.primary}
                      fillOpacity={1}
                      fill="url(#colorCalls)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="duration"
                      name="Duration (min)"
                      stroke={COLORS.success}
                      fillOpacity={1}
                      fill="url(#colorDuration)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Success Rate Pie Chart */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white">Call Success Rate</h3>
                <p className="text-sm text-slate-400">Conversation outcomes</p>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1E293B',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm text-slate-400">Successful</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm text-slate-400">Failed</span>
                </div>
              </div>
              <div className="text-center mt-4">
                <span className="text-3xl font-bold text-white">{analytics?.successRate || 0}%</span>
                <p className="text-sm text-slate-400">Success Rate</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Bar Chart */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white">Daily Performance</h3>
                <p className="text-sm text-slate-400">Calls and duration by day</p>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics?.conversationsByDay || []} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#64748B" fontSize={12} />
                  <YAxis stroke="#64748B" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#F8FAFC' }}
                  />
                  <Bar dataKey="count" name="Calls" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="duration" name="Duration (min)" fill={COLORS.purple} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Conversations */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white">Recent Conversations</h3>
                <p className="text-sm text-slate-400">Latest calls and their outcomes</p>
              </div>
              <Link to="/call">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-slate-300 hover:text-white"
                >
                  <Phone size={16} className="mr-2" />
                  Open Call Page
                </Button>
              </Link>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-xl animate-pulse">
                    <div className="w-10 h-10 bg-slate-600 rounded-full" />
                    <div className="flex-1">
                      <div className="h-4 bg-slate-600 rounded w-1/3 mb-2" />
                      <div className="h-3 bg-slate-600 rounded w-1/4" />
                    </div>
                    <div className="h-6 w-20 bg-slate-600 rounded-full" />
                  </div>
                ))}
              </div>
            ) : analytics?.conversations.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-slate-700 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare size={32} className="text-slate-500" />
                </div>
                <h4 className="text-lg font-medium text-white mb-2">No conversations yet</h4>
                <p className="text-slate-400 mb-4">Start a conversation to see analytics here</p>
                <Link to="/call">
                  <Button className="bg-blue-500 hover:bg-blue-600">
                    <Play size={16} className="mr-2" />
                    Start a Call
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {analytics?.conversations.map((conversation, index) => (
                  <motion.div
                    key={conversation.conversation_id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center',
                          getStatusColor(conversation.call_successful)
                        )}
                      >
                        {conversation.call_successful === 'success' ? (
                          <CheckCircle size={20} />
                        ) : conversation.call_successful === 'failure' ? (
                          <XCircle size={20} />
                        ) : (
                          <MessageSquare size={20} />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm">
                          {conversation.call_summary_title || 'Conversation'}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span>{formatDuration(conversation.call_duration_secs)}</span>
                          <span>•</span>
                          <span>{formatRelativeTime(conversation.start_time_unix_secs)}</span>
                          <span>•</span>
                          <span>{conversation.message_count} messages</span>
                        </div>
                        {conversation.transcript_summary && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                            {conversation.transcript_summary}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {conversation.rating && (
                        <div className="flex items-center gap-1 text-yellow-400">
                          <Star size={14} fill="currentColor" />
                          <span className="text-sm">{conversation.rating}</span>
                        </div>
                      )}
                      <span
                        className={cn(
                          'px-3 py-1 rounded-full text-xs font-medium capitalize',
                          getStatusColor(conversation.call_successful)
                        )}
                      >
                        {conversation.call_successful}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/call">
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20 hover:border-blue-500/40 transition-colors cursor-pointer">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Phone size={24} className="text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Test Agent</h4>
                  <p className="text-sm text-slate-400">Start a test conversation</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/settings/agent">
            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20 hover:border-purple-500/40 transition-colors cursor-pointer">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Settings size={24} className="text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Edit Agent</h4>
                  <p className="text-sm text-slate-400">Customize behavior</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <a
            href={`https://elevenlabs.io/app/conversational-ai/${agentId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border-cyan-500/20 hover:border-cyan-500/40 transition-colors cursor-pointer">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                  <ExternalLink size={24} className="text-cyan-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">ElevenLabs Console</h4>
                  <p className="text-sm text-slate-400">Advanced settings</p>
                </div>
              </CardContent>
            </Card>
          </a>
        </div>
      </div>
    </div>
  );
};
