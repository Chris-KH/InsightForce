import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

import {
  dismissToast,
  markNotificationRead,
} from "@/app/slices/activity-feed.slice";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useBilingual } from "@/hooks/use-bilingual";
import {
  getActivityStatusClass,
  getActivityStatusIcon,
} from "@/lib/activity-feed";
import { navigateToActivityRoute } from "@/lib/activity-navigation";
import { cn } from "@/lib/utils";

export function AppActivityToaster() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const copy = useBilingual();
  const toasts = useAppSelector((state) => state.activityFeed.toasts);

  useEffect(() => {
    const timers = toasts.map((toast) =>
      window.setTimeout(() => {
        dispatch(dismissToast(toast.id));
      }, toast.durationMs),
    );

    return () => {
      for (const timer of timers) {
        window.clearTimeout(timer);
      }
    };
  }, [dispatch, toasts]);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed top-20 right-4 z-50 flex w-[min(92vw,420px)] flex-col gap-3 sm:right-6 lg:right-8">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const StatusIcon = getActivityStatusIcon(toast.status);

          return (
            <motion.article
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 26, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 24, scale: 0.94 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className="pointer-events-auto"
            >
              <button
                type="button"
                onClick={() => {
                  dispatch(markNotificationRead(toast.notificationId));
                  dispatch(dismissToast(toast.id));
                  navigateToActivityRoute(navigate, toast.route);
                }}
                className={cn(
                  "group relative w-full overflow-hidden rounded-2xl border bg-background/88 p-3 text-left shadow-[0_20px_46px_rgba(15,23,42,0.16)] ring-1 ring-border/50 backdrop-blur-xl transition hover:-translate-y-0.5 hover:shadow-[0_22px_52px_rgba(15,23,42,0.2)]",
                  getActivityStatusClass(toast.status),
                )}
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-xl border border-current/25 bg-current/10">
                    <StatusIcon className="size-4" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-semibold text-foreground">
                      {toast.title}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {toast.description}
                    </p>
                    <p className="mt-2 text-[11px] font-medium text-primary">
                      {copy("Open result", "Mở kết quả")}
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    className="-mt-0.5 -mr-1 text-muted-foreground hover:text-foreground"
                    onClick={(event) => {
                      event.stopPropagation();
                      dispatch(dismissToast(toast.id));
                    }}
                  >
                    <X className="size-3.5" />
                    <span className="sr-only">{copy("Dismiss", "Đóng")}</span>
                  </Button>
                </div>

                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: 0 }}
                  transition={{
                    duration: toast.durationMs / 1000,
                    ease: "linear",
                  }}
                  className="mt-2.5 h-0.5 rounded-full bg-primary/70"
                />
              </button>
            </motion.article>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
