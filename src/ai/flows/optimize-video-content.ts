'use server';

/**
 * @fileOverview Optimizes video content (titles, descriptions, tags, and posting times) using AI-powered recommendations.
 *
 * - optimizeVideoContent - A function that handles the video content optimization process.
 * - OptimizeVideoContentInput - The input type for the optimizeVideoContent function.
 * - OptimizeVideoContentOutput - The return type for the optimizeVideoContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeVideoContentInputSchema = z.object({
  videoTitle: z.string().describe('The current title of the video.'),
  videoDescription: z.string().describe('The current description of the video.'),
  videoTags: z.string().describe('The current tags of the video, comma separated.'),
  videoContentSummary: z
    .string()
    .describe('A summary of the video content to be optimized.'),
  currentViewCount: z.number().describe('The current view count of the video'),
  currentLikeCount: z.number().describe('The current like count of the video'),
  currentCommentCount: z.number().describe('The current comment count of the video'),
});
export type OptimizeVideoContentInput = z.infer<typeof OptimizeVideoContentInputSchema>;

const OptimizeVideoContentOutputSchema = z.object({
  optimizedTitle: z.string().describe('The optimized title of the video.'),
  optimizedDescription: z.string().describe('The optimized description of the video.'),
  optimizedTags: z.string().describe('The optimized tags of the video, comma separated.'),
  recommendedPostingTime: z
    .string()
    .describe('The recommended posting time for the video in ISO format.'),
  engagementPredictionScore: z
    .number()
    .describe('A score indicating the predicted engagement level of the optimized video content.'),
});
export type OptimizeVideoContentOutput = z.infer<typeof OptimizeVideoContentOutputSchema>;

export async function optimizeVideoContent(
  input: OptimizeVideoContentInput
): Promise<OptimizeVideoContentOutput> {
  return optimizeVideoContentFlow(input);
}

const optimizeVideoContentPrompt = ai.definePrompt({
  name: 'optimizeVideoContentPrompt',
  input: {schema: OptimizeVideoContentInputSchema},
  output: {schema: OptimizeVideoContentOutputSchema},
  prompt: `You are an expert in optimizing video content for maximum visibility and engagement on platforms like YouTube.

  Given the following information about a video, provide optimized content and recommendations:

  Current Title: {{{videoTitle}}}
  Current Description: {{{videoDescription}}}
  Current Tags: {{{videoTags}}}
  Video Content Summary: {{{videoContentSummary}}}
  Current View Count: {{{currentViewCount}}}
  Current Like Count: {{{currentLikeCount}}}
  Current Comment Count: {{{currentCommentCount}}}

  Instructions:
  1. Generate an optimized title that is engaging and includes relevant keywords.
  2. Create an optimized description that provides a clear summary of the video content and encourages viewers to watch.
  3. Suggest optimized tags that are relevant to the video content and will help improve search visibility.
  4. Recommend an optimal posting time in ISO format, considering audience activity patterns and platform algorithms. Take into account current view, like and comment counts. It should represent date and time.
  5. Provide an engagement prediction score (between 0 and 100) that indicates the predicted engagement level of the optimized video content.

  Output the optimized content and recommendations in a structured format.
  Remember that the optimized title and description should be concise and attention-grabbing.
`,
});

const optimizeVideoContentFlow = ai.defineFlow(
  {
    name: 'optimizeVideoContentFlow',
    inputSchema: OptimizeVideoContentInputSchema,
    outputSchema: OptimizeVideoContentOutputSchema,
  },
  async input => {
    const {output} = await optimizeVideoContentPrompt(input);
    return output!;
  }
);
