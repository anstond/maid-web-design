import { Skeleton } from "@/components/ui/skeleton";

export function ProfilePageSkeleton() {
  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
        <Skeleton className="mb-4 h-6 w-32" />
        <Skeleton className="mb-2 h-10 w-64" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Hero Section */}
      <section className="mb-8 overflow-hidden rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
          <Skeleton className="size-24 rounded-full flex-shrink-0" />
          <div className="flex-1">
            <Skeleton className="mb-3 h-10 w-48" />
            <Skeleton className="mb-4 h-5 w-64" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* Sidebar (Right on desktop, first on mobile) */}
        <aside className="order-first grid gap-6 lg:order-last lg:sticky lg:top-24 lg:self-start">
          {/* Next Booking Card */}
          <div className="rounded-2xl border border-border bg-surface p-6">
            <Skeleton className="mb-4 h-6 w-32" />
            <div className="flex flex-col gap-3">
              <div>
                <Skeleton className="mb-2 h-4 w-16" />
                <Skeleton className="h-5 w-40" />
              </div>
              <div>
                <Skeleton className="mb-2 h-4 w-16" />
                <Skeleton className="h-5 w-40" />
              </div>
              <Skeleton className="h-11 w-full rounded-full" />
            </div>
          </div>

          {/* Account Overview Card */}
          <div className="rounded-2xl border border-border bg-surface p-6">
            <Skeleton className="mb-4 h-6 w-40" />
            <div className="flex flex-col gap-4">
              <div className="border-b border-border pb-4">
                <Skeleton className="mb-2 h-4 w-24" />
                <Skeleton className="h-5 w-32" />
              </div>
              <div>
                <Skeleton className="mb-2 h-4 w-32" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          </div>

          {/* Privacy Card */}
          <div className="rounded-2xl bg-primary p-6">
            <Skeleton className="mb-2 h-4 w-24 bg-primary/30" />
            <Skeleton className="h-4 w-full bg-primary/30" />
          </div>
        </aside>

        {/* Main Content */}
        <div className="grid gap-6">
          {/* Contact Information Card */}
          <div className="rounded-2xl border border-border bg-surface p-6">
            <Skeleton className="mb-4 h-6 w-40" />
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-border">
                <div className="flex-1">
                  <Skeleton className="mb-2 h-4 w-24" />
                  <Skeleton className="h-5 w-40" />
                </div>
                <Skeleton className="h-11 w-20 rounded-full" />
              </div>
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-border">
                <div className="flex-1">
                  <Skeleton className="mb-2 h-4 w-16" />
                  <Skeleton className="h-5 w-48" />
                </div>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <Skeleton className="mb-2 h-4 w-16" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <Skeleton className="h-11 w-20 rounded-full" />
              </div>
            </div>
          </div>

          {/* Addresses Card */}
          <div className="rounded-2xl border border-border bg-surface p-6">
            <Skeleton className="mb-4 h-6 w-24" />
            <div className="flex flex-col gap-3">
              <div className="rounded-2xl border border-border bg-surface-muted p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <Skeleton className="mb-2 h-5 w-48" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-10 w-20 rounded-full" />
                </div>
              </div>
              <Skeleton className="h-10 w-32 rounded-full" />
            </div>
          </div>

          {/* Payment Methods Card */}
          <div className="rounded-2xl border border-border bg-surface p-6">
            <Skeleton className="mb-4 h-6 w-40" />
            <div className="flex flex-col gap-3">
              <div className="rounded-2xl border border-border bg-surface-muted p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <Skeleton className="mb-2 h-5 w-40" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-10 w-28 rounded-full" />
                </div>
              </div>
              <Skeleton className="h-10 w-32 rounded-full" />
            </div>
          </div>

          {/* Close Account Card */}
          <div className="rounded-2xl border-2 border-error/40 bg-error/8 p-6">
            <Skeleton className="mb-3 h-6 w-32 bg-error/20" />
            <Skeleton className="mb-4 h-4 w-96 bg-error/20" />
            <Skeleton className="h-10 w-32 rounded-full bg-error/20" />
          </div>
        </div>
      </div>
    </>
  );
}
