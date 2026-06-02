import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginCard } from "@/components/auth/login-card";

export function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <LoginCard mode="forgot" />
    </AuthLayout>
  );
}
