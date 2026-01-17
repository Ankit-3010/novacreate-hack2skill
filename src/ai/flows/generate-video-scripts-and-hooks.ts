'use server';
/**
 * @fileOverview A video script and hook generation AI agent.
 */

import { ai } from '@/ai/genkit'
import { z } from 'genkit';

const GenerateVideoScriptsAndHooksInputSchema = z.object({
  topic: z.string().describe('The topic of the video.'),
  targetAudience: z.string().describe('The target audience for the video.'),
  videoLength: z.string().describe('The desired length of the video (e.g., short, medium, long).'),
  platform: z.string().optional().describe('The target platform (e.g. YouTube, TikTok).'),
  tone: z.string().optional().describe('The tone of the script (e.g. Humorous, Educational, Serious).'),
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
  input: { schema: GenerateVideoScriptsAndHooksInputSchema },
  output: { schema: GenerateVideoScriptsAndHooksOutputSchema },
  prompt: `You are an expert video scriptwriter.
  Generate a script for a {{videoLength}} video on the topic: "{{topic}}".
  
  Target Audience: {{targetAudience}}
  {{#if platform}}Platform: {{platform}}{{/if}}
  {{#if tone}}Tone: {{tone}}{{/if}}

  Output:
  1. A full script formatted for reading (including scene cues if necessary).
  2. 4 distinct hooks (Curious, Controversial, Educational, FOMO) to test at the start.
  `,
});

const generateVideoScriptsAndHooksFlow = ai.defineFlow(
  {
    name: 'generateVideoScriptsAndHooksFlow',
    inputSchema: GenerateVideoScriptsAndHooksInputSchema,
    outputSchema: GenerateVideoScriptsAndHooksOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
