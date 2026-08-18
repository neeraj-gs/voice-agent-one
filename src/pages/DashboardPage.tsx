/**
 * Dashboard Page
 * Professional analytics dashboard with real ElevenLabs data
 *
 * Laid out as a monitoring bridge: a status strip of readouts across the top,
 * the traffic plot, a success meter instead of a donut (a meter is read at a
 * glance and a three-slice donut is not), then the call log itself.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Phone,
  RefreshCw,
  ExternalLink,
  Settings,
  ArrowRight,
  Star,
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
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui';
import { Legend, Lamp, Tag, Meter } from '../components/system/primitives';
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

/* The plot uses the rack's own colours: amber is the signal being measured,
   verdigris is the secondary series. No third hue is introduced. */
const PLOT = {
  signal: '#FF9D2E',
  second: '#3E8E7E',
  grid: '#272D35',
  axis: '#5B5750',
};

/** Tooltip drawn as a small panel so it belongs to the same machine. */
const PanelTip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="panel-lift px-3 py-2">
      <div className="legend">{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="mt-1 flex items-center gap-2">
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-jack"
            style={{ background: p.color }}
          />
          <span className="readout text-[11px] text-bone">{p.value}</span>
          <span className="legend">{p.name}</span>
        </div>
      ))}
    </div>
  );
};

const Section: React.FC<{
  label: string;
  title: string;
  hint?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}> = ({ label, title, hint, right, children, className }) => (
  <section className={cn('py-8', className)}>
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-edge-soft pb-3">
      <div>
        <Legend as="div">{label}</Legend>
        <h2 className="display-lite mt-2 text-lg text-bone">{title}</h2>
        {hint && <p className="mt-1 text-[13px] text-bone-dim">{hint}</p>}
      </div>
      {right}
    </div>
    <div className="mt-6">{children}</div>
  </section>
);

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
      setError('This business has no ElevenLabs key or agent attached yet. Add them in Settings.');
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
      setError(
        err instanceof Error ? err.message : 'Could not read the call history from ElevenLabs.'
      );
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

  const total = analytics?.totalConversations || 0;
  const ok = analytics?.successfulCalls || 0;
  const bad = analytics?.failedCalls || 0;
  const unknown = Math.max(0, total - ok - bad);

  if (!activeBusiness || !activeVoiceAgent) {
    return (
      <div className="min-h-screen bg-ink">
        <Header />
        <div className="mx-auto flex max-w-[80rem] items-center gap-3 px-5 py-20 sm:px-8">
          <Lamp state="ready" pulse />
          <Legend>Loading the business</Legend>
        </div>
      </div>
    );
  }

  const stats: [string, React.ReactNode, string][] = [
    ['Calls taken', total, 'Last 30 days'],
    ['Answered well', ok, `${analytics?.successRate || 0}% of calls`],
    ['Today', analytics?.todaysCalls || 0, 'Since midnight'],
    ['This week', analytics?.thisWeekCalls || 0, 'Last 7 days'],
    ['Average call', formatDuration(analytics?.avgDurationSecs || 0), 'Per conversation'],
    [
      'Rating',
      analytics?.avgRating ? `${analytics.avgRating}/5` : '—',
      `${analytics?.ratedConversations || 0} rated`,
    ],
  ];

  return (
    <div className="min-h-screen bg-ink">
      <Header />

      <main className="mx-auto w-full max-w-[86rem] px-5 pb-16 sm:px-8">
        {/* Page plate */}
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-edge-soft py-8">
          <div>
            <Legend as="div">Call log</Legend>
            <h1 className="display mt-3 text-[clamp(1.75rem,4vw,2.75rem)]">
              {activeVoiceAgent.name}
            </h1>
            <p className="mt-2 text-[14px] text-bone-dim">
              Everything this agent has handled for {activeBusiness.name}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="h-3.5 w-3.5 appearance-none border border-edge-bright bg-ink shadow-recess checked:border-amber checked:bg-amber"
              />
              <Legend>Refresh every 30s</Legend>
            </label>
            <Button variant="outline" size="sm" onClick={fetchData} disabled={isLoading}>
              <RefreshCw size={12} className={cn(isLoading && 'animate-spin')} />
              Refresh
            </Button>
            <a
              href={`https://elevenlabs.io/app/conversational-ai/${agentId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="legend inline-flex items-center gap-1.5 transition-colors hover:text-amber"
            >
              ElevenLabs <ExternalLink size={11} />
            </a>
          </div>
        </div>

        {error && (
          <motion.p
            role="alert"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 border border-clip-deep bg-clip/10 px-4 py-3 font-mono text-[12.5px] leading-snug text-clip"
          >
            {error}
          </motion.p>
        )}

        {/* ── STATUS STRIP ── */}
        <dl className="mt-8 grid grid-cols-2 border border-edge-soft sm:grid-cols-3 lg:grid-cols-6">
          {stats.map(([label, value, sub], i) => (
            <div
              key={label}
              className={cn(
                'border-edge-soft p-4',
                i % 2 === 1 && 'border-l',
                'sm:[&:not(:nth-child(3n+1))]:border-l',
                i >= 2 && 'border-t sm:[&:nth-child(-n+3)]:border-t-0',
                'lg:[&:not(:first-child)]:border-l lg:border-t-0'
              )}
            >
              <dt className="legend">{label}</dt>
              <dd className="readout mt-2 text-2xl leading-none text-bone">
                {isLoading ? (
                  <span className="inline-block h-6 w-10 animate-lamp-flicker bg-steel-high" />
                ) : (
                  value
                )}
              </dd>
              <p className="mt-1.5 font-mono text-[10px] text-bone-faint">{sub}</p>
            </div>
          ))}
        </dl>

        {lastRefresh && (
          <p className="mt-3 flex items-center gap-2">
            <Lamp state={autoRefresh ? 'ready' : 'off'} pulse={autoRefresh} />
            <span className="readout text-[10px] text-bone-faint">
              Read at {lastRefresh.toLocaleTimeString()}
            </span>
          </p>
        )}

        {/* ── TRAFFIC ── */}
        <div className="grid gap-x-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <Section label="Traffic" title="Calls this week" hint="Volume and total minutes per day.">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics?.conversationsByDay || []}>
                  <defs>
                    <linearGradient id="fillSignal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={PLOT.signal} stopOpacity={0.28} />
                      <stop offset="100%" stopColor={PLOT.signal} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="fillSecond" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={PLOT.second} stopOpacity={0.24} />
                      <stop offset="100%" stopColor={PLOT.second} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={PLOT.grid} strokeDasharray="2 4" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke={PLOT.axis}
                    fontSize={10}
                    fontFamily="IBM Plex Mono"
                    tickLine={false}
                    axisLine={{ stroke: PLOT.grid }}
                  />
                  <YAxis
                    stroke={PLOT.axis}
                    fontSize={10}
                    fontFamily="IBM Plex Mono"
                    tickLine={false}
                    axisLine={false}
                    width={28}
                  />
                  <Tooltip content={<PanelTip />} cursor={{ stroke: PLOT.grid }} />
                  <Area
                    type="monotone"
                    dataKey="count"
                    name="Calls"
                    stroke={PLOT.signal}
                    fill="url(#fillSignal)"
                    strokeWidth={1.5}
                  />
                  <Area
                    type="monotone"
                    dataKey="duration"
                    name="Minutes"
                    stroke={PLOT.second}
                    fill="url(#fillSecond)"
                    strokeWidth={1.5}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 flex items-center gap-6">
              {[
                ['Calls', PLOT.signal],
                ['Minutes', PLOT.second],
              ].map(([l, c]) => (
                <span key={l} className="flex items-center gap-2">
                  <span aria-hidden className="h-px w-4" style={{ background: c }} />
                  <Legend>{l}</Legend>
                </span>
              ))}
            </div>
          </Section>

          {/* A meter, not a donut. Success rate is one number on a scale. */}
          <Section label="Outcome" title="How they ended" hint="Across the last 30 days.">
            <div className="readout text-5xl leading-none text-bone">
              {analytics?.successRate || 0}
              <span className="text-2xl text-amber">%</span>
            </div>
            <Legend as="div" className="mt-2">
              Resolved successfully
            </Legend>

            <Meter
              value={(analytics?.successRate || 0) / 100}
              className="mt-6"
              segments={20}
              showScale={false}
            />

            <dl className="mt-6 divide-y divide-edge-soft border-y border-edge-soft">
              {[
                ['Resolved', ok, 'ready' as const],
                ['Failed', bad, 'clip' as const],
                ['Not classified', unknown, 'neutral' as const],
              ].map(([label, value, tone]) => (
                <div key={label as string} className="flex items-center justify-between py-2.5">
                  <dt className="flex items-center gap-2">
                    <Lamp state={tone === 'ready' ? 'ready' : tone === 'clip' ? 'clip' : 'off'} />
                    <span className="text-[13px] text-bone-dim">{label as string}</span>
                  </dt>
                  <dd className="readout text-[13px] text-bone">{value as number}</dd>
                </div>
              ))}
            </dl>
          </Section>
        </div>

        {/* ── DAILY ── */}
        <Section label="By day" title="Daily performance" hint="Calls against minutes on air.">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.conversationsByDay || []} barGap={4}>
                <CartesianGrid stroke={PLOT.grid} strokeDasharray="2 4" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke={PLOT.axis}
                  fontSize={10}
                  fontFamily="IBM Plex Mono"
                  tickLine={false}
                  axisLine={{ stroke: PLOT.grid }}
                />
                <YAxis
                  stroke={PLOT.axis}
                  fontSize={10}
                  fontFamily="IBM Plex Mono"
                  tickLine={false}
                  axisLine={false}
                  width={28}
                />
                <Tooltip content={<PanelTip />} cursor={{ fill: 'rgba(231,225,212,0.04)' }} />
                <Bar dataKey="count" name="Calls" fill={PLOT.signal} />
                <Bar dataKey="duration" name="Minutes" fill={PLOT.second} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>

        {/* ── THE LOG ── */}
        <Section
          label="Transcripts"
          title="Recent conversations"
          hint="Newest first."
          right={
            <Link to="/call">
              <Button variant="outline" size="sm">
                <Phone size={12} /> Test the agent
              </Button>
            </Link>
          }
        >
          {isLoading ? (
            <ul className="divide-y divide-edge-soft border-y border-edge-soft">
              {[1, 2, 3, 4, 5].map((i) => (
                <li key={i} className="flex items-center gap-4 py-4">
                  <span className="h-2 w-2 animate-lamp-flicker rounded-jack bg-steel-high" />
                  <span className="h-3 w-1/3 animate-lamp-flicker bg-steel-high" />
                  <span className="ml-auto h-3 w-16 animate-lamp-flicker bg-steel-high" />
                </li>
              ))}
            </ul>
          ) : !analytics || analytics.conversations.length === 0 ? (
            <div className="max-w-lg py-8">
              <h3 className="display-lite text-lg text-bone">Nothing logged yet</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-bone-dim">
                As soon as someone talks to {activeVoiceAgent.name}, the call appears here with
                its duration, outcome and a written summary. Try it yourself first.
              </p>
              <Link to="/call" className="mt-5 inline-block">
                <Button size="md">
                  Start a test call <ArrowRight size={13} />
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="hidden grid-cols-[auto_minmax(0,3fr)_auto_auto_auto] items-center gap-4 border-b border-edge px-1 pb-2 md:grid">
                <span className="w-2" />
                <Legend>Summary</Legend>
                <Legend>Length</Legend>
                <Legend>When</Legend>
                <Legend className="text-right">Outcome</Legend>
              </div>

              <ul className="divide-y divide-edge-soft border-b border-edge-soft">
                {analytics.conversations.map((c, index) => {
                  const good = c.call_successful === 'success';
                  const failed = c.call_successful === 'failure';
                  return (
                    <motion.li
                      key={c.conversation_id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(index * 0.03, 0.3) }}
                      className="grid items-start gap-x-4 gap-y-2 px-1 py-4 transition-colors hover:bg-steel-lift md:grid-cols-[auto_minmax(0,3fr)_auto_auto_auto] md:items-center"
                    >
                      <Lamp state={good ? 'ready' : failed ? 'clip' : 'off'} className="mt-1.5 md:mt-0" />

                      <div className="min-w-0">
                        <p className="truncate text-[14px] text-bone">
                          {c.call_summary_title || 'Conversation'}
                        </p>
                        {c.transcript_summary && (
                          <p className="mt-1 line-clamp-1 text-[12.5px] text-bone-faint">
                            {c.transcript_summary}
                          </p>
                        )}
                        <p className="mt-1 font-mono text-[10px] text-bone-faint">
                          {c.message_count} messages
                        </p>
                      </div>

                      <span className="readout text-[12px] text-bone-dim">
                        {formatDuration(c.call_duration_secs)}
                      </span>
                      <span className="readout text-[12px] text-bone-faint">
                        {formatRelativeTime(c.start_time_unix_secs)}
                      </span>

                      <span className="flex items-center justify-start gap-2 md:justify-end">
                        {c.rating && (
                          <span className="flex items-center gap-1 text-amber">
                            <Star size={11} fill="currentColor" />
                            <span className="readout text-[11px]">{c.rating}</span>
                          </span>
                        )}
                        <Tag tone={good ? 'ready' : failed ? 'clip' : 'neutral'}>
                          {c.call_successful}
                        </Tag>
                      </span>
                    </motion.li>
                  );
                })}
              </ul>
            </>
          )}
        </Section>

        {/* ── ELSEWHERE ── */}
        <nav className="grid gap-px border border-edge-soft bg-edge-soft sm:grid-cols-3">
          {[
            { to: '/call', label: 'Test the agent', hint: 'Open the line yourself', icon: Phone },
            { to: '/settings/agent', label: 'Edit the agent', hint: 'Prompt, voice, tools', icon: Settings },
            {
              to: `https://elevenlabs.io/app/conversational-ai/${agentId}`,
              label: 'ElevenLabs console',
              hint: 'Advanced settings',
              icon: ExternalLink,
              external: true,
            },
          ].map((a) => {
            const inner = (
              <>
                <a.icon size={14} className="text-bone-faint transition-colors group-hover:text-amber" />
                <span className="min-w-0 flex-1">
                  <span className="display-lite block text-[13px] text-bone">{a.label}</span>
                  <span className="mt-0.5 block text-[12.5px] text-bone-dim">{a.hint}</span>
                </span>
                <ArrowRight
                  size={13}
                  className="text-bone-faint transition-transform group-hover:translate-x-1"
                />
              </>
            );
            const cls =
              'group flex items-center gap-3.5 bg-ink p-5 transition-colors hover:bg-steel';
            return a.external ? (
              <a key={a.to} href={a.to} target="_blank" rel="noopener noreferrer" className={cls}>
                {inner}
              </a>
            ) : (
              <Link key={a.to} to={a.to} className={cls}>
                {inner}
              </Link>
            );
          })}
        </nav>
      </main>
    </div>
  );
};
