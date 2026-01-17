"use client";

import { useState } from "react";
import Image from "next/image";
import { FileText, ImageIcon, Mic, Wand2, Lightbulb, Hash, Sparkles } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";

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
import { generateVideoThumbnail, GenerateVideoThumbnailOutput } from "@/ai/flows/generate-video-thumbnail";
import { generateVideoScriptsAndHooks, GenerateVideoScriptsAndHooksOutput } from "@/ai/flows/generate-video-scripts-and-hooks";
import { generateVideoCaptionsAndSubtitles, GenerateVideoCaptionsAndSubtitlesOutput } from "@/ai/flows/generate-video-captions-and-subtitles";
import { generateVideoIdeas, GenerateVideoIdeasOutput } from "@/ai/flows/generate-video-ideas";
import { generateRelevantHashtags, GenerateRelevantHashtagsOutput } from "@/ai/flows/generate-relevant-hashtags";
import { generateThumbnailPrompt } from "@/ai/flows/generate-thumbnail-prompt";
import { Upload } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const thumbnailSchema = z.object({
  videoTitle: z.string().min(5, "Title must be at least 5 characters."),
  videoDescription: z.string().optional(),
  userPrompt: z.string().min(10, "Prompt must be at least 10 characters."),
});

const scriptSchema = z.object({
  topic: z.string().min(5, "Topic must be at least 5 characters."),
  targetAudience: z.string().min(5, "Audience must be at least 5 characters."),
  videoLength: z.string().min(3, "Length must be at least 3 characters."),
  platform: z.string().optional(),
  tone: z.string().optional(),
});

const captionSchema = z.object({
  videoFile: z.any().refine(file => file instanceof File, { message: "Video file is required" }),
  language: z.string().min(2, "Language is required."),
});

const ideaSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters."),
  count: z.coerce.number().min(1).max(10),
  platform: z.string().optional(),
});

const hashtagSchema = z.object({
  videoTitle: z.string().min(5, "Title must be at least 5 characters."),
  videoDescription: z.string().min(10, "Description must be at least 10 characters."),
});

type ResultState = {
  thumbnail?: GenerateVideoThumbnailOutput;
  script?: GenerateVideoScriptsAndHooksOutput;
  captions?: GenerateVideoCaptionsAndSubtitlesOutput;
  ideas?: GenerateVideoIdeasOutput;
  hashtags?: GenerateRelevantHashtagsOutput;
};

const THUMBNAIL_STYLES = [
  "Cinematic",
  "Minimalist",
  "Anime / Illustration",
  "Realistic",
  "3D Render",
  "Vibrant / Pop Art",
  "Dark / Moody"
];

const PLATFORMS = ["YouTube", "TikTok", "Instagram Reels", "LinkedIn", "X (Twitter)"];
const TONES = ["Engaging", "Educational", "Humorous", "Serious", "Inspirational", "Controversial"];

export default function CreatePage() {
  const [activeTab, setActiveTab] = useState("ideas");
  const [loading, setLoading] = useState(false);
  const [promptLoading, setPromptLoading] = useState(false);
  const [results, setResults] = useState<ResultState>({});
  const [selectedStyle, setSelectedStyle] = useState<string>("Cinematic");
  const { toast } = useToast();

  const thumbnailForm = useForm<z.infer<typeof thumbnailSchema>>({
    resolver: zodResolver(thumbnailSchema),
    defaultValues: { videoTitle: "", videoDescription: "", userPrompt: "" },
  });

  const scriptForm = useForm<z.infer<typeof scriptSchema>>({
    resolver: zodResolver(scriptSchema),
    defaultValues: { topic: "", targetAudience: "", videoLength: "30 seconds", platform: "YouTube", tone: "Engaging" },
  });

  const captionForm = useForm<z.infer<typeof captionSchema>>({
    resolver: zodResolver(captionSchema),
    defaultValues: { language: "English" },
  });

  const ideaForm = useForm<z.infer<typeof ideaSchema>>({
    resolver: zodResolver(ideaSchema),
    defaultValues: { topic: "", count: 5, platform: "YouTube" },
  });

  const hashtagForm = useForm<z.infer<typeof hashtagSchema>>({
    resolver: zodResolver(hashtagSchema),
    defaultValues: { videoTitle: "", videoDescription: "" },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    if (e.target.files && e.target.files.length > 0) {
      field.onChange(e.target.files[0]);
    }
  };

  async function handleThumbnailSubmit(values: z.infer<typeof thumbnailSchema>) {
    setLoading(true);
    setResults({});
    try {
      const result = await generateVideoThumbnail({
        ...values,
        videoDescription: values.videoDescription || "",
      });
      setResults({ thumbnail: result });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error generating thumbnail",
        description: error.message || "An unexpected error occurred.",
      });
    }
    setLoading(false);
  }

  async function handleMagicPrompt() {
    const title = thumbnailForm.getValues("videoTitle");
    const desc = thumbnailForm.getValues("videoDescription");

    if (!title || title.length < 5) {
      toast({
        variant: "destructive",
        title: "Title Required",
        description: "Please enter a video title first to generate a prompt.",
      });
      return;
    }

    setPromptLoading(true);
    try {
      const result = await generateThumbnailPrompt({
        videoTitle: title,
        videoDescription: desc || "",
        style: selectedStyle
      });
      thumbnailForm.setValue("userPrompt", result.prompt);
      toast({
        title: "Prompt Generated",
        description: "Magic prompt created based on your title and style.",
      });
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate magic prompt.",
      });
    } finally {
      setPromptLoading(false);
    }
  }

  async function handleScriptSubmit(values: z.infer<typeof scriptSchema>) {
    setLoading(true);
    setResults({});
    try {
      const result = await generateVideoScriptsAndHooks(values);
      setResults({ script: result });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error generating script",
        description: error.message || "An unexpected error occurred.",
      });
    }
    setLoading(false);
  }

  async function handleCaptionSubmit(values: z.infer<typeof captionSchema>) {
    setLoading(true);
    setResults({});

    const file = values.videoFile as File;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const videoDataUri = reader.result as string;
      try {
        const result = await generateVideoCaptionsAndSubtitles({
          videoDataUri: videoDataUri,
          language: values.language
        });
        setResults({ captions: result });
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error generating captions",
          description: error.message || "An unexpected error occurred.",
        });
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = (error) => {
      toast({
        variant: "destructive",
        title: "Error reading file",
        description: "Could not read the selected video file.",
      });
      setLoading(false);
    }
  }

  async function handleIdeaSubmit(values: z.infer<typeof ideaSchema>) {
    setLoading(true);
    setResults({});
    try {
      const result = await generateVideoIdeas({
        topic: values.topic,
        count: Number(values.count),
        platform: values.platform
      });
      setResults({ ideas: result });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error generating ideas",
        description: error.message || "An unexpected error occurred.",
      });
    }
    setLoading(false);
  }

  async function handleHashtagSubmit(values: z.infer<typeof hashtagSchema>) {
    setLoading(true);
    setResults({});
    try {
      const result = await generateRelevantHashtags(values);
      setResults({ hashtags: result });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error generating hashtags",
        description: error.message || "An unexpected error occurred.",
      });
    }
    setLoading(false);
  }

  return (
    <div>
      <PageHeader
        title="AI Creation Workspace"
        subtitle="Generate stunning assets for your content in seconds."
      />
      <Tabs defaultValue="ideas" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-transparent border-b rounded-none p-0 mb-6 h-auto">
          <TabsTrigger value="ideas" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-t-md rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary py-3"><Lightbulb className="mr-2 h-4 w-4" />Ideas</TabsTrigger>
          <TabsTrigger value="script" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-t-md rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary py-3"><FileText className="mr-2 h-4 w-4" />Script</TabsTrigger>
          <TabsTrigger value="thumbnail" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-t-md rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary py-3"><ImageIcon className="mr-2 h-4 w-4" />Thumbnail</TabsTrigger>
          <TabsTrigger value="caption" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-t-md rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary py-3"><Mic className="mr-2 h-4 w-4" />Captions</TabsTrigger>
          <TabsTrigger value="hashtags" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-t-md rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary py-3"><Hash className="mr-2 h-4 w-4" />Hashtags</TabsTrigger>
        </TabsList>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <GlassCard>
              <TabsContent value="ideaDefault" className="mt-0 hidden">
                {/* Hack for default alignment */}
              </TabsContent>
              <TabsContent value="thumbnail" className="mt-0">
                <Form {...thumbnailForm}>
                  <form onSubmit={thumbnailForm.handleSubmit(handleThumbnailSubmit)} className="space-y-6">
                    <FormField control={thumbnailForm.control} name="videoTitle" render={({ field }) => (
                      <FormItem><FormLabel>Video Title</FormLabel><FormControl><Input placeholder="e.g., My Trip to Japan" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={thumbnailForm.control} name="videoDescription" render={({ field }) => (
                      <FormItem><FormLabel>Video Description</FormLabel><FormControl><Textarea placeholder="e.g., A cinematic travel film..." {...field} /></FormControl><FormMessage /></FormItem>
                    )} />

                    <div className="space-y-2">
                      <FormLabel>Thumbnail Style</FormLabel>
                      <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a style" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {THUMBNAIL_STYLES.map(style => (
                            <SelectItem key={style} value={style}>{style}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <FormField control={thumbnailForm.control} name="userPrompt" render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Thumbnail Prompt</FormLabel>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs text-primary hover:text-primary/80"
                            onClick={handleMagicPrompt}
                            disabled={promptLoading}
                          >
                            {promptLoading ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Sparkles className="mr-1 h-3 w-3" />}
                            Magic Prompt
                          </Button>
                        </div>
                        <FormControl><Textarea placeholder="Describe the vibe... or use Magic Prompt" {...field} className="min-h-[100px]" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button type="submit" disabled={loading} className="w-full"><Wand2 className="mr-2 h-4 w-4" />Generate</Button>
                  </form>
                </Form>
              </TabsContent>
              <TabsContent value="script" className="mt-0">
                <Form {...scriptForm}>
                  <form onSubmit={scriptForm.handleSubmit(handleScriptSubmit)} className="space-y-6">
                    <FormField control={scriptForm.control} name="topic" render={({ field }) => (
                      <FormItem><FormLabel>Video Topic</FormLabel><FormControl><Input placeholder="e.g., How to learn React" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={scriptForm.control} name="platform" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Platform</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select platform" /></SelectTrigger></FormControl>
                            <SelectContent>{PLATFORMS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={scriptForm.control} name="tone" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tone</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select tone" /></SelectTrigger></FormControl>
                            <SelectContent>{TONES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

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
              <TabsContent value="caption" className="mt-0">
                <Form {...captionForm}>
                  <form onSubmit={captionForm.handleSubmit(handleCaptionSubmit)} className="space-y-6">
                    <FormField
                      control={captionForm.control}
                      name="videoFile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Video File</FormLabel>
                          <FormControl>
                            <div className="flex items-center justify-center w-full">
                              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80 border-input">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                                  <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                  <p className="text-xs text-muted-foreground">MP4, MOV, etc.</p>
                                </div>
                                <input id="dropzone-file" type="file" className="hidden" accept="video/*" onChange={(e) => handleFileChange(e, field)} />
                              </label>
                            </div>
                          </FormControl>
                          {field.value && <p className="text-sm text-muted-foreground mt-2">Selected: {(field.value as File).name}</p>}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField control={captionForm.control} name="language" render={({ field }) => (
                      <FormItem><FormLabel>Language</FormLabel><FormControl><Input placeholder="e.g., English" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <Button type="submit" disabled={loading} className="w-full"><Wand2 className="mr-2 h-4 w-4" />Generate</Button>
                  </form>
                </Form>
              </TabsContent>
              <TabsContent value="ideas" className="mt-0">
                <Form {...ideaForm}>
                  <form onSubmit={ideaForm.handleSubmit(handleIdeaSubmit)} className="space-y-6">
                    <FormField control={ideaForm.control} name="topic" render={({ field }) => (
                      <FormItem><FormLabel>Topic / Niche</FormLabel><FormControl><Input placeholder="e.g., Digital Marketing" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />

                    <FormField control={ideaForm.control} name="platform" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Platform</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select platform" /></SelectTrigger></FormControl>
                          <SelectContent>{PLATFORMS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={ideaForm.control} name="count" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Ideas</FormLabel>
                        <Select onValueChange={field.onChange} value={String(field.value)}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select count" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button type="submit" disabled={loading} className="w-full"><Wand2 className="mr-2 h-4 w-4" />Generate Ideas</Button>
                  </form>
                </Form>
              </TabsContent>
              <TabsContent value="hashtags" className="mt-0">
                <Form {...hashtagForm}>
                  <form onSubmit={hashtagForm.handleSubmit(handleHashtagSubmit)} className="space-y-6">
                    <FormField control={hashtagForm.control} name="videoTitle" render={({ field }) => (
                      <FormItem><FormLabel>Video Title</FormLabel><FormControl><Input placeholder="e.g., Best Pizza in NYC" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={hashtagForm.control} name="videoDescription" render={({ field }) => (
                      <FormItem><FormLabel>Video Description</FormLabel><FormControl><Textarea placeholder="e.g., Reviewing Joe's Pizza on Carmine St..." {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <Button type="submit" disabled={loading} className="w-full"><Wand2 className="mr-2 h-4 w-4" />Generate Hashtags</Button>
                  </form>
                </Form>
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
                      <Image src={results.thumbnail.thumbnailDataUri} alt="Generated thumbnail" width={1280} height={720} className="rounded-lg aspect-video object-cover" />
                    </>
                  )}
                  {activeTab === 'script' && results.script && (
                    <div className="space-y-4 text-left max-h-[450px] overflow-y-auto pr-2">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold">Generated Script</h3>
                        {/*<span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">For {scriptForm.getValues("platform")} ({scriptForm.getValues("tone")})</span> */}
                      </div>
                      <p className="text-muted-foreground whitespace-pre-wrap">{results.script.script}</p>
                      <h3 className="text-lg font-bold pt-4">Generated Hooks</h3>
                      <ul className="space-y-2">
                        {Object.entries(results.script.hooks).map(([key, value]) => (
                          <li key={key} className="p-3 bg-muted rounded-md">
                            <strong className="capitalize text-primary">{key}:</strong> <span className="text-muted-foreground">{value as string}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {activeTab === 'caption' && results.captions && (
                    <div className="space-y-4 text-left max-h-[450px] overflow-y-auto pr-2">
                      <h3 className="text-lg font-bold">Generated Captions</h3>
                      <p className="text-muted-foreground whitespace-pre-wrap">{results.captions.captions}</p>
                      <h3 className="text-lg font-bold pt-4">Generated Subtitles</h3>
                      <p className="text-muted-foreground whitespace-pre-wrap">{results.captions.subtitles}</p>
                    </div>
                  )}
                  {activeTab === 'ideas' && results.ideas && (
                    <div className="space-y-4 text-left max-h-[450px] overflow-y-auto pr-2">
                      <h3 className="text-lg font-bold mb-4">Generated Ideas</h3>
                      <div className="grid gap-4">
                        {results.ideas.ideas.map((idea, index) => (
                          <div key={index} className="p-4 bg-muted/50 rounded-lg border border-primary/10 hover:border-primary/30 transition-colors">
                            <h4 className="font-semibold text-primary mb-1">{index + 1}. {idea.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{idea.description}</p>
                            <div className="flex gap-2">
                              <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full font-medium">Angle: {idea.angle}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {activeTab === 'hashtags' && results.hashtags && (
                    <div className="space-y-6 text-left max-h-[450px] overflow-y-auto pr-2">
                      <h3 className="text-lg font-bold">Generated Hashtags</h3>

                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div>Trending</h4>
                        <div className="flex flex-wrap gap-2">
                          {results.hashtags.trendingHashtags.map((tag, i) => (
                            <span key={i} className="text-sm bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full">#{tag}</span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div>Niche</h4>
                        <div className="flex flex-wrap gap-2">
                          {results.hashtags.nicheHashtags.map((tag, i) => (
                            <span key={i} className="text-sm bg-green-500/10 text-green-500 px-3 py-1 rounded-full">#{tag}</span>
                          ))}
                        </div>
                      </div>

                      {results.hashtags.brandedHashtags.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-500"></div>Branded</h4>
                          <div className="flex flex-wrap gap-2">
                            {results.hashtags.brandedHashtags.map((tag, i) => (
                              <span key={i} className="text-sm bg-purple-500/10 text-purple-500 px-3 py-1 rounded-full">#{tag}</span>
                            ))}
                          </div>
                        </div>
                      )}
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
