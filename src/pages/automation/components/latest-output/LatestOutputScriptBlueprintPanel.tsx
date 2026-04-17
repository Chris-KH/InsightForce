import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ImageIcon, TimerReset, Trash2 } from "lucide-react";

import { InlineQueryState } from "@/components/app-query-state";
import { PanelCard } from "@/components/app-section";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  type NormalizedGeneratedContent,
  type StoryboardFrame,
} from "@/lib/orchestrator-intelligence";
import { formatCompactNumber, formatDuration } from "@/lib/insight-formatters";

type CopyFn = (en: string, vi: string) => string;

type PublishingWindowItem = {
  platform: string;
  windowLabel: string;
};

type EditableScriptSection = StoryboardFrame & {
  startSec: number;
  endSec: number;
  durationSec: number;
};

type TimelineDraft = {
  start: string;
  end: string;
};

const DEFAULT_SECTION_DURATION_SEC = 10;

function parseTimeToken(value: string): number | null {
  const normalized = value.trim();
  if (!normalized) {
    return null;
  }

  const parts = normalized.split(":").map((part) => part.trim());
  if (parts.some((part) => part.length === 0)) {
    return null;
  }

  const numericParts = parts.map((part) => Number(part));
  if (numericParts.some((part) => !Number.isFinite(part) || part < 0)) {
    return null;
  }

  if (numericParts.length === 1) {
    return Math.floor(numericParts[0]);
  }

  if (numericParts.length === 2) {
    const [minutes, seconds] = numericParts;
    return Math.floor(minutes * 60 + seconds);
  }

  if (numericParts.length === 3) {
    const [hours, minutes, seconds] = numericParts;
    return Math.floor(hours * 3600 + minutes * 60 + seconds);
  }

  return null;
}

function formatTimeToken(totalSeconds: number) {
  const normalized = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(normalized / 3600);
  const minutes = Math.floor((normalized % 3600) / 60);
  const seconds = normalized % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function formatTimelineRange(startSec: number, endSec: number) {
  return `${formatTimeToken(startSec)}-${formatTimeToken(endSec)}`;
}

function parseSectionRange(raw: string, fallbackStartSec: number) {
  const [startToken, endToken] = raw
    .split(/\s*[-–—]\s*/)
    .map((token) => token.trim())
    .filter(Boolean);

  const parsedStart = startToken ? parseTimeToken(startToken) : null;
  const parsedEnd = endToken ? parseTimeToken(endToken) : null;

  const startSec = parsedStart ?? fallbackStartSec;
  const endSec = Math.max(
    startSec + 1,
    parsedEnd ?? startSec + DEFAULT_SECTION_DURATION_SEC,
  );

  return { startSec, endSec };
}

function toEditableSections(sections: StoryboardFrame[]) {
  let cursor = 0;

  return sections.map<EditableScriptSection>((section) => {
    const parsed = parseSectionRange(section.timestamp, cursor);
    const startSec = Math.max(cursor, parsed.startSec);
    const durationSec = Math.max(1, parsed.endSec - parsed.startSec);
    const endSec = startSec + durationSec;

    cursor = endSec;

    return {
      ...section,
      startSec,
      endSec,
      durationSec,
    };
  });
}

function reflowFrom(
  sections: EditableScriptSection[],
  fromIndex: number,
  fromStartSec: number,
) {
  const nextSections = [...sections];
  let cursor = Math.max(0, fromStartSec);

  for (let index = fromIndex; index < nextSections.length; index += 1) {
    const durationSec = Math.max(1, nextSections[index].durationSec);

    nextSections[index] = {
      ...nextSections[index],
      startSec: cursor,
      endSec: cursor + durationSec,
      durationSec,
    };

    cursor += durationSec;
  }

  return nextSections;
}

type LatestOutputScriptBlueprintPanelProps = {
  copy: CopyFn;
  latestGeneratedContent: NormalizedGeneratedContent;
  latestPublishingWindows: PublishingWindowItem[];
};

export function LatestOutputScriptBlueprintPanel({
  copy,
  latestGeneratedContent,
  latestPublishingWindows,
}: LatestOutputScriptBlueprintPanelProps) {
  const initialEditableSections = useMemo(
    () => toEditableSections(latestGeneratedContent.sections),
    [latestGeneratedContent.sections],
  );

  const [hookDraft, setHookDraft] = useState(latestGeneratedContent.hook);
  const [scriptSections, setScriptSections] = useState(initialEditableSections);
  const [activeSectionId, setActiveSectionId] = useState<string | undefined>(
    initialEditableSections[0]?.id,
  );
  const [timelineDraft, setTimelineDraft] = useState<TimelineDraft>({
    start: initialEditableSections[0]
      ? String(initialEditableSections[0].startSec)
      : "0",
    end: initialEditableSections[0]
      ? String(initialEditableSections[0].endSec)
      : String(DEFAULT_SECTION_DURATION_SEC),
  });
  const [timelineError, setTimelineError] = useState<string | null>(null);

  useEffect(() => {
    setHookDraft(latestGeneratedContent.hook);
    setScriptSections(initialEditableSections);
    setActiveSectionId(initialEditableSections[0]?.id);
    setTimelineError(null);
  }, [initialEditableSections, latestGeneratedContent.hook]);

  const activeSection = useMemo(
    () => scriptSections.find((section) => section.id === activeSectionId),
    [activeSectionId, scriptSections],
  );

  useEffect(() => {
    if (!activeSection) {
      setTimelineDraft({
        start: "0",
        end: String(DEFAULT_SECTION_DURATION_SEC),
      });
      return;
    }

    setTimelineDraft({
      start: String(activeSection.startSec),
      end: String(activeSection.endSec),
    });
  }, [activeSection?.endSec, activeSection?.id, activeSection?.startSec]);

  const totalDurationSeconds =
    scriptSections.length > 0
      ? scriptSections[scriptSections.length - 1].endSec
      : 0;

  const applyActiveSectionPatch = (
    patch: Partial<
      Pick<EditableScriptSection, "label" | "narration" | "notes">
    >,
  ) => {
    if (!activeSectionId) {
      return;
    }

    setScriptSections((currentSections) =>
      currentSections.map((section) =>
        section.id === activeSectionId ? { ...section, ...patch } : section,
      ),
    );
  };

  const handleApplyTimeline = () => {
    if (!activeSectionId) {
      return;
    }

    const parsedStart = parseTimeToken(timelineDraft.start);
    const parsedEnd = parseTimeToken(timelineDraft.end);

    if (parsedStart === null || parsedEnd === null) {
      setTimelineError(
        copy(
          "Timeline must be valid seconds or m:ss values.",
          "Timeline phải là giây hợp lệ hoặc theo dạng m:ss.",
        ),
      );
      return;
    }

    setTimelineError(null);

    setScriptSections((currentSections) => {
      const sectionIndex = currentSections.findIndex(
        (section) => section.id === activeSectionId,
      );

      if (sectionIndex < 0) {
        return currentSections;
      }

      const previousEnd =
        sectionIndex > 0 ? currentSections[sectionIndex - 1].endSec : 0;

      const nextStart = Math.max(previousEnd, parsedStart);
      const nextEnd = Math.max(nextStart + 1, parsedEnd);

      const updatedSections = [...currentSections];
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        startSec: nextStart,
        endSec: nextEnd,
        durationSec: nextEnd - nextStart,
      };

      if (sectionIndex + 1 >= updatedSections.length) {
        return updatedSections;
      }

      return reflowFrom(updatedSections, sectionIndex + 1, nextEnd);
    });
  };

  const handleDeleteActiveSection = () => {
    if (!activeSectionId) {
      return;
    }

    const sectionIndex = scriptSections.findIndex(
      (section) => section.id === activeSectionId,
    );

    if (sectionIndex < 0) {
      return;
    }

    const remainingSections = scriptSections.filter(
      (section) => section.id !== activeSectionId,
    );

    if (remainingSections.length === 0) {
      setScriptSections([]);
      setActiveSectionId(undefined);
      setTimelineError(null);
      return;
    }

    const reflowStartIndex = Math.min(sectionIndex, remainingSections.length);
    const reflowStartSec =
      reflowStartIndex === 0
        ? 0
        : remainingSections[reflowStartIndex - 1].endSec;

    const normalizedSections = reflowFrom(
      remainingSections,
      reflowStartIndex,
      reflowStartSec,
    );

    const nextActiveSection =
      normalizedSections[Math.min(sectionIndex, normalizedSections.length - 1)];

    setScriptSections(normalizedSections);
    setActiveSectionId(nextActiveSection?.id);
    setTimelineError(null);
  };

  const handleResetScriptDraft = () => {
    const resetSections = toEditableSections(latestGeneratedContent.sections);

    setHookDraft(latestGeneratedContent.hook);
    setScriptSections(resetSections);
    setActiveSectionId(resetSections[0]?.id);
    setTimelineError(null);
  };

  return (
    <PanelCard
      title={copy("Script Blueprint", "Blueprint kịch bản")}
      description={copy(
        "Scene-by-scene script structure generated by the backend content agent.",
        "Cấu trúc kịch bản theo từng cảnh do content agent ở backend tạo ra.",
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <Alert className="border-primary/30 bg-primary/8">
          <TimerReset className="text-primary" />
          <AlertTitle>
            {copy(
              "Interactive timeline editor",
              "Trình chỉnh timeline tương tác",
            )}
          </AlertTitle>
          <AlertDescription>
            {copy(
              "Edit script text, adjust timestamps, or remove a segment. The next segments auto-shift and never overlap with the previous segment.",
              "Bạn có thể sửa nội dung, chỉnh mốc thời gian hoặc xóa một đoạn. Các đoạn phía sau sẽ tự dồn và không bao giờ chồng với đoạn trước.",
            )}
          </AlertDescription>
        </Alert>
      </motion.div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="rounded-2xl border border-border/60 bg-background/70 p-3">
            <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
              {copy("Script summary", "Tóm tắt kịch bản")}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="outline" className="rounded-full">
                {copy("Segments", "Số đoạn")}:{" "}
                {formatCompactNumber(scriptSections.length)}
              </Badge>
              <Badge
                variant="outline"
                className="rounded-full border-primary/30"
              >
                {copy("Estimated duration", "Thời lượng ước tính")}:{" "}
                {formatDuration(totalDurationSeconds)}
              </Badge>
            </div>
          </div>

          {scriptSections.length > 0 ? (
            <ScrollArea className="h-160 pr-3">
              <div className="space-y-2">
                {scriptSections.map((section, index) => (
                  <motion.button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSectionId(section.id)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.05 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.03,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={
                      section.id === activeSectionId
                        ? "w-full rounded-2xl border border-primary/45 bg-primary/10 px-3 py-3 text-left"
                        : "w-full rounded-2xl border border-border/65 bg-background/65 px-3 py-3 text-left transition-colors hover:border-primary/35"
                    }
                  >
                    <p className="text-[11px] font-semibold tracking-[0.12em] text-primary uppercase">
                      {formatTimelineRange(section.startSec, section.endSec)}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {section.label}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {section.narration || "--"}
                    </p>
                  </motion.button>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <InlineQueryState
              state="empty"
              message={copy(
                "No script segments available for editing.",
                "Hiện không có phân đoạn script để chỉnh sửa.",
              )}
            />
          )}
        </motion.div>

        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="script-blueprint-hook">
                {copy("Hook", "Mở bài")}
              </FieldLabel>
              <Textarea
                id="script-blueprint-hook"
                value={hookDraft}
                onChange={(event) => setHookDraft(event.target.value)}
                rows={3}
              />
              <FieldDescription>
                {copy(
                  "Hook editing is local draft mode for review before publishing.",
                  "Phần hook đang ở chế độ chỉnh bản nháp cục bộ để review trước khi xuất bản.",
                )}
              </FieldDescription>
            </Field>
          </FieldGroup>

          {activeSection ? (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden rounded-2xl border border-border/60 bg-background/70"
                >
                  <img
                    src={activeSection.imageUrl}
                    alt={copy(
                      `${activeSection.label} preview image`,
                      `${activeSection.label} ảnh xem trước`,
                    )}
                    className="h-64 w-full object-cover"
                    loading="lazy"
                  />
                  <div className="space-y-1 px-3 py-3">
                    <p className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] text-primary uppercase">
                      <ImageIcon className="size-3.5" />
                      {formatTimelineRange(
                        activeSection.startSec,
                        activeSection.endSec,
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {copy("Frame source", "Nguồn khung hình")}:{" "}
                      {activeSection.thumbnailOutputPath ||
                        copy("mock image", "ảnh mô phỏng")}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="script-section-label">
                    {copy("Segment title", "Tiêu đề đoạn")}
                  </FieldLabel>
                  <Input
                    id="script-section-label"
                    value={activeSection.label}
                    onChange={(event) =>
                      applyActiveSectionPatch({ label: event.target.value })
                    }
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="script-section-narration">
                    {copy("Narration", "Lời thoại")}
                  </FieldLabel>
                  <Textarea
                    id="script-section-narration"
                    value={activeSection.narration}
                    onChange={(event) =>
                      applyActiveSectionPatch({ narration: event.target.value })
                    }
                    rows={4}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="script-section-notes">
                    {copy("Editing notes", "Ghi chú dựng")}
                  </FieldLabel>
                  <Textarea
                    id="script-section-notes"
                    value={activeSection.notes}
                    onChange={(event) =>
                      applyActiveSectionPatch({ notes: event.target.value })
                    }
                    rows={3}
                  />
                </Field>
              </FieldGroup>

              <div className="rounded-2xl border border-border/60 bg-background/70 p-3">
                <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                  {copy("Timeline controls", "Điều khiển timeline")}
                </p>

                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="script-section-start">
                      {copy("Start", "Bắt đầu")} (
                      {copy("sec or m:ss", "giây hoặc m:ss")})
                    </FieldLabel>
                    <Input
                      id="script-section-start"
                      value={timelineDraft.start}
                      onChange={(event) =>
                        setTimelineDraft((current) => ({
                          ...current,
                          start: event.target.value,
                        }))
                      }
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="script-section-end">
                      {copy("End", "Kết thúc")} (
                      {copy("sec or m:ss", "giây hoặc m:ss")})
                    </FieldLabel>
                    <Input
                      id="script-section-end"
                      value={timelineDraft.end}
                      onChange={(event) =>
                        setTimelineDraft((current) => ({
                          ...current,
                          end: event.target.value,
                        }))
                      }
                    />
                  </Field>
                </div>

                {timelineError ? (
                  <p className="mt-2 text-xs text-destructive">
                    {timelineError}
                  </p>
                ) : null}

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Button type="button" size="sm" onClick={handleApplyTimeline}>
                    <TimerReset data-icon="inline-start" />
                    {copy("Apply timeline", "Áp dụng timeline")}
                  </Button>

                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteActiveSection}
                  >
                    <Trash2 data-icon="inline-start" />
                    {copy("Delete segment", "Xóa đoạn")}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleResetScriptDraft}
                  >
                    {copy("Reset draft", "Khôi phục bản nháp")}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <InlineQueryState
              state="empty"
              message={copy(
                "Select one segment from the left list to preview and edit.",
                "Hãy chọn một đoạn ở danh sách bên trái để xem trước và chỉnh sửa.",
              )}
            />
          )}
        </motion.div>
      </div>

      {latestPublishingWindows.length > 0 ? (
        <div className="mt-4 rounded-2xl border border-border/60 bg-background/65 p-3 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">
            {copy(
              "Publishing windows detected",
              "Khung giờ đăng được phát hiện",
            )}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {latestPublishingWindows.map((item, index) => (
              <Badge
                key={`${item.platform}-${item.windowLabel}-${index}`}
                variant="outline"
                className="rounded-full"
              >
                {item.platform}: {item.windowLabel}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}
    </PanelCard>
  );
}
