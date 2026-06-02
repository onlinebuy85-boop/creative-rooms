import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginCard } from "@/components/auth/login-card";

export function LoginPage() {
  return (
    <AuthLayout>
      <LoginCard mode="login" />
    </AuthLayout>
  );
}
