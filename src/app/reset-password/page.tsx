
import ResetPasswordPage from "@/main-pages/auth/ResetPasswordPage";
import { Suspense } from "react";

export default function ResetPassword() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordPage />
        </Suspense>
    );
}

