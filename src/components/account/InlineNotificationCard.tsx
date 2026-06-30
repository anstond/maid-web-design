import Link from "next/link";
import type { ReactNode } from "react";
import { AlertCircle, CalendarClock, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const toneStyles = {
  info: {
    frame: "border-info/25 bg-info/5",
    icon: "bg-info/10 text-info",
    title: "text-info",
  },
  success: {
    frame: "border-success/25 bg-success/5",
    icon: "bg-success/10 text-success",
    title: "text-success",
  },
  warning: {
    frame: "border-warning/30 bg-warning/10",
    icon: "bg-warning/15 text-warning",
    title: "text-warning",
  },
  error: {
    frame: "border-error/25 bg-error/5",
    icon: "bg-error/10 text-error",
    title: "text-error",
  },
};

const toneIcons = {
  info: Info,
  success: CheckCircle2,
  warning: CalendarClock,
  error: AlertCircle,
};

export function InlineNotificationCard({
  tone = "info",
  title,
  message,
  action,
  icon,
  className,
}: {
  tone?: keyof typeof toneStyles;
  title: string;
  message: ReactNode;
  action?: { label: string; href: string } | ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  const styles = toneStyles[tone];
  const Icon = toneIcons[tone];

  return (
    <div
      role="status"
      className={cn("rounded-2xl border px-4 py-5 sm:p-6", styles.frame, className)}
    >
      <div className="flex items-start gap-3">
        <span className={cn("mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full", styles.icon)}>
          {icon ?? <Icon className="size-5" aria-hidden="true" />}
        </span>
        <div className="min-w-0 flex-1">
          <p className={cn("text-sm font-bold sm:text-base", styles.title)}>{title}</p>
          <div className="mt-1 text-sm leading-6 text-text-secondary">{message}</div>
          {action ? <div className="mt-3 flex flex-col gap-2 sm:flex-row">{renderAction(action, tone)}</div> : null}
        </div>
      </div>
    </div>
  );
}

function renderAction(action: { label: string; href: string } | ReactNode, tone: keyof typeof toneStyles) {
  if (isActionLink(action)) {
    return (
      <Link
        href={action.href}
        className={cn(
          "inline-flex min-h-11 items-center justify-center rounded-full px-4 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 active:scale-95",
          tone === "error" ? "bg-error text-white hover:bg-error/90" : "bg-primary text-primary-foreground hover:bg-primary-hover"
        )}
      >
        {action.label}
      </Link>
    );
  }

  return action;
}

function isActionLink(action: { label: string; href: string } | ReactNode): action is { label: string; href: string } {
  return Boolean(
    action &&
      typeof action === "object" &&
      "label" in action &&
      "href" in action
  );
}
