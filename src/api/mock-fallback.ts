import { ApiError } from "@/api/http-client";
import type {
  AgentsStatusResponse,
  TikTokChannelStatusResponse,
  TikTokRecommendation,
  TikTokRecommendationsResponse,
  TikTokTrendsResponse,
  TikTokVideo,
  TikTokVideoDetailResponse,
  TikTokVideosResponse,
  TrendAnalyzeResponse,
  TrendOverviewResponse,
  YouTubeChannelStatusResponse,
  YouTubeRecommendation,
  YouTubeRecommendationsResponse,
  YouTubeTrendsResponse,
  YouTubeVideo,
  YouTubeVideoDetailResponse,
  YouTubeVideosResponse,
} from "@/api/types";

const OFFLINE_BACKOFF_MS = 5 * 60 * 1000;
const FALLBACK_STATUSES = new Set([0, 400, 404, 422, 429, 500, 502, 503, 504]);
const endpointOfflineUntil = new Map<string, number>();

function now() {
  return Date.now();
}

function isEndpointOffline(endpointKey: string) {
  const offlineUntil = endpointOfflineUntil.get(endpointKey);
  if (!offlineUntil) {
    return false;
  }

  if (offlineUntil <= now()) {
    endpointOfflineUntil.delete(endpointKey);
    return false;
  }

  return true;
}

function markEndpointOffline(endpointKey: string) {
  endpointOfflineUntil.set(endpointKey, now() + OFFLINE_BACKOFF_MS);
}

function shouldFallback(error: unknown) {
  if (!(error instanceof ApiError)) {
    return true;
  }

  return FALLBACK_STATUSES.has(error.status);
}

export async function withApiMockFallback<T>(
  endpointKey: string,
  requestFn: () => Promise<T>,
  mockFn: () => T,
): Promise<T> {
  if (isEndpointOffline(endpointKey)) {
    return mockFn();
  }

  try {
    return await requestFn();
  } catch (error) {
    if (!shouldFallback(error)) {
      throw error;
    }

    markEndpointOffline(endpointKey);
    return mockFn();
  }
}

const tiktokVideosMock: TikTokVideo[] = [
  {
    video_id: "tt_mock_001",
    caption: "AI workflow cho creator trong 30 giay",
    description: "Tips toi uu quy trinh san xuat video ngan bang AI tools.",
    hashtags: ["#aicreator", "#videoai", "#contentstrategy"],
    music_title: "Future Pulse",
    duration_seconds: 34,
    posted_at: "2026-04-14T09:10:00.000Z",
    thumbnail_url:
      "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?w=1200",
    video_url: "https://www.tiktok.com/@insightforge/video/tt_mock_001",
    stats: {
      views: 182000,
      likes: 11300,
      comments: 690,
      shares: 1480,
      saves: 1120,
      engagement_rate: 0.079,
      trend_score: 84.5,
    },
  },
  {
    video_id: "tt_mock_002",
    caption: "Top 3 chu de content trend tuan nay",
    description: "Tong hop tu khoa dang tang nhanh tren social media.",
    hashtags: ["#trending", "#socialmedia", "#creator"],
    music_title: "Momentum Beat",
    duration_seconds: 42,
    posted_at: "2026-04-13T13:30:00.000Z",
    thumbnail_url:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200",
    video_url: "https://www.tiktok.com/@insightforge/video/tt_mock_002",
    stats: {
      views: 133000,
      likes: 8200,
      comments: 410,
      shares: 980,
      saves: 730,
      engagement_rate: 0.073,
      trend_score: 76.2,
    },
  },
  {
    video_id: "tt_mock_003",
    caption: "Case study: tu 0 den 1M reach",
    description: "Phan tich luong noi dung va cach scale reach theo niche.",
    hashtags: ["#caseStudy", "#reach", "#growth"],
    music_title: "Launch Signal",
    duration_seconds: 57,
    posted_at: "2026-04-12T18:20:00.000Z",
    thumbnail_url:
      "https://images.unsplash.com/photo-1551281044-8c4e5f3a7f31?w=1200",
    video_url: "https://www.tiktok.com/@insightforge/video/tt_mock_003",
    stats: {
      views: 98000,
      likes: 6030,
      comments: 340,
      shares: 810,
      saves: 590,
      engagement_rate: 0.069,
      trend_score: 71.4,
    },
  },
];

const youtubeVideosMock: YouTubeVideo[] = [
  {
    video_id: "yt_mock_001",
    title: "Trend Intelligence Dashboard Walkthrough",
    description:
      "Demo cach doc trend score, velocity va action cho creator team.",
    thumbnail_url:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200",
    video_url: "https://www.youtube.com/watch?v=yt_mock_001",
    duration_seconds: 542,
    published_at: "2026-04-14T07:20:00.000Z",
    stats: {
      views: 214000,
      likes: 10200,
      comments: 1200,
      impressions: 1020000,
      click_through_rate: 0.064,
      average_view_duration_seconds: 248,
      watch_hours: 14800,
      engagement_rate: 0.053,
      trend_score: 82.3,
    },
  },
  {
    video_id: "yt_mock_002",
    title: "How to plan weekly content from trend signals",
    description: "Framework 3 buoc de chon chu de va format cho tuan moi.",
    thumbnail_url:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=1200",
    video_url: "https://www.youtube.com/watch?v=yt_mock_002",
    duration_seconds: 688,
    published_at: "2026-04-13T09:45:00.000Z",
    stats: {
      views: 163000,
      likes: 7900,
      comments: 860,
      impressions: 891000,
      click_through_rate: 0.058,
      average_view_duration_seconds: 231,
      watch_hours: 11300,
      engagement_rate: 0.049,
      trend_score: 77.8,
    },
  },
  {
    video_id: "yt_mock_003",
    title: "AI tools for short-form production pipeline",
    description: "Danh gia cong cu va workflow toi uu cho team nho.",
    thumbnail_url:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200",
    video_url: "https://www.youtube.com/watch?v=yt_mock_003",
    duration_seconds: 721,
    published_at: "2026-04-12T14:10:00.000Z",
    stats: {
      views: 119000,
      likes: 5810,
      comments: 640,
      impressions: 632000,
      click_through_rate: 0.061,
      average_view_duration_seconds: 212,
      watch_hours: 8400,
      engagement_rate: 0.047,
      trend_score: 72.5,
    },
  },
];

function buildTikTokRecommendations(): TikTokRecommendation[] {
  return [
    {
      recommendation_id: "tt_rec_001",
      content_idea: "Mau script 30s de tom tat trend nhanh",
      hook: "3 trend dang bung no trong 24h qua",
      thumbnail_idea: "Bieu do + text 24H TREND",
      voice_style: "fast-paced",
      background_music: "electro",
      format: "listicle",
      confidence_score: 0.91,
      reasoning: "Trend score cao va velocity on dinh o nhom creator",
      source_topics: ["creator ai", "content trend"],
    },
    {
      recommendation_id: "tt_rec_002",
      content_idea: "Case study 1 ngay len plan 7 ngay",
      hook: "Tu trend du lieu den calendar content",
      thumbnail_idea: "Calendar + trend nodes",
      voice_style: "coach",
      background_music: "chill",
      format: "case-study",
      confidence_score: 0.86,
      reasoning: "Nhu cau content planning tang theo tuan",
      source_topics: ["weekly plan", "trend mapping"],
    },
    {
      recommendation_id: "tt_rec_003",
      content_idea: "Sai lam thuong gap khi bam trend",
      hook: "3 loi khien trend score cao van flop",
      thumbnail_idea: "Warning icon + analytics",
      voice_style: "analyst",
      background_music: "minimal",
      format: "education",
      confidence_score: 0.81,
      reasoning: "Audience quan tam den quality gate va execution",
      source_topics: ["execution risk", "quality gate"],
    },
  ];
}

function buildYouTubeRecommendations(): YouTubeRecommendation[] {
  return [
    {
      recommendation_id: "yt_rec_001",
      content_idea: "Trend graph deep dive cho team marketing",
      title_idea: "How To Read Trend Graphs Like A Strategist",
      thumbnail_idea: "Node graph + glow labels",
      voice_style: "expert",
      background_music: "ambient",
      format: "tutorial",
      confidence_score: 0.9,
      reasoning: "Nhom B2B creator can huong dan doc du lieu trend",
      source_topics: ["trend graph", "data storytelling"],
    },
    {
      recommendation_id: "yt_rec_002",
      content_idea: "Prompt engineering cho trend discovery",
      title_idea: "Prompt Better Trends In 5 Minutes",
      thumbnail_idea: "Prompt box + growth chart",
      voice_style: "mentor",
      background_music: "cinematic",
      format: "framework",
      confidence_score: 0.84,
      reasoning: "Tu khoa lien quan prompt va trend tang deu",
      source_topics: ["prompt design", "trend discovery"],
    },
    {
      recommendation_id: "yt_rec_003",
      content_idea: "Tu trend signal den action playbook",
      title_idea: "From Signal To Action: Weekly Content Ops",
      thumbnail_idea: "Pipeline map",
      voice_style: "practical",
      background_music: "soft-beat",
      format: "playbook",
      confidence_score: 0.8,
      reasoning: "Nguoi dung can hanh dong cu the thay vi insight chung",
      source_topics: ["ops playbook", "execution"],
    },
  ];
}

export function getMockAgentsStatus(): AgentsStatusResponse {
  return {
    status: "degraded",
    processes: [
      {
        name: "trend-agent",
        url: "http://127.0.0.1:8101",
        reachable: true,
        detail: "Running in mock fallback mode",
      },
      {
        name: "posting-agent",
        url: "http://127.0.0.1:8102",
        reachable: false,
        detail: "Unavailable; using frontend fallback",
      },
      {
        name: "planning-agent",
        url: "http://127.0.0.1:8103",
        reachable: true,
        detail: "Heartbeat simulated for UI preview",
      },
    ],
  };
}

export function getMockTikTokChannelStatus(): TikTokChannelStatusResponse {
  return {
    platform: "tiktok",
    channel: {
      channel_id: "tt_channel_mock",
      handle: "@insightforce",
      display_name: "InsightForce TikTok",
      bio: "Trend intelligence and creator operations",
      avatar_url:
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500",
      profile_url: "https://www.tiktok.com/@insightforce",
      followers: 284000,
      following: 84,
      total_likes: 3100000,
      total_views: 18600000,
      total_videos: 154,
      average_views: 121000,
      average_likes: 7200,
      average_comments: 410,
      average_shares: 980,
      average_saves: 760,
      engagement_rate: 0.073,
      posting_frequency_per_week: 8,
      average_watch_time_seconds: 23.4,
      primary_regions: ["VN", "US"],
      primary_categories: ["Marketing", "Creator Economy"],
    },
  };
}

export function getMockTikTokTrends(): TikTokTrendsResponse {
  return {
    platform: "tiktok",
    overview_summary: {
      trend_window: "24h",
      hottest_topic: "creator ai workflow",
      average_potential_views: 168000,
      rising_topic_count: 12,
      strategist_note:
        "Signals show strong momentum for practical AI workflow content.",
    },
    trend_topics: [
      {
        topic_id: "tt_topic_001",
        topic: "Creator AI workflow",
        keyword: "ai workflow creator",
        search_volume: 78000,
        increase_percentage: 34,
        potential_views: 240000,
        trend_score: 88.5,
        related_hashtags: ["#aicreator", "#workflow", "#contentops"],
        source: "fallback",
        sample_video_ids: ["tt_mock_001", "tt_mock_002"],
      },
      {
        topic_id: "tt_topic_002",
        topic: "Weekly trend planning",
        keyword: "weekly content planning",
        search_volume: 51000,
        increase_percentage: 27,
        potential_views: 176000,
        trend_score: 79.8,
        related_hashtags: ["#contentplan", "#weeklyplan"],
        source: "fallback",
        sample_video_ids: ["tt_mock_002", "tt_mock_003"],
      },
      {
        topic_id: "tt_topic_003",
        topic: "Prompt and hooks",
        keyword: "prompt content hook",
        search_volume: 42000,
        increase_percentage: 22,
        potential_views: 129000,
        trend_score: 72.6,
        related_hashtags: ["#prompt", "#hookwriting"],
        source: "fallback",
        sample_video_ids: ["tt_mock_001", "tt_mock_003"],
      },
    ],
    trending_videos: tiktokVideosMock,
    watcher_segments: [
      {
        segment: "Creator founders",
        affinity_score: 0.86,
        interests: ["automation", "marketing", "ai tools"],
        rationale: "High retention on practical workflow demos.",
      },
      {
        segment: "Solo marketers",
        affinity_score: 0.8,
        interests: ["growth", "content strategy"],
        rationale: "Strong save rate on planning templates.",
      },
    ],
  };
}

export function getMockTikTokRecommendations(): TikTokRecommendationsResponse {
  return {
    platform: "tiktok",
    recommendations: buildTikTokRecommendations(),
  };
}

export function getMockTikTokVideos(): TikTokVideosResponse {
  const totals = tiktokVideosMock.reduce(
    (acc, video) => {
      acc.views += video.stats.views;
      acc.likes += video.stats.likes;
      acc.comments += video.stats.comments;
      acc.shares += video.stats.shares;
      acc.saves += video.stats.saves;
      acc.engagement += video.stats.engagement_rate;
      return acc;
    },
    { views: 0, likes: 0, comments: 0, shares: 0, saves: 0, engagement: 0 },
  );

  const total = tiktokVideosMock.length || 1;

  return {
    platform: "tiktok",
    averages: {
      total_videos: tiktokVideosMock.length,
      average_views: totals.views / total,
      average_likes: totals.likes / total,
      average_comments: totals.comments / total,
      average_shares: totals.shares / total,
      average_saves: totals.saves / total,
      average_engagement_rate: totals.engagement / total,
    },
    videos: tiktokVideosMock,
  };
}

export function getMockTikTokVideo(videoId: string): TikTokVideoDetailResponse {
  const video =
    tiktokVideosMock.find((item) => item.video_id === videoId) ??
    tiktokVideosMock[0];

  return {
    platform: "tiktok",
    video,
  };
}

export function getMockYouTubeChannelStatus(): YouTubeChannelStatusResponse {
  return {
    platform: "youtube",
    channel: {
      channel_id: "yt_channel_mock",
      handle: "@insightforce",
      display_name: "InsightForce YouTube",
      description: "Trend analytics and growth playbooks for creator teams",
      avatar_url:
        "https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=500",
      channel_url: "https://www.youtube.com/@insightforce",
      subscribers: 198000,
      total_views: 25400000,
      total_watch_hours: 92000,
      total_videos: 213,
      average_views: 94000,
      average_likes: 5100,
      average_comments: 720,
      engagement_rate: 0.051,
      average_view_duration_seconds: 216,
      click_through_rate: 0.059,
      upload_frequency_per_week: 3,
      top_regions: ["VN", "US", "IN"],
      traffic_sources: ["browse", "search", "suggested"],
    },
  };
}

export function getMockYouTubeTrends(): YouTubeTrendsResponse {
  return {
    platform: "youtube",
    overview_summary: {
      trend_window: "24h",
      hottest_topic: "trend graph strategy",
      average_potential_views: 154000,
      rising_topic_count: 9,
      strategist_note:
        "Search + long-form explainers are trending for strategy audiences.",
    },
    trend_topics: [
      {
        topic_id: "yt_topic_001",
        topic: "Trend graph strategy",
        keyword: "trend graph analysis",
        search_volume: 64000,
        increase_percentage: 31,
        potential_views: 210000,
        trend_score: 84.9,
        related_queries: ["trend map", "strategy dashboard"],
        source: "fallback",
        sample_video_ids: ["yt_mock_001", "yt_mock_002"],
      },
      {
        topic_id: "yt_topic_002",
        topic: "Prompt trend research",
        keyword: "prompt trend discovery",
        search_volume: 47000,
        increase_percentage: 25,
        potential_views: 162000,
        trend_score: 77.2,
        related_queries: ["prompt ideas", "trend prompts"],
        source: "fallback",
        sample_video_ids: ["yt_mock_002", "yt_mock_003"],
      },
      {
        topic_id: "yt_topic_003",
        topic: "Content ops playbook",
        keyword: "content ops workflow",
        search_volume: 38000,
        increase_percentage: 19,
        potential_views: 121000,
        trend_score: 70.8,
        related_queries: ["content operations", "creator workflow"],
        source: "fallback",
        sample_video_ids: ["yt_mock_001", "yt_mock_003"],
      },
    ],
    trending_videos: youtubeVideosMock,
    watcher_segments: [
      {
        segment: "Growth leads",
        affinity_score: 0.84,
        interests: ["analytics", "ops", "experiments"],
        rationale: "High watch duration on practical strategy topics.",
      },
      {
        segment: "Creator teams",
        affinity_score: 0.78,
        interests: ["planning", "publishing"],
        rationale: "Strong repeat view behavior on workflow content.",
      },
    ],
  };
}

export function getMockYouTubeRecommendations(): YouTubeRecommendationsResponse {
  return {
    platform: "youtube",
    recommendations: buildYouTubeRecommendations(),
  };
}

export function getMockYouTubeVideos(): YouTubeVideosResponse {
  const totals = youtubeVideosMock.reduce(
    (acc, video) => {
      acc.views += video.stats.views;
      acc.likes += video.stats.likes;
      acc.comments += video.stats.comments;
      acc.impressions += video.stats.impressions;
      acc.ctr += video.stats.click_through_rate;
      acc.watchHours += video.stats.watch_hours;
      acc.engagement += video.stats.engagement_rate;
      return acc;
    },
    {
      views: 0,
      likes: 0,
      comments: 0,
      impressions: 0,
      ctr: 0,
      watchHours: 0,
      engagement: 0,
    },
  );

  const total = youtubeVideosMock.length || 1;

  return {
    platform: "youtube",
    averages: {
      total_videos: youtubeVideosMock.length,
      average_views: totals.views / total,
      average_likes: totals.likes / total,
      average_comments: totals.comments / total,
      average_impressions: totals.impressions / total,
      average_click_through_rate: totals.ctr / total,
      average_watch_hours: totals.watchHours / total,
      average_engagement_rate: totals.engagement / total,
    },
    videos: youtubeVideosMock,
  };
}

export function getMockYouTubeVideo(
  videoId: string,
): YouTubeVideoDetailResponse {
  const video =
    youtubeVideosMock.find((item) => item.video_id === videoId) ??
    youtubeVideosMock[0];

  return {
    platform: "youtube",
    video,
  };
}

function toTrendResult(
  query: string,
  suffix: string,
  score: number,
  views: number,
) {
  return {
    main_keyword: `${query} ${suffix}`,
    why_the_trend_happens:
      "Demand is rising from both search momentum and short-form discussion velocity.",
    trend_score: score,
    interest_over_day: [
      { timestamp: 1, value: 14 },
      { timestamp: 2, value: 26 },
      { timestamp: 3, value: 38 },
      { timestamp: 4, value: 48 },
      { timestamp: 5, value: 59 },
      { timestamp: 6, value: 67 },
      { timestamp: 7, value: 74 },
      { timestamp: 8, value: 83 },
    ],
    avg_views_per_hour: views,
    recommended_action:
      "Build one short-form explainer and one case-study post in the next 24 hours.",
    top_hashtags: ["#trend", "#contentstrategy", "#creatorops"],
  };
}

export function getMockTrendAnalyze(query: string): TrendAnalyzeResponse {
  const normalizedQuery = query.trim() || "xu huong";

  return {
    query: normalizedQuery,
    results: [
      toTrendResult(normalizedQuery, "insight", 86, 182000),
      toTrendResult(normalizedQuery, "ke hoach", 78, 126000),
      toTrendResult(normalizedQuery, "thuc chien", 71, 94000),
    ],
    markdown_summary:
      "Mock mode: trend analysis is generated locally because the backend endpoint is currently unavailable.",
    error: null,
  };
}

export function getMockTrendOverview(params: {
  keyword?: string;
  region?: string;
  hashtag?: string;
}): TrendOverviewResponse {
  const keyword = params.keyword?.trim() || "ai video editor";
  const region = params.region?.trim() || "VN";
  const hashtag = params.hashtag?.trim() || "aivideo";

  return {
    keyword,
    region,
    hashtag,
    overview: {
      message:
        "Mock overview is active because backend trend overview is unavailable.",
      suggested_query: keyword,
      suggested_hashtag: hashtag,
      region,
      refreshed_at: new Date().toISOString(),
    },
  };
}
