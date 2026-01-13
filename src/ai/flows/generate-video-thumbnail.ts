'use server';

/**
 * @fileOverview A video thumbnail generation AI agent.
 *
 * - generateVideoThumbnail - A function that handles the thumbnail generation process.
 * - GenerateVideoThumbnailInput - The input type for the generateVideoThumbnail function.
 * - GenerateVideoThumbnailOutput - The return type for the generateVideoThumbnail function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateVideoThumbnailInputSchema = z.object({
  videoTitle: z.string().describe('The title of the video.'),
  videoDescription: z.string().describe('The description of the video.'),
  userPrompt: z.string().describe('A prompt from the user describing the desired thumbnail.'),
});
export type GenerateVideoThumbnailInput = z.infer<typeof GenerateVideoThumbnailInputSchema>;

const GenerateVideoThumbnailOutputSchema = z.object({
  thumbnailDataUri: z
    .string()
    .describe(
      'The generated video thumbnail as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'      
    ),
});
export type GenerateVideoThumbnailOutput = z.infer<typeof GenerateVideoThumbnailOutputSchema>;

export async function generateVideoThumbnail(
  input: GenerateVideoThumbnailInput
): Promise<GenerateVideoThumbnailOutput> {
  return generateVideoThumbnailFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateVideoThumbnailPrompt',
  input: {schema: GenerateVideoThumbnailInputSchema},
  output: {schema: GenerateVideoThumbnailOutputSchema},
  prompt: `You are an AI video thumbnail generator. Your goal is to generate a thumbnail that is visually appealing and accurately represents the content of the video.

  Use the following information to generate the thumbnail:

  Video Title: {{{videoTitle}}}
  Video Description: {{{videoDescription}}}
  User Prompt: {{{userPrompt}}}

  The thumbnail should be a high-quality image that is suitable for use on YouTube, Instagram, and other video platforms. The thumbnail should be eye-catching and informative.

  Return the thumbnail as a data URI.
  `,
});

const generateVideoThumbnailFlow = ai.defineFlow(
  {
    name: 'generateVideoThumbnailFlow',
    inputSchema: GenerateVideoThumbnailInputSchema,
    outputSchema: GenerateVideoThumbnailOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `Generate a video thumbnail for a video with the following title: ${input.videoTitle}, description: ${input.videoDescription}, and user prompt: ${input.userPrompt}.`,
    });
    return {thumbnailDataUri: media.url!};
  }
);
