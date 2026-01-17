"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, Wand2 } from "lucide-react";
import { remixContent } from "@/ai/flows/remix-content";

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
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";

const items = [
  { id: "blogPost", label: "Blog Post" },
  { id: "twitterThread", label: "Twitter Thread" },
  { id: "linkedinPost", label: "LinkedIn Post" },
  { id: "shortVideoScript", label: "Short Video Script" },
] as const;

const remixSchema = z.object({
  sourceContent: z
    .string()
    .min(50, "Please provide at least 50 characters of content to remix."),
  formats: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: "You have to select at least one format.",
    }),
});

type RemixFormValues = z.infer<typeof remixSchema>;

export default function RemixPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const form = useForm<RemixFormValues>({
    resolver: zodResolver(remixSchema),
    defaultValues: {
      sourceContent: "",
      formats: ["blogPost"],
    },
  });

  // ... imports remain the same

  async function onSubmit(data: RemixFormValues) {
    setLoading(true);
    setResults(null);
    console.log(data);

    try {
      const generatedContent = await remixContent({
        sourceContent: data.sourceContent,
        formats: data.formats,
      });

      setResults(generatedContent);
    } catch (error) {
      console.error("Error remixing content:", error);
      // You might want to add a toast error here
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Content Remix Studio"
        subtitle="Transform one piece of content into multiple formats with AI."
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
                  name="sourceContent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Link className="h-4 w-4" /> Source Content
                      </FormLabel>
                      <FormDescription>
                        Paste in your long-form content, like a blog post,
                        transcript, or notes.
                      </FormDescription>
                      <FormControl>
                        <Textarea
                          placeholder="Paste your content here..."
                          className="min-h-[250px] text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="formats"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">
                          Remix Formats
                        </FormLabel>
                        <FormDescription>
                          Select which formats you want to generate.
                        </FormDescription>
                      </div>
                      {items.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="formats"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item.id}
                                className="flex flex-row items-start space-x-3 space-y-0 my-3"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                          ...field.value,
                                          item.id,
                                        ])
                                        : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.id
                                          )
                                        );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {item.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={loading} className="w-full">
                  <Wand2 className="mr-2 h-4 w-4" />
                  Remix Content
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
                <Skeleton className="h-64 w-full" />
              </div>
            ) : !results ? (
              <div className="text-center text-muted-foreground flex-1 flex flex-col justify-center">
                <Wand2 className="h-12 w-12 mx-auto mb-4 text-primary/50" />
                <p>Your remixed content will appear here.</p>
              </div>
            ) : (
              <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                <h3 className="text-xl font-bold">Generated Content</h3>
                {Object.entries(results).map(([key, value]) => (
                  <div key={key}>
                    <h4 className="text-lg font-semibold text-primary mb-2 capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </h4>
                    <GlassCard className="!p-4 bg-muted/50 hover:shadow-none">
                      <p className="text-muted-foreground whitespace-pre-wrap text-sm">
                        {value as string}
                      </p>
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
