"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Hash, Wand2 } from "lucide-react";

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
import { generateRelevantHashtags, GenerateRelevantHashtagsOutput } from "@/ai/flows/generate-relevant-hashtags";
import { Badge } from "@/components/ui/badge";

const hashtagSchema = z.object({
  videoTitle: z
    .string()
    .min(5, "Please provide a title with at least 5 characters."),
  videoDescription: z
    .string()
    .min(10, "Please provide a description with at least 10 characters."),
});

type HashtagFormValues = z.infer<typeof hashtagSchema>;

export default function HashtagsPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GenerateRelevantHashtagsOutput | null>(null);

  const form = useForm<HashtagFormValues>({
    resolver: zodResolver(hashtagSchema),
    defaultValues: {
      videoTitle: "",
      videoDescription: "",
    },
  });

  async function onSubmit(data: HashtagFormValues) {
    setLoading(true);
    setResults(null);
    
    try {
      const generatedHashtags = await generateRelevantHashtags(data);
      setResults(generatedHashtags);
    } catch (error) {
      console.error("Error generating hashtags:", error);
      // You could show a toast notification here
    }

    setLoading(false);
  }

  return (
    <div>
      <PageHeader
        title="AI Hashtag Generator"
        subtitle="Find the best hashtags to maximize your video's reach."
      />
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <GlassCard>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="videoTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video Title</FormLabel>
                      <FormDescription>
                        Enter the title of your video.
                      </FormDescription>
                      <FormControl>
                        <Input
                          placeholder="e.g., My Epic Trip to the Swiss Alps"
                          {...field}
                        />
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
                      <FormDescription>
                        Describe what your video is about.
                      </FormDescription>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., A cinematic travel film showcasing the beauty of the mountains, hiking trails, and local culture..."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={loading} className="w-full">
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Hashtags
                </Button>
              </form>
            </Form>
          </GlassCard>
        </div>

        <div className="lg:col-span-3">
          <GlassCard className="min-h-[400px] lg:min-h-[500px] flex flex-col">
            {loading ? (
              <div className="w-full space-y-4 flex-1 flex flex-col justify-center">
                <Skeleton className="h-8 w-3/4 mx-auto" />
                <Skeleton className="h-6 w-1/2 mx-auto" />
                <div className="space-y-6 pt-6">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
              </div>
            ) : !results ? (
              <div className="text-center text-muted-foreground flex-1 flex flex-col justify-center">
                <Hash className="h-12 w-12 mx-auto mb-4 text-primary/50" />
                <p>Your generated hashtags will appear here.</p>
              </div>
            ) : (
              <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                <h3 className="text-xl font-bold">Generated Hashtags</h3>
                
                <div>
                    <h4 className="text-lg font-semibold text-primary mb-2">Trending</h4>
                     <GlassCard className="!p-4 bg-muted/50 hover:shadow-none">
                        <div className="flex flex-wrap gap-2">
                            {results.trendingHashtags.map(tag => (
                                <Badge key={tag} variant="secondary">#{tag}</Badge>
                            ))}
                        </div>
                    </GlassCard>
                </div>
                
                <div>
                    <h4 className="text-lg font-semibold text-primary mb-2">Niche</h4>
                     <GlassCard className="!p-4 bg-muted/50 hover:shadow-none">
                        <div className="flex flex-wrap gap-2">
                            {results.nicheHashtags.map(tag => (
                                <Badge key={tag} variant="secondary">#{tag}</Badge>
                            ))}
                        </div>
                    </GlassCard>
                </div>

                <div>
                    <h4 className="text-lg font-semibold text-primary mb-2">Branded</h4>
                     <GlassCard className="!p-4 bg-muted/50 hover:shadow-none">
                        <div className="flex flex-wrap gap-2">
                            {results.brandedHashtags.map(tag => (
                                <Badge key={tag} variant="secondary">#{tag}</Badge>
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
