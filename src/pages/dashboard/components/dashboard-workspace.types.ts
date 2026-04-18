export type BilingualCopy = (en: string, vi: string) => string;

export type TrendPriorityItem = {
  keyword: string;
  averageScore: number;
  momentum: number;
  mentions: number;
  latestScore: number;
};

export type AgentKind = "guardian" | "content" | "scout";

export type AgentActivityItem = {
  id: string;
  kind: AgentKind;
  label: string;
  message: string;
  detail: string;
  createdAt: string;
};
