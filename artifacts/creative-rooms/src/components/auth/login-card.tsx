import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useSignIn, useSignUp } from "@clerk/react";
import { Eye, EyeOff, Lock, Mail, AudioWaveform } from "lucide-react";
import { SocialLoginButtons } from "@/components/auth/social-login-buttons";
import { Checkbox } from "@/components/ui/checkbox";
import { AUTH_COPY, type AuthMode } from "@/lib/auth-copy";

interface LoginCardProps {
  mode?: AuthMode;
}

export function LoginCard({ mode = "login" }: LoginCardProps) {
  const copy = AUTH_COPY[mode];
  const [, setLocation] = useLocation();
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "") || "";

  const handleOAuth = async (strategy: "oauth_apple" | "oauth_google" | "oauth_discord") => {
    if (import.meta.env.DEV) {
      setLocation("/discover");
      return;
    }
    const auth = mode === "signup" ? signUp : signIn;
    if (!auth) return;
    setLoading(true);
    setError(null);
    try {
      await auth.authenticateWithRedirect({
        strategy,
        redirectUrl: `${basePath}/login`,
        redirectUrlComplete: `${basePath}/discover`,
      });
    } catch {
      setError("Could not start social sign-in. Please try again.");
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (import.meta.env.DEV) {
      setLocation("/discover");
      return;
    }

    setLoading(true);
    try {
      if (mode === "forgot") {
        if (!signInLoaded || !signIn) throw new Error("Auth not ready");
        await signIn.create({
          strategy: "reset_password_email_code",
          identifier: email,
        });
        setError(null);
        setLocation("/login");
        return;
      }

      if (mode === "signup") {
        if (!signUpLoaded || !signUp) throw new Error("Auth not ready");
        await signUp.create({
          emailAddress: email,
          password,
        });
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        setLocation("/discover");
        return;
      }

      if (!signInLoaded || !signIn) throw new Error("Auth not ready");
      const result = await signIn.create({
        identifier: email,
        password,
      });
      if (result.status === "complete" && result.createdSessionId) {
        await signIn.setActive({ session: result.createdSessionId });
        setLocation("/discover");
      }
    } catch (err) {
      const message =
        err && typeof err === "object" && "errors" in err
          ? (err as { errors: { message: string }[] }).errors[0]?.message
          : "Something went wrong. Check your details and try again.";
      setError(message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cr-auth-card-wrap cr-auth-card--enter">
      <div className="cr-auth-card">
        <header className="cr-auth-card-header">
          <h2 className="cr-auth-card-title font-serif">{copy.title}</h2>
          <p className="cr-auth-card-subtitle">{copy.subtitle}</p>
        </header>

        {mode !== "forgot" && (
          <>
            <SocialLoginButtons onProvider={handleOAuth} disabled={loading} />
            <div className="cr-auth-divider">
              <span>or</span>
            </div>
          </>
        )}

        <form className="cr-auth-form" onSubmit={handleSubmit}>
          <label className="cr-auth-field">
            <span className="cr-auth-label">Email</span>
            <div className="cr-auth-input-wrap">
              <Mail className="cr-auth-input-icon" strokeWidth={1.75} />
              <input
                type="email"
                autoComplete="email"
                required
                placeholder="you@domain.com"
                className="cr-auth-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </label>

          {mode !== "forgot" && (
            <label className="cr-auth-field">
              <span className="cr-auth-label">Password</span>
              <div className="cr-auth-input-wrap">
                <Lock className="cr-auth-input-icon" strokeWidth={1.75} />
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  required
                  placeholder="Enter your password"
                  className="cr-auth-input cr-auth-input--password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="cr-auth-password-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </label>
          )}

          {mode === "login" && (
            <div className="cr-auth-form-row">
              <label className="cr-auth-remember">
                <Checkbox
                  checked={remember}
                  onCheckedChange={(v) => setRemember(v === true)}
                  className="cr-auth-checkbox"
                />
                <span>Remember me</span>
              </label>
              <Link href="/forgot-password" className="cr-auth-link">
                Forgot password?
              </Link>
            </div>
          )}

          {error && <p className="cr-auth-error">{error}</p>}

          <button type="submit" className="cr-auth-submit" disabled={loading}>
            {loading ? "Please wait…" : copy.cta}
          </button>
        </form>

        <p className="cr-auth-card-footer">
          {copy.footerPrompt}{" "}
          <Link href={copy.footerHref} className="cr-auth-link">
            {copy.footerLink}
          </Link>
        </p>
      </div>

      <footer className="cr-auth-page-footer">
        <AudioWaveform className="cr-auth-footer-wave" strokeWidth={1.5} />
        <span>Music is better together.</span>
        <nav className="cr-auth-legal">
          <Link href="/about">Terms of Service</Link>
          <span aria-hidden>·</span>
          <Link href="/about">Privacy Policy</Link>
          <span aria-hidden>·</span>
          <Link href="/about">Contact</Link>
        </nav>
      </footer>
    </div>
  );
}
