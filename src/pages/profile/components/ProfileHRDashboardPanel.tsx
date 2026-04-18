import { useMemo } from "react";
import {
  CheckCircle2,
  Clock3,
  PencilLine,
  RotateCcw,
  Save,
  Sparkles,
  Upload,
} from "lucide-react";

import type { UserProfileResponse } from "@/api/types";
import { PanelCard, ProgressBar } from "@/components/app-section";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useBilingual } from "@/hooks/use-bilingual";
import { formatDateTime } from "@/lib/insight-formatters";
import { cn } from "@/lib/utils";
import type { ProfileTimelineEvent } from "@/pages/profile/types";

type UserProfile = UserProfileResponse["profile"];

type ProfileHRDashboardPanelProps = {
  profile: UserProfile;
  isDirty: boolean;
  timeline: ProfileTimelineEvent[];
};

type DashboardMetric = {
  label: string;
  value: string;
  detail: string;
  score?: number;
};

function computeCompletionRatio(profile: UserProfile) {
  const checkpoints = [
    profile.first_name,
    profile.last_name,
    profile.display_name,
    profile.role,
    profile.department,
    profile.phone_number,
    profile.location,
    profile.about_me,
    profile.avatar_url,
  ];

  const completed = checkpoints.filter((item) => Boolean(item?.trim())).length;
  return Math.round((completed / checkpoints.length) * 100);
}

function computeDirectionReadiness(profile: UserProfile) {
  const scoreItems = [
    profile.content_preferences.content_groups.length >= 2,
    profile.content_preferences.priority_formats.length >= 2,
    profile.content_preferences.keyword_hashtags.length >= 5,
    profile.content_preferences.primary_topic.trim().length > 4,
    profile.content_preferences.audience_persona.trim().length > 8,
    profile.content_preferences.focus_content_goal.trim().length > 20,
  ];

  const completed = scoreItems.filter(Boolean).length;
  return Math.round((completed / scoreItems.length) * 100);
}

function getMetricTone(score: number) {
  if (score >= 80) {
    return "text-emerald-500";
  }

  if (score >= 60) {
    return "text-chart-2";
  }

  return "text-chart-3";
}

function TimelineEventIcon({ kind }: { kind: ProfileTimelineEvent["kind"] }) {
  if (kind === "save") {
    return <Save className="size-4" />;
  }

  if (kind === "reset") {
    return <RotateCcw className="size-4" />;
  }

  if (kind === "avatar") {
    return <Upload className="size-4" />;
  }

  if (kind === "edit") {
    return <PencilLine className="size-4" />;
  }

  return <CheckCircle2 className="size-4" />;
}

export function ProfileHRDashboardPanel({
  profile,
  isDirty,
  timeline,
}: ProfileHRDashboardPanelProps) {
  const copy = useBilingual();

  const metrics = useMemo<DashboardMetric[]>(() => {
    const completionScore = computeCompletionRatio(profile);
    const directionScore = computeDirectionReadiness(profile);
    const keywordCount = profile.content_preferences.keyword_hashtags.length;
    const daysFromLastUpdate = Math.max(
      0,
      Math.floor(
        (Date.now() - new Date(profile.updated_at).getTime()) / 86_400_000,
      ),
    );

    return [
      {
        label: copy("Profile Completion", "Độ hoàn thiện hồ sơ"),
        value: `${completionScore}%`,
        detail: copy(
          "Identity and personal profile fields",
          "Mức đầy đủ của thông tin nhận diện và cá nhân",
        ),
        score: completionScore,
      },
      {
        label: copy("Direction Readiness", "Độ sẵn sàng chiến lược nội dung"),
        value: `${directionScore}%`,
        detail: copy(
          "Coverage across audience, formats, and goals",
          "Mức bao phủ chân dung khán giả, format và mục tiêu",
        ),
        score: directionScore,
      },
      {
        label: copy("Keyword Inventory", "Kho từ khóa mục tiêu"),
        value: keywordCount.toString(),
        detail: copy(
          "Tracked keywords in your direction profile",
          "Số từ khóa đang theo dõi trong định hướng nội dung",
        ),
      },
      {
        label: copy("Last Saved", "Lần lưu gần nhất"),
        value:
          daysFromLastUpdate === 0
            ? copy("Today", "Hôm nay")
            : copy(`${daysFromLastUpdate} days`, `${daysFromLastUpdate} ngày`),
        detail: formatDateTime(profile.updated_at),
      },
    ];
  }, [copy, profile]);

  return (
    <PanelCard
      title={copy("HR Dashboard", "Bảng điều phối hồ sơ")}
      description={copy(
        "Snapshot of profile readiness and an audit trail of profile changes.",
        "Tổng quan mức sẵn sàng hồ sơ và nhật ký thay đổi thông tin.",
      )}
      contentClassName="pt-3"
      action={
        <Badge
          variant="outline"
          className={cn(
            "rounded-full",
            isDirty
              ? "border-chart-3/30 bg-chart-3/10 text-chart-3"
              : "border-primary/25 bg-primary/10 text-primary",
          )}
        >
          <Sparkles data-icon="inline-start" />
          {isDirty
            ? copy("Draft Changes Pending", "Có thay đổi chưa lưu")
            : copy("Profile Synced", "Hồ sơ đã đồng bộ")}
        </Badge>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="grid gap-3 sm:grid-cols-2">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-border/65 bg-background/65 p-4"
            >
              <p className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                {metric.label}
              </p>
              <p
                className={cn(
                  "mt-2 font-heading text-2xl font-semibold text-foreground",
                  metric.score ? getMetricTone(metric.score) : undefined,
                )}
              >
                {metric.value}
              </p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {metric.detail}
              </p>
              {typeof metric.score === "number" ? (
                <ProgressBar value={metric.score} className="mt-3" />
              ) : null}
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border/65 bg-background/65 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-foreground">
              {copy("Profile Change Timeline", "Timeline thay đổi hồ sơ")}
            </p>
            <Badge variant="outline" className="rounded-full">
              <Clock3 data-icon="inline-start" />
              {timeline.length}
            </Badge>
          </div>

          <Separator className="my-3" />

          {timeline.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {copy(
                "No profile activity yet. Start editing to build an audit trail.",
                "Chưa có hoạt động hồ sơ. Hãy bắt đầu chỉnh sửa để tạo lịch sử thay đổi.",
              )}
            </p>
          ) : (
            <ScrollArea className="h-64 pr-3">
              <div className="grid gap-3">
                {timeline.map((event) => (
                  <div
                    key={event.id}
                    className="rounded-xl border border-border/65 bg-muted/30 px-3 py-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                          <TimelineEventIcon kind={event.kind} />
                          <span className="truncate">{event.title}</span>
                        </p>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          {event.detail}
                        </p>
                      </div>
                      <p className="shrink-0 text-[11px] text-muted-foreground">
                        {formatDateTime(event.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </PanelCard>
  );
}
