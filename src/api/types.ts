export type ContentPlatform = "tiktok" | "youtube";

export type MetricSeriesPoint = {
  date: string;
  value: number;
};

export type UploadVideoRequest = {
  title: string;
  description?: string;
  file_path: string;
  user?: string | null;
  visibility?: "public" | "private" | "unlisted" | "friends" | "followers";
  tags?: string[];
  schedule_at?: string | null;
  async_upload?: boolean;
  thumbnail_url?: string | null;
  category_id?: string | null;
  disable_comment?: boolean | null;
  disable_duet?: boolean | null;
  disable_stitch?: boolean | null;
  is_aigc?: boolean | null;
  cover_timestamp?: number | null;
};

export type UploadVideoResponse = {
  status: string;
  platform: string;
  upload_mode: string;
  message: string;
  external_post_id: string;
  preview_url?: string | null;
};

export type HealthResponse = {
  status: string;
  service?: string;
};

export type AgentProcessStatus = {
  name: string;
  url: string;
  reachable: boolean;
  detail: string;
};

export type AgentsStatusResponse = {
  status: string;
  processes: AgentProcessStatus[];
};

export type TikTokChannelStatus = {
  channel_id: string;
  handle: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  profile_url: string;
  followers: number;
  following: number;
  total_likes: number;
  total_views: number;
  total_videos: number;
  average_views: number;
  average_likes: number;
  average_comments: number;
  average_shares: number;
  average_saves: number;
  engagement_rate: number;
  posting_frequency_per_week: number;
  average_watch_time_seconds: number;
  primary_regions: string[];
  primary_categories: string[];
};

export type TikTokVideoStats = {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  engagement_rate: number;
  trend_score: number;
};

export type TikTokVideo = {
  video_id: string;
  caption: string;
  description: string;
  hashtags: string[];
  music_title: string;
  duration_seconds: number;
  posted_at: string;
  thumbnail_url: string;
  video_url: string;
  stats: TikTokVideoStats;
};

export type TikTokTrendTopic = {
  topic_id: string;
  topic: string;
  keyword: string;
  search_volume: number;
  increase_percentage: number;
  potential_views: number;
  trend_score: number;
  related_hashtags: string[];
  source: string;
  sample_video_ids: string[];
};

export type TikTokWatcherSegment = {
  segment: string;
  affinity_score: number;
  interests: string[];
  rationale: string;
};

export type TikTokTrendOverviewSummary = {
  trend_window: string;
  hottest_topic: string;
  average_potential_views: number;
  rising_topic_count: number;
  strategist_note: string;
};

export type TikTokRecommendation = {
  recommendation_id: string;
  content_idea: string;
  hook: string;
  thumbnail_idea: string;
  voice_style: string;
  background_music: string;
  format: string;
  confidence_score: number;
  reasoning: string;
  source_topics: string[];
};

export type TikTokVideoAverages = {
  total_videos: number;
  average_views: number;
  average_likes: number;
  average_comments: number;
  average_shares: number;
  average_saves: number;
  average_engagement_rate: number;
};

export type TikTokChannelStatusResponse = {
  platform: string;
  channel: TikTokChannelStatus;
};

export type TikTokTrendsResponse = {
  platform: string;
  overview_summary: TikTokTrendOverviewSummary;
  trend_topics: TikTokTrendTopic[];
  trending_videos: TikTokVideo[];
  watcher_segments: TikTokWatcherSegment[];
};

export type TikTokRecommendationsResponse = {
  platform: string;
  recommendations: TikTokRecommendation[];
};

export type TikTokVideoDetailResponse = {
  platform: string;
  video: TikTokVideo;
};

export type TikTokVideosResponse = {
  platform: string;
  averages: TikTokVideoAverages;
  videos: TikTokVideo[];
};

export type YouTubeChannelStatus = {
  channel_id: string;
  handle: string;
  display_name: string;
  description: string;
  avatar_url: string;
  channel_url: string;
  subscribers: number;
  total_views: number;
  total_watch_hours: number;
  total_videos: number;
  average_views: number;
  average_likes: number;
  average_comments: number;
  engagement_rate: number;
  average_view_duration_seconds: number;
  click_through_rate: number;
  upload_frequency_per_week: number;
  top_regions: string[];
  traffic_sources: string[];
};

export type YouTubeVideoStats = {
  views: number;
  likes: number;
  comments: number;
  impressions: number;
  click_through_rate: number;
  average_view_duration_seconds: number;
  watch_hours: number;
  engagement_rate: number;
  trend_score: number;
};

export type YouTubeVideo = {
  video_id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  video_url: string;
  duration_seconds: number;
  published_at: string;
  stats: YouTubeVideoStats;
};

export type YouTubeTrendTopic = {
  topic_id: string;
  topic: string;
  keyword: string;
  search_volume: number;
  increase_percentage: number;
  potential_views: number;
  trend_score: number;
  related_queries: string[];
  source: string;
  sample_video_ids: string[];
};

export type YouTubeWatcherSegment = {
  segment: string;
  affinity_score: number;
  interests: string[];
  rationale: string;
};

export type YouTubeTrendOverviewSummary = {
  trend_window: string;
  hottest_topic: string;
  average_potential_views: number;
  rising_topic_count: number;
  strategist_note: string;
};

export type YouTubeRecommendation = {
  recommendation_id: string;
  content_idea: string;
  title_idea: string;
  thumbnail_idea: string;
  voice_style: string;
  background_music: string;
  format: string;
  confidence_score: number;
  reasoning: string;
  source_topics: string[];
};

export type YouTubeVideoAverages = {
  total_videos: number;
  average_views: number;
  average_likes: number;
  average_comments: number;
  average_impressions: number;
  average_click_through_rate: number;
  average_watch_hours: number;
  average_engagement_rate: number;
};

export type YouTubeChannelStatusResponse = {
  platform: string;
  channel: YouTubeChannelStatus;
};

export type YouTubeTrendsResponse = {
  platform: string;
  overview_summary: YouTubeTrendOverviewSummary;
  trend_topics: YouTubeTrendTopic[];
  trending_videos: YouTubeVideo[];
  watcher_segments: YouTubeWatcherSegment[];
};

export type YouTubeRecommendationsResponse = {
  platform: string;
  recommendations: YouTubeRecommendation[];
};

export type YouTubeVideoDetailResponse = {
  platform: string;
  video: YouTubeVideo;
};

export type YouTubeVideosResponse = {
  platform: string;
  averages: YouTubeVideoAverages;
  videos: YouTubeVideo[];
};

export type UploadPostProfile = {
  username: string;
  created_at?: string | null;
  social_accounts: Record<string, unknown>;
};

export type UploadPostCurrentUserResponse = {
  success: boolean;
  message?: string | null;
  email?: string | null;
  plan?: string | null;
};

export type UploadPostCreateProfileRequest = {
  username: string;
};

export type UploadPostProfileResponse = {
  success: boolean;
  profile: UploadPostProfile;
};

export type UploadPostProfilesResponse = {
  success: boolean;
  plan?: string | null;
  limit?: number | null;
  profiles: UploadPostProfile[];
};

export type UploadPostDeleteProfileResponse = {
  success: boolean;
  message?: string | null;
};

export type UploadPostGenerateJwtRequest = {
  username: string;
  redirect_url?: string | null;
  logo_image?: string | null;
  redirect_button_text?: string | null;
  connect_title?: string | null;
  connect_description?: string | null;
  platforms?: string[];
  show_calendar?: boolean | null;
  readonly_calendar?: boolean | null;
};

export type UploadPostGenerateJwtResponse = {
  success: boolean;
  access_url: string;
  duration?: string | null;
};

export type UploadPostValidateJwtRequest = {
  jwt_token?: string | null;
};

export type UploadPostValidateJwtResponse = {
  success?: boolean | null;
  isValid?: boolean | null;
  reason?: string | null;
  profile?: UploadPostProfile | null;
};

export type UploadPostPublishPlatform =
  | ContentPlatform
  | "instagram"
  | "facebook"
  | "x"
  | "threads"
  | "linkedin"
  | "bluesky"
  | "reddit"
  | "pinterest"
  | "google_business";

export type UploadPostPublishRequest = {
  user: string;
  platforms: UploadPostPublishPlatform[];
  title: string;
  description?: string | null;
  tags?: string[];
  first_comment?: string | null;
  schedule_post?: string | null;
  link_url?: string | null;
  subreddit?: string | null;
  asset_urls?: string[];
  files?: File[];
  user_id?: string | null;
  generated_content_id?: string | null;
};

export type PublishJobResponse = {
  id: string;
  user_id?: string | null;
  generated_content_id?: string | null;
  profile_username: string;
  platforms: string[];
  title: string;
  description?: string | null;
  tags: string[];
  first_comment?: string | null;
  schedule_post?: string | null;
  link_url?: string | null;
  subreddit?: string | null;
  asset_urls: string[];
  uploaded_files: Array<Record<string, unknown>>;
  post_kind: string;
  provider_request_id?: string | null;
  provider_job_id?: string | null;
  provider_response: Record<string, unknown>;
  status: string;
  created_at: string;
};

export type PublishJobsListResponse = {
  items: PublishJobResponse[];
};

export type UploadPostPublishResponse = {
  source: string;
  publish_job: PublishJobResponse;
  provider_payload: Record<string, unknown>;
};

export type UploadPostHistoryItem = {
  user_email: string;
  profile_username: string;
  platform: string;
  media_type: string;
  upload_timestamp: string;
  success: boolean;
  platform_post_id: string;
  post_url: string;
  media_size_bytes: number;
  post_title: string;
  post_caption: string;
  is_async: boolean;
  job_id: string;
  dashboard: boolean;
  request_id: string;
  request_total_platforms: number;
};

export type UploadPostHistoryPayload = {
  history: UploadPostHistoryItem[];
  total: number;
  page: number;
  limit: number;
};

export type UploadPostHistoryEnvelope = {
  source: string;
  payload: UploadPostHistoryPayload;
};

export type UploadPostSummaryMetrics = {
  followers: number;
  reach: number;
  views: number;
  impressions: number;
  profileViews: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
};

export type UploadPostPlatformAnalytics = {
  followers: number;
  reach: number;
  views: number;
  impressions: number;
  profileViews: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  reach_timeseries: MetricSeriesPoint[];
  impressions_timeseries: MetricSeriesPoint[];
  views_timeseries: MetricSeriesPoint[];
  likes_timeseries: MetricSeriesPoint[];
  comments_timeseries: MetricSeriesPoint[];
  shares_timeseries: MetricSeriesPoint[];
  metric_type: string;
};

export type UploadPostProfileAnalyticsPayload = {
  success: boolean;
  profile_username: string;
  start_date: string;
  end_date: string;
  platforms: Record<string, UploadPostPlatformAnalytics>;
  summary: UploadPostSummaryMetrics;
};

export type UploadPostAnalyticsEnvelope = {
  source: string;
  profile_username: string;
  payload: UploadPostProfileAnalyticsPayload;
};

export type UploadPostTotalImpressionsPayload = {
  success: boolean;
  profile_username: string;
  start_date: string;
  end_date: string;
  metrics: Record<string, number>;
  per_platform: Record<string, Record<string, number>>;
  per_day: Record<string, Record<string, number>>;
  breakdown?: Record<string, Record<string, number>>;
};

export type UploadPostTotalImpressionsEnvelope = {
  source: string;
  profile_username: string;
  payload: UploadPostTotalImpressionsPayload;
};

export type UploadPostCommentUser = {
  id: string;
  username: string;
};

export type UploadPostComment = {
  id: string;
  text: string;
  timestamp: string;
  user: UploadPostCommentUser;
};

export type UploadPostCommentsPayload = {
  success: boolean;
  comments: UploadPostComment[];
};

export type UploadPostCommentsEnvelope = {
  source: string;
  payload: UploadPostCommentsPayload;
};

export type UploadPostPostMetrics = {
  views: number;
  likes: number;
  comments: number;
  favorites: number;
  shares: number;
};

export type UploadPostProfileSnapshot = {
  followers: number;
  impressions: number;
  likes: number;
  comments: number;
  shares: number;
};

export type UploadPostPlatformPostAnalytics = {
  success: boolean;
  job_id: string;
  platform_post_id: string;
  post_url: string;
  post_metrics: UploadPostPostMetrics;
  post_metrics_source: string;
  profile_snapshot_at_post_date: UploadPostProfileSnapshot;
  comments: UploadPostComment[];
};

export type UploadPostPostInfo = {
  request_id: string;
  profile_username: string;
  post_title: string;
  post_caption: string;
  media_type: string;
  upload_timestamp: string;
};

export type UploadPostPostAnalyticsPayload = {
  success: boolean;
  post: UploadPostPostInfo;
  platforms: Record<string, UploadPostPlatformPostAnalytics>;
};

export type UploadPostPostAnalyticsEnvelope = {
  source: string;
  request_id: string;
  payload: UploadPostPostAnalyticsPayload;
};

export type PostAgentDecision = "asking" | "approve" | "deny";

export type PostAgentRequest = {
  prompt: string;
  config_id: string;
  decision: PostAgentDecision;
};

export type PostAgentResponse = {
  status: string;
  source: string;
  result_markdown: string;
};

export type TrendAnalyzeRequest = {
  query: string;
  limit?: number;
  user_id?: string | null;
};

export type TrendInterestPoint = {
  date?: string;
  timestamp?: number;
  value?: number;
};

export type TrendAnalyzeResultItem = {
  main_keyword: string;
  why_the_trend_happens: string;
  trend_score: number;
  interest_over_day: Array<number | TrendInterestPoint>;
  avg_views_per_hour: number;
  recommended_action: string;
  top_videos: string[];
  top_hashtags: string[];
  google?: Record<string, unknown> | null;
  tiktok?: Record<string, unknown> | null;
  threads?: Record<string, unknown> | null;
};

export type TrendAnalyzeResponse = {
  analysis_id?: string | null;
  query: string;
  results: TrendAnalyzeResultItem[];
  markdown_summary: string;
  error?: Record<string, unknown> | null;
};

export type TrendAnalysisRecordResponse = TrendAnalyzeResponse & {
  status: string;
  user_id?: string | null;
  created_at: string;
};

export type TrendAnalysesListResponse = {
  items: TrendAnalysisRecordResponse[];
};

export type TrendOverviewResponse = {
  keyword: string;
  region: string;
  hashtag: string;
  overview: Record<string, unknown>;
};

export type ContentGenerateRequest = {
  user_id?: string | null;
  trend_analysis_id?: string | null;
  selected_keyword?: string | null;
  prompt?: string | null;
};

export type GeneratedContentThumbnail = {
  prompt: string;
  style: string;
  size: string;
  output_path: string;
};

export type GeneratedContentPostContent = {
  post_type: string;
  title: string;
  hook: string;
  caption: string;
  description: string;
  body: string;
  call_to_action: string;
  hashtags: string[];
  tone: string;
  personalization_notes: string[];
};

export type GeneratedContentImageItem = {
  index: number;
  title: string;
  description: string;
  prompt: string;
  style: string;
  size: string;
  output_path: string;
  id: string;
  image_url: string;
  local_path: string;
  created_at: string;
  image_store_error: string;
};

export type GeneratedContentPlatformPost = {
  caption: string;
  hashtags: string[];
  cta: string;
  best_post_time: string;
  image_notes: string;
  thumbnail_description?: string;
};

export type GeneratedContentPlatformPosts = {
  tiktok?: GeneratedContentPlatformPost;
  facebook?: GeneratedContentPlatformPost;
  instagram?: GeneratedContentPlatformPost;
  [platform: string]: GeneratedContentPlatformPost | undefined;
};

export type GeneratedContentPublishing = {
  default_visibility: string;
  recommended_platforms: string[];
  timezone: string;
  weekly_content_frequency: number;
};

export type OrchestratorGeneratedContent = {
  selected_keyword: string;
  main_title: string;
  post_content: GeneratedContentPostContent;
  image_set: GeneratedContentImageItem[];
  platform_posts: GeneratedContentPlatformPosts;
  publishing: GeneratedContentPublishing;
  error?: Record<string, unknown> | null;
};

export type GeneratedContentResponse = {
  id?: string | null;
  user_id?: string | null;
  trend_analysis_id?: string | null;
  selected_keyword: string;
  main_title: string;
  post_content: GeneratedContentPostContent | Record<string, unknown>;
  image_set: GeneratedContentImageItem[] | Array<unknown>;
  platform_posts: GeneratedContentPlatformPosts | Record<string, unknown>;
  publishing: GeneratedContentPublishing | Record<string, unknown>;
  error?: Record<string, unknown> | null;
  status: string;
  created_at: string;
  // Legacy compatibility for older persisted rows and historical UI flows.
  video_script?: Record<string, unknown> | Array<unknown>;
  thumbnail?: GeneratedContentThumbnail | Record<string, unknown> | null;
  music_background?: string | null;
  raw_output?: Record<string, unknown>;
};

export type GeneratedContentsListResponse = {
  items: GeneratedContentResponse[];
};

export type OrchestratorRequest = {
  prompt: string;
  user_id?: string | null;
  save_files?: boolean;
  include_raw_response?: boolean;
};

export type OrchestratedOutput = {
  trend_analysis: TrendAnalyzeResponse;
  generated_content: OrchestratorGeneratedContent;
  persistence_skipped?: {
    reason?: string;
    details?: unknown[];
  };
};

export type OrchestratorResponse = {
  status: string;
  output: OrchestratedOutput;
  trend_analysis_id?: string | null;
  generated_content_id?: string | null;
  raw_response?: Record<string, unknown> | null;
  raw_response_file?: string | null;
  output_file?: string | null;
};

export type UserContentPreferences = {
  content_groups: string[];
  priority_formats: string[];
  keyword_hashtags: string[];
  audience_persona: string;
  focus_content_goal: string;
};

export type UserOptions = {
  timezone: string;
  linked_platforms: string[];
  default_visibility: string;
  default_post_times: Record<string, string>;
  weekly_content_frequency: number;
};

export type UserCreateRequest = {
  email: string;
  display_name?: string | null;
  phone_number?: string | null;
  location?: string | null;
  avatar_url?: string | null;
  about_me?: string | null;
  content_preferences?: Partial<UserContentPreferences>;
  options?: Partial<UserOptions>;
};

export type UserResponse = {
  id: string;
  email: string;
  display_name?: string | null;
  phone_number?: string | null;
  location?: string | null;
  avatar_url?: string | null;
  about_me?: string | null;
  content_preferences: UserContentPreferences;
  options: UserOptions;
  created_at: string;
};

export type UserSummaryResponse = UserResponse & {
  trend_analysis_count: number;
  generated_content_count: number;
  publish_job_count: number;
};

export type UsersListResponse = {
  users: UserSummaryResponse[];
};

export type UserContentCategory =
  | "wellness"
  | "education"
  | "finance"
  | "lifestyle"
  | "technology"
  | "business";

export type UserContentFormat =
  | "short_video"
  | "long_video"
  | "carousel"
  | "single_image"
  | "thread"
  | "live_stream";

export type UserVoiceTone =
  | "mentor"
  | "expert"
  | "friendly"
  | "playful"
  | "data_driven";

export type UserProfileContentDirection = {
  categories: UserContentCategory[];
  preferred_formats: UserContentFormat[];
  primary_topic: string;
  audience_persona: string;
  strategic_goal: string;
  target_keywords: string[];
  notes?: string | null;
};

export type UserProfileSettings = {
  timezone: string;
  language: string;
  posting_cadence: string;
  voice_tone: UserVoiceTone;
  content_review_mode: "balanced" | "strict" | "fast";
};

export type UserProfileContentPreferences = {
  content_groups: string[];
  priority_formats: string[];
  keyword_hashtags: string[];
  audience_persona: string;
  focus_content_goal: string;
  primary_topic: string;
  notes?: string | null;
};

export type UserProfileDefaultPostTimes = {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  [platform: string]: string | undefined;
};

export type UserProfileOptions = {
  timezone: string;
  linked_platforms: string[];
  default_visibility: "public" | "private" | "friends";
  default_post_times: UserProfileDefaultPostTimes;
  weekly_content_frequency: number;
  language: string;
  voice_tone: UserVoiceTone;
  content_review_mode: "balanced" | "strict" | "fast";
};

export type UserProfileResponse = {
  source?: "api" | "mock";
  profile: {
    user_id: string;
    email: string;
    first_name: string;
    last_name: string;
    display_name: string;
    role: string;
    department?: string | null;
    phone_number?: string | null;
    phone?: string | null;
    website?: string | null;
    location?: string | null;
    about_me?: string | null;
    bio?: string | null;
    avatar_url?: string | null;
    content_preferences: UserProfileContentPreferences;
    options: UserProfileOptions;
    content_direction?: UserProfileContentDirection;
    settings?: UserProfileSettings;
    updated_at: string;
  };
};

export type UserProfileUpdateRequest = {
  first_name?: string;
  last_name?: string;
  display_name?: string;
  role?: string;
  department?: string | null;
  phone_number?: string | null;
  phone?: string | null;
  website?: string | null;
  location?: string | null;
  about_me?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  content_preferences?: Partial<UserProfileContentPreferences>;
  content_direction?: Partial<UserProfileContentDirection>;
  options?: Partial<UserProfileOptions>;
  settings?: Partial<UserProfileSettings>;
};
