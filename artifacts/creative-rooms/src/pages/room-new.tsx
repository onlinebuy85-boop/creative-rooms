import { useState } from "react";
import { useLocation } from "wouter";
import { useCreateRoom, useGetMyProfile } from "@workspace/api-client-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Music4 } from "lucide-react";

const roomSchema = z.object({
  name: z.string().min(3, "Room name must be at least 3 characters").max(50),
  description: z.string().optional(),
  vibe: z.string().optional(),
  genres: z.string().transform((val) => val.split(',').map(s => s.trim()).filter(Boolean)).optional(),
  maxMembers: z.coerce.number().min(2).max(8),
});

export function NewRoomPage() {
  const [, setLocation] = useLocation();
  const createRoom = useCreateRoom();
  const { data: profile, isLoading: isProfileLoading } = useGetMyProfile();

  const form = useForm<z.infer<typeof roomSchema>>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: "",
      description: "",
      vibe: "",
      genres: [],
      maxMembers: 4,
    },
  });

  function onSubmit(values: z.infer<typeof roomSchema>) {
    createRoom.mutate(
      {
        data: {
          name: values.name,
          description: values.description,
          vibe: values.vibe,
          genres: values.genres,
          maxMembers: values.maxMembers,
        },
      },
      {
        onSuccess: (room) => {
          setLocation(`/rooms/${room.id}`);
        },
      }
    );
  }

  if (isProfileLoading) return null;

  return (
    <div className="max-w-2xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-8">
        <h1 className="font-serif text-3xl tracking-tight mb-2">Create a <span className="text-primary italic">Session</span>.</h1>
        <p className="text-muted-foreground font-light">Set the intention for your new room. Invite others or keep it intimate.</p>
      </div>

      <div className="p-6 md:p-8 rounded-xl border border-border/40 bg-card/20 backdrop-blur">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Session Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Midnight writing session" className="bg-background/50 border-border/50 h-12" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Intention</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What are we working on? (e.g. Fleshing out a chorus, mixing a demo, sharing poetry...)" 
                      className="resize-none bg-background/50 border-border/50 min-h-24" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="vibe"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Atmosphere / Vibe</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Ambient, Intense, Chill" className="bg-background/50 border-border/50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxMembers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Capacity</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                      <FormControl>
                        <SelectTrigger className="bg-background/50 border-border/50">
                          <SelectValue placeholder="Select capacity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="2">2 (Duo)</SelectItem>
                        <SelectItem value="3">3 (Trio)</SelectItem>
                        <SelectItem value="4">4 (Band)</SelectItem>
                        <SelectItem value="5">5 People</SelectItem>
                        <SelectItem value="6">6 People</SelectItem>
                        <SelectItem value="8">8 (Maximum)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs">
                      Smaller rooms encourage deeper connection.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="genres"
              render={({ field: { value, onChange, ...rest } }) => (
                <FormItem>
                  <FormLabel>Genres (comma separated)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. Alternative, Jazz, Electronic" 
                      className="bg-background/50 border-border/50" 
                      onChange={(e) => onChange(e.target.value)}
                      {...rest} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-4 border-t border-border/40 flex justify-end">
              <Button 
                type="submit" 
                size="lg" 
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground border-primary-border shadow-md transition-all hover:shadow-[0_0_20px_-5px_rgba(217,119,54,0.4)]" 
                disabled={createRoom.isPending}
              >
                {createRoom.isPending ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Music4 className="w-5 h-5 mr-2" />
                )}
                Open the Door
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
