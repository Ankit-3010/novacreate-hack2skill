"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon, Upload } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";

export function SchedulePostDialog({ children }: { children: React.ReactNode }) {
    const [date, setDate] = useState<Date | undefined>(new Date());
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl bg-card/80 backdrop-blur-xl border-primary/20">
        <DialogHeader>
          <DialogTitle>Schedule New Post</DialogTitle>
          <DialogDescription>
            Plan your content by filling out the details below. Click schedule when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="title">Content Title</Label>
                    <Input id="title" placeholder="e.g., My Awesome New Video" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="caption">Caption</Label>
                    <Textarea id="caption" placeholder="Write an engaging caption..." className="min-h-[120px]"/>
                </div>
                <div className="space-y-2">
                    <Label>Upload Media</Label>
                    <div className="flex items-center justify-center w-full">
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80 border-input">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-4 text-muted-foreground"/>
                                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-muted-foreground">Video, Image, or Audio</p>
                            </div>
                            <input id="dropzone-file" type="file" className="hidden" />
                        </label>
                    </div> 
                </div>
            </div>
            <div className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="date">Publish Date</Label>
                         <Popover>
                            <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                "w-full justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="time">Publish Time</Label>
                        <Input id="time" type="time" defaultValue="10:00"/>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select defaultValue="scheduled">
                        <SelectTrigger>
                            <SelectValue placeholder="Set status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="draft">Save as Draft</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <p className="text-sm font-medium">Best Time to Post</p>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" className="bg-primary/10 border-primary/30 text-primary hover:bg-primary/20">Today at 6:00 PM</Button>
                        <Button variant="outline" size="sm">Tomorrow at 9:00 AM</Button>
                        <Button variant="outline" size="sm">Friday at 12:00 PM</Button>
                    </div>
                </div>
            </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button type="submit">Schedule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
