import ForgotPasswordReset from "@/main-pages/auth/ForgotPasswordReset";
import { Suspense } from "react";

export default async function PasswordResetPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgotPasswordReset token={token} />
    </Suspense>
  );
}
