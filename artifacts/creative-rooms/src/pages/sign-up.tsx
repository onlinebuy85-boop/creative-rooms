import { Link } from "wouter";
import { SignUp } from "@clerk/react";
import logoImg from "../assets/images/creative-rooms-logo-v4.png";

export function SignUpPage() {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background relative overflow-hidden">
      <div className="bg-noise" />

      {/* Atmospheric background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 20% 30%, rgba(180,110,20,0.12) 0%, transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(100,60,140,0.08) 0%, transparent 50%)",
          }}
        />
      </div>

      {/* Logo header */}
      <div className="relative z-10 flex justify-center pt-10 pb-6">
        <Link href="/">
          <img
            src={logoImg}
            alt="Creative Room"
            style={{
              height: 80,
              width: "auto",
              objectFit: "contain",
              filter: "brightness(1.15) drop-shadow(0 0 14px rgba(212,163,65,0.4))",
              transition: "filter 0.3s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLImageElement).style.filter =
                "brightness(1.3) drop-shadow(0 0 24px rgba(212,163,65,0.65))";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLImageElement).style.filter =
                "brightness(1.15) drop-shadow(0 0 14px rgba(212,163,65,0.4))";
            }}
          />
        </Link>
      </div>

      {/* Clerk sign-up widget */}
      <div className="flex-1 flex items-center justify-center relative z-10 px-4 py-8">
        <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
      </div>
    </div>
  );
}
