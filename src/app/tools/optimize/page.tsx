"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SlidersHorizontal, Wand2, TrendingUp } from "lucide-react";
import { format } from "date-fns";

import { PageHeader } from "@/components/shared/page-header";
import { GlassCard } from "@/components/shared/glass-card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { optimizeVideoContent, OptimizeVideoContentOutput } from "@/ai/flows/optimize-video-content";
import { Badge } from "@/components/ui/badge";

const optimizeSchema = z.object({
  videoTitle: z
    .string()
    .min(5, "Please provide a title with at least 5 characters."),
  videoDescription: z
    .string()
    .min(10, "Please provide a description with at least 10 characters."),
  videoTags: z.string().min(3, "Please provide at least one tag."),
  videoContentSummary: z.string().min(10, "Please provide a summary."),
  currentViewCount: z.coerce.number().min(0, "View count cannot be negative."),
  currentLikeCount: z.coerce.number().min(0, "Like count cannot be negative."),
  currentCommentCount: z.coerce.number().min(0, "Comment count cannot be negative."),
});

type OptimizeFormValues = z.infer<typeof optimizeSchema>;

export default function OptimizePage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<OptimizeVideoContentOutput | null>(null);

  const form = useForm<OptimizeFormValues>({
    resolver: zodResolver(optimizeSchema),
    defaultValues: {
      videoTitle: "",
      videoDescription: "",
      videoTags: "",
      videoContentSummary: "",
      currentViewCount: 0,
      currentLikeCount: 0,
      currentCommentCount: 0,
    },
  });

  async function onSubmit(data: OptimizeFormValues) {
    setLoading(true);
    setResults(null);
    
    try {
      const optimizedContent = await optimizeVideoContent(data);
      setResults(optimizedContent);
    } catch (error) {
      console.error("Error optimizing content:", error);
      // You could show a toast notification here
    }

    setLoading(false);
  }

  return (
    <div>
      <PageHeader
        title="AI Content Optimizer"
        subtitle="Get AI recommendations to boost your video's performance."
      />
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <GlassCard>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="videoTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Your current video title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="videoDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Your current video description" className="min-h-[100px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="videoTags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Tags</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., travel, vlog, japan" {...field} />
                      </FormControl>
                      <FormDescription>Comma-separated list of tags.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="videoContentSummary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Summary</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Briefly summarize your video's content" className="min-h-[100px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-3 gap-4">
                  <FormField control={form.control} name="currentViewCount" render={({ field }) => (
                    <FormItem><FormLabel>Views</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="currentLikeCount" render={({ field }) => (
                    <FormItem><FormLabel>Likes</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="currentCommentCount" render={({ field }) => (
                    <FormItem><FormLabel>Comments</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  <Wand2 className="mr-2 h-4 w-4" />
                  Optimize Content
                </Button>
              </form>
            </Form>
          </GlassCard>
        </div>

        <div className="lg:col-span-3">
          <GlassCard className="min-h-[400px] lg:min-h-[600px] flex flex-col">
            {loading ? (
              <div className="w-full space-y-4 flex-1 flex flex-col justify-center">
                <Skeleton className="h-8 w-3/4 mx-auto" />
                <Skeleton className="h-6 w-1/2 mx-auto" />
                <div className="space-y-6 pt-6">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
              </div>
            ) : !results ? (
              <div className="text-center text-muted-foreground flex-1 flex flex-col justify-center">
                <SlidersHorizontal className="h-12 w-12 mx-auto mb-4 text-primary/50" />
                <p>Your content optimizations will appear here.</p>
              </div>
            ) : (
              <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2">
                <h3 className="text-xl font-bold">Optimization Results</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <GlassCard className="!p-4 bg-muted/50 hover:shadow-none">
                         <h4 className="text-sm font-semibold text-primary mb-2">Engagement Score</h4>
                         <div className="flex items-center gap-2">
                            <TrendingUp className="w-6 h-6 text-primary"/>
                            <p className="text-2xl font-bold">{results.engagementPredictionScore}/100</p>
                         </div>
                    </GlassCard>
                    <GlassCard className="!p-4 bg-muted/50 hover:shadow-none">
                         <h4 className="text-sm font-semibold text-primary mb-2">Best Time to Post</h4>
                         <p className="text-lg font-bold">{format(new Date(results.recommendedPostingTime), "EEE, MMM d 'at' h:mm a")}</p>
                    </GlassCard>
                </div>

                <div>
                    <h4 className="text-lg font-semibold text-primary mb-2">Optimized Title</h4>
                     <GlassCard className="!p-4 bg-muted/50 hover:shadow-none">
                        <p className="text-muted-foreground">{results.optimizedTitle}</p>
                    </GlassCard>
                </div>
                
                <div>
                    <h4 className="text-lg font-semibold text-primary mb-2">Optimized Description</h4>
                     <GlassCard className="!p-4 bg-muted/50 hover:shadow-none">
                        <p className="text-muted-foreground whitespace-pre-wrap">{results.optimizedDescription}</p>
                    </GlassCard>
                </div>

                <div>
                    <h4 className="text-lg font-semibold text-primary mb-2">Optimized Tags</h4>
                     <GlassCard className="!p-4 bg-muted/50 hover:shadow-none">
                        <div className="flex flex-wrap gap-2">
                            {results.optimizedTags.split(',').map(tag => (
                                <Badge key={tag} variant="secondary">#{tag.trim()}</Badge>
                            ))}
                        </div>
                    </GlassCard>
                </div>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
