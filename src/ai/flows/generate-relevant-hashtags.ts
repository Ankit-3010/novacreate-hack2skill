'use server';
/**
 * @fileOverview A flow for generating relevant hashtags for video content.
 *
 * - generateRelevantHashtags - A function that generates relevant hashtags based on video title and description.
 * - GenerateRelevantHashtagsInput - The input type for the generateRelevantHashtags function.
 * - GenerateRelevantHashtagsOutput - The return type for the generateRelevantHashtags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRelevantHashtagsInputSchema = z.object({
  videoTitle: z.string().describe('The title of the video.'),
  videoDescription: z.string().describe('The description of the video.'),
});
export type GenerateRelevantHashtagsInput = z.infer<typeof GenerateRelevantHashtagsInputSchema>;

const GenerateRelevantHashtagsOutputSchema = z.object({
  trendingHashtags: z.array(z.string()).describe('A list of trending hashtags.'),
  nicheHashtags: z.array(z.string()).describe('A list of niche-specific hashtags.'),
  brandedHashtags: z.array(z.string()).describe('A list of branded hashtags.'),
});
export type GenerateRelevantHashtagsOutput = z.infer<typeof GenerateRelevantHashtagsOutputSchema>;

export async function generateRelevantHashtags(
  input: GenerateRelevantHashtagsInput
): Promise<GenerateRelevantHashtagsOutput> {
  return generateRelevantHashtagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRelevantHashtagsPrompt',
  input: {schema: GenerateRelevantHashtagsInputSchema},
  output: {schema: GenerateRelevantHashtagsOutputSchema},
  prompt: `You are an expert in social media marketing, specializing in hashtag generation for video content.

  Given the video title and description, generate trending, niche, and branded hashtags to maximize discoverability.

  Video Title: {{{videoTitle}}}
  Video Description: {{{videoDescription}}}

  Provide the hashtags as a JSON object with keys "trendingHashtags", "nicheHashtags", and "brandedHashtags". Each key should contain an array of strings.
  Do not include the '#' symbol in the hashtags.
  Do not repeat hashtags.
  Return 5 trending hashtags, 5 niche hashtags and 3 branded hashtags. If there are no branded hashtags, return 3 trending hashtags instead.
  `,
});

const generateRelevantHashtagsFlow = ai.defineFlow(
  {
    name: 'generateRelevantHashtagsFlow',
    inputSchema: GenerateRelevantHashtagsInputSchema,
    outputSchema: GenerateRelevantHashtagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
