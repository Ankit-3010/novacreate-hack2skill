'use server';

import { ai } from '@/ai/genkit'
import { z } from 'genkit';

const RemixContentInputSchema = z.object({
    sourceContent: z.string().describe('The original content to be remixed.'),
    formats: z.array(z.string()).describe('List of target formats to generate (e.g., blogPost, twitterThread).'),
});
export type RemixContentInput = z.infer<typeof RemixContentInputSchema>;

// We use a flexible output schema where keys match the requested formats
const RemixContentOutputSchema = z.object({
    blogPost: z.string().optional().describe('Remixed blog post content.'),
    twitterThread: z.string().optional().describe('Remixed Twitter thread.'),
    linkedinPost: z.string().optional().describe('Remixed LinkedIn post.'),
    shortVideoScript: z.string().optional().describe('Remixed short video script.'),
});
export type RemixContentOutput = z.infer<typeof RemixContentOutputSchema>;

export async function remixContent(
    input: RemixContentInput
): Promise<RemixContentOutput> {
    return remixContentFlow(input);
}

const prompt = ai.definePrompt({
    name: 'remixContentPrompt',
    input: { schema: RemixContentInputSchema },
    output: { schema: RemixContentOutputSchema },
    prompt: `You are an expert content strategist and copywriter.
  Your task is to repurpose the following source content into specific formats.
  
  Source Content:
  "{{sourceContent}}"
  
  Target Formats: {{formats}}
  
  Instructions:
  1. Review the 'Target Formats' list carefully.
  2. You MUST generate a response for EVERY single format listed in 'Target Formats'.
  3. Do NOT skip any format.
  
  Format Guidelines:
  - For 'blogPost': Write a well-structured blog post (introduction, body, conclusion) based on the source.
  - For 'twitterThread': Create an engaging thread (approx 5-10 tweets). Number them (e.g., 1/x).
  - For 'linkedinPost': Write a professional, insightful post with a strong hook and call-to-action.
  - For 'shortVideoScript': Write a 30-60 second video script with Scene, Hook, Body, and CTA.
  
  Output Requirements:
  - Return a JSON object with keys exactly matching the requested formats.
  - If 2 formats are requested, 2 keys must be present in the output.
  `,
});

const remixContentFlow = ai.defineFlow(
    {
        name: 'remixContentFlow',
        inputSchema: RemixContentInputSchema,
        outputSchema: RemixContentOutputSchema,
    },
    async input => {
        const { output } = await prompt(input);
        return output!;
    }
);
