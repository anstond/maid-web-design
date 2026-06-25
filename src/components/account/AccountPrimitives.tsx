import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Check, Circle, Clock3 } from "lucide-react";
import { cn } from "@/lib/utils";

const statusStyles = {
  scheduled: "bg-info/10 text-info border-info/25",
  in_progress: "bg-warning/10 text-warning border-warning/25",
  completed: "bg-success/10 text-success border-success/25",
  needs_attention: "bg-error/10 text-error border-error/25",
  cancelled: "bg-text-secondary/10 text-text-secondary border-border",
  active: "bg-success/10 text-success border-success/25",
  paused: "bg-warning/10 text-warning border-warning/25",
  ending: "bg-error/10 text-error border-error/25",
};

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="mb-2 text-sm font-semibold text-primary">{eyebrow}</p>
        <h1 className="text-3xl font-bold leading-tight tracking-normal text-text-primary md:text-4xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function StatusPill({ status }: { status: keyof typeof statusStyles | string }) {
  const normalized = status.toLowerCase().replaceAll(" ", "_") as keyof typeof statusStyles;
  return (
    <span className={cn("inline-flex min-h-8 items-center rounded-full border px-3 text-xs font-bold capitalize", statusStyles[normalized] ?? statusStyles.scheduled)}>
      {status.replaceAll("_", " ")}
    </span>
  );
}

export function SummaryCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-[0_12px_40px_rgba(21,94,99,0.08)]">
      <h2 className="mb-4 text-lg font-bold text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

export function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-border py-3 last:border-b-0 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-4">
      <dt className="text-sm font-bold text-text-secondary">{label}</dt>
      <dd className="text-sm font-semibold leading-6 text-text-primary">{value}</dd>
    </div>
  );
}

export function ActionLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 active:translate-y-px"
    >
      {children}
      <ArrowRight className="size-4" aria-hidden="true" />
    </Link>
  );
}

export function SecondaryButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      className="inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-surface px-5 text-sm font-bold text-text-primary transition hover:border-primary/40 hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 active:translate-y-px"
    >
      {children}
    </button>
  );
}

export function Timeline({
  items,
}: {
  items: Array<{ label: string; time: string; state: "done" | "current" | "upcoming" }>;
}) {
  return (
    <ol className="space-y-4">
      {items.map((item) => (
        <li key={`${item.label}-${item.time}`} className="flex gap-3">
          <span
            className={cn(
              "mt-1 flex size-6 shrink-0 items-center justify-center rounded-full border",
              item.state === "done" && "border-primary bg-primary text-primary-foreground",
              item.state === "current" && "border-primary bg-surface text-primary",
              item.state === "upcoming" && "border-border bg-surface-muted text-text-secondary"
            )}
          >
            {item.state === "done" ? <Check className="size-3.5" aria-hidden="true" /> : item.state === "current" ? <Clock3 className="size-3.5" aria-hidden="true" /> : <Circle className="size-2" aria-hidden="true" />}
          </span>
          <span>
            <span className="block text-sm font-bold text-text-primary">{item.label}</span>
            <span className="mt-1 block text-sm text-text-secondary">{item.time}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

export function Money({ value }: { value: number }) {
  return <span className="tabular-nums">${value.toFixed(2)}</span>;
}
