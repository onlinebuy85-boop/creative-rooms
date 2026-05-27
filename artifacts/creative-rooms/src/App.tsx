import React, { useEffect } from "react";
import { Link, Redirect, Route, Router, Switch, useLocation } from "wouter";
import { ClerkProvider, SignIn, SignUp, Show, useClerk } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";

import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { LandingPage } from "@/pages/landing";
import { SignInPage } from "@/pages/sign-in";
import { SignUpPage } from "@/pages/sign-up";
import { DashboardPage } from "@/pages/dashboard";
import { ProfileSetupPage } from "@/pages/profile-setup";
import { DiscoverPage } from "@/pages/discover";
import { NewRoomPage } from "@/pages/room-new";
import { RoomPage } from "@/pages/room-view";
import { ProfilePage } from "@/pages/profile-view";
import { EditProfilePage } from "@/pages/profile-edit";
import { HooksPage } from "@/pages/hooks";
import { AboutPage } from "@/pages/about";
import NotFound from "@/pages/not-found";
import { AppLayout } from "@/components/layout/app-layout";
import { useGetMyProfile } from "@workspace/api-client-react";

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath) ? path.slice(basePath.length) || "/" : path;
}

if (!clerkPubKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in .env file');
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "hsl(30 65% 53%)", // Primary Amber
    colorForeground: "hsl(30 15% 90%)",
    colorMutedForeground: "hsl(30 10% 55%)",
    colorDanger: "hsl(0 60% 45%)",
    colorBackground: "hsl(20 15% 6%)", // Card background
    colorInput: "hsl(30 10% 12%)",
    colorInputForeground: "hsl(30 15% 90%)",
    colorNeutral: "hsl(30 10% 15%)", // Borders
    fontFamily: "'Inter', sans-serif",
    borderRadius: "0.25rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-card rounded-2xl w-[440px] max-w-full overflow-hidden border border-border shadow-2xl",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "text-foreground font-serif tracking-tight",
    headerSubtitle: "text-muted-foreground",
    socialButtonsBlockButtonText: "text-foreground",
    formFieldLabel: "text-foreground",
    footerActionLink: "text-primary hover:text-primary/80",
    footerActionText: "text-muted-foreground",
    dividerText: "text-muted-foreground",
    identityPreviewEditButton: "text-primary",
    formFieldSuccessText: "text-primary",
    alertText: "text-destructive",
    logoBox: "mb-4",
    logoImage: "w-10 h-10",
    socialButtonsBlockButton: "border-border hover:bg-muted/50",
    formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90 border-primary-border",
    formFieldInput: "bg-input border-border text-foreground focus:ring-primary focus:border-primary",
    footerAction: "border-t border-border bg-background/50",
    dividerLine: "bg-border",
    alert: "bg-destructive/10 border-destructive/20",
    otpCodeFieldInput: "bg-input border-border text-foreground focus:ring-primary focus:border-primary",
    formFieldRow: "mb-4",
    main: "p-8",
  },
};

function HomeRedirect() {
  return <LandingPage />;
}

function ProtectedRoute({ component: Component, hideLayout = false }: { component: React.ComponentType, hideLayout?: boolean }) {
  const { data: profile, isLoading } = useGetMyProfile();
  
  if (isLoading) return null;
  
  if (!profile) {
    return <Redirect to="/profile/setup" />;
  }

  if (hideLayout) {
    return <Component />;
  }

  return (
    <AppLayout>
      <Component />
    </AppLayout>
  );
}

function GuestRoute({ component: Component, hideLayout = false }: { component: React.ComponentType, hideLayout?: boolean }) {
  if (hideLayout) return <Component />;
  return (
    <AppLayout>
      <Component />
    </AppLayout>
  );
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const queryClient = useQueryClient();
  const prevUserIdRef = React.useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (
        prevUserIdRef.current !== undefined &&
        prevUserIdRef.current !== userId
      ) {
        queryClient.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, queryClient]);

  return null;
}

function App() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <TooltipProvider>
          <Switch>
            <Route path="/" component={HomeRedirect} />
            <Route path="/sign-in/*?" component={SignInPage} />
            <Route path="/sign-up/*?" component={SignUpPage} />
            
            <Route path="/profile/setup">
              <Show when="signed-in">
                <ProfileSetupPage />
              </Show>
              <Show when="signed-out">
                <Redirect to="/sign-in" />
              </Show>
            </Route>

            <Route path="/dashboard">
              <Show when="signed-in">
                <ProtectedRoute component={DashboardPage} />
              </Show>
              <Show when="signed-out">
                <Redirect to="/sign-in" />
              </Show>
            </Route>
            
            <Route path="/discover">
              <Show when="signed-in">
                <ProtectedRoute component={DiscoverPage} />
              </Show>
              <Show when="signed-out">
                <GuestRoute component={DiscoverPage} />
              </Show>
            </Route>

            <Route path="/hooks">
              <Show when="signed-in">
                <ProtectedRoute component={HooksPage} />
              </Show>
              <Show when="signed-out">
                <GuestRoute component={HooksPage} />
              </Show>
            </Route>

            <Route path="/about" component={AboutPage} />
            
            <Route path="/rooms/new">
              <Show when="signed-in">
                <ProtectedRoute component={NewRoomPage} />
              </Show>
              <Show when="signed-out">
                <Redirect to="/sign-in" />
              </Show>
            </Route>

            <Route path="/rooms/:id">
              <Show when="signed-in">
                <ProtectedRoute component={RoomPage} hideLayout />
              </Show>
              <Show when="signed-out">
                <GuestRoute component={RoomPage} hideLayout />
              </Show>
            </Route>
            
            <Route path="/profile/edit">
              <Show when="signed-in">
                <ProtectedRoute component={EditProfilePage} />
              </Show>
              <Show when="signed-out">
                <Redirect to="/sign-in" />
              </Show>
            </Route>
            
            <Route path="/profile/:id">
              <Show when="signed-in">
                <ProtectedRoute component={ProfilePage} />
              </Show>
              <Show when="signed-out">
                <Redirect to="/sign-in" />
              </Show>
            </Route>

            <Route>
              <AppLayout>
                <NotFound />
              </AppLayout>
            </Route>
          </Switch>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default function Root() {
  return (
    <Router base={basePath}>
      <App />
    </Router>
  );
}