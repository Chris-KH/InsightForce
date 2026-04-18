export type BilingualCopy = (en: string, vi: string) => string;

export type TrendSessionState = {
  sessionId: string;
  prompts: string[];
  suggestions: string[];
};

export type TrendTopic = {
  keyword: string;
  trendScore: number;
  growthPercent: number;
  avgViewsPerHour: number;
  why: string;
  action: string;
  hashtags: string[];
  sparkline: number[];
};
