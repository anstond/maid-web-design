"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function useKeyboardHeight() {
  const [keyboardHeight, setKeyboardHeight] = React.useState(0);

  React.useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport) return;

    const updateKeyboardHeight = () => {
      const viewport = window.visualViewport;
      if (!viewport) return;
      const height = window.innerHeight - viewport.height;
      setKeyboardHeight(Math.max(0, height));
    };

    window.visualViewport.addEventListener("resize", updateKeyboardHeight);
    return () => window.visualViewport?.removeEventListener("resize", updateKeyboardHeight);
  }, []);

  return keyboardHeight;
}

function Sheet({ ...props }: React.ComponentProps<typeof Dialog.Root>) {
  return <Dialog.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({ ...props }: React.ComponentProps<typeof Dialog.Trigger>) {
  return <Dialog.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({ ...props }: React.ComponentProps<typeof Dialog.Close>) {
  return <Dialog.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({ ...props }: React.ComponentProps<typeof Dialog.Portal>) {
  return <Dialog.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({ className, ...props }: React.ComponentProps<typeof Dialog.Overlay>) {
  return (
    <Dialog.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  );
}

function SheetContent({ className, children, ...props }: React.ComponentProps<typeof Dialog.Content>) {
  const keyboardHeight = useKeyboardHeight();
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!contentRef.current || keyboardHeight === 0) return;

    contentRef.current.style.maxHeight = `calc(100vh - ${keyboardHeight}px)`;
    contentRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [keyboardHeight]);

  return (
    <SheetPortal>
      <SheetOverlay />
      <Dialog.Content
        ref={contentRef}
        data-slot="sheet-content"
        className={cn(
          "fixed z-50 flex max-h-[min(100dvh,100vh)] flex-col overflow-y-auto border border-border bg-surface p-5 pb-[max(1.25rem,calc(1.25rem+env(safe-area-inset-bottom)))] shadow-[0_24px_80px_rgba(21,94,99,0.24)] transition ease-[cubic-bezier(0.32,0.72,0,1)] data-[state=closed]:duration-150 data-[state=open]:duration-300 sm:pb-5",
          "inset-x-0 bottom-0 rounded-t-3xl data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom",
          "sm:left-1/2 sm:top-1/2 sm:bottom-auto sm:w-full sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:data-[state=closed]:zoom-out-95 sm:data-[state=closed]:fade-out-0 sm:data-[state=open]:zoom-in-95 sm:data-[state=open]:fade-in-0 sm:data-[state=closed]:slide-out-to-bottom-0 sm:data-[state=open]:slide-in-from-bottom-0",
          className
        )}
        {...props}
      >
        {children}
        <Dialog.Close className="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-full text-text-secondary transition hover:bg-surface-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30">
          <XIcon aria-hidden="true" />
          <span className="sr-only">Close</span>
        </Dialog.Close>
      </Dialog.Content>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sheet-header" className={cn("flex flex-col gap-1.5 pr-12", className)} {...props} />;
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sheet-footer" className={cn("sticky bottom-0 -mx-5 -mb-[max(1.25rem,calc(1.25rem+env(safe-area-inset-bottom)))] mt-6 flex flex-col-reverse gap-3 bg-surface px-5 py-3 sm:flex-row sm:justify-end sm:-mb-5 sm:pb-5 transition-all duration-300", className)} {...props} />;
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof Dialog.Title>) {
  return <Dialog.Title data-slot="sheet-title" className={cn("text-xl font-bold text-text-primary", className)} {...props} />;
}

function SheetDescription({ className, ...props }: React.ComponentProps<typeof Dialog.Description>) {
  return <Dialog.Description data-slot="sheet-description" className={cn("text-sm leading-6 text-text-secondary", className)} {...props} />;
}

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
};
