"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { PageHeader } from "@/components/shared/page-header";
import { GlassCard } from "@/components/shared/glass-card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const userAvatar = PlaceHolderImages.find((p) => p.id === "user-avatar");
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "Cody Bennett",
      email: "cody.bennett@example.com",
    },
  });

  function onSubmit(data: ProfileFormValues) {
    console.log(data);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated.",
    });
  }
  return (
    <div>
      <PageHeader
        title="Account Settings"
        subtitle="Manage your profile and preferences."
      />
      <div className="space-y-8">
        <GlassCard>
            <h3 className="text-xl font-bold mb-4">Personal Information</h3>
            <div className="flex items-center gap-6">
                <div className="relative">
                     <Avatar className="h-24 w-24">
                        {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="User Avatar" />}
                        <AvatarFallback>CB</AvatarFallback>
                    </Avatar>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-grow">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="your@email.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                         <Button type="submit">Save Changes</Button>
                    </form>
                </Form>
            </div>
        </GlassCard>

         <GlassCard>
            <h3 className="text-xl font-bold mb-4">Password</h3>
             <form className="space-y-4 max-w-md">
                <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                </div>
                <Button>Update Password</Button>
            </form>
        </GlassCard>

        <GlassCard>
            <h3 className="text-xl font-bold mb-6">Notifications</h3>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <Label htmlFor="email-notifications" className="font-semibold">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive updates and news about NovaCreate.</p>
                    </div>
                    <Switch id="email-notifications" defaultChecked/>
                </div>
                 <Separator />
                 <div className="flex items-center justify-between">
                    <div>
                        <Label htmlFor="activity-digest" className="font-semibold">Weekly Activity Digest</Label>
                        <p className="text-sm text-muted-foreground">Get a summary of your weekly content performance.</p>
                    </div>
                    <Switch id="activity-digest" defaultChecked/>
                </div>
                 <Separator />
                <div className="flex items-center justify-between">
                    <div>
                        <Label htmlFor="schedule-reminders" className="font-semibold">Schedule Reminders</Label>
                        <p className="text-sm text-muted-foreground">Get reminded before a post is scheduled to go live.</p>
                    </div>
                    <Switch id="schedule-reminders" />
                </div>
            </div>
        </GlassCard>
      </div>
    </div>
  );
}
