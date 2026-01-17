import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { GlassCard } from "@/components/shared/glass-card";
import { Lightbulb, FileText, ImageIcon, Hash, Share2, BarChart2, Zap, Wand2 } from "lucide-react";

const tools = [
    {
        title: "Idea Generator",
        description: "Get viral video concepts tailored to your niche.",
        icon: Lightbulb,
        href: "/create", // Tabs default to idea
    },
    {
        title: "Script Writer",
        description: "Generate full scripts with engaging hooks.",
        icon: FileText,
        href: "/create", // User can switch tab
    },
    {
        title: "Content Remix",
        description: "Transform content into multiple formats with AI.",
        icon: Wand2,
        href: "/remix",
    },
    {
        title: "Thumbnail Creator",
        description: "Design high-CTR thumbnails with AI.",
        icon: ImageIcon,
        href: "/create",
    },
    {
        title: "Hashtag Optimizer",
        description: "Find trending tags to boost visibility.",
        icon: Hash,
        href: "/create",
    },
    {
        title: "SEO Optimizer",
        description: "Optimize titles and descriptions.",
        icon: Zap,
        href: "/tools/optimize",
    },
];

export default function ToolsPage() {
    return (
        <div className="space-y-8">
            <PageHeader
                title="AI Tools"
                subtitle="Everything you need to create, optimize, and grow."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.map((tool) => (
                    <Link href={tool.href} key={tool.title}>
                        <GlassCard className="h-full hover:border-primary/50 transition-all hover:shadow-lg hover:-translate-y-1">
                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                <tool.icon className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-bold text-xl mb-2">{tool.title}</h3>
                            <p className="text-muted-foreground">{tool.description}</p>
                        </GlassCard>
                    </Link>
                ))}
            </div>
        </div>
    );
}
