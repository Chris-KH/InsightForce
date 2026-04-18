import { RefreshCw, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useBilingual } from "@/hooks/use-bilingual";

type ProfileDraftActionBarProps = {
  isDirty: boolean;
  isSaving: boolean;
  onReset: () => void;
  onSave: () => void;
};

export function ProfileDraftActionBar({
  isDirty,
  isSaving,
  onReset,
  onSave,
}: ProfileDraftActionBarProps) {
  const copy = useBilingual();

  return (
    <div className="sticky bottom-4 z-20 rounded-2xl border border-border/70 bg-card/92 p-3 shadow-[0_18px_32px_rgba(2,6,23,0.3)] backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onReset}
          disabled={!isDirty || isSaving}
        >
          <RefreshCw data-icon="inline-start" />
          {copy("Discard Changes", "Hủy thay đổi")}
        </Button>

        <Button type="button" onClick={onSave} disabled={!isDirty || isSaving}>
          <Save data-icon="inline-start" />
          {copy("Save Profile", "Lưu hồ sơ")}
        </Button>
      </div>
    </div>
  );
}
