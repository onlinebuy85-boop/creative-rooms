import { SignIn } from "@clerk/react";

export function SignInPage() {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background relative overflow-hidden">
      <div className="bg-noise" />
      <div className="absolute inset-0 z-0">
        <img 
          src="/assets/images/hero-bg.png" 
          alt="" 
          className="w-full h-full object-cover opacity-[0.10] mix-blend-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 to-background" />
      </div>

      <div className="flex-1 flex items-center justify-center relative z-10 px-4">
        <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
      </div>
    </div>
  );
}
