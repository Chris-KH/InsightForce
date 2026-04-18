import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ImageIcon, RefreshCw, Trash2 } from "lucide-react";

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
import { formatCompactNumber } from "@/lib/insight-formatters";

type CopyFn = (en: string, vi: string) => string;

type EditableImageSection = Pick<
  StoryboardFrame,
  | "id"
  | "index"
  | "label"
  | "narration"
  | "notes"
  | "imagePrompt"
  | "imageOutputPath"
  | "imageUrl"
  | "localPath"
  | "imageStoreError"
>;

type LatestOutputScriptBlueprintPanelProps = {
  copy: CopyFn;
  latestGeneratedContent: NormalizedGeneratedContent;
};

function toEditableImageSections(
  sections: StoryboardFrame[],
): EditableImageSection[] {
  return sections.map((section) => ({
    id: section.id,
    index: section.index,
    label: section.label,
    narration: section.narration,
    notes: section.notes,
    imagePrompt: section.imagePrompt,
    imageOutputPath: section.imageOutputPath,
    imageUrl: section.imageUrl,
    localPath: section.localPath,
    imageStoreError: section.imageStoreError,
  }));
}

function getPlatformCount(content: NormalizedGeneratedContent) {
  const explicitCount = content.platformPosts.length;
  if (explicitCount > 0) {
    return explicitCount;
  }

  return content.publishing.recommendedPlatforms.length;
}

export function LatestOutputScriptBlueprintPanel({
  copy,
  latestGeneratedContent,
}: LatestOutputScriptBlueprintPanelProps) {
  const initialEditableSections = useMemo(
    () => toEditableImageSections(latestGeneratedContent.sections),
    [latestGeneratedContent.sections],
  );

  const [hookDraft, setHookDraft] = useState(latestGeneratedContent.hook);
  const [imageSections, setImageSections] = useState(initialEditableSections);
  const [activeSectionId, setActiveSectionId] = useState<string | undefined>(
    initialEditableSections[0]?.id,
  );

  const activeSection = useMemo(
    () => imageSections.find((section) => section.id === activeSectionId),
    [activeSectionId, imageSections],
  );

  const platformCount = getPlatformCount(latestGeneratedContent);

  const applyActiveSectionPatch = (
    patch: Partial<
      Pick<
        EditableImageSection,
        "label" | "narration" | "notes" | "imagePrompt"
      >
    >,
  ) => {
    if (!activeSectionId) {
      return;
    }

    setImageSections((currentSections) =>
      currentSections.map((section) =>
        section.id === activeSectionId ? { ...section, ...patch } : section,
      ),
    );
  };

  const handleDeleteActiveSection = () => {
    if (!activeSectionId) {
      return;
    }

    const sectionIndex = imageSections.findIndex(
      (section) => section.id === activeSectionId,
    );
    const remainingSections = imageSections.filter(
      (section) => section.id !== activeSectionId,
    );

    setImageSections(remainingSections);
    setActiveSectionId(
      remainingSections[Math.min(sectionIndex, remainingSections.length - 1)]
        ?.id,
    );
  };

  const handleResetDraft = () => {
    const resetSections = toEditableImageSections(
      latestGeneratedContent.sections,
    );

    setHookDraft(latestGeneratedContent.hook);
    setImageSections(resetSections);
    setActiveSectionId(resetSections[0]?.id);
  };

  return (
    <PanelCard
      title={copy("Image Story Blueprint", "Blueprint chuỗi ảnh")}
      description={copy(
        "Image-by-image structure for a multi-image post, ready for review before publishing.",
        "Cấu trúc từng ảnh cho bài đăng nhiều ảnh, sẵn sàng review trước khi xuất bản.",
      )}
      contentClassName="pb-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <Alert className="border-primary/30 bg-primary/8">
          <ImageIcon className="text-primary" />
          <AlertTitle>
            {copy("Multi-image post editor", "Trình chỉnh chuỗi ảnh")}
          </AlertTitle>
          <AlertDescription>
            {copy(
              "Edit the hook, image copy, visual prompt, and production notes for each carousel image. This draft stays image-first and matches multi-image publishing.",
              "Chỉnh hook, nội dung từng ảnh, visual prompt và ghi chú sản xuất cho mỗi ảnh carousel. Bản nháp này tập trung đúng vào định dạng bài đăng nhiều ảnh.",
            )}
          </AlertDescription>
        </Alert>
      </motion.div>

      <div className="mt-3 grid gap-4 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="rounded-2xl border border-border/60 bg-background/70 p-3">
            <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
              {copy("Post summary", "Tóm tắt bài đăng")}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="outline" className="rounded-full">
                {copy("Images", "Số ảnh")}:{" "}
                {formatCompactNumber(imageSections.length)}
              </Badge>
              <Badge
                variant="outline"
                className="rounded-full border-primary/30"
              >
                {copy("Format", "Định dạng")}:{" "}
                {copy("multi-image post", "bài nhiều ảnh")}
              </Badge>
              <Badge variant="outline" className="rounded-full">
                {copy("Platforms", "Nền tảng")}:{" "}
                {formatCompactNumber(platformCount)}
              </Badge>
            </div>
          </div>

          {imageSections.length > 0 ? (
            <ScrollArea className="h-136 pr-3">
              <div className="space-y-2">
                {imageSections.map((section, index) => (
                  <motion.button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSectionId(section.id)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
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
                    <p className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] text-primary uppercase">
                      <ImageIcon className="size-3.5" />
                      {copy("Image", "Ảnh")} #{section.index || index + 1}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {section.label}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {section.narration || section.imagePrompt || "--"}
                    </p>
                  </motion.button>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <InlineQueryState
              state="empty"
              message={copy(
                "No image sections available for editing.",
                "Hiện không có phân đoạn ảnh để chỉnh sửa.",
              )}
            />
          )}
        </motion.div>

        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="image-blueprint-hook">
                {copy("Hook", "Mở bài")}
              </FieldLabel>
              <Textarea
                id="image-blueprint-hook"
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
                      `Ảnh xem trước ${activeSection.label}`,
                    )}
                    className="h-64 w-full object-cover"
                    loading="lazy"
                  />
                  <div className="space-y-1 px-3 py-3">
                    <p className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] text-primary uppercase">
                      <ImageIcon className="size-3.5" />
                      {copy("Selected image", "Ảnh đang chọn")} #
                      {activeSection.index}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {copy("Image source", "Nguồn ảnh")}:{" "}
                      {activeSection.imageOutputPath ||
                        activeSection.localPath ||
                        copy("mock image", "ảnh mô phỏng")}
                    </p>
                    {activeSection.imageStoreError ? (
                      <p className="text-xs text-destructive">
                        {activeSection.imageStoreError}
                      </p>
                    ) : null}
                  </div>
                </motion.div>
              </AnimatePresence>

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="image-section-label">
                    {copy("Image title", "Tiêu đề ảnh")}
                  </FieldLabel>
                  <Input
                    id="image-section-label"
                    value={activeSection.label}
                    onChange={(event) =>
                      applyActiveSectionPatch({ label: event.target.value })
                    }
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="image-section-copy">
                    {copy("Caption / image copy", "Caption / nội dung ảnh")}
                  </FieldLabel>
                  <Textarea
                    id="image-section-copy"
                    value={activeSection.narration}
                    onChange={(event) =>
                      applyActiveSectionPatch({ narration: event.target.value })
                    }
                    rows={4}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="image-section-prompt">
                    {copy("Visual direction", "Định hướng hình ảnh")}
                  </FieldLabel>
                  <Textarea
                    id="image-section-prompt"
                    value={activeSection.imagePrompt}
                    onChange={(event) =>
                      applyActiveSectionPatch({
                        imagePrompt: event.target.value,
                      })
                    }
                    rows={4}
                  />
                  <FieldDescription>
                    {copy(
                      "Use this as the image generation or art direction prompt.",
                      "Dùng phần này làm prompt tạo ảnh hoặc hướng dẫn art direction.",
                    )}
                  </FieldDescription>
                </Field>
              </FieldGroup>

              <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border/60 bg-background/70 p-3">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteActiveSection}
                >
                  <Trash2 data-icon="inline-start" />
                  {copy("Delete image", "Xóa ảnh")}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleResetDraft}
                >
                  <RefreshCw data-icon="inline-start" />
                  {copy("Reset draft", "Khôi phục bản nháp")}
                </Button>
              </div>
            </>
          ) : (
            <InlineQueryState
              state="empty"
              message={copy(
                "Select one image from the left list to preview and edit.",
                "Hãy chọn một ảnh ở danh sách bên trái để xem trước và chỉnh sửa.",
              )}
            />
          )}
        </motion.div>
      </div>
    </PanelCard>
  );
}
