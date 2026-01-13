import { config } from 'dotenv';
config();

import '@/ai/flows/optimize-video-content.ts';
import '@/ai/flows/generate-relevant-hashtags.ts';
import '@/ai/flows/generate-video-scripts-and-hooks.ts';
import '@/ai/flows/generate-video-thumbnail.ts';
import '@/ai/flows/generate-video-captions-and-subtitles.ts';