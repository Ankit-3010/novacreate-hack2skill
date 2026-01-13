'use server';
/**
 * @fileOverview Generates video captions and subtitles in multiple languages using AI speech-to-text technology.
 *
 * - generateVideoCaptionsAndSubtitles - A function that handles the video captions and subtitles generation process.
 * - GenerateVideoCaptionsAndSubtitlesInput - The input type for the generateVideoCaptionsAndSubtitles function.
 * - GenerateVideoCaptionsAndSubtitlesOutput - The return type for the generateVideoCaptionsAndSubtitles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateVideoCaptionsAndSubtitlesInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  language: z.string().describe('The target language for the captions and subtitles.'),
});
export type GenerateVideoCaptionsAndSubtitlesInput = z.infer<typeof GenerateVideoCaptionsAndSubtitlesInputSchema>;

const GenerateVideoCaptionsAndSubtitlesOutputSchema = z.object({
  captions: z.string().describe('The generated video captions.'),
  subtitles: z.string().describe('The generated video subtitles.'),
});
export type GenerateVideoCaptionsAndSubtitlesOutput = z.infer<typeof GenerateVideoCaptionsAndSubtitlesOutputSchema>;

export async function generateVideoCaptionsAndSubtitles(input: GenerateVideoCaptionsAndSubtitlesInput): Promise<GenerateVideoCaptionsAndSubtitlesOutput> {
  return generateVideoCaptionsAndSubtitlesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateVideoCaptionsAndSubtitlesPrompt',
  input: {schema: GenerateVideoCaptionsAndSubtitlesInputSchema},
  output: {schema: GenerateVideoCaptionsAndSubtitlesOutputSchema},
  prompt: `You are an expert video caption and subtitle generator.

You will generate captions and subtitles for the video in the specified language.

Language: {{{language}}}
Video: {{media url=videoDataUri}}

Captions:
Subtitles:`, // Instructions to generate both captions and subtitles.
});

const generateVideoCaptionsAndSubtitlesFlow = ai.defineFlow(
  {
    name: 'generateVideoCaptionsAndSubtitlesFlow',
    inputSchema: GenerateVideoCaptionsAndSubtitlesInputSchema,
    outputSchema: GenerateVideoCaptionsAndSubtitlesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
