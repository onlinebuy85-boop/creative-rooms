import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginCard } from "@/components/auth/login-card";

export function SignupPage() {
  return (
    <AuthLayout>
      <LoginCard mode="signup" />
    </AuthLayout>
  );
}
