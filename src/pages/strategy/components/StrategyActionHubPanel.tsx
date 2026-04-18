import { AnimatePresence, motion } from "motion/react";
import { BookmarkPlus, Send, Video } from "lucide-react";

import { InlineQueryState } from "@/components/app-query-state";
import { PanelCard } from "@/components/app-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPercentValue } from "@/lib/insight-formatters";

import type { BilingualCopy, TrendTopic } from "./strategy-workspace.types";

type StrategyActionHubPanelProps = {
  copy: BilingualCopy;
  selectedTopic?: TrendTopic;
  actionFeedback: string | null;
  onGenerateScript: () => void;
  onSendToEditor: () => void;
  onSaveBacklog: () => void;
};

export function StrategyActionHubPanel({
  copy,
  selectedTopic,
  actionFeedback,
  onGenerateScript,
  onSendToEditor,
  onSaveBacklog,
}: StrategyActionHubPanelProps) {
  return (
    <PanelCard
      title={copy("Action Hub", "Trung tâm hành động")}
      description={copy(
        "Focused insight and one-click next steps for your selected trend.",
        "Insight trọng tâm và hành động 1 chạm cho xu hướng bạn đã chọn.",
      )}
    >
      <AnimatePresence mode="wait">
        {selectedTopic ? (
          <motion.div
            key={selectedTopic.keyword}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-4"
          >
            <Card className="border-primary/22 bg-primary/8" size="sm">
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle>{selectedTopic.keyword}</CardTitle>
                    <CardDescription>
                      {copy("Deep dive insight", "Insight chuyên sâu")}
                    </CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className="rounded-full border-primary/30"
                  >
                    {formatPercentValue(selectedTopic.trendScore)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
                <p>
                  {selectedTopic.why ||
                    copy(
                      `${selectedTopic.keyword} is gaining attention from audience discussions and creator demand.`,
                      `${selectedTopic.keyword} đang thu hút mạnh từ thảo luận khán giả và nhu cầu nội dung của creator.`,
                    )}
                </p>
                <p>
                  {selectedTopic.action ||
                    copy(
                      "Publish one short educational angle and one practical story angle to validate content-market fit quickly.",
                      "Hãy triển khai 1 nội dung giáo dục ngắn và 1 nội dung câu chuyện thực tế để kiểm tra độ phù hợp với thị trường.",
                    )}
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedTopic.hashtags.slice(0, 4).map((tag) => (
                    <Badge key={tag} variant="outline" className="rounded-full">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-2">
              <Button
                type="button"
                className="rounded-xl"
                onClick={onGenerateScript}
              >
                <Video data-icon="inline-start" />
                {copy("Generate Video Script", "Tạo kịch bản video")}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={onSendToEditor}
              >
                <Send data-icon="inline-start" />
                {copy("Send to Editor", "Gửi cho biên tập")}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={onSaveBacklog}
              >
                <BookmarkPlus data-icon="inline-start" />
                {copy("Save to Backlog", "Lưu vào backlog")}
              </Button>
            </div>

            {actionFeedback ? (
              <p className="text-xs text-muted-foreground">{actionFeedback}</p>
            ) : null}
          </motion.div>
        ) : (
          <motion.div
            key="action-hub-empty"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <InlineQueryState
              state="empty"
              message={copy(
                "Select a trend card to open insight and action controls.",
                "Chọn một thẻ xu hướng để mở insight và các hành động.",
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </PanelCard>
  );
}
