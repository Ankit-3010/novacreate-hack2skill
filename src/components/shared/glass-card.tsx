import { cn } from "@/lib/utils";

export function GlassCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-primary/10 bg-card/50 p-4 sm:p-6 shadow-lg backdrop-blur-xl",
        "transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_20px_0_hsl(var(--primary)/0.3)]",
        className
      )}
    >
      {children}
    </div>
  );
}
