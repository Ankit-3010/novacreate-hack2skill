"use client";

import { PageHeader } from "@/components/shared/page-header";
import { ScheduleCalendar } from "@/components/schedule/schedule-calendar";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { SchedulePostDialog } from "@/components/schedule/schedule-post-dialog";

export default function SchedulePage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageHeader
          title="Content Scheduler"
          subtitle="Plan and publish your content with AI-powered recommendations."
        />
        <SchedulePostDialog>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Schedule Post
          </Button>
        </SchedulePostDialog>
      </div>
      <ScheduleCalendar />
    </div>
  );
}
