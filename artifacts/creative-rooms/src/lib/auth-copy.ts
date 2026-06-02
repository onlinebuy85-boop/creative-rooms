export type AuthMode = "login" | "signup" | "forgot";

export const AUTH_COPY: Record<
  AuthMode,
  {
    title: string;
    subtitle: string;
    cta: string;
    footerPrompt: string;
    footerLink: string;
    footerHref: string;
  }
> = {
  login: {
    title: "Welcome back",
    subtitle: "Log in to your Creative Room account.",
    cta: "Log in",
    footerPrompt: "Don't have an account?",
    footerLink: "Sign up",
    footerHref: "/signup",
  },
  signup: {
    title: "Join Creative Room",
    subtitle: "Create your account and start collaborating.",
    cta: "Sign up",
    footerPrompt: "Already have an account?",
    footerLink: "Log in",
    footerHref: "/login",
  },
  forgot: {
    title: "Reset password",
    subtitle: "Enter your email and we'll send you a reset link.",
    cta: "Send reset link",
    footerPrompt: "Remember your password?",
    footerLink: "Log in",
    footerHref: "/login",
  },
};

export const AUTH_FEATURES = [
  {
    id: "creators",
    title: "Real creators",
    description: "Connect with musicians, producers and songwriters.",
    icon: "users" as const,
  },
  {
    id: "collab",
    title: "Real time collaboration",
    description: "Create, listen and shape ideas together in the moment.",
    icon: "wave" as const,
  },
  {
    id: "open",
    title: "Always open",
    description: "Rooms are always open. Jump in anytime.",
    icon: "door" as const,
  },
] as const;

export const AUTH_QUOTE =
  "The best ideas usually arrive unfinished. This is where they find each other.";
