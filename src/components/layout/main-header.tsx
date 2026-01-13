"use client";

import Link from "next/link";
import {
  Bell,
  Calendar,
  Hash,
  LayoutDashboard,
  Menu,
  Scissors,
  Settings,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Logo } from "../icons/logo";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/create", label: "AI Create", icon: Sparkles },
  { href: "/remix", label: "Remix Studio", icon: Wand2 },
  { href: "/tools/repurpose", label: "Repurpose", icon: Scissors },
  { href: "/tools/hashtags", label: "Hashtags", icon: Hash },
  { href: "/tools/optimize", label: "Optimize", icon: SlidersHorizontal },
  { href: "/schedule", label: "Scheduler", icon: Calendar },
];

const settingsItem = { href: "/settings", label: "Settings", icon: Settings };


export function MainHeader() {
  const userAvatar = PlaceHolderImages.find((p) => p.id === "user-avatar");

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
       <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="#"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Logo className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold text-white">NovaCreate</span>
        </Link>
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Navigation</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {navItems.map((item) => (
            <DropdownMenuItem key={item.href} asChild>
              <Link href={item.href}>{item.label}</Link>
            </DropdownMenuItem>
          ))}
           <DropdownMenuSeparator />
           <DropdownMenuItem asChild>
              <Link href={settingsItem.href}>{settingsItem.label}</Link>
            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      </nav>
      
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex-1 sm:flex-initial">
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
        </div>
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
