import { cn } from "@/lib/utils";

type OAuthStrategy = "oauth_apple" | "oauth_google" | "oauth_discord";

interface SocialLoginButtonsProps {
  onProvider: (strategy: OAuthStrategy) => void;
  disabled?: boolean;
  className?: string;
}

const PROVIDERS: { id: OAuthStrategy; label: string; icon: React.ReactNode }[] = [
  {
    id: "oauth_apple",
    label: "Continue with Apple",
    icon: <AppleIcon />,
  },
  {
    id: "oauth_google",
    label: "Continue with Google",
    icon: <GoogleIcon />,
  },
  {
    id: "oauth_discord",
    label: "Continue with Discord",
    icon: <DiscordIcon />,
  },
];

export function SocialLoginButtons({ onProvider, disabled, className }: SocialLoginButtonsProps) {
  return (
    <div className={cn("cr-auth-social", className)}>
      {PROVIDERS.map((p) => (
        <button
          key={p.id}
          type="button"
          disabled={disabled}
          className="cr-auth-social-btn"
          onClick={() => onProvider(p.id)}
        >
          <span className="cr-auth-social-icon">{p.icon}</span>
          {p.label}
        </button>
      ))}
    </div>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.05 20.28c-.98.95-2.05 1.88-3.51 1.9-1.48.02-1.95-.87-3.63-.87-1.68 0-2.2.85-3.57.89-1.44.04-2.53-1.47-3.49-2.42-1.9-1.87-3.35-5.28-1.4-7.58 1-1.15 2.7-1.87 4.22-1.89 1.66-.03 3.22 1.1 4.23 1.1 1.01 0 2.9-1.36 4.89-1.16.83.03 3.17.34 4.67 2.54-.12.07-2.79 1.63-2.76 4.86.03 3.85 3.37 5.14 3.41 5.15-.03.09-.53 1.83-1.74 3.63zM14.02 4.17c.74-.9 1.24-2.14 1.1-3.39-1.07.04-2.36.71-3.13 1.6-.69.79-1.29 2.07-1.13 3.29 1.19.09 2.41-.6 3.16-1.5z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.84h5.34c-.23 1.2-1.54 3.52-5.34 3.52-3.21 0-5.83-2.66-5.83-5.94s2.62-5.94 5.83-5.94c1.83 0 3.06.78 3.76 1.45l2.57-2.48C16.9 3.36 14.66 2.4 12 2.4 6.94 2.4 2.73 6.53 2.73 12s4.21 9.6 9.27 9.6c5.35 0 8.88-3.76 8.88-9.05 0-.61-.06-1.08-.14-1.35H12z"
      />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#a89bc4" aria-hidden>
      <path d="M20.32 4.37A19.8 19.8 0 0 0 15.55 3c-.25.45-.54 1.05-.74 1.52a18.3 18.3 0 0 0-5.62 0 11.5 11.5 0 0 0-.74-1.52 19.7 19.7 0 0 0-4.77 1.37C2.06 8.3 1.35 12.08 1.6 15.8a19.9 19.9 0 0 0 5.08 2.58c.41-.56.78-1.15 1.1-1.76a12.7 12.7 0 0 1-1.74-.84c.15-.11.33-.23.49-.35a13.5 13.5 0 0 0 11.14 0c.16.12.34.24.49.35-.55.32-1.13.6-1.74.84.32.61.69 1.2 1.1 1.76a19.8 19.8 0 0 0 5.08-2.58c.3-4.3-.5-8.04-2.1-11.43zM8.68 13.6c-1 0-1.82-.92-1.82-2.05 0-1.14.8-2.06 1.82-2.06s1.84.92 1.82 2.06c0 1.13-.8 2.05-1.82 2.05zm6.64 0c-1 0-1.82-.92-1.82-2.05 0-1.14.8-2.06 1.82-2.06s1.84.92 1.82 2.06c0 1.13-.8 2.05-1.82 2.05z" />
    </svg>
  );
}
