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

export const scheduledPosts = [
  {
    id: 'post-1',
    title: 'My Trip to Japan',
    status: 'Scheduled',
    time: '10:00 AM',
    day: 'Monday',
    thumbnail: 'https://picsum.photos/seed/japan/400/225'
  },
  {
    id: 'post-2',
    title: 'How to Learn React Fast',
    status: 'Published',
    time: '2:30 PM',
    day: 'Wednesday',
    thumbnail: 'https://picsum.photos/seed/react/400/225'
  },
  {
    id: 'post-3',
    title: 'Unboxing the New NovaPhone',
    status: 'Draft',
    time: '5:00 PM',
    day: 'Friday',
    thumbnail: 'https://picsum.photos/seed/tech/400/225'
  },
  {
    id: 'post-4',
    title: 'Morning Hike in the Alps',
    status: 'Scheduled',
    time: '8:00 AM',
    day: 'Saturday',
    thumbnail: 'https://picsum.photos/seed/alps/400/225'
  }
];
