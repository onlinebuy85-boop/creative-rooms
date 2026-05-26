import { useEffect } from "react";
import { useLocation } from "wouter";
import { useGetMyProfile, useUpdateProfile } from "@workspace/api-client-react";
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
import { Loader2, ArrowLeft, Save } from "lucide-react";
import { Link } from "wouter";

const profileUpdateSchema = z.object({
  displayName: z.string().min(2, "Display name must be at least 2 characters."),
  bio: z.string().optional(),
  musicalStyle: z.string().optional(),
  emotionalVibe: z.string().optional(),
  inspirations: z.string().optional(),
  genres: z.string().transform((val) => val.split(',').map(s => s.trim()).filter(Boolean)).optional(),
});

export function EditProfilePage() {
  const [, setLocation] = useLocation();
  const { data: profile, isLoading } = useGetMyProfile();
  const updateProfile = useUpdateProfile();

  const form = useForm<z.infer<typeof profileUpdateSchema>>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      displayName: "",
      bio: "",
      musicalStyle: "",
      emotionalVibe: "",
      inspirations: "",
      genres: [],
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        displayName: profile.displayName || "",
        bio: profile.bio || "",
        musicalStyle: profile.musicalStyle || "",
        emotionalVibe: profile.emotionalVibe || "",
        inspirations: profile.inspirations || "",
        genres: profile.genres?.join(", ") as any,
      });
    }
  }, [profile, form]);

  function onSubmit(values: z.infer<typeof profileUpdateSchema>) {
    if (!profile) return;
    
    updateProfile.mutate(
      {
        id: profile.id,
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
          setLocation(`/profile/${profile.id}`);
        },
      }
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-muted-foreground" asChild>
          <Link href={`/profile/${profile?.id}`}>
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="font-serif text-3xl tracking-tight">Edit Profile</h1>
        </div>
      </div>

      <div className="p-6 md:p-8 rounded-xl border border-border/40 bg-card/20 backdrop-blur">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input className="bg-background/50 border-border/50" {...field} />
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
                    <Textarea 
                      className="resize-none bg-background/50 border-border/50 min-h-32" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="musicalStyle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Musical Style</FormLabel>
                    <FormControl>
                      <Input className="bg-background/50 border-border/50" {...field} />
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
                      <Input className="bg-background/50 border-border/50" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="inspirations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inspirations</FormLabel>
                  <FormControl>
                    <Input className="bg-background/50 border-border/50" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="genres"
              render={({ field: { value, onChange, ...rest } }) => (
                <FormItem>
                  <FormLabel>Genres (comma separated)</FormLabel>
                  <FormControl>
                    <Input 
                      className="bg-background/50 border-border/50" 
                      value={value}
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
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground border-primary-border shadow-md" 
                disabled={updateProfile.isPending}
              >
                {updateProfile.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
