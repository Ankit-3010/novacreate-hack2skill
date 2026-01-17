"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  Bell,
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
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
//import { ModeToggle } from "@/components/shared/mode-toggle";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/create", label: "Create" },
  { href: "/remix", label: "Remix" },
  { href: "/schedule", label: "Schedule" },
  { href: "/tools", label: "Tools" },
  { href: "/profile", label: "Profile" },
];

export function MainHeader() {
  const pathname = usePathname();
  const userAvatar = PlaceHolderImages.find((p) => p.id === "user-avatar");
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background/80 px-6 backdrop-blur-xl">
      <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter transition-opacity hover:opacity-80">
        <div className="flex items-center gap-3">
          <div className="relative h-14 w-14">
            <Image
              src="/logo1.png"
              alt="NovaCreate Icon"
              fill
              className="object-contain"
            />
          </div>
          <div className="relative h-16 w-56">
            <Image
              src="/logo2.png"
              alt="NovaCreate Text"
              fill
              className="object-contain object-left"
            />
          </div>
        </div>
      </Link>
      <nav className="flex items-center gap-6 ml-6 text-sm font-medium">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === item.href ? "text-foreground" : "text-foreground/60"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="ml-auto flex items-center gap-4">
        {/* <ModeToggle /> */}

        {user ? (
          <>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.photoURL || userAvatar?.imageUrl} alt={user.displayName || "User"} />
                    <AvatarFallback>{user.displayName?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : null}
      </div>
    </header>
  );
}
