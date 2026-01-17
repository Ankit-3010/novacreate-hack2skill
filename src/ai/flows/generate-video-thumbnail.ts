'use server';

/**
 * @fileOverview A video thumbnail generation AI agent using Pollinations.ai.
 *
 * - generateVideoThumbnail - A function that handles the thumbnail generation process.
 * - GenerateVideoThumbnailInput - The input type for the generateVideoThumbnail function.
 * - GenerateVideoThumbnailOutput - The return type for the generateVideoThumbnail function.
 */

import { ai } from '@/ai/genkit'; // Keep if used for other things, or remove if not needed. Keeping for consistency with other flows.
import { z } from 'zod';

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
  try {
    const apiKey = process.env.POLLINATIONS_API_KEY;
    const model = 'flux'; // High quality model
    const width = 1280;
    const height = 720;

    // Construct the prompt
    // We can combine the user prompt with title/desc for better context if needed, 
    // or just use the userPrompt if it's high quality (which magic prompt ensures).
    // Let's combine slightly for context if userPrompt is short, but rely mostly on userPrompt.
    const finalPrompt = input.userPrompt || `A YouTube thumbnail for ${input.videoTitle}`;

    // Construct URL
    const encodedPrompt = encodeURIComponent(finalPrompt);
    let url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&model=${model}&nologo=true`;

    // Add API key if present (Assuming Pollinations accepts it via query param or header)
    // Based on research: "Authorization: Bearer YOUR_TOKEN"
    const headers: Record<string, string> = {
      'User-Agent': 'NovaCreate-AI/1.0'
    };

    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    console.log("Fetching thumbnail from Pollinations.ai...");
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Pollinations API Error: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Failed to generate image: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');
    const mimeType = response.headers.get('content-type') || 'image/jpeg';
    const dataUri = `data:${mimeType};base64,${base64Image}`;

    return { thumbnailDataUri: dataUri };

  } catch (error: any) {
    console.error("Thumbnail generation failed:", error);
    // Fallback to placeholder
    return {
      thumbnailDataUri: "https://placehold.co/1280x720/EEE/31343C.png?text=Thumbnail+Generation+Failed"
    };
  }
}
