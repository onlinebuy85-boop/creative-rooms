import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mic2, Radio, Users2 } from "lucide-react";

export function LandingPage() {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background relative overflow-hidden selection:bg-primary/20">
      <div className="bg-noise" />
      
      {/* Cinematic background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/assets/images/hero-bg.png" 
          alt="" 
          className="w-full h-full object-cover opacity-[0.15] mix-blend-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-background/90" />
      </div>

      <header className="relative z-10 container mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={`${basePath}/logo.svg`} alt="Creative Rooms" className="w-8 h-8 opacity-90" />
          <span className="font-serif text-xl tracking-wide text-foreground/90">Creative Rooms</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground font-medium hidden sm:flex" asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium border-primary-border shadow-lg" asChild>
            <Link href="/sign-up">Start Creating</Link>
          </Button>
        </div>
      </header>

      <main className="relative z-10 flex-1 container mx-auto px-6 flex flex-col justify-center items-center text-center">
        <div className="max-w-3xl mx-auto space-y-8 pb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium tracking-wide uppercase mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-50"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Now Open
          </div>
          
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tighter text-foreground leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150 fill-mode-both drop-shadow-sm">
            A quiet space <br />
            <span className="text-muted-foreground italic">for real music.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground/80 max-w-xl mx-auto leading-relaxed font-light animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
            Step out of the noise. No metrics, no feeds. Just a small group of creators in an intimate digital studio, making something honest.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 fill-mode-both">
            <Button size="lg" className="w-full sm:w-auto h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground text-base font-medium rounded-md shadow-[0_0_40px_-10px_rgba(217,119,54,0.3)] border-primary-border transition-all hover:scale-105" asChild>
              <Link href="/sign-up">
                Enter the Studio <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 border-border/50 bg-background/50 backdrop-blur hover:bg-muted/50 text-base font-medium rounded-md" asChild>
              <Link href="/discover">
                Browse Rooms
              </Link>
            </Button>
          </div>
        </div>

        <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 py-16 border-t border-border/20 text-left animate-in fade-in duration-1000 delay-700 fill-mode-both">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Mic2 className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl text-foreground">Intimate</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">Rooms capped at small sizes. Creating a safe environment to share early ideas and raw emotion.</p>
          </div>
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Users2 className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl text-foreground">Collaborative</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">Find co-writers, vocalists, and producers who resonate with your specific emotional frequency.</p>
          </div>
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl text-foreground">Atmospheric</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">A considered space designed to put you in the right headspace. Warm, focused, and free of distraction.</p>
          </div>
        </div>
      </main>
    </div>
  );
}