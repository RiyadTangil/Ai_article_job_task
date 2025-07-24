import { AuthLayout } from "@/features/auth/components/AuthLayout"
import { RegisterForm } from "@/features/auth/components/RegisterForm"

export default function RegisterPage() {
  return (
    <AuthLayout title="Create Account" subtitle="Join thousands of knowledge workers" showBackButton>
      <RegisterForm />
    </AuthLayout>
  )
}
