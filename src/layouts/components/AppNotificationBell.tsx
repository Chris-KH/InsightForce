import { Bell, CheckCheck, ChevronRight, Eraser, Inbox } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

import {
  clearActivityFeed,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/app/slices/activity-feed.slice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useBilingual } from "@/hooks/use-bilingual";
import {
  formatActivityRelativeTime,
  getActivityDomainIcon,
  getActivityDomainLabel,
  getActivityStatusClass,
} from "@/lib/activity-feed";
import { navigateToActivityRoute } from "@/lib/activity-navigation";
import { cn } from "@/lib/utils";

export function AppNotificationBell() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const copy = useBilingual();

  const notifications = useAppSelector(
    (state) => state.activityFeed.notifications,
  );

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications],
  );

  const [filter, setFilter] = useState<
    "all" | "unread" | "automation" | "strategy" | "error"
  >("all");

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      if (filter === "all") {
        return true;
      }

      if (filter === "unread") {
        return !notification.read;
      }

      if (filter === "error") {
        return notification.status === "error";
      }

      return notification.domain === filter;
    });
  }, [filter, notifications]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="relative">
          <Bell />
          {unreadCount > 0 ? (
            <span className="absolute -top-0.5 -right-0.5 inline-flex size-2.5 rounded-full border border-background bg-primary" />
          ) : null}
          <span className="sr-only">{copy("Notifications", "Thông báo")}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={10} className="w-95 p-0">
        <div className="border-b border-border/60 px-3 py-2.5">
          <div className="flex items-center justify-between gap-2">
            <DropdownMenuLabel className="p-0 text-sm font-semibold text-foreground">
              {copy("Notifications", "Thông báo")}
            </DropdownMenuLabel>
            {unreadCount > 0 ? (
              <Badge
                variant="outline"
                className="rounded-full border-primary/30 bg-primary/10 text-primary"
              >
                {copy(`${unreadCount} new`, `${unreadCount} mới`)}
              </Badge>
            ) : null}
          </div>

          <div className="mt-2 flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={() => dispatch(markAllNotificationsRead())}
              disabled={notifications.length === 0 || unreadCount === 0}
            >
              <CheckCheck data-icon="inline-start" />
              {copy("Mark all read", "Đánh dấu đã đọc")}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={() => {
                dispatch(clearActivityFeed());
                setFilter("all");
              }}
              disabled={notifications.length === 0}
              className="text-muted-foreground"
            >
              <Eraser data-icon="inline-start" />
              {copy("Clear", "Xóa")}
            </Button>
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5">
            <Button
              type="button"
              size="xs"
              variant={filter === "all" ? "secondary" : "ghost"}
              onClick={() => setFilter("all")}
            >
              {copy("All", "Tất cả")}
            </Button>
            <Button
              type="button"
              size="xs"
              variant={filter === "unread" ? "secondary" : "ghost"}
              onClick={() => setFilter("unread")}
            >
              {copy("Unread", "Chưa đọc")}
            </Button>
            <Button
              type="button"
              size="xs"
              variant={filter === "automation" ? "secondary" : "ghost"}
              onClick={() => setFilter("automation")}
            >
              {copy("Automation", "Automation")}
            </Button>
            <Button
              type="button"
              size="xs"
              variant={filter === "strategy" ? "secondary" : "ghost"}
              onClick={() => setFilter("strategy")}
            >
              {copy("Strategy", "Strategy")}
            </Button>
            <Button
              type="button"
              size="xs"
              variant={filter === "error" ? "secondary" : "ghost"}
              onClick={() => setFilter("error")}
            >
              {copy("Failed", "Lỗi")}
            </Button>
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="flex min-h-36 flex-col items-center justify-center gap-2 px-4 py-6 text-center text-sm text-muted-foreground">
            <Inbox className="size-5" />
            <p>{copy("No notifications yet.", "Chưa có thông báo nào.")}</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex min-h-30 flex-col items-center justify-center gap-2 px-4 py-6 text-center text-sm text-muted-foreground">
            <Inbox className="size-5" />
            <p>
              {copy(
                "No notifications match this filter.",
                "Không có thông báo khớp bộ lọc này.",
              )}
            </p>
          </div>
        ) : (
          <div className="max-h-105 overflow-y-auto px-2 py-2">
            {filteredNotifications.map((notification, index) => {
              const DomainIcon = getActivityDomainIcon(notification.domain);
              const isUnread = !notification.read;

              return (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => {
                    dispatch(markNotificationRead(notification.id));
                    navigateToActivityRoute(navigate, notification.route);
                  }}
                  className={cn(
                    "group w-full rounded-xl border border-transparent px-2.5 py-2 text-left transition hover:border-border/70 hover:bg-muted/45",
                    isUnread && "bg-primary/6",
                  )}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={cn(
                        "mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-lg border",
                        getActivityStatusClass(notification.status),
                      )}
                    >
                      <DomainIcon className="size-3.5" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p
                          className={cn(
                            "line-clamp-1 text-sm text-foreground",
                            isUnread && "font-semibold",
                          )}
                        >
                          {notification.title}
                        </p>
                        {isUnread ? (
                          <span className="size-1.5 rounded-full bg-primary" />
                        ) : null}
                      </div>

                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                        {notification.description}
                      </p>

                      <div className="mt-1.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span>
                          {getActivityDomainLabel(notification.domain, copy)}
                        </span>
                        <span>•</span>
                        <span>
                          {formatActivityRelativeTime(
                            notification.createdAt,
                            copy,
                          )}
                        </span>
                      </div>
                    </div>

                    <ChevronRight className="mt-1 size-3.5 text-muted-foreground/80" />
                  </div>

                  {index < filteredNotifications.length - 1 ? (
                    <div className="mt-2 h-px bg-border/55" />
                  ) : null}
                </button>
              );
            })}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
