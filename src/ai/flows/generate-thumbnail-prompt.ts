'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateThumbnailPromptInputSchema = z.object({
    videoTitle: z.string().describe('The title of the video.'),
    videoDescription: z.string().describe('The description of the video.'),
    style: z.string().optional().describe('The desired artistic style (e.g., minimal, cinematic, anime).'),
});
export type GenerateThumbnailPromptInput = z.infer<typeof GenerateThumbnailPromptInputSchema>;

const GenerateThumbnailPromptOutputSchema = z.object({
    prompt: z.string().describe('A detailed and descriptive prompt for an image generation model.'),
});
export type GenerateThumbnailPromptOutput = z.infer<typeof GenerateThumbnailPromptOutputSchema>;

export async function generateThumbnailPrompt(
    input: GenerateThumbnailPromptInput
): Promise<GenerateThumbnailPromptOutput> {
    return generateThumbnailPromptFlow(input);
}

const prompt = ai.definePrompt({
    name: 'generateThumbnailPromptPrompt',
    input: { schema: GenerateThumbnailPromptInputSchema },
    output: { schema: GenerateThumbnailPromptOutputSchema },
    prompt: `You are an expert prompt engineer for image generation models like Imagen and Midjourney.
  Create a highly detailed and effective image generation prompt for a video thumbnail based on the following:

  Video Title: {{{videoTitle}}}
  Video Description: {{{videoDescription}}}
  Style: {{{style}}}

  The prompt should include details about composition, lighting, subject, and mood. It should be optimized to produce a high-click-through-rate (CTR) thumbnail.
  `,
});

const generateThumbnailPromptFlow = ai.defineFlow(
    {
        name: 'generateThumbnailPromptFlow',
        inputSchema: GenerateThumbnailPromptInputSchema,
        outputSchema: GenerateThumbnailPromptOutputSchema,
    },
    async input => {
        const { output } = await prompt(input);
        return output!;
    }
);
