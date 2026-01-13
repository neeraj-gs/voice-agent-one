/**
 * Dashboard Page
 * Analytics and management for voice agent
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Phone,
  Users,
  Calendar,
  TrendingUp,
  Clock,
  Smile,
  BarChart3,
  Settings,
  RefreshCw,
  CheckCircle,
  XCircle,
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
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
} from 'recharts';
import { Button, Card, CardContent, CardHeader } from '../components/ui';
import { useBusiness, useBranding, useConfigStore } from '../stores/configStore';
import type { DashboardStats, CallLog } from '../types';
import { cn } from '../utils/cn';

// Generate demo data
const generateDemoStats = (): DashboardStats => ({
  totalCalls: 156,
  totalCustomers: 89,
  totalAppointments: 67,
  bookingRate: 43,
  avgCallDuration: 145,
  todayCalls: 12,
  todayAppointments: 5,
  weeklyGrowth: 12.5,
});

const generateDemoCallLogs = (): CallLog[] => {
  const outcomes: CallLog['outcome'][] = ['booked', 'inquiry', 'rescheduled', 'no_action'];
  const names = ['Sarah M.', 'John D.', 'Emily R.', 'Michael S.', 'Lisa T.'];

  return Array.from({ length: 10 }, (_, i) => ({
    id: `call-${i}`,
    customerName: names[i % names.length],
    customerPhone: `+1 555-${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    duration: Math.floor(Math.random() * 300) + 60,
    outcome: outcomes[Math.floor(Math.random() * outcomes.length)],
    timestamp: new Date(Date.now() - i * 3600000 * Math.random() * 24).toISOString(),
    summary: 'Customer inquiry about services',
  }));
};

const generateChartData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day) => ({
    name: day,
    calls: Math.floor(Math.random() * 30) + 10,
    bookings: Math.floor(Math.random() * 15) + 5,
  }));
};

export const DashboardPage: React.FC = () => {
  const business = useBusiness();
  const branding = useBranding();
  const resetSetup = useConfigStore((s) => s.resetSetup);

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      setStats(generateDemoStats());
      setCallLogs(generateDemoCallLogs());
      setChartData(generateChartData());
      setIsLoading(false);
    };
    loadData();
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getOutcomeStyle = (outcome: CallLog['outcome']) => {
    switch (outcome) {
      case 'booked':
        return { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400' };
      case 'rescheduled':
        return { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' };
      case 'cancelled':
        return { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400' };
      case 'inquiry':
        return { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400' };
      default:
        return { bg: 'bg-gray-100 dark:bg-gray-900/30', text: 'text-gray-700 dark:text-gray-400' };
    }
  };

  if (!business || !branding) {
    return null;
  }

  const statCards = stats
    ? [
        {
          label: 'Total Calls',
          value: stats.totalCalls,
          icon: Phone,
          change: '+12%',
          positive: true,
        },
        {
          label: `Total ${business.terms.customer.charAt(0).toUpperCase() + business.terms.customer.slice(1)}s`,
          value: stats.totalCustomers,
          icon: Users,
          change: '+8%',
          positive: true,
        },
        {
          label: `${business.terms.appointment.charAt(0).toUpperCase() + business.terms.appointment.slice(1)}s`,
          value: stats.totalAppointments,
          icon: Calendar,
          change: '+15%',
          positive: true,
        },
        {
          label: 'Booking Rate',
          value: `${stats.bookingRate}%`,
          icon: TrendingUp,
          change: '+3%',
          positive: true,
        },
        {
          label: 'Avg Duration',
          value: formatDuration(stats.avgCallDuration),
          icon: Clock,
          change: '-5%',
          positive: false,
        },
        {
          label: 'Today\'s Calls',
          value: stats.todayCalls,
          icon: BarChart3,
          change: '+2',
          positive: true,
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Dashboard
                </h1>
                <p className="text-sm text-gray-500">{business.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => {
                    setStats(generateDemoStats());
                    setCallLogs(generateDemoCallLogs());
                    setChartData(generateChartData());
                    setIsLoading(false);
                  }, 500);
                }}
              >
                <RefreshCw size={16} className={cn('mr-2', isLoading && 'animate-spin')} />
                Refresh
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (confirm('Reset all settings? You will need to set up again.')) {
                    resetSetup();
                    window.location.href = '/setup';
                  }
                }}
              >
                <Settings size={16} className="mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Demo Notice */}
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <p className="text-sm text-blue-600 dark:text-blue-400">
            <strong>Demo Mode:</strong> Showing sample data. Connect Supabase to see real analytics.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${branding.primaryColor}15` }}
                    >
                      <stat.icon size={16} style={{ color: branding.primaryColor }} />
                    </div>
                    <span
                      className={cn(
                        'text-xs font-medium flex items-center',
                        stat.positive ? 'text-green-600' : 'text-red-600'
                      )}
                    >
                      {stat.positive ? (
                        <ArrowUpRight size={12} />
                      ) : (
                        <ArrowDownRight size={12} />
                      )}
                      {stat.change}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {isLoading ? '—' : stat.value}
                  </div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Calls Chart */}
          <Card>
            <CardHeader className="pb-0">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Calls This Week
              </h3>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="calls"
                      stroke={branding.primaryColor}
                      fill={`${branding.primaryColor}30`}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Bookings Chart */}
          <Card>
            <CardHeader className="pb-0">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {business.terms.appointment.charAt(0).toUpperCase() + business.terms.appointment.slice(1)}s This Week
              </h3>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip />
                    <Bar
                      dataKey="bookings"
                      fill={branding.primaryColor}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Calls */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Recent Calls
              </h3>
              <Link to="/call">
                <Button variant="ghost" size="sm">
                  <Phone size={16} className="mr-2" />
                  Open Call Page
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200 dark:divide-slate-700">
              {callLogs.map((call) => {
                const outcomeStyle = getOutcomeStyle(call.outcome);
                return (
                  <div
                    key={call.id}
                    className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800/50"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${branding.primaryColor}15` }}
                      >
                        <MessageSquare size={18} style={{ color: branding.primaryColor }} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {call.customerName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDuration(call.duration)} • {formatTime(call.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div
                      className={cn(
                        'px-3 py-1 rounded-full text-xs font-medium capitalize',
                        outcomeStyle.bg,
                        outcomeStyle.text
                      )}
                    >
                      {call.outcome.replace('_', ' ')}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
