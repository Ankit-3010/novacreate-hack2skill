"use client";

import { useState } from "react";
import Image from "next/image";
import { FileText, ImageIcon, Lightbulb, Mic, Wand2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlassCard } from "@/components/shared/glass-card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { generateVideoThumbnail } from "@/ai/flows/generate-video-thumbnail";
import { generateVideoScriptsAndHooks } from "@/ai/flows/generate-video-scripts-and-hooks";
import { generateVideoCaptionsAndSubtitles } from "@/ai/flows/generate-video-captions-and-subtitles";

const thumbnailSchema = z.object({
  videoTitle: z.string().min(5, "Title must be at least 5 characters."),
  videoDescription: z.string().optional(),
  userPrompt: z.string().min(10, "Prompt must be at least 10 characters."),
});

const scriptSchema = z.object({
  topic: z.string().min(5, "Topic must be at least 5 characters."),
  targetAudience: z.string().min(5, "Audience must be at least 5 characters."),
  videoLength: z.string().min(3, "Length must be at least 3 characters."),
});

const captionSchema = z.object({
  videoDataUri: z.string().optional(), // In a real app, this would handle file uploads
  language: z.string().min(2, "Language is required."),
});

export default function CreatePage() {
  const [activeTab, setActiveTab] = useState("thumbnail");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>({});
  
  const thumbnailForm = useForm<z.infer<typeof thumbnailSchema>>({
    resolver: zodResolver(thumbnailSchema),
    defaultValues: { videoTitle: "", videoDescription: "", userPrompt: "" },
  });

  const scriptForm = useForm<z.infer<typeof scriptSchema>>({
    resolver: zodResolver(scriptSchema),
    defaultValues: { topic: "", targetAudience: "", videoLength: "30 seconds" },
  });
  
  const captionForm = useForm<z.infer<typeof captionSchema>>({
    resolver: zodResolver(captionSchema),
    defaultValues: { language: "English" },
  });


  async function handleThumbnailSubmit(values: z.infer<typeof thumbnailSchema>) {
    setLoading(true);
    setResults({});
    // In a real app, you would call the AI flow. Here we simulate it.
    // const result = await generateVideoThumbnail(values);
    setTimeout(() => {
      setResults({
        thumbnail: PlaceHolderImages.find(p => p.id === 'thumbnail-preview')
      });
      setLoading(false);
    }, 2000);
  }
  
  async function handleScriptSubmit(values: z.infer<typeof scriptSchema>) {
    setLoading(true);
    setResults({});
    // const result = await generateVideoScriptsAndHooks(values);
     setTimeout(() => {
      setResults({
        script: "This is a generated script about " + values.topic + ". It starts with an interesting hook to grab attention. The middle part explains the core concepts for " + values.targetAudience + ". Finally, it ends with a strong call to action.",
        hooks: {
          curious: "Did you know this one secret about " + values.topic + "?",
          controversial: "Everything you've been told about " + values.topic + " is wrong.",
          educational: "In the next " + values.videoLength + ", you'll master " + values.topic + ".",
          fomo: "Don't be the last to know about this " + values.topic + " trend."
        }
      });
      setLoading(false);
    }, 2000);
  }

  return (
    <div>
      <PageHeader
        title="AI Creation Workspace"
        subtitle="Generate stunning assets for your content in seconds."
      />
      <Tabs defaultValue="thumbnail" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-transparent border-b rounded-none p-0 mb-6">
            <TabsTrigger value="thumbnail" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-t-md rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary"><ImageIcon className="mr-2 h-4 w-4"/>Thumbnail</TabsTrigger>
            <TabsTrigger value="script" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-t-md rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary"><FileText className="mr-2 h-4 w-4"/>Script & Hooks</TabsTrigger>
            <TabsTrigger value="caption" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-t-md rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary"><Mic className="mr-2 h-4 w-4"/>Captions</TabsTrigger>
            <TabsTrigger value="hooks" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-t-md rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary"><Lightbulb className="mr-2 h-4 w-4"/>Hooks</TabsTrigger>
        </TabsList>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
                <GlassCard>
                    <TabsContent value="thumbnail">
                        <Form {...thumbnailForm}>
                            <form onSubmit={thumbnailForm.handleSubmit(handleThumbnailSubmit)} className="space-y-6">
                                <FormField control={thumbnailForm.control} name="videoTitle" render={({ field }) => (
                                    <FormItem><FormLabel>Video Title</FormLabel><FormControl><Input placeholder="e.g., My Trip to Japan" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={thumbnailForm.control} name="userPrompt" render={({ field }) => (
                                    <FormItem><FormLabel>Thumbnail Prompt</FormLabel><FormControl><Textarea placeholder="Describe the vibe, e.g., 'Vibrant, anime-style, Mount Fuji in background'" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <Button type="submit" disabled={loading} className="w-full"><Wand2 className="mr-2 h-4 w-4" />Generate</Button>
                            </form>
                        </Form>
                    </TabsContent>
                     <TabsContent value="script">
                        <Form {...scriptForm}>
                            <form onSubmit={scriptForm.handleSubmit(handleScriptSubmit)} className="space-y-6">
                                <FormField control={scriptForm.control} name="topic" render={({ field }) => (
                                    <FormItem><FormLabel>Video Topic</FormLabel><FormControl><Input placeholder="e.g., How to learn React" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={scriptForm.control} name="targetAudience" render={({ field }) => (
                                    <FormItem><FormLabel>Target Audience</FormLabel><FormControl><Input placeholder="e.g., Beginner developers" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={scriptForm.control} name="videoLength" render={({ field }) => (
                                    <FormItem><FormLabel>Desired Length</FormLabel><FormControl><Input placeholder="e.g., 5 minutes" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <Button type="submit" disabled={loading} className="w-full"><Wand2 className="mr-2 h-4 w-4" />Generate</Button>
                            </form>
                        </Form>
                    </TabsContent>
                    <TabsContent value="caption">
                        <p className="text-center text-muted-foreground py-12">Caption generator coming soon.</p>
                    </TabsContent>
                    <TabsContent value="hooks">
                         <p className="text-center text-muted-foreground py-12">Hook generator coming soon.</p>
                    </TabsContent>
                </GlassCard>
            </div>
            <div className="lg:col-span-3">
                <GlassCard className="min-h-[400px] lg:min-h-[500px] flex items-center justify-center">
                    {loading ? (
                       <div className="w-full space-y-4">
                           <Skeleton className="h-8 w-3/4 mx-auto" />
                           <Skeleton className="h-6 w-1/2 mx-auto" />
                           <Skeleton className="h-64 w-full" />
                       </div>
                    ) : (
                        <div className="w-full">
                            {activeTab === 'thumbnail' && results.thumbnail && (
                                <>
                                    <h3 className="text-lg font-bold text-center mb-4">Generated Thumbnail</h3>
                                    <Image src={results.thumbnail.imageUrl} alt="Generated thumbnail" width={1280} height={720} className="rounded-lg aspect-video object-cover" data-ai-hint={results.thumbnail.imageHint} />
                                </>
                            )}
                            {activeTab === 'script' && results.script && (
                                <div className="space-y-4 text-left max-h-[450px] overflow-y-auto pr-2">
                                    <h3 className="text-lg font-bold">Generated Script</h3>
                                    <p className="text-muted-foreground whitespace-pre-wrap">{results.script}</p>
                                    <h3 className="text-lg font-bold pt-4">Generated Hooks</h3>
                                    <ul className="space-y-2">
                                      {Object.entries(results.hooks).map(([key, value]) => (
                                        <li key={key} className="p-3 bg-muted rounded-md">
                                          <strong className="capitalize text-primary">{key}:</strong> <span className="text-muted-foreground">{value as string}</span>
                                        </li>
                                      ))}
                                    </ul>
                                </div>
                            )}
                            {!loading && Object.keys(results).length === 0 && (
                                <div className="text-center text-muted-foreground">
                                    <Wand2 className="h-12 w-12 mx-auto mb-4 text-primary/50" />
                                    <p>Your AI-generated content will appear here.</p>
                                </div>
                            )}
                        </div>
                    )}
                </GlassCard>
            </div>
        </div>
      </Tabs>
    </div>
  );
}
