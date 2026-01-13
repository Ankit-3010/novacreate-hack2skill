"use client";

import Image from "next/image";
import { MoreHorizontal, Edit, Copy, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "../ui/button";

type Post = {
  id: string;
  title: string;
  status: "Scheduled" | "Published" | "Draft";
  time: string;
  thumbnail: string;
};

export function ScheduledPostCard({ post }: { post: Post }) {
  const getStatusColor = () => {
    switch (post.status) {
      case "Published":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Scheduled":
        return "bg-primary/20 text-primary border-primary/30";
      case "Draft":
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <GlassCard className="!p-3 hover:shadow-[0_0_15px_0_hsl(var(--primary)/0.3)]">
      <div className="relative">
        <Image
          src={post.thumbnail}
          alt={post.title}
          width={400}
          height={225}
          className="rounded-md aspect-video object-cover"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1 right-1 h-7 w-7 bg-black/50 hover:bg-black/70 text-white"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy className="mr-2 h-4 w-4" /> Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="mt-2">
        <h4 className="font-bold text-sm truncate text-foreground">
          {post.title}
        </h4>
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-muted-foreground">{post.time}</p>
          <Badge
            className={`text-xs px-1.5 py-0.5 rounded-sm ${getStatusColor()}`}
          >
            {post.status}
          </Badge>
        </div>
      </div>
    </GlassCard>
  );
}
