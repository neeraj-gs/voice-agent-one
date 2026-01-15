/**
 * ElevenLabs Analytics Service
 * Fetches real conversation data and analytics from ElevenLabs API
 */

const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

// Types for ElevenLabs conversation data
export interface ConversationSummary {
  agent_id: string;
  conversation_id: string;
  start_time_unix_secs: number;
  call_duration_secs: number;
  message_count: number;
  status: 'initiated' | 'in-progress' | 'processing' | 'done' | 'failed';
  call_successful: 'success' | 'failure' | 'unknown';
  direction?: 'inbound' | 'outbound';
  rating?: number;
  transcript_summary?: string;
  call_summary_title?: string;
  agent_name?: string;
}

export interface ConversationDetail {
  agent_id: string;
  conversation_id: string;
  status: string;
  transcript: TranscriptTurn[];
  metadata: ConversationMetadata;
  analysis?: ConversationAnalysis;
}

export interface TranscriptTurn {
  role: 'user' | 'agent';
  message: string;
  time_in_call_secs?: number;
}

export interface ConversationMetadata {
  start_time_unix_secs: number;
  call_duration_secs: number;
  cost?: number;
  termination_reason?: string;
}

export interface ConversationAnalysis {
  call_successful?: string;
  transcript_summary?: string;
}

export interface ConversationsResponse {
  conversations: ConversationSummary[];
  next_cursor?: string;
  has_more: boolean;
}

export interface AnalyticsData {
  totalConversations: number;
  successfulCalls: number;
  failedCalls: number;
  totalDurationSecs: number;
  avgDurationSecs: number;
  avgRating: number;
  ratedConversations: number;
  todaysCalls: number;
  thisWeekCalls: number;
  conversationsByDay: { date: string; count: number; duration: number }[];
  successRate: number;
  conversations: ConversationSummary[];
}

/**
 * Fetch all conversations for an agent
 */
export async function getConversations(
  apiKey: string,
  agentId: string,
  options?: {
    pageSize?: number;
    cursor?: string;
    startAfter?: number;
    startBefore?: number;
  }
): Promise<ConversationsResponse> {
  const params = new URLSearchParams();
  params.set('agent_id', agentId);
  params.set('page_size', String(options?.pageSize || 100));

  if (options?.cursor) {
    params.set('cursor', options.cursor);
  }
  if (options?.startAfter) {
    params.set('call_start_after_unix', String(options.startAfter));
  }
  if (options?.startBefore) {
    params.set('call_start_before_unix', String(options.startBefore));
  }

  const response = await fetch(
    `${ELEVENLABS_API_URL}/convai/conversations?${params.toString()}`,
    {
      headers: {
        'xi-api-key': apiKey,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Failed to fetch conversations:', errorText);
    throw new Error(`Failed to fetch conversations: ${response.status}`);
  }

  return response.json();
}

/**
 * Get detailed conversation including transcript
 */
export async function getConversationDetail(
  apiKey: string,
  conversationId: string
): Promise<ConversationDetail> {
  const response = await fetch(
    `${ELEVENLABS_API_URL}/convai/conversations/${conversationId}`,
    {
      headers: {
        'xi-api-key': apiKey,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch conversation: ${response.status}`);
  }

  return response.json();
}

/**
 * Calculate analytics from conversation data
 */
export function calculateAnalytics(conversations: ConversationSummary[]): AnalyticsData {
  const todayStart = Math.floor(new Date().setHours(0, 0, 0, 0) / 1000);
  const weekStart = todayStart - 7 * 24 * 60 * 60;

  // Filter completed conversations
  const completedConversations = conversations.filter(c => c.status === 'done');

  // Basic counts
  const totalConversations = completedConversations.length;
  const successfulCalls = completedConversations.filter(c => c.call_successful === 'success').length;
  const failedCalls = completedConversations.filter(c => c.call_successful === 'failure').length;

  // Duration calculations
  const totalDurationSecs = completedConversations.reduce((sum, c) => sum + (c.call_duration_secs || 0), 0);
  const avgDurationSecs = totalConversations > 0 ? Math.round(totalDurationSecs / totalConversations) : 0;

  // Rating calculations
  const ratedConversations = completedConversations.filter(c => c.rating !== undefined && c.rating !== null);
  const avgRating = ratedConversations.length > 0
    ? ratedConversations.reduce((sum, c) => sum + (c.rating || 0), 0) / ratedConversations.length
    : 0;

  // Time-based counts
  const todaysCalls = completedConversations.filter(c => c.start_time_unix_secs >= todayStart).length;
  const thisWeekCalls = completedConversations.filter(c => c.start_time_unix_secs >= weekStart).length;

  // Group by day for chart
  const dayMap = new Map<string, { count: number; duration: number }>();

  // Initialize last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });
    dayMap.set(dateStr, { count: 0, duration: 0 });
  }

  // Populate with actual data
  completedConversations.forEach(c => {
    const date = new Date(c.start_time_unix_secs * 1000);
    const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });
    if (dayMap.has(dateStr)) {
      const current = dayMap.get(dateStr)!;
      dayMap.set(dateStr, {
        count: current.count + 1,
        duration: current.duration + (c.call_duration_secs || 0),
      });
    }
  });

  const conversationsByDay = Array.from(dayMap.entries()).map(([date, data]) => ({
    date,
    count: data.count,
    duration: Math.round(data.duration / 60), // Convert to minutes
  }));

  // Success rate
  const successRate = totalConversations > 0
    ? Math.round((successfulCalls / totalConversations) * 100)
    : 0;

  return {
    totalConversations,
    successfulCalls,
    failedCalls,
    totalDurationSecs,
    avgDurationSecs,
    avgRating: Math.round(avgRating * 10) / 10,
    ratedConversations: ratedConversations.length,
    todaysCalls,
    thisWeekCalls,
    conversationsByDay,
    successRate,
    conversations: completedConversations.slice(0, 20), // Latest 20 for display
  };
}

/**
 * Fetch and calculate all analytics for an agent
 */
export async function fetchAgentAnalytics(
  apiKey: string,
  agentId: string
): Promise<AnalyticsData> {
  // Fetch conversations from last 30 days
  const thirtyDaysAgo = Math.floor((Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000);

  let allConversations: ConversationSummary[] = [];
  let cursor: string | undefined;
  let hasMore = true;

  // Paginate through all conversations
  while (hasMore) {
    const response = await getConversations(apiKey, agentId, {
      pageSize: 100,
      cursor,
      startAfter: thirtyDaysAgo,
    });

    allConversations = [...allConversations, ...response.conversations];
    cursor = response.next_cursor ?? undefined;
    hasMore = response.has_more;

    // Safety limit
    if (allConversations.length >= 1000) break;
  }

  return calculateAnalytics(allConversations);
}

/**
 * Format duration in seconds to human readable string
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins < 60) {
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  }
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return `${hours}h ${remainingMins}m`;
}

/**
 * Format Unix timestamp to relative time
 */
export function formatRelativeTime(unixSecs: number): string {
  const now = Date.now() / 1000;
  const diff = now - unixSecs;

  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;

  const date = new Date(unixSecs * 1000);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Format Unix timestamp to time string
 */
export function formatTime(unixSecs: number): string {
  const date = new Date(unixSecs * 1000);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Format Unix timestamp to date string
 */
export function formatDate(unixSecs: number): string {
  const date = new Date(unixSecs * 1000);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
