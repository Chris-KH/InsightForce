import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useBilingual } from "@/hooks/use-bilingual";

type ProfileUnsavedChangesDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStayOnPage: () => void;
  onLeaveWithoutSaving: () => void;
};

export function ProfileUnsavedChangesDialog({
  open,
  onOpenChange,
  onStayOnPage,
  onLeaveWithoutSaving,
}: ProfileUnsavedChangesDialogProps) {
  const copy = useBilingual();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {copy("Unsaved Changes", "Có thay đổi chưa lưu")}
          </DialogTitle>
          <DialogDescription>
            {copy(
              "You have unsaved profile edits. Leaving this page now will discard your current draft.",
              "Bạn đang có chỉnh sửa hồ sơ chưa lưu. Nếu rời trang bây giờ, bản nháp hiện tại sẽ bị mất.",
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onStayOnPage}>
            {copy("Stay On Page", "Ở lại trang")}
          </Button>
          <Button type="button" onClick={onLeaveWithoutSaving}>
            {copy("Leave Without Saving", "Rời trang không lưu")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
