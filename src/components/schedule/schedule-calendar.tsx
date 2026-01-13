"use client";

import { useState } from "react";
import { addDays, format, startOfWeek } from "date-fns";
import { GlassCard } from "@/components/shared/glass-card";
import { scheduledPosts as initialPosts } from "@/lib/data";
import { ScheduledPostCard } from "./scheduled-post-card";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { SchedulePostDialog } from "./schedule-post-dialog";

export function ScheduleCalendar() {
  const [posts, setPosts] = useState(initialPosts);
  const weekStartsOn = 1; // Monday
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn });

  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const day = addDays(weekStart, i);
    return {
      name: format(day, "eeee"),
      date: format(day, "d"),
    };
  });

  return (
    <GlassCard className="!p-2">
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => (
          <div key={day.name} className="bg-card/50 rounded-lg p-2 min-h-[600px] flex flex-col">
            <div className="text-center mb-4">
              <p className="font-bold text-lg text-foreground">{day.name}</p>
              <p className="text-2xl font-bold text-primary">{day.date}</p>
            </div>
            <div className="flex-1 space-y-3">
              {posts
                .filter((post) => post.day === day.name)
                .sort((a,b) => a.time.localeCompare(b.time))
                .map((post) => (
                  <ScheduledPostCard key={post.id} post={post} />
                ))}
            </div>
             <SchedulePostDialog>
              <Button variant="ghost" size="sm" className="w-full mt-2">
                <Plus className="h-4 w-4 mr-2"/> Add
              </Button>
            </SchedulePostDialog>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
