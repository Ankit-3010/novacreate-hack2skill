import { FileText, ImageIcon, Lightbulb, Mic } from 'lucide-react';

export const quickActions = [
  {
    title: "Generate Script",
    description: "AI-powered scriptwriting assistant.",
    icon: FileText,
    href: "/create",
  },
  {
    title: "Create Thumbnail",
    description: "Design eye-catching thumbnails in seconds.",
    icon: ImageIcon,
    href: "/create",
  },
  {
    title: "Find Hooks",
    description: "Discover viral hooks for your videos.",
    icon: Lightbulb,
    href: "/create",
  },
  {
    title: "Make Captions",
    description: "Generate subtitles for your content.",
    icon: Mic,
    href: "/create",
  },
];

export const analyticsData = {
  engagementScore: 82,
};

export const bestTimesData = [
  { day: "Monday", views: Math.floor(Math.random() * 5000) + 1000 },
  { day: "Tuesday", views: Math.floor(Math.random() * 5000) + 1000 },
  { day: "Wednesday", views: Math.floor(Math.random() * 5000) + 1000 },
  { day: "Thursday", views: Math.floor(Math.random() * 5000) + 1000 },
  { day: "Friday", views: Math.floor(Math.random() * 5000) + 1000 },
  { day: "Saturday", views: Math.floor(Math.random() * 5000) + 1000 },
  { day: "Sunday", views: Math.floor(Math.random() * 5000) + 1000 },
];
