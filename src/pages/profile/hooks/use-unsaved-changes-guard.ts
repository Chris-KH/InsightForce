import { useCallback, useEffect, useState } from "react";
import { useBeforeUnload, useBlocker } from "react-router";

type UseUnsavedChangesGuardResult = {
  dialogOpen: boolean;
  onDialogOpenChange: (open: boolean) => void;
  stayOnPage: () => void;
  leaveWithoutSaving: () => void;
};

export function useUnsavedChangesGuard(
  shouldGuard: boolean,
): UseUnsavedChangesGuardResult {
  const blocker = useBlocker(shouldGuard);
  const [dialogOpen, setDialogOpen] = useState(false);

  useBeforeUnload((event) => {
    if (!shouldGuard) {
      return;
    }

    event.preventDefault();
    event.returnValue = "";
  });

  useEffect(() => {
    if (blocker.state === "blocked") {
      setDialogOpen(true);
    }
  }, [blocker.state]);

  const stayOnPage = useCallback(() => {
    setDialogOpen(false);

    if (blocker.state === "blocked") {
      blocker.reset();
    }
  }, [blocker]);

  const leaveWithoutSaving = useCallback(() => {
    setDialogOpen(false);

    if (blocker.state === "blocked") {
      blocker.proceed();
    }
  }, [blocker]);

  const onDialogOpenChange = useCallback(
    (open: boolean) => {
      setDialogOpen(open);

      if (!open && blocker.state === "blocked") {
        blocker.reset();
      }
    },
    [blocker],
  );

  return {
    dialogOpen,
    onDialogOpenChange,
    stayOnPage,
    leaveWithoutSaving,
  };
}
