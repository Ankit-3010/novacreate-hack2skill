import { PageHeader } from "@/components/shared/page-header";
import { GlassCard } from "@/components/shared/glass-card";
import { Construction } from "lucide-react";

export default function RemixPage() {
  return (
    <div>
      <PageHeader
        title="Content Remix Studio"
        subtitle="Transform one piece of content into multiple formats."
      />
       <GlassCard className="mt-8 flex flex-col items-center justify-center min-h-[400px]">
         <Construction className="w-16 h-16 text-primary mb-4" />
        <h2 className="text-2xl font-bold">Coming Soon</h2>
        <p className="text-muted-foreground mt-2">This feature is currently under development.</p>
      </GlassCard>
    </div>
  );
}
