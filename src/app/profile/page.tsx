"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { Loader2 } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const userAvatar = PlaceHolderImages.find((p) => p.id === "user-avatar");
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.displayName || "",
        email: user.email || "",
      });
    }
  }, [user, form]);

  async function onSubmit(data: ProfileFormValues) {
    if (!user) return;
    setLoading(true);
    try {
      // Update Auth Profile
      if (user.displayName !== data.name) {
        await updateProfile(user, {
          displayName: data.name
        });
      }

      // Update Firestore Profile
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        name: data.name,
        email: data.email,
        updatedAt: new Date(),
      }, { merge: true });

      toast({
        title: "Profile Updated",
        description: "Your profile information has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
                {userAvatar && <AvatarImage src={user?.photoURL || userAvatar.imageUrl} alt="User Avatar" />}
                <AvatarFallback>{user?.displayName?.charAt(0) || "U"}</AvatarFallback>
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
                          <Input type="email" placeholder="your@email.com" {...field} disabled />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </form>
            </Form>
          </div>
        </GlassCard>

        {/* Placeholder for Brand Settings - Future Implementation */}
        <GlassCard>
          <h3 className="text-xl font-bold mb-4">Brand Settings</h3>
          <p className="text-muted-foreground mb-4">Manage your brand voice, niche, and target audience.</p>
          <Button variant="outline" disabled>Coming Soon</Button>
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
            <Button variant="secondary">Update Password</Button>
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
              <Switch id="email-notifications" defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="activity-digest" className="font-semibold">Weekly Activity Digest</Label>
                <p className="text-sm text-muted-foreground">Get a summary of your weekly content performance.</p>
              </div>
              <Switch id="activity-digest" defaultChecked />
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
