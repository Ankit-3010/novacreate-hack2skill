"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Film, Link as LinkIcon, Wand2 } from "lucide-react";

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
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const repurposeSchema = z.object({
  videoUrl: z.string().url({ message: "Please enter a valid URL." }),
});

type RepurposeFormValues = z.infer<typeof repurposeSchema>;

export default function RepurposePage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);

  const form = useForm<RepurposeFormValues>({
    resolver: zodResolver(repurposeSchema),
    defaultValues: {
      videoUrl: "",
    },
  });

  async function onSubmit(data: RepurposeFormValues) {
    setLoading(true);
    setResults(null);
    console.log(data);

    // Simulate AI call
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Placeholder data for generated clips
    const generatedClips = [
      {
        id: 1,
        title: "Clip 1: The Main Point",
        duration: "0:45",
        summary: "A summary of the first key moment identified by the AI.",
        thumbnail: "https://picsum.photos/seed/clip1/400/225",
        videoSrc: "https://www.w3schools.com/html/mov_bbb.mp4",
      },
      {
        id: 2,
        title: "Clip 2: Funny Moment",
        duration: "0:22",
        summary: "A highlight of a particularly engaging or funny part of the video.",
        thumbnail: "https://picsum.photos/seed/clip2/400/225",
        videoSrc: "https://www.w3schools.com/html/mov_bbb.mp4",
      },
      {
        id: 3,
        title: "Clip 3: The Conclusion",
        duration: "0:35",
        summary: "The final takeaway or call to action, perfect for a short clip.",
        thumbnail: "https://picsum.photos/seed/clip3/400/225",
        videoSrc: "https://www.w3schools.com/html/mov_bbb.mp4",
      },
    ];

    setResults(generatedClips);
    setLoading(false);
  }

  return (
    <div>
      <PageHeader
        title="Video Repurposing"
        subtitle="Turn your long-form videos into engaging short clips with AI."
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
                  name="videoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <LinkIcon className="h-4 w-4" /> Video URL
                      </FormLabel>
                      <FormDescription>
                        Paste in a link to the video you want to repurpose (e.g., YouTube, Vimeo).
                      </FormDescription>
                      <FormControl>
                        <Input
                          placeholder="https://your-video-link.com"
                          className="text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={loading} className="w-full">
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Clips
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
                <div className="grid grid-cols-1 gap-4 mt-4">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-48 w-full" />
                </div>
              </div>
            ) : !results ? (
              <div className="text-center text-muted-foreground flex-1 flex flex-col justify-center">
                <Film className="h-12 w-12 mx-auto mb-4 text-primary/50" />
                <p>Your generated clips will appear here.</p>
              </div>
            ) : (
              <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                <h3 className="text-xl font-bold">Generated Clips</h3>
                {results.map((clip) => (
                  <div key={clip.id}>
                    <h4 className="text-lg font-semibold text-primary mb-2 capitalize">
                      {clip.title}
                    </h4>
                    <GlassCard className="!p-4 bg-muted/50 hover:shadow-none">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="w-full sm:w-1/2">
                          <video
                            src={clip.videoSrc}
                            poster={clip.thumbnail}
                            controls
                            className="w-full rounded-md aspect-video"
                          />
                        </div>
                        <div className="w-full sm:w-1/2">
                            <p className="text-muted-foreground text-sm mb-2">
                                {clip.summary}
                            </p>
                            <p className="text-sm font-medium">
                                Duration: {clip.duration}
                            </p>
                        </div>
                      </div>
                    </GlassCard>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
