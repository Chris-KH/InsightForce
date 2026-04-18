import type { ChartData, ChartOptions } from "chart.js";
import { Eye, Heart, Lightbulb, MessageCircle, Users } from "lucide-react";

import { DoughnutTrendChart } from "@/components/app-data-viz";
import {
  MetricCard,
  PanelCard,
  ProgressBar,
  SectionHeader,
} from "@/components/app-section";
import { Badge } from "@/components/ui/badge";
import { useBilingual } from "@/hooks/use-bilingual";
import {
  formatCompactNumber,
  formatPercentFromRatio,
} from "@/lib/insight-formatters";

const audienceSnapshot = {
  totalViews: 12840,
  reactions: 870,
  comments: 44,
  followers: 1240,
};

const platformPostMix = [
  { platform: "Instagram", ratio: 0.42, color: "rgba(236, 72, 153, 0.82)" },
  { platform: "TikTok", ratio: 0.34, color: "rgba(20, 184, 166, 0.82)" },
  { platform: "Facebook", ratio: 0.24, color: "rgba(59, 130, 246, 0.78)" },
];

const positiveComments = [
  {
    en: "Clean visuals and easy to follow. Saved this for tonight.",
    vi: "Ảnh nhìn sạch và dễ hiểu, lưu lại để tối làm theo.",
  },
  {
    en: "Short, practical tips for busy people.",
    vi: "Mẹo ngắn gọn, hợp với người bận rộn.",
  },
  {
    en: "This carousel is easy to share with friends.",
    vi: "Carousel này dễ share cho bạn bè.",
  },
];

const audienceBehaviorCues = [
  {
    en: "Prioritize 4-5 image carousels with concise captions.",
    vi: "Ưu tiên carousel 4-5 ảnh với caption ngắn, dễ lưu lại.",
  },
  {
    en: "Keep the hook practical and avoid overstating results.",
    vi: "Giữ hook thực tế, tránh nói quá về hiệu quả.",
  },
  {
    en: "Push Instagram and TikTok first, then use a longer Facebook caption.",
    vi: "Đẩy Instagram và TikTok trước, Facebook dùng bản caption dài hơn.",
  },
];

const platformPostMixData: ChartData<"doughnut"> = {
  labels: platformPostMix.map((item) => item.platform),
  datasets: [
    {
      data: platformPostMix.map((item) => Math.round(item.ratio * 100)),
      backgroundColor: platformPostMix.map((item) => item.color),
      borderWidth: 0,
    },
  ],
};

const platformPostMixOptions: ChartOptions<"doughnut"> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "68%",
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        color: "rgba(148, 163, 184, 0.92)",
        boxWidth: 10,
        boxHeight: 10,
      },
    },
    tooltip: {
      displayColors: false,
      callbacks: {
        label: (context) => `${context.label}: ${context.parsed}%`,
      },
    },
  },
};

export function AudiencePage() {
  const copy = useBilingual();

  return (
    <div className="grid gap-8">
      <SectionHeader
        eyebrow={copy("Audience", "Khán giả")}
        title={copy("Audience Snapshot", "Tổng quan khán giả")}
        description={copy(
          "A compact snapshot of audience performance and content direction.",
          "Snapshot gọn về hiệu quả khán giả và hướng nội dung tiếp theo.",
        )}
        action={
          <Badge
            variant="outline"
            className="rounded-full border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-amber-300"
          >
            {copy("Demo snapshot", "Bản demo")}
          </Badge>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label={copy("Total Views", "Tổng lượt xem")}
          value={formatCompactNumber(audienceSnapshot.totalViews)}
          detail={copy("Across recent posts", "Trên các bài gần đây")}
          icon={<Eye className="size-5" />}
        />
        <MetricCard
          label={copy("Reactions", "Lượt react")}
          value={formatCompactNumber(audienceSnapshot.reactions)}
          detail={copy("Likes and quick reactions", "Like và tương tác nhanh")}
          icon={<Heart className="size-5" />}
        />
        <MetricCard
          label={copy("Comments", "Bình luận")}
          value={formatCompactNumber(audienceSnapshot.comments)}
          detail={copy("Public comment volume", "Số bình luận công khai")}
          icon={<MessageCircle className="size-5" />}
        />
        <MetricCard
          label={copy("Followers", "Người theo dõi")}
          value={formatCompactNumber(audienceSnapshot.followers)}
          detail={copy("Estimated active base", "Tệp theo dõi ước tính")}
          icon={<Users className="size-5" />}
        />
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <PanelCard
          title={copy("Platform Post Mix", "Tỷ trọng đăng bài")}
          description={copy(
            "Current posting split between the main social platforms.",
            "Tỷ trọng đăng bài hiện tại giữa các nền tảng chính.",
          )}
        >
          <DoughnutTrendChart
            data={platformPostMixData}
            options={platformPostMixOptions}
            className="bg-linear-to-br from-fuchsia-100/55 via-card to-cyan-100/45 dark:from-fuchsia-500/12 dark:via-card/90 dark:to-cyan-500/10"
          />

          <div className="mt-5 grid gap-3">
            {platformPostMix.map((item) => (
              <div key={item.platform} className="space-y-2">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-foreground">
                    {item.platform}
                  </span>
                  <span className="text-muted-foreground">
                    {formatPercentFromRatio(item.ratio)}
                  </span>
                </div>
                <ProgressBar value={item.ratio * 100} />
              </div>
            ))}
          </div>
        </PanelCard>

        <PanelCard
          title={copy("Positive Comments", "Một vài bình luận tích cực")}
          description={copy(
            "Short samples that signal what the audience currently likes.",
            "Một vài mẫu ngắn cho thấy khán giả đang thích điều gì.",
          )}
        >
          <div className="space-y-3">
            {positiveComments.map((comment) => (
              <div
                key={comment.en}
                className="rounded-2xl border border-border/65 bg-background/65 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary">
                    <MessageCircle className="size-4" />
                  </div>
                  <p className="text-sm leading-6 text-foreground">
                    "{copy(comment.en, comment.vi)}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </PanelCard>
      </div>

      <PanelCard
        title={copy("Audience Behavior Cues", "Gợi ý hành vi khán giả")}
        description={copy(
          "Lightweight guidance for the next few posts, based on the mocked audience snapshot.",
          "Gợi ý nhẹ cho vài bài tiếp theo, dựa trên snapshot khán giả mock.",
        )}
      >
        <div className="grid gap-3 lg:grid-cols-3">
          {audienceBehaviorCues.map((cue) => (
            <div
              key={cue.en}
              className="rounded-2xl border border-border/65 bg-background/65 p-4"
            >
              <div className="mb-3 flex size-9 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                <Lightbulb className="size-4" />
              </div>
              <p className="text-sm leading-6 text-foreground">
                {copy(cue.en, cue.vi)}
              </p>
            </div>
          ))}
        </div>
      </PanelCard>
    </div>
  );
}
