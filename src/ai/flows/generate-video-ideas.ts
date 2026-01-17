'use server';
/**
 * @fileOverview A video idea generation AI agent.
 *
 * - generateVideoIdeas - A function that handles the video idea generation process.
 * - GenerateVideoIdeasInput - The input type for the generateVideoIdeas function.
 * - GenerateVideoIdeasOutput - The return type for the generateVideoIdeas function.
 */

import { ai } from '@/ai/genkit'
import { z } from 'genkit';

const GenerateVideoIdeasInputSchema = z.object({
    topic: z.string().describe('The topic or niche for the video ideas.'),
    count: z.number().default(5).describe('The number of ideas to generate.'),
    platform: z.string().optional().describe('The target platform (e.g. YouTube, TikTok, Instagram).'),
});
export type GenerateVideoIdeasInput = z.infer<typeof GenerateVideoIdeasInputSchema>;

const GenerateVideoIdeasOutputSchema = z.object({
    ideas: z
        .array(
            z.object({
                title: z.string().describe('The title of the video idea.'),
                description: z.string().describe('A brief description of the video content.'),
                angle: z.string().describe('The unique angle or hook for this idea.'),
            })
        )
        .describe('A list of generated video ideas.'),
});
export type GenerateVideoIdeasOutput = z.infer<typeof GenerateVideoIdeasOutputSchema>;

export async function generateVideoIdeas(
    input: GenerateVideoIdeasInput
): Promise<GenerateVideoIdeasOutput> {
    return generateVideoIdeasFlow(input);
}

const prompt = ai.definePrompt({
    name: 'generateVideoIdeasPrompt',
    input: { schema: GenerateVideoIdeasInputSchema },
    output: { schema: GenerateVideoIdeasOutputSchema },
    prompt: `You are a creative content strategist. Generate {{count}} viral video ideas for the topic "{{topic}}"{{#if platform}} tailored for {{platform}}{{/if}}.
  
  For each idea, provide:
  - A catchy Title
  - A short Description
  - A unique Angle (why this will work)
  
  Examples of Angles: "Controversial Take", "Beginner Guide", "Storytelling", "Data-Driven", "Behind the Scenes".
  `,
});

const generateVideoIdeasFlow = ai.defineFlow(
    {
        name: 'generateVideoIdeasFlow',
        inputSchema: GenerateVideoIdeasInputSchema,
        outputSchema: GenerateVideoIdeasOutputSchema,
    },
    async input => {
        const { output } = await prompt(input);
        return output!;
    }
);
