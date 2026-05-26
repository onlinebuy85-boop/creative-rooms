import { useEffect } from "react";
import { useLocation } from "wouter";
import { useGetMyProfile, useCreateProfile } from "@workspace/api-client-react";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@clerk/react";
import { Loader2 } from "lucide-react";

const profileSchema = z.object({
  displayName: z.string().min(2, {
    message: "Display name must be at least 2 characters.",
  }),
  bio: z.string().optional(),
  musicalStyle: z.string().optional(),
  emotionalVibe: z.string().optional(),
  inspirations: z.string().optional(),
  genres: z.string().transform((val) => val.split(',').map(s => s.trim()).filter(Boolean)).optional(),
});

export function ProfileSetupPage() {
  const [, setLocation] = useLocation();
  const { user } = useUser();
  const { data: profile, isLoading: isProfileLoading } = useGetMyProfile();
  const createProfile = useCreateProfile();

  useEffect(() => {
    if (profile && !isProfileLoading) {
      setLocation("/dashboard");
    }
  }, [profile, isProfileLoading, setLocation]);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.fullName || "",
      bio: "",
      musicalStyle: "",
      emotionalVibe: "",
      inspirations: "",
      genres: [],
    },
  });

  function onSubmit(values: z.infer<typeof profileSchema>) {
    createProfile.mutate(
      {
        data: {
          displayName: values.displayName,
          bio: values.bio,
          musicalStyle: values.musicalStyle,
          emotionalVibe: values.emotionalVibe,
          inspirations: values.inspirations,
          genres: values.genres,
        },
      },
      {
        onSuccess: () => {
          setLocation("/dashboard");
        },
      }
    );
  }

  if (isProfileLoading) return null;

  return (
    <div className="min-h-[100dvh] bg-background relative flex items-center justify-center p-4">
      <div className="bg-noise" />
      
      <Card className="w-full max-w-lg bg-card/40 backdrop-blur border-border/50 relative z-10">
        <CardHeader>
          <CardTitle className="font-serif text-3xl">Set the tone.</CardTitle>
          <CardDescription>
            Tell others about your style and what you bring to the studio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input placeholder="How should we call you?" className="bg-background/50 border-border/50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea placeholder="A few words about yourself..." className="resize-none bg-background/50 border-border/50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="musicalStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Musical Style</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Ambient electronic" className="bg-background/50 border-border/50" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emotionalVibe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emotional Vibe</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Melancholic, uplifting" className="bg-background/50 border-border/50" {...field} />
                      </FormControl>
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
                        placeholder="indie, folk, electronic" 
                        className="bg-background/50 border-border/50" 
                        onChange={(e) => onChange(e.target.value)}
                        {...rest} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={createProfile.isPending}>
                {createProfile.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Enter Studio
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
