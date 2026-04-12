import {
  Activity,
  AlertTriangle,
  Bot,
  CheckCircle2,
  Gauge,
  ShieldCheck,
} from "lucide-react";

import {
  useAgentsStatusQuery,
  useHealthQuery,
  useTikTokChannelStatusQuery,
  useYouTubeChannelStatusQuery,
} from "@/api";
import {
  InlineQueryState,
  MetricCardsSkeleton,
  PanelRowsSkeleton,
} from "@/components/app-query-state";
import { MetricCard, PanelCard } from "@/components/app-section";
import { useBilingual } from "@/hooks/use-bilingual";
import {
  formatCompactNumber,
  formatPercentFromRatio,
} from "@/lib/insight-formatters";
import { FocusSectionHeader } from "@/pages/focus/components/FocusSectionHeader";
import { getQueryErrorMessage } from "@/lib/query-error";

export function OpsControlPage() {
  const copy = useBilingual();

  const healthQuery = useHealthQuery();
  const agentsQuery = useAgentsStatusQuery();
  const tikTokChannelQuery = useTikTokChannelStatusQuery();
  const youTubeChannelQuery = useYouTubeChannelStatusQuery();

  const anyLoading =
    healthQuery.isLoading ||
    agentsQuery.isLoading ||
    tikTokChannelQuery.isLoading ||
    youTubeChannelQuery.isLoading;

  const anyError =
    healthQuery.error ||
    agentsQuery.error ||
    tikTokChannelQuery.error ||
    youTubeChannelQuery.error;

  const processes = agentsQuery.data?.processes ?? [];
  const reachableCount = processes.filter(
    (process) => process.reachable,
  ).length;

  const tikTokChannel = tikTokChannelQuery.data?.channel;
  const youTubeChannel = youTubeChannelQuery.data?.channel;

  const combinedFollowers =
    (tikTokChannel?.followers ?? 0) + (youTubeChannel?.subscribers ?? 0);

  const avgEngagementRatio =
    ((tikTokChannel?.engagement_rate ?? 0) +
      (youTubeChannel?.engagement_rate ?? 0)) /
    2;

  return (
    <div className="grid gap-6">
      <FocusSectionHeader
        title={{ en: "Operations Control", vi: "Điều phối vận hành" }}
        description={{
          en: "Dedicated lane for service health, agent reachability, and channel pulse before taking action.",
          vi: "Luồng riêng để kiểm tra sức khỏe dịch vụ, độ sẵn sàng bot và nhịp kênh trước khi thao tác.",
        }}
        badge={{ en: "Live Monitoring", vi: "Giám sát trực tiếp" }}
        icon={Activity}
      />

      {anyLoading ? <MetricCardsSkeleton /> : null}

      {anyError ? (
        <InlineQueryState
          state="error"
          message={getQueryErrorMessage(
            anyError,
            "Unable to load operations control data.",
          )}
        />
      ) : null}

      {!anyLoading && !anyError ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label={copy("Service Status", "Trạng thái dịch vụ")}
            value={(healthQuery.data?.status ?? "unknown").toUpperCase()}
            icon={<ShieldCheck className="size-5" />}
            detail={healthQuery.data?.service ?? "InsightForce API"}
          />
          <MetricCard
            label={copy("Reachable Agents", "Bot khả dụng")}
            value={`${reachableCount}/${processes.length}`}
            icon={<Bot className="size-5" />}
            detail={copy(
              "Active process reachability",
              "Độ sẵn sàng tiến trình",
            )}
          />
          <MetricCard
            label={copy("Combined Audience", "Tổng tệp theo dõi")}
            value={formatCompactNumber(combinedFollowers)}
            icon={<Activity className="size-5" />}
            detail={copy("TikTok + YouTube", "TikTok + YouTube")}
          />
          <MetricCard
            label={copy("Avg Engagement", "Tương tác trung bình")}
            value={formatPercentFromRatio(avgEngagementRatio)}
            icon={<Gauge className="size-5" />}
            detail={copy("Cross-channel signal", "Tín hiệu liên kênh")}
          />
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <PanelCard
          title={copy("Agent Reachability", "Khả năng kết nối bot")}
          description={copy(
            "Use this board to identify lane-level outages before triggering finance or automation actions.",
            "Dùng bảng này để phát hiện nghẽn luồng trước khi chạy tác vụ tài chính hoặc tự động hóa.",
          )}
        >
          {agentsQuery.isLoading ? (
            <PanelRowsSkeleton rows={4} />
          ) : (
            <div className="space-y-3">
              {processes.map((process) => (
                <div
                  key={process.name}
                  className="rounded-2xl border border-border/65 bg-background/65 p-4"
                >
                  <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    {process.reachable ? (
                      <CheckCircle2 className="size-4 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="size-4 text-amber-600" />
                    )}
                    {process.name}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {process.url}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {process.detail}
                  </p>
                </div>
              ))}
            </div>
          )}
        </PanelCard>

        <PanelCard
          title={copy("Channel Pulse", "Nhịp kênh")}
          description={copy(
            "Cross-check growth and engagement pace before selecting content lanes.",
            "Đối chiếu đà tăng trưởng và tương tác trước khi chọn lane nội dung.",
          )}
        >
          {(tikTokChannelQuery.isLoading || youTubeChannelQuery.isLoading) && (
            <PanelRowsSkeleton rows={2} />
          )}

          {!tikTokChannelQuery.isLoading && !youTubeChannelQuery.isLoading ? (
            <div className="space-y-3">
              <div className="rounded-2xl border border-border/65 bg-background/65 p-4">
                <p className="text-sm font-semibold text-foreground">TikTok</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {copy("Followers", "Người theo dõi")}:{" "}
                  {formatCompactNumber(tikTokChannel?.followers ?? 0)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {copy("Weekly Posts", "Bài mỗi tuần")}:{" "}
                  {tikTokChannel?.posting_frequency_per_week ?? 0}
                </p>
                <p className="text-xs text-muted-foreground">
                  {copy("Engagement", "Tương tác")}:{" "}
                  {formatPercentFromRatio(tikTokChannel?.engagement_rate ?? 0)}
                </p>
              </div>

              <div className="rounded-2xl border border-border/65 bg-background/65 p-4">
                <p className="text-sm font-semibold text-foreground">YouTube</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {copy("Subscribers", "Người đăng ký")}:{" "}
                  {formatCompactNumber(youTubeChannel?.subscribers ?? 0)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {copy("Weekly Uploads", "Bài mỗi tuần")}:{" "}
                  {youTubeChannel?.upload_frequency_per_week ?? 0}
                </p>
                <p className="text-xs text-muted-foreground">
                  {copy("Engagement", "Tương tác")}:{" "}
                  {formatPercentFromRatio(youTubeChannel?.engagement_rate ?? 0)}
                </p>
              </div>
            </div>
          ) : null}
        </PanelCard>
      </div>
    </div>
  );
}
