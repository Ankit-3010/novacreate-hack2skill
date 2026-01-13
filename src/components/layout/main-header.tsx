"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Calendar,
  Hash,
  LayoutDashboard,
  Scissors,
  SlidersHorizontal,
  Sparkles,
  Wand2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/create", label: "AI Create", icon: Sparkles },
  { href: "/remix", label: "Remix Studio", icon: Wand2 },
];

const toolsItems = [
  { href: "/tools/repurpose", label: "Repurpose", icon: Scissors },
  { href: "/tools/hashtags", label: "Hashtags", icon: Hash },
  { href: "/tools/optimize", label: "Optimize", icon: SlidersHorizontal },
  { href: "/schedule", label: "Scheduler", icon: Calendar },
];


export function MainHeader() {
  const userAvatar = PlaceHolderImages.find((p) => p.id === "user-avatar");
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-lg sm:px-6">
      <SidebarTrigger className="sm:hidden" />

      <div className="flex items-center gap-6">
        <Select defaultValue="project-1">
          <SelectTrigger className="w-auto border-none bg-transparent shadow-none focus:ring-0">
            <SelectValue placeholder="Select a project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="project-1">My YouTube Channel</SelectItem>
            <SelectItem value="project-2">Shorts Factory</SelectItem>
            <SelectItem value="project-3">Marketing Reels</SelectItem>
          </SelectContent>
        </Select>
        
        <nav className="hidden items-center gap-4 text-sm font-medium md:flex">
            {[...navItems, ...toolsItems].map((item) => (
                 <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "transition-colors hover:text-primary",
                        pathname === item.href ? "text-primary" : "text-muted-foreground"
                    )}
                    >
                    {item.label}
                </Link>
            ))}
        </nav>

      </div>

      <div className="flex flex-1 items-center justify-end gap-4">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Toggle notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="overflow-hidden rounded-full"
            >
              <Avatar className="h-8 w-8">
                {userAvatar && (
                  <AvatarImage
                    src={userAvatar.imageUrl}
                    alt={userAvatar.description}
                  />
                )}
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
