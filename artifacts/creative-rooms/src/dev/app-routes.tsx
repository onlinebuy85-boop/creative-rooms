import type { ComponentType } from "react";
import { Redirect, Route, Switch } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DashboardPage } from "@/pages/dashboard";
import { ProfileSetupPage } from "@/pages/profile-setup";
import { DiscoverPage } from "@/pages/discover";
import { NewRoomPage } from "@/pages/room-new";
import { RoomPage } from "@/pages/room-view";
import { RoomStudioPage } from "@/pages/room-studio";
import { ProfilePage } from "@/pages/profile";
import { EditProfilePage } from "@/pages/profile-edit";
import { HooksPage } from "@/pages/hooks";
import { RoomsPage } from "@/pages/rooms";
import { MessagesPage } from "@/pages/messages";
import { NotificationsPage } from "@/pages/notifications";
import { SettingsPage } from "@/pages/settings";
import { AboutPage } from "@/pages/about";
import { LoginPage } from "@/pages/login";
import { SignupPage } from "@/pages/signup";
import { ForgotPasswordPage } from "@/pages/forgot-password";
import { LandingPage } from "@/pages/index";
import NotFound from "@/pages/not-found";
import { AppLayout } from "@/components/layout/app-layout";

function DevGuestRoute({
  component: Component,
  hideLayout = false,
}: {
  component: ComponentType;
  hideLayout?: boolean;
}) {
  if (hideLayout) {
    return <Component />;
  }
  return (
    <AppLayout>
      <Component />
    </AppLayout>
  );
}

/** Routes with no Clerk, no profile gate — UI-only local dev */
export function DevAppRoutes() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Switch>
          <Route path="/" component={LandingPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/signup" component={SignupPage} />
          <Route path="/forgot-password" component={ForgotPasswordPage} />
          <Route path="/sign-in/*?">
            <Redirect to="/login" />
          </Route>
          <Route path="/sign-up/*?">
            <Redirect to="/signup" />
          </Route>
          <Route path="/profile/setup">
            <DevGuestRoute component={ProfileSetupPage} />
          </Route>
          <Route path="/dashboard">
            <DevGuestRoute component={DashboardPage} />
          </Route>
          <Route path="/discover">
            <DevGuestRoute component={DiscoverPage} />
          </Route>
          <Route path="/hooks">
            <DevGuestRoute component={HooksPage} />
          </Route>
          <Route path="/messages">
            <DevGuestRoute component={MessagesPage} />
          </Route>
          <Route path="/notifications">
            <DevGuestRoute component={NotificationsPage} />
          </Route>
          <Route path="/settings">
            <DevGuestRoute component={SettingsPage} />
          </Route>
          <Route path="/about" component={AboutPage} />
          <Route path="/rooms/new">
            <DevGuestRoute component={NewRoomPage} />
          </Route>
          <Route path="/rooms/demo">
            <RoomStudioPage />
          </Route>
          <Route path="/rooms">
            <DevGuestRoute component={RoomsPage} />
          </Route>
          <Route path="/rooms/:id">
            <DevGuestRoute component={RoomPage} hideLayout />
          </Route>
          <Route path="/profile/edit">
            <DevGuestRoute component={EditProfilePage} />
          </Route>
          <Route path="/profile/:id">
            <DevGuestRoute component={ProfilePage} />
          </Route>
          <Route path="/profile">
            <DevGuestRoute component={ProfilePage} />
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
  );
}
