import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Video, TrendingUp, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background -z-10" />
        <div className="container px-4 md:px-6 mx-auto text-center">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20 mb-8">
            <Sparkles className="w-3 h-3 mr-1" />
            AI-Powered Content Creation
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight lg:text-7xl mb-6">
            Create Viral Content <br className="hidden md:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
              at Light Speed.
            </span>
          </h1>
          <p className="max-w-[600px] mx-auto text-muted-foreground text-lg md:text-xl mb-10">
            NovaCreate provides the AI tools you need to generate video ideas, write scripts, create thumbnails, and optimize for growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8 h-12 rounded-full">
              <Link href="/dashboard">
                Start Creating <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">Everything You Need</h2>
            <p className="text-muted-foreground text-lg">Powerful AI tools integrated into one seamless workflow.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background border rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Idea Generation</h3>
              <p className="text-muted-foreground">Never run out of inspiration. Get AI-curated video ideas tailored to your niche.</p>
            </div>
            <div className="bg-background border rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
                <Video className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Script Writing</h3>
              <p className="text-muted-foreground">Generate comprehensive video scripts with engaging hooks in seconds.</p>
            </div>
            <div className="bg-background border rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-6">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Growth Analytics</h3>
              <p className="text-muted-foreground">Optimize your content with predictive analytics and best-time-to-post insights.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t mt-auto">
        <div className="container px-4 md:px-6 mx-auto text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} NovaCreate AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
