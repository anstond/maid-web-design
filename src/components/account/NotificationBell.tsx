"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Bell, CalendarClock, CheckCheck, CreditCard, Sparkles } from "lucide-react";
import { accountNotifications, type AccountNotification } from "@/lib/mock-account-data";
import { cn } from "@/lib/utils";

const severityIcons = {
  info: CalendarClock,
  success: CheckCheck,
  warning: AlertCircle,
  error: CreditCard,
};

function formatNotificationTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<AccountNotification[]>(accountNotifications);
  const unreadCount = notifications.filter((notification) => !notification.readAt).length;
  const recentNotifications = useMemo(() => notifications.slice(0, 5), [notifications]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const markNotificationRead = (id: string) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id && !notification.readAt
          ? { ...notification, readAt: new Date().toISOString() }
          : notification
      )
    );
    setOpen(false);
  };

  const markAllRead = () => {
    const now = new Date().toISOString();
    setNotifications((current) =>
      current.map((notification) => (notification.readAt ? notification : { ...notification, readAt: now }))
    );
  };

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Open notifications"
        aria-expanded={open}
        aria-controls="account-notifications-menu"
        onClick={() => setOpen((current) => !current)}
        className="relative inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-surface-muted text-text-primary transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-accent-soft hover:scale-105 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 active:scale-95"
      >
        <Bell className="size-5" aria-hidden="true" />
        {unreadCount > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold leading-none text-primary-foreground">
            {unreadCount}
          </span>
        ) : null}
      </button>

      <span className="sr-only" aria-live="polite">
        {unreadCount > 0 ? `${unreadCount} unread notifications` : "No unread notifications"}
      </span>

      {open ? (
        <div
          id="account-notifications-menu"
          className="absolute right-0 top-14 z-50 w-[min(calc(100vw-2rem),24rem)] overflow-hidden rounded-2xl border border-border bg-surface text-text-primary shadow-[0_16px_48px_rgba(21,94,99,0.18)]"
        >
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
            <div>
              <p className="text-sm font-bold text-text-primary">Notifications</p>
              <p className="mt-0.5 text-xs text-text-secondary">Service updates for your account.</p>
            </div>
            {unreadCount > 0 ? (
              <button
                type="button"
                onClick={markAllRead}
                className="shrink-0 rounded-full px-3 py-2 text-xs font-bold text-primary transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30"
              >
                Mark all read
              </button>
            ) : null}
          </div>

          <div className="max-h-[22rem] overflow-y-auto">
            {recentNotifications.length > 0 ? (
              <div className="grid">
                {recentNotifications.map((notification) => (
                  <NotificationRow key={notification.id} notification={notification} onRead={markNotificationRead} />
                ))}
              </div>
            ) : (
              <div className="px-4 py-8 text-center">
                <span className="mx-auto flex size-11 items-center justify-center rounded-full bg-surface-muted text-primary">
                  <Sparkles className="size-5" aria-hidden="true" />
                </span>
                <p className="mt-3 text-sm font-bold text-text-primary">No notifications yet</p>
                <p className="mt-1 text-sm text-text-secondary">Service updates will appear here.</p>
              </div>
            )}
          </div>

          <div className="border-t border-border bg-surface-muted px-4 py-3">
            <span className="block text-center text-xs font-bold text-text-secondary">View all notifications</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function NotificationRow({
  notification,
  onRead,
}: {
  notification: AccountNotification;
  onRead: (id: string) => void;
}) {
  const Icon = severityIcons[notification.severity];
  const unread = !notification.readAt;
  const content = (
    <>
      <span
        className={cn(
          "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full",
          notification.severity === "error" && "bg-error/10 text-error",
          notification.severity === "warning" && "bg-warning/10 text-warning",
          notification.severity === "success" && "bg-success/10 text-success",
          notification.severity === "info" && "bg-info/10 text-info"
        )}
      >
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className={cn("block text-sm leading-5", unread ? "font-bold text-text-primary" : "font-semibold text-text-primary")}>
          {notification.title}
        </span>
        <span className="mt-1 block text-sm leading-5 text-text-secondary">{notification.message}</span>
        <span className="mt-2 block text-xs font-semibold text-text-secondary">{formatNotificationTime(notification.createdAt)}</span>
      </span>
    </>
  );

  if (notification.actionHref) {
    return (
      <Link
        href={notification.actionHref}
        onClick={() => onRead(notification.id)}
        className={cn(
          "flex min-h-11 gap-3 border-b border-border px-4 py-3 text-left transition last:border-b-0 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30",
          unread ? "bg-surface-muted hover:bg-accent-soft" : "bg-surface hover:bg-surface-muted"
        )}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onRead(notification.id)}
      className={cn(
        "flex min-h-11 w-full gap-3 border-b border-border px-4 py-3 text-left transition last:border-b-0 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30",
        unread ? "bg-surface-muted hover:bg-accent-soft" : "bg-surface hover:bg-surface-muted"
      )}
    >
      {content}
    </button>
  );
}
