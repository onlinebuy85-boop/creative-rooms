import type { ReactNode } from "react";

export const mockUser = {
  id: "guest",
  username: "Guest",
  firstName: "Guest",
  lastName: null,
  fullName: "Guest",
  imageUrl: "",
  primaryEmailAddress: null,
};

export function ClerkProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useUser() {
  return {
    isLoaded: true,
    isSignedIn: false as const,
    user: null,
  };
}

export function useClerk() {
  return {
    signOut: async () => {},
    addListener: () => () => {},
  };
}

/** Dev: treat as signed-out so guest UI paths render */
export function Show({
  when,
  children,
}: {
  when: "signed-in" | "signed-out";
  children: ReactNode;
}) {
  if (when === "signed-out") {
    return <>{children}</>;
  }
  return null;
}

export function SignIn() {
  return null;
}

export function SignUp() {
  return null;
}
