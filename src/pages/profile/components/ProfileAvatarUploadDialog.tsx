import { useEffect, useMemo, useState } from "react";
import {
  Crop,
  MoveHorizontal,
  MoveVertical,
  RotateCcw,
  ZoomIn,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBilingual } from "@/hooks/use-bilingual";
import {
  type AvatarCropConfig,
  renderAvatarCropPreview,
} from "@/pages/profile/lib/avatar-crop";

type ProfileAvatarUploadDialogProps = {
  open: boolean;
  sourceImage: string | null;
  onOpenChange: (open: boolean) => void;
  onApply: (avatarDataUrl: string) => void;
};

const DEFAULT_CROP_CONFIG: AvatarCropConfig = {
  zoom: 1.2,
  offsetX: 0,
  offsetY: 0,
};

const ZOOM_OPTIONS = [1, 1.2, 1.5, 1.8, 2.2, 2.6];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function toPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

export function ProfileAvatarUploadDialog({
  open,
  sourceImage,
  onOpenChange,
  onApply,
}: ProfileAvatarUploadDialogProps) {
  const copy = useBilingual();

  const [cropConfig, setCropConfig] =
    useState<AvatarCropConfig>(DEFAULT_CROP_CONFIG);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);

  useEffect(() => {
    if (!open) {
      setCropConfig(DEFAULT_CROP_CONFIG);
    }
  }, [open]);

  useEffect(() => {
    if (!open || !sourceImage) {
      setPreviewUrl(null);
      return;
    }

    let cancelled = false;

    setIsRendering(true);
    renderAvatarCropPreview(sourceImage, cropConfig)
      .then((url) => {
        if (!cancelled) {
          setPreviewUrl(url);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPreviewUrl(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsRendering(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [cropConfig, open, sourceImage]);

  const zoomLabel = useMemo(
    () => `${copy("Zoom", "Độ phóng")}: ${cropConfig.zoom.toFixed(1)}x`,
    [copy, cropConfig.zoom],
  );

  const handleNudge = (axis: "x" | "y", delta: number) => {
    setCropConfig((current) =>
      axis === "x"
        ? {
            ...current,
            offsetX: clamp(current.offsetX + delta, -1, 1),
          }
        : {
            ...current,
            offsetY: clamp(current.offsetY + delta, -1, 1),
          },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {copy("Avatar Crop Preview", "Xem trước cắt ảnh đại diện")}
          </DialogTitle>
          <DialogDescription>
            {copy(
              "This is a simulated editor. You can adjust framing and apply the generated avatar snapshot.",
              "Đây là trình chỉnh sửa giả lập. Bạn có thể căn khung và áp dụng ảnh đại diện đã cắt.",
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div className="rounded-2xl border border-border/70 bg-muted/35 p-3">
            {sourceImage ? (
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-border/60 bg-background">
                <img
                  src={sourceImage}
                  alt={copy("Upload preview", "Xem trước ảnh tải lên")}
                  className="size-full object-cover"
                  style={{
                    transform: `scale(${cropConfig.zoom}) translate(${cropConfig.offsetX * 20}%, ${cropConfig.offsetY * 20}%)`,
                    transformOrigin: "center",
                  }}
                />
                <div className="pointer-events-none absolute inset-0 border-[3px] border-primary/75" />
              </div>
            ) : null}
          </div>

          <div className="grid gap-4">
            <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
              <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                {copy("Crop Output", "Kết quả cắt")}
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div className="size-24 overflow-hidden rounded-full border border-border/70 bg-muted/35">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt={copy("Cropped avatar", "Ảnh đại diện đã cắt")}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
                      {copy("Rendering", "Đang dựng")}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <Badge variant="outline" className="rounded-full">
                    <Crop data-icon="inline-start" />
                    {isRendering
                      ? copy("Rendering preview", "Đang dựng xem trước")
                      : copy("Preview ready", "Đã sẵn sàng")}
                  </Badge>
                  <p className="text-xs text-muted-foreground">{zoomLabel}</p>
                  <p className="text-xs text-muted-foreground">
                    {copy("Focus", "Trọng tâm")}: X{" "}
                    {toPercent(cropConfig.offsetX)} | Y{" "}
                    {toPercent(cropConfig.offsetY)}
                  </p>
                </div>
              </div>
            </div>

            <FieldGroup>
              <Field>
                <FieldLabel>{copy("Zoom Level", "Mức phóng")}</FieldLabel>
                <Select
                  value={cropConfig.zoom.toString()}
                  onValueChange={(value) =>
                    setCropConfig((current) => ({
                      ...current,
                      zoom: Number.parseFloat(value),
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={copy("Select zoom", "Chọn mức phóng")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {ZOOM_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option.toString()}>
                          {option.toFixed(1)}x
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>

            <div className="grid gap-2">
              <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                {copy("Adjust Framing", "Điều chỉnh khung")}
              </p>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="col-start-2"
                  onClick={() => handleNudge("y", -0.1)}
                >
                  <MoveVertical data-icon="inline-start" />
                  {copy("Up", "Lên")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleNudge("x", -0.1)}
                >
                  <MoveHorizontal data-icon="inline-start" />
                  {copy("Left", "Trái")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setCropConfig((current) => ({
                      ...current,
                      offsetX: 0,
                      offsetY: 0,
                    }))
                  }
                >
                  <RotateCcw data-icon="inline-start" />
                  {copy("Center", "Căn giữa")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleNudge("x", 0.1)}
                >
                  <MoveHorizontal data-icon="inline-start" />
                  {copy("Right", "Phải")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="col-start-2"
                  onClick={() => handleNudge("y", 0.1)}
                >
                  <MoveVertical data-icon="inline-start" />
                  {copy("Down", "Xuống")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="col-span-3"
                  onClick={() => setCropConfig(DEFAULT_CROP_CONFIG)}
                >
                  <ZoomIn data-icon="inline-start" />
                  {copy("Reset Crop Settings", "Đặt lại thông số cắt")}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {copy("Cancel", "Hủy")}
          </Button>
          <Button
            type="button"
            onClick={() => {
              if (!previewUrl) {
                return;
              }

              onApply(previewUrl);
              onOpenChange(false);
            }}
            disabled={!previewUrl || isRendering}
          >
            <Crop data-icon="inline-start" />
            {copy("Apply Avatar", "Áp dụng ảnh đại diện")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
