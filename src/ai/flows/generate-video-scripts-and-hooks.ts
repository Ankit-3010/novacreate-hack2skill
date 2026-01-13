'use server';
/**
 * @fileOverview A video script and hook generation AI agent.
 *
 * - generateVideoScriptsAndHooks - A function that handles the video script and hook generation process.
 * - GenerateVideoScriptsAndHooksInput - The input type for the generateVideoScriptsAndHooks function.
 * - GenerateVideoScriptsAndHooksOutput - The return type for the generateVideoScriptsAndHooks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateVideoScriptsAndHooksInputSchema = z.object({
  topic: z.string().describe('The topic of the video.'),
  targetAudience: z.string().describe('The target audience for the video.'),
  videoLength: z.string().describe('The desired length of the video (e.g., short, medium, long).'),
});
export type GenerateVideoScriptsAndHooksInput = z.infer<typeof GenerateVideoScriptsAndHooksInputSchema>;

const GenerateVideoScriptsAndHooksOutputSchema = z.object({
  script: z.string().describe('The generated video script.'),
  hooks: z
    .object({
      curious: z.string().describe('A hook that piques curiosity.'),
      controversial: z.string().describe('A hook that presents a controversial statement.'),
      educational: z.string().describe('A hook that promises educational value.'),
      fomo: z.string().describe('A hook that creates fear of missing out.'),
    })
    .describe('A set of engaging hooks for the video.'),
});
export type GenerateVideoScriptsAndHooksOutput = z.infer<typeof GenerateVideoScriptsAndHooksOutputSchema>;

export async function generateVideoScriptsAndHooks(
  input: GenerateVideoScriptsAndHooksInput
): Promise<GenerateVideoScriptsAndHooksOutput> {
  return generateVideoScriptsAndHooksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateVideoScriptsAndHooksPrompt',
  input: {schema: GenerateVideoScriptsAndHooksInputSchema},
  output: {schema: GenerateVideoScriptsAndHooksOutputSchema},
  prompt: `You are an AI assistant designed to help video creators generate video scripts and engaging hooks.

  Based on the topic, target audience, and video length, generate a video script and a set of hooks. The hooks should be attention grabbing and suitable for the given topic and audience.

  Topic: {{{topic}}}
  Target Audience: {{{targetAudience}}}
  Video Length: {{{videoLength}}}

  Output the script and hooks in a JSON format.
  `,
});

const generateVideoScriptsAndHooksFlow = ai.defineFlow(
  {
    name: 'generateVideoScriptsAndHooksFlow',
    inputSchema: GenerateVideoScriptsAndHooksInputSchema,
    outputSchema: GenerateVideoScriptsAndHooksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
